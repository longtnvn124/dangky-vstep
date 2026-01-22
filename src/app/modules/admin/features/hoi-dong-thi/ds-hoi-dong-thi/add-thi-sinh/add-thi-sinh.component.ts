import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {HskHoidongthi} from "@shared/services/hsk-hoidongthi.service";
import {NotificationService} from "@core/services/notification.service";
import {NgPaginateEvent} from "@shared/models/ovic-models";
import {debounceTime, forkJoin, Observable, of, Subject, switchMap} from "rxjs";
import * as XLSX from "xlsx";
import {Paginator, PaginatorModule} from "primeng/paginator";
import {BUTTON_NO, BUTTON_YES} from "@core/models/buttons";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {TableModule} from "primeng/table";
import {NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {MatMenuModule} from "@angular/material/menu";
import {InputTextModule} from "primeng/inputtext";
import {HoidongThisinh, VstepHoidongThisinhService} from "@shared/services/vstep-hoidong-thisinh.service";
import {ConditionOption} from "@shared/models/condition-option";
import {OvicQueryCondition} from "@core/models/dto";
import {OrdersVstep, VstepOrdersService} from "@shared/services/vstep-orders.service";
import {ThiSinhInfo} from "@shared/models/thi-sinh";
import {ThisinhInfoService} from "@shared/services/thisinh-info.service";
import {DonViService} from "@shared/services/don-vi.service";
import {DonVi} from "@shared/models/danh-muc";
import {AuthService} from "@core/services/auth.service";

type AOA = any[][];

@Component({
  selector: 'app-add-thi-sinh',
  templateUrl: './add-thi-sinh.component.html',
  styleUrls: ['./add-thi-sinh.component.css'],
  imports: [
    ButtonModule,
    RippleModule,
    TableModule,
    PaginatorModule,
    NgSwitch,
    NgSwitchCase,
    MatMenuModule,
    InputTextModule,
    NgIf
  ],
  standalone: true
})
export class AddThiSinhComponent implements OnInit {
  // @ViewChild('ViewuploadP') paginatorViewUpload: Paginator;
  @ViewChild(Paginator) paginator: Paginator;

  @Input() set hoidong(item: HskHoidongthi) {
    this.hoidong_select = {...item};
    this.ngtype = 0;


    this.loadInit();
  }

  ngtype                : -1 | 0 | 1 | 2 = 2;//-1 err,1:true,0:load. 2:form
  hoidong_select        : HskHoidongthi;

  listData              : HoidongThisinh[] = []
  dataUpload            : any[] = [];
  recordTotal           : number = 0;
  page                  : number = 1;
  search                : string= '';
  private inputChanged  : Subject<string> = new Subject<string>();
  rows                  : number = 20;

  dataDonvi: DonVi[]= [];

  constructor(
    private notifi: NotificationService,
    private hoidongThisinhService: VstepHoidongThisinhService,
    private ordersService : VstepOrdersService,
    private thisinhService: ThisinhInfoService,
    private donViService:DonViService,
    private auth : AuthService

  ) {

  }

  ngOnInit(): void {
    this.inputChanged.pipe(debounceTime(1000)).subscribe((item: string) => {
      this.searchContentByInput(item);
    });
  }

  loadInit() {
    // this.file_name ='';
    // this.datauploadView = [];
    // this.dataUpload = [];
    this.ngtype = 0;
    this.donViService.getChildren(this.auth.user.donvi_id).subscribe({
      next:(data)=>{
        this.dataDonvi = data.filter(f=>f.id !== this.auth.user.donvi_id);
        this.getData();
      },error:()=>{
        this.ngtype = -1;
        this.notifi.toastError('Mất kết nối với máy chủ')
      }
    })




  }


  getData(){
    this.notifi.isProcessing(true);

    const condtion :ConditionOption = {
      condition: [
        {
          conditionName:'hoidong_id',
          condition:OvicQueryCondition.equal,
          value:this.hoidong_select.id.toString()
        },
        {
          conditionName:'hoidong_id',
          condition:OvicQueryCondition.equal,
          value:this.hoidong_select.id.toString()
        }
      ],
      page: this.page.toString(),
      set:[
        {label:'limit',value:this.rows.toString()},
        {label:'order',value:'ASC'},
        // {label:'orderby',value:'hoten'},
      ]
    }
    if(this.search){
      condtion.condition.push(
        {
          conditionName:'hoten',
          condition:OvicQueryCondition.like,
          value:`%${this.search}%`
        },
      )
    }

    this.hoidongThisinhService.getDataByPageNew(condtion).pipe(switchMap(prj=>{

      const thisinh_ids = Array.from(new Set(prj.data.map(m=>m.thisinh_id)))
      return forkJoin([
        of(prj),
        this.loopGetThisinh(1,20,thisinh_ids,[])
      ])
    })).subscribe({
      next:([{data,recordsFiltered},thisinhs])=>{
        this.recordTotal = recordsFiltered;
        this.listData = data.length>0 ? data.map((m,index)=>{
          m['__index'] = (this.page -1)*this.rows +( index + 1);

          m['_diemduthi'] = this.dataDonvi.find(f=>f.id == m.diemduthi_id) ? this.dataDonvi.find(f=>f.id == m.diemduthi_id).title : '';

          const thisinh = thisinhs.find(f=>f.id === m.thisinh_id)
          m['_thisinh'] = thisinh;
          m['_hoten'] = thisinh ? thisinh.hoten : '';
          m['_cccd'] = thisinh ? thisinh.cccd_so : '';
          m['_email'] = thisinh ? thisinh.email:'';
          m['_phone'] = thisinh ? thisinh.phone:'';
          m['_gioitinh'] = thisinh ? thisinh.gioitinh == 'nam' ? 'Nam' : 'Nữ' :'';
          m['_ngaysinh'] = thisinh ? thisinh.ngaysinh:'';

          return m;
        }): [];
        this.notifi.isProcessing(false);
        this.ngtype =  this.listData.length> 0 ? 1: 2;
      },error:()=>{
        this.notifi.isProcessing(false);
        this.ngtype = -1;
        this.notifi.toastError('load dữ liệu không thành công');
      }
    })
  }

  loopGetDiemduthi(page:number, limit:number,arr:DonVi[],recor:number):Observable<DonVi[]>{
    if(arr.length < recor){
      const condtion :ConditionOption = {
        condition: [
          {
            conditionName:'parent_id',
            condition:OvicQueryCondition.equal,
            value:this.auth.user.donvi_id.toString()
          }
        ],
        page: this.page.toString(),
        set:[
          {label:'limit',value:limit.toString()},
          {label:'select',value:'id,title'},
        ]
      }
      return this.donViService.getDataByPageNew(condtion).pipe(switchMap(m=>{
        return this.loopGetDiemduthi(page+1,limit,[...arr,...m.data],m.recordsFiltered)
      }))

    }else{
      return of(arr)
    }
  }


  paginate({page}: NgPaginateEvent) {
    this.page = page + 1;
    this.getData();
  }

  onInputChange(event: string) {
    this.inputChanged.next(event);
  }

  searchContentByInput(text: string) {
    this.page = 1;
    this.search= text ? text.trim():'';
    this.getData();
  }


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
        sobaodanh: row[0],
        hoten: row[1],
        hoten_tiengtrung: row[2],
        gioitinh: row[3],
        loai_giayto: row[4].trim(),
        cccd_so: row[5],
        ngaysinh: row[6],
        quoctich: row[7] ,
        ngonngu_me: row[8],
        trangthai_dangky: row[9],
        phone: row[10],
        email: row[11].trim(),
        diachi: row[12],
        caphsk: row[13],
        thoigian_duthi:row[14],
        loai_ungvien: row[15],
        quoctich_ungvien: row[16],
        phongthi:row[17],
        thoigian_dangky: row[18],
        loai_dangky: row[19],
        trungtam_duthi: row[20],
        loai_duthi: row[21],
        trungtam_ghichu: row[22],
        ungvien_ghichu: row[23],
        phienbanthi: row[24],
        ngongu_thieuso:row[25],
        loai_kiemtra:row[26]
      }

      data.push(cell)
    })
    return data;
  }
  validateExcelFile(file: File): boolean {
    const ext = file.name?.split('.').pop()?.toLowerCase();
    return ['xlsx', 'xls'].includes(ext || '');
  }

  btnReturn(){
    this.ngtype= 0;
    this.page= 1;

    this.loadInit();
  }

  async saveFile(){
    if(this.dataUpload.length>0){

      const html=`
           <p class="text-center">Thực hiện tải lên ${this.dataUpload.length} bản ghi của thí sinh</p>
           <p class="text-center">Vui lòng chờ vài phút khi thực hiện thao tác này </p>
        `;
      const head='XÁC NHẬN THÊM THÍ SINH VÀO HỘI ĐỒNG';

      const btn = await this.notifi.confirmRounded(html,head,[BUTTON_NO, BUTTON_YES]);

      if(btn.name === 'yes'){
        const step: number = 100 / this.dataUpload.length;
        this.notifi.loadingAnimationV2({process: {percent: 0}});
        this.loopUploadData(this.dataUpload, step, 0).subscribe({
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
      this.notifi.toastWarning('Danh sách tải lên không có bản ghi nào');
    }
  }

  datauploadView :any[];
  paginateViewUpload(event){
    // console.log(event)
    const first:number = event['first']  ;
    const late:number = event['first'] + 50  ;
    const cloneArr =  Array.from(this.dataUpload);
    this.datauploadView = cloneArr.slice(first,late);

  }
  replacePhongthi(text:string){
    let match = text.match(/--\s*(.*)/);
    return  match ? match[1].trim() : "";
  }

  private loopUploadData(data:any[],step:number,percent:number):Observable<any> {

    const index = data.findIndex(i => !i['isCreated']);
    if (index !== -1) {
      const item  = {...data[index],hoidong_id:this.hoidong_select.id,kehoach_id:this.hoidong_select.kehoach_id,phongthi:this.replacePhongthi(data[index].phongthi) };
      return this.hoidongThisinhService.create(item).pipe(switchMap(m=>{
        data[index]['isCreated']= true;
        const newPercent: number = percent + step;
        this.notifi.loadingAnimationV2({process: {percent: newPercent}});
        return this.loopUploadData(data,step,newPercent);
      }))
    } else {
      return of(data);
    }
  }

  viewAddUpload(){
    this.ngtype =  2;
  }
  async btnDeletedUpload(){
    const html = `
        <p>Thao tác này sẽ xóa tất cả kết quả dữ liệu đã tải lên ?</p>
    `;
    const head = 'XÁC NHẬN';
    const btn =  await this.notifi.confirmRounded(html,head,[BUTTON_NO,BUTTON_YES]);
    if(btn.name === 'yes'){
      this.notifi.isProcessing(true);
      this.hoidongThisinhService.deleteByKey(this.hoidong_select.id,'hoidong_id').subscribe({
        next:()=>{
          this.notifi.toastSuccess('Thao tác thành công');
          this.notifi.isProcessing(false);
          this.getData();
          },
        error:()=>{
          this.notifi.toastError('Thao tác không thành công');
          this.notifi.isProcessing(false);

        }
      })
    }
  }


  isbuttonLoad  : boolean =false;
  showCheck     : boolean =false;
  dataOrders: OrdersVstep[] = [];
  btnCheckData(){
    this.isbuttonLoad = true;


    this.loopGetOrrder(1,100,this.hoidong_select.kehoach_id, [], 1).pipe(switchMap(m=>{
      const thisinh_ids = Array.from(new Set(m.map(a=>a.thisinh_id))) ;
      console.log(thisinh_ids)
      return forkJoin([
        of(m),
        this.loopGetThisinh(1,20, thisinh_ids,[])
      ])
    })).subscribe({
      next:([data,thisinhs])=>{
        this.dataOrders = data.map(m=>{
          m['_thisinh'] = thisinhs.find(f=>f.id == m.thisinh_id);
          m['_hoten'] =  m['_thisinh'] ?  m['_thisinh']['hoten'] : '';
          return m;
        });
        this.isbuttonLoad = false;
        this.showCheck = true;

      },error:()=>{
        this.isbuttonLoad = false;
        this.showCheck = true;
        this.notifi.toastError('Mất kết nối với máy chủ');
      }
    })
  }

  private loopGetOrrder(page: number, limit:number, kehoach_id:number , data:OrdersVstep[], recordFilteled:number):Observable<OrdersVstep[]>{

    if(data.length < recordFilteled){
      const conditionCheck :ConditionOption  ={
        condition:[
          {
            conditionName:'trangthai_thanhtoan',
            condition:OvicQueryCondition.equal,
            value:'1'
          },
          {
            conditionName:'kehoach_id',
            condition:OvicQueryCondition.equal,
            value:kehoach_id.toString()
          },
          {
            conditionName:'diemduthi_id',
            condition:OvicQueryCondition.notEqual,
            value:'0'
          },
        ],page:page.toString(),
        set:[
          {label:'limit',value:limit.toString()},
          {label:'select',value:'thisinh_id,trangthai_thanhtoan,user_id,diemduthi_id,lephithi'},

        ]
      }

      return  this.ordersService.getDataByPageNew(conditionCheck).pipe(switchMap(m=>{

        return this.loopGetOrrder(page+1,limit,kehoach_id,[...data,...m.data],m.recordsFiltered)
      }))
    }else{
      return of(data);
    }
  }
  loopGetThisinh(page:number,limit:number,ids:number[],data:ThiSinhInfo[]):Observable<ThiSinhInfo[]>{
    // return of(data)

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
      return this.thisinhService.getDataByPageNew(conditionDm).pipe(switchMap(a=>{
        return this.loopGetThisinh(page + 1,limit,ids,data.concat(a.data))
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


      return this.thisinhService.getDataByPageNew(conditionDm).pipe(switchMap(a=>{
        return of(data.concat(a.data))
      }))
    }

  }

  async btnAccept(){
    let html = `
      <div style="font-size:14px;">- Thao tác này sẽ thêm thí sinh vào hội đồng thi</div>
      <div style="font-size:14px;">- Trong thời gian đồng bộ vui lòng không <strong>Tắt hệ thống, Ngắt kết nối mạng...</strong></h4>
    `;
    const btn = await this.notifi.confirm(html,'Thông báo thêm sinh viên vào hội đồng' ,[BUTTON_NO,BUTTON_YES])

    if(btn.name =='yes'){
      const step: number = 100 / this.dataOrders.length;
      this.notifi.loadingAnimationV2({process: {percent: 0}});
      this.loopCreatedThisinhWithHoidong(this.dataOrders, step, 0).subscribe({
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


  private loopCreatedThisinhWithHoidong(data: OrdersVstep[],step:number,percent:number):Observable<OrdersVstep[]>{
    const index = data.findIndex(f=>!f['isCreated'])
    if (index !== -1) {
          const item  = {

            thisinh_id:data[index].thisinh_id ,
            diemduthi_id:data[index].diemduthi_id ,
            hoten:data[index]['_hoten'] ,
            user_id:data[index].user_id ,
            hoidong_id:this.hoidong_select.id,
            kehoach_id:this.hoidong_select.kehoach_id};
          return this.hoidongThisinhService.create(item).pipe(switchMap(m=>{
            data[index]['isCreated']= true;
            const newPercent: number = percent + step;
            this.notifi.loadingAnimationV2({process: {percent: newPercent}});
            return this.loopCreatedThisinhWithHoidong(data,step,newPercent);
          }))
    }else{
      return of(data);
    }


  }

  // private loopUploadData(data:any[],step:number,percent:number):Observable<any> {
  //
  //   const index = data.findIndex(i => !i['isCreated']);
  //   if (index !== -1) {
  //     const item  = {...data[index],hoidong_id:this.hoidong_select.id,kehoach_id:this.hoidong_select.kehoach_id};
  //     return this.HskHoidongKetquaService.create(item).pipe(switchMap(m=>{
  //       data[index]['isCreated']= true;
  //       const newPercent: number = percent + step;
  //       this.notifi.loadingAnimationV2({process: {percent: newPercent}});
  //       return this.loopUploadData(data,step,newPercent);
  //     }))
  //   } else {
  //     return of(data);
  //   }
  // }

}
