import { useState, useEffect } from "react";
import AdminSidebar from "../components/Admin/AdminSidebar";
import AdminStatsCards from "../components/Admin/AdminStatsCards";
import AdminInvoices from "../components/Admin/Invoices";
import AdminAccountManagement from "../components/Admin/AccountManagement";
import AdminEditAccountModal from "../components/Admin/EditAccountModal";
import { getRevenueSummary } from "../lib/apiStatistics";

import { updateStaff, deleteStaff, listStaffPaging } from "../lib/apiStaff";
import { getCurrentUser, getToken, parseJWT } from "../lib/auth";
import { listPaymentsPaging } from "../lib/apiPayment";
import AdminDishStatistics from "../components/Admin/AdminDishStatistics";
import { mockAdminRevenueData, mockAdminDishSalesData } from "../lib/adminData";

// ✅ Tránh lỗi nếu chưa có import normalizeStaff ở nơi khác
const normalizeStaff = (raw) => raw || {};

export default function Admin() {
  const [adminName, setAdminName] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const [revenuePeriod, setRevenuePeriod] = useState("day");
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingIds, setDeletingIds] = useState(new Set());
  const [settings, setSettings] = useState({
    theme: "light",
    language: "vi",
    currency: "USD",
    emailNotif: true,
    pushNotif: false,
    compactSidebar: false,
    autoSave: true,
  });

  // ==== ACCOUNT STATES ====
  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [accountsError, setAccountsError] = useState("");
  const [page, setPage] = useState(1);
  const [size] = useState(6);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    size: 6,
    totalPages: 1,
    totalElements: 0,
  });

  // ==== INVOICE STATES ====
  const [invoices, setInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [invoiceError, setInvoiceError] = useState("");
  const [invPage, setInvPage] = useState(1);
  const [invSize] = useState(6);
  const [invPageInfo, setInvPageInfo] = useState({
    page: 1,
    size: 6,
    totalPages: 1,
    totalElements: 0,
  });

  // ==== STATS STATES (CHO CARD) ====
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);
  const [cashRevenueToday, setCashRevenueToday] = useState(0); // ✅ mới
  const [bankRevenueToday, setBankRevenueToday] = useState(0); // ✅ mới

  // ==== ADMIN NAME ====
  useEffect(() => {
    const loadName = async () => {
      try {
        const cached = getCurrentUser();
        const cachedName = cached?.fullName;
        if (cachedName) {
          setAdminName(cachedName);
          return;
        }
        let username = cached?.username;
        if (!username) {
          const token = getToken();
          const d = token ? parseJWT(token) : null;
          username = d?.username || "";
        }
        if (!username) {
          setAdminName("Admin");
          return;
        }
        // const profile = await findStaffByUsername(username);
        // setAdminName(profile?.name || "Admin");
        setAdminName(cached?.fullName || "Admin"); // Fallback
      } catch {
        setAdminName("Admin");
      }
    };
    loadName();
  }, []);

  // ==== RESET PAGE KHI ĐỔI TAB ====
  useEffect(() => {
    if (activeSection === "accounts") setPage(1);
    if (activeSection === "invoices") setInvPage(1);
  }, [activeSection]);

  // ==== LOAD ACCOUNTS ====
  useEffect(() => {
    if (activeSection !== "accounts") return;
    let cancelled = false;

    (async () => {
      setLoadingAccounts(true);
      setAccountsError("");
      try {
        const { items, pageInfo } = await listStaffPaging({ page, size });
        if (!cancelled) {
          setAccounts(items);
          setPageInfo(pageInfo);
        }
      } catch (err) {
        if (!cancelled)
          setAccountsError(
            err?.message || "Không tải được danh sách nhân viên."
          );
      } finally {
        if (!cancelled) setLoadingAccounts(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeSection, page, size]);

  // ==== LOAD INVOICES (CÓ PHÂN TRANG) ====
  useEffect(() => {
    if (activeSection !== "invoices") return;
    let cancelled = false;

    (async () => {
      setLoadingInvoices(true);
      setInvoiceError("");
      try {
        const { items, pageInfo } = await listPaymentsPaging({
          page: invPage - 1, // backend 0-based
          size: invSize,
        });
        if (!cancelled) {
          setInvoices(items || []);
          setInvPageInfo(
            pageInfo || {
              page: invPage,
              size: invSize,
              totalPages: 1,
              totalElements: items?.length || 0,
            }
          );
        }
      } catch (e) {
        if (!cancelled)
          setInvoiceError(e?.message || "Không tải được hóa đơn.");
      } finally {
        if (!cancelled) setLoadingInvoices(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeSection, invPage, invSize]);

  // ==== ACCOUNT ACTIONS ====
  const refetchAccounts = async (toPage = page) => {
    setLoadingAccounts(true);
    try {
      const { items, pageInfo } = await listStaffPaging({ page: toPage, size });
      setAccounts(items);
      setPageInfo(pageInfo);
    } finally {
      setLoadingAccounts(false);
    }
  };

  const updateAccount = async (data) => {
    const staffId = data?.staffId ?? data?.id;
    if (!staffId) return;

    const payload = [
      "fullName",
      "email",
      "phone",
      "dob",
      "role",
      "password",
    ].reduce((object, key) => {
      let value = data[key];
      if (value === "" || value === undefined || value === null) return object;
      if (key === "role") value = String(value).toUpperCase();
      object[key] = value;
      return object;
    }, {});

    try {
      const response = await updateStaff(staffId, payload);
      const updated = normalizeStaff(response?.result ?? response);
      setAccounts((prev) =>
        prev.map((arr) => (arr.id === staffId ? { ...arr, ...updated } : arr))
      );
    } catch (err) {
      const data = err?.response?.data || err?.data || {};
      const list = data?.result || data?.errors || data?.fieldErrors || [];
      const message =
        (Array.isArray(list) &&
          list
            .map((arrs) => arrs?.defaultMessage || arrs?.message)
            .filter(Boolean)
            .join(" | ")) ||
        data?.message ||
        err.message ||
        "Cập nhật thất bại.";
      alert(message);
      throw err;
    }
  };

  const deleteAccount = async (staffId) => {
    if (!staffId) return;
    const targetDelete = accounts.find(
      (arr) => Number(arr.staffId) === Number(staffId)
    );
    if (!targetDelete) return;
    const me = getCurrentUser() || {};
    const meUsername = String(me.username || "").toLowerCase();
    const isSelf =
      String(targetDelete.username || "").toLowerCase() === meUsername ||
      Number(targetDelete.accountId) === Number(me.accountId) ||
      Number(targetDelete.staffId) === Number(me.staffId || me.id);
    if (isSelf) {
      alert("Không thể xoá tài khoản đang đăng nhập.");
      return;
    }
    const findStaffId = Number(targetDelete.staffId);
    if (!findStaffId) {
      alert("Không tìm thấy StaffId để thực hiện tác vụ.");
      return;
    }
    const prev = accounts;
    setDeletingIds((set) => new Set(set).add(findStaffId));
    setAccounts((cur) => cur.filter((acc) => Number(acc.id) !== findStaffId));
    try {
      await deleteStaff(findStaffId);
      const remaining = accounts.length - 1;
      if (remaining <= 0 && page > 1) setPage((p) => p - 1);
      else await refetchAccounts(page);
    } catch (err) {
      setAccounts(prev);
      const data = err?.response?.data || err?.data || {};
      const list = data?.result || data?.errors || data?.fieldErrors || [];
      const message =
        (Array.isArray(list) &&
          list
            .map((it) => it?.defaultMessage || it?.message)
            .filter(Boolean)
            .join(" | ")) ||
        data?.message ||
        err?.message ||
        "Xoá thất bại.";
      alert(message);
    } finally {
      setDeletingIds((set) => {
        const next = new Set(set);
        next.delete(findStaffId);
        return next;
      });
    }
  };

  // 🧾 Lấy stats cho Card (Doanh thu, Tổng TK, Tổng HĐ)
  useEffect(() => {
    if (activeSection !== "overview") return;

    const fetchOverviewStats = async () => {
      setStatsLoading(true);
      try {
        const now = new Date();
        const revenueParams = {
          day: now.getDate(),
          month: now.getMonth() + 1,
          year: now.getFullYear(),
        };

        const [revenueRes, accountInfo, invoiceInfo] = await Promise.all([
          getRevenueSummary(revenueParams),
          listStaffPaging({ page: 1, size: 1 }),
          listPaymentsPaging({ page: 0, size: 1 }),
        ]);

        // ✅ Map linh hoạt theo field backend
        const cash = Number(
          revenueRes?.cashRevenueToday ??
            revenueRes?.cash ??
            revenueRes?.cashToday ??
            0
        );
        const bank = Number(
          revenueRes?.bankRevenueToday ??
            revenueRes?.bank ??
            revenueRes?.bankToday ??
            0
        );
        const total = Number(
          revenueRes?.totalRevenue != null
            ? revenueRes.totalRevenue
            : cash + bank
        );

        setCashRevenueToday(cash);
        setBankRevenueToday(bank);
        setTotalRevenue(total);

        if (accountInfo?.pageInfo) setPageInfo(accountInfo.pageInfo);
        if (invoiceInfo?.pageInfo) setInvPageInfo(invoiceInfo.pageInfo);
      } catch (err) {
        console.error("❌ Lỗi tải dữ liệu thống kê overview:", err);
        setCashRevenueToday(0);
        setBankRevenueToday(0);
        setTotalRevenue(0);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchOverviewStats();

    const timer = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() < 5) {
        fetchOverviewStats();
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [activeSection]);

  const totalAccounts = pageInfo.totalElements;
  const totalInvoices = invPageInfo.totalElements;

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <>
            <AdminStatsCards
              loading={statsLoading} // ✅ dùng đúng biến
              totalRevenue={totalRevenue} // ✅ tổng từ API/fallback
              cashRevenueToday={cashRevenueToday} // ✅ mới
              bankRevenueToday={bankRevenueToday} // ✅ mới
              totalAccounts={totalAccounts}
              totalInvoices={totalInvoices}
            />
            <AdminDishStatistics />
          </>
        );

      case "accounts":
        return (
          <AdminAccountManagement
            accounts={accounts}
            setAccounts={setAccounts}
            setIsEditingAccount={setIsEditingAccount}
            setEditingItem={setEditingItem}
            deleteAccount={deleteAccount}
            loading={loadingAccounts}
            deletingIds={deletingIds}
            page={page}
            pageInfo={pageInfo}
            onPageChange={setPage}
            currentUser={getCurrentUser()}
          />
        );

      case "invoices":
        if (loadingInvoices)
          return <div className="p-6 text-white">Đang tải hóa đơn…</div>;
        if (invoiceError)
          return <div className="p-6 text-red-400">{invoiceError}</div>;
        return (
          <AdminInvoices
            invoices={invoices}
            pageInfo={invPageInfo}
            onPageChange={setInvPage}
            page={invPage}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900">
      <div className="flex">
        <AdminSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          compact={settings.compactSidebar}
        />

        <main className="flex-1 p-8 md:p-10">
          <div className="mb-10 animate-fade-in-up">
            <h1 className="text-4xl font-extrabold text-white shadow-text-lg mb-2">
              Chào mừng trở lại, {adminName}!
            </h1>
            <p className="text-xl text-indigo-300">
              Quản lý hệ thống nhà hàng hiệu quả với dashboard thông minh
            </p>
          </div>

          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "100ms" }}
          >
            {renderContent()}
          </div>
        </main>
      </div>

      <AdminEditAccountModal
        isEditingAccount={isEditingAccount}
        setIsEditingAccount={setIsEditingAccount}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        saveAccount={updateAccount}
        setDeletingIds={deletingIds}
        accounts={accounts}
      />
    </div>
  );
}
