import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  ThiSinhDuThiComponent
} from "@modules/admin/features/danh-sach-du-thi/thi-sinh-du-thi/thi-sinh-du-thi.component";

const routes: Routes = [
  {
    path:'',
    component:ThiSinhDuThiComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DanhSachDuThiRoutingModule { }
