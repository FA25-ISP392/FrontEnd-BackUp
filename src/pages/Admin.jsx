import { useState, useEffect } from "react";
import AdminSidebar from "../components/Admin/AdminSidebar";
import AdminStatsCards from "../components/Admin/AdminStatsCards";
import AdminCharts from "../components/Admin/AdminCharts";
import AdminInvoices from "../components/Admin/Invoices";
import AdminAccountManagement from "../components/Admin/AccountManagement";
import AdminEditAccountModal from "../components/Admin/EditAccountModal";
import AdminDishesManagement from "../components/Admin/DishesManagement";
import AdminEditDishModal from "../components/Admin/EditDishModal";

import {
  mockAdminInvoices,
  mockAdminRevenueData,
  mockAdminDishSalesData,
} from "../lib/adminData";

import { listStaff, updateStaff, deleteStaff } from "../lib/apiStaff";
import { listDish, normalizeDish } from "../lib/apiDish";
import { getCurrentUser } from "../lib/auth";

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
    const u = getCurrentUser();
    const name = u?.staff_name || u?.staffName || u?.fullName;
    setAdminName(name || "Admin");
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem("admin_settings");
    if (raw) setSettings(JSON.parse(raw));
  }, []);
  useEffect(() => {
    localStorage.setItem("admin_settings", JSON.stringify(settings));
  }, [settings]);

  // Mock data
  // const [accounts, setAccounts] = useState(mockAdminAccounts);
  const [invoices, setInvoices] = useState(mockAdminInvoices);

  //Call API data real
  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [accountsError, setAccountsError] = useState("");

  const [dishes, setDishes] = useState([]);
  const [loadingDishes, setLoadingDishes] = useState(false);
  const [dishesError, setDishesError] = useState("");

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

  //Map ra list món ăn
  useEffect(() => {
    if (activeSection !== "dishes") return;
    let cancelled = false;

    (async () => {
      setLoadingDishes(true);
      setDishesError("");
      try {
        const list = await listDish();
        if (!cancelled) {
          setDishes(list);
        }
      } catch (e) {
        if (!cancelled)
          setDishesError(e.message || "Không tải được danh sách món ăn.");
      } finally {
        if (!cancelled) setLoadingDishes(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeSection]);

  //Cập nhật nhân sự
  const saveAccount = async (accountData) => {
    if (!accountData?.id) return;

    const payload = {
      staffName: accountData.name?.trim(),
      staffEmail: accountData.email?.trim(),
      ...(accountData.phone
        ? { staffPhone: String(accountData.phone).trim() }
        : {}),
      ...(accountData.role
        ? { role: String(accountData.role).toUpperCase() }
        : {}),
      ...(accountData.password ? { password: accountData.password } : {}),
    };

    try {
      console.log("[UPDATE] id:", accountData.id, "payload:", payload);
      const updated = await updateStaff(accountData.id, payload);

      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === accountData.id
            ? {
                ...acc,
                name: updated?.staffName ?? payload.staffName,
                email: updated?.staffEmail ?? payload.staffEmail,
                phone: updated?.staffPhone ?? payload.staffPhone,
                role: updated?.role ?? payload.role,
              }
            : acc,
        ),
      );
    } catch (e) {
      alert(e.message || "Cập nhật thất bại.");
    }
  };

  const deleteAccount = async (accountId) => {
    if (!accountId) return;

    const prev = accounts;
    setDeletingIds((s) => new Set(s).add(accountId));
    setAccounts((curr) => curr.filter((acc) => acc.id !== accountId));

    try {
      await deleteStaff(accountId);
    } catch (e) {
      setAccounts(prev);
      alert(e.message || "Xoá thất bại.");
    } finally {
      setDeletingIds((s) => {
        const next = new Set(s);
        next.delete(accountId);
        return next;
      });
    }
  };
  //====================================================================//

  // Calculate totals
  const totalRevenue = mockAdminRevenueData.reduce(
    (sum, item) => sum + item.revenue,
    0,
  );
  const totalAccounts = accounts.length;
  const totalDishes = dishes.length;
  const totalInvoices = invoices.length;

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
          />
        );
      case "dishes":
        return (
          <AdminDishesManagement
            dishes={dishes}
            setDishes={setDishes}
            setIsEditingDish={setIsEditingDish}
            setEditingItem={setEditingItem}
            loading={loadingDishes}
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
        saveAccount={saveAccount}
        setDeletingIds={deletingIds}
      />
      <AdminEditDishModal
        isEditingDish={isEditingDish}
        setIsEditingDish={setIsEditingDish}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        saveDish={(updatedDish) => {
          if (updatedDish) {
            setDishes((prev) =>
              prev.map((dish) =>
                dish.id === updatedDish.id ? updatedDish : dish,
              ),
            );
          }
        }}
      />
    </div>
  );
}
