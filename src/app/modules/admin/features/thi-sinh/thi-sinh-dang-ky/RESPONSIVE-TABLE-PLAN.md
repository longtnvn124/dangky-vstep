# Kế hoạch thiết kế responsive bảng đăng ký thi

## 1. Mục tiêu

Thiết kế lại bảng **Danh sách đăng ký thi** cho màn hình nhỏ hơn `780px`:

- Không xuất hiện thanh cuộn ngang.
- Giữ nguyên toàn bộ dữ liệu đang hiển thị.
- Giữ nguyên mọi điều kiện nghiệp vụ và thao tác hiện có.
- Không thay đổi giao diện bảng trên màn hình từ `780px` trở lên.
- Ưu tiên chỉ sửa HTML và CSS; không sửa TypeScript nếu không cần thiết.

## 2. Hiện trạng

Bảng hiện có 7 cột:

1. TT.
2. Mã đăng ký.
3. Đợt thi.
4. Điểm dự thi.
5. Lệ phí thi.
6. Trạng thái.
7. Thao tác.

Một số ô dùng class chiều rộng cố định như `ovic-w-100px`, `ovic-w-180px`, `ovic-w-260px`. Tổng chiều rộng nội dung lớn hơn màn hình điện thoại, gây tràn hoặc cuộn ngang.

Cột thao tác có nhiều nhánh hiển thị:

- Đăng ký do tài khoản cha thực hiện.
- Thanh toán cho tài khoản con.
- Xem phiếu đăng ký điện tử.
- Hủy dự thi.
- Xóa đăng ký.
- Chờ duyệt thông tin trước khi thanh toán.
- Thông báo đã hủy dự thi.

Tất cả nhánh này phải được giữ nguyên.

## 3. Hướng thiết kế

### Desktop và tablet lớn (`>= 780px`)

Giữ nguyên bảng 7 cột hiện tại.

### Mobile (`< 780px`)

Mỗi dòng dữ liệu được trình bày như một thẻ thông tin dọc. Không tạo component hoặc danh sách dữ liệu thứ hai. Vẫn dùng cùng một `p-table`, cùng một template dòng, cùng các điều kiện `*ngIf` và click handler hiện tại.

Mockup:

```text
┌──────────────────────────────────┐
│ ĐĂNG KÝ #123              STT 01 │
├──────────────────────────────────┤
│ Đợt thi                          │
│ Kỳ thi đánh giá năng lực...      │
│                                  │
│ Điểm dự thi                      │
│ Trường Đại học ...               │
│                                  │
│ Lệ phí thi              500.000đ │
│ Trạng thái      [Chưa thanh toán]│
├──────────────────────────────────┤
│ [Thanh toán]  [Xóa]              │
└──────────────────────────────────┘
```

Cấu trúc trực quan:

- Phần đầu card: mã đăng ký nổi bật, số thứ tự gọn bên cạnh.
- Phần nội dung: đợt thi và điểm dự thi hiển thị toàn chiều rộng, cho phép xuống dòng.
- Phần tài chính/trạng thái: nhãn bên trái, giá trị bên phải khi đủ chỗ; tự xếp dọc trên màn hình rất hẹp.
- Phần thao tác: nằm cuối card, các nút tự xuống dòng; không bị cắt.
- Mỗi trường vẫn có nhãn rõ ràng, không phụ thuộc header đã ẩn khỏi phần nhìn.

## 4. Thay đổi dự kiến

### `thi-sinh-dang-ky.component.html`

1. Thêm class riêng cho bảng, ví dụ `registration-table`.
2. Thêm `scope="col"` cho các header.
3. Thêm class theo vai trò cho từng ô để CSS mobile định vị chính xác:
   - `registration-table__index`
   - `registration-table__id`
   - `registration-table__exam`
   - `registration-table__location`
   - `registration-table__fee`
   - `registration-table__status`
   - `registration-table__actions`
4. Thêm `<span class="registration-table__label" aria-hidden="true">` trong từng ô để hiển thị nhãn mobile; header bảng vẫn cung cấp ngữ nghĩa cho screen reader.
5. Thêm class riêng cho empty state.
6. Bổ sung `aria-label` cho các nút chỉ có icon; giữ nguyên `pTooltip`.
7. Không sửa:
   - Binding dữ liệu.
   - Pipe định dạng.
   - Các `*ngIf`, `ng-template`, `else`.
   - Click handler.
   - Trạng thái loading.

