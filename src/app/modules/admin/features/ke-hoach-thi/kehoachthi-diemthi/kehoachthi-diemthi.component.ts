import {Component, Input, OnInit} from '@angular/core';

import {NotificationService} from "@core/services/notification.service";
import {KeHoachThi} from "@shared/services/kehoachthi-vstep.service";
import {DmDiemduthi, DmDiemDuThiService} from "@shared/services/dm-diem-du-thi.service";
import {KehoachthiDiemduthi, KehoachthiDiemthiVstepService} from "@shared/services/kehoachthi-diemthi-vstep.service";
import {ConditionOption} from "@shared/models/condition-option";
import {OvicQueryCondition} from "@core/models/dto";
import {forkJoin, Observable, of, switchMap} from "rxjs";
import {map} from "rxjs/operators";
import {BUTTON_NO, BUTTON_YES} from "@core/models/buttons";
import {NgForOf, NgSwitch, NgSwitchCase} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {SplitterModule} from "primeng/splitter";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {TableModule} from "primeng/table";
import {FormsModule} from "@angular/forms";
import {FocusInputPipe} from "@shared/pipes/focus-input.pipe";
import {PaginatorModule} from "primeng/paginator";

@Component({
  selector: 'app-kehoachthi-diemthi',
  templateUrl: './kehoachthi-diemthi.component.html',
  styleUrls: ['./kehoachthi-diemthi.component.css'],
  imports: [
    NgSwitch,
    NgSwitchCase,
    ButtonModule,
    RippleModule,
    MatProgressBarModule,
    SplitterModule,
    MatCheckboxModule,
    TableModule,
    FormsModule,
    FocusInputPipe,
    PaginatorModule,
    NgForOf
  ],
  standalone: true
})
export class KehoachthiDiemthiComponent implements OnInit {


  @Input() set kehoachthi(a:KeHoachThi){

    this._kehoachthi = a;
    this.loadInit()
  }
  _kehoachthi         : KeHoachThi;
  dmDiemduthi         : DmDiemduthi[];
  kehoachthiDiemduthi : KehoachthiDiemduthi[];
  ngType              : -1|1|0 = 0;
  limit               : number = 20;
  row                 : number = 20;
  recordTotal         : number = 0;
  page: number = 1;

  index_focus: number = 0;

  constructor(
    private dmDiemDuThiService:DmDiemDuThiService,
    private kehoachthiDiemthiVstepService:KehoachthiDiemthiVstepService,
    private notifi: NotificationService,

  ) { }

  ngOnInit(): void {
  }

  loadInit(){

    this.ngType = 0;

    const conditionDm: ConditionOption = {
       condition: [
         {conditionName: 'status', condition:OvicQueryCondition.equal, value: '1'},
       ],
      page:'1',
      set:[
        {label:'limit',value:'-1'},
        {label:'orderby',value:'title'},
      ]
    }



    forkJoin([
      this.dmDiemDuThiService.getDataByPageNew(conditionDm).pipe(map(m=>m.data)),
      this.getDataKehoachDiemduthi(this.page,'-1',this._kehoachthi.id)
    ]).subscribe({
      next:([dmDiemDuthi, {data,recordsFiltered}])=>{
        console.log(dmDiemDuthi,data)
        this.recordTotal  = recordsFiltered;
        this.kehoachthiDiemduthi = data.map((m,i)=>{

          const diemduthi = dmDiemDuthi.find(f=>f.id  == m.diemduthi_id);
          m['_title'] = diemduthi ? diemduthi.title : '';
          m['_diemduthi'] =diemduthi;
          m['_index'] = (this.page - 1)* this.limit + i + 1;
          return m;
        });

        this.dmDiemduthi = dmDiemDuthi.length> 0 ? dmDiemDuthi.map(m=>{

          const dataIds = data.map(m=>m.id);

          m['checked'] = data.length >0 && dataIds.includes(m.id) ;
          return m;
        }) : [];

        console.log(this.kehoachthiDiemduthi);
        console.log(this.dmDiemduthi);

        this.ngType = 1;


      },error:()=>{
        this.ngType = -1;
        this.notifi.toastError('Mất kết nối với máy chủ ');
      }
    })

  }

  getDataKehoachDiemduthi(page:number,limit:string,kehoach_id:number):Observable<{data: KehoachthiDiemduthi[]; recordsFiltered: number;}>{

    const conditionDiemthi: ConditionOption = {
      condition: [
        {
          conditionName: 'kehoach_id',
          condition:OvicQueryCondition.equal,
          value: kehoach_id.toString()
        },
      ],
      page:page.toString(),
      set:[
        {label:'limit',value:limit},
        // {label:'orderby',value:'title'},
      ]
    }
    return this.kehoachthiDiemthiVstepService.getDataByPageNew((conditionDiemthi))
  }

  reLoad(){
    this.loadInit();
  }

  paginate(event){}

  onSekectDiemthi(event, item:DmDiemduthi){
    console.log(event.checked);

    this.dmDiemduthi.find(f=>f.id == item.id)['checked'] = event.checked

  }

  async createNew(){

    const diemthiIds = this.kehoachthiDiemduthi.length > 0 ? this.kehoachthiDiemduthi.map(m=>m.diemduthi_id) : [];

    const dataAdd = this.dmDiemduthi.filter(f=>!diemthiIds.includes(f.id) && f['checked'])
    console.log(dataAdd);
    //
    console.log(dataAdd)
    if(dataAdd.length > 0){
      const html=`
           <p class="text-left">- Thực hiện Thêm điểm dự thi đối với đợt thi  <strong>${this._kehoachthi.title}</strong></p>
           <p class="text-left">- Với trường hợp đã đã có điểm thi từ trước hệ thống sẽ ko tạo thêm điểm thi đó </p>
           <p class="text-left">- Vui lòng chờ vài phút khi thực hiện thao tác này </p>
        `;
      const head='XÁC NHẬN THÊM ĐIỂM DỰ THI CHO THÍ SINH';

      const btn = await this.notifi.confirm(html,head,[BUTTON_NO, BUTTON_YES]);

      if(btn.name === 'yes'){
        const step: number = 100 / dataAdd.length;
        this.notifi.loadingAnimationV2({process: {percent: 0}});
        this.loopCreatedDiemduthi(dataAdd, this._kehoachthi.id, step, 0).subscribe({
          next: (mess) => {
            this.notifi.toastSuccess('Thao tác thành công');
            this.notifi.isProcessing(false);
            this.loadInit();
            this.notifi.disableLoadingAnimationV2();

          }, error: () => {
            this.notifi.toastError('Thao tác vừa thực hiện không thành công');
            this.notifi.isProcessing(false);
            this.notifi.disableLoadingAnimationV2();
          }
        })
      }


    }else{
      this.notifi.toastWarning('Danh sách bạn chọn đã có hoặc chưa được chọn !');
    }

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
              if (this.kehoachthiDiemduthi[index + 1]) {
                this.index_focus = this.kehoachthiDiemduthi[index + 1].id;
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
