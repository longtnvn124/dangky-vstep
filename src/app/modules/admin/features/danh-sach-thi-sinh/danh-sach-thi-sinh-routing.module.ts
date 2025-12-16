import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ThiSinhComponent} from "@modules/admin/features/danh-sach-thi-sinh/thi-sinh/thi-sinh.component";

const routes: Routes = [
  {
    path:'',
    component:ThiSinhComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DanhSachThiSinhRoutingModule { }
