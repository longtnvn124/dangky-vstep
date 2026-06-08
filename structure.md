# Cấu trúc project `dkVstep`

## 1. Tổng quan

Project là ứng dụng Angular 14.

- Framework chính: Angular `^14.x`
- Ngôn ngữ: TypeScript `~4.7.2`
- UI/libs nổi bật: Angular Material, PrimeNG, Bootstrap, ng-bootstrap, Quill, ApexCharts, Mapbox, PDF/Excel libs
- Entry app: `src/main.ts`
- Root module: `src/app/app.module.ts`
- Root routing: `src/app/app-routing.module.ts`

## 2. Scripts chính

Trong `package.json`:

```json
{
  "start": "ng serve -o --port=8008",
  "build": "ng build --aot",
  "watch": "ng build --watch --configuration development",
  "test": "ng test"
}
```

Ý nghĩa:

- `npm start`: chạy dev server tại port `8008`, tự mở browser.
- `npm run build`: build AOT, mặc định dùng production config theo `angular.json`.
- `npm test`: chạy test bằng Karma/Jasmine.

## 3. Cấu hình Angular workspace

File chính: `angular.json`

Project name: `dkVstep`

Các cấu hình quan trọng:

- `sourceRoot`: `src`
- `outputPath`: `dist/dkVstep`
- `index`: `src/index.html`
- `main`: `src/main.ts`
- `polyfills`: `src/polyfills.ts`
- `tsConfig`: `tsconfig.app.json`
- assets:
  - `src/favicon.ico`
  - `src/assets`
- styles chính:
  - `src/custom-theme.scss`
  - `src/styles.css`
  - nhiều CSS trong `src/assets/css/`
  - PrimeNG theme/icons
  - Quill/viewer/plyr/solid-slider CSS
- scripts global:
  - `node_modules/quill/dist/quill.js`
  - `node_modules/jquery/dist/jquery.min.js`

## 4. Routing cấp root

File: `src/app/app-routing.module.ts`

```ts
const routes: Routes = [
  {
    path: 'admin',
    canActivate: [ModuleGuard],
    loadChildren: () => import('@modules/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: '',
    loadChildren: () => import('@modules/public/public.module').then(m => m.PublicModule)
  },
  {
    path: '**',
    redirectTo: 'test',
    pathMatch: 'full'
  }
];
```

Luồng chính:

- `/admin` → lazy load `AdminModule`, có `ModuleGuard`.
- `/` → lazy load `PublicModule`.
- route không khớp → redirect `test`.

## 5. Root module

File: `src/app/app.module.ts`

Root module khai báo:

- `AppComponent`
- Core popup/confirm/alert components
- Pipes dùng toàn app
- Translate loader
- PrimeNG Toast/Button/Ripple
- ng-bootstrap
- ApexCharts
- HTTP interceptor: `InterceptorsService`
- Provider lưu file: `SAVER`
- Quill image/video resize modules

## 6. Cây thư mục chính

```text
src/
├── app/
│   ├── app-routing.module.ts
│   ├── app.component.css
│   ├── app.component.html
│   ├── app.component.ts
│   ├── app.module.ts
│   ├── core/
│   │   ├── components/
│   │   │   ├── alert/
│   │   │   ├── confirm/
│   │   │   ├── confirm-delete/
│   │   │   ├── confirm-rounded/
│   │   │   └── popup/
│   │   ├── guards/
│   │   ├── models/
│   │   ├── pipes/
│   │   ├── providers/
│   │   ├── services/
│   │   └── utils/
│   └── modules/
│       ├── admin/
│       ├── public/
│       ├── shared/
│       └── ovic-svg/
├── assets/
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
├── index.html
├── main.ts
├── polyfills.ts
├── styles.css
└── custom-theme.scss
```

## 7. `src/app/core`

Thư mục dùng chung cấp toàn app.

```text
core/
├── components/
├── guards/
├── models/
├── pipes/
├── providers/
├── services/
└── utils/
```

Vai trò:

- `components/`: component dùng chung dạng hệ thống: alert, confirm, popup.
- `guards/`: bảo vệ route, ví dụ `ModuleGuard`.
- `models/`: interface/type model dùng chung: auth, user, role, profile, dto, message, socket...
- `pipes/`: pipe dùng chung: safe HTML, translate button.
- `providers/`: provider inject, ví dụ saver provider.
- `services/`: service dùng chung: profile, role, notification, theme, window ref, HTTP params helper...
- `utils/`: base component/table, validators, browser signature, syscat, decorator...

