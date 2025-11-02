import apiConfig from "../api/apiConfig";

const compact = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value !== "" && value !== null && value !== undefined,
    ),
  );

export const normalizeCustomer = (cus = {}) => ({
  id: cus.customerId ?? cus.id,
  customerId: cus.customerId ?? cus.id,
  username: cus.username || "",
  fullName: cus.fullName || "",
  email: cus.email || "",
  phone: cus.phone || "",
  role: cus.role || "CUSTOMER",
});

export async function findCustomerByUsername(username) {
  if (!username) return null;
  try {
    const encodedUsername = encodeURIComponent(username);
    const res = await apiConfig.get(`/customer/by-username/${encodedUsername}`);
    const data = res?.result ?? res;
    if (data && (data.customerId || data.id)) {
      return normalizeCustomer(data);
    } else {
      console.warn(
        "API returned success but no customer data for username:",
        username,
      );
      return null;
    }
  } catch (error) {
    console.error(`Error finding customer by username "${username}":`, error);
    if (
      error?.response?.status === 404 ||
      error?.code === "USER_NOT_EXISTED" ||
      error?.code === "CUSTOMER_NOT_FOUND"
    ) {
      return null;
    }
    return null;
  }
}

export async function createCustomer(form) {
  const payload = compact({
    username: form.username,
    password: form.password,
    fullName: form.fullName,
    email: form.email,
    phone: form.phone,
    role: "CUSTOMER",
  });

  const res = await apiConfig.post("/customer", payload);
  const data = res?.result ?? res;
  return normalizeCustomer(data);
}

export async function listCustomers(params = { page: 0, size: 1000 }) {
  const res = await apiConfig.get("/customer", { params });
  const list = Array.isArray(res)
    ? res
    : Array.isArray(res?.result)
    ? res.result
    : Array.isArray(res?.content)
    ? res.content
    : [];
  return list.map(normalizeCustomer);
}

export async function updateCustomer(customerId, payload) {
  const body = compact(payload);
  const res = await apiConfig.put(`/customer/${customerId}`, body);
  return res?.result ?? res;
}

export async function changeCustomerPassword(customerId, newPassword) {
  return updateCustomer(customerId, { password: newPassword });
}

export async function ensureCustomerForUser({
  username,
  fullName,
  email,
  phone,
}) {
  const existed = await findCustomerByUsername(username);
  if (existed?.customerId) return existed;
  const payload = { username, fullName, email, phone };
  const res = await apiConfig.post("/customer", payload);
  const data = res?.result ?? res;
  return normalizeCustomer(data);
}

export async function updateCustomerPersonalization(customerId, form = {}) {
  if (!customerId) throw new Error("Thiếu customerId");

  const body = compact({
    height: form.height != null ? Number(form.height) : undefined,
    weight: form.weight != null ? Number(form.weight) : undefined,
    // FIX: Đọc form.sex (true/false)
    // Cần kiểm tra !== undefined để không loại bỏ giá trị false
    sex: form.sex !== undefined ? Boolean(form.sex) : undefined,
    // FIX: Đọc form.portion (integer)
    portion: form.portion != null ? Number(form.portion) : undefined,
  });

  if (Object.keys(body).length === 0) {
    throw new Error("Không có trường nào để cập nhật.");
  }

  const res = await apiConfig.put(`/customer/${customerId}`, body);
  return res?.result ?? res;
}

export async function getCustomerDetail(customerId) {
  if (!customerId) throw new Error("Thiếu customerId");
  const res = await apiConfig.get(`/customer/${customerId}`);
  return res?.result ?? res;
}
