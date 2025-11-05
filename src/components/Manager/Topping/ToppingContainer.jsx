import React, { useState, useEffect, useCallback } from "react";
import {
  listToppingPaging,
  searchToppingByName,
} from "../../../lib/apiTopping";
import ToppingManagement from "./ToppingManagement";

export default function ToppingContainer() {
  const [toppings, setToppings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageInfo, setPageInfo] = useState({ totalPages: 1 });
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditingTopping, setIsEditingTopping] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const loadToppings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listToppingPaging({ page, size: 10 });
      setToppings(res.content);
      setPageInfo(res.pageInfo);
    } catch (err) {
      console.error("❌ Lỗi khi load topping:", err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (!searchTerm) loadToppings();
  }, [page, searchTerm, loadToppings]);

  const handleSearch = useCallback(
    async (term) => {
      setSearchTerm(term);
      if (!term) {
        loadToppings();
        return;
      }
      setLoading(true);
      try {
        const data = await searchToppingByName(term);
        setToppings(data);
        setPageInfo({ totalPages: 1 });
      } catch (err) {
        console.error("❌ Lỗi tìm topping:", err);
      } finally {
        setLoading(false);
      }
    },
    [loadToppings],
  );

  return (
    <ToppingManagement
      toppings={toppings}
      setToppings={setToppings}
      setIsEditingTopping={setIsEditingTopping}
      setEditingItem={setEditingItem}
      loading={loading}
      onSearch={handleSearch}
      page={page}
      pageInfo={pageInfo}
      onPageChange={setPage}
    />
  );
}
