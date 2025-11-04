import { useState, useEffect } from "react";
import ManagerSidebar from "../components/Manager/ManagerSidebar";
import TablesManagement from "../components/Manager/TablesManagement";
import TableDetailsModal from "../components/Manager/TableDetailsModal";
import EditToppingModal from "../components/Manager/Topping/EditToppingModal";
import ToppingManagement from "../components/Manager/Topping/ToppingManagement";
import ManagerDishPage from "../components/Manager/Dish/ManagerDishPage";
import ManagerDailyPlanPage from "../components/Manager/ManagerDailyPlanPage";
import ManagerDailyMenuPage from "../components/Manager/ManagerDailyMenuPage";
import { listToppingPaging, searchToppingByName } from "../lib/apiTopping";

import {
  listBookingsPaging,
  rejectBooking,
  approveBookingWithTable,
} from "../lib/apiBooking";
import { getCurrentUser, getToken, parseJWT } from "../lib/auth";
import { findStaffByUsername } from "../lib/apiStaff";
import BookingManagement from "../components/Manager/BookingManagement";
import TableLayout from "../components/Manager/TableLayout";
import { listTables } from "../lib/apiTable";

export default function Manager() {
  const [managerName, setManagerName] = useState("");
  const [activeSection, setActiveSection] = useState("accounts");
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

  const [toppings, setToppings] = useState([]);
  const [isEditingTopping, setIsEditingTopping] = useState(false);
  const [editingTopping, setEditingTopping] = useState(null);
  const [toppingPage, setToppingPage] = useState(1);
  const [toppingSize] = useState(10);
  const [toppingPageInfo, setToppingPageInfo] = useState({
    page: 1,
    size: 10,
    totalPages: 1,
    totalElements: 0,
  });

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

  useEffect(() => {
    if (activeSection !== "accounts") return;
    let cancelled = false;
    (async () => {
      setLoadingBookings(true);
      setBookingsError("");
      try {
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
  }, [activeSection, bookingPage, bookingSize, statusFilter]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await listTables();
        if (!cancelled) setTables(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setTables([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (activeSection !== "toppings") return;
    let cancelled = false;

    (async () => {
      try {
        const pageData = await listToppingPaging({
          page: toppingPage - 1,
          size: toppingSize,
        });

        if (!cancelled) {
          setToppings(pageData.content);
          setToppingPageInfo({
            ...pageData,
            page: toppingPage,
            totalPages: pageData.totalPages,
          });
        }
      } catch (err) {
        if (!cancelled) setToppings([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeSection, toppingPage, toppingSize]);

  const handleSearchTopping = async (keyword = "") => {
    try {
      if (!keyword.trim()) {
        setToppingPage(1);
        const pageData = await listToppingPaging({
          page: 0,
          size: toppingSize,
        });
        setToppings(pageData.content);
        setToppingPageInfo({ ...pageData, page: 1 });
        return;
      }
      const result = await searchToppingByName(keyword);
      if (Array.isArray(result)) {
        setToppings(result);
        setToppingPageInfo({
          page: 1,
          size: result.length,
          totalPages: 1,
          totalElements: result.length,
          first: true,
          last: true,
        });
      } else {
        setToppings([]);
      }
    } catch (err) {
      setToppings([]);
    }
  };

  const handleReject = async (id) => {
    setBookings((prev) =>
      prev.map((x) => (x.id === id ? { ...x, status: "REJECT" } : x))
    );
    try {
      await rejectBooking(id);
    } catch (err) {
      setBookings((prev) =>
        prev.map((x) => (x.id === id ? { ...x, status: "PENDING" } : x))
      );
      alert(err?.message || "Từ chối thất bại");
    }
  };

  const handleAssignTable = async (bookingId, tableId) => {
    try {
      await approveBookingWithTable(bookingId, tableId);
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId
            ? { ...b, status: "APPROVED", assignedTableId: tableId }
            : b
        )
      );
      setTables((prev) =>
        prev.map((t) =>
          t.id === tableId
            ? { ...t, status: "reserved", isAvailable: false }
            : t
        )
      );
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Không thể gán bàn cho đơn đặt."
      );
    }
  };

  const updateOrderStatus = (tableId, updatedOrder) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === tableId ? { ...table, currentOrder: updatedOrder } : table
      )
    );
  };

  const renderContent = () => {
    switch (activeSection) {
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
            loading={loadingBookings}
            deletingIds={deletingIds}
            page={bookingPage}
            pageInfo={bookingPageInfo}
            onPageChange={setBookingPage}
            onReject={handleReject}
            tables={tables}
            onAssignTable={handleAssignTable}
            statusFilter={statusFilter}
            onStatusChange={(v) => {
              setBookingPage(1);
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
      case "dailyPlan":
        return <ManagerDailyPlanPage />;

      case "dailyDishes":
        return <ManagerDailyMenuPage />;

      case "toppings":
        return (
          <ToppingManagement
            toppings={toppings}
            setToppings={setToppings}
            setIsEditingTopping={setIsEditingTopping}
            setEditingItem={setEditingTopping}
            loading={false}
            onSearch={handleSearchTopping}
            page={toppingPage}
            pageInfo={toppingPageInfo}
            onPageChange={setToppingPage}
          />
        );

      case "settings":
        return (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Cài Đặt</h3>
            <p className="text-red-200">
              Chức năng cài đặt sẽ được phát triển...
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-neutral-900 to-red-900">
      <div className="flex">
        <ManagerSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <main className="flex-1 p-8 md:p-10">
          <div className="mb-10 animate-fade-in-up">
            <h1 className="text-4xl font-extrabold text-white shadow-text-lg mb-2">
              Chào mừng trở lại, {managerName}!
            </h1>
            <p className="text-xl text-red-300">
              Quản lý nhà hàng hiệu quả với dashboard thông minh
            </p>
            {activeSection === "accounts" && bookingsError && (
              <p className="text-red-400 mt-2">{bookingsError}</p>
            )}
          </div>

          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "100ms" }}
          >
            {renderContent()}
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
