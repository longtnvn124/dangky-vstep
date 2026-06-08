import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Paginator, PaginatorModule} from "primeng/paginator";
import {KeHoachThi, KehoachthiVstepService} from "@shared/services/kehoachthi-vstep.service";
import {OrdersVstep, VstepOrdersService} from "@shared/services/vstep-orders.service";
import {DonVi} from "@shared/models/danh-muc";
import {filter, forkJoin, of, Subject, Subscription, switchMap} from "rxjs";
import {NotificationService} from "@core/services/notification.service";
import {DmDiemDuThiService} from "@shared/services/dm-diem-du-thi.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ExpThisinhDuthiService} from "@shared/services/export/exp-thisinh-duthi.service";
import {DonViService} from "@shared/services/don-vi.service";
import {AuthService} from "@core/services/auth.service";
import {ConditionOption} from "@shared/models/condition-option";
import {OvicQueryCondition} from "@core/models/dto";
import {map} from "rxjs/operators";
import {ButtonModule} from "primeng/button";
import {CheckboxModule} from "primeng/checkbox";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {MatMenuModule} from "@angular/material/menu";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {RippleModule} from "primeng/ripple";
import {SharedModule} from "@shared/shared.module";
import {TableModule} from "primeng/table";
import {
  ThiSinhDangKyThiComponent
} from "@modules/admin/features/danh-sach-du-thi/thi-sinh-du-thi/thi-sinh-dang-ky-thi/thi-sinh-dang-ky-thi.component";
import {
  ThongTinThiSinhComponent
} from "@modules/admin/features/danh-sach-du-thi/thi-sinh-du-thi/thong-tin-thi-sinh/thong-tin-thi-sinh.component";
import {TooltipModule} from "primeng/tooltip";
import {NgPaginateEvent} from "@shared/models/ovic-models";

@Component({
  selector: 'app-duyet-thongtin-dangky-duthi',
  standalone: true,
  imports: [CommonModule, ButtonModule, CheckboxModule, DropdownModule, InputTextModule, MatMenuModule, MatProgressBarModule, PaginatorModule, RippleModule, SharedModule, SharedModule, TableModule, ThiSinhDangKyThiComponent, ThongTinThiSinhComponent, TooltipModule, SharedModule, SharedModule, SharedModule, SharedModule, SharedModule],
  templateUrl: './duyet-thongtin-dangky-duthi.component.html',
  styleUrls: ['./duyet-thongtin-dangky-duthi.component.css']
})
export class DuyetThongtinDangkyDuthiComponent implements OnInit {
  @ViewChild('fromUser', {static: true}) fromUser: TemplateRef<any>;
  @ViewChild('formregister', {static: true}) formregister: TemplateRef<any>;
  @ViewChild('templateWaiting') templateWaiting: ElementRef;
  @ViewChild(Paginator) paginator: Paginator;

  isLoading     : boolean = true;
  loadInitFail  : boolean = false;

  dsKehoachthi  : KeHoachThi[];

  recordsTotal  : number = 0 ;
  listData      : OrdersVstep[] = [];
  dataSelct     : OrdersVstep[] = [];
  page          : number = 1;
  kehoach_id    : number = 0;

  dataDonvi     : DonVi[] = []


  rows          : number = 20;
  menuName      : string = 'thisinhduthi';
  sizeFullWidth : number;
  subscription  : Subscription = new Subscription();
  search        : string = '';
  needUpdate    : boolean = false;
  private inputChanged: Subject<string> = new Subject<string>();

  statusTT = [
    {value: 0, title: 'Chưa thanh toán'},
    {value: 1, title: 'Đã thanh toán'},

  ]

  headerExport: string[] =  [
    "STT",
    "MADK",
    "Trạng thái",
    "Họ và tên",
    "Ngày sinh",
    "Giới tính",
    "CCCD/CMND",
    "Email",
    "Điện thoại",
    "Điểm dự thi",
    "Ghi chú",
    "Thời gian thanh toán"
  ];

  isAdmin:boolean = false;
  isTramThi:boolean =false;

  constructor(

    private ordersService:VstepOrdersService,
    private notifi: NotificationService,

    private dmDiemDuThiService:DmDiemDuThiService,
    private kehoachthiVstepService : KehoachthiVstepService,

    private modalService: NgbModal,
    private expThisinhDuthiService: ExpThisinhDuthiService,
    private donViService:DonViService,
    private auth: AuthService
  ) {

    const observeProcessCloseForm = this.notifi.onSideNavigationMenuClosed().pipe(filter(menuName => menuName === this.menuName && this.needUpdate)).subscribe(() => this.loadInit());
    this.subscription.add(observeProcessCloseForm);
    const observerOnResize = this.notifi.observeScreenSize.subscribe(size => this.sizeFullWidth = size.width)
    this.subscription.add(observerOnResize);

    this.isAdmin = this.auth.userHasRole('admin')
    this.isTramThi = this.auth.userHasRole('diem-du-thi')

  }
  ngOnInit(): void {

    this.loadInit();
  }
  loadInit() {
    const conditionKehoach: ConditionOption = {
      condition: [], page: '1',
      set: [
        {label: 'limit', value: '-1'},
      ]
    }

    forkJoin([
      this.kehoachthiVstepService.getDataByPageNew(conditionKehoach),
      this.donViService.getChildren(this.auth.user.donvi_id)
    ]).subscribe({
      next: ([kehoach, donvi]) => {
        this.dsKehoachthi = kehoach.data;
        this.dataDonvi = donvi;
        if (this.dsKehoachthi) {
          this.loadData(1);
        }
      }, error: () => {
        this.notifi.isProcessing(false);
        this.notifi.toastError('Load dữ liệu không thành công');
      }
    })
  }

