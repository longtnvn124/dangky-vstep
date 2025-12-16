import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  CapNhatThongTinThiSinhComponent
} from "@modules/admin/features/yeu-cau/cap-nhat-thong-tin-thi-sinh/cap-nhat-thong-tin-thi-sinh.component";
import {HuyDangKyComponent} from "@modules/admin/features/yeu-cau/huy-dang-ky/huy-dang-ky.component";
import {HoanDangKyComponent} from "@modules/admin/features/yeu-cau/hoan-dang-ky/hoan-dang-ky.component";
import {DuyetHuyDuThiComponent} from "@modules/admin/features/yeu-cau/duyet-huy-du-thi/duyet-huy-du-thi.component";
import {HoanHuyDangKyComponent} from "@modules/admin/features/yeu-cau/hoan-huy-dang-ky/hoan-huy-dang-ky.component";
import {PhieuYeuCauComponent} from "@modules/admin/features/yeu-cau/phieu-yeu-cau/phieu-yeu-cau.component";
import {VanDonComponent} from "@modules/admin/features/yeu-cau/van-don/van-don.component";

const routes: Routes = [
  {
    path:'cap-nhat-thong-tin',
    component:CapNhatThongTinThiSinhComponent
  },
  {
    path:'huy-dang-ky',
    component:HuyDangKyComponent
  },
  {
    path:'hoan-dang-ky',
    component:HoanDangKyComponent
  },
  {
    path:'duyet-huy-du-thi',
    component:DuyetHuyDuThiComponent
  },
  {
    path:'hoan-huy-dang-ky',
    component:HoanHuyDangKyComponent
  },

  {
    path:'phieu-chuyen-phat',
    component:PhieuYeuCauComponent
  },
  {
    path: 'ketqua-vandon',
    component: VanDonComponent,
    // data: {state: 'danh-muc--le-phi-thi'}
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class YeuCauRoutingModule { }
