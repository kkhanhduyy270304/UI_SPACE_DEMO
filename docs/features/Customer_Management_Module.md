# 1. Functional Objective
Quản lý thông tin chi tiết khách hàng định danh, giúp chủ cơ sở (Gym/Cửa hàng tiện lợi) theo dõi hành vi, lòng trung thành và hiệu suất kinh doanh trên từng cá nhân.

# 2. Page Structure
Trang bao gồm 2 View chính (Toggle chuyển đổi hoặc theo phân quyền dự án):
1. **Gym Membership Management:** Dành cho mô hình phòng tập chất lượng cao.
2. **Retail Customer Management:** Dành cho mô hình cửa hàng tiện lợi/bán lẻ.

# 3. Component Details

### A. Global Filter & Search (Header)
- **Search Box:** Tìm kiếm theo Tên, Số điện thoại hoặc Mã thành viên.
- **Dropdown Phân loại:** Chọn nhóm khách hàng (VIP, Thân thiết, Mới).
- **Date Range:** Lọc theo ngày đăng ký hoặc ngày giao dịch cuối.

### B. Option 1: Quản lý thành viên Phòng Gym (Gym Membership)
Giao diện dạng **Table Layout** kết hợp **Status Badges**:
- **Các cột dữ liệu:**
  1. **Thành viên:** Avatar + Tên + Mã thẻ (ID).
  2. **Gói tập:** (Vd: Gói 6 tháng, Gói Platinum, Gói PT 1-1).
  3. **Trạng thái:** Badge `Đang hoạt động` (Xanh), `Hết hạn` (Đỏ), `Bảo lưu` (Vàng).
  4. **Tần suất đi tập:** Chỉ số trung bình buổi/tuần (Dữ liệu từ AI SpaceLens tracking).
  5. **Ngày hết hạn:** Định dạng DD/MM/YYYY.
- **Tính năng AI tích hợp:** Hiển thị cảnh báo "Khách hàng có nguy cơ bỏ tập" nếu 2 tuần chưa thấy xuất hiện trên Camera.

### C. Option 2: Quản lý khách hàng Cửa hàng tiện lợi (Retail)
Giao diện tập trung vào **Hiệu suất mua hàng**:
- **Các cột dữ liệu:**
  1. **Khách hàng:** Tên + Số điện thoại (SĐT).
  2. **Số lượng hóa đơn:** Tổng số đơn hàng đã mua (Vd: 45 hóa đơn).
  3. **Tổng chi tiêu:** Định dạng tiền tệ (VND).
  4. **Sản phẩm mua nhiều nhất:** (Vd: Nước khoáng, Snack...).
  5. **Xếp hạng:** Badge `Diamond`, `Gold`, `Silver`.
- **Hành động (Actions):** Xem lịch sử hóa đơn chi tiết, Tặng voucher khuyến mãi.

# 4. Visual Vibe & Styling
- **Theme:** Đồng bộ với Dashboard (Light Mode, nền xám nhạt #F8F9FA).
- **Cards & Table:** Nền trắng, bo góc `rounded-xl`, border mờ `border-gray-100`.
- **Typography:** Font Sans-serif, các con số quan trọng (Doanh thu, SĐT) sử dụng font Mono để dễ đọc.

# 5. Data Interaction (Mock Data for Copilot)
- **Store:** Quản lý qua `customerSlice.js`.
- **Mock Logic:** - Nếu `type === 'gym'`, hiển thị danh sách thành viên với thuộc tính `membershipStatus`.
  - Nếu `type === 'retail'`, hiển thị danh sách với thuộc tính `totalInvoices` và `totalSpend`.