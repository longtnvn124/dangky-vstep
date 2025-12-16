import { Component, OnInit } from '@angular/core';
import {HskHuyOrder, HskHuyOrderService} from "@shared/services/hsk-huy-order.service";
import {debounceTime, forkJoin, Subject} from "rxjs";
import {DmCapdo} from "@shared/models/danh-muc";
import {HskKehoachThiService, KeHoachThi} from "@shared/services/hsk-kehoach-thi.service";
import {HskOrdersService, OrdersHsk, params} from "@shared/services/hsk-orders.service";
import {DanhMucCapDoService} from "@shared/services/danh-muc-cap-do.service";
import {NotificationService} from "@core/services/notification.service";
import {ThemeSettingsService} from "@core/services/theme-settings.service";
import {ExportExcelHskService} from "@shared/services/export-excel-hsk.service";
import {NgPaginateEvent} from "@shared/models/ovic-models";

@Component({
  selector: 'app-hoan-dang-ky',
  templateUrl: './hoan-dang-ky.component.html',
  styleUrls: ['./hoan-dang-ky.component.css']
})
export class HoanDangKyComponent implements OnInit {

  page: number = 1;
  rows: number = 1;
  recordsTotal: number = 1;
  listData: OrdersHsk[];
  search: string = '';
  kehoach_id_select: number = null;
  caphsk_id_select: number = null;
  private inputChanged: Subject<string> = new Subject<string>();
  isLoading: boolean = false;

  listCapdo: DmCapdo[];
  listKehoachthi: KeHoachThi[]

  constructor(
    private hskOrdersService: HskOrdersService,
    private hskKehoachthiService: HskKehoachThiService,
    private hksCapdoService: DanhMucCapDoService,
    private hskHuyOrderService: HskHuyOrderService,
    private notifi: NotificationService,
    private themeSettingsService: ThemeSettingsService,
    private exportExcelHskService: ExportExcelHskService
  ) {
    this.rows = this.themeSettingsService.settings.rows;
  }

  ngOnInit(): void {
    this.inputChanged.pipe(debounceTime(1000)).subscribe((item: string) => {
      this.searchContentByInput(item);
    });

    this.loadInit()

  }

  loadInit() {
    forkJoin([
      this.hksCapdoService.getDataUnlimit(),
      this.hskKehoachthiService.getDataUnlimitNotstatus()
    ]).subscribe({
      next: ([capdohsk, kehoachthi]) => {
        this.listCapdo = capdohsk;
        this.listKehoachthi = kehoachthi;
        if (capdohsk.length > 0 && kehoachthi.length > 0) {
          this.loadData(1);
        }

      }, error: () => {
        this.notifi.toastError('Load dữ liệu không thành công');
      }
    })
  }

  loadData(page: number) {
    this.page = page;
    this.isLoading = true;
    this.hskOrdersService.getdataChangeDptthi(page, null, this.caphsk_id_select,this.kehoach_id_select).subscribe(
      {
        next: ({data, recordsTotal}) => {
          this.recordsTotal = recordsTotal;
          this.listData = data.length > 0 ? data.map((m, index) => {
            const thisinh = m['thisinh'];
            const parent = m['parent'];
            m['_indexTable'] = (page - 1) * 10 + (index + 1);
            m['_hoten'] = thisinh && thisinh['hoten'] ? thisinh['hoten'] : '';
            m['_dotthi'] = this.listKehoachthi.find(f => f.id === m.kehoach_id) ? this.listKehoachthi.find(f => f.id === m.kehoach_id).dotthi : '';
            m['_capdohsk'] = this.listCapdo.find(f => f.id === m.caphsk_id) ? this.listCapdo.find(f => f.id === m.caphsk_id).title : '';
            m['_email'] = thisinh && thisinh['email'] ? thisinh['email'] : '';
            m['_phone'] = thisinh && thisinh['phone'] ? thisinh['phone'] : '';
            m['_cccd_so'] = thisinh && thisinh['cccd_so'] ? thisinh['cccd_so'] : '';
            m['_ngaysinh'] = thisinh && thisinh['ngaysinh'] ? thisinh['ngaysinh'] : '';

            m['_status'] = 'hủy thi';
            m['_ghichu'] = parent && parent['user']['name'] ? parent['user']['name'] : 'Thí sinh tự đăng ký'
            return m;
          }) : [];

          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.notifi.isProcessing(false);
        }
      }
    )
  }


  paginate({page}: NgPaginateEvent) {
    this.page = page + 1;
    this.loadData(this.page);
  }

  onInputChange(event: string) {
    this.inputChanged.next(event);
  }

  searchContentByInput(value) {
    this.search = value.trim();
    this.loadData(this.page);
  }

  changeCapdo(event) {
    this.caphsk_id_select = event.value;
    this.loadData(1);
  }

  changedotthi(event) {

    this.kehoach_id_select = event.value;
    this.loadData(1);
  }



  view:boolean = false;
  orderSelect :OrdersHsk;
  orderSelectParam : params[]

  viewDetail(item:OrdersHsk){
    this.orderSelectParam = [];
    this.view = true;
    this.orderSelect = item;
    this.orderSelectParam = item.params.map((m,index)=>{
      m['_index'] = index+1;
      m['_cu'] = this.listKehoachthi.find(f=>f.id === m.kehoanh_thi_cu)? this.listKehoachthi.find(f=>f.id === m.kehoanh_thi_cu).dotthi : '';
      m['_moi'] = this.listKehoachthi.find(f=>f.id === m.kehoanh_thi_moi)? this.listKehoachthi.find(f=>f.id === m.kehoanh_thi_moi).dotthi : '';
      m['_time'] = this.chageString(m.thoigian_sua);
      return m;
    })
  }

  chageString(text:string){
    const date = text ? new Date(text) : null;
    let result = '';
    let datetime = '';
    if (date) {
      result += [date.getDate().toString().padStart(2, '0'), (date.getMonth() + 1).toString().padStart(2, '0'), date.getFullYear().toString()].join('/');
      datetime += [date.getHours().toString().padStart(2, '0'), (date.getMinutes() + 1).toString().padStart(2, '0'), date.getSeconds().toString()].join(':');
      // result += ' ' + [date.getHours().toString().padStart(2, '0'), date.getMinutes().toString().padStart(2, '0')].join(':');
    }
    return result + ' ' + datetime;
  }

}
