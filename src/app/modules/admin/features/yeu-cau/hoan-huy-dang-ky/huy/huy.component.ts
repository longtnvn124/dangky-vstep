import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Paginator, PaginatorModule} from "primeng/paginator";
import {NgPaginateEvent, OvicTableStructure} from "@shared/models/ovic-models";
import {debounceTime, filter, forkJoin, Observable, of, Subject, Subscription, switchMap} from "rxjs";
import {ThemeSettingsService} from "@core/services/theme-settings.service";
import {NotificationService} from "@core/services/notification.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ExportThiSinhDuThiService} from "@shared/services/export-thi-sinh-du-thi.service";
import {BUTTON_NO, BUTTON_YES} from "@core/models/buttons";
import {WAITING_POPUP} from "@shared/utils/syscat";
import {ExportExcelHskService} from "@shared/services/export-excel-hsk.service";
import { SenderEmailService} from "@shared/services/sender-email.service";
import {FileService} from "@core/services/file.service";
import {DropdownModule} from "primeng/dropdown";
import {MatMenuModule} from "@angular/material/menu";
import {TableModule} from "primeng/table";
import {CheckboxModule} from "primeng/checkbox";
import {NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {DialogModule} from "primeng/dialog";
import {ImageModule} from "primeng/image";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {KeHoachThi, KehoachthiVstepService} from "@shared/services/vstep/kehoachthi-vstep.service";
import {VstepOrdersService} from "@shared/services/vstep-orders.service";
import {ConditionOption} from "@shared/models/condition-option";
import {map} from "rxjs/operators";
import {HuyOrders, HuyOrdersService} from "@shared/services/vstep/huy-orders.service";
import {AuthService} from "@core/services/auth.service";
import {DonViService} from "@shared/services/don-vi.service";
import {DonVi} from "@shared/models/danh-muc";

@Component({
  selector: 'app-huy',
  templateUrl: './huy.component.html',
  styleUrls: ['./huy.component.css'],
  imports: [
    DropdownModule,
    MatMenuModule,
    TableModule,
    CheckboxModule,
    NgSwitch,
    NgSwitchCase,
    PaginatorModule,
    MatProgressBarModule,
    DialogModule,
    NgIf,
    ImageModule,
    InputTextModule,
    ButtonModule,
    RippleModule
  ],
  standalone: true
})
export class HuyComponent implements OnInit {


  @ViewChild('templateWaiting') templateWaiting: ElementRef;
  @ViewChild(Paginator) paginator: Paginator;

  isLoading: boolean = true;
  loadInitFail: boolean = false;

  dsKehoachthi: KeHoachThi[];
  recordsTotal: number;
  listData: HuyOrders[];
  dataSelct: HuyOrders[] = [];
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
  listDonvi :DonVi[];
  constructor(
    private themeSettingsService: ThemeSettingsService,
    private ordersService: VstepOrdersService,
    private notifi: NotificationService,
    private kehoachThiService : KehoachthiVstepService,
    private modalService: NgbModal,
    private exportThiSinhDuThiService: ExportThiSinhDuThiService,
    private huyOrdersService: HuyOrdersService,
    private exportExcelHskService :ExportExcelHskService,
    private SenderEmailService :SenderEmailService,
    private fileService:FileService,
    private auth: AuthService,
    private donViService: DonViService,
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
    const getkehoac: ConditionOption = {
      condition:[
      ],page: '1',
      set:[
        {
          label:'limit',value:'-1'
        }
      ]
    }

    forkJoin([
      this.kehoachThiService.getDataByPageNew(getkehoac).pipe(map(m=>m.data),),
      this.donViService.getChildren(this.auth.user.donvi_id)]
    ).subscribe({
      next: ([ kehoachthi,donvi]) => {
        this.dsKehoachthi = kehoachthi;
        this.listDonvi= donvi ;

        if (this.dsKehoachthi) {
          this.loadData(1);
        }
      },error:()=>{
        this.notifi.isProcessing(false);
        this.notifi.toastError('Load dữ liệu không thành công');
      }
    })
  }

  loadData(page: number, kehoach_id?: number, search?: string) {
    this.selectDataByCheckbox({checker:false});
    this.isLoading = true;
    const limit = this.themeSettingsService.settings.rows;
    this.index = (page * limit) - limit + 1;
    this.notifi.isProcessing(true);
    this.huyOrdersService.getDataByPageAnd(page, this.search, this.kehoach_id, this.caphsk_id_select, 'cancel').subscribe(
      {
        next: ({data, recordsTotal}) => {
          this.recordsTotal = recordsTotal;

          this.listData = data.length > 0 ? data.map((m, index) => {
            const thisinh = m['thisinh'];
            const parent = m['parent'];
            m['_indexTable'] = (page - 1) * 10 + (index + 1);
            m['_hoten'] = m.hoten;
            m['_dotthi'] = this.dsKehoachthi.find(f => f.id === m.kehoach_id) ? this.dsKehoachthi.find(f => f.id === m.kehoach_id).title : '';
            m['_capdohsk'] = this.listDonvi.find(f => f.id === m.diemduthi_id) ? this.listDonvi.find(f => f.id === m.diemduthi_id).title : '';
            m['_email'] = thisinh && thisinh['email'] ? thisinh['email'] : '';
            m['_phone'] = thisinh && thisinh['phone'] ? thisinh['phone'] : '';
            m['_cccd_so'] = thisinh && thisinh['cccd_so'] ? thisinh['cccd_so'] : '';
            m['_ngaysinh'] = thisinh && thisinh['ngaysinh'] ? thisinh['ngaysinh'] : '';
            m['_status'] = m.state;
            m['_cccd_img_truoc'] = thisinh && thisinh['cccd_img_truoc'] ? this.fileService.getPreviewLinkLocalFile(thisinh['cccd_img_truoc'][0]):'';
            m['_cccd_img_sau'] = thisinh && thisinh['cccd_img_sau'] ? this.fileService.getPreviewLinkLocalFile(thisinh['cccd_img_sau'][0]):'' ;



            m['_files'] = m['files'] !== null ? this.fileService.getPreviewLinkLocalFile(m['files'][0]) : '';
            m['_minhchung'] = m['minhchung'] !== null && m['minhchung'][0] ? this.fileService.getPreviewLinkLocalFile(m['minhchung'][0]) : '';

            // m['__minhchung'] = m['files'] && m['files'].length > 0 ? this.fileSerivce.getPreviewLinkLocalFileNotToken(m['files'][0]) : '';

            // m['_status'] = -1;
            m['_ghichu'] = parent && parent['user']['name'] ? parent['user']['name'] : 'Thí sinh tự đăng ký'
            return m;
          }) : [];

          this.isLoading = false;
          this.notifi.isProcessing(false);
        },
        error: () => {
          this.isLoading = false;
          this.notifi.isProcessing(false);
          this.notifi.toastError('Load dữ liệu không thành công');
        }
      }
    )
  }

  loadDropdow(event) {
    this.kehoach_id = event;
    this.page = 1;
    this.loadData(this.page, this.kehoach_id, this.search);
  }

  caphsk_id_select:number= null;
  loadDropdowCapHSK(event) {
    this.caphsk_id_select = event;
    this.page = 1;
    this.loadData(this.page, this.kehoach_id, this.search);
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

  searchContentByInput(text: string) {
    this.page = 1;
    this.search = text;
    this.loadData(1, this.kehoach_id, this.search);
  }

  onInputChange(event: string) {
    this.inputChanged.next(event);
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
    } else {
      this.notifi.toastWarning('Vui lòng chọn thi sinh');
    }
  }


  btnExportExcelHskHuyDk() {
    if (this.kehoach_id) {
      const dotthi = this.dsKehoachthi.find(f => f.id == this.kehoach_id);
      this.huyOrdersService.getDataUnlimitByKehoachIdAndCapHsk(this.kehoach_id, this.caphsk_id_select,'cancel').subscribe(
        {
          next: ({data, recordsTotal}) => {
            this.recordsTotal = recordsTotal;
            const dataEx = data.length > 0 ? data.map((m, index) => {
              const thisinh = m['thisinh'];
              const parent = m['parent'];
              m['_indexTable'] = (index + 1);
              m['_hoten'] = m.hoten;
              m['_dotthi'] = this.dsKehoachthi.find(f => f.id === m.kehoach_id) ? this.dsKehoachthi.find(f => f.id === m.kehoach_id).title : '';
              m['_capdohsk'] = this.listDonvi.find(f => f.id === m.diemduthi_id) ? this.listDonvi.find(f => f.id === m.diemduthi_id).title : '';
              m['_email'] = thisinh && thisinh['email'] ? thisinh['email'] : '';
              m['_phone'] = thisinh && thisinh['phone'] ? thisinh['phone'] : '';
              m['_cccd_so'] = thisinh && thisinh['cccd_so'] ? thisinh['cccd_so'] : '';
              m['_ngaysinh'] = thisinh && thisinh['ngaysinh'] ? thisinh['ngaysinh'] : '';


              m['_status'] = m.state === 1?'Đã duyệt': (m.state === -1 ? 'Huỷ duyệt' : (m.state === 0 ? 'Chờ duyệt':''));
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

            const header = ['STT', 'ĐỊA CHỈ EMAIL', 'HỌ VÀ TÊN', 'NGÀY SINH', 'SỐ GIẤY TỜ TÙY THÂN', 'SỐ ĐIỆN THOẠI LIÊN HỆ', 'Điểm dự thi', 'TRẠNG THÁI', 'ĐƠN VỊ',
            ]
            if(dataEx.length>0){
              this.exportExcelHskService.exportExHuyOrder(dataEx, 'Danh sách hủy dự thi ' + dotthi.title, dotthi.title,header);
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
  selectDataByCheckbox(event){
    if (event.checked === true){
      this.dataSelct = this.listData.filter(f=>f.state !== 1);
    }else {
      this.dataSelct = [];
    }
  }

  huyOrderSelect :HuyOrders;
  viewInfoHuyOrder:boolean = false;
  btnViewInfoHuyOrder(item:HuyOrders){
    this.huyOrderSelect = item;
    this.viewInfoHuyOrder = true;
  }

  async btnDuyethuyduthi(){
    if(this.dataSelct.length>0){
      const html= `
        <p>Xác nhận duyệt yêu cầu hủy dự thi với ${this.dataSelct.length} thí sinh đăng ký hủy dự thi?</p>
      `;
      const head= 'XÁC NHẬN DUYỆT'
      const btn = await this.notifi.confirmRounded(html,head,[BUTTON_NO,BUTTON_YES]);
      if(btn.name === 'yes'){
        const step: number = 100 / this.dataSelct.length;
        this.notifi.isProcessing(true);
        this.notifi.loadingAnimationV2({process:{percent :0}})
        this.loopUpdate(this.dataSelct, 1,step, 0).pipe(switchMap(m=>{
          this.notifi.loadingAnimationV2({process:{percent :0}})
          return this.loopSendEmailDuyet(this.dataSelct,1,step,0);
        })).subscribe({
          next:(data)=>{

            this.notifi.toastSuccess('Thao tác thành công');
            this.notifi.isProcessing(false);
            this.loadData(1);
          },error:()=>{
            this.notifi.toastError('Thao tác không thành công');
            this.notifi.isProcessing(false);

          }
        })
      }
    }else{
      this.notifi.toastError('Chưa có thí sinh được chọn');
    }
  }
  async btnHuyDuyethuyduthi(){
    if(this.dataSelct.length>0){
      const html= `
        <p>Xác nhận huỷ duyệt yêu cầu hủy dự thi với ${this.dataSelct.length} thí sinh đăng ký hủy dự thi?</p>
      `;
      const head= 'XÁC NHẬN DUYỆT'
      const btn = await this.notifi.confirmRounded(html,head,[BUTTON_NO,BUTTON_YES]);
      if(btn.name === 'yes'){
        const step: number = 100 / this.dataSelct.length;
        this.notifi.isProcessing(true);
        this.notifi.loadingAnimationV2({process:{percent :0}})
        this.loopUpdate(this.dataSelct, -1,step, 0).pipe(switchMap(m=>{
          return this.loopSendEmailDuyet(this.dataSelct,-1,step,0);
        })).subscribe({
          next:(data)=>{

            this.notifi.toastSuccess('Thao tác thành công');
            this.notifi.isProcessing(false);
            this.loadData(1);
          },error:()=>{
            this.notifi.toastError('Thao tác không thành công');
            this.notifi.isProcessing(false);

          }
        })
      }
    }else{
      this.notifi.toastError('Chưa có thí sinh được chọn');
    }
  }


  private loopUpdate(data:HuyOrders[],state:number, step: number, percent: number):Observable<HuyOrders[]>{
    const index = data.findIndex(i => !i['isUpdate']);
    if(index !== -1){
      const newPercent: number = percent + step;
      this.notifi.loadingAnimationV2({process: {percent: newPercent}});
      return this.huyOrdersService.update(data[index].id, {state :state}).pipe(switchMap(m=>{
        data[index]['isUpdate'] = true
        return this.loopUpdate(data, state,step, newPercent);
      }))
    }{
      return of(data);
    }

  }

  private loopSendEmailDuyet(data:HuyOrders[],type:number, step: number, percent: number):Observable<any>{
    const index = data.findIndex(i => !i['isSend']);
    if(index !== -1){
      const item = data[index];
      const newPercent: number = percent + step;
      this.notifi.loadingAnimationV2({process: {percent: newPercent}});
      let content=`
        <p><strong>THÔNG BÁO HỦY, ĐỔI ĐỢT THI CỦA THÍ SINH ĐĂNG KÝ BÀI THI TRÊN HỆ THỐNG ĐÁNH GIÁ NĂNG LỰC NGOẠI NGỮ TNU </strong></p>
        <p><strong>I.Thông tin cá nhận </strong></p>
        <table>
            <tr><td style="width:200px;">Họ và tên:</td><td style="width:300px">${item['_hoten']}</td></tr>
            <tr><td style="width:200px;">Số CCCD(hoặc hộ chiếu):</td><td style="width:300px">${item['_cccd_so']}</td></tr>
            <tr><td style="width:200px;">Ngày sinh:</td><td style="width:300px">${item['_ngaysinh']}</td></tr>
            <tr><td style="width:200px;">Số điện thoại:</td><td style="width:300px">${item['_phone']}</td></tr>
        </table>
        <p><strong>I.Thông tin Hủy dự thi </strong></p>
        <table>
            <tr>
               <td style="width:200px">Đợt dự thi:</td><td style="width:300px">${item['_dotthi']}</td>
            </tr>
            <tr>
               <td style="width:200px">Điểm dự thi:</td><td style="width:300px">${item['_capdohsk']}</td>

            </tr>
            <tr>
               <td style="width:200px">Lý do hủy dự thi:</td><td style="width:300px">${item['mota']}</td>
            </tr>
        </table>

      `;
      if(type ===1){
        content  += `
            <p style="color: #0ba50b">Trạng thái :Yêu cầu huỷ dự thi của thí sinh đã được duyệt.</p>
        `;
      }else{
        content  += `
            <p style="color: red">Trạng thái :Yêu cầu huỷ dự thi của thí sinh không được duyệt.</p>
        `;
      }

      const objectEmail:any  = {
        to:item['_email'],
        // to:'longkakainfo@gmail.com',
        message:content,
        title: ' Email thông báo hoãn, hủy dự thi VSTEP-TNU',

      }

      return this.SenderEmailService.sendEmail(objectEmail).pipe(switchMap(m=>{
        data[index]['isSend'] = true;
        return this.loopSendEmailDuyet(data,type, step, newPercent);
      }))
    }{
      return of(data);
    }
  }

  async btnDelete(){
    if(this.dataSelct.length>0){
      const html= `
        <p>Xác nhận xóa với ${this.dataSelct.length} thí sinh đăng ký hủy dự thi?</p>
      `;
      const head= 'XÁC NHẬN XÓA'
      const btn = await this.notifi.confirmRounded(html,head,[BUTTON_NO,BUTTON_YES]);
      if(btn.name === 'yes'){
        const step: number = 100 / this.dataSelct.length;

        this.notifi.loadingAnimationV2({process:{percent :0}})

        this.loopDelete(this.dataSelct,step, 0 ).subscribe({
          next:()=>{
            this.dataSelct = [];
            this.loadInit()
            this.notifi.toastSuccess('Thao tác thành công');
            this.notifi.disableLoadingAnimationV2();

          },error:()=>{
            this.notifi.toastError('Thao tác không thành công');
            this.notifi.disableLoadingAnimationV2();
          }
        })
      }

    }else{
      this.notifi.toastError('Không có bản ghi nào được chọn');
    }
  }


  private loopDelete(data:HuyOrders[], step: number, percent: number):Observable<HuyOrders[]>{
    const index = data.findIndex(i => !i['isDelete']);
    if(index !== -1){
      const newPercent: number = percent + step;
      this.notifi.loadingAnimationV2({process: {percent: newPercent}});
      return this.huyOrdersService.delete(data[index].id).pipe(switchMap(m=>{
        data[index]['isDelete'] = true
        return this.loopDelete(data,step, newPercent);
      }))
    }{
      return of(data);
    }

  }
}
