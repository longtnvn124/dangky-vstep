import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DangKyDuThiComponent} from "@modules/admin/features/tram-thi/dang-ky-du-thi/dang-ky-du-thi.component";

const routes: Routes = [
  {
    path:'dang-ky-du-thi',
    component: DangKyDuThiComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TramThiRoutingModule { }
