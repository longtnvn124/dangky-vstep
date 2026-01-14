import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HskHoidongthi} from "@shared/services/hsk-hoidongthi.service";
import {HoidongPhongthi, VstepHoidongPhongthiService} from "@shared/services/vstep-hoidong-phongthi.service";
import {NotificationService} from "@core/services/notification.service";
import {DmDiemduthi, DmDiemDuThiService} from "@shared/services/dm-diem-du-thi.service";
import {KehoachthiVstepService} from "@shared/services/kehoachthi-vstep.service";
import {Hoidongthi} from "@shared/services/vstep-hoidong-thi.service";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {DropdownModule} from "primeng/dropdown";
import {TableModule} from "primeng/table";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "@shared/shared.module";
import {TooltipModule} from "primeng/tooltip";
import {PaginatorModule} from "primeng/paginator";
import {KehoachthiDiemduthi, KehoachthiDiemthiVstepService} from "@shared/services/kehoachthi-diemthi-vstep.service";
import {ConditionOption} from "@shared/models/condition-option";
import {OvicQueryCondition} from "@core/models/dto";
import {forkJoin, Observable, of, switchMap} from "rxjs";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import * as XLSX from "xlsx";
import {BUTTON_NO, BUTTON_YES} from "@core/models/buttons";
import {OrdersVstep} from "@shared/services/vstep-orders.service";
import {HoidongThisinh, VstepHoidongThisinhService} from "@shared/services/vstep-hoidong-thisinh.service";
import {DonViService} from "@shared/services/don-vi.service";
import {DonVi} from "@shared/models/danh-muc";
import {AuthService} from "@core/services/auth.service";

type AOA = any[][];

@Component({
  selector: 'app-hoidongthi-phongthi',
  standalone: true,
  imports: [CommonModule, ButtonModule, RippleModule, DropdownModule, TableModule, FormsModule, SharedModule, TooltipModule, PaginatorModule, MatProgressBarModule],
  templateUrl: './hoidongthi-phongthi.component.html',
  styleUrls: ['./hoidongthi-phongthi.component.css']
})
export class HoidongthiPhongthiComponent implements OnInit {
  @Input() set hoidong(item: HskHoidongthi) {
    this.hoidongSelect = item;
    this.page = 1;
    this.loadInit();
    // this.ngView = 1;
  }
  hoidongSelect: Hoidongthi =null ;
  page:number = 1;

  dmDiemduthi:DmDiemduthi[]= [];
  listKehoachDiemthi:KehoachthiDiemduthi[]= [];

  listPhongthi:HoidongPhongthi[] = [];

  ngView :-2 | 0 |-1| 1 | 2 | 3 = 0; //3 :Giao dien xếp phongf thi

  dataDonvi:DonVi[] = [];
  isAdmin:boolean=false;
  isTramthi:boolean = false;
  constructor(
    private kehoachthiDiemthiVstepService: KehoachthiDiemthiVstepService,
    private hoidongPhongthiService : VstepHoidongPhongthiService,
    private notifi : NotificationService,
    private hoidongThisinhService: VstepHoidongThisinhService,
    private donviServer:DonViService,
    private auth:AuthService
  ) {
    this.isAdmin = this.auth.userHasRole('admin')
    this.isTramthi = this.auth.userHasRole('diem-du-thi')

  }

  ngOnInit(): void {
  }

  loadInit(){
    this.ngView = 0;

    const conditionkehoachDIemduthi:ConditionOption = {
       condition:[
         {conditionName:'kehoach_id',condition:OvicQueryCondition.equal,value:this.hoidongSelect.kehoach_id.toString()},
       ],
      page:'1',
      set:[
        {label:'limit',value:'-1'},
        {label:'orderby',value:'diemduthi_id'},
        {label:'order',value:'ASC'}
      ]
    }

    this.kehoachthiDiemthiVstepService.getDataByPageNew(conditionkehoachDIemduthi).pipe(switchMap(prj=>{
      const ids = prj.data.map(m=>m.diemduthi_id);
      return forkJoin([
        of(prj),
        this.loopGetDiemduthi(1,50,ids,[])
      ])
    })).subscribe({
      next:([kehoacDiemthi,dmDiemthi])=>{
        console.log(kehoacDiemthi);
        console.log(dmDiemthi);
        this.dataDonvi = dmDiemthi;
        const diemthi_ids= kehoacDiemthi.data.map(m=>m.diemduthi_id)
        if(this.isTramthi && !diemthi_ids.includes(this.auth.user.donvi_id)){
          this.ngView =-2;
          return;
        }


        this.getDataHoidongphongthi(1, 50, [], 1).subscribe({
          next: (data) => {
            console.log(data)
            this.listPhongthi = data;

            const khDiemthi = kehoacDiemthi.data.map((m, index) => {
              // m['__index'] = index + 1;
              m['__dmDiemthi'] = dmDiemthi.find(f => f.id == m.diemduthi_id) ? dmDiemthi.find(f => f.id == m.diemduthi_id) : null;
              m['__diemduthi_title'] = m['__dmDiemthi'] ? m['__dmDiemthi'].title : '';
              m['__hoidongPhongthi'] = data.filter(f => f.diemduthi_id == m.diemduthi_id);

              return m;
            })

            this.listKehoachDiemthi = this.isTramthi ? khDiemthi.filter(f => f.diemduthi_id == this.auth.user.donvi_id) : khDiemthi;
            console.log(this.listKehoachDiemthi)
            this.ngView = 1;

          }, error: () => {
            this.ngView = -1;
            this.notifi.toastError('Mất kết nối với máy chủ')
          }
        })

      },error:()=>{
        this.ngView = -1;
        this.notifi.toastError('Mất kết nối với máy chủ')
      }
    })

  }

