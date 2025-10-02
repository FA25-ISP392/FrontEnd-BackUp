# Cấu Trúc Dự Án Restaurant Management System

## 📁 Cấu Trúc Thư Mục

```
src/
├── components/           # Các component React
│   ├── Admin/           # Components cho trang Admin
│   ├── Chef/            # Components cho trang Chef  
│   ├── Home/            # Components cho trang Home
│   ├── Manager/         # Components cho trang Manager
│   ├── Menu/            # Components cho trang Menu
│   ├── Staff/           # Components cho trang Staff
│   ├── ui/              # UI Components chung (tên viết thường)
│   │   ├── badge.jsx
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── input.jsx
│   │   ├── modal.jsx
│   │   ├── sidebar.jsx
│   │   └── index.js
│   ├── Footer.jsx
│   ├── Header.jsx
│   ├── HomeHeader.jsx
│   ├── MenuHeader.jsx
│   └── Sidebar.jsx
├── hooks/               # Custom React Hooks
│   ├── common.js        # Hooks chung (useLocalStorage, useModal, useForm, etc.)
│   ├── restaurant.js    # Hooks chuyên biệt cho nhà hàng
│   └── index.js         # Export tất cả hooks
├── lib/                 # Data và utilities (đổi từ constants)
│   ├── adminData.js
│   ├── chefData.js
│   ├── dishRequestsData.js
│   ├── homeData.js
│   ├── managerData.js
│   └── menuData.js
├── pages/               # Các trang chính
│   ├── Admin.jsx
│   ├── Chef.jsx
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Manager.jsx
│   ├── Menu.jsx
│   ├── Staff.jsx
│   └── StaffPage.jsx
├── assets/              # Tài nguyên tĩnh
│   └── react.svg
├── App.jsx              # Component chính
├── App.css              # Styles chính
├── index.css            # Global styles
└── main.jsx             # Entry point
```

## 🎨 UI Components (src/components/ui/)

Các component UI chung với tên viết thường để sử dụng lại:

- **modal**: Component modal chung với nhiều tùy chọn
- **sidebar**: Component sidebar có thể tùy chỉnh
- **button**: Button component với nhiều variant và size
- **card**: Card component với header, content, footer
- **input**: Input component với validation
- **badge**: Badge component với nhiều màu sắc

### Cách sử dụng:
```jsx
import { modal, button, card } from '../components/ui';

// Sử dụng modal
<modal isOpen={isOpen} onClose={onClose} title="Tiêu đề">
  Nội dung modal
</modal>

// Sử dụng button
<button variant="primary" size="md">
  Click me
</button>

// Sử dụng card
<card>
  <cardHeader>Tiêu đề</cardHeader>
  <cardContent>Nội dung</cardContent>
</card>
```

## 🪝 Custom Hooks (src/hooks/)

### Hooks chung (common.js):
- **useLocalStorage**: Quản lý localStorage
- **useModal**: Quản lý trạng thái modal
- **useForm**: Quản lý form state và validation
- **useApi**: Quản lý API calls
- **useTable**: Quản lý table với sort và filter

### Hooks chuyên biệt nhà hàng (restaurant.js):
- **useCart**: Quản lý giỏ hàng và calories
- **useTables**: Quản lý bàn và trạng thái
- **useOrders**: Quản lý đơn hàng
- **useDishes**: Quản lý món ăn và visibility
- **usePersonalization**: Cá nhân hóa menu

### Cách sử dụng:
```jsx
import { useCart, useTables, useModal } from '../hooks';

function MyComponent() {
  const { cart, addToCart, cartTotal } = useCart();
  const { tables, updateTableStatus } = useTables();
  const { isOpen, openModal, closeModal } = useModal();
  
  // Logic component...
}
```

## 📚 Data Layer (src/lib/)

Thay vì `constants`, giờ sử dụng `lib` để chứa:
- Mock data cho các trang
- Utility functions
- Configuration data

## ✨ Tính Năng Mới

1. **UI Components tái sử dụng**: Tất cả component UI chung được tập trung trong `ui/`
2. **Custom Hooks**: Logic được tách ra thành hooks để tái sử dụng
3. **Cấu trúc rõ ràng**: Mỗi folder có mục đích cụ thể
4. **Tên component viết thường**: Trong folder `ui/` để tuân thủ convention
5. **TypeScript ready**: Cấu trúc sẵn sàng cho việc migrate sang TypeScript

## 🔄 Migration Notes

- Tất cả import từ `../constants/` đã được cập nhật thành `../lib/`
- Logic từ components đã được tách ra thành custom hooks
- UI components chung đã được di chuyển vào `ui/` folder
- Giữ nguyên toàn bộ functionality và giao diện
