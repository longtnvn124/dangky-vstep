import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HoiDongThiRoutingModule } from './hoi-dong-thi-routing.module';
import { DsHoiDongThiComponent } from './ds-hoi-dong-thi/ds-hoi-dong-thi.component';
import { AddThiSinhComponent } from './ds-hoi-dong-thi/add-thi-sinh/add-thi-sinh.component';
import {RippleModule} from "primeng/ripple";
import {ButtonModule} from "primeng/button";
import {SharedModule} from "@shared/shared.module";
import {CalendarModule} from "primeng/calendar";
import {DropdownModule} from "primeng/dropdown";
import {ReactiveFormsModule} from "@angular/forms";
import {PaginatorModule} from "primeng/paginator";
import {TooltipModule} from "primeng/tooltip";
import {TableModule} from "primeng/table";
import {InputTextModule} from "primeng/inputtext";
import {MatMenuModule} from "@angular/material/menu";
import {CheckboxModule} from "primeng/checkbox";
import { PhongThiComponent } from './ds-hoi-dong-thi/phong-thi/phong-thi.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import { KetQuaThiComponent } from './ds-hoi-dong-thi/ket-qua-thi/ket-qua-thi.component';


@NgModule({
  declarations: [
    DsHoiDongThiComponent,
    AddThiSinhComponent,
    PhongThiComponent,
    KetQuaThiComponent
  ],
  imports: [
    CommonModule,
    HoiDongThiRoutingModule,
    RippleModule,
    ButtonModule,
    SharedModule,
    CalendarModule,
    DropdownModule,
    ReactiveFormsModule,
    PaginatorModule,
    TooltipModule,
    TableModule,
    InputTextModule,
    MatMenuModule,
    CheckboxModule,
    MatProgressBarModule
  ]
})
export class HoiDongThiModule { }
