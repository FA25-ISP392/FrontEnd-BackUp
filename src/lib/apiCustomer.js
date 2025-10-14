import apiConfig from "../api/apiConfig";

const compact = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value !== "" && value !== null && value !== undefined
    )
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
  const res = await apiConfig.get("/customer", {
    params: { page: 0, size: 1000 },
  });

  const list = Array.isArray(res)
    ? res
    : Array.isArray(res?.result)
    ? res.result
    : Array.isArray(res?.content)
    ? res.content
    : [];

  const found = list.find(
    (x) =>
      String(x?.username || "").toLowerCase() === String(username).toLowerCase()
  );
  return found ? normalizeCustomer(found) : null;
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
