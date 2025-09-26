import { useState } from 'react';
import { Home, User, LogOut, X } from 'lucide-react';

export default function ManagerHeader({ userName = 'Manager User' }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    // Simulate logout
    window.location.href = '/staff';
  };

  return (
    <>
      <header className="w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 hover:opacity-80 transition"
            aria-label="Reload page"
          >
            <span className="inline-block h-8 w-8 rounded bg-blue-600 text-white grid place-items-center font-bold">R</span>
            <span className="text-lg font-semibold">Restaurant</span>
          </button>
          
          <nav className="flex items-center gap-2">
            <button
              onClick={() => window.location.href = '/staff'}
              className="px-3 py-2 rounded-lg hover:bg-neutral-100 transition text-neutral-700 font-medium flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </button>
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-100 transition"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-neutral-700 font-medium">{userName}</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Profile Sidebar */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsProfileOpen(false)} />
          <div className="relative ml-auto w-full max-w-md bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Employee Profile</h2>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-semibold text-lg">{userName}</h3>
                <p className="text-neutral-600 text-sm">Manager</p>
                <p className="text-neutral-500 text-xs mt-1">Employee ID: MGR001</p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Department:</span>
                  <span className="font-medium">Management</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Access Level:</span>
                  <span className="font-medium">Manager Access</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Last Login:</span>
                  <span className="font-medium">{new Date().toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition font-medium flex items-center justify-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

