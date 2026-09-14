# Kế hoạch Thực hiện: Output Event khi Cập nhật Thành công

## 1. Yêu cầu & Mục đích
- Bắn sự kiện ra ngoài component cha (`thong-ke-tram`) khi form cập nhật thông tin user thành công.
- Component cha nhận được sự kiện để tự động đóng side navigation và tải lại danh sách dữ liệu.

## 2. Phân tích hiện trạng
- Component con: `FormUpdateUserComponent` (`form-update-user.component.ts`)
  - Hiện tại: Trong method `btnUpdate()`, sau khi gọi `userService.updateUserInfo()` thành công (nhánh `next`), chỉ hiển thị thông báo `toastSuccess` và set lại state nội bộ, **chưa emit sự kiện gì ra ngoài**.
- Component cha: `ThongKeTramComponent` (`thong-ke-tram.component.html`)
  - Template chứa form:
    ```html
    <app-form-update-user class="d-block h-100" [User]="userSelect"></app-form-update-user>
    ```
  - Trong TS cha đã có method xử lý đóng & reload:
    ```typescript
    closeForm() {
      this.notifi.closeSideNavigationMenu();
      this.onSelectKehoachThi(this.dotthi_select.id);
    }
    ```

## 3. Chi tiết Thay đổi Dự kiến

### Bước 1: `form-update-user.component.ts`
1. Import thêm `Output`, `EventEmitter` từ `@angular/core`.
2. Khai báo Output event:
   ```typescript
   @Output() updateSuccess = new EventEmitter<void>();
   ```
3. Trong `btnUpdate()`, tại callback `next` sau khi cập nhật thành công:
   ```typescript
   this.notifi.toastSuccess('Cập nhật tài khoản thành công');
   this.isSubmitting = false;
   this.updateSuccess.emit(); // Phát sự kiện ra ngoài
   ```
   *(Lưu ý: Chỉ emit ở nhánh `next`. Nhánh `error` giữ form mở, không emit.)*

### Bước 2: `thong-ke-tram.component.html`
- Lắng nghe event từ component con trong template `#formUser`:
  ```html
  <app-form-update-user 
    class="d-block h-100" 
    [User]="userSelect"
    (updateSuccess)="closeForm()">
  </app-form-update-user>
  ```

## 4. Kiểm thử & Đánh giá rủi ro
- **Rủi ro:** Thấp. Menu đóng ngay cả khi API `onSelectKehoachThi` gặp sự cố mạng (cần reload lại trang nếu lỗi mạng).
- **Kiểm tra:**
  1. Mở cập nhật tài khoản trên giao diện thống kê trạm.
  2. Bấm "Cập nhật" thành công -> Form hiển thị toast thành công -> Tự động đóng side menu -> Dữ liệu bảng thống kê tự reload dữ liệu mới nhất.
  3. Bấm "Cập nhật" khi API lỗi -> Hiển thị toast lỗi, form giữ nguyên, menu không đóng, không reload.
