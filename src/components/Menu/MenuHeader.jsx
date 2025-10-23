import {
  ShoppingCart,
  User,
  Bell,
  CreditCard,
  ChefHat,
  ListChecks,
} from "lucide-react";

export default function MenuHeader({
  cartItemCount,
  onPersonalize,
  onViewOrders,
  onCallStaff,
  onCheckout,
  onViewStatus,
  pendingCount = 0,
  preparingCount = 0,
}) {
  const activeCount = (pendingCount || 0) + (preparingCount || 0);

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-900">
                  MónCủaBạn
                </h1>
              </div>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onPersonalize}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <User className="h-4 w-4" />
              <span className="font-medium">Cá Nhân Hóa</span>
            </button>

            <button
              onClick={onViewStatus}
              className="relative flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <ListChecks className="h-4 w-4" />
              <span className="font-medium">Trạng thái đơn</span>
              {activeCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-emerald-600 text-xs rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center font-bold">
                  {activeCount}
                </span>
              )}
            </button>

            <button
              onClick={onViewOrders}
              className="relative flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="font-medium">Giỏ Hàng</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </button>

            <button
              onClick={onCallStaff}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Bell className="h-4 w-4" />
              <span className="font-medium">Gọi Nhân Viên</span>
            </button>

            <button
              onClick={onCheckout}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <CreditCard className="h-4 w-4" />
              <span className="font-medium">Thanh Toán</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
