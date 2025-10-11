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
import {
  mockDishes,
  mockTables,
  mockRevenueData,
  mockPopularDishes,
} from "../lib/managerData";
import { getDishRequests, updateDishRequest } from "../lib/dishRequestsData";

import {
  updateStaff,
  deleteStaff,
  listNonAdmin,
  listStaff,
  normalizeStaff,
} from "../lib/apiStaff";

import { getCurrentUser, getToken, parseJWT } from "../lib/auth";
import { findStaffByUsername } from "../lib/apiStaff";
import ManagerEditAccountModal from "../components/Manager/EditAccountModal";

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
    const loadName = async () => {
      try {
        const user = getCurrentUser();
        let username = user?.username;
        if (!username) {
          const token = getToken();
          const decode = token ? parseJWT(token) : null;
          username = decode?.username || "";
        }
        if (!username) {
          setManagerName("Admin");
          return;
        }
        const profile = await findStaffByUsername(username);
        if (profile && profile.name) {
          setManagerName(profile.name);
        } else {
          setManagerName("Admin");
        }
      } catch (err) {
        console.error("Lỗi khi lấy tên người dùng:", err);
        setManagerName("Admin");
      }
    };
    loadName();
  });

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
        "Xóa thất bại.";
      alert(message);
    } finally {
      setDeletingIds((set) => {
        const next = new Set(set);
        next.delete(findStaffId);
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
            deletingIds={deletingIds}
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
      <ManagerEditAccountModal
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
