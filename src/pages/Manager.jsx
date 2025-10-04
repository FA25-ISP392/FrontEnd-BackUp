import { useState, useEffect } from "react";
import ManagerHeader from "../components/Manager/ManagerHeader";
import ManagerSidebar from "../components/Manager/ManagerSidebar";
import StatsCards from "../components/Manager/StatsCards";
import Charts from "../components/Manager/Charts";
import TablesManagement from "../components/Manager/TablesManagement";
import AccountManagement from "../components/Manager/AccountManagement";
import DishRequestsManagement from "../components/Manager/DishRequestsManagement";
import ManagerInvoicesToday from "../components/Manager/InvoicesToday";
import DishesStockVisibility from "../components/Manager/DishesStockVisibility";
import TableDetailsModal from "../components/Manager/TableDetailsModal";
import EditAccountModal from "../components/Manager/EditAccountModal";
import {
  mockAccounts,
  mockDishes,
  mockTables,
  mockRevenueData,
  mockPopularDishes,
} from "../lib/managerData";
import { getDishRequests, updateDishRequest } from "../lib/dishRequestsData";

import { updateStaff, deleteStaff, listNonAdmin } from "../lib/apiStaff";
import { getCurrentUser } from "../lib/auth";

export default function Manager() {
  const [managerName, setManagerName] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const [revenuePeriod, setRevenuePeriod] = useState("day");
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [isEditingDish, setIsEditingDish] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [dishes, setDishes] = useState(mockDishes);
  const [tables, setTables] = useState(mockTables);
  const [dishRequests, setDishRequests] = useState(getDishRequests());
  const [deletingIds, setDeletingIds] = useState(new Set());

  //========================= CRUD USER STAFF ======================//
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
    setManagerName(name || "Manager");
  }, []);

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
        const res = await listNonAdmin();
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
            : acc
        )
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
  //============================================================================//

  // Calculate totals
  const totalRevenue = mockRevenueData.reduce(
    (sum, item) => sum + item.revenue,
    0
  );
  const totalAccounts = accounts.length;
  const totalDishes = dishes.length;
  const totalTables = tables.length;

  const updateOrderStatus = (tableId, updatedOrder) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === tableId ? { ...table, currentOrder: updatedOrder } : table
      )
    );
  };

  const handleApproveRequest = (requestId) => {
    updateDishRequest(requestId, { status: "approved" });
    setDishRequests(getDishRequests());
  };

  const handleRejectRequest = (requestId) => {
    updateDishRequest(requestId, { status: "rejected" });
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
            setAccounts={setAccounts}
            setIsEditingAccount={setIsEditingAccount}
            setEditingItem={setEditingItem}
            deleteAccount={deleteAccount}
            loading={loadingAccounts}
          />
        );
      case "dishes":
        return (
          <div className="space-y-6">
            <DishRequestsManagement
              requests={dishRequests}
              onApproveRequest={handleApproveRequest}
              onRejectRequest={handleRejectRequest}
            />
            <DishesStockVisibility dishes={dishes} />
          </div>
        );
      case "invoices":
        return (
          <ManagerInvoicesToday
            invoices={mockRevenueData.map((r, i) => ({
              id: i + 1,
              table: (i % 10) + 1,
              amount: Math.round(r.revenue * 1.1),
              time: "--:--",
              date: new Date().toISOString().slice(0, 10),
              paymentMethod: i % 2 ? "Card" : "Cash",
            }))}
          />
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
