import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuanLyTaiKhoanRoutingModule } from './quan-ly-tai-khoan-routing.module';

import {ButtonModule} from "primeng/button";
import {PaginatorModule} from "primeng/paginator";
import {ReactiveFormsModule} from "@angular/forms";
import {RippleModule} from "primeng/ripple";
import {SharedModule} from "@shared/shared.module";
import {TooltipModule} from "primeng/tooltip";
import { TaiKhoaThiSinhComponent } from './tai-khoa-thi-sinh/tai-khoa-thi-sinh.component';


@NgModule({
  declarations: [
     TaiKhoaThiSinhComponent
  ],
  imports: [
    CommonModule,
    QuanLyTaiKhoanRoutingModule,
    ButtonModule,
    PaginatorModule,
    ReactiveFormsModule,
    RippleModule,
    SharedModule,
    TooltipModule
  ]
})
export class QuanLyTaiKhoanModule { }
