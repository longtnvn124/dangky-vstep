import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DiemDuThiComponent} from "@modules/admin/features/danh-muc/diem-du-thi/diem-du-thi.component";
import {DonviComponent} from "@modules/admin/features/danh-muc/donvi/donvi.component";
const routes: Routes = [
  // {
  //   path: 'diem-du-thi',
  //   component: DiemDuThiComponent,
  //   data: {state: 'danh-muc--diem-du-thi'}
  // },
  {
    path: 'diem-du-thi',
    component: DonviComponent,
    data: {state: 'danh-muc--diem-du-thi'}
  },

  {
    path: '',
    redirectTo: 'diem-du-thi',
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DanhMucRoutingModule {
}
