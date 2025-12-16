import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';

import { MenuModule } from 'primeng/menu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { SidenavComponent } from '@modules/admin/features/sidenav/sidenav.component';
import { NgApexchartsModule } from 'ng-apexcharts';


import { SharedModule } from '@shared/shared.module';
import { ContentNoneComponent } from '@modules/admin/features/content-none/content-none.component';
import { HomeComponent } from '@modules/admin/features/home/home.component';
import { DashboardComponent } from '@modules/admin/dashboard/dashboard.component';
import { UserInfoComponent } from '@modules/admin/dashboard/user-info/user-info.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MenuLanguageComponent } from '@modules/admin/dashboard/menu-language/menu-language.component';
import { OvicSvgModule } from '@modules/ovic-svg/ovic-svg.module';
import { TranslateModule } from '@ngx-translate/core';
import { OvicMessageModule } from '@modules/admin/features/ovic-message/ovic-message.module';
import { NewHomeComponent } from '@modules/admin/features/new-home/new-home.component';
import { DropdownModule } from 'primeng/dropdown';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HomeEducationComponent} from "@modules/admin/features/home/home-education/home-education.component";
import {HomeSampleComponent} from "@modules/admin/features/home/home-sample/home-sample.component";
import {CardWidgetComponent} from "@modules/admin/features/home/widgets/card-widget/card-widget.component";
import { KeHoachThiComponent } from './features/ke-hoach-thi/ke-hoach-thi.component';
import {DialogModule} from "primeng/dialog";
import {EditorModule} from "primeng/editor";
import {PaginatorModule} from "primeng/paginator";
import {SplitterModule} from "primeng/splitter";
import {CalendarModule} from "primeng/calendar";
import {ChartModule} from "primeng/chart";
import { DanhSachThiSinhComponent } from './features/ke-hoach-thi/danh-sach-thi-sinh/danh-sach-thi-sinh.component';
import {TableModule} from "primeng/table";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import { CapdoTheoDotthiComponent } from './features/ke-hoach-thi/capdo-theo-dotthi/capdo-theo-dotthi.component';
import { ThongKeDuLieuComponent } from './features/thong-ke-du-lieu/thong-ke-du-lieu.component';
import {CheckboxModule} from "primeng/checkbox";
import {MatMenuModule} from "@angular/material/menu";
import { CardCountComponent } from './features/home/widgets/card-count/card-count.component';
import { MailCheckComponent } from './features/mail-check/mail-check.component';


@NgModule( {
	declarations : [
		DashboardComponent ,
		ContentNoneComponent ,
		HomeComponent ,
		SidenavComponent ,
		UserInfoComponent ,
		MenuLanguageComponent ,
		NewHomeComponent,
    HomeEducationComponent,
    HomeSampleComponent,
    CardWidgetComponent,
    KeHoachThiComponent,
    DanhSachThiSinhComponent,
    CapdoTheoDotthiComponent,
    ThongKeDuLieuComponent,
    CardCountComponent,
    MailCheckComponent,

	] ,
  imports: [
    CommonModule,
    AdminRoutingModule,
    MenuModule,
    PanelMenuModule,
    MessagesModule,
    MessageModule,
    ScrollPanelModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    NgApexchartsModule,
    SharedModule,
    OverlayPanelModule,
    OvicSvgModule,
    TranslateModule,
    OvicMessageModule,
    DropdownModule,
    FormsModule,
    DialogModule,
    EditorModule,
    PaginatorModule,
    ReactiveFormsModule,
    SplitterModule,
    CalendarModule,
    ChartModule,
    TableModule,
    MatProgressBarModule,
    CheckboxModule,
    MatMenuModule
  ]
} )
export class AdminModule {}
