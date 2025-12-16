import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DuyetThanhToanDoiTacRoutingModule } from './duyet-thanh-toan-doi-tac-routing.module';
import { DuyetDoiTacComponent } from './duyet-doi-tac/duyet-doi-tac.component';
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


@NgModule({
  declarations: [
    DuyetDoiTacComponent
  ],
  imports: [
    CommonModule,
    DuyetThanhToanDoiTacRoutingModule,
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
    SharedModule
  ]
})
export class DuyetThanhToanDoiTacModule { }