  loopGetDiemduthi(page:number, limit:number,ids:number[],data:DonVi[]):Observable<DonVi[]>{
    const start = (page- 1)*limit;
    const end = start  + limit

    if( (page == 0 ? limit : limit *page) < ids.length){
      const ids_select = ids.slice(start , end);
      const conditionDm : ConditionOption = {
        condition: [
          {
            conditionName: 'id',
            condition:OvicQueryCondition.equal,
            value:ids_select.toString(),
            orWhere:'in'
          }
        ],
        page: '1',
        set: [
          {label: 'limit', value:ids_select.length.toString(),}
        ]
      }


      return this.donviServer.getDataByPageNew(conditionDm).pipe(switchMap(a=>{
        return this.loopGetDiemduthi(page + 1,limit,ids,data.concat(...a.data))
      }))

    }else{
      const ids_select = ids.slice(start,end );
      const conditionDm : ConditionOption = {
        condition: [
          {
            conditionName: 'id',
            condition:OvicQueryCondition.equal,
            value:ids_select.toString(),
            orWhere:'in'
          }
        ],
        page: '1',
        set: [
          {label: 'limit', value:ids_select.length.toString(),}
        ]
      }


      return this.donviServer.getDataByPageNew(conditionDm).pipe(switchMap(a=>{
        return of(data.concat(...a.data))
      }))
    }
  }

  private getDataHoidongphongthi(page:number, limit:number,data:HoidongPhongthi[],recordFilted: number):Observable<HoidongPhongthi[]>{
    if(data.length <recordFilted){
      const condition: ConditionOption  = {
        condition:[
          {conditionName:'hoidong_id',condition:OvicQueryCondition.equal,value:this.hoidongSelect.id.toString()},
          {conditionName:'kehoach_id',condition:OvicQueryCondition.equal,value:this.hoidongSelect.kehoach_id.toString()},
        ],
        page: page.toString(),
        set:[
          { label:'limit',value: limit.toString()},
          { label:'orderby',value: 'diemduthi_id'},
          { label:'order',value: 'ASC'},
        ]
      }

      return this.hoidongPhongthiService.getDataByPageNew(condition).pipe(switchMap(m=>{
        return this.getDataHoidongphongthi(page+1,limit,data.concat(m.data),m.recordsFiltered);
      }))

    }else{
      return of(data);
    }
  }



  reload(){
    this.loadInit()
  }

  btnCreate(){
    this.ngView= 2;

  }
  async btnDeleteByHoidong(){
    let html  = `
      <p>- Thao tác này sẽ xóa phòng thi của hội đồng </p>
    `;
    const btn = await this.notifi.confirm(html,'Thông báo',[BUTTON_NO,BUTTON_YES]);

    if(btn.name == 'yes'){
      this.hoidongPhongthiService.deleteByKey(this.hoidongSelect.id,'hoidong_id').subscribe({
        next:()=>{
          this.loadInit();
          this.notifi.isProcessing(false);
          this.notifi.toastSuccess('Thao tác thành công');
        },error:()=>{
          this.notifi.isProcessing(false);
          this.notifi.toastError('Thao tác không thành công');

        }
      })
    }

  }

  returnList(){
    // this.ngView= 2;
    this.file_name= '';
    this.dataUpload= [];
    this.datauploadView= [];
    this.loadInit()
  }

  //=============import FIle=======================

