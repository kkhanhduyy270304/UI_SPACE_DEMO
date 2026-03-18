# 1. Functional Objective
Cung cấp phân tích chuyên sâu về hiệu suất của từng khu vực (Zone) trong cửa hàng, bao gồm luồng di chuyển của khách hàng và các khuyến nghị vận hành dựa trên dữ liệu AI.

# 2. Page Structure (Logic sắp xếp)
1. **Global Filter Bar:** (Giống Dashboard) - Khu vực > Cửa hàng > Camera > Ngày > Reset.
2. **Zone KPI Header (4 Cards):** Tổng lưu lượng, Số khách hiện tại, Thời gian dừng trung bình, Hiệu suất khu vực.
3. **Mid Section (2 Columns):**
   - Trái (65%): Biểu đồ "Lưu lượng biến động theo giờ" (Area Chart).
   - Phải (35%): Bảng "Tuyến đường di chuyển" (Luồng di chuyển giữa các Zone).
4. **Bottom Section:** Bảng "Trạng thái chi tiết từng Zone" kèm khuyến nghị vận hành từ AI.

# 3. Component Details

### A. Global Filter Bar (Đồng bộ với Dashboard)
- **Thành phần:** Dropdown chọn Region, Store, Camera, Date Picker và nút Reset.
- **Styling:** Flexbox hàng ngang, nền trắng, bo góc nhẹ, đổ bóng shadow-sm.

### B. Zone KPI Cards (Dựa trên image_86aac4.png)
Mỗi thẻ có chỉ số chính, tiêu đề và % tăng trưởng so với kỳ trước:
1. **Tổng lưu lượng ngày:** Icon `Users`, hiển thị số tổng (vd: 769), kèm badge tăng trưởng (vd: +12% ↑).
2. **Số khách hiện tại:** Icon `Activity`, hiển thị số live (vd: 122).
3. **Thời gian dừng TB (Dwell Time):** Icon `Clock`, hiển thị phút/giây (vd: 10:26m), kèm biến động (vd: -2% ↓).
4. **Hiệu suất khu vực:** Icon `CheckCircle`, hiển thị % (vd: 88.2%), kèm tăng trưởng (vd: +5.4% ↑).

### C. Hourly Variation Chart (Biểu đồ biến động)
- **Tiêu đề:** "Lưu lượng biến động theo giờ". Có nút chuyển đổi "Hôm nay / 7 ngày qua".
- **Type:** Area Chart, màu xanh dương, đường cong mượt.
- **Container:** `h-[350px]`.

### D. Movement Paths (Tuyến đường di chuyển)
- **Tiêu đề:** "Tuyến đường di chuyển" (Tỷ lệ chuyển tiếp giữa các zone).
- **Cấu trúc:** Danh sách các chặng (ví dụ: Zone A -> Zone B) kèm chỉ số "Độ tin cậy" (Confidence %).

### E. Zone Status Detail Table (Phần quan trọng nhất)
Bảng giám sát hiệu suất và khuyến nghị vận hành:
- **Các cột:** Khu vực (kèm Sensor ID), Số người hôm nay, So với hôm qua, Khuyến nghị.
- **Logic Khuyến nghị (AI Recommendation Badges):**
  - *Vận hành bình thường:* Badge màu xanh lá.
  - *Mở thêm quầy thanh toán:* Badge màu đỏ (dùng khi khách ở khu vực thanh toán quá đông).
  - *Đẩy mạnh khuyến mãi tại chỗ:* Badge màu cam (dùng khi khu vực trải nghiệm có lượt khách giảm).
- **Styling:** Row highlight khi hover, chữ rõ ràng, phân cấp màu sắc xanh/đỏ cho chỉ số % tăng giảm.

# 4. Visual Vibe & Styling
- **Theme:** Light mode, sạch sẽ.
- **Typography:** Sans-serif, ưu tiên font Inter hoặc tương đương.
- **Colors:** Green (Positive), Red (Negative/Alert), Blue (Primary/Neutral).

# 5. Data Interaction
- Đồng bộ dữ liệu qua `zoneAnalyticsSlice`.
- Mọi thao tác lọc ở Filter Bar phải trigger action `loadZoneData`.