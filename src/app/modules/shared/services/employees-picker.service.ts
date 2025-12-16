import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap/modal/modal-config';
import { OrganizationPickerComponent } from "@shared/components/organization-picker/organization-picker.component";
import { DonVi } from '../models/danh-muc';
import { Ngulieu } from "@shared/models/quan-ly-ngu-lieu";
import { OvicPickerNgulieuComponent } from "@shared/components/ovic-picker-ngulieu/ovic-picker-ngulieu.component";
import { OrdersTHPT } from './thpt-orders.service';
import { OvicPickerCandidationComponent } from '../components/ovic-picker-candidation/ovic-picker-candidation.component';

@Injectable({
  providedIn: 'root'
})
export class EmployeesPickerService {
  constructor(private modalService: NgbModal) { }

  // open( selected : DoiTuongThiDuaCaNhan[] , select : string = null ) : Promise<DoiTuongThiDuaCaNhan[]> {
  // 	const options : NgbModalOptions  = {
  // 		scrollable  : true ,
  // 		size        : 'md' ,
  // 		backdrop    : 'static' ,
  // 		centered    : true ,
  // 		windowClass : 'ovic-modal-class ovic-modal-employee-picker'
  // 	};
  // 	const modal                      = this.modalService.open( EmployeesPickerComponent , options );
  // 	modal.componentInstance.selected = selected || [];
  // 	if ( select ) {
  // 		modal.componentInstance.select = select;
  // 	}
  // 	return modal.result;
  // }

  // pickerTapThe( selected : DoiTuongThiDuaTapThe[] = [] , select : string = null ) : Promise<DoiTuongThiDuaTapThe[]> {
  // 	const options : NgbModalOptions  = {
  // 		scrollable  : true ,
  // 		size        : 'md' ,
  // 		backdrop    : 'static' ,
  // 		centered    : true ,
  // 		windowClass : 'ovic-modal-class ovic-modal-employee-picker'
  // 	};
  // 	const modal                      = this.modalService.open( DepartmentsPickerComponent , options );
  // 	modal.componentInstance.selected = selected || [];
  // 	if ( select ) {
  // 		modal.componentInstance.select = select;
  // 	}
  // 	return modal.result;
  // }

  pickerDonvi(selected: DonVi[] = [], select: string = null): Promise<DonVi[]> {
    const options: NgbModalOptions = {
      scrollable: true,
      size: 'md',
      backdrop: 'static',
      centered: true,
      windowClass: 'ovic-modal-class ovic-modal-employee-picker'
    };
    const modal = this.modalService.open(OrganizationPickerComponent, options);
    modal.componentInstance.selected = selected || [];
    if (select) {
      modal.componentInstance.select = select;
    }
    return modal.result;
  }

  pickerNgulieu(selected: Ngulieu[] = [], select: string = null, type: string): Promise<Ngulieu[]> {
    const options: NgbModalOptions = {
      scrollable: true,
      size: 'md',
      backdrop: 'static',
      centered: true,
      windowClass: 'ovic-modal-class ovic-modal-employee-picker'
    };
    const modal = this.modalService.open(OvicPickerNgulieuComponent, options);
    modal.componentInstance.selected = selected || [];
    if (select) {
      modal.componentInstance.select = select;
    }
    if (type) {
      modal.componentInstance.type = type;
    }

    return modal.result;
  }

  pickerUser(user_ids: number[], kehoach_id: number): Promise<number[]> {


    const options: NgbModalOptions = {
      scrollable: true,
      size: 'md',
      backdrop: 'static',
      centered: true,
      windowClass: 'ovic-modal-class ovic-modal-employee-picker'
    };

    const modal = this.modalService.open(OvicPickerCandidationComponent, options);
    modal.componentInstance.user_ids = user_ids || [];
    modal.componentInstance.kehoach_id = kehoach_id;



    return modal.result;
  }
}
