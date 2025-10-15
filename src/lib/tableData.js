// Data giả cho các bàn trong nhà hàng
export const mockTables = [
  {
    id: 1,
    number: 1,
    capacity: 2,
    status: "reserved", // available, occupied, reserved
    booking: {
      customerName: "Hoàng Văn Em",
      time: "19:30",
      phone: "0527419638"
    },
    currentOrder: null,
  },
  {
    id: 2,
    number: 2,
    capacity: 2,
    status: "available",
    booking: null,
    currentOrder: null,
  },
  {
    id: 3,
    number: 3,
    capacity: 4,
    status: "reserved",
    booking: {
      customerName: "Vũ Thị Phương",
      time: "20:00",
      phone: "0963258741"
    },
    currentOrder: null,
  },
  {
    id: 4,
    number: 4,
    capacity: 4,
    status: "available",
    booking: null,
    currentOrder: null,
  },
  {
    id: 5,
    number: 5,
    capacity: 6,
    status: "occupied",
    booking: {
      customerName: "Nguyễn Văn Khách",
      time: "18:00",
      phone: "0123456789"
    },
    currentOrder: {
      items: [
        { name: "Phở Bò", status: "completed" },
        { name: "Bún Chả", status: "preparing" },
        { name: "Nước Cam", status: "pending" }
      ],
      total: 250000
    },
  },
  {
    id: 6,
    number: 6,
    capacity: 6,
    status: "available",
    booking: null,
    currentOrder: null,
  },
  {
    id: 7,
    number: 7,
    capacity: 8,
    status: "available",
    booking: null,
    currentOrder: null,
  },
  {
    id: 8,
    number: 8,
    capacity: 8,
    status: "available",
    booking: null,
    currentOrder: null,
  },
];

// Data giả cho các đơn đặt bàn
export const mockBookings = [
  {
    id: 1,
    customerName: "Nguyễn Văn An",
    phone: "0123456789",
    email: "an.nguyen@email.com",
    seat: 4,
    bookingDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 giờ sau
    createdAt: new Date().toISOString(),
    status: "PENDING",
    note: "Bàn gần cửa sổ",
  },
  {
    id: 2,
    customerName: "Trần Thị Bình",
    phone: "0987654321",
    email: "binh.tran@email.com",
    seat: 2,
    bookingDate: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3 giờ sau
    createdAt: new Date().toISOString(),
    status: "PENDING",
    note: "Bàn yên tĩnh",
  },
  {
    id: 3,
    customerName: "Lê Văn Cường",
    phone: "0369852147",
    email: "cuong.le@email.com",
    seat: 6,
    bookingDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 giờ sau
    createdAt: new Date().toISOString(),
    status: "PENDING",
    note: "Kỷ niệm sinh nhật",
  },
  {
    id: 4,
    customerName: "Phạm Thị Dung",
    phone: "0741852963",
    email: "dung.pham@email.com",
    seat: 8,
    bookingDate: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), // 5 giờ sau
    createdAt: new Date().toISOString(),
    status: "PENDING",
    note: "Họp mặt gia đình",
  },
  {
    id: 5,
    customerName: "Hoàng Văn Em",
    phone: "0527419638",
    email: "em.hoang@email.com",
    seat: 2,
    bookingDate: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(), // 1 giờ sau
    createdAt: new Date().toISOString(),
    status: "APPROVED",
    note: "Bàn lãng mạn",
    assignedTableId: 1,
  },
  {
    id: 6,
    customerName: "Vũ Thị Phương",
    phone: "0963258741",
    email: "phuong.vu@email.com",
    seat: 4,
    bookingDate: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 giờ sau
    createdAt: new Date().toISOString(),
    status: "APPROVED",
    note: "Bàn VIP",
    assignedTableId: 3,
  },
];

// Hàm để cập nhật trạng thái bàn
export const updateTableStatus = (tables, tableId, status, booking = null) => {
  return tables.map(table => 
    table.id === tableId 
      ? { ...table, status, booking }
      : table
  );
};

// Hàm để lấy bàn theo ID
export const getTableById = (tables, tableId) => {
  return tables.find(table => table.id === tableId);
};

// Hàm để lấy các bàn phù hợp với số người
export const getSuitableTables = (tables, seatCount) => {
  return tables.filter(table => 
    table.capacity >= seatCount && table.status === "available"
  );
};
