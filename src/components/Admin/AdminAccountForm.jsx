import { useState } from "react";
import { createStaff } from "../../lib/apiStaff";

export default function AdminAccountForm({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    username: "", password: "",
    staffName: "", staffPhone: "", staffEmail: "",
    role: "STAFF",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  if (!open) return null;
  //Cập nhật từng field trong form 
  const setF = (k,v)=>setForm(s=>({...s,[k]:v}));

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!form.username || !form.password || !form.staffName || !form.staffEmail) {
      setErr("Vui lòng nhập đủ Username, Password, Họ tên, Email.");
      return;
    }
    try {
      setSaving(true);
      const newStaff = await createStaff(form); //Call API tạo nhân viên
      onCreated?.(newStaff);   //Call fallback để component cha cập nhật list
      onClose?.();
    } catch (e) {
      setErr(e.message || "Có lỗi xảy ra.");
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Thêm tài khoản nhân sự</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-neutral-100">✕</button>
        </div>

        <form onSubmit={submit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Tên Đăng Nhập</label>
              <input className="w-full mt-1 px-3 py-2 border rounded-lg"
                     value={form.username} onChange={e=>setF("username", e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Mật Khẩu</label>
              <input type="password" className="w-full mt-1 px-3 py-2 border rounded-lg"
                     value={form.password} onChange={e=>setF("password", e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Họ Tên</label>
              <input className="w-full mt-1 px-3 py-2 border rounded-lg"
                     value={form.staffName} onChange={e=>setF("staffName", e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Số Điện Thoại</label>
              <input className="w-full mt-1 px-3 py-2 border rounded-lg"
                     value={form.staffPhone} onChange={e=>setF("staffPhone", e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium">Email</label>
              <input type="email" className="w-full mt-1 px-3 py-2 border rounded-lg"
                     value={form.staffEmail} onChange={e=>setF("staffEmail", e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium">Vai Trò</label>
              <select className="w-full mt-1 px-3 py-2 border rounded-lg"
                      value={form.role} onChange={e=>setF("role", e.target.value)}>
                <option>ADMIN</option>
                <option>MANAGER</option>
                <option>STAFF</option>
                <option>CHEF</option>
              </select>
            </div>
          </div>

          {err && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{err}</div>}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border">Hủy</button>
            <button disabled={saving}
              className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-blue-500 to-purple-500 disabled:opacity-50">
              {saving ? "Đang tạo..." : "Tạo nhân sự"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