  loadData(page: number, kehoach_id?: number, search?: string,) {
    this.isLoading = true;
    this.notifi.isProcessing(true);

    const condition :ConditionOption = {
      condition:[
        {
          conditionName:'trangthai_duyet',
          condition:OvicQueryCondition.notEqual,
          value:'1'
        }
      ],
      page: page.toString(),
      set:[
        { label: 'search' ,value: search ? search : ''},
        { label: 'limit' , value : this.rows.toString()},
        { label: 'orderby', value: 'id'},
        { label: 'order', value: 'DESC'},
        { label: 'with', value: 'thisinh,user'},
      ]
    }
    if(this.kehoach_id){
      condition.condition.push({
        conditionName:'kehoach_id',
        condition:OvicQueryCondition.equal,
        value: this.kehoach_id.toString()
      })
    }

    this.ordersService.getDataByPageNew(condition).pipe(switchMap(m=>{
      const parent_ids = Array.from(new Set(m.data.map(a=>a.parent_id).filter(f=>f !== 0)));

      const conditionOrderParent :ConditionOption = {
        condition : [
          { conditionName: 'id',condition: OvicQueryCondition.equal, value:parent_ids.toString(),orWhere:'in' }
        ],
        page:'1',
        set:[
          {
            label:'limit',value:parent_ids.length.toString(),
          },
          {
            label:'with',value:'user',
          },
        ]
      }
      return forkJoin([
        of(m),
        this.ordersService.getDataByPageNew(conditionOrderParent).pipe(map(m=>m.data))
      ])

    })).subscribe({
      next:([{data,recordsFiltered},orderParent])=>{
        this.recordsTotal = recordsFiltered;

        this.listData = data.length > 0 ? data.map((m,index)=>{
          const user = m['user'];
          const thisinh = m['thisinh'];
          const parent = m.parent_id !== 0 ? orderParent.find(f=>f.id === m.parent_id) :null;
          m['_indexTable'] = this.rows *(page-1) + index + 1;
          m['__order_id_coverted'] =m.id;
          m['__thisinh_hoten'] = thisinh && thisinh['hoten'] ? thisinh['hoten'] : (user ? user.name:'');
          m['__thisinh_cccd'] = thisinh && thisinh['cccd_so'] ? thisinh['cccd_so'] : (user ? user.username:'');
          m['__thisinh_phone'] = thisinh && thisinh['phone'] ? thisinh['phone'] : (user ? user.phone:'');
          m['__thisinh_email'] = thisinh && thisinh['email'] ? thisinh['email'] : (user ? user.email:'');
          m['giadich'] = m.trangthai_thanhtoan === 1 ? m['transaction_id'] :'';

          const dotthi: KeHoachThi  = this.dsKehoachthi.find(f => f.id === m.kehoach_id);

          m['__dotthi_coverted'] = dotthi ? dotthi.title : '';
          m['__capthi'] = dotthi && dotthi.levels && m.capthi ? (dotthi.levels.find(f=>f.value == m.capthi) ? dotthi.levels.find(f=>f.value == m.capthi).label : '' ) : '';
          // m['__monthi_covered'] = this.dsCapdo.find(f=>f.id === m.caphsk_id) ? m.mon_id.map(b => this.dsMon.find(f => f.id == b) ? this.dsMon.find(f => f.id == b) : []) : [];

          m['__status_converted'] = m.trangthai_thanhtoan ;

          m['__time_thanhtoan'] =m['thoigian_thanhtoan'] ? this.formatSQLDateTime( new Date(m['thoigian_thanhtoan'])):'';
          m['__diemthi_convenrtd'] = this.dataDonvi.length>0 && this.dataDonvi.find(f=>f.id === m.diemduthi_id) ? this.dataDonvi.find(f=>f.id === m.diemduthi_id).title : '';
          m['__ghichu'] = parent && parent['user'] && parent['user']['name'] ? (parent['user']['name'] + ' đăng ký' ):'';
          return m;
        }) : [];

        this.notifi.isProcessing(false);
        this.isLoading = false;
      },error:()=>{
        this.notifi.isProcessing(false);
        this.isLoading = false;
        this.notifi.toastError('Load dữ liệu không thành công');
      }
    })

  }

  formatSQLDateTime(date: Date): string {
    const y = date.getFullYear().toString();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    const h = date.getHours().toString().padStart(2, '0');
    const min = date.getMinutes().toString().padStart(2, '0');

    //'YYYY-MM-DD hh:mm:ss' type of sql DATETIME format
    return `${d}-${m}-${y} ${h}:${min}`;
  }
  paginate({page}: NgPaginateEvent) {
    this.page = page + 1;
    this.dataSelct = [];
    this.loadData(this.page,this.kehoach_id, this.search);
  }
  selectDataByCheckbox(event){
    if (event.checked === true){
      this.dataSelct = this.listData.filter(f=>f.trangthai_thanhtoan !== 1);
    }else {
      this.dataSelct = [];
    }
  }

  loadDropdow(event){
    this.kehoach_id = event ? event.id: null;
    this.page = 1;
    this.loadData(this.page, this.kehoach_id, this.search);
  }


  viewFormDuyet(){

  }
}
