import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {HskHoidongthi} from "@shared/services/hsk-hoidongthi.service";
import {NotificationService} from "@core/services/notification.service";
import {ThemeSettingsService} from "@core/services/theme-settings.service";
import {HskHoidongthiThiSinh, HskHoidongthiThisinhService} from "@shared/services/hsk-hoidongthi-thisinh.service";
import {NgPaginateEvent} from "@shared/models/ovic-models";
import {debounceTime, first, Observable, of, Subject, switchMap} from "rxjs";
import * as XLSX from "xlsx";
import {Paginator} from "primeng/paginator";
import {BUTTON_NO, BUTTON_YES} from "@core/models/buttons";
type AOA = any[][];

@Component({
  selector: 'app-add-thi-sinh',
  templateUrl: './add-thi-sinh.component.html',
  styleUrls: ['./add-thi-sinh.component.css']
})
export class AddThiSinhComponent implements OnInit {
  // @ViewChild('ViewuploadP') paginatorViewUpload: Paginator;
  @ViewChild(Paginator) paginator: Paginator;

  @Input() set hoidong(item: HskHoidongthi) {
    this.hoidong_select = {...item};
    this.ngtype = 0;
    this.loadInit();
  }

  ngtype: -1 | 0 | 1 | 2 = 2;//-1 err,1:true,0:load. 2:form
  hoidong_select: HskHoidongthi;
  rows: number = 0;
  listData: HskHoidongthiThiSinh[] = []
  dataUpload: any[] = [];
  recordTotal: number = 0;
  page: number = 1;
  search: string= '';
  private inputChanged: Subject<string> = new Subject<string>();

  constructor(
    private notifi: NotificationService,
    private themeSettingsService: ThemeSettingsService,
    private hskHoidongthiThisinhService: HskHoidongthiThisinhService,

  ) {
    this.rows = this.themeSettingsService.settings.rows;
  }

  ngOnInit(): void {
    this.inputChanged.pipe(debounceTime(1000)).subscribe((item: string) => {
      this.searchContentByInput(item);
    });
  }

  loadInit() {
    this.file_name ='';
    this.datauploadView = [];
    this.dataUpload = [];
    this.notifi.isProcessing(true);

    this.hskHoidongthiThisinhService.getDataByHoidongAndSearch(this.page, this.hoidong_select.id, this.search).subscribe({
      next: ({recordsTotal, data}) => {
        this.recordTotal = recordsTotal;
        this.listData = data.length>0 ? data.map((m,index)=>{
          m['__index'] = (this.page -1)*this.rows +( index + 1);
          return m;
          }): [];
        this.notifi.isProcessing(false);
        this.ngtype =  this.listData.length> 0 ? 1: 2;
      },
      error: () => {
        this.notifi.isProcessing(false);
        this.ngtype = -1;
        this.notifi.toastError('load dữ liệu không thành công');
      }
    })

  }

  paginate({page}: NgPaginateEvent) {
    this.page = page + 1;
    this.loadInit();
  }

  onInputChange(event: string) {
    this.inputChanged.next(event);
  }

  searchContentByInput(text: string) {
    this.page = 1;
    this.search= text ? text.trim():'';
    this.loadInit();
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
      return this.hskHoidongthiThisinhService.create(item).pipe(switchMap(m=>{
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
      this.hskHoidongthiThisinhService.deleteByHoidong(this.hoidong_select.id,'hoidong_id').subscribe({
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

}
