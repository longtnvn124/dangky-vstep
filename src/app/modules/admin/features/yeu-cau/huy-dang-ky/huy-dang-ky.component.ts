import {Component, OnInit} from '@angular/core';
import {HskOrdersService} from "@shared/services/hsk-orders.service";
import {DanhMucCapDoService} from "@shared/services/danh-muc-cap-do.service";
import {debounceTime, forkJoin, Subject} from "rxjs";
import {HskHuyOrder, HskHuyOrderService} from "@shared/services/hsk-huy-order.service";
import {HskKehoachThiService, KeHoachThi} from "@shared/services/hsk-kehoach-thi.service";
import {NotificationService} from "@core/services/notification.service";
import {ThemeSettingsService} from "@core/services/theme-settings.service";
import {NgPaginateEvent} from "@shared/models/ovic-models";
import {DmCapdo} from "@shared/models/danh-muc";
import {ExportExcelHskService} from "@shared/services/export-excel-hsk.service";

@Component({
  selector: 'app-huy-dang-ky',
  templateUrl: './huy-dang-ky.component.html',
  styleUrls: ['./huy-dang-ky.component.css']
})
export class HuyDangKyComponent implements OnInit {


  page: number = 1;
  rows: number = 1;
  recordsTotal: number = 1;
  listData: HskHuyOrder[];
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
    this.hskHuyOrderService.getDataByPageAnd(page, this.search, this.kehoach_id_select, this.caphsk_id_select).subscribe(
      {
        next: ({data, recordsTotal}) => {
          this.recordsTotal = recordsTotal;
          this.listData = data.length > 0 ? data.map((m, index) => {
            const thisinh = m['thisinh'];
            const parent = m['parent'];
            m['_indexTable'] = (page - 1) * 10 + (index + 1);
            m['_hoten'] = m.hoten;
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

  btnExportExcelHskHuyDk() {
    if (this.kehoach_id_select) {
      const dotthi = this.listKehoachthi.find(f => f.id == this.kehoach_id_select);
      this.hskHuyOrderService.getDataUnlimitByKehoachIdAndCapHsk(this.kehoach_id_select, this.caphsk_id_select).subscribe(
        {
          next: ({data, recordsTotal}) => {
            this.recordsTotal = recordsTotal;
            const dataEx = data.length > 0 ? data.map((m, index) => {
              const thisinh = m['thisinh'];
              const parent = m['parent'];
              m['_indexTable'] = (index + 1);
              m['_hoten'] = m.hoten;
              m['_dotthi'] = this.listKehoachthi.find(f => f.id === m.kehoach_id) ? this.listKehoachthi.find(f => f.id === m.kehoach_id).dotthi : '';
              m['_capdohsk'] = this.listCapdo.find(f => f.id === m.caphsk_id) ? this.listCapdo.find(f => f.id === m.caphsk_id).title : '';
              m['_email'] = thisinh && thisinh['email'] ? thisinh['email'] : '';
              m['_phone'] = thisinh && thisinh['phone'] ? thisinh['phone'] : '';
              m['_cccd_so'] = thisinh && thisinh['cccd_so'] ? thisinh['cccd_so'] : '';
              m['_ngaysinh'] = thisinh && thisinh['ngaysinh'] ? thisinh['ngaysinh'] : '';

              m['_status'] = 'hủy thi';
              m['_ghichu'] = parent && parent['user']['name'] ? parent['user']['name'] : 'Thí sinh tự đăng ký'
              return {
                index: m['_indexTable'],
                _email: m['_email'],
                _hoten: m['_hoten'],
                _ngaysinh: m['_ngaysinh'],
                _cccd_so: `'` + m['_cccd_so'],
                _phone: `'` + m['_phone'],
                _capdohsk: m['_capdohsk'],
                _status: m['_status'],
                _ghichu: m['_ghichu'],
              };
            }) : [];

            const header = ['STT', 'ĐỊA CHỈ EMAIL', 'HỌ VÀ TÊN', 'NGÀY SINH', 'SỐ GIẤY TỜ TÙY THÂN', 'SỐ ĐIỆN THOẠI LIÊN HỆ', 'CẤP ĐỘ THI', 'TRẠNG THÁI', 'ĐƠN VỊ',
            ]
            if(dataEx.length>0){
              this.exportExcelHskService.exportExHuyOrder(dataEx, 'ĐĂNG KÝ HỦY - HỦY HOÃN THI HSK(K) ĐỢT THI NGÀY ' + dotthi.dotthi, dotthi.dotthi,header);
            }else{
              this.notifi.toastWarning('Danh sách chọn không có kết quả!');
            }
            this.isLoading = false;
          },
          error: (err) => {
            this.isLoading = false;
            this.notifi.isProcessing(false);
          }
        }
      )
    } else {
      this.notifi.toastError('Vui lòng chọn đợt thi');
    }
  }


}
