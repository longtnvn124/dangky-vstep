import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DangKyThiSinhComponent} from "@modules/admin/features/doi-tac/dang-ky-thi-sinh/dang-ky-thi-sinh.component";
import {
  DanhSachThiSinhComponent
} from "@modules/admin/features/doi-tac/danh-sach-thi-sinh/danh-sach-thi-sinh.component";

const routes: Routes = [
  {
    path:'dang-ky-thi-sinh',
    component:DangKyThiSinhComponent
  },
  {
    path:'danh-sach-thi-sinh',
    component:DanhSachThiSinhComponent
  },
  {
    path: '',
    redirectTo: '/dang-ky-thi-sinh',
    pathMatch: 'prefix'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoiTacRoutingModule { }
