import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThiSinhRoutingModule } from './thi-sinh-routing.module';
import { ThiSinhDangKyComponent } from './thi-sinh-dang-ky/thi-sinh-dang-ky.component';
import {SharedModule} from "@shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";
import {InputMaskModule} from "primeng/inputmask";
import {RippleModule} from "primeng/ripple";
import {ButtonModule} from "primeng/button";
import {MultiSelectModule} from "primeng/multiselect";
import {TableModule} from "primeng/table";
import {InputTextModule} from "primeng/inputtext";
import {PaginatorModule} from "primeng/paginator";
import {CheckboxModule} from "primeng/checkbox";
import {TooltipModule} from "primeng/tooltip";
import {DialogModule} from "primeng/dialog";
import {TabViewModule} from "primeng/tabview";
import {RadioButtonModule} from "primeng/radiobutton";
import { YeuCauTraKetQuaComponent } from './yeu-cau-tra-ket-qua/yeu-cau-tra-ket-qua.component';
import {MatMenuModule} from "@angular/material/menu";
import {InputTextareaModule} from "primeng/inputtextarea";
import {ImageModule} from "primeng/image";
import {OvicInputAddressNewComponent} from "@shared/components/ovic-input-address-new/ovic-input-address-new.component";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {ThanhtoanByQrComponent} from "@shared/components/thanhtoan-by-qr/thanhtoan-by-qr.component";
import {
    CancelOrChangeComponent
} from "@modules/admin/features/thi-sinh/thi-sinh-dang-ky/cancel-or-change/cancel-or-change.component";


@NgModule({
    declarations: [
        ThiSinhDangKyComponent,
        YeuCauTraKetQuaComponent
    ],
    exports: [

    ],
    imports: [
        CommonModule,
        ThiSinhRoutingModule,
        SharedModule,
        ReactiveFormsModule,
        DropdownModule,
        InputMaskModule,
        RippleModule,
        ButtonModule,
        MultiSelectModule,
        TableModule,
        InputTextModule,
        PaginatorModule,
        CheckboxModule,
        TooltipModule,
        DialogModule,
        TabViewModule,
        RadioButtonModule,
        MatMenuModule,
        InputTextareaModule,
        ImageModule,
        OvicInputAddressNewComponent,
        MatProgressBarModule,
        ThanhtoanByQrComponent,
        CancelOrChangeComponent
    ]
})
export class ThiSinhModule { }
