import {Component, OnInit, ViewChild} from '@angular/core';
import {Paginator} from "primeng/paginator";
import {HskVandon, HskVandonService} from "@shared/services/hsk-vandon.service";
import {debounceTime, Observable, of, Subject, Subscription, switchMap} from "rxjs";
import {HskKehoachThiService, KeHoachThi} from "@shared/services/hsk-kehoach-thi.service";
import {HskOrdersShip, HskOrdersShipService} from "@shared/services/hsk-orders-ship.service";
import {NotificationService} from "@core/services/notification.service";
import {ThemeSettingsService} from "@core/services/theme-settings.service";
import {NgPaginateEvent} from "@shared/models/ovic-models";
import * as XLSX from "xlsx";
import {BUTTON_NO, BUTTON_YES} from "@core/models/buttons";
import {SenderEmailService} from "@shared/services/sender-email.service";
import {BuiltinTypeName} from "@angular/compiler";
type AOA = any[][];

@Component({
  selector: 'app-van-don',
  templateUrl: './van-don.component.html',
  styleUrls: ['./van-don.component.css']
})
export class VanDonComponent implements OnInit {

  @ViewChild(Paginator) paginator: Paginator;

  typeTab: 1 | 0 = 0;// 0: danh sách kết qua thi 1:thao tác add file

  isLoading: boolean = false;

  recordsTotal: number = 0;

  listData: HskVandon[];
  rows = 50;
  page: number = 1;

  subscription = new Subscription();

  private inputChanged: Subject<string> = new Subject<string>();

  textSearch:string = '';
  //============================================================
  errorFileType: boolean = false;
  loading: boolean = false;
  //============================================================
  dsKehoachthi: KeHoachThi[];
  // hoidongSelect: ThptHoiDong;
  //
  dsThisinhInHoidong: HskOrdersShip[] = [];

  //============================ sử lý file =======================
  file_name: string = '';
  datafile: HskVandon[] = [];
  ketquaChange: 'have'|'nothave' = "have";
  ketquaImportView:HskVandon[] = [];
  dsKetqua_have:HskVandon[] = [];
  dsKetqua_nothave:HskVandon[] = [];
  ketquaImportViewClone:HskVandon[] = [];
  ketquaImportViewCloneTotal:number = 0;

  constructor(
    private hskVandonService: HskVandonService,
    private hskKehoachThiService: HskKehoachThiService,
    private notificationService: NotificationService,
    private themeSettingsService: ThemeSettingsService,
    private hskOrdersShipService: HskOrdersShipService,
    private senderEmailService: SenderEmailService,
  ) {
  }

  ngOnInit(): void {
    this.inputChanged.pipe(debounceTime(1000)).subscribe((item: string) => {
      this.inputSearch(item);
    });
    this.loadInit()
  }


  loadInit() {
    this.notificationService.isProcessing(true);
    this.isLoading = true;
    this.hskKehoachThiService.getDataUnlimit().subscribe({
      next: (data) => {
        this.dsKehoachthi = data;
        this.notificationService.isProcessing(false);
        this.isLoading = false;
        if (this.dsKehoachthi.length > 0) {
          this.loadData(1);

        }
      }, error: () => {
        this.isLoading = false;

        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Load dữ liệu hội đồng không thành công ');
      }
    })

  }

