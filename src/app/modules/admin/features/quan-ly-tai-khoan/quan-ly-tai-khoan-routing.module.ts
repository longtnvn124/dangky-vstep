import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DoiTacComponent} from "@modules/admin/features/quan-ly-tai-khoan/doi-tac/doi-tac.component";
import {
  TaiKhoaThiSinhComponent
} from "@modules/admin/features/quan-ly-tai-khoan/tai-khoa-thi-sinh/tai-khoa-thi-sinh.component";

const routes: Routes = [

  // {
  //   path:'doi-tac',
  //   component: DoiTacComponent,
  //
  // },
  {
    path:'thi-sinh',
    component: TaiKhoaThiSinhComponent,
  },
  {
    path:'diem-du-thi',
    component: DoiTacComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuanLyTaiKhoanRoutingModule { }
