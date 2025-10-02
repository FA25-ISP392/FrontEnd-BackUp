import { Plus, Edit, Trash2, Users } from "lucide-react";

export default function AdminAccountManagement({
  accounts,
  setIsEditingAccount,
  setEditingItem,
  deleteAccount,
}) {
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
          onClick={() => setIsEditingAccount(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Thêm Tài Khoản
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
        <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 px-6 py-4 border-b border-neutral-200">
          <div className="grid grid-cols-5 gap-4 text-sm font-semibold text-neutral-700">
            <div>Tên</div>
            <div>Email</div>
            <div>Vai Trò</div>
            <div>Trạng Thái</div>
            <div>Hành động</div>
          </div>
        </div>
        <div className="divide-y divide-neutral-200">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="px-6 py-4 hover:bg-neutral-50 transition-colors"
            >
              <div className="grid grid-cols-5 gap-4 items-center">
                <div className="font-medium text-neutral-900">
                  {account.name}
                </div>
                <div className="text-neutral-600">{account.email}</div>
                <div className="text-neutral-600">{account.role}</div>
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
                <div className="flex gap-2">
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
                    onClick={() => deleteAccount(account.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
