import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NotificationService} from "@core/services/notification.service";
import {Subscription, forkJoin, filter, Subject, debounceTime, switchMap, of, Observable} from "rxjs";
import {DmCapdo,} from "@shared/models/danh-muc";
import {Paginator} from 'primeng/paginator';
import {NgPaginateEvent, OvicTableStructure} from "@shared/models/ovic-models";
import {BUTTON_NO, BUTTON_YES} from "@core/models/buttons";
import {ThemeSettingsService} from "@core/services/theme-settings.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {WAITING_POPUP} from "@shared/utils/syscat";
import {ExportThiSinhDuThiService} from "@shared/services/export-thi-sinh-du-thi.service";
import {DanhMucCapDoService} from "@shared/services/danh-muc-cap-do.service";
import {HskKehoachThiService, KeHoachThi} from "@shared/services/hsk-kehoach-thi.service";
import {HskOrdersService, OrdersHsk} from "@shared/services/hsk-orders.service";
import {User} from "@core/models/user";
import {ThiSinhInfo} from "@shared/models/thi-sinh";

@Component({
  selector: 'app-thi-sinh-du-thi',
  templateUrl: './thi-sinh-du-thi.component.html',
  styleUrls: ['./thi-sinh-du-thi.component.css']
})
export class ThiSinhDuThiComponent implements OnInit {
  @ViewChild('fromUser', {static: true}) fromUser: TemplateRef<any>;
  @ViewChild('formregister', {static: true}) formregister: TemplateRef<any>;
  @ViewChild('templateWaiting') templateWaiting: ElementRef;
  @ViewChild(Paginator) paginator: Paginator;

  isLoading: boolean = true;
  loadInitFail: boolean = false;

  dsCapdo: DmCapdo[];
  dsKehoachthi: KeHoachThi[];

  recordsTotal: number;
  listData: OrdersHsk[];
  dataSelct: OrdersHsk[] = [];
  page: number = 1;

  kehoach_id: number = 0;

  tblStructure: OvicTableStructure[] = [
    {
      fieldType: 'normal',
      field: ['hoten'],
      innerData: true,
      header: 'Họ và tên',
      sortable: false
    },
    {
      fieldType: 'normal',
      field: ['cccd_so'],
      innerData: true,
      header: 'Số CCCD',
      sortable: false,
      headClass: 'ovic-w-130px text-center',
      rowClass: 'ovic-w-130px text-center'
    },
    {
      fieldType: 'normal',
      field: ['phone'],
      innerData: true,
      header: 'Số điện thoại',
      sortable: false,
      headClass: 'ovic-w-130px text-center',
      rowClass: 'ovic-w-130px text-center'
    },
    {
      fieldType: 'normal',
      field: ['ngaysinh'],
      innerData: true,
      header: 'Ngày sinh',
      sortable: false,
      headClass: 'ovic-w-150px text-center',
      rowClass: 'ovic-w-150px text-right'
    },
    {
      fieldType: 'normal',
      field: ['_gioitinh_converted'],
      innerData: true,
      header: 'Giới tính',
      sortable: false,
      headClass: 'ovic-w-130px text-center',
      rowClass: 'ovic-w-130px text-center'
    },
    {
      fieldType: 'normal',
      field: ['_dc_tc_coververted'],
      innerData: true,
      header: 'Địa chỉ thường trú',
      sortable: false
    },
    {
      tooltip: '',
      fieldType: 'buttons',
      field: [],
      rowClass: 'ovic-w-150px text-center',
      checker: 'fieldName',
      header: 'Thao tác',
      sortable: false,
      headClass: 'ovic-w-120px text-center',
      buttons: [
        {
          tooltip: 'Thông tin chi tiết',
          label: '',
          icon: 'pi pi-file',
          name: 'INFO_DECISION',
          cssClass: 'btn-primary rounded'
        },
        {
          tooltip: 'Chi tiết đăng ký',
          label: '',
          icon: 'pi pi-database',
          name: 'INFO_REGITTER',
          cssClass: 'btn-warning rounded'
        }
      ]
    }
  ];

  rows = this.themeSettingsService.settings.rows;
  menuName = 'thisinhduthi';
  sizeFullWidth: number;
  subscription = new Subscription();
  index = 1;
  search = '';
  needUpdate = false;
  private inputChanged: Subject<string> = new Subject<string>();

