import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {OrdersVstep, VstepOrdersService} from "@shared/services/vstep-orders.service";
import {NotificationService} from "@core/services/notification.service";
import {AuthService} from "@core/services/auth.service";
import {KeHoachThi, KehoachthiVstepService} from "@shared/services/kehoachthi-vstep.service";
import {ConditionOption} from "@shared/models/condition-option";
import {OvicQueryCondition} from "@core/models/dto";
import {SummaryService} from "@shared/services/summary.service";
import {PaginatorModule} from "primeng/paginator";
import {SharedModule} from "@shared/shared.module";
import {TableModule} from "primeng/table";
import {TooltipModule} from "primeng/tooltip";
import {forkJoin, Observable, of, Subscription, switchMap} from "rxjs";
import * as XLSX from "xlsx";
import {CheckboxModule} from "primeng/checkbox";
import {DialogModule} from "primeng/dialog";
import {catchError, finalize, map} from "rxjs/operators";
import {KehoachthiDiemduthi, KehoachthiDiemthiVstepService} from "@shared/services/kehoachthi-diemthi-vstep.service";
import {Router} from "@angular/router";
import {RegisterUserService} from "@shared/services/register-user.service";
import {ThisinhInfoService} from "@shared/services/thisinh-info.service";
import {SenderEmailService} from "@shared/services/sender-email.service";
import {ThanhtoanByQrComponent} from "@shared/components/thanhtoan-by-qr/thanhtoan-by-qr.component";
import {
  DuthiThisinhComponent
} from "@modules/admin/features/tram-thi/dang-ky-du-thi/duthi-thisinh/duthi-thisinh.component";

type AOA = any[][];

@Component({
  selector: 'app-dang-ky-du-thi',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule, ButtonModule, RippleModule, PaginatorModule, SharedModule, TableModule, TooltipModule, CheckboxModule, DialogModule, ThanhtoanByQrComponent, DuthiThisinhComponent],
  templateUrl: './dang-ky-du-thi.component.html',
  styleUrls: ['./dang-ky-du-thi.component.css']
})
export class DangKyDuThiComponent implements OnInit {
  @ViewChild('fromViewRegiter', {static: true}) viewRegiter: TemplateRef<any>;
  ngView            : 0|1|-1|2= 0;
  page              : number = 1;
  recordTotal       : number = 0;
  listKehoach       : KeHoachThi[] = [];
  listKehoachClone  : KeHoachThi[] = [];
  listOrder         : OrdersVstep[] = [];
  limit             : number = 20;
  sizeFullWidth     : number =1024;
  subscription      : Subscription = new Subscription();
   constructor(
    private ordersService:VstepOrdersService,
    private notifi:NotificationService,
    private auth:AuthService,
    private kehoachthiVstepService: KehoachthiVstepService,
    private kehoachthiDiemthiVstepService: KehoachthiDiemthiVstepService,
    private summaryService:SummaryService,
    private router :Router,
    private registerUserService: RegisterUserService,
    private thisinhInfoService: ThisinhInfoService,
    private senderEmailService : SenderEmailService
  ) {
     const observerOnResize = this.notifi.observeScreenSize.subscribe(size => this.sizeFullWidth = size.width)
     this.subscription.add(observerOnResize);
   }

  ngOnInit(): void {
    this.loadInit()
  }

  loadInit(){
    this.modalAddOrder = false;

    const conditionKehoach: ConditionOption= {
      condition:[
        // {conditionName:'status',condition:OvicQueryCondition.equal,value:'1'}
      ],
      page:'1',
      set:[
        {label:'limit',value:'-1'},
        {label:'order_by',value:'id'},
        {label:'order',value:'DESC'},
      ]
    }

    this.notifi.isProcessing(true)

    this.kehoachthiVstepService.getDataByPageNew(conditionKehoach).subscribe({
      next:({data})=>{
        console.log(data);
        const dataKehoach = data.map(m=>{
          m['_time_convertd'] = this.strToTime(m.ngaybatdau) + ' - ' + this.strToTime(m.ngayketthuc);
          return m;
        });

        this.listKehoachClone =dataKehoach
        this.listKehoach= dataKehoach.filter(f=>f.status = 1);
        this.notifi.isProcessing(false);
        this.getOrders();

        this.modalAddOrder = false;
      },
      error:()=>{
        this.modalAddOrder = false;
        this.notifi.isProcessing(false);

      }
    })

  }

