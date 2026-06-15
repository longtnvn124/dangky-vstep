import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Paginator, PaginatorModule } from "primeng/paginator";
import { Hoidongthi } from "@shared/services/vstep-hoidong-thi.service";
import { NotificationService } from "@core/services/notification.service";
import { HoidongKetqua, HoidongKetquaService } from "@shared/services/vstep/hoidong-ketqua.service";
import { ConditionOption } from "@shared/models/condition-option";
import { OvicQueryCondition } from "@core/models/dto";
import {Observable, of, switchMap} from "rxjs";
import { NgIf, NgSwitch, NgSwitchCase } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { RippleModule } from "primeng/ripple";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { InputTextModule } from "primeng/inputtext";
import { MatMenuModule } from "@angular/material/menu";
type AOA = any[][];
import * as XLSX from "xlsx";
import { TableModule } from "primeng/table";
import { NgPaginateEvent } from "@shared/models/ovic-models";
import { BUTTON_NO, BUTTON_YES } from "@core/models/buttons";
@Component({
  selector: 'app-ket-qua-thi',
  templateUrl: './ket-qua-thi.component.html',
  styleUrls: ['./ket-qua-thi.component.css'],
  imports: [
    NgSwitch,
    NgSwitchCase,
    ButtonModule,
    RippleModule,
    MatProgressBarModule,
    InputTextModule,
    MatMenuModule,
    TableModule,
    PaginatorModule,
    NgIf
  ],
  standalone: true
})
export class KetQuaThiComponent implements OnInit {
  @ViewChild(Paginator) paginator: Paginator;

  @Input() set hoidong(item: Hoidongthi) {
    this.hoidong_select;

    this.hoidong_select = { ...item };
    this.ngType = 0;
    this.page = 1;
    this.loadInit();
  }
  rows: number = 20;
  ngType: 0 | 1 | -1 | 2 = 0;
  page: number = 1;
  recordTotal: number = 1;
  hoidong_select: Hoidongthi;
  search: string = '';
  listData: HoidongKetqua[];
  dataUpload: any[] = [];
  datauploadView: any[];

  constructor(
    private notifi: NotificationService,
    private hoidongKetquaService: HoidongKetquaService
  ) {
  }

  ngOnInit(): void {

  }

  loadInit() {
    this.dataUpload = [];
    this.datauploadView = [];
    const conditon: ConditionOption = {
      condition: [
        {
          conditionName: 'hoidong_id',
          condition: OvicQueryCondition.equal,
          value: this.hoidong_select.id.toString()
        },
      ],
      page: this.page.toString(),
      set: [
        { label: 'limit', value: '50' },
        {
          label: 'orderBy', value: 'id'
        },
        { label: 'order', value: 'ESC' }
      ]
    }

    if (this.search) {
      conditon.condition.push(
        {
          conditionName: 'hoten',
          condition: OvicQueryCondition.like,
          value: `%${this.search}%`
        }
      )
    }
    this.hoidongKetquaService.getDataByPageNew(conditon).subscribe({
      next: ({ data, recordsFiltered }) => {
        this.listData = data.length >0  ? data.map((m,index)=>{
          m['__index'] = 50 *(this.page - 1) + index + 1;
          return m;
        }) : [];
        this.recordTotal = recordsFiltered;
        this.ngType = this.listData.length > 0 ? 1 : 2;
      }, error: () => {
        this.ngType = -1;
        this.notifi.toastError('Tải dữ liệu không thành công ');
      }
    })
  }

  eventSearch(event: string) {
    this.search = event;

  }


  viewAddUpload() {
    this.ngType = 2;
  }

  btnReturn() {
    this.ngType = 0;
    this.page = 1;

    this.loadInit();
  }


