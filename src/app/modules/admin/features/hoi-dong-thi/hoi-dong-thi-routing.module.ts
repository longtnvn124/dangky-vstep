import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DsHoiDongThiComponent} from "@modules/admin/features/hoi-dong-thi/ds-hoi-dong-thi/ds-hoi-dong-thi.component";

const routes: Routes = [
  {
    path:'',
    component:DsHoiDongThiComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HoiDongThiRoutingModule { }
