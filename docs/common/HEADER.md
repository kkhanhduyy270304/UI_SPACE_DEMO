# SpaceLens Blueprint: Tinh Chinh Header

## 1. Muc tieu
Tinh chinh [src/components/layout/Header.jsx](src/components/layout/Header.jsx) thanh giao dien Header chuyen nghiep, gon gang va de mo rong.

Yeu cau chinh:
- Su dung bo cuc 3 cot (Trai / Giua / Phai).
- Khong su dung tieu de dong theo route path.
- Toan bo text hien thi trong Header uu tien tieng Viet.

## 2. Tieu chuan giao dien va ky thuat
- Aesthetic: Glassmorphism nhe voi `backdrop-blur-md`, `bg-white/80`, `border-slate-200`.
- Bo cuc:
  - Trai: Logo + tieu de co dinh + menu dieu huong.
  - Giua: O tim kiem (an tren mobile).
  - Phai: Trang thai he thong + thong bao + tai khoan.
- Redux:
  - Lay thong tin nguoi dung tu `state.auth`.
- Routing:
  - Dung `useLocation` de xac dinh active menu.
  - Khong render page title dong theo duong dan.

## 3. Nhiem vu thuc thi
### Buoc 1: Tieu de co dinh
- Thay logic map path -> title bang tieu de co dinh, vi du: "Trung tam dieu hanh".

### Buoc 2: Header UI
- Container: `h-16 sticky top-0 z-50 border-b border-slate-200`.
- Search bar: `rounded-full`, `bg-slate-50`, `border-slate-200`, placeholder tieng Viet.
- Notification: icon chuong + popover.
- Profile:
  - Hien thi ten va vai tro nguoi dung.
  - Dropdown gom "Cai dat" va "Dang xuat".

### Buoc 3: Mobile
- Co nut `Menu` o ben trai (chi hien tren `lg:hidden`).
- O tim kiem an tren mobile.

## 4. Rang buoc
- Su dung Lucide React cho icon.
- Uu tien bang mau slate theo config hien tai.
- Header phai hoat dong tot cung [src/components/layout/MainLayout.jsx](src/components/layout/MainLayout.jsx) va khong de text bi de len nhau.
