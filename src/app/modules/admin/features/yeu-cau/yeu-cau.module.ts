import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { YeuCauRoutingModule } from './yeu-cau-routing.module';
import { CapNhatThongTinThiSinhComponent } from './cap-nhat-thong-tin-thi-sinh/cap-nhat-thong-tin-thi-sinh.component';
import {InputSwitchModule} from "primeng/inputswitch";
import {InputTextModule} from "primeng/inputtext";
import {MatMenuModule} from "@angular/material/menu";
import {PaginatorModule} from "primeng/paginator";

import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import { HuyDangKyComponent } from './huy-dang-ky/huy-dang-ky.component';
import {TooltipModule} from "primeng/tooltip";
import { HoanDangKyComponent } from './hoan-dang-ky/hoan-dang-ky.component';
import {DialogModule} from "primeng/dialog";
import { DuyetHuyDuThiComponent } from './duyet-huy-du-thi/duyet-huy-du-thi.component';
import {CheckboxModule} from "primeng/checkbox";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {SharedModule} from "@shared/shared.module";
import {ThiSinhModule} from "@modules/admin/features/thi-sinh/thi-sinh.module";
import { HoanHuyDangKyComponent } from './hoan-huy-dang-ky/hoan-huy-dang-ky.component';
import { HoanComponent } from './hoan-huy-dang-ky/hoan/hoan.component';
import { HuyComponent } from './hoan-huy-dang-ky/huy/huy.component';
import {TabViewModule} from "primeng/tabview";
import { PhieuYeuCauComponent } from './phieu-yeu-cau/phieu-yeu-cau.component';
import {ImageModule} from "primeng/image";
import {ReactiveFormsModule} from "@angular/forms";
import {VanDonComponent} from "@modules/admin/features/yeu-cau/van-don/van-don.component";

@NgModule({
  declarations: [
    CapNhatThongTinThiSinhComponent,
    HuyDangKyComponent,
    HoanDangKyComponent,
    DuyetHuyDuThiComponent,
    HoanHuyDangKyComponent,
    HoanComponent,
    HuyComponent,
    PhieuYeuCauComponent,
    VanDonComponent
  ],
  imports: [
    CommonModule,
    YeuCauRoutingModule,
    InputSwitchModule,
    InputTextModule,
    MatMenuModule,
    PaginatorModule,
    SharedModule,
    TableModule,
    ButtonModule,
    RippleModule,
    TooltipModule,
    DialogModule,
    CheckboxModule,
    MatProgressBarModule,
    SharedModule,
    ThiSinhModule,
    TabViewModule,
    ImageModule,
    ReactiveFormsModule
  ]
})
export class YeuCauModule { }
