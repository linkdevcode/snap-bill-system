DIRECTIVE: Tiến hành triển khai PHASE 1: Khởi tạo hệ thống Types, Core State và Layout cơ bản cho SnapBill theo đúng @SnapBill_Specification.md và @.cursorules.

Hãy thực hiện từng bước một cách trọn vẹn, không viết mã giả (pseudo-code) hay dùng placeholder loang lổ (// TODO). 

### BƯỚC 1: ĐỊNH NGHĨA TYPE SYSTEM (Strict TypeScript)
Tạo file `@/types/invoice.ts` chứa toàn bộ các interface sau (Tuyệt đối không dùng 'any'):
- LineItem (id, description, quantity, unit_price)
- SenderData (company_name, sender_name, email, address, tax_id)
- ClientData (client_name, client_email, client_address)
- InvoiceStatus ('draft' | 'sent' | 'paid' | 'overdue')
- Invoice (Tổ hợp tất cả các trường trên kèm id, invoice_number, status, issue_date, due_date, tax_rate, discount_rate, subtotal, total_amount, notes)

### BƯỚC 2: THIẾT LẬP CORE STATE MACHINE (React Context)
Tạo file `@/context/InvoiceContext.tsx`:
- Thiết lập `InvoiceProvider` và custom hook `useInvoice()` để quản lý toàn bộ state của hóa đơn đang tạo.
- Định nghĩa các hàm handler: `updateSenderData`, `updateClientData`, `updateInvoiceMeta`, `addItem` (thêm dòng trống), `updateItem` (cập nhật dòng theo id), `deleteItem` (xóa dòng).
- *Yêu cầu tính toán:* Tự động tính toán lại `subtotal`, tiền thuế, tiền discount, và `total_amount` bằng `useMemo` mỗi khi danh sách `items`, `tax_rate`, hoặc `discount_rate` thay đổi.

### BƯỚC 3: XÂY DỰNG LAYOUT SHELL (Chống CLS & Hydration)
Tạo trang `@/app/page.tsx` làm màn hình chính:
- Bọc toàn bộ trang trong `InvoiceProvider`.
- Giao diện chia làm 2 cột rõ rệt trên Desktop (Cột trái: Form nhập liệu / Cột phải: Khung preview A4) và xếp chồng trên Mobile.
- Import các component con (`InvoiceEditor`, `InvoicePreview`) bằng `next/dynamic` với `{ ssr: false }` để chống lỗi lệch Hydration ngay từ đầu.
- Tạo sẵn 2 khu vực Placeholder cố định kích thước (`min-h-[90px]` ở đầu trang và `min-h-[600px]` ở sidebar) dành cho `AdSlot` sau này để chống CLS.

=================
DIRECTIVE: Tiến hành triển khai PHASE 2: Hoàn thiện tương tác Form động, Xử lý Logo và Tích hợp Động cơ xuất PDF cho SnapBill theo đúng @SnapBill_Specification.md và @.cursorules.

Hãy triển khai mã nguồn chi tiết, hoàn chỉnh cho các phần việc sau, không dùng mã giả hay placeholder:

### BƯỚC 1: NÂNG CẤP BẢNG DÒNG SẢN PHẨM ĐỘNG (LineItemsTable.tsx)
Tách logic bảng items từ InvoiceEditor ra thành component `@/components/invoice/LineItemsTable.tsx`:
- Cho phép thêm dòng mới chỉ với 1 click. Ở mỗi dòng, các trường Số lượng (QTY) và Đơn giá (UNIT) phải bắt sự kiện `onChange` để cập nhật lập tức vào Context (đảm bảo tính toán số thập phân chính xác).
- Thêm nút xóa (thùng rác) ở cuối mỗi dòng. Nếu danh sách chỉ còn 1 dòng, nút xóa sẽ ẩn hoặc khi nhấn vào sẽ tự động reset dòng đó về trạng thái trống (không được xóa dòng cuối cùng để tránh lỗi giao diện).

### BƯỚC 2: XỬ LÝ LOGO SENDER (Base64 Client-Side Uploader)
Tại phần thông tin SENDER trong `InvoiceEditor.tsx`:
- Thêm một khu vực kéo thả hoặc nút bấm để người dùng chọn ảnh Logo (.png, .jpg).
- Sử dụng đối tượng `FileReader` của JavaScript để chuyển đổi file ảnh vừa chọn thành chuỗi mã hóa **Base64 String** ngay tại client-side.
- Lưu chuỗi Base64 này vào trường `logo_url` thông qua handler `updateSenderData` của Context để `InvoicePreview` có thể hiển thị ảnh logo lập tức theo thời gian thực. Nếu không upload, khung logo trên bản xem trước sẽ tự động ẩn đi hoàn toàn một cách gọn gàng.

### BƯỚC 3: NHÚNG ĐỘNG CƠ XUẤT FILE PDF CHUẨN IN ẤN
Cài đặt/Tích hợp giải pháp xuất file PDF trực tiếp tại Client-Side (khuyến nghị dùng thư viện nhẹ như `html2pdf.js` hoặc cấu trúc kết hợp `html2canvas` + `jspdf` chạy mượt trên môi trường Edge):
- Tạo nút "Download PDF" nổi bật trên giao diện chính.
- Khi người dùng nhấn nút, động cơ sẽ chụp chính xác container `#invoice-paper` từ `InvoicePreview`.
- **Yêu cầu Print-CSS đặc biệt:** Phải cấu hình các tùy chọn (options) xuất file sao cho bản PDF tải về là một trang A4 hoàn chỉnh (hoặc tự động ngắt trang sạch sẽ nếu nội dung quá dài), giữ nguyên font chữ, căn lề (margins) chuẩn, không bị vỡ bố cục và ẩn hoàn toàn các đường viền nét đứt (border-dashed) hay các nút điều khiển nếu có.
- Tên file tải về tự động định dạng theo cấu trúc: `Invoice_[InvoiceNumber]_[ClientName].pdf` (lấy dữ liệu từ Context, nếu trống thì mặc định là `Invoice_Draft.pdf`).

==================
DIRECTIVE: Tiến hành triển khai PHASE 3: Tích hợp Supabase Auth, Kết nối Database và Đồng bộ dữ liệu hóa đơn cho SnapBill theo đúng @SnapBill_Specification.md và @.cursorules.

Hãy triển khai mã nguồn chi tiết, hoàn chỉnh cho các phần việc sau dưới local (sử dụng biến môi trường mock trước), không dùng mã giả hay placeholder:

### BƯỚC 1: KHỞI TẠO CẤU HÌNH SUPABASE CLIENT
- Tạo file `@/lib/supabase.ts` (hoặc `@/utils/supabase/client.ts`) để khởi tạo client Supabase sử dụng `createClient` từ thư viện `@supabase/supabase-js`.
- Sử dụng hai biến môi trường: `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY`. 
- Thêm cơ chế kiểm tra (bằng lệnh if) để nếu hai biến này chưa được khai báo trong file `.env.local`, ứng dụng sẽ log ra một cảnh báo nhẹ nhàng thay vì làm sập (crash) toàn bộ ứng dụng dưới local.

### BƯỚC 2: TÍCH HỢP HỆ THỐNG XÁC THỰC (Auth State Provider)
- Tạo một file context mới tên là `@/context/AuthContext.tsx` để quản lý trạng thái đăng nhập của người dùng.
- Theo dõi phiên đăng nhập của user thông qua hàm `supabase.auth.onAuthStateChange`. Cung cấp các thông tin: `user` (đối tượng người dùng hiện tại), `loading` (trạng thái đang check session), `signInWithGoogle` (hàm slot đăng nhập bằng Google OAuth), `signOut` (hàm đăng xuất).
- Thiết kế giao diện Auth Box nhỏ gọn ở góc trên cùng bên phải của Header chính (cạnh thanh AdSense Banner):
  - *Nếu chưa đăng nhập (Guest):* Hiển thị nút "Sign In" và một dòng thông báo nhỏ (Callout banner) màu vàng nhạt bên dưới Form nhập liệu: "Đăng ký tài khoản miễn phí để lưu trữ và quản lý lịch sử hóa đơn vĩnh viễn!".
  - *Nếu đã đăng nhập (Authenticated):* Hiển thị Avatar/Email của User kèm nút "Sign Out".

### BƯỚC 3: ĐỒNG BỘ DỮ LIỆU HÓA ĐƠN LÊN POSTGRES DATABASE
Nâng cấp `@/context/InvoiceContext.tsx` để liên kết trực tiếp với bảng `invoices` của Supabase:
- **Hàm `saveInvoice`:** Thêm một nút "Save to Cloud" trên giao diện. Khi nhấn, nếu user đã đăng nhập, tiến hành đẩy (upsert) toàn bộ dữ liệu hóa đơn hiện tại lên bảng `invoices` của Supabase. Cấu trúc dữ liệu đẩy lên phải tuân thủ nghiêm ngặt định dạng JSONB cho các trường: `sender_data`, `client_data`, và `items` như file spec yêu cầu.
- **Tối ưu trải nghiệm (Optimistic UI):** Khi bấm lưu, lập tức hiển thị trạng thái "Saving..." hoặc Toast thông báo thành công ở client trước để tạo cảm giác không có độ trễ, việc ghi vào DB sẽ chạy ngầm bên dưới.

===========================
DIRECTIVE: Hoàn thiện cấu hình hệ thống Migrations cho dự án SnapBill bằng Supabase CLI theo đúng @SnapBill_Specification.md.

Hãy tạo file migration create_invoices_table.sql trong đường dẫn `supabase/migrations/` và thực hiện các bước sau (viết code đầy đủ, không dùng mã giả):

1. Điền toàn bộ cấu trúc schema SQL của bảng `invoices` vào file migration đó, bao gồm:
   - Tạo bảng `public.invoices` với các trường dữ liệu chuẩn spec (các trường metadata, totals, notes và đặc biệt là các trường JSONB: `sender_data`, `client_data`, `items`).
   - Kích hoạt Row Level Security (RLS) cho bảng này.
   - Tạo đầy đủ 4 chính sách bảo mật (Policies) để cô lập dữ liệu: Cho phép người dùng authenticated chỉ được phép SELECT, INSERT, UPDATE, DELETE các bản ghi thỏa mãn điều kiện `auth.uid() = user_id`.

2. Kiểm tra và cập nhật file `.env.example` để bổ sung các biến cấu hình cần thiết nếu có khi chạy DB Migration.

3. Sau khi viết xong file SQL, hãy tóm tắt lại cấu trúc file và cung cấp duy nhất 1 lệnh CLI chính xác để tôi chạy trên Terminal nhằm đẩy (push) toàn bộ file migration này lên database Supabase Production.

======================