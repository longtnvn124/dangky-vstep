import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {debounceTime, forkJoin, Observable, of, Subject, Subscription, switchMap} from "rxjs";
import {Paginator} from "primeng/paginator";
import {DmCapdo} from "@shared/models/danh-muc";
import {HskOrdersShip, HskOrdersShipService} from '@modules/shared/services/hsk-orders-ship.service';
import {NgPaginateEvent, OvicTableStructure} from '@modules/shared/models/ovic-models';
import {ThemeSettingsService} from "@core/services/theme-settings.service";
import {NotificationService} from "@core/services/notification.service";
import {DanhMucCapDoService} from "@shared/services/danh-muc-cap-do.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ExportThiSinhDuThiService} from "@shared/services/export-thi-sinh-du-thi.service";
import {FileService} from "@core/services/file.service";
import {HskHoidongKetquaService} from "@shared/services/hsk-hoidong-ketqua.service";
import {filter} from "rxjs/operators";
import {WAITING_POPUP} from "@shared/utils/syscat";
import {BUTTON_NO, BUTTON_YES} from "@core/models/buttons";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SenderEmailService} from "@shared/services/sender-email.service";
import {HskVandon, HskVandonService} from "@shared/services/hsk-vandon.service";

@Component({
  selector: 'app-phieu-yeu-cau',
  templateUrl: './phieu-yeu-cau.component.html',
  styleUrls: ['./phieu-yeu-cau.component.css']
})
export class PhieuYeuCauComponent implements OnInit {

  @ViewChild('fromUser', {static: true}) fromUser: TemplateRef<any>;
  @ViewChild('formregister', {static: true}) formregister: TemplateRef<any>;
  @ViewChild('templateWaiting') templateWaiting: ElementRef;
  @ViewChild(Paginator) paginator: Paginator;

  isLoading: boolean = true;
  loadInitFail: boolean = false;

  dsCapdo: DmCapdo[];
  dsKehoachthi: KeHoachThi[];

