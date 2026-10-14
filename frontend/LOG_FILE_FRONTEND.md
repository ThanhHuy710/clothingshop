# 📝 FRONTEND DEVELOPMENT LOG

### [Cập nhật ngày: 25/06/2026] - Hoàn thiện Khung quản trị (Admin Panel) & Phân quyền

**1. 🏗️ Xây dựng Admin Layout & Cập nhật Header**
- Tích hợp logic kiểm tra phân quyền (`isAdmin`, `isStaff`) vào Public Header để hiển thị nút "Vào trang Quản trị".
- Tạo `AdminLayout.jsx` và `AdminSidebar.jsx` để định hình bố cục trang quản trị.
- Xử lý phân quyền hiển thị trên Sidebar: Quản lý người dùng (chỉ Admin), Quản lý sản phẩm và Duyệt đơn hàng (Admin & Staff).

**2. 👥 Phân hệ Quản lý Người Dùng (`UserManagement.jsx`)**
- Xây dựng giao diện danh sách người dùng hiển thị trực quan thông tin tài khoản, vai trò và trạng thái.
- Thay đổi logic "Xóa vật lý" thành "Khóa/Mở khóa tài khoản" (Soft Delete/Deactivate) để đảm bảo an toàn dữ liệu hệ thống.
- Tích hợp gọi API (`lockUser`) và hiển thị `toast` thông báo ngay khi thực hiện thao tác xong.

**3. 📦 Phân hệ Quản lý Sản Phẩm (`ProductManagement.jsx`)**
- Xây dựng giao diện danh sách, tìm kiếm và quản lý sản phẩm trong kho.
- Tích hợp logic gọi API lấy dữ liệu khóa ngoại (Master Data: Thương hiệu, Danh mục, Loại máy) bằng `useEffect` (dùng `Promise.all` tối ưu hoá) và đổ vào các thẻ `<select>` trong Form Thêm/Sửa sản phẩm.
- Quản lý trạng thái form bằng controlled state và validation thủ công (VD: giá/số lượng không được âm).

**4. 🛒 Phân hệ Duyệt Đơn Hàng / Order Fulfillment (`OrderFulfillment.jsx`)**
- Xây dựng bảng danh sách đơn hàng dành cho Staff/Admin, hiển thị theo trình tự mới nhất.
- Thiết kế hệ thống Badge màu sắc trực quan cho các trạng thái đơn hàng: 🟡 PENDING, 🔵 PROCESSING, 🟢 DELIVERED, 🔴 CANCELLED.
- Thêm chức năng cập nhật trạng thái đơn hàng trực tiếp và Modal xem chi tiết các sản phẩm bên trong đơn.

---
