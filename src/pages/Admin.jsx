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
// import SettingsSidebar from "../components/Admin/SettingsSidebar"; // << thêm component mới
import {
  mockAdminAccounts,
  mockAdminDishes,
  mockAdminInvoices,
  mockAdminRevenueData,
  mockAdminDishSalesData,
} from "../lib/adminData";

export default function Admin() {
  const [adminName] = useState("Admin User");
  const [activeSection, setActiveSection] = useState("overview");
  const [revenuePeriod, setRevenuePeriod] = useState("day");
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [isEditingDish, setIsEditingDish] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // mở/đóng Settings
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // state settings (có thể lưu localStorage)
  const [settings, setSettings] = useState({
    theme: "light",
    language: "vi",
    currency: "USD",
    emailNotif: true,
    pushNotif: false,
    compactSidebar: false,
    autoSave: true,
  });

  useEffect(() => {
    const raw = localStorage.getItem("admin_settings");
    if (raw) setSettings(JSON.parse(raw));
  }, []);
  useEffect(() => {
    localStorage.setItem("admin_settings", JSON.stringify(settings));
  }, [settings]);

  // Mock data
  const [accounts, setAccounts] = useState(mockAdminAccounts);
  const [dishes, setDishes] = useState(mockAdminDishes);
  const [invoices, setInvoices] = useState(mockAdminInvoices);

  // Calculate totals
  const totalRevenue = mockAdminRevenueData.reduce(
    (sum, item) => sum + item.revenue,
    0,
  );
  const totalAccounts = accounts.length;
  const totalDishes = dishes.length;
  const totalInvoices = invoices.length;

  const saveAccount = (accountData) => {
    if (accountData.id && accounts.find((acc) => acc.id === accountData.id)) {
      setAccounts((prevAccounts) =>
        prevAccounts.map((acc) =>
          acc.id === accountData.id ? accountData : acc,
        ),
      );
    } else {
      setAccounts((prevAccounts) => [...prevAccounts, accountData]);
    }
  };

  const deleteAccount = (accountId) => {
    setAccounts((prevAccounts) =>
      prevAccounts.filter((acc) => acc.id !== accountId),
    );
  };

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
            setIsEditingAccount={setIsEditingAccount}
            setEditingItem={setEditingItem}
            deleteAccount={deleteAccount}
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
        saveAccount={saveAccount}
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
