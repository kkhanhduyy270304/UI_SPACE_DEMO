# Hướng Dẫn Hiểu Và Vận Hành Vibe Code Của StoreLens

## 1. Mục đích của file này

File này dành cho người mới vào project để hiểu nhanh:

- Project này đang giải quyết bài toán gì
- Chạy project như thế nào
- Luồng vận hành của frontend hiện tại ra sao
- State, route, API và mock data nằm ở đâu
- Cách thêm một feature mới mà không phá cấu trúc sẵn có

Đây là mô tả theo trạng thái code hiện tại trong repo, không phải theo blueprint cũ.

## 2. Project này là gì

StoreLens là một frontend demo cho hệ thống phân tích bán lẻ tại cửa hàng vật lý.

Ý tưởng chính:

- Camera + AI tạo ra dữ liệu hành vi trong cửa hàng
- Backend tổng hợp dữ liệu thành KPI, heatmap, zone analytics
- Frontend hiển thị dữ liệu đó thành dashboard, heatmap, analytics và màn hình quản trị

Project này đang đi theo hướng `mock-first`:

- Nếu backend chưa sẵn sàng, UI vẫn phải chạy được
- Một số tính năng có fallback mock để demo nhanh
- Auth hiện tại là mock auth bằng `localStorage`

## 3. Stack hiện tại

Frontend hiện tại dùng:

- React 19
- Vite
- JavaScript + JSX
- Tailwind CSS
- Redux Toolkit
- React Router
- Axios
- Framer Motion
- Lucide React

Lưu ý quan trọng:

- Project đã được chuyển từ TypeScript sang JavaScript
- Một số file tài liệu cũ trong repo vẫn còn nhắc tới TypeScript, nhưng source hiện tại đang chạy bằng JS/JSX

## 4. Cách chạy project

### Cài dependency

```bash
npm install
```

### Chạy môi trường dev

```bash
npm run dev
```

### Build production

```bash
npm run build
```

### Preview bản build

```bash
npm run preview
```

## 5. Entry point và khung chạy chính

Luồng khởi động frontend:

1. `src/main.jsx`
2. `src/App.jsx`
3. Redux `Provider`
4. `AppRouter`
5. `MainLayout`
6. Các page theo route hiện tại

Các file chính:

- `src/main.jsx`: mount app vào DOM
- `src/App.jsx`: bọc app bằng Redux Provider
- `src/router/index.jsx`: toàn bộ route và guard đăng nhập
- `src/components/layout/MainLayout.jsx`: khung chung gồm Header, main content, Footer

## 6. Cấu trúc code nên hiểu trước

```text
src/
  components/
    common/         # component dùng lại nhiều nơi
    layout/         # Header, Footer, MainLayout
  features/         # từng màn hình / module theo chức năng
  redux/
    slices/         # state theo domain
    store/          # cấu hình Redux store
    hooks.js        # useAppDispatch, useAppSelector
  router/           # định nghĩa route
  services/api/     # axios client + API functions
  utils/            # formatter, mock data
```

Triết lý tổ chức hiện tại là `feature-first`, nhưng phần state và API vẫn giữ riêng để dễ đọc:

- UI ở `features/`
- call API ở `services/api/`
- state async ở `redux/slices/`

## 7. Những màn hình đang có

### Public route

- `/login`: trang đăng nhập

### Protected route

- `/dashboard`: tổng quan KPI
- `/heatmap`: bản đồ nhiệt
- `/analytics`: phân tích zone
- `/management/cameras`: cấu hình camera
- `/management/zones`: cấu hình zone
- `/management/users`: quản lý người dùng
- `/management/rules`: cấu hình rule
- `/management/products`: placeholder
- `/settings`: placeholder
- `/privacy`: placeholder
- `/docs`: placeholder

Rule hiện tại:

- Nếu chưa đăng nhập, user bị chuyển về `/login`
- Nếu đã đăng nhập mà vào `/login`, user bị chuyển về `/dashboard`

