import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DangKyDuThiComponent} from "@modules/admin/features/tram-thi/dang-ky-du-thi/dang-ky-du-thi.component";
import {ThongKeTramComponent} from "@modules/admin/features/tram-thi/thong-ke-tram/thong-ke-tram.component";
import {TraCuuTramComponent} from "@modules/admin/features/tram-thi/tra-cuu-tram/tra-cuu-tram.component";

const routes: Routes = [
  {
    path:'dang-ky-du-thi',
    component: DangKyDuThiComponent,
  },
  {
    path:'thong-ke',
    component: ThongKeTramComponent,
  },
  {
    path:'tra-cuu',
    component: TraCuuTramComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TramThiRoutingModule { }