  getOrders(){
    this.modalAddOrder = false;
    this.ngView = 0;
     const condition: ConditionOption = {
       condition:[
         {
           conditionName:'diemduthi_id',
           condition:OvicQueryCondition.equal,
           value:'0',
         },
         {
           conditionName:'parent_id',
           condition:OvicQueryCondition.equal,
           value:'0',
         },
         {
           conditionName:'created_by',
           condition:OvicQueryCondition.equal,
           value:this.auth.user.id.toString(),
         },
       ],page:this.page.toString(),
       set:[
         {
           label:'limit',value:this.limit.toString()
         },
         {
           label:'order', value:'DESC'
         }
       ]
     }

     this.ordersService.getDataByPageNew(condition).pipe(switchMap(m=>{
       return forkJoin([
         this.getchildByOrder(m.data),
         of(m.recordsFiltered)
       ])
     })).subscribe({
       next:([data,recordTotal])=>{
         this.ngView = 1;
         this.listOrder = data.length>0 ? data.map((m,index)=>{
           m['_index'] = (this.page - 1)* this.limit + index + 1;
           m['_kehoach'] = this.listKehoach.find(f=>f.id == m.kehoach_id);
           m['_kehoach_title'] = m['_kehoach'] ? m['_kehoach'].title : '';
           m['__ngay_dangky'] = m['created_at'] ? this.formatSQLDateTime(new Date(m['created_at'])) : '';
           m['__ngay_thanhtoan'] = m['thoigian_thanhtoan'] ? this.formatSQLDateTime(new Date(m['thoigian_thanhtoan'])) : '';

           return m
         }):[];
         this.recordTotal = recordTotal;
       },error:()=>{
         this.notifi.toastError('Mất kết nối với máy chủ');
         this.ngView = -1;
       }
     })
  }
  strToTime(input: string): string {
    const date = input ? new Date(input) : null;
    let result = '';
    if (date) {
      result += [date.getDate().toString().padStart(2, '0'), (date.getMonth() + 1).toString().padStart(2, '0'), date.getFullYear().toString()].join('/');
      result += ' ' + [date.getHours().toString().padStart(2, '0'), date.getMinutes().toString().padStart(2, '0')].join(':');
    }
    return result;
  }

  getchildByOrder(orders:OrdersVstep[]):Observable<OrdersVstep[]>{
     const i  = orders.findIndex(f=>!f['isGetChild'])
    if(i !== -1){
      // const item = orders[i];
      const condition: ConditionOption = {
        condition:[
          {
            conditionName:'parent_id',
            condition:OvicQueryCondition.equal,
            value:orders[i].id.toString()
          }
        ],
        page:'1',
        set:[
          {label:'limit',value:'1'},
          {label:'select',value:'id,parent_id'}
        ]
      }
      return this.ordersService.getDataByPageNew(condition).pipe(switchMap(m=>{
        orders[i]['_total'] = m.recordsFiltered;
        orders[i]['isGetChild'] = true;

        return this.getchildByOrder(orders);
      }))
    }else{
      return of(orders)
    }
  }
  formatSQLDateTime(date: Date): string {
    const y = date.getFullYear().toString();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    const h = date.getHours().toString().padStart(2, '0');
    const min = date.getMinutes().toString().padStart(2, '0');
    const sec = '00';
    //'YYYY-MM-DD hh:mm:ss' type of sql DATETIME format
    return `${d}-${m}-${y} ${h}:${min}`;
  }

