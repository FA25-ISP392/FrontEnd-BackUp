import { ChefHat, Bell, Settings } from "lucide-react";

export default function ManagerHeader({ managerName }) {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-30">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <ChefHat className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-900">
                Restaurant Manager
              </h1>
              <p className="text-sm text-neutral-600">Dashboard quản lý</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-neutral-100 rounded-lg transition">
              <Bell className="h-5 w-5 text-neutral-600" />
            </button>
            <button className="p-2 hover:bg-neutral-100 rounded-lg transition">
              <Settings className="h-5 w-5 text-neutral-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">M</span>
              </div>
              <span className="text-sm font-medium text-neutral-700">
                {managerName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