  statusTT = [
    {value: 0, title: 'Chưa thanh toán'},
    {value: 1, title: 'Đã thanh toán'},

  ]

  constructor(
    private themeSettingsService: ThemeSettingsService,
    private ordersService: HskOrdersService,
    private notifi: NotificationService,
    private danhMucCapDoService:DanhMucCapDoService,
    private hskKehoachThiService : HskKehoachThiService,
    private modalService: NgbModal,
    private exportThiSinhDuThiService: ExportThiSinhDuThiService
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
    forkJoin<[DmCapdo[], KeHoachThi[]]>(
      this.danhMucCapDoService.getDataUnlimitNotStatus(),
      this.hskKehoachThiService.getDataUnlimitNotstatus()
    ).subscribe({
      next: ([capdo, kehoachthi]) => {
        this.dsCapdo = capdo;
        this.dsKehoachthi = kehoachthi;
        if (this.dsCapdo && this.dsKehoachthi) {
          this.loadData(1);
        }
      },error:()=>{
        this.notifi.isProcessing(false);
        this.notifi.toastError('Load dữ liệu không thành công');
      }
    })
  }

  loadData(page: number, kehoach_id?: number, search?: string,) {
    this.selectDataByCheckbox({checker:false});
    this.isLoading = true;
    const limit = this.themeSettingsService.settings.rows;
    this.index = (page * limit) - limit + 1;
    this.notifi.isProcessing(true);
    this.ordersService.getDataByWithChildredAndSearchAndPage(page, this.kehoach_id, this.search ,this.statusSelect).pipe(switchMap(
      (m)=>{

        const parent_ids= m.data.map(a=>a.parent_id).filter(f=>f !== 0);
        const setParent_ids = Array.from(new Set(parent_ids));
      return forkJoin([of(m.recordsTotal),of(m.data),setParent_ids.length>0? this.ordersService.getDataByparentIds(setParent_ids,'id,trangthai_thanhtoan,user_id'): of([])]);
    })).subscribe({
      next: ([recordsTotal, data,dataparent]) => {

        const ids_parant = dataparent.map(m=>m.id);
        this.recordsTotal = recordsTotal;
        this.listData = data.filter(f=>!ids_parant.includes(f.id)).map((m, index) => {

          const user = m['user'];
          const thisinh = m['thisinh'];
          const parent = m.parent_id ? dataparent.find(f=>f.id === m.parent_id) :null;
          m['_indexTable'] = this.rows *(page-1) + index + 1;
          m['__order_id_coverted'] =m.id;
          m['__thisinh_hoten'] = thisinh && thisinh['hoten'] ? thisinh['hoten'] : (user ? user.name:'');
          m['__thisinh_cccd'] = thisinh && thisinh['cccd_so'] ? thisinh['cccd_so'] : (user ? user.username:'');
          m['__thisinh_phone'] = thisinh && thisinh['phone'] ? thisinh['phone'] : (user ? user.phone:'');
          m['__thisinh_email'] = thisinh && thisinh['email'] ? thisinh['email'] : (user ? user.email:'');
          m['giadich'] = m.trangthai_thanhtoan === 1 ? m['transaction_id'] :'';
          m['__dotthi_coverted'] = this.dsKehoachthi.find(f => f.id === m.kehoach_id) ? this.dsKehoachthi.find(f => f.id === m.kehoach_id).dotthi : '';
          // m['__monthi_covered'] = this.dsCapdo.find(f=>f.id === m.caphsk_id) ? m.mon_id.map(b => this.dsMon.find(f => f.id == b) ? this.dsMon.find(f => f.id == b) : []) : [];
          const statusByMy =  m.trangthai_thanhtoan === 1 ? 1 : (m.trangthai_thanhtoan === 0 && m.trangthai_chuyenkhoan === 0 ? 0 : (m.trangthai_thanhtoan  === 2 && m.trangthai_chuyenkhoan === 0 ? 2 : (m.trangthai_thanhtoan === 0 && m.trangthai_chuyenkhoan === 1 ? -1 : null)));
          m['__status_converted'] = statusByMy ;

          m['__time_thanhtoan'] =m['thoigian_thanhtoan'] ? this.formatSQLDateTime( new Date(m['thoigian_thanhtoan'])):'';
          m['__capthi_convenrtd'] = this.dsCapdo.length>0 && this.dsCapdo.find(f=>f.id === m.caphsk_id) ? this.dsCapdo.find(f=>f.id === m.caphsk_id).title : '';
          m['__ghichu'] = parent && parent['user'] && parent['user']['name'] ? (parent['user']['name'] + ' đăng ký' ):'';
          return m;
        })
        this.notifi.isProcessing(false);
        this.isLoading = false;
      }, error: () => {
        this.notifi.isProcessing(false);
        this.isLoading = false;
        this.notifi.toastError('Load dữ liệu không thành công');
      }
    })

  }

