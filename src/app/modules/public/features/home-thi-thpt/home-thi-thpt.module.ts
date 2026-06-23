import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeThiThptRoutingModule } from './home-thi-thpt-routing.module';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { VerificationComponent } from './layouts/verification/verification.component';
import {TooltipModule} from "primeng/tooltip";
import {ReactiveFormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";


@NgModule({
  declarations: [
    MainLayoutComponent,
    VerificationComponent
  ],
  imports: [
    CommonModule,
    HomeThiThptRoutingModule,
    TooltipModule,
    ReactiveFormsModule,
    ButtonModule,
    RippleModule
  ]
})
export class HomeThiThptModule { }
