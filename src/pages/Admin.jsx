// src/pages/Admin.jsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
// const normalizeStaff tạm
const normalizeStaff = (raw) => raw || {};

function resolveSectionFromPath(pathname = "") {
  if (pathname.includes("/admin/hoadon")) return "invoices";
  if (pathname.includes("/admin/taikhoan")) return "accounts";
  return "overview"; // /admin/tongquan (hoặc fallback)
}

export default function Admin() {
  const location = useLocation();

  // ===== STATE CHÍNH =====
  const [adminName, setAdminName] = useState("");
  const [activeSection, setActiveSection] = useState(
    resolveSectionFromPath(location.pathname)
  );
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

  // ===== ACCOUNT =====
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

  // ===== INVOICES =====
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

  // ===== STATS =====
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);
  const [cashRevenueToday, setCashRevenueToday] = useState(0);
  const [bankRevenueToday, setBankRevenueToday] = useState(0);

  // ===== Cập nhật activeSection khi URL đổi =====
  useEffect(() => {
    setActiveSection(resolveSectionFromPath(location.pathname));
  }, [location.pathname]);

  // ===== ADMIN NAME =====
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
        setAdminName(cached?.fullName || username || "Admin");
      } catch {
        setAdminName("Admin");
      }
    };
    loadName();
  }, []);

  // ===== RESET PAGE KHI ĐỔI TAB =====
  useEffect(() => {
    if (activeSection === "accounts") setPage(1);
    if (activeSection === "invoices") setInvPage(1);
  }, [activeSection]);

  // ===== LOAD ACCOUNTS =====
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

  // ===== LOAD INVOICES =====
  useEffect(() => {
    if (activeSection !== "invoices") return;
    let cancelled = false;
    (async () => {
      setLoadingInvoices(true);
      setInvoiceError("");
      try {
        const { items, pageInfo } = await listPaymentsPaging({
          page: invPage - 1,
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

  // ===== ACTIONS ACCOUNT =====
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
    ].reduce((o, k) => {
      let v = data[k];
      if (v === "" || v == null) return o;
      if (k === "role") v = String(v).toUpperCase();
      o[k] = v;
      return o;
    }, {});
    try {
      const response = await updateStaff(staffId, payload);
      const updated = normalizeStaff(response?.result ?? response);
      setAccounts((prev) =>
        prev.map((a) => (a.id === staffId ? { ...a, ...updated } : a))
      );
    } catch (err) {
      const data = err?.response?.data || err?.data || {};
      const list = data?.result || data?.errors || data?.fieldErrors || [];
      const message =
        (Array.isArray(list) &&
          list
            .map((x) => x?.defaultMessage || x?.message)
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
    const target = accounts.find((a) => Number(a.staffId) === Number(staffId));
    if (!target) return;
    const me = getCurrentUser() || {};
    const meUsername = String(me.username || "").toLowerCase();
    const isSelf =
      String(target.username || "").toLowerCase() === meUsername ||
      Number(target.accountId) === Number(me.accountId) ||
      Number(target.staffId) === Number(me.staffId || me.id);
    if (isSelf) {
      alert("Không thể xoá tài khoản đang đăng nhập.");
      return;
    }
    const findStaffId = Number(target.staffId);
    if (!findStaffId) {
      alert("Không tìm thấy StaffId để thực hiện tác vụ.");
      return;
    }

    const prev = accounts;
    setDeletingIds((s) => new Set(s).add(findStaffId));
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
      setDeletingIds((s) => {
        const n = new Set(s);
        n.delete(findStaffId);
        return n;
      });
    }
  };

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
          getRevenueSummary(revenueParams), //
          listStaffPaging({ page: 1, size: 1 }),
          listPaymentsPaging({ page: 0, size: 1 }),
        ]);
        const total = Number(revenueRes?.grandTotalRevenue ?? 0);
        const methodsList = Array.isArray(revenueRes?.revenueByMethod)
          ? revenueRes.revenueByMethod
          : [];
        const cashItem = methodsList.find((m) => m.method === "CASH");
        const cash = Number(cashItem?.totalRevenue ?? 0);
        const bankItem = methodsList.find((m) => m.method === "BANK_TRANSFER");
        const bank = Number(bankItem?.totalRevenue ?? 0);
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
      if (now.getHours() === 0 && now.getMinutes() < 5) fetchOverviewStats();
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
              loading={statsLoading}
              totalRevenue={totalRevenue}
              cashRevenueToday={cashRevenueToday}
              bankRevenueToday={bankRevenueToday}
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
        <AdminSidebar />
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
