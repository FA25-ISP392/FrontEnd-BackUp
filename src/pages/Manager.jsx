import { useState, useEffect } from "react";
import ManagerSidebar from "../components/Manager/ManagerSidebar";
import StatsCards from "../components/Manager/StatsCards";
import Charts from "../components/Manager/Charts";
import TablesManagement from "../components/Manager/TablesManagement";
import BookingManagement from "../components/Manager/BookingManagement";
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
  listBookingsPaging,
  approveBooking,
  rejectBooking,
  updateBooking,
} from "../lib/apiBooking";
import { getCurrentUser, getToken, parseJWT } from "../lib/auth";
import BookingEditModal from "../components/Manager/BookingEditModal";
import { findStaffByUsername } from "../lib/apiStaff";

export default function Manager() {
  const [managerName, setManagerName] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const [revenuePeriod, setRevenuePeriod] = useState("day");
  const [isEditingBooking, setIsEditingBooking] = useState(false);
  const [isEditingDish, setIsEditingDish] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [dishes, setDishes] = useState(mockDishes);
  const [tables, setTables] = useState(mockTables);
  const [dishRequests, setDishRequests] = useState(getDishRequests());
  const [deletingIds, setDeletingIds] = useState(new Set());
  const [savingBooking, setSavingBooking] = useState(false);

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
          setManagerName("Admin");
          return;
        }
        const profile = await findStaffByUsername(username);
        setManagerName(profile?.name);
      } catch (err) {
        console.error(err);
        setManagerName("Admin");
      }
    };
    loadName();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { items, pageInfo } = await listBookingsPaging({
          page: 1,
          size: 6,
        });
        console.log("BOOKINGS:", items, pageInfo);
      } catch (err) {
        console.error("Lỗi load booking:", err);
      }
    })();
  }, []);

  //Call API data real
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingsError, setBookingsError] = useState("");

  const [page, setPage] = useState(1);
  const [size] = useState(6);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    size: 6,
    totalPages: 1,
    totalElements: 0,
  });

  useEffect(() => {
    if (activeSection === "accounts") setPage(1);
  }, [activeSection]);

  useEffect(() => {
    if (activeSection !== "accounts") return;
    let cancelled = false;

    (async () => {
      setLoadingBookings(true);
      setBookingsError("");
      try {
        const { items, pageInfo } = await listBookingsPaging({ page, size });
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
  }, [activeSection, page, size]);

  const refetchBookings = async (toPage = page) => {
    setLoadingBookings(true);
    try {
      const { items, pageInfo } = await listBookingsPaging({
        page: toPage,
        size,
      });
      setBookings(items);
      setPageInfo(pageInfo);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleApprove = async (bk) => {
    setBookings((prev) =>
      prev.map((x) => (x.id === bk.id ? { ...x, status: "APPROVED" } : x))
    );
    try {
      await approveBooking(bk.id);
    } catch (e) {
      setBookings((prev) =>
        prev.map((x) => (x.id === bk.id ? { ...x, status: "PENDING" } : x))
      );
      alert(e.message || "Duyệt thất bại");
    }
  };

  const handleReject = async (bk) => {
    setBookings((prev) =>
      prev.map((x) => (x.id === bk.id ? { ...x, status: "REJECTED" } : x))
    );
    try {
      await rejectBooking(bk.id);
    } catch (e) {
      setBookings((prev) =>
        prev.map((x) => (x.id === bk.id ? { ...x, status: "PENDING" } : x))
      );
      alert(e.message || "Từ chối thất bại");
    }
  };

  const handleSaveEdit = async ({ id, seat, bookingDate }) => {
    try {
      setSavingBooking(true);
      setBookings((prev) =>
        prev.map((x) => (x.id === id ? { ...x, seat, bookingDate } : x))
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

  const deleteBooking = async (bookingId) => {
    // Tạm thời để trống, sẽ thêm logic xóa đặt bàn sau
    console.log("Xóa đặt bàn:", bookingId);
  };

  // Calculate totals
  const totalRevenue = mockRevenueData.reduce(
    (sum, item) => sum + item.revenue,
    0
  );
  const totalBookings = bookings.length;
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
              totalAccounts={totalBookings}
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
            onApprove={handleApprove}
            onReject={handleReject}
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
      {/* Modal cho chỉnh sửa đặt bàn sẽ được thêm sau */}
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
    </div>
  );
}
