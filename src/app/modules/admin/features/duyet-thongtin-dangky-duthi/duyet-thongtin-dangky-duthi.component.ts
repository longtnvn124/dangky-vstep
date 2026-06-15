import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Paginator, PaginatorModule} from "primeng/paginator";
import {KeHoachThi, KehoachthiVstepService} from "@shared/services/vstep/kehoachthi-vstep.service";
import {OrdersVstep, VstepOrdersService} from "@shared/services/vstep-orders.service";
import {DonVi} from "@shared/models/danh-muc";
import {filter, forkJoin, Observable, of, Subject, Subscription, switchMap} from "rxjs";
import {NotificationService} from "@core/services/notification.service";
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
import {ThiSinhDangKyThiComponent} from "@modules/admin/features/danh-sach-du-thi/thi-sinh-du-thi/thi-sinh-dang-ky-thi/thi-sinh-dang-ky-thi.component";
import {ThongTinThiSinhComponent} from "@modules/admin/features/danh-sach-du-thi/thi-sinh-du-thi/thong-tin-thi-sinh/thong-tin-thi-sinh.component";
import {TooltipModule} from "primeng/tooltip";
import {NgPaginateEvent} from "@shared/models/ovic-models";
import {SenderEmailService} from "@shared/services/sender-email.service";


@Component({
  selector: 'app-duyet-thongtin-dangky-duthi',
  standalone: true,
  imports: [CommonModule, ButtonModule, CheckboxModule, DropdownModule, InputTextModule, MatMenuModule, MatProgressBarModule, PaginatorModule, RippleModule, SharedModule, SharedModule, TableModule, ThiSinhDangKyThiComponent, ThongTinThiSinhComponent, TooltipModule, SharedModule, SharedModule, SharedModule, SharedModule],
  templateUrl: './duyet-thongtin-dangky-duthi.component.html',
  styleUrls: ['./duyet-thongtin-dangky-duthi.component.css']
})
export class DuyetThongtinDangkyDuthiComponent implements OnInit {
  @ViewChild('formCheck', {static: true}) formCheck: TemplateRef<any>;
  @ViewChild(Paginator) paginator: Paginator;

  isLoading     : boolean = true;
  loadInitFail  : boolean = false;

  dsKehoachthi  : KeHoachThi[];

  recordsTotal  : number = 0 ;
  listData      : OrdersVstep[] = [];
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

  isAdmin:boolean = false;
  isTramThi:boolean =false;

  // Approve view variables
  selectedIndex: number = 0;
  isProcessing: boolean = false;
  approveStatus: { [key: number]: number } = {};

