import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonModule} from "primeng/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {PaginatorModule} from "primeng/paginator";
import {ReactiveFormsModule} from "@angular/forms";
import {RippleModule} from "primeng/ripple";
import {SharedModule} from "primeng/api";
import {SplitterModule} from "primeng/splitter";
import {TableModule} from "primeng/table";
import {KeHoachThi} from "@shared/services/kehoachthi-vstep.service";
import {KehoachthiDiemduthi, KehoachthiDiemthiVstepService} from "@shared/services/kehoachthi-diemthi-vstep.service";
import {NotificationService} from "@core/services/notification.service";
import {ConditionOption} from "@shared/models/condition-option";
import {OvicQueryCondition} from "@core/models/dto";
import {FocusInputPipe} from "@shared/pipes/focus-input.pipe";
import {Observable, of, switchMap} from "rxjs";
import {DonVi} from "@shared/models/danh-muc";

@Component({
  selector: 'app-kehoachthi-diemthi-v2',
  standalone: true,
  imports: [CommonModule, ButtonModule, MatCheckboxModule, MatProgressBarModule, PaginatorModule, ReactiveFormsModule, RippleModule, SharedModule, SplitterModule, TableModule, FocusInputPipe],
  templateUrl: './kehoachthi-diemthi-v2.component.html',
  styleUrls: ['./kehoachthi-diemthi-v2.component.css']
})
export class KehoachthiDiemthiV2Component implements OnInit {
  @Input() set kehoachthi(a:KeHoachThi){

    this._kehoachthi = a;
    this.loadInit()
  }

  _kehoachthi         : KeHoachThi = null;
  ngType              : -1|1|0 = 0;
  limit               : number = 20;
  recordTotal         : number = 0;
  listData            : KehoachthiDiemduthi[] = [];
  index_focus: number = 0;

  constructor(
    private notifi: NotificationService,
    private kehoachthiDiemthiVstepService:KehoachthiDiemthiVstepService
  ) { }



  ngOnInit(): void {
  }
  loadInit(){
    const condition: ConditionOption ={
      condition:[
        {
          conditionName:'kehoach_id',
          condition:OvicQueryCondition.equal,
          value:this._kehoachthi.id.toString()
        }
      ],page:'1',
      set:[
        { label:'limit',value:'-1'},
        { label:'with',value: 'donvi'}
      ]

    };
    this.kehoachthiDiemthiVstepService.getDataByPageNew(condition).subscribe({
      next:({data})=>{
        this.listData= data.map((m,index)=>{
          const diemthi: DonVi = m['donvi'];
          m['_index'] = index + 1;
          m['_title'] = diemthi ? diemthi.title : '' ;
          return m;
        });
        this.ngType=1;
      },error:()=>{
        this.ngType=-1;
        this.notifi.toastError('Mất kết nối với máy chủ');
      }
    })
  }

  reLoad(){
    this.loadInit();
  }

  private loopCreatedDiemduthi(data:any[], kehoach_id:number,step:number,percent:number):Observable<any> {

    const index = data.findIndex(i => !i['isCreated']);
    if (index !== -1) {
      const item  = {
        diemduthi_id: data[index].id,
        kehoach_id: kehoach_id,
      }
      return this.kehoachthiDiemthiVstepService.create(item).pipe(switchMap(m=>{
        data[index]['isCreated']= true;
        const newPercent: number = percent + step;
        this.notifi.loadingAnimationV2({process: {percent: newPercent}});
        return this.loopCreatedDiemduthi(data,kehoach_id,step,newPercent);
      }))
    } else {
      return of(data);
    }
  }
  async deleteItem(item:KehoachthiDiemduthi){

    const btn =  await this.notifi.confirmDelete();
    if(btn){
      this.notifi.isProcessing(true);
      this.kehoachthiDiemthiVstepService.delete(item.id).subscribe({
        next:()=>{
          this.notifi.toastSuccess('Thao tác thành công');
          this.notifi.isProcessing(false);
          this.loadInit();
        },
        error:()=>{
          this.notifi.toastError('Thao tác không thành công');
          this.notifi.isProcessing(false);

        }
      })
    }
  }

  pointQuestionKeyDown(event: KeyboardEvent, inputPoint_quest: HTMLInputElement) {
    if (!event) return;

    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight'];

    const value = inputPoint_quest.value;
    const cursorStart = inputPoint_quest.selectionStart ?? 0;
    const cursorEnd = inputPoint_quest.selectionEnd ?? 0;

    if (/^[0-9]$/.test(event.key)) {
      const newValue =
        value.substring(0, cursorStart) + event.key + value.substring(cursorEnd);
      if (newValue.includes('.')) {
        const parts = newValue.split('.');
        if (parts[1]?.length > 1) {
          event.preventDefault();
          return;
        }
      }
      // if (parseFloat(newValue) > 10) {
      //   event.preventDefault();
      //   return;
      // }
      return;
    }
    if (event.key === '.') {
      if (value.includes('.')) {
        event.preventDefault();
      }
      return;
    }

    if (allowedKeys.includes(event.key)) {
      return;
    }
    event.preventDefault();
  }
  saveSoluongByDiemduthi(event,row:KehoachthiDiemduthi, index){
    if (event && row) {
      if (row.soluong || row.soluong === 0 || row['test_info'].point === null) {
        if (event.key === 'Enter') {
          this.notifi.isProcessing(true);
          this.kehoachthiDiemthiVstepService.update(row.id, { soluong: row.soluong }).subscribe({
            next: () => {
              this.notifi.isProcessing(false);
              if (this.listData[index + 1]) {
                this.index_focus = this.listData[index + 1].id;
              }

              this.notifi.toastSuccess("Lưu số lượng thí sinh thành công");

            },
            error: () => {
              this.notifi.isProcessing(false);
              this.notifi.toastError("Lưu số lượng thí sinh thất bại");
              row.soluong = row['soluong'] === -1 ? null : row['test_info'].point;
            }
          })
        }
      }
    }
  }
}
