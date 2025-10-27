import { useState, useEffect } from "react";
import ManagerSidebar from "../components/Manager/ManagerSidebar";
import StatsCards from "../components/Manager/StatsCards";
import Charts from "../components/Manager/Charts";
import TablesManagement from "../components/Manager/TablesManagement";
import ManagerInvoicesToday from "../components/Manager/InvoicesToday";
import TableDetailsModal from "../components/Manager/TableDetailsModal";
import EditToppingModal from "../components/Manager/Topping/EditToppingModal";
import ToppingsManagement from "../components/Manager/Topping/ToppingManagement";
import ManagerDishPage from "../components/Manager/Dish/ManagerDishPage";

// ✅ Sử dụng 2 file mới, gộp món + topping
import ManagerDailyPlanPage from "../components/Manager/ManagerDailyPlanPage";
import ManagerDailyMenuPage from "../components/Manager/ManagerDailyMenuPage";

import {
  mockTables,
  mockRevenueData,
  mockPopularDishes,
} from "../lib/managerData";
import {
  listBookingsPaging,
  rejectBooking,
  updateBooking,
  approveBookingWithTable,
} from "../lib/apiBooking";
import { getCurrentUser, getToken, parseJWT } from "../lib/auth";
import BookingEditModal from "../components/Manager/BookingEditModal";
import { findStaffByUsername } from "../lib/apiStaff";
import BookingManagement from "../components/Manager/BookingManagement";
import TableLayout from "../components/Manager/TableLayout";
import { listTables } from "../lib/apiTable";

