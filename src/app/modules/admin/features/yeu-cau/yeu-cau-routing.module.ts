import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  CapNhatThongTinThiSinhComponent
} from "@modules/admin/features/yeu-cau/cap-nhat-thong-tin-thi-sinh/cap-nhat-thong-tin-thi-sinh.component";

// import {PhieuYeuCauComponent} from "@modules/admin/features/yeu-cau/phieu-yeu-cau/phieu-yeu-cau.component";
// import {VanDonComponent} from "@modules/admin/features/yeu-cau/van-don/van-don.component";
import {HoanHuyDangKyComponent} from "@modules/admin/features/yeu-cau/hoan-huy-dang-ky/hoan-huy-dang-ky.component";

const routes: Routes = [
  {
    path:'cap-nhat-thong-tin',
    component:CapNhatThongTinThiSinhComponent
  },

  // {
  //   path:'phieu-chuyen-phat',
  //   component:PhieuYeuCauComponent
  // },
  {
    path:'hoan-huy-dang-ky',
    component:HoanHuyDangKyComponent
  },
  // {
  //   path: 'ketqua-vandon',
  //   component: VanDonComponent,
  //   // data: {state: 'danh-muc--le-phi-thi'}
  // },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class YeuCauRoutingModule { }
