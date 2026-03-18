# 1. Functional Objective
Cung cấp cái nhìn tổng thể về cơ cấu thành viên, phân đoạn khách hàng và lộ trình di chuyển điển hình trong không gian vật lý (Gym/Retail). Tích hợp trợ lý GenAI để đưa ra các gợi ý vận hành thông minh.

# 2. Page Structure (Logic sắp xếp)
1. **Global Filter Bar:** (Đồng bộ) - Khu vực > Cửa hàng > Camera > Ngày > Reset.
2. **KPI Header (3 Cards):** Tổng thành viên, Tỷ lệ quay lại, Thời gian dừng TB. (Bỏ thẻ Điểm tương tác).
3. **Segmentation Section:** Biểu đồ Donut "Phân bổ nhóm đối tượng" kèm chú thích chi tiết bên phải.
4. **GenAI Assistant Section:** Khối gợi ý AI với 3 loại thông báo (Xu hướng, Cần chú ý, Gợi ý chiến lược).
5. **Member List Section:** Bảng danh sách thành viên chi tiết (Hiển thị Tên thay vì ID).
6. **Behavioral Analytics Section (2 Columns):**
   - Trái: Biểu đồ thanh ngang "Ưu tiên khu vực".
   - Phải: Sơ đồ luồng "Lộ trình điển hình".

# 3. Component Details

### A. Customer KPI Cards (Dựa trên image_7a7f45.png)
- **Tổng thành viên:** Icon `Users`, số tổng (vd: 2,847), badge tăng trưởng xanh (vd: +12.5%).
- **Tỷ lệ quay lại:** Icon `LineChart`, tỷ lệ % (vd: 68.4%), badge tăng trưởng (vd: +5.2%).
- **Thời gian dừng TB:** Icon `Clock`, thời gian (vd: 24.3 phút), badge tăng trưởng (vd: +3.1 phút).

### B. Segment Distribution (Donut Chart)
- **Loại:** Donut Chart với các phần màu sắc:
  - Khách thân thiết (35% - Green)
  - Khách vãng lai (40% - Blue)
  - Khách tiềm năng (20% - Orange)
  - Nhân viên (5% - Purple)
- **Styling:** Hiển thị % trực tiếp trên biểu đồ và bảng chú thích có số lượng thành viên ước tính bên phải.

### C. GenAI Assistant Box (Dựa trên image_7a7f0c.png)
- **Thiết kế:** Box có border màu tím nhạt, tiêu đề "GenAI Assistant" kèm icon ngôi sao.
- **3 Dạng Alert:**
  1. **Xu hướng tích cực (Green):** Thông báo về nhóm Loyal tăng trưởng.
  2. **Cần chú ý (Yellow/Red):** Cảnh báo về nhóm At-Risk (có nguy cơ rời bỏ).
  3. **Gợi ý chiến lược (Blue):** Đề xuất khung giờ tăng cường nhân sự.

### D. Member Data Table (Updated per Request)
- **Cột dữ liệu:**
  1. **Họ và tên:** Tên khách hàng (VD: Nguyễn Văn A) - *Thay thế cho ID*.
  2. **Nhóm:** Badge màu tương ứng (Thân thiết, Vãng lai, Tiềm năng, Nguy cơ rời đi).
  3. **Lần cuối:** Thời gian từ lần cuối xuất hiện (Vd: 2 giờ trước).
  4. **Lượt/30d:** Tần suất đến trong tháng (Vd: 24 lượt).
  5. **Dwell Time:** Thời gian ở lại trung bình (Vd: 48 phút).
- **Tính năng:** Ô tìm kiếm "Tìm kiếm theo tên..." ở góc trên bên phải bảng.

### E. Behavioral Insights (Dựa trên image_7a7ba1.png)
- **Ưu tiên khu vực:** Biểu đồ thanh ngang (Progress Bar style) hiển thị lượt khách và thời gian trung bình từng khu vực (Tập thể lực, Cardio, Yoga, Giải khát).
- **Lộ trình điển hình:** Sơ đồ các bước di chuyển (Flow). Ví dụ: Lễ tân -> Thay đồ (95%) -> Tập thể lực (65%) -> Cardio (45%). Sử dụng mũi tên và chỉ số % chuyển tiếp giữa các khối.

# 4. Visual Vibe & Styling
- **Màu sắc:** Tươi sáng, hiện đại. Các badge trạng thái phải có độ tương phản tốt.
- **Biểu đồ:** Sử dụng Recharts cho Donut và Bar chart.
- **Layout:** Sử dụng `grid-cols-12` để phân chia tỷ lệ các khối linh hoạt.

# 5. Data Interaction
- Action `loadCustomerData` sẽ fetch dữ liệu bao gồm cả danh sách thành viên định danh.
- Mock data trong `customerSlice.js` cần có mảng `memberList` với các tên người thực tế để hiển thị lên bảng.