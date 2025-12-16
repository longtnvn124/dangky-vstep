import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  DuyetDoiTacComponent
} from "@modules/admin/features/duyet-thanh-toan-doi-tac/duyet-doi-tac/duyet-doi-tac.component";

const routes: Routes = [
  {
    path : '',
    component :DuyetDoiTacComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DuyetThanhToanDoiTacRoutingModule { }
