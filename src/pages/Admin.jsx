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
  mockAdminDishes,
  mockAdminInvoices,
  mockAdminRevenueData,
  mockAdminDishSalesData,
} from "../lib/adminData";

import { listStaff, updateStaff, deleteStaff } from "../lib/apiStaff";
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
    const name =
      u?.staff_name ||
      u?.staffName ||
      u?.fullName ||
      u?.name ||
      u?.displayName ||
      u?.username;
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
        const res = await listStaff();
        const arr = Array.isArray(res) ? res : res?.item || [];
        const mapped = arr.map((s) => ({
          id: s.staffId ?? s.id, //Dùng ID để cập nhật dữ liệu
          name: s.staffName ?? s.username ?? "",
          email: s.staffEmail ?? s.email ?? "",
          phone: s.staffPhone ?? s.phone ?? "",
          role: (s.role ?? "").toString().toLowerCase(),
          status: s.status ?? "active",
        }));
        if (!cancelled) setAccounts(mapped);
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
  const saveAccount = async (accountData) => {
    // console.log("[EDIT FORM] ccountData:", accountData);

    if (!accountData?.id) return;
    //Gửi lại chuẩn API Payload cho BackEnd
    const payload = {
      staffName: accountData.name,
      staffEmail: accountData.email,
      // thêm password nếu có
      ...(accountData.password ? { password: accountData.password } : {}),
      staffPhone: accountData.phone,
      role: (accountData.role || "").toUpperCase(),
    };

    console.log("[SAVE] payload:", payload);

    try {
      const updatedStaff = await updateStaff(accountData.id, payload);
      //Cập nhật lại list theo call fallback gửi về

      // console.log("[SAVE] response:", updatedStaff);

      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === accountData.id
            ? {
                ...acc,
                name: updatedStaff?.staffName ?? payload.staffName,
                email: updatedStaff?.staffEmail ?? payload.staffEmail,
                phone: updatedStaff?.staffPhone ?? payload.staffPhone,
                role: (updatedStaff?.role ?? payload.role).toLowerCase(),
              }
            : acc,
        ),
      );
    } catch (e) {
      alert(e.message || "Cập nhật thất bại.");
    }
  };

  const deleteAccount = async (accountId) => {
    if (!accountId) return; // xác nhận đã làm ở UI con rồi

    // Optimistic UI: xoá tạm trên UI, nếu lỗi thì rollback
    const prev = accounts;
    setDeletingIds((s) => new Set(s).add(accountId));
    setAccounts((curr) => curr.filter((acc) => acc.id !== accountId));

    try {
      await deleteStaff(accountId); // gọi API DELETE /staff/{id}
      // nếu BE trả 204 thì handle() đã trả null — không cần làm gì thêm
    } catch (e) {
      // rollback nếu thất bại
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

  const saveDish = (dishData) => {
    if (dishData.id && dishes.find((dish) => dish.id === dishData.id)) {
      setDishes((prevDishes) =>
        prevDishes.map((dish) => (dish.id === dishData.id ? dishData : dish)),
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
        saveDish={saveDish}
      />
    </div>
  );
}
