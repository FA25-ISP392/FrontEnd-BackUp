import { useState, useEffect } from "react";
import AdminHeader from "../components/Admin/AdminHeader";
import AdminSidebar from "../components/Admin/AdminSidebar";
import AdminStatsCards from "../components/Admin/AdminStatsCards";
import AdminCharts from "../components/Admin/AdminCharts";
import AdminInvoices from "../components/Admin/Invoices";
import AdminAccountManagement from "../components/Admin/AccountManagement";
import AdminEditAccountModal from "../components/Admin/EditAccountModal";
import AdminDishesManagement from "../components/Admin/DishesManagement";
import AdminEditDishModal from "../components/Admin/EditDishModal";

import {
  mockAdminDishes,
  mockAdminInvoices,
  mockAdminRevenueData,
  mockAdminDishSalesData,
} from "../lib/adminData";

import { listStaff, updateStaff, deleteStaff } from "../lib/apiStaff";
import { getCurrentUser, getToken, parseJWT } from "../lib/auth";
import { findStaffByUsername, normalizeStaff } from "../lib/apiStaff";

export default function Admin() {
  const [adminName, setAdminName] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const [revenuePeriod, setRevenuePeriod] = useState("day");
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [isEditingDish, setIsEditingDish] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingIds, setDeletingIds] = useState(new Set());

  // mở/đóng Settings
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // state settings (có thể lưu localStorage)
  const [settings, setSettings] = useState({
    theme: "light ",
    language: "vi",
    currency: "USD",
    emailNotif: true,
    pushNotif: false,
    compactSidebar: false,
    autoSave: true,
  });

  //========================= CRUD USER STAFF =========================//
  //lấy tên để welcome
  useEffect(() => {
    const loadName = async () => {
      try {
        const user = getCurrentUser();
        let username = user?.username;
        if (!username) {
          const token = getToken();
          const decoded = token ? parseJWT(token) : null;
          username = decoded?.username || "";
        }
        if (!username) {
          setAdminName("Admin");
          return;
        }
        const profile = await findStaffByUsername(username);
        if (profile && profile.name) {
          setAdminName(profile.name);
        } else {
          setAdminName("Admin");
        }
      } catch (err) {
        console.error("Lỗi khi lấy tên người dùng:", err);
        setAdminName("Admin");
      }
    };
    loadName();
  }, []);

  // Mock data
  // const [accounts, setAccounts] = useState(mockAdminAccounts);
  const [dishes, setDishes] = useState(mockAdminDishes);
  const [invoices, setInvoices] = useState(mockAdminInvoices);

  //Call API data real
  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [accountsError, setAccountsError] = useState("");

  //Map ra list nhân viên nhà hàng
  useEffect(() => {
    if (activeSection !== "accounts") return;
    let cancelled = false;

    (async () => {
      setLoadingAccounts(true);
      setAccountsError("");
      try {
        const list = await listStaff();
        if (!cancelled) {
          setAccounts(list);
        }
      } catch (e) {
        if (!cancelled)
          setAccountsError(e.message || "Không tải được danh sách nhân viên.");
      } finally {
        if (!cancelled) setLoadingAccounts(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeSection]);

  //Cập nhật nhân sự
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

    const findStaffId = Number(targetDelete.staffId);
    if (!findStaffId) {
      alert("Không tìm thấy StaffId để thực hiện tác vụ.");
      return;
    }

    const prev = accounts;
    setDeletingIds((set) => new Set(set).add(findStaffId));
    setAccounts((cur) =>
      cur.filter((acc) => Number(acc.id) !== Number(findStaffId))
    );
    try {
      await deleteStaff(findStaffId);
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

  //====================================================================//

  // Calculate totals
  const totalRevenue = mockAdminRevenueData.reduce(
    (sum, item) => sum + item.revenue,
    0
  );
  const totalAccounts = accounts.length;
  const totalDishes = dishes.length;
  const totalInvoices = invoices.length;

  const saveDish = (dishData) => {
    if (dishData.id && dishes.find((dish) => dish.id === dishData.id)) {
      setDishes((prevDishes) =>
        prevDishes.map((dish) => (dish.id === dishData.id ? dishData : dish))
      );
    } else {
      setDishes((prevDishes) => [...prevDishes, dishData]);
    }
  };

  const deleteDish = (dishId) => {
    setDishes((prevDishes) => prevDishes.filter((dish) => dish.id !== dishId));
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <>
            <AdminStatsCards
              totalRevenue={totalRevenue}
              totalAccounts={totalAccounts}
              totalDishes={totalDishes}
              totalInvoices={totalInvoices}
            />
            <AdminCharts
              revenueData={mockAdminRevenueData}
              dishSalesData={mockAdminDishSalesData}
              revenuePeriod={revenuePeriod}
              setRevenuePeriod={setRevenuePeriod}
            />
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
          />
        );
      case "dishes":
        return (
          <AdminDishesManagement
            dishes={dishes}
            setIsEditingDish={setIsEditingDish}
            setEditingItem={setEditingItem}
            deleteDish={deleteDish}
          />
        );
      case "invoices":
        return <AdminInvoices invoices={invoices} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-blue-50 to-purple-50">
      <AdminHeader
        adminName={adminName}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <div className="flex">
        <AdminSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          compact={settings.compactSidebar}
        />

        <main className="flex-1 p-6">
          {/* Main Content Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Chào mừng trở lại, {adminName}!
            </h1>
            <p className="text-neutral-600 text-lg">
              Quản lý hệ thống nhà hàng hiệu quả với dashboard thông minh
            </p>
          </div>

          {/* Dynamic Content */}
          {renderContent()}
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
      <AdminEditDishModal
        isEditingDish={isEditingDish}
        setIsEditingDish={setIsEditingDish}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        saveDish={saveDish}
      />
    </div>
  );
}
