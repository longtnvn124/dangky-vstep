import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DanhSachThiSinhRoutingModule } from './danh-sach-thi-sinh-routing.module';
import { ThiSinhComponent } from './thi-sinh/thi-sinh.component';
import {ButtonModule} from "primeng/button";
import {CheckboxModule} from "primeng/checkbox";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {MatMenuModule} from "@angular/material/menu";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {PaginatorModule} from "primeng/paginator";
import {RippleModule} from "primeng/ripple";
import {SharedModule} from "@shared/shared.module";
import {TableModule} from "primeng/table";
import {TooltipModule} from "primeng/tooltip";
import {ReactiveFormsModule} from "@angular/forms";
import {InputMaskModule} from "primeng/inputmask";
import { ThiSinhTaiKhoanComponent } from './thi-sinh/thi-sinh-tai-khoan/thi-sinh-tai-khoan.component';
import {InputSwitchModule} from "primeng/inputswitch";


@NgModule({
  declarations: [
    ThiSinhComponent,
    ThiSinhTaiKhoanComponent
  ],
  exports: [
    ThiSinhTaiKhoanComponent
  ],
  imports: [
    CommonModule,
    DanhSachThiSinhRoutingModule,
    ButtonModule,
    CheckboxModule,
    DropdownModule,
    InputTextModule,
    MatMenuModule,
    MatProgressBarModule,
    PaginatorModule,
    RippleModule,
    SharedModule,
    SharedModule,
    TableModule,
    TooltipModule,
    ReactiveFormsModule,
    InputMaskModule,
    InputSwitchModule
  ]
})
export class DanhSachThiSinhModule { }
