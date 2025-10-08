import { useState } from "react";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import AdminAccountForm from "./AdminAccountForm"; // <- form tạo mới
import { normalizeStaff } from "../../lib/apiStaff";

export default function AdminAccountManagement({
  accounts,
  setIsEditingAccount,
  setEditingItem,
  deleteAccount,
  setAccounts, // <- NHỚ truyền từ parent xuống
  loading,
  // deletingIds = new Set(),
}) {
  // State mở/đóng modal TẠO MỚI (không ảnh hưởng luồng Edit cũ)
  const [openCreate, setOpenCreate] = useState(false);
  const [confirmingId, setConfirmingId] = useState(null);

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

        {/* Thêm Tài Khoản -> mở modal tạo mới (KHÔNG đụng setIsEditingAccount cũ) */}
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
            <div className="truncate">Email</div>
            <div className="truncate">Vai Trò</div>
            <div className="truncate">Trạng Thái</div>
            <div className="truncate">Hành động</div>
          </div>
        </div>

        <div className="divide-y divide-neutral-200">
          {loading ? (
            <div className="p-6 text-neutral-500">Đang tải danh sách...</div>
          ) : accounts.length === 0 ? (
            <div className="p-6 text-neutral-500">Chưa có nhân viên nào.</div>
          ) : (
            accounts.map((account) => (
              <div
                key={account.id}
                className="px-6 py-4 hover:bg-neutral-50 transition-colors"
              >
                <div className="grid grid-cols-6 gap-4 items-center">
                  <div
                    className="font-medium text-neutral-900 truncate"
                    title={account.name}
                  >
                    {account.name}
                  </div>

                  <div
                    className="text-neutral-600 truncate"
                    title={account.phone || "-"}
                  >
                    {account.phone || "-"}
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
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        account.status === "active"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-red-100 text-red-800 border-red-200"
                      }`}
                    >
                      {account.status === "active"
                        ? "Hoạt động"
                        : "Không hoạt động"}
                    </span>
                  </div>

                  {/* Hành động: Edit (giữ nguyên luồng cũ) + Delete */}
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => {
                        setEditingItem(account); // chọn item để edit
                        setIsEditingAccount(true); // mở modal edit của bạn (nếu có)
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Edit className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirmingId === account.id) {
                          deleteAccount(account.id); // gọi API xoá
                          setConfirmingId(null);
                        } else {
                          setConfirmingId(account.id); // lần đầu bấm thì hiện confirm
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      {confirmingId === account.id ? (
                        "Xác nhận?"
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>

                    {confirmingId === account.id && (
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
            ))
          )}
        </div>
      </div>

      {/* Modal tạo mới (Add) */}
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