### `thi-sinh-dang-ky.component.css`

Thêm media query:

```css
@media (width < 780px) {
  /* Responsive card layout */
}
```

Trong breakpoint này:

1. Giới hạn wrapper và bảng ở `max-width: 100%`.
2. Loại bỏ ảnh hưởng của chiều rộng cố định trên các ô.
3. Ẩn header bảng khỏi phần nhìn nhưng vẫn giữ nội dung cho công nghệ hỗ trợ.
4. Chuyển mỗi `tr` thành card dạng CSS Grid.
5. Hiển thị `.registration-table__label` trong mỗi ô; ẩn nhãn này trên desktop.
6. Cho nội dung dài xuống dòng bằng `min-width: 0` và `overflow-wrap: anywhere`.
7. Cho nhóm nút `flex-wrap: wrap`.
8. Hiển thị empty state thành một khối toàn chiều rộng.
9. Kiểm soát paginator để không gây tràn ở màn hình hẹp.
10. Chỉ dùng `:host ::ng-deep` trong phạm vi `.registration-table` nếu ViewEncapsulation không thể tác động DOM do PrimeNG sinh ra.

### `thi-sinh-dang-ky.component.ts`

Không dự kiến thay đổi.

## 5. Nguyên tắc giữ nguyên nghiệp vụ

- Không tạo bản sao riêng của bảng cho mobile.
- Không tạo thêm mảng dữ liệu mobile.
- Không thay đổi tên thuộc tính trong `dataOrders`.
- Không thay đổi thứ tự hoặc điều kiện xuất hiện của thao tác.
- Không thay đổi điều kiện thanh toán, hủy, xóa, xem phiếu hoặc chờ duyệt.
- Không thay đổi phân trang.

Cách này tránh hai template desktop/mobile bị lệch nghiệp vụ về sau.

## 6. Accessibility

- Giữ phần tử bảng thật trong DOM.
- Header vẫn tồn tại cho screen reader.
- Nút icon có tên truy cập rõ ràng qua `aria-label`.
- Thứ tự tab giữ theo thứ tự thao tác hiện tại.
- Focus không bị cắt bởi card hoặc wrapper.
- Màu sắc không phải dấu hiệu duy nhất; nội dung trạng thái bằng chữ vẫn được giữ nguyên.

## 7. Kiểm thử sau triển khai

### Viewport

- `320px`.
- `360px`.
- `375px`.
- `390px`.
- `412px`.
- `768px`.
- `779px`.
- Ranh giới `780px`.
- Desktop `1024px`, `1366px`.

### Trường hợp dữ liệu

- Không có dữ liệu.
- Một bản ghi và nhiều bản ghi.
- Tên đợt thi rất dài.
- Tên điểm dự thi rất dài.
- Bản ghi có tài khoản cha.
- Tài khoản con được phép thanh toán.
- Đã thanh toán, chưa hủy.
- Đã thanh toán, đã hủy.
- Chưa thanh toán, đã duyệt.
- Chưa thanh toán, chờ duyệt.
- Loading và lỗi tải dữ liệu.
- Paginator có nhiều trang.

### Tiêu chí nghiệm thu

- Không có cuộn ngang ở mọi viewport dưới `780px`.
- `document.documentElement.scrollWidth <= window.innerWidth`.
- Mỗi bản ghi hiển thị đủ 7 trường cũ.
- Nội dung dài xuống dòng, không bị cắt.
- Tất cả nút vẫn hiển thị đúng điều kiện và gọi đúng handler.
- Empty state hiển thị đúng.
- Paginator không tràn màn hình.
- Giao diện từ `780px` trở lên không bị thay đổi.
- Build Angular thành công.
- Kiểm tra trực tiếp bằng trình duyệt sau khi chạy dev server.

## 8. Thứ tự triển khai sau khi duyệt

1. Bổ sung class, nhãn mobile, `scope` và `aria-label` trong HTML.
2. Thêm CSS card responsive dưới `780px`.
3. Chạy build hoặc kiểm tra TypeScript/template.
4. Chạy ứng dụng, kiểm tra trực tiếp các viewport mobile và desktop.
5. Sửa lỗi tràn hoặc sai bố cục nếu phát hiện.
6. Review diff, xác nhận không thay đổi nghiệp vụ.
