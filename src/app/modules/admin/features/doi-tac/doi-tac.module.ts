import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoiTacRoutingModule } from './doi-tac-routing.module';
import { DangKyThiSinhComponent } from './dang-ky-thi-sinh/dang-ky-thi-sinh.component';
import {DropdownModule} from "primeng/dropdown";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {MatMenuModule} from "@angular/material/menu";
import {PaginatorModule} from "primeng/paginator";
import {TableModule} from "primeng/table";
import {TooltipModule} from "primeng/tooltip";
import {DialogModule} from "primeng/dialog";
import {SharedModule} from "@shared/shared.module";
import {CheckboxModule} from "primeng/checkbox";
import { DanhSachThiSinhComponent } from './danh-sach-thi-sinh/danh-sach-thi-sinh.component';
import {InputMaskModule} from "primeng/inputmask";
import {InputSwitchModule} from "primeng/inputswitch";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {DanhSachThiSinhModule} from "@modules/admin/features/danh-sach-thi-sinh/danh-sach-thi-sinh.module";
import { AddImgByZipComponent } from './danh-sach-thi-sinh/add-img-by-zip/add-img-by-zip.component';
import {SplitterModule} from "primeng/splitter";
import { AddImgCccdByZipComponent } from './danh-sach-thi-sinh/add-img-cccd-by-zip/add-img-cccd-by-zip.component';
import { ThiSinhByDangKyComponent } from './dang-ky-thi-sinh/thi-sinh-by-dang-ky/thi-sinh-by-dang-ky.component';


@NgModule({
  declarations: [
    DangKyThiSinhComponent,
    DanhSachThiSinhComponent,
    AddImgByZipComponent,
    AddImgCccdByZipComponent,
    ThiSinhByDangKyComponent
  ],
    imports: [
        CommonModule,
        DoiTacRoutingModule,
        DropdownModule,
        ButtonModule,
        RippleModule,
        FormsModule,
        InputTextModule,
        MatMenuModule,
        PaginatorModule,
        TableModule,
        TooltipModule,
        DialogModule,
        SharedModule,
        CheckboxModule,
        InputMaskModule,
        InputSwitchModule,
        MatProgressBarModule,
        ReactiveFormsModule,
        DanhSachThiSinhModule,
        SplitterModule
    ]
})
export class DoiTacModule { }
