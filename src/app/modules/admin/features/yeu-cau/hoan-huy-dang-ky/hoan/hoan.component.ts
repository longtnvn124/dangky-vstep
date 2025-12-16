import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Paginator} from "primeng/paginator";
import {DmCapdo} from "@shared/models/danh-muc";
import {HskKehoachThiService, KeHoachThi} from "@shared/services/hsk-kehoach-thi.service";
import {HskOrdersService} from "@shared/services/hsk-orders.service";
import {NgPaginateEvent, OvicTableStructure} from "@shared/models/ovic-models";
import {debounceTime, forkJoin, Observable, of, Subject, Subscription, switchMap} from "rxjs";
import {ThemeSettingsService} from "@core/services/theme-settings.service";
import {DanhMucCapDoService} from "@shared/services/danh-muc-cap-do.service";
import {NotificationService} from "@core/services/notification.service";
import {ExportThiSinhDuThiService} from "@shared/services/export-thi-sinh-du-thi.service";
import {HskHuyOrder, HskHuyOrderService} from "@shared/services/hsk-huy-order.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {catchError, filter} from "rxjs/operators";
import {BUTTON_NO, BUTTON_YES} from "@core/models/buttons";
import {WAITING_POPUP} from "@shared/utils/syscat";
import {ExportExcelHskService} from "@shared/services/export-excel-hsk.service";
import {SenderEmailService} from "@shared/services/sender-email.service";

@Component({
  selector: 'app-hoan',
  templateUrl: './hoan.component.html',
  styleUrls: ['./hoan.component.css']
})
export class HoanComponent implements OnInit {
  @ViewChild('templateWaiting') templateWaiting: ElementRef;
  @ViewChild(Paginator) paginator: Paginator;

  isLoading: boolean = true;
  loadInitFail: boolean = false;

  dsCapdo: DmCapdo[];
  dsKehoachthi: KeHoachThi[];

  recordsTotal: number;
  listData: HskHuyOrder[];
  dataSelct: HskHuyOrder[] = [];
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

  constructor(
    private themeSettingsService: ThemeSettingsService,
    private ordersService: HskOrdersService,
    private notifi: NotificationService,
    private danhMucCapDoService:DanhMucCapDoService,
    private hskKehoachThiService : HskKehoachThiService,
    private modalService: NgbModal,
    private exportThiSinhDuThiService: ExportThiSinhDuThiService,
    private hskHuyOrderService: HskHuyOrderService,
    private exportExcelHskService :ExportExcelHskService,
    private SenderEmailService :SenderEmailService,
  ) {

    const observeProcessCloseForm = this.notifi.onSideNavigationMenuClosed().pipe(filter(menuName => menuName === this.menuName && this.needUpdate)).subscribe(() => this.loadData(this.page));
    this.subscription.add(observeProcessCloseForm);
    const observerOnResize = this.notifi.observeScreenSize.subscribe(size => this.sizeFullWidth = size.width)
    this.subscription.add(observerOnResize);
  }