## 8. Auth đang vận hành như thế nào

Auth hiện tại chưa gọi backend thật. Nó chạy bằng mock service trong:

- `src/services/api/authApi.js`

### LocalStorage keys đang dùng

- `storelens.auth.users`: danh sách user mock
- `storelens.auth.session`: phiên đăng nhập hiện tại
- `authToken`: token dùng cho axios interceptor

### Tài khoản mẫu

- `admin@storelens.vn / admin123`
- `manager@storelens.vn / manager123`

### Cách auth flow chạy

1. User đăng nhập ở `/login`
2. `authSlice` gọi `loginUser()`
3. Session được lưu vào `localStorage`
4. Router bootstrap session bằng `getStoredSession()`
5. Axios tự gắn `Authorization` nếu có `authToken`
6. Nếu API trả `401`, client xóa token và chuyển về `/login`

### Phân quyền hiện tại

- `admin`: có thể tạo user mới
- `manager`: đăng nhập được nhưng không có quyền tạo user
- `staff`: đã hỗ trợ về model dữ liệu, nhưng hiện chưa có account seed mặc định

## 9. State management đang hoạt động ra sao

Redux store nằm ở:

- `src/redux/store/index.js`

Store hiện có 4 slice chính:

- `auth`
- `dashboard`
- `heatmap`
- `zone`

Quy ước hiện tại:

- Mỗi domain có một slice riêng
- Async call dùng `createAsyncThunk`
- Component page gọi thunk qua `useAppDispatch()`
- Component đọc state qua `useAppSelector()`

Pattern đang dùng gần như thống nhất là:

1. Page mount
2. Dispatch thunk load dữ liệu
3. Slice cập nhật `loading`, `error`, `data`
4. UI render theo state đó

## 10. API layer và mock-first mindset

API client nằm ở:

- `src/services/api/client.js`

Nhiệm vụ của file này:

- Cấu hình `baseURL`
- Set timeout
- Tự gắn auth token
- Handle `401`

### Base URL mặc định

Nếu không có env, app sẽ dùng:

```text
http://localhost:5000/api
```

### Mock-first đang được dùng ở đâu

Ví dụ rõ nhất là heatmap:

- `src/services/api/heatmapApi.js`

Nếu request lỗi hoặc backend không chạy:

- app không crash
- thay vào đó trả về mock heatmap

Điều này rất quan trọng với vibe code hiện tại:

- ưu tiên nhìn thấy UI chạy được trước
- backend có thể nối sau

## 11. Các nhóm feature và cách hiểu nhanh

### Dashboard

Mục tiêu:

- hiển thị KPI tổng quan của store

Thường liên quan tới:

- `dashboardSlice`
- `dashboardApi`
- `utils/formatters`

### Heatmap

Mục tiêu:

- hiển thị mật độ di chuyển/đứng của khách hàng

Đặc điểm:

- có fallback mock data
- có timeline và phần chọn khoảng thời gian

### Analytics

Mục tiêu:

- so sánh hiệu quả giữa các zone

### Zone Manager

Mục tiêu:

- cấu hình vùng ROI trên camera

Đặc điểm:

- UI thiên về thao tác studio
- dữ liệu zone đang lưu local để demo

### Camera Manager

Mục tiêu:

- quản lý danh sách camera và thông tin RTSP

### Rule Configuration

Mục tiêu:

- tạo và chỉnh các rule nghiệp vụ

### Manager Users

Mục tiêu:

- admin tạo manager/staff mới

## 12. Khi muốn thêm một feature mới thì làm thế nào

Luồng nên đi theo thứ tự này:

1. Tạo page mới trong `src/features/TenFeature/`
2. Nếu có API, thêm file vào `src/services/api/`
3. Nếu có async state, tạo slice trong `src/redux/slices/`
4. Nối reducer vào `src/redux/store/index.js`
5. Thêm route trong `src/router/index.jsx`
6. Nếu cần vào menu, cập nhật `Header`
7. Nếu backend chưa có, tạo fallback mock đủ dùng để UI không bị chặn