  recordsTotal: number;
  listData: HskOrdersShip[];
  dataSelct:  HskOrdersShip[]=[];
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
    {value: '0', title: 'Chưa thanh toán'},
    {value: '1', title: 'Đã thanh toán'},
    {value: '-1', title: 'Hủy duyệt'},
    {value: '2', title: 'Đã thanh toán, chờ duyệt'},

  ]
   formVandon: FormGroup;

  ngType:1 | 2 =1 ;//1.phieu 2.vandon
  constructor(
    private themeSettingsService: ThemeSettingsService,
    private ordersService: HskOrdersService,
    private hskOrdersShipService: HskOrdersShipService,
    private notifi: NotificationService,
    private dmCapDoService: DanhMucCapDoService,
    private hskKehoachThiService: HskKehoachThiService,
    private modalService: NgbModal,
    private exportThiSinhDuThiService: ExportThiSinhDuThiService,
    private fileSerivce: FileService,
    private hskHoidongKetquaService:HskHoidongKetquaService,
    private senderEmailService:SenderEmailService,
    private fb:FormBuilder,
    private hskVandonService: HskVandonService
  ) {

    const observeProcessCloseForm = this.notifi.onSideNavigationMenuClosed().pipe(filter(menuName => menuName === this.menuName && this.needUpdate)).subscribe(() => this.loadData(this.page));
    this.subscription.add(observeProcessCloseForm);
    const observerOnResize = this.notifi.observeScreenSize.subscribe(size => this.sizeFullWidth = size.width)
    this.subscription.add(observerOnResize);
    this.formVandon = this.fb.group({
      ma_vandon:['',Validators.required],
      vandon_content:['',Validators.required]
    })
  }

  ngOnInit(): void {
    this.inputChanged.pipe(debounceTime(1000)).subscribe((item: string) => {
      this.searchContentByInput(item);
    });
    this.loadInit();
  }
  loadInit() {
    forkJoin<[DmCapdo[], KeHoachThi[]]>(
      this.dmCapDoService.getDataUnlimitNotStatus(),
      this.hskKehoachThiService.getDataUnlimitNotstatusByDESC()
    ).subscribe({
      next: ([mon, kehoachthi]) => {
        this.dsCapdo = mon;
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
    // this.selectDataByCheckbox({checker:false});
    this.isLoading = true;
    this.page  = page;
    const limit = this.themeSettingsService.settings.rows;
    this.index = (page * limit) - limit + 1;
    this.notifi.isProcessing(true);
    // this.ordersService.getDataByWithThisinhAndSearchAndPage(page, this.kehoach_id, this.search ,this.statusSelect).subscribe({
    this.hskOrdersShipService.getDataByWithThisinhAndSearchAndPage(page, this.kehoach_id, this.search ,this.statusSelect).pipe(switchMap(m=>{
      return forkJoin([
        of(m.recordsTotal),
        this.loopGetVandonByItem(m.data)
      ])
    })).subscribe({
      next: ([recordsTotal, data]) => {
        this.recordsTotal = recordsTotal
        this.listData = data.map((m, index) => {
          const thisinh = m['thisinh'];
          m['_indexTable'] = this.rows *(page-1) + index + 1;
          m['__order_id_coverted'] = m.id;
          m['__thisinh_hoten'] = m.thisinh_hoten;
          m['__thisinh_phone'] = m.nguoinhan_phone;
          m['__thisinh_cccd'] = thisinh ? thisinh['cccd_so'] : '';
          m['__thisinh_ngaysinh'] = thisinh ? thisinh['ngaysinh'] : '';
          m['__thisinh_gioitinh'] = thisinh ? thisinh['gioitinh'] : '';

          m['__thisinh_email'] = thisinh ? thisinh['email'] : '';
          m['giadich'] = m['transaction_id'];
          m['__dotthi_coverted'] = this.dsKehoachthi.find(f => f.id === m.kehoach_id) ?  this.dsKehoachthi.find(f => f.id === m.kehoach_id).dotthi : '';
          m['__capHsk'] = this.dsCapdo.find(f=>f.id === m.caphsk_id) ? this.dsCapdo.find(f=>f.id === m.caphsk_id).title:'';
          m['__status_converted'] = m.trangthai_thanhtoan ;
          m['__time_thanhtoan'] = m['thoigian_thanhtoan'] ? this.formatSQLDateTime( new Date(m['thoigian_thanhtoan'])): '';
          // m['__anh_minhchung'] = m['files']&& m['files'].length >0  ? this.fileservice. ( new Date(m['thoigian_thanhtoan'])): '';
          m['__minhchung'] = m['files'] && m['files'].length > 0 ? this.fileSerivce.getPreviewLinkLocalFileNotToken(m['files'][0]) : '';

          m['__vandon'] = m['dataVandon'] && m['dataVandon'].length > 0 ? "Đã vận chuyển" : '';

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

  loopGetVandonByItem(data:HskOrdersShip[]):Observable<HskOrdersShip[]>{
    const index = data.findIndex(f=>!f['haveVandon'])
    if(index !== -1){
      const item = data[index];
      return this.hskVandonService.getDatabyKehoachIdAnd(item.kehoach_id,'',item.nguoinhan_phone).pipe(switchMap(m=>{
        data[index]['haveVandon'] = true;
        data[index]['dataVandon'] = m;
        return this.loopGetVandonByItem(data);
      }))
    }else{
      return of(data);
    }
  }
  loadDropdow(event) {

    this.kehoach_id = event;
    this.page = 1;
    this.loadData(this.page, this.kehoach_id, this.search);
  }

  statusSelect : string = '';
  loadDropdowStatusTT(event) {

    this.statusSelect = event;
    this.page = 1;
    this.loadData(this.page, this.kehoach_id, this.search);
  }

  closeForm() {
    this.notifi.closeSideNavigationMenu(this.menuName);
  }
  onSearch(text: string) {
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

  btnViewTT(item:HskOrdersShip) {
    this.thisinh_id = item.thisinh_id;
    this.notifi.openSideNavigationMenu({
      name: this.menuName,
      template: this.fromUser,
      size: this.sizeFullWidth,
      offsetTop: '0px'
    });
  }

  btnExportExcel() {
    if (this.kehoach_id !== 0) {
      this.notifi.isProcessing(true);
      this.modalService.open(this.templateWaiting, WAITING_POPUP);
      // this.ordersService.o(this.kehoach_id, this.statusSelect).subscribe({
      forkJoin([
        this.hskOrdersShipService.getDataByKehoachId(this.kehoach_id, this.statusSelect),
        this.hskVandonService.getDataUnlimitBykehoachid(this.kehoach_id)
      ])

        .subscribe({
        next: ([data, vandon]) => {
          const dataExport = data.map((m, index) => {
            const thisinh = m['thisinh'];
            m['__index'] = index + 1;
            m['__trangthai_thanhtoan'] = m.trangthai_thanhtoan === 1 ? 'Đăng ký thành công' : (m.trangthai_thanhtoan === 0  ? 'Chưa thanh toán' : (m.trangthai_thanhtoan === 2 ? 'Giao dịch đang sử lý' : ''));
            m['__hoten'] = thisinh ? thisinh['hoten'] : '';
            m['__ngaysinh'] = thisinh ? thisinh['ngaysinh'] : '';
            m['__email'] = thisinh ? thisinh['email'] : "";
            m['__cccd'] = thisinh ? thisinh['cccd_so'] : "";
            m['__phone'] = thisinh ? thisinh['phone'] : '';
            m['__sobaodanh'] = m.sobaodanh
            const params = m.params;
            // this.dsCapdo.forEach(f => {
            //   const monthi = params.find(a=>a.key ===1 && a.monthi === f.tenmon)
            //   m[f.kyhieu] =monthi ? (monthi.soluong >0 ? monthi.soluong : '') : '';
            // })
            const chuyenphat = params.find(f=>f.isChange== 0).soluong > 0 ? 'Chuyển phát' : 'Không chuyển phát';
            const bansao = params.find(f=>f.isChange !== 0).soluong > 0 ? params.find(f=>f.isChange !== 0).soluong +'' : '';
            const createdAt = m['thoigian_thanhtoan'] ? this.formatSQLDateTime(new Date(m['thoigian_thanhtoan'])) : '' ;
            // const vandonforYou = vandon.find(f=>f.nguoinhan_hoten === m.nguoinhan_hoten && f.nguoinhan_phone === m.nguoinhan_phone) ?'Đã vận chuyển' :'';
            const vandonforYou = vandon.find(f=> f.nguoinhan_phone.trim() === m.nguoinhan_phone.trim()) ?'Đã vận chuyển' :'';

            return {
              index: m['__index'],
              status: m['__trangthai_thanhtoan'],
              hoten: m['__hoten'],
              ngaysinh: m['__ngaysinh'],
              cccd: m['__cccd'],
              email: m['__email'],
              phone: m['__phone'],
              nguoinhan_hoten:m.nguoinhan_hoten,
              thisinh_hoten:m.thisinh_hoten,
              nguoinhan_phone:m.nguoinhan_phone,
              nguoinhan_diachi:m.nguoinhan_diachi,
              sobaodanh:m.sobaodanh ,
              caphsk:this.dsCapdo.find(f=>f.id === m.caphsk_id) ? this.dsCapdo.find(f=>f.id === m.caphsk_id).title:'' ,
              chuyenphat: chuyenphat,
              bansao: bansao,
              createdAt : m['thoigian_thanhtoan'] ? this.formatSQLDateTime( new Date(m['thoigian_thanhtoan'])): '',
              vandon: vandonforYou
            };
          });


          if (dataExport) {
            this.modalService.dismissAll();
            this.notifi.toastWarning('hệ thống đang tải dữ liệu');
            this.exportThiSinhDuThiService.exportToPhieuDiem(dataExport, this.dsKehoachthi.find(f => f.id === this.kehoach_id).dotthi);
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
  btnExportWord() {
    if (this.kehoach_id !== 0) {
      this.notifi.isProcessing(true);
      this.modalService.open(this.templateWaiting, WAITING_POPUP);
      // this.ordersService.o(this.kehoach_id, this.statusSelect).subscribe({
      // this.hskOrdersShipService.getDataByKehoachId(this.kehoach_id, this.statusSelect)

      forkJoin([
        this.hskOrdersShipService.getDataByKehoachId(this.kehoach_id, this.statusSelect),
        this.hskVandonService.getDataUnlimitBykehoachid(this.kehoach_id)
      ])
        .subscribe({
        next: ([data,vandon]) => {
          const dataExport = data.length>0 ? this.sortByFirstNumericCodeInObject(data).map((m, index) => {
            const thisinh = m['thisinh'];
            m['__index'] = index + 1;
            m['__trangthai_thanhtoan'] = m.trangthai_thanhtoan === 1 ? 'Đăng ký thành công' : (m.trangthai_thanhtoan === 0  ? 'Chưa thanh toán' : (m.trangthai_thanhtoan === 2 ? 'Giao dịch đang sử lý' : ''));
            m['__hoten'] = thisinh ? thisinh['hoten'] : '';
            m['__ngaysinh'] = thisinh ? thisinh['ngaysinh'] : '';
            m['__email'] = thisinh ? thisinh['email'] : "";
            m['__cccd'] = thisinh ? thisinh['cccd_so'] : "";
            m['__phone'] = thisinh ? thisinh['phone'] : '';
            m['__sobaodanh'] = m.sobaodanh;
            m['__caphsk'] = this.dsCapdo.find(f=>f.id === m.caphsk_id) ? this.dsCapdo.find(f=>f.id === m.caphsk_id).title : ''  ;
            const params = m.params;
            // this.dsCapdo.forEach(f => {
            //   const monthi = params.find(a=>a.key ===1 && a.monthi === f.tenmon)
            //   m[f.kyhieu] =monthi ? (monthi.soluong >0 ? monthi.soluong : '') : '';
            // })
            const chuyenphat = params.find(f=>f.isChange== 0).soluong > 0 ? 'Chuyển phát' : 'Không chuyển phát';
            const bansao = params.find(f=>f.isChange !== 0).soluong > 0 ? params.find(f=>f.isChange !== 0).soluong +'' : '';
            const createdAt = m['thoigian_thanhtoan'] ? this.formatSQLDateTime(new Date(m['thoigian_thanhtoan'])) : '' ;
            // const vandonforYou = vandon.find(f=>f.nguoinhan_hoten === m.nguoinhan_hoten && f.nguoinhan_phone === m.nguoinhan_phone) ?'Đã vận chuyển' :'';
            const vandonforYou = vandon.find(f=> f.nguoinhan_phone.trim() === m.nguoinhan_phone.trim()) ?'Đã vận chuyển' :'';
            return {
              index: m['__index'],
              name: `${m.nguoinhan_hoten} \n SĐT: ${m.nguoinhan_phone} \n ĐC:${m.nguoinhan_diachi} \n ( Họ tên thí sinh: ${m['__hoten']} \n Số bản dịch: ${bansao}`,
              caphsk  : m['__caphsk'],
              __sobaodanh  : m.sobaodanh,
              _status: m['__trangthai_thanhtoan'],
              _chuyenphat : chuyenphat,
              _vandon:vandonforYou
            }
          }) : [];


          if (dataExport.length > 0) {
            this.modalService.dismissAll();
            this.notifi.toastWarning('hệ thống đang tải dữ liệu');
            // this.exportThiSinhDuThiService.exportToPhieuDiem(dataExport, 'Phiếu dán ' + this.dsKehoachthi.find(f => f.id === this.kehoach_id).dotthi);
            this.exportThiSinhDuThiService.exportDataToWordToExcel(dataExport, this.dsKehoachthi.find(f => f.id === this.kehoach_id).dotthi);
          }else{
            this.notifi.toastError('Không có thí sinh đăng ký chuyển phát đợt thi nào ');
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
  orderShipSelect : HskOrdersShip;
  viewOrderShipSelect:boolean = false;
  sbdText: string;
  viewOrderShip(item: HskOrdersShip){
    this.orderShipSelect = {...item};
    this.viewOrderShipSelect=  true;
    this.hskHoidongKetquaService.getdataByCccdSoAndKehoachId(item['__thisinh_cccd'],item.kehoach_id).subscribe({
      next:(data)=>{
        this.sbdText = data.length>0 ?  [...new Set(data.map(m=>m.sobaodanh))].join(',') : '';
      },error:()=>{
        this.sbdText = '';
      }
    })
  }
  viewDongiaItem(item: any) {
    return item.soluong *item.value;
  }

  viewDongiaAll(arr:any[]){
    const total = arr.reduce((acc, item) => {
      return acc + item.soluong * item.value;
    }, 0);

    return total;
  }

  selectDataByCheckbox(event){
    if (event.checked === true){
      this.dataSelct = this.listData.filter(f=>f.trangthai_thanhtoan !== 1);
    }else {
      this.dataSelct = [];
    }
  }

  async btnCheckTT(){
    if(this.dataSelct.length>0){
      const body = `
        <p> Xác nhận nội dung thanh toán của <strong>${this.dataSelct.length}</strong> phiếu chuyển phát trùng với nội dung chuyển khoản</p>
      `;
      const btn = await this.notifi.confirmRounded(body,'XÁC NHẬN THANH TOÁN THÀNH CÔNG',[ BUTTON_NO,BUTTON_YES]);
      if(btn.name === 'yes'){
        const step: number = 100 / this.dataSelct.length;
        this.notifi.isProcessing(true);
        this.notifi.loadingAnimationV2({process: {percent: 0}});

        this.loopActiveOrdes(this.dataSelct, step, 0).subscribe({
          next:()=>{
            this.notifi.isProcessing(false);
            this.notifi.toastSuccess('Thao tác thành công');
            this.dataSelct=[];
            this.loadData(1);
          },error:()=>{
            this.notifi.isProcessing(false);
            this.notifi.toastError('Thao tác không thành công');
            this.dataSelct=[];
          }
        })

      }

    }else{
      this.notifi.toastWarning('Vui lòng chọn phiếu của thi sinh');
    }
  }

  private loopActiveOrdes(list: HskOrdersShip[],step: number, percent: number): Observable<any> {
    const index: number = list.findIndex(i => !i['access']);
    if (index !== -1) {
      return this.hskOrdersShipService.activeShip(list[index].id).pipe(switchMap(() => {
        list[index]['access'] = true;
        const newPercent: number = percent + step;
        this.notifi.loadingAnimationV2({process: {percent: newPercent}});
        return this.loopActiveOrdes(list, step, newPercent);
      }))
    } else {
      this.notifi.disableLoadingAnimationV2();
      return of('complete');
    }
  }
  async BtnHuyChoThanhToan(){
    if(this.dataSelct.length>0){
      const body = `
        <p> Xác nhận hủy duyệt <strong>${this.dataSelct.length}</strong> phiếu chuyển phát có nội dung không hợp lệ</p>
      `;
      const btn = await this.notifi.confirmRounded(body,'XÁC NHẬN HỦY DUYỆT PHIẾU CHUYỂN PHÁT',[ BUTTON_NO,BUTTON_YES]);
      if(btn.name === 'yes'){
        const step: number = 100 / this.dataSelct.length;
        this.notifi.isProcessing(true);
        this.notifi.loadingAnimationV2({process: {percent: 0}});

        this.loopCancelOrdes(this.dataSelct, step, 0).subscribe({
          next:()=>{
            this.notifi.isProcessing(false);
            this.notifi.toastSuccess('Thao tác thành công');
            this.dataSelct=[];
            this.loadData(1);
          },error:()=>{
            this.notifi.isProcessing(false);
            this.notifi.toastError('Thao tác không thành công');
            this.dataSelct=[];
          }
        })

      }

    }else{
      this.notifi.toastWarning('Vui lòng chọn phiếu của thi sinh');
    }
  }

  private loopCancelOrdes(list: HskOrdersShip[],step: number, percent: number): Observable<any> {
    const index: number = list.findIndex(i => !i['cancel']);
    if (index !== -1) {
      return this.hskOrdersShipService.cancelShip(list[index].id).pipe(switchMap(() => {
        list[index]['cancel'] = true;
        const newPercent: number = percent + step;
        this.notifi.loadingAnimationV2({process: {percent: newPercent}});
        return this.loopCancelOrdes(list, step, newPercent);
      }))
    } else {
      this.notifi.disableLoadingAnimationV2();
      return of('complete');
    }
  }

  duyetThanhtoanItemByphieu(item:HskOrdersShip){
    this.notifi.isProcessing(true);
    this.hskOrdersShipService.activeShip(item.id).subscribe({
      next:()=>{
        this.loadData(1,this.kehoach_id,this.search);
        this.notifi.isProcessing(false);
        this.notifi.toastSuccess('Thao tác thành công');

      },
      error:()=>{
        this.notifi.toastError('Thao tác không thành công');
        this.notifi.isProcessing(false);
      }
    })
  }

  viewOrderShipVandon:boolean = false;
  sendChuyenphat(item:HskOrdersShip){
    this.orderShipSelect = {...item};
    this.viewOrderShipVandon =true;
    this.formVandon.reset(
      {
        ma_vandon: '',
        vandon_content: '',
      }
    ) ;
  }
  btnAcceptVandon(){
    if(this.formVandon.valid){
      this.notifi.isProcessing(true)
      this.hskOrdersShipService.update(this.orderShipSelect.id,this.formVandon.value).subscribe({
        next:()=>{
          this.notifi.isProcessing(false);
          this.notifi.toastSuccess('Cập nhật thành công');
          this.sendEmail( this.formVandon.value, this.orderShipSelect)
          this.viewOrderShipVandon = false;
        },
        error:()=>{
          this.notifi.isProcessing(false);
          this.notifi.toastError('Thao tác không thành công')
        }
      })
    }else{
      this.notifi.toastWarning( 'Vui lòng nhập đủ thông tin');
    }
  }
  sendEmail( form:any,orderSelect:HskOrdersShip) {

    let message = `

        <p>Thông báo Thông tin chuyển phát Chứng chỉ Bài thi HSK trên máy tính của Đại học Thái Nguyên (HSK-TNU):</p>

        <p style="font-weight:700;">THÔNG TIN CHUYỂN PHÁT:</p>
        <table width="100%" style="border:0;">
            <tr>
                <td style="width:250px;">Họ và tên người nhận:</td>
                <td style="font-weight:600">${orderSelect['nguoinhan_hoten']}</td>
            </tr>

            <tr>
                <td style="width:250px;">Số điện thoại người nhận:</td>
                <td style="font-weight:600">${orderSelect['nguoinhan_phone']}</td>
            </tr>
            <tr>
                <td style="width:250px;">Địa chỉ người nhận:</td>
                <td style="font-weight:600">${orderSelect['nguoinhan_diachi']}</td>
            </tr>
            <tr>
                <td style="width:250px;">Cấp HSK:</td>
                <td style="font-weight:600">${this.dsCapdo.find(f=>f.id === orderSelect['caphsk_id']) ? this.dsCapdo.find(f=>f.id === orderSelect['caphsk_id']).title :''}</td>
            </tr>
            <tr>
                <td style="width:250px;">Số báo danh:</td>
                <td style="font-weight:600">${orderSelect['sobaodanh']}</td>
            </tr>

        </table>

        <p style="font-weight:700;">THÔNG TIN VẬN ĐƠN:</p>

          <p><strong>Mã vận đơn: </strong> ${form['ma_vandon']} </p>
          <p><strong>Nội dung  : </strong> ${form['vandon_content']} </p>
    `;



    const emailsend: any = {
      to: this.orderShipSelect['__thisinh_email'],
      // to: 'longkakainfo@gmail.com',
      title: ' Email thông báo đăng ký chuyển phát',
      message: message
    }
    this.notifi.isProcessing(true)
    this.senderEmailService.sendEmail(emailsend).subscribe({
      next: () => {
        this.loadData(1);
        this.notifi.isProcessing(false)
        this.notifi.toastSuccess("Hệ thống gửi Email thành công.");
      }, error: () => {
        this.notifi.isProcessing(false)
        this.notifi.toastError('Hệ thống gửi Email không thành công');
      }
    })
  }

  sortByFirstNumericCodeInObject(arr: HskOrdersShip[]) {
    const regex = /[A-Z]+\d+/g;

    return arr.sort((a, b) => {
      const aMatches = a.sobaodanh.match(regex);
      const bMatches = b.sobaodanh.match(regex);

      const aNum = aMatches ? parseInt(aMatches[0].replace(/[A-Z]+/, '')) : 0;
      const bNum = bMatches ? parseInt(bMatches[0].replace(/[A-Z]+/, '')) : 0;

      return aNum - bNum;
    });
  }


}
