import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TruongHocComponent} from "@modules/admin/features/danh-muc/truong-hoc/truong-hoc.component";
import {DoiTuongUuTienComponent} from "@modules/admin/features/danh-muc/doi-tuong-uu-tien/doi-tuong-uu-tien.component";
import {CapDoComponent} from "@modules/admin/features/danh-muc/cap-do/cap-do.component";
const routes: Routes = [
  {
    path: 'cap-do',
    component: CapDoComponent,
    data: {state: 'danh-muc--cap-do'}
  },

  {
    path: 'truong-hoc',
    component: TruongHocComponent,
    data: {state: 'danh-muc--truong-hoc'}
  },
  {
    path: 'doi-tuong',
    component: DoiTuongUuTienComponent,
    data: {state: 'danh-muc--doi-tuong'}
  },

  {
    path: '',
    redirectTo: 'cap-do',
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DanhMucRoutingModule {
}
