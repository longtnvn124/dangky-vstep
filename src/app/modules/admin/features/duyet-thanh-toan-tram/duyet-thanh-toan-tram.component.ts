import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DropdownModule} from "primeng/dropdown";
import {InputTextareaModule} from "primeng/inputtextarea";
import {RippleModule} from "primeng/ripple";
import {ButtonModule} from "primeng/button";
import {MatMenuModule} from "@angular/material/menu";
import {TableModule} from "primeng/table";
import {CheckboxModule} from "primeng/checkbox";
import {NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {TooltipModule} from "primeng/tooltip";
import {SharedModule} from "@shared/shared.module";
import {Paginator, PaginatorModule} from "primeng/paginator";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {DmCapdo, DonVi} from "@shared/models/danh-muc";
import {KeHoachThi, KehoachthiVstepService} from "@shared/services/kehoachthi-vstep.service";
import {OrdersHsk, OrdersVstep, VstepOrdersService} from "@shared/services/vstep-orders.service";
import {NgPaginateEvent, OvicTableStructure} from "@shared/models/ovic-models";
import {debounceTime, forkJoin, Subject, Subscription} from "rxjs";
import {ThemeSettingsService} from "@core/services/theme-settings.service";
import {NotificationService} from "@core/services/notification.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ExportThiSinhDuThiService} from "@shared/services/export-thi-sinh-du-thi.service";
import {filter} from "rxjs/operators";
import {DonViService} from "@shared/services/don-vi.service";
import {AuthService} from "@core/services/auth.service";
import {ConditionOption} from "@shared/models/condition-option";
import {OvicQueryCondition} from "@core/models/dto";
import {BUTTON_NO, BUTTON_YES} from "@core/models/buttons";
import {WAITING_POPUP} from "@shared/utils/syscat";

@Component({
  selector: 'app-duyet-thanh-toan-tram',
  templateUrl: './duyet-thanh-toan-tram.component.html',
  styleUrls: ['./duyet-thanh-toan-tram.component.css'],
  standalone: true,
  imports: [
    DropdownModule,
    InputTextareaModule,
    RippleModule,
    ButtonModule,
    MatMenuModule,
    TableModule,
    CheckboxModule,
    NgSwitch,
    TooltipModule,
    SharedModule,
    PaginatorModule,
    MatProgressBarModule,
    NgIf,
    NgSwitchCase
  ]
})
export class DuyetThanhToanTramComponent implements OnInit {
  @ViewChild('fromUser', {static: true}) fromUser: TemplateRef<any>;
  @ViewChild('formregister', {static: true}) formregister: TemplateRef<any>;
  @ViewChild('templateWaiting') templateWaiting: ElementRef;
  @ViewChild(Paginator) paginator: Paginator;

  isLoading     : boolean = true;
  loadInitFail  : boolean = false;

  dsDiemduthi   : DonVi[] = [];

  dsKehoachthi  : KeHoachThi[];

  recordsTotal  : number = 0;
  listData      : OrdersVstep[];
  dataSelct     : OrdersVstep[] = [];
  page          : number = 1;
  kehoach_id    : number = 0;
  rows          : number = 20;
  menuName      : string = 'thisinhduthi';
  sizeFullWidth : number;
  subscription  : Subscription = new Subscription();
  index         : number = 1;
  search        : string= '';
  needUpdate = false;
  private inputChanged: Subject<string> = new Subject<string>();

  statusTT = [
    {value: 0, title: 'Chưa thanh toán'},
    {value: 1, title: 'Đã thanh toán'},

  ]

  constructor(
    private themeSettingsService: ThemeSettingsService,
    private ordersService: VstepOrdersService,
    private notifi: NotificationService,
    private donViService: DonViService,
    private kehoachthiVstepService: KehoachthiVstepService,
    private modalService: NgbModal,
    // private exportThiSinhDuThiService: ExportThiSinhDuThiService,
    private auth: AuthService
  ) {

    const observeProcessCloseForm = this.notifi.onSideNavigationMenuClosed().pipe(filter(menuName => menuName === this.menuName && this.needUpdate)).subscribe(() => this.loadData(this.page));
    this.subscription.add(observeProcessCloseForm);
    const observerOnResize = this.notifi.observeScreenSize.subscribe(size => this.sizeFullWidth = size.width)
    this.subscription.add(observerOnResize);
  }

  ngOnInit(): void {
    this.inputChanged.pipe(debounceTime(1000)).subscribe((item: string) => {
      this.searchContentByInput(item);
    });
    this.loadInit();
  }

  loadInit() {

    const conditionKehoach : ConditionOption = {
      condition:[
        // {
        //   conditionName:'status',
        //   condition:OvicQueryCondition.equal,
        //   value:'1'
        // }
      ],
      page:'1',
      set:[
        {label:'limit',value:'-1'},
        {label:'order',value:'DESC'},
      ]
    }


    forkJoin(
       [this.donViService.getChildren(this.auth.user.donvi_id),
      this.kehoachthiVstepService.getDataByPageNew(conditionKehoach)]
    ).subscribe({
      next: ([capdo, kehoachthi]) => {
        this.dsDiemduthi = capdo;
        this.dsKehoachthi = kehoachthi.data;
        if (this.dsDiemduthi && this.dsKehoachthi) {
          this.loadData(1);
        }
      }, error: () => {
        this.notifi.isProcessing(false);
        this.notifi.toastError('Load dữ liệu không thành công');
      }
    })
  }

  loadData(page: number, kehoach_id?: number, search?: string,) {
    this.selectDataByCheckbox({checker: false});
    this.isLoading = true;
    const limit = this.themeSettingsService.settings.rows;
    this.index = (page * limit) - limit + 1;
    this.notifi.isProcessing(true);

    const condtion:ConditionOption = {
      condition:[
        {
          conditionName: 'parent_id',
          condition: OvicQueryCondition.equal,
          value: '0',
          orWhere: 'and'
        },
        {
          conditionName: 'thisinh_id',
          condition: OvicQueryCondition.equal,
          value: '0',
          orWhere: 'and'
        },
        {
          conditionName: 'diemduthi_id',
          condition: OvicQueryCondition.equal,
          value: '0',
          orWhere: 'and'
        }
      ],
      page: page.toString(),
      set:[
        {label:'search', value: search? search : ''},
        {label:'order',value:'DESC'},
        {label:'order_by',value:'id'},

      ]
    }

    // -=0-----

    if (kehoach_id) {
      condtion.condition.push({
        conditionName: 'kehoach_id',
        condition: OvicQueryCondition.equal,
        value: kehoach_id.toString(),
        orWhere: 'and'
      })
    }
    if (this.statusSelect === 1) {
      condtion.condition.push({
        conditionName: 'trangthai_thanhtoan',
        condition: OvicQueryCondition.equal,
        value: '1',
        orWhere: 'and'
      })
    }
    if (this.statusSelect === 0) {
      condtion.condition.push({
        conditionName: 'trangthai_thanhtoan',
        condition: OvicQueryCondition.notEqual,
        value: '1',
        orWhere: 'and'
      })
    }



    this.ordersService.getDataByPageNew(condtion).subscribe(
      {
        next: ({data, recordsFiltered}) => {
          this.recordsTotal = recordsFiltered;
          this.isLoading = false;
          this.listData = data.length === 0 ? [] : data.map((m, index) => {
            m['_indexTable'] = this.rows * (page - 1) + index + 1;

            const user = m['user'];
            m['__doitacName'] = user ? user['name'] : '';
            m['__doitacEmail'] = user ? user['email'] : '';
            m['__giadich'] = m.trangthai_thanhtoan === 1 ? m['transaction_id'] : '';
            m['__dotthi_coverted'] = this.dsKehoachthi.find(f => f.id === m.kehoach_id) ? this.dsKehoachthi.find(f => f.id === m.kehoach_id).title : '';
            m['__time_thanhtoan'] = m['thoigian_thanhtoan'] ? this.formatSQLDateTime(new Date(m['thoigian_thanhtoan'])) : '';

            m['__status_converted'] = m.trangthai_thanhtoan === 1 ? 1:0;
            m['__order_id_coverted'] =m.id;
            return m;
          });
          this.notifi.isProcessing(false);
          this.isLoading = false;


        }, error: (e) => {
          this.isLoading = false;
          this.notifi.toastError('load dữ liệu không thành công');
          this.notifi.isProcessing(false);
        }
      }
    )
    // this.ordersService.getDataByWithChildredAndSearchAndPage(page, this.kehoach_id, this.search ,this.statusSelect).pipe(switchMap(
    //   (m)=>{
    //
    //     const parent_ids= m.data.map(a=>a.parent_id).filter(f=>f !== 0);
    //     const setParent_ids = Array.from(new Set(parent_ids));
    //     return forkJoin([of(m.recordsTotal),of(m.data),setParent_ids.length>0? this.ordersService.getDataByparentIds(setParent_ids,'id,trangthai_thanhtoan,user_id'): of([])]);
    //   })).subscribe({
    //   next: ([recordsTotal, data,dataparent]) => {
    //
    //     const ids_parant = dataparent.map(m=>m.id);
    //     this.recordsTotal = recordsTotal;
    //     this.listData = data.filter(f=>!ids_parant.includes(f.id)).map((m, index) => {
    //
    //       const user = m['user'];
    //       const thisinh = m['thisinh'];
    //       const parent = m.parent_id ? dataparent.find(f=>f.id === m.parent_id) :null;
    //       m['_indexTable'] = this.rows *(page-1) + index + 1;
    //       m['__order_id_coverted'] =m.id;
    //       m['__thisinh_hoten'] = thisinh ? thisinh['hoten'] : (user ? user.name:'');
    //       m['__thisinh_cccd'] = thisinh ? thisinh['cccd_so'] : (user ? user.username:'');
    //       m['__thisinh_phone'] = thisinh ? thisinh['phone'] : (user ? user.phone:'');
    //       m['__thisinh_email'] = thisinh ? thisinh['email'] : (user ? user.email:'');
    //       m['giadich'] = m.trangthai_thanhtoan === 1 ? m['transaction_id'] :'';
    //       m['__dotthi_coverted'] = this.dsKehoachthi.find(f => f.id === m.kehoach_id) ? this.dsKehoachthi.find(f => f.id === m.kehoach_id).dotthi : '';
    //       // m['__monthi_covered'] = this.dsCapdo.find(f=>f.id === m.caphsk_id) ? m.mon_id.map(b => this.dsMon.find(f => f.id == b) ? this.dsMon.find(f => f.id == b) : []) : [];
    //       const statusByMy =  m.trangthai_thanhtoan === 1 ? 1 : (m.trangthai_thanhtoan === 0 && m.trangthai_chuyenkhoan === 0 ? 0 : (m.trangthai_thanhtoan  === 2 && m.trangthai_chuyenkhoan === 0 ? 2 : (m.trangthai_thanhtoan === 0 && m.trangthai_chuyenkhoan === 1 ? -1 : null)));
    //       m['__status_converted'] = statusByMy ;
    //
    //       m['__time_thanhtoan'] =m['thoigian_thanhtoan'] ? this.formatSQLDateTime( new Date(m['thoigian_thanhtoan'])):'';
    //       m['__capthi_convenrtd'] = this.dsCapdo.length>0 && this.dsCapdo.find(f=>f.id === m.caphsk_id) ? this.dsCapdo.find(f=>f.id === m.caphsk_id).title : '';
    //       m['__ghichu'] = parent ? parent['user'].name + ' đăng ký' :'';
    //       return m;
    //     })
    //     this.notifi.isProcessing(false);
    //     this.isLoading = false;
    //   }, error: () => {
    //     this.notifi.isProcessing(false);
    //     this.isLoading = false;
    //     this.notifi.toastError('Load dữ liệu không thành công');
    //   }
    // })

  }

  loadDropdow(event) {

    this.kehoach_id = event;
    this.page = 1;
    this.loadData(this.page, this.kehoach_id, this.search);
  }

  statusSelect: number

  loadDropdowStatusTT(event) {

    this.statusSelect = event;
    this.page = 1;
    this.loadData(this.page, this.kehoach_id, this.search);
  }

  closeForm() {
    this.notifi.closeSideNavigationMenu(this.menuName);
  }

  onSearch(text: string) {
    // this.dataSelct = [];
    this.search = text;
    this.paginator.changePage(1);
    this.page = 1;
    this.loadData(1, this.kehoach_id, text);
  }

  paginate({page}: NgPaginateEvent) {
    this.page = page + 1;
    this.dataSelct = [];
    this.loadData(this.page, this.kehoach_id, this.search);
  }

  thisinh_id: number;

  searchContentByInput(text: string) {
    this.page = 1;

    var viTri = text.indexOf("vsat");

    if (viTri === -1) {
      var phanTuSau = text;
      this.search = phanTuSau.trim();

    } else {
      var phanTuSau = text.slice(viTri + 4);
      this.search = phanTuSau.trim();

    }

    this.loadData(1, this.kehoach_id, this.search);
  }

  onInputChange(event: string) {

    this.inputChanged.next(event);
  }

  btnViewTT(item: OrdersHsk) {
    this.thisinh_id = item.user_id;
    this.notifi.openSideNavigationMenu({
      name: this.menuName,
      template: this.fromUser,
      size: this.sizeFullWidth,
      offsetTop: '0px'
    });
  }

  async btnCheckTT() {
    if (this.dataSelct.length > 0) {
      const select_ids = this.dataSelct.map(m => m.id);
      const select_leght = this.dataSelct.length;
      const button = await this.notifi.confirmRounded('Xác nhận thanh toán thành công với ' + select_leght + ' thí sinh.', 'XÁC NHẬN', [BUTTON_YES, BUTTON_NO]);
      if (button.name === BUTTON_YES.name) {
        this.notifi.isProcessing(true);
        this.modalService.open(this.templateWaiting, WAITING_POPUP);
        this.ordersService.activeOrder(select_ids).subscribe({
          next: () => {
            this.modalService.dismissAll();
            this.loadData(this.page, this.kehoach_id, this.search);
            this.notifi.toastSuccess('Thao tác thành công');
            this.notifi.isProcessing(false);
            this.dataSelct = [];
          }, error: () => {
            this.notifi.isProcessing(false);
            this.modalService.dismissAll();
            this.notifi.toastError('Thao tác không thành công');
            this.dataSelct = [];
            this.loadData(this.page, this.kehoach_id, this.search);

          }
        })

      }
      // this.modalService.open(this.templateWaiting, WAITING_POPUP);
      // this.modalService.dismissAll();
    } else {
      this.notifi.toastWarning('Vui lòng chọn lượt đăng ký');
    }
  }

  async btnDelete_ids() {
    if (this.dataSelct.length > 0) {
      const select_ids = this.dataSelct.map(m => m.id);
      const select_leght = this.dataSelct.length;
      const button = await this.notifi.confirmRounded('Xác nhận xóa đăng ký thi  ' + select_leght + ' thí sinh ?', 'XÁC NHẬN', [BUTTON_YES, BUTTON_NO]);
      if (button.name === BUTTON_YES.name) {
        this.notifi.isProcessing(true);
        this.modalService.open(this.templateWaiting, WAITING_POPUP);

        select_ids.forEach((f, index) => {
          setTimeout(() => {
            this.ordersService.delete(f).subscribe({
              next: () => {
                this.listData = this.listData.filter(a => a.id !== f);
                this.notifi.isProcessing(false);
              }, error: () => {
                this.notifi.toastError('Thao tác không thành công');
                this.notifi.isProcessing(false);

              }
            })
          }, (index + 1) * 200);
        });
        this.modalService.dismissAll();
        this.dataSelct = [];
      }
      // this.modalService.open(this.templateWaiting, WAITING_POPUP);
      // this.modalService.dismissAll();
    } else {
      this.notifi.toastWarning('Vui lòng chọn thi sinh');
    }
  }

  async BtnHuyChoThanhToan() {
    if (this.dataSelct.length > 0) {
      if (this.dataSelct.filter(f => f.trangthai_thanhtoan === 2).length > 0) {
        const select_ids = this.dataSelct.filter(f => f.trangthai_thanhtoan === 2).map(m => m.id);
        const select_leght = this.dataSelct.length;

        const button = await this.notifi.confirmRounded('Hủy trạng thái chờ thanh toán với ' + select_leght + ' thí sinh.', 'XÁC NHẬN', [BUTTON_YES, BUTTON_NO]);
        if (button.name === BUTTON_YES.name) {
          this.notifi.isProcessing(true);
          this.modalService.open(this.templateWaiting, WAITING_POPUP);

          select_ids.map(m => {
            this.ordersService.update(m, {trangthai_thanhtoan: 0}).subscribe({
              next: () => {
                this.listData.find(f => f.id = m)['__status_converted'] = 0;
              }, error: () => {
                this.notifi.toastError('Cập nhật trạng thái không thành công');
              }
            })
          })

        }
        this.notifi.isProcessing(false);
        this.modalService.open(this.templateWaiting, WAITING_POPUP);
        this.modalService.dismissAll();
        setTimeout(() => this.loadData(this.page, this.kehoach_id, this.search), 2000);
        this.dataSelct = [];
      } else {
        this.notifi.toastWarning('Vui lòng chọn thí sinh có trạng thái đang chờ duyệt');
        this.dataSelct = [];
      }
    } else {
      this.notifi.toastWarning('Vui lòng chọn thí sinh.');
    }

  }



  selectDataByCheckbox(event) {
    if (event.checked === true) {
      this.dataSelct = this.listData.filter(f => f.trangthai_thanhtoan !== 1);
    } else {
      this.dataSelct = [];
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
}