  paginate({ page }: NgPaginateEvent) {
    this.page = page + 1;
    this.loadInit();
  }
  async btnDeletedUpload() {
    const html = `
        <p>Thao tác này sẽ xóa tất cả kết quả dữ liệu đã tải lên ?</p>
    `;
    const head = 'XÁC NHẬN';
    const btn = await this.notifi.confirmRounded(html, head, [BUTTON_NO, BUTTON_YES]);
    if (btn.name === 'yes') {
      this.notifi.isProcessing(true);
      this.hoidongKetquaService.deleteByHoidong(this.hoidong_select.id, 'hoidong_id').subscribe({
        next: () => {
          this.notifi.toastSuccess('Thao tác thành công');
          this.notifi.isProcessing(false);
          this.loadInit();
        },
        error: () => {
          this.notifi.toastError('Thao tác không thành công');
          this.notifi.isProcessing(false);

        }
      })
    }
  }

  // --------------------- Input Add dữ liệu---------------------

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

  file_name: string = '';
  errorFileType: boolean = false;
  loading: boolean = false;
  onDroppedFiles(fileList: FileList) {
    const file: File = fileList.item(0);
    this.file_name = file.name;
    this.errorFileType = !(file && this.validateExcelFile(file));
    if (!this.errorFileType) {
      this.loading = true;

      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const wb: XLSX.WorkBook = XLSX.read(e.target.result, { type: 'binary' });

        /* grab first sheet */

        let arrData = [];


        for (let i = 0; i < 6; i++) {
          const sheetNameSelect = wb.SheetNames[i];
          const ws: XLSX.WorkSheet = wb.Sheets[sheetNameSelect];
          const rawData: AOA = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
          const filterData = rawData.filter(u => !!(Array.isArray(u) && u.length));
          filterData.shift();
          if (filterData.length > 0) {
            // console.log(filterData);
            const arr = this.covertDataExport(filterData, i + 1);
            arrData = [].concat(...arrData, arr);
          }
        }
        this.dataUpload = arrData;
        this.datauploadView = Array.from(arrData).slice(0, 50);
        // console.log(this.datauploadView)

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
      const cell: HoidongKetqua = {
        sobaodanh: row[1],
        hoten: row[2],
        gioitinh: row[3],
        dantoc: row[4],
        quoctich: row[5],
        ngaysinh: this.replaceDotToSlash(row[6]),
        phongthi: row[7],
        listening: row[8],
        reading: row[9],
        writing: row[10],
        speaking: row[11],
        total: row[12],
        khung_nlnn: row[13],
        cccd_so: row[15],
        vbcc: row[23],
        ngaythi: this.replaceDotToSlash(row[24])
      }

      data.push(cell)
    })
    return data;
  }


  validateExcelFile(file: File): boolean {
    const ext = file.name?.split('.').pop()?.toLowerCase();
    return ['xlsx', 'xls'].includes(ext || '');
  }


  paginateViewUpload(event) {
    // console.log(event)
    const first: number = event['first'];
    const late: number = event['first'] + 50;
    const cloneArr = Array.from(this.dataUpload);
    this.datauploadView = cloneArr.slice(first, late);

  }

  replaceDotToSlash(str: string): string {
    return str.replace(/\./g, '/');
  }

  async saveFile(){
    if(this.dataUpload.length>0){

      const html=`
           <p class="text-center">Thực hiện tải lên ${this.dataUpload.length} bản ghi của thí sinh</p>
           <p class="text-center">Vui lòng chờ vài phút khi thực hiện thao tác này </p>
        `;
      const head='XÁC NHẬN TẢI LÊN KẾT QUẢ CỦA THÍ SINH';

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

  private loopUploadData(data:any[],step:number,percent:number):Observable<any> {

    const index = data.findIndex(i => !i['isCreated']);
    if (index !== -1) {
      const item  = {...data[index],hoidong_id:this.hoidong_select.id,kehoach_id:this.hoidong_select.kehoach_id};
      return this.hoidongKetquaService.create(item).pipe(switchMap(m=>{
        data[index]['isCreated']= true;
        const newPercent: number = percent + step;
        this.notifi.loadingAnimationV2({process: {percent: newPercent}});
        return this.loopUploadData(data,step,newPercent);
      }))
    } else {
      return of(data);
    }
  }




}
