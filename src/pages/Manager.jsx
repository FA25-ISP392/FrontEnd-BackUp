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

import { getCurrentUser, getToken, parseJWT } from "../lib/auth";
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

  //Call API data real
  const [bookings, setBookings] = useState([
    {
      id: 1,
      customerName: "Nguyễn Văn An",
      phone: "0123456789",
      guestCount: 4,
      bookingTime: "19:30 - 21/12/2024",
      status: "pending"
    },
    {
      id: 2,
      customerName: "Trần Thị Bình",
      phone: "0987654321",
      guestCount: 2,
      bookingTime: "18:00 - 22/12/2024",
      status: "pending"
    },
    {
      id: 3,
      customerName: "Lê Văn Cường",
      phone: "0369852147",
      guestCount: 6,
      bookingTime: "20:00 - 23/12/2024",
      status: "pending"
    },
    {
      id: 4,
      customerName: "Phạm Thị Dung",
      phone: "0741258963",
      guestCount: 3,
      bookingTime: "19:00 - 24/12/2024",
      status: "pending"
    },
    {
      id: 5,
      customerName: "Hoàng Văn Em",
      phone: "0852369741",
      guestCount: 8,
      bookingTime: "18:30 - 25/12/2024",
      status: "pending"
    }
  ]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingsError, setBookingsError] = useState("");

  const [page, setPage] = useState(1);
  const [size] = useState(6);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    size: 6,
    totalPages: 1,
    totalElements: 5,
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
        // Tạm thời sử dụng dữ liệu giả, sẽ thêm API call sau
        if (!cancelled) {
          // Giữ nguyên dữ liệu giả đã có
          setPageInfo({ page: 1, size: 6, totalPages: 1, totalElements: 5 });
        }
      } catch (err) {
        if (!cancelled)
          setBookingsError(
            err.message || "Không tải được danh sách đặt bàn."
          );
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
      // Tạm thời giữ nguyên dữ liệu giả, sẽ thêm API call sau
      setPageInfo({ page: 1, size: 6, totalPages: 1, totalElements: 5 });
    } finally {
      setLoadingBookings(false);
    }
  };

  const updateBooking = async (data) => {
    // Tạm thời để trống, sẽ thêm logic cập nhật đặt bàn sau
    console.log("Cập nhật đặt bàn:", data);
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
    </div>
  );
}
