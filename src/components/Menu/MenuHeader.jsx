import {
  ShoppingCart,
  User,
  CreditCard,
  ChefHat,
  ListChecks,
} from "lucide-react";

export default function MenuHeader({
  cartItemCount,
  onPersonalize,
  onViewOrders,
  onCheckout,
  onViewStatus,
  pendingCount = 0,
  preparingCount = 0,
  showPersonalizeButton = true,
}) {
  const activeCount = (pendingCount || 0) + (preparingCount || 0);

  const buttonClass =
    "relative flex items-center space-x-2 px-4 py-2 rounded-full text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5";

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-200/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center space-x-3 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-105">
                <ChefHat className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-neutral-900 transition-colors duration-300 group-hover:text-orange-600">
                MónCủaBạn
              </h1>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {showPersonalizeButton && (
              <button
                onClick={onPersonalize}
                className={`${buttonClass} bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600`}
              >
                <User className="h-5 w-5" />
                <span className="font-medium text-sm">Menu Gợi Ý</span>
              </button>
            )}

            <button
              onClick={onViewStatus}
              className={`${buttonClass} bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600`}
            >
              <ListChecks className="h-5 w-5 text-white" />
              <span className="font-medium text-sm">Trạng thái đơn</span>
              {activeCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold border-2 border-white">
                  {activeCount}
                </span>
              )}
            </button>

            <button
              onClick={onViewOrders}
              className={`${buttonClass} bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600`}
            >
              <ShoppingCart className="h-5 w-5 text-white" />
              <span className="font-medium text-sm">Giỏ Hàng</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold border-2 border-white">
                  {cartItemCount}
                </span>
              )}
            </button>

            <button
              //===== Gọi hàm khi ấn vào nút Thanh Toán chuyển props về Menu.jsx =====
              onClick={onCheckout}
              className={`${buttonClass} px-5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700`}
            >
              <CreditCard className="h-5 w-5" />
              <span className="font-medium text-sm">Thanh Toán</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
