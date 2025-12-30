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
import {CalendarModule} from "primeng/calendar";
import {InputTextModule} from "primeng/inputtext";
import {InputSwitchModule} from "primeng/inputswitch";
import {MatMenuModule} from "@angular/material/menu";
import {TableModule} from "primeng/table";
Quill.register('modules/imageResize', ImageResize);

@NgModule({
  declarations: [

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
