import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AdminAccountForm from "./AdminAccountForm";
import { normalizeStaff } from "../../lib/apiStaff";

export default function AdminAccountManagement({
  accounts,
  setIsEditingAccount,
  setEditingItem,
  deleteAccount,
  setAccounts,
  loading,
  deletingIds = new Set(),
  page = 1,
  pageInfo = { page: 1, size: 6, totalPages: 1, totalElements: 0 },
  onPageChange = () => {},
  currentUser = {},
}) {
  const [openCreate, setOpenCreate] = useState(false);
  const [confirmingId, setConfirmingId] = useState(null);
  const { totalPages, totalElements, size: pageSize } = pageInfo;

  const buildPages = () => {
    const maxLength = 5;
    if (totalPages <= maxLength) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const left = Math.max(1, page - 2);
    const right = Math.min(totalPages, page + 2);
    const pages = [];
    if (left > 1) pages.push(1, "...");
    for (let p = left; p <= right; p++) pages.push(p);
    if (right < totalPages) pages.push("...", totalPages);
    return pages;
  };

  const from = totalElements === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalElements);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Users className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Quản Lý Tài Khoản
            </h3>
            <p className="text-sm text-neutral-600">
              Quản lý tài khoản hệ thống
            </p>
          </div>
        </div>

        <button
          onClick={() => setOpenCreate(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Thêm Tài Khoản
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
        <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 px-6 py-4 border-b border-neutral-200">
          <div className="grid grid-cols-6 gap-4 text-sm font-semibold text-neutral-700">
            <div className="truncate">Tên</div>
            <div className="truncate">Số Điện Thoại</div>
            <div className="truncate">Ngày sinh</div>
            <div className="truncate">Email</div>
            <div className="truncate">Vai Trò</div>
            <div className="truncate">Hành động</div>
          </div>
        </div>

        <div className="divide-y divide-neutral-200">
          {loading ? (
            <div className="p-6 text-neutral-500">Đang tải danh sách...</div>
          ) : accounts.length === 0 ? (
            <div className="p-6 text-neutral-500">Chưa có nhân viên nào.</div>
          ) : (
            accounts.map((account) => {
              const isSelf =
                String(account.username || "").toLowerCase() ===
                  String(currentUser?.username || "").toLowerCase() ||
                Number(account.accountId) === Number(currentUser?.accountId) ||
                Number(account.staffId) ===
                  Number(currentUser?.staffId || currentUser?.id);

              const delDisabled = isSelf || deletingIds.has(Number(account.id));

              return (
                <div
                  key={account.id}
                  className="px-6 py-4 hover:bg-neutral-50 transition-colors"
                >
                  <div className="grid grid-cols-6 gap-4 items-center">
                    <div
                      className="font-medium text-neutral-900 truncate"
                      title={account.name}
                    >
                      {account.name}{" "}
                      {isSelf && (
                        <span className="text-xs text-neutral-500">(Bạn)</span>
                      )}
                    </div>

                    <div
                      className="text-neutral-600 truncate"
                      title={account.phone || "-"}
                    >
                      {account.phone || "-"}
                    </div>

                    <div
                      className="text-neutral-600 truncate"
                      title={account.dob || "-"}
                    >
                      {account.dob
                        ? new Date(account.dob).toLocaleDateString("vi-VN")
                        : "-"}
                    </div>

                    <div
                      className="text-neutral-600 truncate"
                      title={account.email}
                    >
                      {account.email}
                    </div>

                    <div
                      className="text-neutral-600 truncate"
                      title={account.role}
                    >
                      {account.role}
                    </div>

                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => {
                          setEditingItem(account);
                          setIsEditingAccount(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit className="h-4 w-4" />
                      </button>

                      <button
                        disabled={delDisabled}
                        title={
                          isSelf ? "Không thể xoá tài khoản đang đăng nhập" : ""
                        }
                        onClick={() => {
                          if (isSelf) return;
                          if (confirmingId === account.id) {
                            deleteAccount(account.id);
                            setConfirmingId(null);
                          } else {
                            setConfirmingId(account.id);
                          }
                        }}
                        className={`p-2 rounded-lg transition ${
                          delDisabled
                            ? "text-neutral-400 cursor-not-allowed"
                            : "text-red-600 hover:bg-red-50"
                        }`}
                      >
                        {confirmingId === account.id ? (
                          deletingIds.has(Number(account.id)) ? (
                            "Đang xoá..."
                          ) : (
                            "Xác nhận?"
                          )
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>

                      {confirmingId === account.id && !isSelf && (
                        <button
                          onClick={() => setConfirmingId(null)}
                          className="ml-2 text-neutral-500 hover:text-neutral-700 text-sm"
                        >
                          Huỷ
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={pageInfo.first}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pageInfo.first
                  ? "text-neutral-400 bg-neutral-100 cursor-not-allowed"
                  : "text-neutral-700 bg-white border border-neutral-300 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 shadow-sm"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              Trước
            </button>

            <div className="flex items-center gap-1">
              {buildPages().map((p, i) =>
                p === "…" ? (
                  <span
                    key={`e-${i}`}
                    className="px-3 py-2 text-neutral-500 font-medium"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      p === page
                        ? "bg-orange-500 text-white shadow-lg transform scale-105"
                        : "text-neutral-700 bg-white border border-neutral-300 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 shadow-sm"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() =>
                onPageChange(Math.min(pageInfo.totalPages || 1, page + 1))
              }
              disabled={pageInfo.last}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pageInfo.last
                  ? "text-neutral-400 bg-neutral-100 cursor-not-allowed"
                  : "text-neutral-700 bg-white border border-neutral-300 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 shadow-sm"
              }`}
            >
              Sau
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {openCreate && (
        <AdminAccountForm
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          onCreated={(newStaff) => {
            const n = normalizeStaff(newStaff);
            setAccounts?.((prev) => [n, ...(prev || [])]);
          }}
          accounts={accounts}
        />
      )}
    </div>
  );
}