## 8. `src/app/modules`

Các module nghiệp vụ chính.

```text
modules/
├── admin/
├── public/
├── shared/
└── ovic-svg/
```

### 8.1. `modules/admin`

Khu vực quản trị/nghiệp vụ sau đăng nhập.

Cấu trúc chính:

```text
admin/
├── dashboard/
│   ├── menu-language/
│   └── user-info/
└── features/
    ├── content-none/
    ├── danh-muc/
    ├── he-thong/
    ├── home/

```

Nhóm chức năng chính:

- `dashboard/`: layout dashboard, menu ngôn ngữ, thông tin user.
- `he-thong/`: quản lý hệ thống, tài khoản, phân quyền dữ liệu.
- `danh-muc/`: quản lý danh muc.
- `ovic-message/`: chat/notification nội bộ, có components/models/pipes/services riêng.
- `home/`, `new-home/`: màn hình trang chủ/admin dashboard.

### 8.2. `modules/public`

Khu vực public/chưa đăng nhập.

Cấu trúc chính:

```text
public/
└── features/
    ├── clear/
    ├── content-none/
    ├── dev/
    ├── home-thi-thpt/
    ├── login/
    ├── login-v2/
    ├── login-video/
    ├── reset-password/
    ├── tra-cuu-ket-qua/
    └── unauthorized/
```

Nhóm chức năng chính:

- `login/`, `login-v2/`, `login-video/`: đăng nhập.
- `reset-password/`: đặt lại mật khẩu.
- `home-thi-thpt/`: trang home public, gồm layout đăng ký tài khoản/xác thực.
- `unauthorized/`: trang không có quyền.


### 8.3. `modules/shared`

Khu vực module/component/service dùng chung cho các module nghiệp vụ.

Chưa phân tích sâu nội dung chi tiết trong lần scan này.

### 8.4. `modules/ovic-svg`

Khu vực liên quan SVG/icon/module riêng.

Chưa phân tích sâu nội dung chi tiết trong lần scan này.

## 9. `src/assets`

Chứa static assets.

Theo `angular.json`, nhiều CSS global lấy từ:

```text
src/assets/css/
├── bootstrap.min.css
├── gradient-bg.css
├── uicon.css
├── uil-icon.css
├── font-awesome.min.css
├── admin-dashboard.css
├── base.css
├── animation-loading.css
├── style.css
├── quill-convent.css
└── secondary.css
```

Ngoài CSS, thư mục này thường chứa ảnh, icon, font, file i18n hoặc tài nguyên public khác.

## 10. `src/environments`

```text
environments/
├── environment.ts
└── environment.prod.ts
```

- `environment.ts`: config dev/default.
- `environment.prod.ts`: config production, được thay thế khi build production qua `fileReplacements` trong `angular.json`.

## 11. Import alias

Project đang dùng alias dạng:

```ts
@core/...
@modules/...
@shared/...
```

Ví dụ:

```ts
import { ModuleGuard } from '@core/guards/module.guard';
loadChildren: () => import('@modules/admin/admin.module').then(m => m.AdminModule)
```

Alias được cấu hình trong `tsconfig.json` hoặc tsconfig liên quan.

## 12. Gợi ý khi đọc/sửa code

Thứ tự nên kiểm tra khi sửa chức năng:

1. Tìm route trong module tương ứng.
2. Tìm component `.component.ts/html/css` của màn hình.
3. Tìm service gọi API trong cùng feature hoặc `core/services`/`shared`.
4. Tìm model/interface trong `core/models` hoặc thư mục feature.
5. Kiểm tra interceptor/auth guard nếu lỗi liên quan đăng nhập/quyền.
6. Chạy build/test sau khi sửa.

## 13. Lệnh chạy kiểm tra

Chạy dev:

```bash
npm start
```

Build:

```bash
npm run build
```

Test:

```bash
npm test
```

Dev server mặc định chạy port `8008` theo script `start`.

## 14. Ghi chú hiện trạng scan

File này được tạo từ cấu trúc hiện tại của project, tập trung vào các thư mục và file chính. `node_modules` không được đưa vào cây cấu trúc vì quá lớn và không phải source code của project.
