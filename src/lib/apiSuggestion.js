import apiConfig from "../api/apiConfig";

export async function getSuggestedMenu(body) {
  const res = await apiConfig.post("/suggestions/menu", body);
  if (!res || !res.result)
    throw new Error("Không nhận được dữ liệu gợi ý món ăn");
  return res.result;
}