  constructor(

    private ordersService:VstepOrdersService,
    private notifi: NotificationService,
    private kehoachthiVstepService : KehoachthiVstepService,
    private donViService:DonViService,
    private auth: AuthService,
    private senderEmailService: SenderEmailService
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
    this.selectedIndex = 0;
    this.approveStatus = {};

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
          m['__status_converted'] = m.trangthai_thanhtoan ;

          m['__time_thanhtoan'] =m['thoigian_thanhtoan'] ? this.formatSQLDateTime( new Date(m['thoigian_thanhtoan'])):'';
          m['__diemthi_convenrtd'] = this.dataDonvi.length>0 && this.dataDonvi.find(f=>f.id === m.diemduthi_id) ? this.dataDonvi.find(f=>f.id === m.diemduthi_id).title : '';
          m['__ghichu'] = parent && parent['user'] && parent['user']['name'] ? (parent['user']['name'] + ' đăng ký' ):'';
          return m;
        }) : [];

        // Khởi tạo approveStatus
        this.listData.forEach(c => {
          this.approveStatus[c.id] = c.trangthai_duyet;
        });

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
    return `${d}-${m}-${y} ${h}:${min}`;
  }

  paginate({page}: NgPaginateEvent) {
    this.page = page + 1;
    this.loadData(this.page, this.kehoach_id, this.search);
  }

  loadDropdow(event){
    this.kehoach_id = event ? event.id: null;
    this.page = 1;
    this.loadData(this.page, this.kehoach_id, this.search);
  }

  reloadData() {
    this.page = 1;
    this.loadData(this.page, this.kehoach_id, this.search);
  }

  // ----- Approve methods -----
  get currentCandidate(): OrdersVstep {
    return this.listData[this.selectedIndex];
  }

  get totalCandidates(): number {
    return this.listData.length;
  }

  get approvedCount(): number {
    return this.listData.filter(c => this.approveStatus[c.id] === 1).length;
  }

  get rejectedCount(): number {
    return this.listData.filter(c => this.approveStatus[c.id] === -1).length;
  }

  get pendingCount(): number {
    return this.listData.filter(c => this.approveStatus[c.id] === 0).length;
  }

  selectCandidate(index: number) {
    if (index >= 0 && index < this.listData.length) {
      this.selectedIndex = index;
    }
  }

  nextCandidate() {
    if (this.selectedIndex < this.listData.length - 1) {
      this.selectedIndex++;
    }
  }

  prevCandidate() {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    }
  }

  approve() {
    if (!this.currentCandidate) return;
    this.approveStatus[this.currentCandidate.id] = 1;
    this.saveApproveStatus(this.currentCandidate.id, 1);
  }

  reject() {
    if (!this.currentCandidate) return;
    this.approveStatus[this.currentCandidate.id] = -1;
    this.saveApproveStatus(this.currentCandidate.id, -1);
  }

  private saveApproveStatus(orderId: number, trangthai_duyet: number) {
    this.isProcessing = true;
    this.ordersService.update(orderId, {trangthai_duyet: trangthai_duyet}).subscribe({
      next: () => {
        this.isProcessing = false;
        const candidate = this.listData.find(c => c.id === orderId);
        if (candidate) {
          candidate.trangthai_duyet = trangthai_duyet;
        }
        this.notifi.toastSuccess(trangthai_duyet === 1 ? 'Đã duyệt thông tin thí sinh' : 'Đã từ chối duyệt thông tin thí sinh');

        this.sendEmailDuyet(candidate,trangthai_duyet).subscribe({
          next:()=>{
            this.notifi.toastSuccess('Gửi Email thành công');

          },error:()=>{
            this.notifi.toastError('Gửi Email không thành công');
          }
        })

        // setTimeout(() => {
        //   if (this.selectedIndex < this.listData.length - 1) {
        //     this.nextCandidate();
        //   }
        // }, 300);
      },
      error: () => {
        this.isProcessing = false;
        this.notifi.toastError('Cập nhật trạng thái duyệt không thành công');
        this.approveStatus[orderId] = this.listData.find(c => c.id === orderId)?.trangthai_duyet || 0;
      }
    });
  }

  getStatusLabel(status: number): string {
    switch (status) {
      case 1: return 'Đã duyệt';
      case -1: return 'Không duyệt';
      default: return 'Chờ duyệt';
    }
  }

  getStatusClass(status: number): string {
    switch (status) {
      case 1: return 'status-approved';
      case -1: return 'status-rejected';
      default: return 'status-pending';
    }
  }



  private sendEmailDuyet(order:OrdersVstep, trangthai_duyet:number):Observable<any> {

    let message = `

        <p>Bạn đã đăng ký thi Vstep Đại học Thái Nguyên (TNU-VSTEP):</p>

        <p style="font-weight:700;">THÔNG TIN THÍ SINH:</p>
        <table width="100%" style="border:0;">
            <tr>
                <td style="width:250px;">Họ và tên:</td>
                <td style="font-weight:600">${order['thisinh']['hoten']}</td>
            </tr>
            <tr>
                <td style="width:250px;">CCCD (Hoặc hộ chiếu):</td>
                <td style="font-weight:600">${order['thisinh']['cccd_so']}</td>
            </tr>
             <tr>
                <td style="width:250px;">Số điện thoại:</td>
                <td style="font-weight:600">${order['thisinh']['phone']}</td>
            </tr>
            <tr>
                <td style="width:250px;">Email:</td>
                <td style="font-weight:600">${order['thisinh']['email']}</td>
            </tr>
        </table>

        <p>THÔNG TIN ĐĂNG KÝ</p>
        <table style=" border: 1px solid black;border-collapse: collapse;">
          <tr style="border: 1px solid black;border-collapse: collapse;">
            <th style="border: 1px solid black;border-collapse: collapse;text-align:left;" width="100px"><strong>Đợt thi</strong></th>
            <th style="border: 1px solid black;border-collapse: collapse;text-align:left;" >${order['__dotthi_coverted']}</th>

          </tr>
          <tr style="border: 1px solid black;border-collapse: collapse;">
            <th style="border: 1px solid black;border-collapse: collapse;text-align:left;" width="100px"><strong>Cấp thi</strong></th>
            <th style="border: 1px solid black;border-collapse: collapse;text-align:left;" >${order['__capthi']}</th>

          </tr>
          <tr style="border: 1px solid black;border-collapse: collapse;">
            <th style="border: 1px solid black;border-collapse: collapse;text-align:left;" width="100"><strong>Điểm dự thi</strong></th>
            <th style="border: 1px solid black;border-collapse: collapse;text-align:left;" >${order['__diemthi_convenrtd']}</th>

          </tr>
          <tr style="border: 1px solid black;border-collapse: collapse;">
            <th style="border: 1px solid black;border-collapse: collapse;text-align:left;" width="100px"><strong>Lệ phí thi</strong></th>
            <th style="border: 1px solid black;border-collapse: collapse;text-align:right;" >${parseInt(String(order.lephithi)).toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})}</th>
          </tr>


    `;
    // <td style="border: 1px solid black;border-collapse: collapse;">${this.dmCapdos.find(f => f.id === order.diemduthi_id) ? this.dmCapdos.find(f => f.id === order.diemduthi_id).title : ''}</td>

    message += `
    </table>
    `;

    if(trangthai_duyet == 1 ){
      message += ` <p style="color:#0ba50b;"><strong> Thông tin sinh viên của ĐHTN của Thí sinh đã được xác nhận</strong></p>
        <p style="color: #ce3b04;">- Trạng thái thanh toán: Chưa thanh toán.</p>
        <p>- Bạn vui lòng thanh toán lệ phí thi để hoàn tất quá trình đăng ký .</p>
        `;
    }else{
      message += ` <p style="color:red;"><strong> Thông tin sinh viên của ĐHTN của Thí sinh không khớp với dữ liệu sinh viên </strong></p>`;
    }

    const emailsend: any = {
      to: order['thisinh']['email'],
      // to: 'longkakainfo@gmail.com',
      title: ' Email Xác nhận thông tin đăng ký dự thi',
      message: message
    }
    // this.notifi.isProcessing(true)
    return this.senderEmailService.sendEmail(emailsend)
  }

}
