# 1. Functional Objective
Cung cấp cái nhìn tổng quan về lưu lượng khách hàng và hiệu quả kinh doanh của cửa hàng thông qua các chỉ số KPI, biểu đồ phân tích và bảng xếp hạng khu vực theo thời gian thực. Cho phép người dùng lọc dữ liệu linh hoạt.

# 2. Page Structure
Giao diện được chia thành 4 phần chính theo chiều dọc, sắp xếp theo logic "Tổng quan đến Chi tiết":
1. **Header & Filter Bar:** Tiêu đề trang và các bộ lọc (Khu vực, Cửa hàng, Camera, Ngày).
2. **KPI Section:** Dãy 4 thẻ tóm tắt các chỉ số quan trọng nhất (Tổng doanh thu, Khách trong ngày, Khách hiện tại, Tỷ lệ chuyển đổi).
3. **Analytics Section:** Biểu đồ phân tích lưu lượng khách theo giờ (Area Chart), là chỉ số quan trọng nhất về hành vi khách hàng.
4. **Rankings & Detailed Business Analytics Section (2 cột):**
   - **Cột trái:** Biểu đồ doanh thu theo ngày (Bar Chart) để phân tích xu hướng kinh doanh.
   - **Cột phải:** Bảng xếp hạng khu vực theo lưu lượng (Xếp hạng nóng/lạnh).

# 3. Component Details

### A. Global Filter Bar
Nằm trên cùng, dưới tiêu đề Dashboard. Sử dụng `Flex-wrap` và `gap-4` để đảm bảo responsive.
- **Chọn Khu vực (Region):** Dropdown select.
- **Chọn Cửa hàng (Store):** Dropdown. Chỉ hiển thị các cửa hàng thuộc Khu vực đã chọn.
- **Chọn Camera:** Dropdown. Cho phép chọn camera cụ thể.
- **Chọn Ngày (Date Picker):** Mặc định là "Hôm nay".
- **Nút Reset:** Đặt lại các bộ lọc về mặc định.

### B. KPI Summary Cards (Grid 4 cột)
Nâng cấp từ 3 lên 4 thẻ. Các chỉ số được mô tả chi tiết từ `image_7.png`:
1. **Tổng doanh thu:** - Icon: `DollarSign` (Ví dụ: vòng tròn đô la).
   - Dữ liệu: Tổng số tiền bán hàng tích lũy. (Ví dụ: 25.000.000đ).
2. **Khách trong ngày:** - Icon: `User` (single user).
   - Dữ liệu: Tổng lượt khách đã vào trong ngày. Định dạng rút gọn: 1.3K.
3. **Khách hiện tại:** - Icon: `Walking` (người đi bộ với mũi tên lên).
   - Status: Badge "Live" màu xanh lá.
   - Dữ liệu: Số người đang có mặt thực tế. (Ví dụ: 42).
4. **Tỷ lệ chuyển đổi:** - Icon: `TrendingUp` (biểu đồ đi lên).
   - Dữ liệu: % khách mua hàng. (Ví dụ: 12.5%).

### C. Hourly Customer Traffic Chart
- **Loại:** Area Chart (Smooth Curve).
- **Trục X:** Thời gian (08:00 - 22:00).
- **Trục Y:** Số lượng khách.
- **Styling:** Đường line xanh dương, vùng đổ màu gradient xanh dương nhạt. Có Tooltip chi tiết khi hover. Bọc trong div có `h-[350px]` để sửa lỗi width/height 0.

### D. Revenue Over Time Chart (Section 3D)
- **Tiêu đề:** "Doanh thu theo ngày"
- **Loại:** Bar Chart (Biểu đồ cột) để dễ so sánh giữa các ngày.
- **Trục X:** Các ngày trong tuần hoặc ngày trong tháng (ví dụ: T2, T3... hoặc 11/03, 12/03...).
- **Trục Y:** Số tiền doanh thu.
- **Styling:** Các cột có màu xanh emerald hoặc xanh dương. Bọc trong div có `h-[350px]`.

### E. Rank of Zones by Traffic (Section 3E - chi tiết từ `image_6.png`)
Đây là bảng danh sách có thứ tự, được trình bày trong một component có nền trắng và viền xanh (bordered box) như trong ảnh.
- **Bố cục:** Một component với tiêu đề "Xếp hạng khu vực theo lưu lượng". Danh sách được xếp hạng từ `#1` đến `#N`.
- **Mỗi mục trong danh sách:** `#Number Khu vực` và một Badge màu sắc tương ứng với trạng thái "nóng/lạnh" của khu vực đó.
- **Ví dụ Dữ liệu và Màu sắc Badge:**
   - #1 Lối vào chính | Badge: `Rất nóng` (Red)
   - #2 Quầy thanh toán | Badge: `Nóng` (Orange)
   - #3 Khu vực giảm giá | Badge: `Nóng` (Orange)
   - #4 Mỹ phẩm cao cấp | Badge: `Ấm` (Yellow)
   - #5 Đồ chơi trẻ em | Badge: `Trung bình` (Blue)
   - #6 Đồ dùng văn phòng | Badge: `Ổn định` (Light Blue)
   - #7 Nội thất lớn | Badge: `Lạnh` (Dark Blue)

# 4. Visual Vibe & Styling
- **Màu sắc:** Nền trang `#F8F9FA`. Các component lọc và Card có nền trắng `#FFFFFF`.
- **Độ bo góc:** `rounded-xl` (12px) cho các component lớn như Chart và Ranking Box. `rounded-md` (6px) cho Input/Select.
- **Hiệu ứng:** Đổ bóng nhẹ `shadow-sm`. Border màu `gray-200`.

# 5. Data Interaction & Logic
- **Sử dụng Cascading Filter:** thay đổi Khu vực sẽ reset Cửa hàng, v.v.
- **Mock Data Update:** Dữ liệu mock trong `dashboardSlice.js` phải bao gồm: `summary.total_revenue`, dữ liệu cho `revenueData` (mảng biểu đồ cột doanh thu) và `zoneRankingData` (mảng danh sách có rank và trạng thái nhiệt).
- **Hiển thị Loading:** Hiển thị hiệu ứng Skeleton loading cho toàn bộ component lớn khi đang fetch dữ liệu mới.