  loadDropdow(event) {

    this.kehoach_id = event;
    this.page = 1;
    this.loadData(this.page, this.kehoach_id, this.search);
  }

  statusSelect : number
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
    this.loadData(this.page,this.kehoach_id, this.search);
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
      const button = await this.notifi.confirmRounded('Xác nhận thanh toán thành công với ' + select_leght + ' thí sinh.','XÁC NHẬN',  [BUTTON_YES, BUTTON_NO]);
      if (button.name === BUTTON_YES.name) {
        this.notifi.isProcessing(true);
        this.modalService.open(this.templateWaiting, WAITING_POPUP);
        this.ordersService.activeOrder(select_ids).subscribe({
          next: () => {
            this.modalService.dismissAll();
            this.loadData(this.page, this.kehoach_id, this.search);
            this.notifi.toastSuccess('Thao tác thành công');
            this.notifi.isProcessing(false);
            this.dataSelct=[];
          }, error: () => {
            this.notifi.isProcessing(false);
            this.notifi.toastError('Thao tác không thành công');
            this.dataSelct=[];

          }
        })

      }
      // this.modalService.open(this.templateWaiting, WAITING_POPUP);
      // this.modalService.dismissAll();
    } else {
      this.notifi.toastWarning('Vui lòng chọn thi sinh');
    }
  }
  async btnDelete_ids(){
    if (this.dataSelct.length > 0) {
      const select_ids = this.dataSelct.map(m => m.id);
      const select_leght = this.dataSelct.length;
      const button = await this.notifi.confirmRounded('Xác nhận xóa đăng ký thi  ' + select_leght + ' thí sinh ?','XÁC NHẬN', [BUTTON_YES, BUTTON_NO]);
      if (button.name === BUTTON_YES.name) {
        this.notifi.isProcessing(true);
        this.modalService.open(this.templateWaiting, WAITING_POPUP);

        select_ids.forEach((f,index)=>{
          setTimeout(()=>{
            this.ordersService.delete(f).subscribe({
              next:()=>{
                this.listData= this.listData.filter(a=>a.id !==f);
                this.notifi.isProcessing(false);
              },error:()=>{
                this.notifi.toastError('Thao tác không thành công');
                this.notifi.isProcessing(false);

              }
            })
          },(index+1)*200);
        });
        this.modalService.dismissAll();
        this.dataSelct=[];
      }
      // this.modalService.open(this.templateWaiting, WAITING_POPUP);
      // this.modalService.dismissAll();
    } else {
      this.notifi.toastWarning('Vui lòng chọn thi sinh');
    }
  }

  async BtnHuyChoThanhToan(){
    if (this.dataSelct.length > 0) {
      if(this.dataSelct.filter(f=>f.trangthai_thanhtoan === 2).length>0){
        const select_ids = this.dataSelct.filter(f=>f.trangthai_thanhtoan === 2).map(m => m.id);
        const select_leght = this.dataSelct.length;

        const button = await this.notifi.confirmRounded('Hủy trạng thái chờ thanh toán với ' + select_leght + ' thí sinh.','XÁC NHẬN',  [BUTTON_YES, BUTTON_NO]);
        if (button.name === BUTTON_YES.name) {
          this.notifi.isProcessing(true);
          this.modalService.open(this.templateWaiting, WAITING_POPUP);

          select_ids.map(m=>{
            this.ordersService.update( m,{trangthai_thanhtoan:0} ).subscribe({
              next:()=>{
                this.listData.find(f=>f.id = m)['__status_converted'] = 0;
              },error:( )=>{
                this.notifi.toastError('Cập nhật trạng thái không thành công');
              }
            })
          })

        }
        this.notifi.isProcessing(false);
        this.modalService.open(this.templateWaiting, WAITING_POPUP);
        this.modalService.dismissAll();
        setTimeout(()=>this.loadData(this.page, this.kehoach_id, this.search), 2000);
        this.dataSelct=[];
      }
      else{
        this.notifi.toastWarning('Vui lòng chọn thí sinh có trạng thái đang chờ duyệt');
        this.dataSelct=[];
      }
    }else{
      this.notifi.toastWarning('Vui lòng chọn thí sinh.');
    }

  }

  btnExportExcel() {

    if (this.kehoach_id !== 0) {
      this.notifi.isProcessing(true);
      this.modalService.open(this.templateWaiting, WAITING_POPUP);
      this.ordersService.getDataByKehoachId(this.kehoach_id).subscribe({
        next: (data) => {
          const dataExport = data.map((m, index) => {
            const thisinh = m['thisinh'];
            m['__index'] = index + 1;
            m['__maDK'] = "HSK" + m.id;
            m['__trangthai_thanhtoan'] = m.trangthai_thanhtoan === 1 ? 'Đăng ký thành công' : (m.trangthai_thanhtoan === 0 && m.trangthai_chuyenkhoan === 0 ? 'Chưa thanh toán' : (m.trangthai_thanhtoan === 0 && m.trangthai_chuyenkhoan === 1 ? 'Đã thanh toán,đang xử lý' : (m.trangthai_thanhtoan === 2 ? 'Giao dịch đang sử lý' : '')));
            m['__hoten'] = thisinh ? thisinh['hoten'] : '';
            m['__ngaysinh'] = thisinh ? thisinh['ngaysinh'] : '';
            m['__gioitinh'] = thisinh && thisinh['gioitinh'] === 'nam' ? 'Nam' : "Nữ";
            m['__email'] = thisinh ? thisinh['email'] : "";
            m['__cccd'] = thisinh ? thisinh['cccd_so'] : "";
            m['__phone'] = thisinh ? thisinh['phone'] : '';
            // this.dsCapdo.forEach(f => {
            //   m[f.kyhieu] = m.mon_id.find(n => n === f.id) ? this.dsMon.find(a => a.id === f.id).tenmon : '';
            // })
            return {
              index: m['__index'],
              id: m.id,
              madk: m['__maDK'],
              status: m['__trangthai_thanhtoan'],
              hoten: m['__hoten'],
              ngaysinh: m['__ngaysinh'],
              gioitinh: m['__gioitinh'],
              cccd: m['__cccd'],
              email: m['__email'],
              phone: m['__phone'],

            };
          });


          if (dataExport) {
            this.modalService.dismissAll();
            this.exportThiSinhDuThiService.exportToLong(dataExport, this.dsKehoachthi.find(f => f.id === this.kehoach_id).dotthi);
          }
          this.notifi.isProcessing(false);
          this.modalService.dismissAll();
        },
        error: () => {
          this.modalService.dismissAll();
          this.notifi.toastError('Thao tác không thành công');
          this.notifi.isProcessing(false)
        }
      })
    } else {
      this.notifi.toastError('Vui lòng chọn đợt thi');
    }
  }

  btnExportExcelV2Hsk(){

    if (this.kehoach_id !== 0) {
      this.notifi.isProcessing(true);
      this.modalService.open(this.templateWaiting, WAITING_POPUP);

      // this.ordersService.getDataBykehoachIdAndSelectforThongke(this.kehoach_id,'id,kehoach_id,caphsk_id,lephithi,trangthai_thanhtoan,user_id,parent_id,created_by,updated_by')
      this.loopGetOrderBy(1,200,this.kehoach_id,[],1,'id,kehoach_id,caphsk_id,lephithi,trangthai_thanhtoan,thoigian_thanhtoan,user_id,parent_id,created_by,updated_by',this.statusSelect.toString())
        .pipe(switchMap(m=>{
          const idsParent = Array.from(new Set(m.filter(a => a.parent_id !== 0).map(a => a.parent_id)));
          return forkJoin([of(m),idsParent.length> 0? this.ordersService.getDataByparentIds(idsParent,'id,kehoach_id,caphsk_id,lephithi,trangthai_thanhtoan,thoigian_thanhtoan,user_id,parent_id,created_by,updated_by'):of([])]);
        }))
        .subscribe({
          next:([dataOrder,dataParent])=>{
            const dataMap = dataOrder.map((m,index)=>{
              const user:User = m['user'];
              const thisinh:ThiSinhInfo = m['thisinh'];
              const parent:OrdersHsk = m.parent_id === 0 ? null : dataParent.find(f=>f.id === m.parent_id);
              m['__index'] = index + 1;
              m['__madk'] = 'hsk' + m.id;
              m['__status_converted'] = m.trangthai_thanhtoan === 1 ? 'Thanh toán thành công': (  m.trangthai_thanhtoan === 0 ? 'Chưa thanh toán' : (m.trangthai_thanhtoan === 2 ? 'Giao dịch đang sử lý' : ''));
              m['__capthi_converted'] = this.dsCapdo.length>0 && this.dsCapdo.find(f=>f.id === m.caphsk_id) ? this.dsCapdo.find(f=>f.id === m.caphsk_id).title : '';
              m['__hoten']= user ? user['name'] :(thisinh ? thisinh.hoten : '');
              m['__cccd_so']= user ? user.username :(thisinh ? thisinh.cccd_so : '');
              m['__email']= user && user.email ? user.email :(thisinh && thisinh.email ? thisinh.email : '');
              m['__ngaysinh']= thisinh ? thisinh.ngaysinh : '';
              m['__gioitinh']= thisinh && thisinh.gioitinh ? (thisinh.gioitinh === 'nam' ?'Nam': 'Nữ' ) : '';
              m['__phone']= user ? user.phone :(thisinh ? thisinh.phone : '');
              m['__lephithi']= m.lephithi;
              m['__isInfo']= thisinh ? 1:0;
              m['__isAvata']= thisinh && thisinh.anh_chandung ? 1:0;
              m['__isCccdImg']= thisinh && thisinh.cccd_img_truoc && thisinh.cccd_img_truoc ? 1:0;
              m['__lephithi']= m.lephithi;

              if(parent){
                m['__ghichu']= parent && parent['user']? parent['user']['name']:'Đối tác đăng ký'  ;
              }else if ((m.user_id === m['created_by'] && m['updated_by'] === 0) || (m.user_id === m['created_by'] && m['updated_by'] === m.user_id) ){
                m['__ghichu']='Thí sinh tự đăng ký';
              }else {
                m['__ghichu']= 'Admin xét duyệt';
              }
              return {
                index: m['__index'],
                madk: m['__madk'],
                status: m['__status_converted'],
                hoten: m['__hoten'],
                ngaysinh: m['__ngaysinh'],
                gioitinh: m['__gioitinh'],
                cccd: m['__cccd_so'],
                email: m['__email'],
                phone: m['__phone'],
                capthi: m['__capthi_converted'],
                ghichu: m['__ghichu'],
                thoigian_thanhtoan:m['thoigian_thanhtoan'] ? this.formatSQLDateTime( new Date(m['thoigian_thanhtoan'])):''
              };
            });

            if (dataMap) {
              this.modalService.dismissAll();
              this.exportThiSinhDuThiService.exportToLongHsk(dataMap, this.dsKehoachthi.find(f => f.id === this.kehoach_id).dotthi);
            }


            this.notifi.isProcessing(false);
            this.notifi.disableLoadingAnimationV2();
          },
          error:()=>{
            this.notifi.isProcessing(false);
            this.notifi.disableLoadingAnimationV2();
            this.notifi.toastError('Load dữ liệu không thành công');

          }
        });
    } else {
      this.notifi.toastError('Vui lòng chọn đợt thi');
    }
  }
  selectDataByCheckbox(event){
    if (event.checked === true){
      this.dataSelct = this.listData.filter(f=>f.trangthai_thanhtoan !== 1);
    }else {
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

  loopGetOrderBy(page:number,limit:number, kehoach_id:number, data:OrdersHsk[] ,recordsFiltered:number, select:string, trangthai_thanhtoan:string):Observable<OrdersHsk[]>{
    if (data.length < recordsFiltered) {

      return this.ordersService.getDataBykehoachIdAndSelectforThongkeV2(page,limit,kehoach_id,select,trangthai_thanhtoan).pipe(
        switchMap(m=>{

          return this.loopGetOrderBy(page+1,limit,kehoach_id,data.concat(m['data']),m['recordsFiltered'],select,trangthai_thanhtoan)
        })
      )
    } else{
      return of(data);
    }
  }


}
