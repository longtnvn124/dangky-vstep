import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DanhMucRoutingModule} from './danh-muc-routing.module';
import {SharedModule} from '@shared/shared.module';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {ReactiveFormsModule} from '@angular/forms';
import {DropdownModule} from 'primeng/dropdown';
import {PaginatorModule} from 'primeng/paginator';
import {InputMaskModule} from 'primeng/inputmask';
import {DialogModule} from 'primeng/dialog';
import { EditorModule } from 'primeng/editor'
import { ContextMenuModule } from 'primeng/contextmenu';
import { MultiSelectModule } from 'primeng/multiselect';
import {SplitterModule} from "primeng/splitter";
import Quill from 'quill';
import ImageResize from 'quill-image-resize-module';
import { MonComponent } from './mon/mon.component';
import { ToHopMonComponent } from './to-hop-mon/to-hop-mon.component';
import { DotThiComponent } from './dot-thi/dot-thi.component';
import {CalendarModule} from "primeng/calendar";
import { TruongHocComponent } from './truong-hoc/truong-hoc.component';
import {InputTextModule} from "primeng/inputtext";
import { KhaiBaoPhongThiComponent } from './khai-bao-phong-thi/khai-bao-phong-thi.component';
import { DoiTuongUuTienComponent } from './doi-tuong-uu-tien/doi-tuong-uu-tien.component';
import {InputSwitchModule} from "primeng/inputswitch";
import {MatMenuModule} from "@angular/material/menu";
import {TableModule} from "primeng/table";
import { CapDoComponent } from './cap-do/cap-do.component';
Quill.register('modules/imageResize', ImageResize);

@NgModule({
  declarations: [
    MonComponent,
    ToHopMonComponent,
    DotThiComponent,
    TruongHocComponent,
    KhaiBaoPhongThiComponent,
    DoiTuongUuTienComponent,
    CapDoComponent,
  ],
    imports: [
        CommonModule,
        DanhMucRoutingModule,
        SharedModule,
        ButtonModule,
        RippleModule,
        ReactiveFormsModule,
        DropdownModule,
        PaginatorModule,
        InputMaskModule,
        DialogModule,
        EditorModule,
        ContextMenuModule,
        MultiSelectModule,
        SplitterModule,
        CalendarModule,
        InputTextModule,
        InputSwitchModule,
        MatMenuModule,
        TableModule
    ]
})
export class DanhMucModule {
}
