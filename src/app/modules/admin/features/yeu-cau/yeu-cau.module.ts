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
import {TooltipModule} from "primeng/tooltip";
import {DialogModule} from "primeng/dialog";

import {CheckboxModule} from "primeng/checkbox";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {SharedModule} from "@shared/shared.module";
import {ThiSinhModule} from "@modules/admin/features/thi-sinh/thi-sinh.module";

import {TabViewModule} from "primeng/tabview";
import {ImageModule} from "primeng/image";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    CapNhatThongTinThiSinhComponent,

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