  reLoad(){
     this.page= 1;
     this.loadInit();

  }

  // ====================== View Form Add============================
  btnViewFormAdd(){
     this.ngView=  2;
  }
  file_name: string = '';

  loading: boolean = false;
  errorFileType:boolean = false;
  dataUpload:any[] = [];
  // ----------------------------------------------------------------
  notifi_loadding:boolean =false;
  modalAddOrder:boolean =false;

  inputFile() {
    const inputFile: HTMLInputElement = Object.assign(document.createElement('input'), {
      type: 'file',
      accept: '.xlsx',
      multiple: false,
      onchange: () => {
        this.onDroppedFiles(inputFile.files);

        setTimeout(() => inputFile.remove(), 1000)
      }
    });
    inputFile.click();
  }

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

        let arrData = [];
        for (let i = 0; i < 6; i++) {
          const sheetNameSelect = wb.SheetNames[i];
          const ws: XLSX.WorkSheet = wb.Sheets[sheetNameSelect];
          const rawData: AOA = <AOA>(XLSX.utils.sheet_to_json(ws, {header: 1,raw: true}));
          const filterData = rawData.filter(u => !!(Array.isArray(u) && u.length));
          filterData.shift();
          if (filterData.length > 0) {
            const arr = this.covertDataExport(filterData);
            arrData = [].concat(...arrData, arr);
          }
        }
        this.dataUpload = arrData;
      };
      reader.readAsBinaryString(file);
    } else {
      this.errorFileType = true;
      this.loading = false;
    }

  }

  covertDataExport(datafile: any, ) {
    const data: any[] = [];

    datafile.forEach(row => {
      const cell = {
        ordering: row[0],
        hodem: row[2],
        ten: row[3],
        ngaysinh: this.convertDateByXlsx(row[4]),
        dantoc: row[5],
        noisinh: row[6].trim(),
        cccd_so: row[7],
        phone:row[10],
        email:row[11],
        diachi_congtac:row[12]
      }

      data.push(cell)
    })

    return data;


  }
  validateExcelFile(file: File): boolean {
    const ext = file.name?.split('.').pop()?.toLowerCase();
    return ['xlsx', 'xls'].includes(ext || '');
  }

  convertDateByXlsx(excelDate:number):string{
    const date = XLSX.SSF.parse_date_code(excelDate);
    return date.y + '-'+ (date.m<10 ? '0' + date.m : date.m) +'-' + (date.d<10 ? '0' + date.d : date.d)
      ;
  }


  countDuplicateValues(arr: any[], key: string): number {
    const map = new Map<string, number>();
    for (const item of arr) {
      let value = item[key];

      if (value === undefined || value === null) continue;
      value = String(value).toLowerCase().trim();
      map.set(value, (map.get(value) || 0) + 1);
    }
    let count = 0;
    for (const [, v] of map) {
      if (v > 1) {
        count += v; // ← khác ở đây
      }
    }
    return count;
  }
  checkDuplicate(arr:any[],item:any,key:string){
    return arr.some(
      f => f[key] == item[key] && f['ordering'] !== item['ordering']
    )
   }

  btnResetForm(){
    this.file_name = '';
    this.dataUpload = [];
  }

  btnSubmitData(){
    if(this.dataUpload.length ==0){
      this.notifi.toastWarning('Không tìm thấy dữ liệu import');
    }else if(this.countDuplicateValues(this.dataUpload,'cccd_so') !== 0 || this.countDuplicateValues(this.dataUpload,'phone') !== 0 ||
      this.countDuplicateValues(this.dataUpload,'email') !== 0
    ){
      this.notifi.toastWarning('Vui lòng kiểm tra lại số điện thoại, email hoặc số CCCD')
    }else{
      this.modalAddOrder =true;
      this.listCheckResult = [];
      this.ketquaImportViewPayment = [];

    }
  }

  tableDiemduthi: KehoachthiDiemduthi;
  checkTabelDiemduth:boolean = false;
  checkthisinhAffterImport(){
    this.listCheckResult = [];
    this.tableDiemduthi =null;
    this.checkTabelDiemduth = false;
      if(this.kehoach_id_select){

        const datacheck = JSON.parse(JSON.stringify(this.dataUpload));
        this.notifi_loadding = true;
        console.log(datacheck);
        if (this.kehoach_id_select && datacheck.length > 0) {
          this.loopCheckInfo(datacheck).pipe(
            finalize(() => this.notifi_loadding = false) // Đảm bảo loading được tắt
          ).pipe(switchMap((m)=>{

            const conditionDiemduthi :ConditionOption = {
              condition:[
                {
                  conditionName:'kehoach_id',
                  condition:OvicQueryCondition.equal,
                  value:this.kehoach_id_select.toString()
                },
                {
                  conditionName:'diemduthi_id',
                  condition:OvicQueryCondition.equal,
                  value:this.auth.user.donvi_id.toString()
                }
              ],
              page:'1',
              set:[
                {label:'limit', value:'-1'},
                {label:'select', value:'id,kehoach_id,soluong,diemduthi_id'},
              ]
            }

            return forkJoin([
              of(m),
              this.ordersService.getDataTotalDiemthiByKehoach(this.kehoach_id_select),
              this.kehoachthiDiemthiVstepService.getDataByPageNew(conditionDiemduthi).pipe(map(m=>m.data))
            ])
          })).subscribe({
            next:([data,capdo,kehoachCapdo])=>{
              this.notifi_loadding = false;
              const dataParam  = data.filter(f => f['__check']?.has_payment == 0).map(m=>{
                m['__user_id'] = m['__check']['user_id'] ? m['__check']['user_id'] : 0 ;
                return m;
              })
              this.listCheckResult = dataParam;
              // const caphsk_ids = Array.from(new Set(dataParam.map(m=>m['hsk_capdangky'] + '')));
              this.tableDiemduthi= kehoachCapdo.filter(f=>f.diemduthi_id == this.auth.user.donvi_id).map(m=>{
                const soluongHaveDangky = capdo.find(f=>f.diemduthi_id == this.auth.user.donvi_id.toString()).total
                m['_soluong_conlai'] = (m.soluong - soluongHaveDangky) > 0 ? (m.soluong - soluongHaveDangky) : 0;
                return m;
              })[0];
              this.checkTabelDiemduth = this.tableDiemduthi['_soluong_conlai'] > 0 ;
            },error:()=>{
              this.notifi_loadding = false;
              this.notifi.toastError('Mất kết nối với máy chủ')
            }
          })
        }
        else{
          this.notifi.toastWarning('Không tìm thấy dữ liệu import');
          this.notifi_loadding = false;
        }
      }else{
        this.notifi.toastWarning('Vui lòng chọn đợt thi');
      }
  }
  check_accept:any;

  kehoach_id_select: number = null;
  ketquaImportViewPayment: any[] = [];
  listCheckResult: any[] = [];

  changeKehoachthi(event) {
    this.kehoach_id_select = event.value;
    this.listCheckResult = [];
    this.ketquaImportViewPayment = [];
  }

  private loopCheckInfo(data: any[]): Observable<any[]> {
    const index: number = data.findIndex(i => !i['have_check']);
    if (index !== -1) {
      data[index]['have_check'] = true;
      const check = data[index];
      const item = {
        username: check["cccd_so"],
        email: check['email'],
        phone: check['phone'],
        diemduthi_id: this.auth.user.donvi_id,
        kehoach_id: this.kehoach_id_select
      };
      return this.summaryService.check(item).pipe(
        switchMap(m => {
          data[index]['__check'] = m;
          return this.loopCheckInfo(data);
        })
      );
    } else {
      return of(data);
    }
  }

  getDongia(kehoach_id:number){
    return this.listKehoachClone.find(f=>f.id == kehoach_id) ?this.listKehoachClone.find(f=>f.id == kehoach_id).gia : 0;
  }
  getTongDongia(soluong:number, kehoach_id:number){
    if(kehoach_id == 0){
      return 0;
    }

    const kehoach = this.listKehoachClone.find(f=>f.id == kehoach_id);
    return kehoach ? kehoach.gia * soluong : 0;
  }

  btnPayment(){
    if (!this.kehoach_id_select){
      return this.notifi.toastError('Chưa chọn đợt đăng ký');

    }else if(this.listCheckResult.length == 0){
      return this.notifi.toastWarning('Danh sách tải lên có số lượng thí sinh ko phù hợp');
    }else{
      this.notifi.loadingAnimationV2({process: {percent: 0}});

      this.createUserLogin(this.listCheckResult).pipe(
        // switchMap(data => this.loopEmailByThiSinh(data, step, 0),),
        switchMap(data => {
          this.notifi.loadingAnimationV2({process: {percent: 25}});
          return this.loopCreatUserInfo(data);
        }),

        switchMap(data2 => {
          this.notifi.loadingAnimationV2({process: {percent: 50}});
          return this.createOrder(data2);
        }),
        switchMap(() => {
          this.notifi.loadingAnimationV2({process: {percent: 75}});
          return this.sendEmail(this.auth.user, this.kehoach_id_select, this.ketquaImportViewPayment);
        }),

      ).subscribe({
        next: (data) => {
          this.modalAddOrder = false;
          this.kehoach_id_select = null;
          this.notifi.toastSuccess('Đăng ký thi thành công');
          this.notifi.disableLoadingAnimationV2()
          this.loading = false;

          this.page = 1;

          this.loadInit();
        },
        error: (e) => {
          this.loading = false;

          this.notifi.disableLoadingAnimationV2()
          this.notifi.toastError('Đã có lỗi trong quá trình thực hiện đăng ký');
        }
      })
    }
  }


  generate_password() {
    const lower = 'abcdefghijklmnopqrstuvwxyz'; // Chữ cái thường
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Chữ cái hoa
    const digits = '0123456789';                 // Số
    const symbols = '#?!@$%^&*-'; // Ký tự đặc biệt
    const requiredCharacters = [
      lower[Math.floor(Math.random() * lower.length)], // Một chữ cái thường
      upper[Math.floor(Math.random() * upper.length)], // Một chữ cái hoa
      digits[Math.floor(Math.random() * digits.length)], // Một số
      symbols[Math.floor(Math.random() * symbols.length)], // Một ký tự đặc biệt
    ];
    const allCharacters = lower + upper + digits + symbols;
    while (requiredCharacters.length < 12) {
      requiredCharacters.push(allCharacters[Math.floor(Math.random() * allCharacters.length)]);
    }
    return requiredCharacters.sort(() => Math.random() - 0.5).join('');
  }


  private createUserLogin(data: any[]): Observable<any[]> {
    const index: number = data.findIndex(i => i['__user_id'] == 0 );
    if (index !== -1) {
      const item = data[index];
      const itemRegiter = {
        username: item.cccd_so.trim(),
        email: item.email,
        // email: 'longkakainfo@gmail.com',
        password: this.generate_password(),
        display_name: item.hodem.trim() + ' ' + item.ten.trim(),
        phone: item.cccd_so.trim() + '_'+ item.phone.trim(),
        verify_url: `${location.origin}${this.router.serializeUrl(this.router.createUrlTree(['verification/']))}`
        // verify_url: `https://hsk.tnu.edu.vn/verification`
      }

      // data[index]['__canUser'] = true;
      return this.registerUserService.creatUser(itemRegiter).pipe(
        switchMap((prj) => {
            data[index]['__user_id'] = parseInt(prj['data']);
            data[index]['__have_old_user'] = parseInt['user_exist'];
            data[index]['__have_send_email'] = prj['verified'] === 1;
            return this.createUserLogin(data)
          }
        ))
    } else {

      return of(data);
    }
  }
  private loopCreatUserInfo(data: any[]): Observable<any[]> {

    const index: number = data.findIndex(i => !i['__canInfo']);
    if (index !== -1) {

      const item = data[index];
      const itemCreate = {
        user_id: item['__user_id'],
        hoten: item['hodem'] + ' ' + item['ten'],
        ten: item['ten'].trim(),
        ngaysinh: this.replaceBirth(item['ngaysinh']),
        noisinh:item['noisinh'],
        dantoc:item['dantoc'],
        cccd_so: item['cccd_so'].replace(/'/g,""),
        phone: item['phone'].replace(/'/g,""),
        email: item['email'],
        donvi_congtac: item['donvi_congtac'],
        status: 0,
        camket: 1,

      }
      data[index]['__canInfo'] = true;
      return this.thisinhInfoService.create(itemCreate).pipe(
        switchMap(m => {
          data[index]['__thisinh_id'] = m ? m : null;
          return this.loopCreatUserInfo(data)
        }))
    } else {
      return of(data);
    }

  }

  replaceBirth(dateString: string) {
    if (dateString) {
      const [year, month, day] = dateString.trim().split("-");
      return `${day}/${month}/${year}`;
    } else {
      return null;
    }
  }
  private createOrder(data: any[]) {

    const itemCreated = {
      user_id: this.auth.user.id,
      kehoach_id: this.kehoach_id_select,
      lephithi: this.getTongDongia(this.listCheckResult.length, this.kehoach_id_select)
    }
    return this.ordersService.create(itemCreated).pipe(switchMap(m => {
      itemCreated['id'] = m;
      return this.loopCreatedOrder(data, itemCreated);
    }));

  }

  private loopCreatedOrder(data: any, itemParent: any, ) {
    const index: number = data.findIndex(i => !i['__canOrder']);
    if (index !== -1) {
      const item = data[index];

      const itemCreate = {
        parent_id: itemParent['id'],
        kehoach_id: itemParent['kehoach_id'],
        diemduthi_id: this.auth.user.donvi_id,
        user_id: item['__user_id'],
        lephithi: this.getDongia(this.kehoach_id_select),
        thisinh_id: item['__thisinh_id'],

      }
      data[index]['__canOrder'] = true;

      return this.ordersService.create(itemCreate).pipe(
        switchMap((m) => {
          return this.loopCreatedOrder(data, itemParent)
        }))
    } else {
      return of(data);
    }

  }

  sendEmail(user, kehoach_id: number, arrCapdo: any[]) {

    let message = `

        <p>Bạn đã đăng ký thi Bài thi V-STEP</p>

        <p style="font-weight:700;">THÔNG TIN ĐĂNG KÝ:</p>
        <table width="100%" style="border:0;">
            <tr>
                <td style="width:100px;">Trạm thi: </td>
                <td style="font-weight:600">${user.display_name}</td>
            </tr>
            <tr>
                <td style="width:100px;">đợt thi đăng ký: </td>
                <td style="font-weight:600">${this.listKehoachClone.find(f => f.id === kehoach_id) ? this.listKehoachClone.find(f => f.id === kehoach_id).title : ''}</td>
            </tr>
        </table>

        <p>Thông tin thanh toán</p>
        <table style=" border: 1px solid black;border-collapse: collapse;">
          <tr style="border: 1px solid black;border-collapse: collapse;">

            <th style="border: 1px solid black;border-collapse: collapse;text-align:center;" width="150px"><strong>Số lượng</strong></th>
            <th style="border: 1px solid black;border-collapse: collapse;text-align:center;" width="150px"><strong>Đơn giá </strong></th>
            <th style="border: 1px solid black;border-collapse: collapse;text-align:center;" width="150px"><strong>Thành tiền </strong></th>
          </tr>
          <tr style="border: 1px solid black;border-collapse: collapse;">

            <td style="border: 1px solid black;border-collapse: collapse;text-align:center;">${this.listCheckResult.length}</td>
            <td style="border: 1px solid black;border-collapse: collapse;text-align:center">${this.getDongia(this.kehoach_id_select)}</td>

            <td style="border: 1px solid black;border-collapse: collapse;text-align:right;">${this.getTongDongia(this.listCheckResult.length, this.kehoach_id_select).toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND'
    })}</td>
</table>
    <p style="color: #ce3b04;">- Trạng thái thanh toán: Chưa thanh toán.</p>
    <p>- Bạn vui lòng thanh toán lệ phí thi để hoàn tất quá trình đăng ký .</p>
    `;


    const emailsend: any = {
      to: this.auth.user.email,
      title: ' Email thông báo đăng ký thành công',
      message: message
    }
    this.notifi.isProcessing(true)
    return this.senderEmailService.sendEmail(emailsend).pipe(
      catchError(() => {
        this.notifi.toastError('Hệ thống gửi Email đăng ký không thành công');
        this.notifi.isProcessing(false);
        return of('comple')
      }),
      switchMap(e => {
        this.notifi.toastSuccess("Hệ thống gửi Email đăng ký thi thành công.");
        this.notifi.isProcessing(false);
        return of(e);
      })
    )
  }



  //=================================================================

  order_select :OrdersVstep  = null;
  btnViewThisinhBydangky(item:OrdersVstep){
    this.order_select = {...item}
    this.notifi.isProcessing(false);
    this.notifi.openSideNavigationMenu({
      name:'view',
      template: this.viewRegiter,
      size: this.sizeFullWidth,
      offsetTop: '0px'
    });
  }
  btnItemPayment(item:OrdersVstep){
    this.order_select = {...item};
    this.displayModalThanhtoan = true;

  }
  async btnDeleteItem(item:OrdersVstep){
    const confirm = await this.notifi.confirmDelete();
    if (confirm) {

      const childCon: ConditionOption = {
         condition:[
           {
            conditionName:'parent_id',
             condition:OvicQueryCondition.equal,
             value:item.id.toString()
           }
         ],page:'1',
        set:[
          {
            label:'select',value:'id,parent_id,user_id,thisinh_id'
          },
          {
            label:'limit',value:'-1'
          }
        ]
      }
      forkJoin([
        this.ordersService.getDataByPageNew(childCon).pipe(
          switchMap(m => {
            const step: number = 100 / m.data.length;
            return this.loopDeleteItemChildById(m.data, step, 0)
          })
        ),
        this.ordersService.delete(item.id),
      ]).subscribe({
        next: () => {
          this.page = 1;
          this.notifi.isProcessing(false);
          this.notifi.toastSuccess('Thao tác thành công');
          this.notifi.disableLoadingAnimationV2()
          this.loadInit();

        }, error: () => {
          this.notifi.disableLoadingAnimationV2()
          this.notifi.isProcessing(false);
          this.notifi.toastError('Thao tác không thành công');
        }
      })
    }
  }
  loopDeleteItemChildById(data: OrdersVstep[], step: number, percent: number) {
    const index: number = data.findIndex(i => !i['__canDelete']);
    if (index !== -1) {
      const item = data[index];
      data[index]['__canDelete'] = true;
      const newPercent: number = percent + step;
      this.notifi.loadingAnimationV2({process: {percent: newPercent}});
      return this.ordersService.delete(item.id).pipe(
        switchMap(() => {
            return this.loopDeleteItemChildById(data, step, newPercent)
          }
        ))
    } else {
      return 'comple';
    }
  }
  //-----------------------------------------------------------------------
  displayModalThanhtoan:boolean = false;

  closeDialogThanhtoan(){
    this.displayModalThanhtoan =false;
    this.loadInit();

  }
  closeForm(){
    this.ngView = 1;
    this.kehoach_id_select = 0;
    this.listCheckResult = [];
    this.dataUpload = [];
    this.notifi.closeSideNavigationMenu();
  }
}
