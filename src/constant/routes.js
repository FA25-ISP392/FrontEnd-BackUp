export const APP_ORIGIN =
  import.meta.env.VITE_PUBLIC_ORIGIN ||
  (import.meta.env.PROD
    ? "https://moncuaban.vercel.app"
    : "http://localhost:5173");

const joinUrl = (origin, path) =>
  `${origin}${path.startsWith("/") ? "" : "/"}${path}`;

export const HOME = "/home";
export const HOME_ROUTES = {
  ABOUT: "/home/vechungtoi",
  LOGIN: "/home/dangnhap",
  REGISTER: "/home/dangky",
  FORGOT: "/home/quenmatkhau",
  MENU_PREVIEW: "/home/xemtruocthucdon",
  BOOKING: "/home/datban",
  HISTORY: "/home/lichsudatban",
  EDIT: "/home/suathongtin",
  PAYMENT_HISTORY: "/home/lichsuthanhtoan",
  ORDER_HISTORY: "/home/lichsugoimon",
};

export const STAFF_BASE = "/staff";
export const STAFF_ROUTES = {
  TABLE_LAYOUT: "/staff/sodoban",
  OVERVIEW: "/staff/thongtinban",
  SERVE_BOARD: "/staff/phucvumon",
  SERVE_HISTORY: "/staff/lichsuphucvu",
};

export const ADMIN_BASE = "/admin";
export const ADMIN_ROUTES = {
  OVERVIEW: "/admin/tongquan",
  INVOICES: "/admin/hoadon",
  ACCOUNTS: "/admin/taikhoan",
};

export const MANAGER_BASE = "/manager";
export const MANAGER_ROUTES = {
  BOOKING: "/manager/quanlydatban",
  DISH: "/manager/monan",
  TOPPING: "/manager/thanhphanmon",
  DAILY_PLAN: "/manager/kehoachtrongngay",
  DAILY_MENU: "/manager/montrongngay",
};

export const VERIFY_EMAIL = "/verify-email";
export const VERIFY_EMAIL_URL = joinUrl(APP_ORIGIN, VERIFY_EMAIL);

export const NEED_AUTH = [
  HOME_ROUTES.HISTORY,
  HOME_ROUTES.EDIT,
  HOME_ROUTES.PAYMENT_HISTORY,
  HOME_ROUTES.ORDER_HISTORY,

  STAFF_ROUTES.TABLE_LAYOUT,
  STAFF_ROUTES.OVERVIEW,
  STAFF_ROUTES.SERVE_BOARD,
  STAFF_ROUTES.SERVE_HISTORY,

  MANAGER_ROUTES.BOOKING,
  MANAGER_ROUTES.DISH,
  MANAGER_ROUTES.TOPPING,
  MANAGER_ROUTES.DAILY_PLAN,
  MANAGER_ROUTES.DAILY_MENU,

  ADMIN_ROUTES.OVERVIEW,
  ADMIN_ROUTES.INVOICES,
  ADMIN_ROUTES.ACCOUNTS,
];

export const TABLE_LOGIN_ROUTES = {
  TABLE_1: "/home/dangnhap?tableId=1",
  TABLE_2: "/home/dangnhap?tableId=2",
  TABLE_3: "/home/dangnhap?tableId=3",
  TABLE_4: "/home/dangnhap?tableId=4",
  TABLE_5: "/home/dangnhap?tableId=5",
  TABLE_6: "/home/dangnhap?tableId=6",
  TABLE_7: "/home/dangnhap?tableId=7",
  TABLE_8: "/home/dangnhap?tableId=8",
};

export const TABLE_LOGIN_URLS = Object.fromEntries(
  Object.entries(TABLE_LOGIN_ROUTES).map(([k, v]) => [
    k,
    joinUrl(APP_ORIGIN, v),
  ])
);

export const qrUrlForTable = (id) =>
  joinUrl(APP_ORIGIN, `${HOME_ROUTES.LOGIN}?tableId=${Number(id)}`);