export default function Manager() {
  // 🧩 State chung
  const [managerName, setManagerName] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const [revenuePeriod, setRevenuePeriod] = useState("day");

  // 🧩 State tài khoản nhân viên
  const [deletingIds, setDeletingIds] = useState(new Set());

  // 🧩 State bàn ăn
  const [selectedTable, setSelectedTable] = useState(null);
  const [tables, setTables] = useState([]);

  // 🧩 State booking
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingsError, setBookingsError] = useState("");
  const [isEditingBooking, setIsEditingBooking] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [savingBooking, setSavingBooking] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");

  // 🧩 State topping
  const [toppings, setToppings] = useState([]);
  const [isEditingTopping, setIsEditingTopping] = useState(false);
  const [editingTopping, setEditingTopping] = useState(null);

  // 🧩 Load tên Manager
  useEffect(() => {
    const loadName = async () => {
      try {
        const cached = getCurrentUser();
        const cachedName = cached?.fullName;
        if (cachedName) {
          setManagerName(cachedName);
          return;
        }
        let username = cached?.username;
        if (!username) {
          const token = getToken();
          const d = token ? parseJWT(token) : null;
          username = d?.username || "";
        }
        if (!username) {
          setManagerName("Manager");
          return;
        }
        const profile = await findStaffByUsername(username);
        setManagerName(profile?.name || "Manager");
      } catch (err) {
        console.error(err);
        setManagerName("Manager");
      }
    };
    loadName();
  }, []);

  // 🧩 Load danh sách booking (phân trang)
  const [page, setPage] = useState(1);
  const [size] = useState(6);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    size: 6,
    totalPages: 1,
    totalElements: 0,
  });

  useEffect(() => {
    if (activeSection !== "accounts") return;
    let cancelled = false;

    (async () => {
      setLoadingBookings(true);
      setBookingsError("");
      try {
        const { items, pageInfo } = await listBookingsPaging({
          page,
          size,
          status: statusFilter,
        });
        if (!cancelled) {
          setBookings(items);
          setPageInfo(pageInfo);
        }
      } catch (err) {
        if (!cancelled)
          setBookingsError(err.message || "Không tải được danh sách đặt bàn.");
      } finally {
        if (!cancelled) setLoadingBookings(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeSection, page, size, statusFilter]);

  // 🧩 Load danh sách bàn ăn
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await listTables();
        if (!cancelled) {
          setTables(Array.isArray(data) && data.length ? data : mockTables);
        }
      } catch (e) {
        console.error("Load tables failed:", e);
        if (!cancelled) setTables(mockTables);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 🧩 Reload booking
  const refetchBookings = async (toPage = page) => {
    setLoadingBookings(true);
    try {
      const { items, pageInfo } = await listBookingsPaging({
        page: toPage,
        size,
        status: statusFilter,
      });
      setBookings(items);
      setPageInfo(pageInfo);
    } finally {
      setLoadingBookings(false);
    }
  };

  // 🧩 Booking actions
  const handleReject = async (id) => {
    setBookings((prev) =>
      prev.map((x) => (x.id === id ? { ...x, status: "REJECT" } : x)),
    );
    try {
      await rejectBooking(id);
    } catch (err) {
      setBookings((prev) =>
        prev.map((x) => (x.id === id ? { ...x, status: "PENDING" } : x)),
      );
      alert(err.message || "Từ chối thất bại");
    }
  };

  const handleAssignTable = async (bookingId, tableId) => {
    try {
      await approveBookingWithTable(bookingId, tableId);
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId
            ? { ...b, status: "APPROVED", assignedTableId: tableId }
            : b,
        ),
      );
      setTables((prev) =>
        prev.map((t) =>
          t.id === tableId
            ? { ...t, status: "reserved", isAvailable: false }
            : t,
        ),
      );
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          error.message ||
          "Không thể gán bàn cho đơn đặt.",
      );
    }
  };

  const handleSaveEdit = async ({ id, seat, bookingDate }) => {
    try {
      setSavingBooking(true);
      setBookings((prev) =>
        prev.map((x) => (x.id === id ? { ...x, seat, bookingDate } : x)),
      );
      await updateBooking(id, { seat, bookingDate });
      await refetchBookings();
      setIsEditingBooking(false);
      setEditingItem(null);
    } catch (e) {
      console.error(e);
      alert(e.message || "Cập nhật thất bại");
    } finally {
      setSavingBooking(false);
    }
  };

  // 🧩 Thống kê tổng
  const totalRevenue = mockRevenueData.reduce(
    (sum, item) => sum + item.revenue,
    0,
  );
  const totalBookings = bookings.length;
  const totalTables = tables.length;

  // 🧩 Cập nhật trạng thái đơn hàng cho bàn
  const updateOrderStatus = (tableId, updatedOrder) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === tableId ? { ...table, currentOrder: updatedOrder } : table,
      ),
    );
  };

  // 🧩 Render nội dung từng tab
  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <>
            <StatsCards
              totalRevenue={totalRevenue}
              totalAccounts={totalBookings}
              totalDishes={0}
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
          <>
            <TableLayout
              tables={tables}
              onTableClick={(id) => {
                const found = tables.find((t) => t.id === id);
                if (found) setSelectedTable(found);
              }}
              selectedTableId={selectedTable?.id}
            />
            <TablesManagement
              tables={tables}
              selectedTable={selectedTable}
              setSelectedTable={setSelectedTable}
              updateOrderStatus={updateOrderStatus}
            />
          </>
        );

      case "accounts":
        return (
          <BookingManagement
            bookings={bookings}
            setBookings={setBookings}
            setIsEditingBooking={setIsEditingBooking}
            setEditingItem={setEditingItem}
            loading={loadingBookings}
            deletingIds={deletingIds}
            page={page}
            pageInfo={pageInfo}
            onPageChange={setPage}
            onReject={handleReject}
            tables={tables}
            onAssignTable={handleAssignTable}
            statusFilter={statusFilter}
            onStatusChange={(v) => {
              setPage(1);
              setStatusFilter(v);
            }}
          />
        );

      case "dishes":
        return (
          <div className="space-y-6">
            <ManagerDishPage />
          </div>
        );

      // ✅ Chỉ giữ 2 case mới này thôi
      case "dailyPlan":
        return <ManagerDailyPlanPage />;

      case "dailyDishes":
        return <ManagerDailyMenuPage />;

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

      case "toppings":
        return (
          <ToppingsManagement
            toppings={toppings}
            setToppings={setToppings}
            setIsEditingTopping={setIsEditingTopping}
            setEditingItem={setEditingTopping}
            loading={false}
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

  // 🧩 JSX chính
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-orange-50 to-red-50">
      <div className="flex">
        <ManagerSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Chào mừng trở lại, {managerName}!
            </h1>
            <p className="text-neutral-600 text-lg">
              Quản lý nhà hàng hiệu quả với dashboard thông minh
            </p>
          </div>
          {renderContent()}
        </main>
      </div>

      {/* Modal chi tiết bàn */}
      <TableDetailsModal
        selectedTable={selectedTable}
        setSelectedTable={setSelectedTable}
        updateOrderStatus={updateOrderStatus}
      />

      {/* Modal chỉnh sửa booking */}
      <BookingEditModal
        open={isEditingBooking}
        booking={editingItem}
        onClose={() => {
          setIsEditingBooking(false);
          setEditingItem(null);
        }}
        onSave={handleSaveEdit}
        saving={savingBooking}
      />

      {/* Modal chỉnh sửa topping */}
      <EditToppingModal
        isEditingTopping={isEditingTopping}
        setIsEditingTopping={setIsEditingTopping}
        editingItem={editingTopping}
        setEditingItem={setEditingTopping}
        setToppings={setToppings}
      />
    </div>
  );
}