Nếu feature có blueprint trong `docs/`, nên code theo blueprint đó trước rồi mới tinh chỉnh UI.

## 13. Cách ra quyết định trong vibe code này

Đây là các nguyên tắc đang thấy rõ từ codebase hiện tại:

### 1. UI phải chạy được trước

Nếu backend chưa sẵn sàng thì dùng mock data hoặc local persistence.

### 2. Mỗi màn hình là một feature độc lập

Không dồn toàn bộ logic vào component chung.

### 3. State async phải đi qua slice

Tránh gọi API lộn xộn trực tiếp ở nhiều nơi nếu dữ liệu thuộc một domain chính.

### 4. Header và Router là nguồn sự thật cho navigation

Muốn thêm màn hình mới mà user nhìn thấy được, thường phải sửa cả hai chỗ này.

### 5. Layout dùng lại, page thay đổi

Giữ `MainLayout` ổn định, thay logic ở từng feature page.

## 14. Những chỗ cần cẩn thận khi sửa

### Auth

- Đừng đổi localStorage key nếu chưa migrate dữ liệu cũ
- Đừng bỏ `authToken` nếu axios interceptor còn phụ thuộc vào nó

### Router

- Kiểm tra kỹ public route và protected route
- Tránh tạo route mới mà quên thêm link vào Header nếu đó là màn hình quản trị

### Redux

- Thêm slice mới thì phải nối vào store
- Nếu dùng thunk, nên có `loading` và `error` rõ ràng

### Mock data

- Nếu backend chưa có, đừng để UI nổ `Network Error`
- Nên fallback ở tầng API thay vì hack trực tiếp ở component

## 15. Cách debug nhanh khi app lỗi

### App không lên

Kiểm tra:

- `npm install`
- `npm run dev`
- lỗi import sai extension hoặc sai path

### Bị đá về login liên tục

Kiểm tra:

- `localStorage` có `storelens.auth.session` không
- `authToken` có bị xóa bởi interceptor không
- route có đang đi qua `ProtectedLayout` không

### Heatmap báo lỗi backend

Hiện tại heatmap đã có fallback mock. Nếu vẫn lỗi, kiểm tra:

- `src/services/api/heatmapApi.js`
- `src/services/api/client.js`
- env `VITE_API_BASE_URL`

### UI có dữ liệu sai hoặc không refresh

Kiểm tra lần lượt:

1. thunk có dispatch chưa
2. slice có nhận fulfilled action chưa
3. selector có đọc đúng state chưa
4. API layer có đang trả mock hay data thật

## 16. Nếu cần nối backend thật

Khi chuyển từ mock sang backend thật, thứ tự nên là:

1. Giữ nguyên UI page
2. Giữ nguyên contract trả về của slice nếu có thể
3. Thay implementation trong `services/api/`
4. Chỉ bỏ fallback mock khi backend đã ổn định

Làm như vậy sẽ ít phá UI nhất.

## 17. Tóm tắt ngắn cho người mới

Nếu chỉ cần nhớ nhanh, hãy nhớ 6 ý này:

1. Đây là frontend retail analytics chạy bằng React + Vite + Redux.
2. Source hiện tại là JavaScript, không còn TypeScript.
3. Route và auth nằm ở `src/router/index.jsx`.
4. State chính nằm ở `src/redux/slices/`.
5. API và fallback mock nằm ở `src/services/api/`.
6. Khi thêm feature mới, hãy đi theo luồng: `feature -> api -> slice -> store -> route -> header`.

---

Nếu bạn là người mới tiếp quản repo này, nên đọc theo thứ tự sau:

1. `src/router/index.jsx`
2. `src/redux/store/index.js`
3. `src/components/layout/MainLayout.jsx`
4. từng page trong `src/features/`
5. các file trong `src/services/api/`

Như vậy bạn sẽ hiểu project nhanh nhất mà không bị lạc vào chi tiết sớm.