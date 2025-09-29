import { useState } from "react";
import ManagerHeader from "../components/Manager/ManagerHeader";
import ManagerSidebar from "../components/Manager/ManagerSidebar";
import StatsCards from "../components/Manager/StatsCards";
import Charts from "../components/Manager/Charts";
import TablesManagement from "../components/Manager/TablesManagement";
import AccountManagement from "../components/Manager/AccountManagement";
import DishRequestsManagement from "../components/Manager/DishRequestsManagement";
import TableDetailsModal from "../components/Manager/TableDetailsModal";
import EditAccountModal from "../components/Manager/EditAccountModal";
import {
  mockAccounts,
  mockDishes,
  mockTables,
  mockRevenueData,
  mockPopularDishes,
} from "../constants/managerData";
import { getDishRequests, updateDishRequest } from "../constants/dishRequestsData";

export default function Manager() {
  const [managerName] = useState("Manager User");
  const [activeSection, setActiveSection] = useState("overview");
  const [revenuePeriod, setRevenuePeriod] = useState("day");
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [isEditingDish, setIsEditingDish] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [accounts, setAccounts] = useState(mockAccounts);
  const [dishes, setDishes] = useState(mockDishes);
  const [tables, setTables] = useState(mockTables);
  const [dishRequests, setDishRequests] = useState(getDishRequests());

  // Calculate totals
  const totalRevenue = mockRevenueData.reduce(
    (sum, item) => sum + item.revenue,
    0,
  );
  const totalAccounts = accounts.length;
  const totalDishes = dishes.length;
  const totalTables = tables.length;

  const updateOrderStatus = (tableId, updatedOrder) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === tableId ? { ...table, currentOrder: updatedOrder } : table,
      ),
    );
  };

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

  const handleApproveRequest = (requestId) => {
    updateDishRequest(requestId, { status: 'approved' });
    setDishRequests(getDishRequests());
  };

  const handleRejectRequest = (requestId) => {
    updateDishRequest(requestId, { status: 'rejected' });
    setDishRequests(getDishRequests());
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <>
            <StatsCards
              totalRevenue={totalRevenue}
              totalAccounts={totalAccounts}
              totalDishes={totalDishes}
              totalTables={totalTables}
            />
            <Charts
              revenueData={mockRevenueData}
              popularDishes={mockPopularDishes}
              revenuePeriod={revenuePeriod}
              setRevenuePeriod={setRevenuePeriod}
            />
          </>
        );
      case "tables":
        return (
          <TablesManagement
            tables={tables}
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
            updateOrderStatus={updateOrderStatus}
          />
        );
      case "accounts":
        return (
          <AccountManagement
            accounts={accounts}
            setIsEditingAccount={setIsEditingAccount}
            setEditingItem={setEditingItem}
            deleteAccount={deleteAccount}
          />
        );
      case "dishes":
        return (
          <DishRequestsManagement 
            requests={dishRequests}
            onApproveRequest={handleApproveRequest}
            onRejectRequest={handleRejectRequest}
          />
        );
      case "invoices":
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <h3 className="text-xl font-bold text-neutral-900 mb-4">
              Quản Lý Hóa Đơn
            </h3>
            <p className="text-neutral-600">
              Chức năng quản lý hóa đơn sẽ được phát triển...
            </p>
          </div>
        );
      case "settings":
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <h3 className="text-xl font-bold text-neutral-900 mb-4">Cài Đặt</h3>
            <p className="text-neutral-600">
              Chức năng cài đặt sẽ được phát triển...
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-orange-50 to-red-50">
      <ManagerHeader managerName={managerName} />

      <div className="flex">
        <ManagerSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        <main className="flex-1 p-6">
          {/* Main Content Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Chào mừng trở lại, {managerName}!
            </h1>
            <p className="text-neutral-600 text-lg">
              Quản lý nhà hàng hiệu quả với dashboard thông minh
            </p>
            <div className="flex items-center gap-2 mt-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-600 font-medium">
                Hệ thống hoạt động tốt
              </span>
            </div>
          </div>

          {/* Dynamic Content */}
          {renderContent()}
        </main>
      </div>

      {/* Modals */}
      <TableDetailsModal
        selectedTable={selectedTable}
        setSelectedTable={setSelectedTable}
        updateOrderStatus={updateOrderStatus}
      />

      <EditAccountModal
        isEditingAccount={isEditingAccount}
        setIsEditingAccount={setIsEditingAccount}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        saveAccount={saveAccount}
      />
    </div>
  );
}
