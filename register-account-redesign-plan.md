# Kế hoạch redesign giao diện đăng ký tài khoản

## Mục tiêu

Thiết kế lại giao diện đăng ký tài khoản theo style **Glassline**: nền xám sương, card trắng, typography rõ ràng, chỉ dùng cobalt `#2C5EF5` cho hành động chính.

## Kết luận kiến trúc

**Khuyến nghị: sửa trực tiếp component hiện có `RegisterAccountComponent`, không tạo component mới.**

Lý do:
- Route `/register-account` đang trỏ thẳng tới component hiện tại.
- Logic form, validate, gửi API, trạng thái thành công/tài khoản đã tồn tại đã nằm trong component này.
- Tạo component mới sẽ phải copy/di chuyển logic, tăng rủi ro lỗi luồng đăng ký/xác thực.
- Nhu cầu hiện tại là redesign UI, không đổi nghiệp vụ.

## File liên quan

- `src/app/modules/public/features/home-thi-thpt/layouts/register-account/register-account.component.html`
- `src/app/modules/public/features/home-thi-thpt/layouts/register-account/register-account.component.css`
- `src/app/modules/public/features/home-thi-thpt/layouts/register-account/register-account.component.ts`
- `src/app/modules/public/public-routing.module.ts`
- `src/app/modules/public/features/home-thi-thpt/home-thi-thpt.module.ts`

## Phạm vi thay đổi đề xuất

### 1. HTML layout

Sửa `register-account.component.html`:
- Giữ nguyên `formGroup`, `formControlName`, `ngSwitch`, click handlers.
- Bỏ inline style nhiều nhất có thể.
- Tổ chức lại giao diện thành 2 vùng:
  - Vùng giới thiệu bên trái: tiêu đề, mô tả ngắn, các điểm nhấn.
  - Card form bên phải: form đăng ký, login link, submit state.
- Giữ 3 trạng thái hiện có:
  - `active_regiter = 0`: form đăng ký.
  - `active_regiter = 1`: đăng ký thành công.
  - `active_regiter = 2`: tài khoản đã tồn tại.

### 2. CSS theo Glassline

Sửa `register-account.component.css`:
- Nền chính: `#F1F3F5`.
- Text chính: `#0F1419`.
- Text phụ/border: `#4A5568` với opacity phù hợp.
- CTA chính: `#2C5EF5`.
- Card trắng: `#FFFFFF`, radius `16px`, padding `24px`.
- Input radius `10px`, border nhẹ, focus cobalt.
- Không dùng gradient.
- Không thêm accent khác ngoài cobalt.
- Responsive mobile: 1 cột, card full-width, giảm padding.

### 3. TypeScript

Hạn chế sửa `register-account.component.ts`.

Chỉ sửa nếu cần cho UI/accessibility:
- Có thể thêm helper readonly nếu HTML cần state label rõ hơn.
- Không đổi API call `registerAccount`.
- Không đổi validators.
- Không đổi route verify/login.

### 4. Accessibility/UI states

- Label rõ ràng, input có placeholder hợp lý.
- Nút submit disabled khi form invalid giữ nguyên logic.
- Password visibility button dễ bấm hơn.
- Error password hiển thị gọn trong panel cảnh báo.
- Success/existing-account state dùng cùng design card.

## Thiết kế màn hình đề xuất

```text
┌────────────────────────────────────────────────────────────┐
│ Neutral background #F1F3F5                                 │
│                                                            │
│  ┌──────────── intro ────────────┐ ┌──── register card ──┐ │
│  │ Đăng ký tài khoản             │ │ Đăng ký tài khoản   │ │
│  │ Tạo tài khoản để tham gia...  │ │ CCCD                │ │
│  │ • Xác thực qua email          │ │ Phone               │ │
│  │ • Bảo mật mật khẩu            │ │ Họ tên              │ │
│  │ • Một tài khoản dùng chung    │ │ Email               │ │
│  └───────────────────────────────┘ │ Password            │ │
│                                    │ [Đăng ký]           │ │
│                                    └─────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

## Quy tắc Glassline áp dụng

- Primary `#0F1419`: heading, input text.
- Secondary `#4A5568`: mô tả, label phụ, border.
- Tertiary `#2C5EF5`: chỉ dùng cho nút đăng ký chính + focus ring.
- Neutral `#F1F3F5`: nền trang.
- Surface `#FFFFFF`: card form.
- Không gradient.
- Không thêm màu CTA khác.

## Rủi ro

- CSS global hiện có có thể override PrimeNG/button styles.
- Component đang dùng một số class cũ từ hệ thống (`test-member__from__...`, `login-video__...`) nên cần kiểm tra sau khi đổi style.
- Cần chạy UI thực tế để kiểm tra responsive + trạng thái thành công/tài khoản tồn tại.

## Kế hoạch thực hiện khi được duyệt

1. Backup logic hiện có bằng cách chỉ sửa HTML/CSS trước.
2. Refactor markup trong `register-account.component.html` nhưng giữ binding/handler.
3. Viết lại CSS theo Glassline trong `register-account.component.css`.
4. Chạy build/type check: `npm run build`.
5. Chạy app, mở `/register-account`, test:
   - Form empty → nút disabled/cảnh báo.
   - Input invalid → error state.
   - Password show/hide.
   - Responsive mobile.
   - Submit state loading/success nếu API sẵn sàng.
6. Nếu có lỗi build/UI → sửa tối thiểu.
7. Review code sau khi sửa.

## Chưa thực hiện

Chưa sửa code. File này chỉ là kế hoạch để bạn kiểm tra trước khi bắt đầu redesign.
