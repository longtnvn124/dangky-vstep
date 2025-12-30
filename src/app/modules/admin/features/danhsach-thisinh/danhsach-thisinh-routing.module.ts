import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  ThongtinThisinhComponent
} from "@modules/admin/features/danhsach-thisinh/thongtin-thisinh/thongtin-thisinh.component";

const routes: Routes = [
  {
    path      : '' ,
    component : ThongtinThisinhComponent,
    data      : { state : 'ds-thisinh--thong-tin-thi-sinh' }
  } ,
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DanhsachThisinhRoutingModule { }