  inputFile() {
    const inputFile: HTMLInputElement = Object.assign(document.createElement('input'), {
      type: 'file',
      accept: '.xlsx,.xls',
      multiple: false,
      onchange: () => {
        this.onDroppedFiles(inputFile.files);

        setTimeout(() => inputFile.remove(), 1000)
      }
    });
    inputFile.click();


  }


  file_name:string = '';
  errorFileType:boolean = false;
  loading :boolean = false;
  dataUpload:any[] = [];
  datauploadView:any[] = [];
  onDroppedFiles(fileList: FileList) {
    const file: File = fileList.item(0);
    this.file_name = file.name;
    this.errorFileType = !(file && this.validateExcelFile(file));
    if (!this.errorFileType) {
      this.loading = true;

      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const wb: XLSX.WorkBook = XLSX.read(e.target.result, {type: 'binary'});

        /* grab first sheet */

        let arrData = [];


        for (let i = 0; i < 6; i++) {
          const sheetNameSelect = wb.SheetNames[i];
          const ws: XLSX.WorkSheet = wb.Sheets[sheetNameSelect];
          const rawData: AOA = <AOA>(XLSX.utils.sheet_to_json(ws, {header: 1}));
          const filterData = rawData.filter(u => !!(Array.isArray(u) && u.length));
          filterData.shift();
          if (filterData.length > 0) {
            // console.log(filterData);
            console.log(filterData);
            const arr = this.covertDataExport(filterData, i + 1);
            arrData = [].concat(...arrData, arr);
          }
        }
        this.dataUpload = arrData;
        this.datauploadView = Array.from(arrData).slice(0,50);
        // console.log(this.datauploadView)

        // this.ketquaImportViewPayment = this.convertInmPortPayment(arrData, 'hsk_capdangky').map(m => {
        //   const capdo = this.dmCapdo.find(f => f.id === parseInt(m.cap_hsk))
        //   m['_capdo_hsk_convent'] = capdo ? capdo.title : '';
        //   m['_dongia'] = capdo ? capdo.gia : '';
        //   m['_thanhtien'] = capdo ? capdo.gia * parseInt(String(m.soluong)) : 0;
        //
        //   return m;
        // });
      };
      reader.readAsBinaryString(file);
    } else {
      this.errorFileType = true;
      this.loading = false;
    }

  }

  covertDataExport(datafile: any, capdo_hsk: number) {
    const data: any[] = [];

    datafile.forEach(row => {
      const cell = {
        stt: row[0],
        diemduthi_id: row[1],
        phongthi: row[2],
        soluong: row[3],
        giangvien: row[4],
      }

      data.push(cell)
    })
    return data;
  }
  validateExcelFile(file: File): boolean {
    const ext = file.name?.split('.').pop()?.toLowerCase();
    return ['xlsx', 'xls'].includes(ext || '');
  }
  paginateViewUpload(event){
    // console.log(event)
    const first:number = event['first']  ;
    const late:number = event['first'] + 50  ;
    const cloneArr =  Array.from(this.dataUpload);
    this.datauploadView = cloneArr.slice(first,late);

  }

  checkDiemduthi(kyhieu:string){
    return !! this.dmDiemduthi.find(f=>f.ma_diemthi == kyhieu);
  }


  btnReset(){
    this.file_name = null;
    this.dataUpload = [];
    this.datauploadView= [];

  }

  async btnSubmitData(){
    console.log(this.dataUpload);

    if(this.dataUpload.length == 0){
      this.notifi.toastWarning('Vui lòng tải file lên');
      return ;
    }

    const dm_ids= this.dmDiemduthi.map(m=>m.ma_diemthi)
    const dataUploadTrue = this.dataUpload.filter(f=> dm_ids.includes(f['diemduthi_id']))
    const dataUploadFalse = this.dataUpload.filter(f=> !dm_ids.includes(f['diemduthi_id']))

    let htm = `
        <p style="margin-bottom:10px;">- Vui lòng kiểm tra lại danh sách phòng thi</p>
        <p style="margin-bottom:10px;">- Thao tác này sẽ thưc hiện tạo phòng thi và lưu lại</p>
        <p style="margin-bottom:10px;">- Hệ thống sẽ chỉ tải lên những phòng thi có mã trùng với điểm dự thi đã cài đặt trong đợt thi</p>
        <p style="margin-bottom:10px;">- có <span style="color:red">${dataUploadFalse.length}</span> phòng thi không hợp lệ   </p>
        <p style="margin-bottom:10px;">- có <span style="color:#0B9419">${dataUploadTrue.length}</span> phòng thi hợp lệ    </p>

        `
    const btn = await this.notifi.confirm(htm, 'Thông báo',[BUTTON_YES,BUTTON_NO]);
    if(btn.name == 'yes'){
      const step: number = 100 / dataUploadTrue.length;
      this.notifi.loadingAnimationV2({process: {percent: 0}});
      this.loopCreatedPhongthiByHoidong(dataUploadTrue, step, 0).subscribe({
        next: (mess) => {
          this.notifi.toastSuccess('Thao tác thành công');
          this.notifi.isProcessing(false);
          this.notifi.disableLoadingAnimationV2();
          this.loadInit();

        }, error: () => {
          this.notifi.toastError('Thao tác vừa thực hiện không thành công');
          this.notifi.isProcessing(false);
          this.notifi.disableLoadingAnimationV2();
        }
      })
    }
  }


  private loopCreatedPhongthiByHoidong(data: any[],step:number,percent:number):Observable<OrdersVstep[]>{
    const index = data.findIndex(f=>!f['isCreated'])
    if (index !== -1) {
      const item  = {

        hoidong_id:this.hoidongSelect.id,
        kehoach_id:this.hoidongSelect.kehoach_id,
        diemduthi_id: !!this.dmDiemduthi.find(f=>f.ma_diemthi == data[index].diemduthi_id) ? this.dmDiemduthi.find(f=>f.ma_diemthi == data[index].diemduthi_id).id :null,
        phongthi: data[index]['phongthi'],
        soluong: data[index]['soluong'],
        giangvien: data[index]['giangvien'],
      };
      return this.hoidongPhongthiService.create(item).pipe(switchMap(m=>{
        data[index]['isCreated']= true;
        const newPercent: number = percent + step;
        this.notifi.loadingAnimationV2({process: {percent: newPercent}});
        return this.loopCreatedPhongthiByHoidong(data,step,newPercent);
      }))
    }else{
      return of(data);
    }
  }

  btnFormSortThisinh(){
    this.ngView = 3;
  }

  isbuttonLoad:boolean = false;
  btnCheckData(){
    this.isbuttonLoad= true;

    forkJoin([
      this.loopGetthisinhByHoidongAndKehoachthi(1,200,[],1),
      this.loopGetphongthiByhoidong(1, 200,[],1)
    ]).subscribe({
      next:([dataThisinh,dataPhongthi])=>{
        console.log(dataThisinh)
        console.log(dataPhongthi)
        this.isbuttonLoad= false;

      }, error:()=>{
        this.isbuttonLoad= false;

      }
    })

  }

  loopGetthisinhByHoidongAndKehoachthi(page:number,limit:number, data:HoidongThisinh[],recordTotal:number):Observable<HoidongThisinh[]>{
    if(data.length <recordTotal){
      const condition:ConditionOption = {
        condition:[
          {
            conditionName:'hoidong_id',
            condition:OvicQueryCondition.equal,
            value:this.hoidongSelect.id.toString(),
          },
          {
            conditionName:'kehoach_id',
            condition:OvicQueryCondition.equal,
            value:this.hoidongSelect.kehoach_id.toString(),
          }
        ],page:page.toString(),
        set:[
          {label :'limit',value:limit.toString()},
        ]
      }

      return  this.hoidongThisinhService.getDataByPageNew(condition).pipe(switchMap(m=>{
        return this.loopGetthisinhByHoidongAndKehoachthi(page+1,limit,data.concat(m.data),m.recordsFiltered)
      }))
    }else{
      return of(data)
    }
  }
  loopGetphongthiByhoidong(page:number,limit:number,data:HoidongPhongthi[],recordTotal:number):Observable<any>{
    if(data.length <recordTotal){
      const condition:ConditionOption = {
        condition:[
          {
            conditionName:'hoidong_id',
            condition:OvicQueryCondition.equal,
            value:this.hoidongSelect.id.toString(),
          },
          {
            conditionName:'kehoach_id',
            condition:OvicQueryCondition.equal,
            value:this.hoidongSelect.kehoach_id.toString(),
          }
        ],page:page.toString(),
        set:[
          {label :'limit',value:limit.toString()},
        ]
      }

      return  this.hoidongPhongthiService.getDataByPageNew(condition).pipe(switchMap(m=>{
        return this.loopGetphongthiByhoidong(page+1,limit,data.concat(m.data),m.recordsFiltered)
      }))
    }else{
      return of(data)
    }
  }

  //-------------------------------------------------------------
  async btnDeleteByDiemduthi(item:KehoachthiDiemduthi){
    const button= await this.notifi.confirmDelete('Thao tác nãy sẽ xóa phòng thi, và thí sinh đã sắp xếp trong phòng thi ?');

    // if(button){
    //   this.hoidongPhongthiService.deleteByKey(item.id,)
    // }
  }

}
