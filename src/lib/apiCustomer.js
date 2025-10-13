import apiConfig from "../api/apiConfig";

const compact = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value !== "" && value !== null && value !== undefined
    )
  );

export const normalizeCustomer = (cus = {}) => ({
  id: cus.customerId ?? cus.id,
  username: cus.username || "",
  fullName: cus.fullName || "",
  email: cus.email || "",
  phone: cus.phone || "",
  role: cus.role || "CUSTOMER",
});

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