  ngOnInit(): void {
    // console.log('huy');
    this.inputChanged.pipe(debounceTime(1000)).subscribe((item: string) => {
      this.searchContentByInput(item);
    });
    this.loadInit();
  }
  loadInit() {
    forkJoin<[DmCapdo[], KeHoachThi[]]>([
        this.danhMucCapDoService.getDataUnlimitNotStatus(),
        this.hskKehoachThiService.getDataUnlimitNotstatus()
      ]).subscribe({
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

  loadData(page: number, kehoach_id?: number, search?: string) {
    this.selectDataByCheckbox({checker:false});
    this.isLoading = true;
    const limit = this.themeSettingsService.settings.rows;
    this.index = (page * limit) - limit + 1;
    this.notifi.isProcessing(true);
    this.hskHuyOrderService.getDataByPageAnd(page, this.search, this.kehoach_id, this.caphsk_id_select, 'change').subscribe(
      {
        next: ({data, recordsTotal}) => {
          this.recordsTotal = recordsTotal;
          this.listData = data.length > 0 ? data.map((m, index) => {
            const thisinh = m['thisinh'];
            const parent = m['parent'];
            m['_indexTable'] = (page - 1) * 10 + (index + 1);
            m['_hoten'] = m.hoten;
            m['_dotthi'] = this.dsKehoachthi.find(f => f.id === m.kehoach_id) ? this.dsKehoachthi.find(f => f.id === m.kehoach_id).dotthi : '';
            m['_capdohsk'] = this.dsCapdo.find(f => f.id === m.caphsk_id) ? this.dsCapdo.find(f => f.id === m.caphsk_id).title : '';
            m['_email'] = thisinh && thisinh['email'] ? thisinh['email'] : '';
            m['_phone'] = thisinh && thisinh['phone'] ? thisinh['phone'] : '';
            m['_cccd_so'] = thisinh && thisinh['cccd_so'] ? thisinh['cccd_so'] : '';
            m['_ngaysinh'] = thisinh && thisinh['ngaysinh'] ? thisinh['ngaysinh'] : '';
            m['_status'] = m.state;
            // m['_status'] = -1;
            m['_ghichu'] = parent && parent['user']['name'] ? parent['user']['name'] : 'Thí sinh tự đăng ký'
            return m;
          }) : [];

          this.isLoading = false;
          this.notifi.isProcessing(false);
        },
        error: (err) => {
          this.isLoading = false;
          this.notifi.isProcessing(false);
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
    // console.log(event)
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
  btnExportExcelHskHuyDk() {
    if (this.kehoach_id) {
      const dotthi = this.dsKehoachthi.find(f => f.id == this.kehoach_id);
      this.hskHuyOrderService.getDataUnlimitByKehoachIdAndCapHsk(this.kehoach_id, this.caphsk_id_select,'change').subscribe(
        {
          next: ({data, recordsTotal}) => {
            this.recordsTotal = recordsTotal;
            const dataEx = data.length > 0 ? data.map((m, index) => {
              const thisinh = m['thisinh'];
              const parent = m['parent'];
              m['_indexTable'] = (index + 1);
              m['_hoten'] = m.hoten;
              m['_dotthi'] = this.dsKehoachthi.find(f => f.id === m.kehoach_id) ? this.dsKehoachthi.find(f => f.id === m.kehoach_id).dotthi : '';
              m['_capdohsk'] = this.dsCapdo.find(f => f.id === m.caphsk_id) ? this.dsCapdo.find(f => f.id === m.caphsk_id).title : '';
              m['_email'] = thisinh && thisinh['email'] ? thisinh['email'] : '';
              m['_phone'] = thisinh && thisinh['phone'] ? thisinh['phone'] : '';
              m['_cccd_so'] = thisinh && thisinh['cccd_so'] ? thisinh['cccd_so'] : '';
              m['_ngaysinh'] = thisinh && thisinh['ngaysinh'] ? thisinh['ngaysinh'] : '';

              m['_status'] = m.state === 1?'Đã duyệt': (m.state === -1 ? 'Huyẻ duyệt' : (m.state === 0 ? 'Chờ duyệt':''));
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
              this.exportExcelHskService.exportExHuyOrder(dataEx, 'ĐĂNG KÝ HỦY DỰ THI THI HSK(K) ĐỢT THI NGÀY ' + dotthi.dotthi, dotthi.dotthi,header);
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
      // console.log(this.listData);
      this.dataSelct = this.listData.filter(f=>f.state !== 1);
    }else {
      this.dataSelct = [];
    }
  }

  hskHuyOrderSelect :HskHuyOrder;
  viewInfoHuyOrder:boolean = false;
  btnViewInfoHuyOrder(item:HskHuyOrder){
    // console.log(item);
    this.hskHuyOrderSelect = item;
    this.viewInfoHuyOrder = true;
  }

  async btnDuyetdoidotthi(){
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
        this.loopActiveChangeDotthiByApi(this.dataSelct,step, 0).subscribe({
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
  async btnHuyDuyetdoidotthi(){
    if(this.dataSelct.length>0){
      const html= `
        <p>Xác nhận huỷ duyệt yêu cầu đổi đợt dự thi với ${this.dataSelct.length} thí sinh đăng ký đổi đợt dự thi?</p>
      `;
      const head= 'XÁC NHẬN HỦY PHÊ DUYỆT'
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


  private loopUpdate(data:HskHuyOrder[],state:number, step: number, percent: number):Observable<HskHuyOrder[]>{
    const index = data.findIndex(i => !i['isUpdate']);
    if(index !== -1){
      const newPercent: number = percent + step;
      this.notifi.loadingAnimationV2({process: {percent: newPercent}});
      return this.hskHuyOrderService.update(data[index].id, {state :state}).pipe(switchMap(m=>{
        data[index]['isUpdate'] = true
        return this.loopUpdate(data, state,step, newPercent);
      }))
    }{
      return of(data);
    }

  }
  private loopSendEmailDuyet(data:HskHuyOrder[],type:number, step: number, percent: number):Observable<any>{
    const index = data.findIndex(i => !i['isSend']);
    if(index !== -1){
      const item = data[index];
      const newPercent: number = percent + step;
      this.notifi.loadingAnimationV2({process: {percent: newPercent}});
      let content=`
        <p><strong>THÔNG BÁO HỦY, ĐỔI ĐỢT THI CỦA THÍ SINH ĐĂNG KÝ BÀI THI HSK TRÊN MÁY TÍNH CỦA ĐẠI HỌC THÁI NGUYÊN (TNU): </strong></p>
        <p><strong>I.Thông tin cá nhận </strong></p>
        <table>
            <tr><td style="width:200px">Họ và tên:</td><td style="width:300px">${item['_hoten']}</td></tr>
            <tr><td style="width:200px">Số CCCD(hoặc hộ chiếu):</td><td style="width:300px">${item['_cccd_so']}</td></tr>
            <tr><td style="width:200px">Ngày sinh:</td><td style="width:300px">${item['_ngaysinh']}</td></tr>
            <tr><td style="width:200px">Số điện thoại:</td><td style="width:300px">${item['_phone']}</td></tr>
        </table>
        <p><strong>I.Thông tin Đột đợt thi dự thi </strong></p>
        <table>
            <tr>
               <td style="width:200px">Cấp HSK:</td><td style="width:300px">${item['_capdohsk']}</td>
            </tr>
            <tr>
               <td style="width:200px">Lý do hủy dự thi:</td><td style="width:300px">${item['mota']}</td>
            </tr>
        </table>

        <table style="border-collapse: collapse;">
            <tr>
                <th style="width:50px;text-align: center;border:1px solid #ccc">STT</th>
                <th style="width:160px;text-align: center;border:1px solid #ccc">Đợt thi cũ</th>
                <th style="width:160px;text-align: center;border:1px solid #ccc">Đợt thi mới</th>
            </tr>

            <tr>
                <td style="text-align:center;border:1px solid #ccc;">1</td>
                <td style="text-align:center;border:1px solid #ccc;">${this.reNameKehoachByid(item.content['kehoanh_thi_cu'])}</td>
                <td style="text-align:center;border:1px solid #ccc;">${this.reNameKehoachByid(item.content['kehoanh_thi_moi'])}</td>
            </tr>
        </table>

      `;
      if(type ===1){
        content  += `
            <p style="color: #0ba50b">Trạng thái :Yêu cầu Đổi đợt dự thi của thí sinh đã được phê duyệt.</p>
        `;
      }else{
        content  += `
            <p style="color: red">Trạng thái :Yêu cầu đổi đợt dự thi của thí sinh không được phê duyệt.</p>
        `;
      }

      const objectEmail:any  = {
        to:item['_email'],
        // to:'longkakainfo@gmail.com',
        message:content,
        title: ' Email thông báo hoãn, hủy dự thi HSK',

      }

      return this.SenderEmailService.sendEmail(objectEmail).pipe(switchMap(m=>{
        data[index]['isSend'] = true;
        return this.loopSendEmailDuyet(data,type, step, newPercent);
      }))
    }{
      return of(data);
    }
  }


  private  loopActiveChangeDotthiByApi(data: HskHuyOrder[],step:number,percent: number):Observable<HskHuyOrder[]>{
    const index = data.findIndex(i => !i['isChange']);
    if(index !== -1){
      const item = data[index];
      const newPercent: number = percent + step;
      this.notifi.loadingAnimationV2({process: {percent: newPercent}});

      return  this.hskHuyOrderService.ActiveChangeDotthi(item.id).pipe(switchMap(m=>{
        data[index]['isChange'] = true;
        return this.loopActiveChangeDotthiByApi(data,step,newPercent);
      }))

    }else{
      return  of(data)
    }
  }


  reNameKehoachByid(id:number){
    return this.dsKehoachthi.find(f=>f.id === id) ? this.dsKehoachthi.find(f=>f.id === id).dotthi : '';
  }
}
