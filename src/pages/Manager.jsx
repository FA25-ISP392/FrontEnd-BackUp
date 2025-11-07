import { useState, useEffect, useCallback } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ManagerSidebar from "../components/Manager/ManagerSidebar";
import TableDetailsModal from "../components/Manager/TableDetailsModal";
import EditToppingModal from "../components/Manager/Topping/EditToppingModal";
import ToppingManagement from "../components/Manager/Topping/ToppingManagement";
import ManagerDishPage from "../components/Manager/Dish/ManagerDishPage";
import ManagerDailyPlanPage from "../components/Manager/ManagerDailyPlanPage";
import ManagerDailyMenuPage from "../components/Manager/ManagerDailyMenuPage";
import { listToppingPaging, searchToppingByName } from "../lib/apiTopping";

import { listBookingsPaging } from "../lib/apiBooking";
import { getCurrentUser, getToken, parseJWT } from "../lib/auth";
import { findStaffByUsername } from "../lib/apiStaff";
import BookingManagement from "../components/Manager/BookingManagement";
import { listTables } from "../lib/apiTable";

export default function Manager() {
  const location = useLocation();

  const [managerName, setManagerName] = useState("");

  // Booking
  const [deletingIds] = useState(new Set());
  const [selectedTable, setSelectedTable] = useState(null);
  const [tables, setTables] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingsError, setBookingsError] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [bookingPage, setBookingPage] = useState(1);
  const [bookingSize] = useState(6);
  const [bookingPageInfo, setBookingPageInfo] = useState({
    page: 1,
    size: 6,
    totalPages: 1,
    totalElements: 0,
  });

  // Topping
  const [toppings, setToppings] = useState([]);
  const [isEditingTopping, setIsEditingTopping] = useState(false);
  const [editingTopping, setEditingTopping] = useState(null);
  const [toppingPage, setToppingPage] = useState(0);
  const [toppingSize] = useState(10);
  const [toppingPageInfo, setToppingPageInfo] = useState({
    page: 0,
    size: 10,
    totalPages: 1,
    totalElements: 0,
  });
  const [loadingTopping, setLoadingTopping] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const isAt = (slug) => location.pathname.startsWith(`/manager/${slug}`);

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
      } catch {
        setManagerName("Manager");
      }
    };
    loadName();
  }, []);

  //===== Load bookings khi ở trang Quản Lý Đặt Bàn =====
  useEffect(() => {
    if (!isAt("quanlydatban")) return;
    let cancelled = false;
    (async () => {
      setLoadingBookings(true);
      setBookingsError("");
      try {
        //===== Gọi hàm lấy ra danh sách Đặt Bàn =====
        const { items, pageInfo } = await listBookingsPaging({
          page: bookingPage,
          size: bookingSize,
          status: statusFilter,
        });
        if (!cancelled) {
          setBookings(items);
          setBookingPageInfo(pageInfo);
        }
      } catch (err) {
        if (!cancelled) {
          setBookingsError(err?.message || "Không tải được danh sách đặt bàn.");
        }
      } finally {
        if (!cancelled) setLoadingBookings(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [location.pathname, bookingPage, bookingSize, statusFilter]);

  // Load tables (dùng chung nhiều trang)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await listTables();
        if (!cancelled) setTables(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setTables([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Load topping paging
  const loadToppings = useCallback(async () => {
    setLoadingTopping(true);
    try {
      const pageData = await listToppingPaging({
        page: toppingPage,
        size: toppingSize,
      });
      setToppings(pageData.content);
      setToppingPageInfo(pageData.pageInfo);
    } catch (err) {
      console.error("❌ Lỗi khi load topping:", err);
      setToppings([]);
    } finally {
      setLoadingTopping(false);
    }
  }, [toppingPage, toppingSize]);

  // Chỉ load khi ở trang Topping và không có keyword tìm kiếm
  useEffect(() => {
    if (!isAt("thanhphanmon")) return;
    if (searchTerm) return;
    loadToppings();
  }, [location.pathname, toppingPage, searchTerm, loadToppings]);

  // Search topping
  const handleSearchTopping = useCallback(
    async (keyword = "") => {
      setSearchTerm(keyword);
      if (!keyword.trim()) {
        await loadToppings();
        return;
      }
      setLoadingTopping(true);
      try {
        const result = await searchToppingByName(keyword);
        if (Array.isArray(result)) {
          setToppings(result);
          setToppingPageInfo({
            page: 0,
            size: result.length,
            totalPages: 1,
            totalElements: result.length,
          });
        } else {
          setToppings([]);
        }
      } catch {
        setToppings([]);
      } finally {
        setLoadingTopping(false);
      }
    },
    [loadToppings]
  );

  // Update table order
  const updateOrderStatus = (tableId, updatedOrder) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === tableId ? { ...table, currentOrder: updatedOrder } : table
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-neutral-900 to-red-900">
      <div className="flex">
        <ManagerSidebar />

        <main className="flex-1 p-8 md:p-10">
          <div className="mb-10 animate-fade-in-up">
            <h1 className="text-4xl font-extrabold text-white mb-2">
              Chào mừng trở lại, {managerName}!
            </h1>
            <p className="text-xl text-red-300">
              Quản lý nhà hàng hiệu quả với dashboard thông minh
            </p>
            {isAt("quanlydatban") && bookingsError && (
              <p className="text-red-400 mt-2">{bookingsError}</p>
            )}
          </div>

          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "100ms" }}
          >
            <Routes>
              <Route index element={<Navigate to="quanlydatban" replace />} />

              <Route
                path="quanlydatban"
                element={
                  <BookingManagement
                    bookings={bookings}
                    setBookings={setBookings}
                    loading={loadingBookings}
                    deletingIds={deletingIds}
                    page={bookingPage}
                    pageInfo={bookingPageInfo}
                    onPageChange={setBookingPage}
                    tables={tables}
                    statusFilter={statusFilter}
                    onStatusChange={(v) => {
                      setBookingPage(1);
                      setStatusFilter(v);
                    }}
                  />
                }
              />

              <Route path="monan" element={<ManagerDishPage />} />

              <Route
                path="thanhphanmon"
                element={
                  <ToppingManagement
                    toppings={toppings}
                    setToppings={setToppings}
                    setIsEditingTopping={setIsEditingTopping}
                    setEditingItem={setEditingTopping}
                    loading={loadingTopping}
                    onSearch={handleSearchTopping}
                    page={toppingPage}
                    pageInfo={toppingPageInfo}
                    onPageChange={setToppingPage}
                  />
                }
              />

              <Route
                path="kehoachtrongngay"
                element={<ManagerDailyPlanPage />}
              />

              <Route path="montrongngay" element={<ManagerDailyMenuPage />} />

              <Route
                path="*"
                element={<Navigate to="quanlydatban" replace />}
              />
            </Routes>
          </div>
        </main>
      </div>

      <TableDetailsModal
        selectedTable={selectedTable}
        setSelectedTable={setSelectedTable}
        updateOrderStatus={updateOrderStatus}
      />

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