  kehoach_id_select:number =null;
  loadData(page: number) {
    this.dataSelct = [];
    this.notificationService.isProcessing(true);
    this.hskVandonService.searchbytextAndHoidongId(page,this.textSearch.trim(), this.kehoach_id_select).subscribe({
      next: ({recordsTotal, data}) => {
        this.recordsTotal = recordsTotal;
        this.listData = data.map((m,index)=>{
          m['__index_table'] = index + 1;
          return m
        })
        this.notificationService.isProcessing(false);

      }, error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('load dữ liệu không thành công');
      }
    })
  }

  btnChangeType(type: 1 | 0) {
    this.typeTab = type;
    if (type === 1) {
      // this.loadDatahoidong();
      this.btnReset();
    } else {
      this.loadData(1);
    }
  }

  paginate({page}: NgPaginateEvent) {
    this.page = page + 1;
    this.loadData(this.page);
  }

  paginateViewImport(event){
    // console.log(event)
    const first:number = event['first']  ;
    const late:number = event['first'] + 50  ;

    let arrNew  =[]
    if(this.ketquaChange === 'have'){
      arrNew = Array.from(this.dsKetqua_have);
    }else{
      arrNew= Array.from(this.dsKetqua_nothave);

    }

    this.ketquaImportView = arrNew.slice(first,late);
  }
  inputSearch(text:string){

    this.textSearch = text.trim();
    this.loadData(this.page);
  }

  onInputChange(event: string) {

    this.inputChanged.next(event);
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
              const arr = this.covertDataExport(filterData);
              arrData = [].concat(...arrData, arr);
            }
          }

          this.datafile = arrData;
          // console.log(this.datafile);
        };
        reader.readAsBinaryString(file);
      } else {
        this.errorFileType = true;
        this.loading = false;
      }


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

  validateExcelFile(file: File): boolean {
    const ext = file.name?.split('.').pop()?.toLowerCase();
    return ['xlsx', 'xls'].includes(ext || '');
  }


  kehoachSelect: KeHoachThi;
  changeHoidong(event) {

    this.kehoachSelect = this.dsKehoachthi.find(f=>f.id === event.value);
    this.isLoading = true;
    this.notificationService.isProcessing(true);

    this.hskOrdersShipService.getDataByKehoachId(event.value, '1').subscribe({
      next: (data) => {
        this.dsThisinhInHoidong = data.map(m=>{
          m['_cccd_so'] = m['thisinh'] && m['thisinh']['cccd_so'] ? String(m['thisinh']['cccd_so']) :'';
          return m;
        });
        // console.log( this.dsThisinhInHoidong.map(m=>m['_cccd_so']))
        this.isLoading = false;
        this.notificationService.isProcessing(false);

      }, error: (e) => {
        this.isLoading = false;
        this.notificationService.isProcessing(false);
        this.notificationService.toastWarning('Load dữ liệu thí sinh trong hội đông không thành công ');

      }
    })
  }

  covertDataExport(datafile:any) {
    const data: HskVandon[] = [];

    datafile.forEach(row => {
      const cell: HskVandon = {
        ma_vandonma: row[1],
        ngaytao: row[3],
        nguoigui_hoten: row[4],
        nguoigui_diachi: row[5],
        nguoigui_phone: row[6],
        nguoinhan_hoten: row[10],
        nguoinhan_diachi: row[11],
        nguoinhan_phone: row[12],
        trangthai: row[32],
        ngaychuyen_trangthai: row[41],
        ghichu: row[45],

      }

      data.push(cell)
    })
    return data;


  }

  btnKiemtraDulieu(){
    this.notificationService.isProcessing(true);
    this.isLoading = true;

    if(this.datafile.length>0 && this.dsThisinhInHoidong.length>0){
      const dataReturn = this.kiemTraKetQua(this.datafile,this.dsThisinhInHoidong);
      this.ketquaChange = 'have';
      this.dsKetqua_have = dataReturn[0];
      this.dsKetqua_nothave = dataReturn[1];
      console.log(this.dsKetqua_have);
      console.log(this.dsKetqua_nothave);
      this.ketquaImportViewClone = this.dsKetqua_have;

      this.ketquaImportViewCloneTotal =this.dsKetqua_have.length
      this.ketquaImportView = this.dsKetqua_have.slice(0,50);
      this.notificationService.isProcessing(false);
      this.isLoading = false;
    }else{
      this.isLoading = false;
      this.notificationService.isProcessing(false);
      this.notificationService.toastWarning('Vui lòng kiểm tra lại file upload hoặc hội đồng thi ');
    }
  }

  btnDowloadFileMau(){

    const link = document.createElement('a');
    link.href = 'assets/thithpt/file_mau.xlsx';
    link.download = 'file_mau.xlsx';
    link.click();
  }
  kiemTraKetQua(dsDataInFile: HskVandon[], dsThisinhInHoidong: HskOrdersShip[]): [ HskVandon[],HskVandon[] ] {
    let coGiaTri: HskVandon[] = [];
    let khongGiaTri: HskVandon[] = [];

    const dsThisinhInHoiDongByid = dsThisinhInHoidong.map(m=>String(m['nguoinhan_phone']))

    dsDataInFile.forEach(file=>{
      if (dsThisinhInHoiDongByid.includes(String(file.nguoinhan_phone))){
        coGiaTri.push(file);
      }else{
        khongGiaTri.push(file);
      }
    })

    return [ coGiaTri, khongGiaTri ];
  }

  btnReset(){
    this.file_name = null;
    this.datafile = [];
    this.dsKetqua_have= [];
    this.dsKetqua_nothave= [];
    this.ketquaImportView= [];
    this.ketquaChange= "have";
  }
  btnKetquaChange(type:'have'|'nothave'){
    this.ketquaChange = type;
    if(type === 'have'){
      this.ketquaImportViewClone = this.dsKetqua_have;
      this.ketquaImportViewCloneTotal = this.dsKetqua_have.length;
      this.ketquaImportView = this.dsKetqua_have.slice(0,50);
    }else{
      this.ketquaImportViewClone = this.dsKetqua_nothave;
      this.ketquaImportViewCloneTotal = this.dsKetqua_nothave.length;
      this.ketquaImportView = this.dsKetqua_nothave.slice(0,50);

    }
  }

  // async btnSubmitData(){}
  async btnSubmitData(){

    let html =`
    <p>Tải lên danh sách bảo <strong>${this.ketquaImportViewClone.length} </strong> bản ghi có số điện thoại phù hợp với đợt đăng ký </p>
    `;
    const head = 'XÁC NHẬN TẢI LÊN DANH SÁCH';
    const button = await this.notificationService.confirmRounded(html, head, [BUTTON_NO, BUTTON_YES]);
    if (button.name === BUTTON_YES.name) {
      const step: number = 100 / this.dsKetqua_have.length;
      this.notificationService.loadingAnimationV2({process:{percent : 0}});
      this.LoopCreate(this.dsKetqua_have,this.kehoachSelect, step, 0).subscribe({
        next:()=>{
          this.notificationService.toastSuccess('Thao tác thành công');
          this.typeTab=0;
          this.btnReset();
          this.notificationService.disableLoadingAnimationV2();

          this.loadData(1);
        },error:()=>{
          this.notificationService.disableLoadingAnimationV2();

          this.notificationService.isProcessing(false);
          this.notificationService.toastError('Thao tác không thành công');
        }
      })

    }
  }


  private LoopCreate(list:HskVandon[],kehoach:KeHoachThi,step:number,percent: number) : Observable<any> {
    const index: number = list.findIndex(i => !i['created']);
    if(index !== -1){
      const newPercent: number = percent + step;
      const item  = {...list[index], kehoach_id : kehoach.id};
      return this.hskVandonService.create(item).pipe(switchMap(()=>{
        list[index]['created'] = true;
        const newPercent: number = percent + step;
        this.notificationService.loadingAnimationV2({process: {percent: newPercent}});
        return this.LoopCreate(list,kehoach, step, newPercent);
      }))
    }else{
      return of(list);
    }

  }

  selectHoidongBySiteKetqua(event){
    this.kehoach_id_select = event;
    this.loadData(1)
  }

  async deleteItemInKetqua(item:HskVandon){
    const confirm = await this.notificationService.confirmDelete();
    if (confirm) {
      this.hskVandonService.delete(item.id).subscribe({
        next: () => {

          this.notificationService.isProcessing(false);
          this.notificationService.toastSuccess('Thao tác thành công');
          this.listData = this.listData.filter(f=>f.id !== item.id);

        }, error: () => {
          this.notificationService.isProcessing(false);
          this.notificationService.toastError('Thao tác không thành công');
        }
      })
    }
  }

  dataSelct:HskVandon[];
  selectDataByCheckbox(event){
    if (event.checked === true){
      this.dataSelct = this.listData;
    }else {
      this.dataSelct = [];
    }
    // console.log(this.dataSelct);
  }

  async btnSendEmailVandon(){
    if(this.dataSelct.length>0){
      if(this.kehoach_id_select){
        const html = `<p>Gửi email vận đơn cho thí sinh</p>`
        const head = 'XÁC NHẬN ';
        const button = await this.notificationService.confirmRounded(html, head, [BUTTON_NO, BUTTON_YES]);
        if (button.name === BUTTON_YES.name) {
          const step: number = 100 / this.dataSelct.length;
          this.notificationService.loadingAnimationV2({process:{percent : 0}});
          this.notificationService.isProcessing( true)
          this.hskOrdersShipService.getDataByKehoachId(this.kehoach_id_select,'1').pipe(switchMap(ordersShip=>{
            const dataSendEmail = Array.from(this.dataSelct).map(m=>{
              const itemOrderShip = ordersShip.find(f=>f.nguoinhan_phone === m.nguoinhan_phone)
              const thisinh = itemOrderShip ? itemOrderShip['thisinh'] : null;
              m['_email'] =thisinh ? thisinh['email']: '';
              return m
            });
            const step: number = 100 / dataSendEmail.length;
            this.notificationService.loadingAnimationV2({process:{percent : 0}});
            return this.loopSendEmail(dataSendEmail,step, 0);
          })).subscribe({
            next:()=>{
              this.notificationService.isProcessing(false)
              this.notificationService.toastSuccess('Thao tác thành công');
            },error:()=>{
              this.notificationService.toastError('Thao tác không thành công');
            }
          })

        }


      }else{
        this.notificationService.toastWarning('Danh sách chọn đợt thi');

      }

    }else{
      this.notificationService.toastWarning('Danh sách chọn chưa có mã vận đơn');
    }
  }

  private loopSendEmail(arr: HskVandon[], step: number,persent:number):Observable<any>{
    const index = arr.findIndex(f=>!f['sendEmail']);
    if(index !== -1){
      const item = arr[index];
      let html =`
        <p>Thông báo Chuyển phát Chứng chỉ dự thi Bài thi trên máy HSK của ĐH Thái Nguyên(HSK-TNU)</p>

        <p style="font-weight:700;">THÔNG TIN VẬN ĐƠN:</p>
        <table width="100%" style="border:0;">
            <tr>
                <td style="width:250px;font-weight:600">Mã vận đơn</td>
                <td style="font-weight:600">${item.ma_vandonma}</td>
            </tr>
            <tr>
                <td style="width:250px;font-weight:600">Ngày tạo</td>
                <td style="">${item.ngaytao}</td>
            </tr>
            <tr>
                <td style="width:250px;font-weight:600">Người gửi </td>
<!--                <td style="">${item.nguoigui_hoten}</td>-->
                <td style="">Vietel post</td>
            </tr>
            <tr>
                <td style="width:250px;font-weight:600">Số đt người gửi </td>
                <td style="">${item.nguoigui_phone}</td>
            </tr>
            <tr>
                <td style="width:250px;font-weight:600">Địa chỉ người gửi </td>
                <td style="">${item.nguoigui_diachi}</td>
            </tr>
            <tr>
                <td style="width:250px;font-weight:600">Người nhận </td>
                <td style="">${item.nguoinhan_hoten}</td>
            </tr>
            <tr>
                <td style="width:250px;font-weight:600">Số đt người nhận </td>
                <td style="">${item.nguoinhan_phone}</td>
            </tr>
            <tr>
                <td style="width:250px;font-weight:600">Địa chỉ người nhận </td>
                <td style="">${item.nguoinhan_diachi}</td>
            </tr>
            <tr>
                <td style="width:250px;font-weight:600">Trạng thái </td>
                <td style="">${item.trangthai}</td>
            </tr>
            <tr>
                <td style="width:250px;font-weight:600">Ghi chú </td>
                <td style="">${item.ghichu}</td>
            </tr>
        </table>
      `;

      const object :any = {
        to:item['_email'],
        message:html,
        title: ' Email Thông báo vận đơn chuyển phát Chứng chỉ HSK',
      }

      return this.senderEmailService.sendEmail(object).pipe(switchMap(m=>{
        arr[index]['sendEmail'] = true;
        const newPercent = step + persent;
        this.notificationService.loadingAnimationV2({process: {percent: newPercent}});
        return this.loopSendEmail(arr, step, newPercent);
      }))
    }else{
      return of(arr);
    }
  }
  async btnDeleteBykehoach(){
    if(this.kehoach_id_select){
      const title = 'Xác nhật xóa vận đơn của đợt thi ' + this.dsKehoachthi.find(f=>f.id === this.kehoach_id_select).dotthi + ' ?';
      const btn = await this.notificationService.confirmDelete(title, 'THÔNG BÁO');
      if(btn){
        this.notificationService.isProcessing(true);
        this.hskVandonService.deleteByKey(this.kehoach_id_select,'kehoach_id').subscribe({
          next:()=>{
            this.notificationService.toastSuccess('Thao tác thành công');
            this.loadData(1);
            this.notificationService.isProcessing(false);

          },error:()=>{
            this.notificationService.isProcessing(false);
            this.notificationService.toastError('Thao tác không thành công');
          }
        })
      }
    }else{
      this.notificationService.toastWarning('Vui lòng chọn đơt thi');
    }
  }

}
