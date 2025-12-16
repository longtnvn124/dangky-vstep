import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ThisinhInfoService} from "@shared/services/thisinh-info.service";
import {forkJoin, of, switchMap} from "rxjs";
import {AuthService} from "@core/services/auth.service";
import {ThiSinhInfo} from "@shared/models/thi-sinh";
import {DmCapdo} from "@shared/models/danh-muc";
import {NotificationService} from "@core/services/notification.service";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {SenderEmailService} from "@shared/services/sender-email.service";
import {HelperService} from "@core/services/helper.service";

import {HskKehoachThiService, KeHoachThi} from "@shared/services/hsk-kehoach-thi.service";
import {HskOrdersService, OrdersHsk} from "@shared/services/hsk-orders.service";
import {DanhMucCapDoService} from "@shared/services/danh-muc-cap-do.service";
import {BUTTON_NO, BUTTON_YES} from "@core/models/buttons";
import {User} from "@core/models/user";
import {HskKehoachCapdo, KehoachthiCapdoService} from "@shared/services/kehoachthi-capdo.service";
import {getDateTime} from "@env";
import {DateTimeServer, ServerTimeService} from "@shared/services/server-time.service";
import {HskHuyOrder, HskHuyOrderService} from "@shared/services/hsk-huy-order.service";

export interface SumMonThi {
  caphsk_id: string,
  total: number,
}


@Component({
  selector: 'app-thi-sinh-dang-ky',
  templateUrl: './thi-sinh-dang-ky.component.html',
  styleUrls: ['./thi-sinh-dang-ky.component.css']
})
export class ThiSinhDangKyComponent implements OnInit {
  @ViewChild('dataToExport', {static: true}) dataToExport: ElementRef;
  ngType: 1 | 0 | -1 = 0;//0: form,1:thanh toasn thanh coong, -1:chờ thanh toán,
  isLoading: boolean = true;
  loadInitFail = false;
  dotthi_id_select: number = 0;
  userInfo: ThiSinhInfo;
  dmCapdos: DmCapdo[];
  keHoachThi: KeHoachThi[];
  keHoachThi_dangky: KeHoachThi[];
  private _user_id: number;
  formSave: FormGroup;
  formHuyOrder: FormGroup;
  totalDangkyCapdo: SumMonThi[];
  dataOrders: OrdersHsk[];
  listStyle = [
    {
      value: 1,
      title: '<div class="thanh-toan-check true text-center"><div></div><label>Đã thanh toán</label></div>',
    },
    {
      value: 0,
      title: '<div class="thanh-toan-check false text-center"><div></div><label>Chưa thanh toán</label></div>',
    },
    {
      value: -1,
      title: '<div class="thanh-toan-check check text-center"><div></div><label>Đã thanh toán, chờ duyệt</label></div>',
    },
    {
      value: 2,
      title: '<div class="thanh-toan-check check text-center"><div></div><label>Chờ thanh toán</label></div>',
    }
  ]
  // viewThongbaoUpdate:boolean =false;


  displayModal: boolean = false;
  data_Kehoachthi_change: KeHoachThi[];
  orderSelect: OrdersHsk;
  check_change_dothi: -1 | 1 | 2 | 0 | 3 = -1;//0:loadding, 1:true,2:false;-1:hiden 3:đã tồn tại
  change_kehoachthi_id: number = 0;
  dateTimeService: DateTimeServer;

  constructor(
    private thisinhInfoService: ThisinhInfoService,
    private hskKehoachThiService: HskKehoachThiService,
    private auth: AuthService,
    private notifi: NotificationService,
    private fb: FormBuilder,
    private ordersService: HskOrdersService,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private senderEmailService: SenderEmailService,
    private helperService: HelperService,
    private danhMucCapDoService: DanhMucCapDoService,
    private kehoachthiCapdoService: KehoachthiCapdoService,
    private serverTimeService: ServerTimeService,
    private hskHuyOrderService: HskHuyOrderService
  ) {
    this._user_id = this.auth.user.id;
    this.formSave = this.fb.group({
      user_id: [null, Validators.required],
      kehoach_id: [null, Validators.required],
      caphsk_id: [null, Validators.required],
    })

    this.formHuyOrder = this.fb.group({
      user_id: [null, Validators.required],
      kehoach_id: [null, Validators.required],
      caphsk_id: [null, Validators.required],
      order_id: [null, Validators.required],
      hoten: ['', Validators.required],
      mota: ['', Validators.required],
      files: [null],
      minhchung: [null]
    })
  }


  get formHuy(): { [key: string]: AbstractControl<any> } {
    return this.formHuyOrder.controls;
  }

  ngOnInit(): void {

    this.activeRouter.queryParams.subscribe(params => {
      const queryString = this.createQueryString(params);
      if (queryString) {
        this.checkCodeParram('?' + queryString);
      }
    });
    this.loadInit();
  }

  createQueryString(params: any): string {
    let queryString = '';
    Object.keys(params).forEach(key => {
      if (queryString !== '') {
        queryString += '&';
      }
      queryString += `${key}=${encodeURIComponent(params[key])}`;
    });
    return queryString;
  }

  loadInit() {
    // viewThongbaoUpdate
    this.dotthi_id_select = 0;
    // this.viewThongbaoUpdate= true;
    this.getDataDanhMuc();
  }

  getDataOrder() {
    this.ordersService.getdata(this.auth.user.id).subscribe({
      next: (data) => {
        let i = 1;
        this.dataOrders = data.map(m => {

          m['_indexTable'] = i++;
          m['__kehoach_thi'] = this.keHoachThi && this.keHoachThi.find(f => f.id === m.kehoach_id).dotthi ? this.keHoachThi.find(f => f.id === m.kehoach_id).dotthi : '';
          m['__kehoach_thi_status'] = this.keHoachThi && this.keHoachThi.find(f => f.id === m.kehoach_id) ? this.keHoachThi.find(f => f.id === m.kehoach_id).status : 0;
          m['__lephithi_covered'] = m.lephithi;
          const parent = m['parent'];

          const _trangthai: number = parent ? parent.trangthai_thanhtoan : m.trangthai_thanhtoan;
          m['__trangthai_thanhtoan'] = _trangthai;
          m['__status_converted'] = _trangthai === 1 ? this.listStyle.find(f => f.value === 1).title : (_trangthai === 0 ? this.listStyle.find(f => f.value === 0).title : (_trangthai === 2 ? this.listStyle.find(f => f.value === 2).title : ''));
          m['__capdo_covered'] = this.dmCapdos && this.dmCapdos.length > 0 ? (this.dmCapdos.find(f => f.id === m.caphsk_id) ? this.dmCapdos.find(f => f.id === m.caphsk_id).title : '') : ' ';
          m['__have_parent'] = m.parent_id !== 0 ? true : false;
          const userParent = parent ? parent['user'] : null;
          m['__ghichu'] = userParent ? userParent['name'] + ' đăng ký ' : '';
          m['__hoten'] = m['user'] && m['user']['name'] ? m['user']['name'] : '';
          return m;
        });
        this.notifi.isProcessing(false);
        // console.log(this.dataOrders);
      },
      error: () => {
        this.notifi.isProcessing(false);
        this.notifi.toastError('Không load được dữ liệu');
      }
    })
  }

  getDataDanhMuc() {
    this.isLoading = true;
    this.notifi.isProcessing(true);
    forkJoin<[DmCapdo[], ThiSinhInfo, KeHoachThi[], DateTimeServer]>(
      [

        this.danhMucCapDoService.getDataUnlimit(),
        this.thisinhInfoService.getUserInfo(this._user_id),
        this.hskKehoachThiService.getDataUnlimitNotstatus(),
        this.serverTimeService.getTime()
      ]
    ).subscribe({
      next: ([dmCapdo, thisinhInfo, keHoachThi, dateTimeService]) => {
        this.dateTimeService = dateTimeService;
        this.userInfo = thisinhInfo;
        this.dmCapdos = dmCapdo.map((m, index) => {
          m['__index'] = index + 1;
          return m;
        });
        const curentDate = new Date();

        const kehoachthiParam = keHoachThi.map(m => {
          m['_name_convertd'] = m.dotthi + ' (' + this.strToTime(m.ngaybatdau) + ' - ' + this.strToTime(m.ngayketthuc) + ')';
          return m;
        })

        this.keHoachThi = keHoachThi;
        this.keHoachThi_dangky = keHoachThi.filter(f => f.status === 1 && (this.helperService.formatSQLDate(new Date(f.ngayketthuc))) >= this.helperService.formatSQLDate(curentDate));
        if (this.userInfo) {
          if (this.userInfo.anh_chandung && this.userInfo.cccd_img_truoc && this.userInfo.cccd_img_sau) {
            this.getDataOrder();
          }
        }
        // this.getDataOrder();
        this.notifi.isProcessing(false);
        this.isLoading = false;

      }, error: () => {
        this.notifi.toastError('Mất kết nối với máy chủ');
        this.notifi.isProcessing(false);
        this.isLoading = false;

      }
    })
  }

  strToTime(input: string): string {
    const date = input ? new Date(input) : null;
    let result = '';
    if (date) {
      result += [date.getDate().toString().padStart(2, '0'), (date.getMonth() + 1).toString().padStart(2, '0'), date.getFullYear().toString()].join('/');
      // result += ' ' + [date.getHours().toString().padStart(2, '0'), date.getMinutes().toString().padStart(2, '0')].join(':');
    }
    return result;
  }

  resetForm() {
    this.formSave.reset({
      user_id: this.auth.user.id,
      kehoach_id: null,
      caphsk_id: null,
    })
  }

  get f(): { [key: string]: AbstractControl<any> } {
    return this.formSave.controls;
  }

  get g(): { [key: string]: AbstractControl<any> } {
    return this.formHuyOrder.controls;
  }


  SaveForm() {
    this.isLoading = true;
    this.f['caphsk_id'].setValue(this.capdo_id_select);
    const kehoachid = this.f['kehoach_id'].value;
    this.f['user_id'].setValue(this.auth.user.id);
    if (this.formSave.valid) {
      const check = this.dataOrders.find(f => f.caphsk_id === this.capdo_id_select && f.kehoach_id === kehoachid);
      if (this.capdo_id_select !== 0) {
        if (!check) {
          const formUp: FormGroup = this.fb.group({
            thisinh_id: this.userInfo ? this.userInfo.id : 0,
            kehoach_id: kehoachid,
            mota: '',
            lephithi: null,
            status: null,
            caphsk_id: null,
            user_id: this.auth.user.id
          });
          formUp.reset({
            thisinh_id: this.userInfo ? this.userInfo.id : 0,
            kehoach_id: kehoachid,
            mota: '',
            lephithi: this.dmCapdos.find(f => f.id === this.capdo_id_select).gia,
            status: 1,
            caphsk_id: this.capdo_id_select,
            user_id: this.auth.user.id

          });
          this.notifi.isProcessing(true);
          this.ordersService.create(formUp.value).subscribe({
            next: async (id) => {
              const order = {
                id: id,
                thisinh_id: this.userInfo ? this.userInfo.id : 0,
                user_id: this.auth.user.id,
                kehoach_id: kehoachid,
                mota: '',
                lephithi: this.dmCapdos.find(f => f.id === this.capdo_id_select).gia,
                status: 1,
                caphsk_id: this.f['caphsk_id'].value,
              }
              this.notifi.isProcessing(false);
              this.notifi.toastSuccess('Thí sinh đăng ký thành công');
              this.sendEmail(this.auth.user, order);
              this.loadInit();
              this.resetForm();
              this.isLoading = false;
            },
            error: () => {
              this.isLoading = false;
              this.notifi.toastError('Thí sinh đăng ký thất bại');
              this.notifi.isProcessing(false);
            }
          })
        } else {
          this.notifi.toastError('Cấp độ HSK đã được đăng ký, vui lòng kiểm tra lại.');
          this.isLoading = false;

        }
      } else {
        this.notifi.toastError('Bạn chưa chọn cấp độ HSK');
        this.isLoading = false;

      }
    } else {
      this.notifi.toastError('Vui lòng chọn đủ thông tin');
      this.isLoading = false;
    }
  }

  getPayment(item: OrdersHsk) {
    const kehoachSelect = this.keHoachThi.find(f => f.id === item.kehoach_id)
    if (item.parent_id === 0) {
      if (kehoachSelect.status === 1) {
        this.isLoading = true;
        if (this.helperService.formatSQLDate(new Date()) <= this.helperService.formatSQLDate(new Date(kehoachSelect.ngayketthuc))) {
          const fullUrl: string = `${location.origin}${this.router.serializeUrl(this.router.createUrlTree(['admin/thi-sinh/dang-ky/']))}`;

          const content = 'HSK' + item.id + '-' + item['__kehoach_thi'];
          this.ordersService.getPayment(item.id, fullUrl, content).subscribe({
            next: (res) => {
              window.location.assign(res['data']);
              this.ngType = 0;
              this.notifi.isProcessing(false);
              this.isLoading = false;
              // this.notifi.toastWarning(res['message']);

            }, error: (err) => {
              this.isLoading = false;
              this.notifi.isProcessing(false);
              this.notifi.toastWarning(err['error']['message']);
            }
          })
        } else {
          this.isLoading = false;
          this.notifi.toastError('Đã hết thời hạn đăng ký môn trong đợt thi này');
        }
      } else {
        this.notifi.toastWarning('Đã hết thời hạn đăng ký môn trong đợt thi này');
      }
    } else {
      this.notifi.toastError('Vui lòng không thực hiện thao tác này');
    }

  }

  checkCodeParram(text: string) {
    this.notifi.isProcessing(true);
    this.ordersService.checkPaymentByUser(text).subscribe({
      next: () => {
        this.ngType = 1;
        this.notifi.isProcessing(false);
      },
      error: () => {
        this.ngType = -1;
        this.notifi.isProcessing(false);
        this.notifi.toastError('Bạn chưa thanh toán!');
      },
    })
  }

  btnchecksite() {
    this.ngType = 0;
    this.router.navigate(['admin/thi-sinh/dang-ky/']);
    this.loadInit();
  }

  returnInfo() {
    this.router.navigate(['admin/thi-sinh/thong-tin/']);
  }

  async deleteRow(item: OrdersHsk) {
    if (item.parent_id == 0) {
      const confirm = await this.notifi.confirmDelete();
      if (confirm) {
        this.ordersService.delete(item.id).subscribe({
          next: () => {
            this.getDataOrder();
            this.notifi.isProcessing(false);
            this.notifi.toastSuccess('Thao tác thành công');
          }, error: () => {
            this.notifi.isProcessing(false);
            this.notifi.toastError('Thao tác không thành công');
          }
        })
      }
    } else {
      this.notifi.toastError('Thao tác này không được thực hiện');
    }

  }

  dataCapdoSelect: HskKehoachCapdo[] = [];

  selectDothi(item: KeHoachThi) {
    this.dotthi_id_select = item.id;
    this.f['kehoach_id'].setValue(this.dotthi_id_select);
    this.notifi.isProcessing(true);

    forkJoin([
      this.kehoachthiCapdoService.getDataUnlimitAndKehoachId(item.id),
      this.ordersService.getDataMonSelect(item.id)
    ]).subscribe({
      next: ([kh_capdo, sum]) => {
        this.totalDangkyCapdo = sum;
        this.dataCapdoSelect = kh_capdo.length > 0 ? kh_capdo.map(m => {
          const check = sum.find(t => parseInt(t.caphsk_id) === m.caphsk_id) ? this.totalDangkyCapdo.find(t => parseInt(t.caphsk_id) === m.caphsk_id).total : 0;
          const total_remaining = (m.soluong - check) < 0 ? 0 : (m.soluong - check);
          m['_total_dangky'] = total_remaining;
          const checkName = this.dmCapdos.find(f => f.id === m.caphsk_id)
          m['__tenmon_coverted'] = (checkName ? checkName.title : 'Cấp độ') + ' [' + total_remaining + ']';
          return m;
        }).filter(f => f['_total_dangky'] > 0) : [];
        this.notifi.isProcessing(false);

      }, error: () => {
        this.notifi.isProcessing(false);

      }
    })
  }


  sendEmail(user: User, order) {

    let message = `

        <p>Bạn đã đăng ký thi Bài thi đánh giá năng lực tiếng trung HSK trên máy tính của Đại học Thái Nguyên (TNU-HSK):</p>

        <p style="font-weight:700;">THÔNG TIN ĐĂNG KÝ:</p>
        <table width="100%" style="border:0;">
            <tr>
                <td style="width:250px;">Họ và tên:</td>
                <td style="font-weight:600">${user.display_name}</td>
            </tr>
            <tr>
                <td style="width:250px;">CCCD (Hoặc hộ chiếu):</td>
                <td style="font-weight:600">${user.username}</td>
            </tr>
        </table>

        <p>CẤP ĐỘ ĐĂNG KÝ</p>
        <table style=" border: 1px solid black;border-collapse: collapse;">
          <tr style="border: 1px solid black;border-collapse: collapse;">
            <th style="border: 1px solid black;border-collapse: collapse;text-align:center;" width="50px"><strong>STT</strong></th>
            <th style="border: 1px solid black;border-collapse: collapse;text-align:center;" width="150px"><strong>CẤP ĐỘ</strong></th>
            <th style="border: 1px solid black;border-collapse: collapse;text-align:center;" width="150px"><strong>Đơn giá </strong></th>
          </tr>
          <tr style="border: 1px solid black;border-collapse: collapse;">
        <td style="border: 1px solid black;border-collapse: collapse; text-align:center;">${1}</td>
        <td style="border: 1px solid black;border-collapse: collapse;">${this.dmCapdos.find(f => f.id === order.caphsk_id) ? this.dmCapdos.find(f => f.id === order.caphsk_id).title : ''}</td>
        <td style="border: 1px solid black;border-collapse: collapse; text-align:right;">${parseInt(String(order.lephithi)).toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND'
    })}</td>
      </tr>
    `;

    message += `
    </table>
    <p style="color: #ce3b04;">- Trạng thái thanh toán: Chưa thanh toán.</p>
    <p>- Bạn vui lòng thanh toán lệ phí thi để hoàn tất quá trình đăng ký .</p>
`;
    const emailsend: any = {
      to: this.auth.user.email,
      title: ' Email thông báo đăng ký thành công',
      message: message
    }
    this.notifi.isProcessing(true)
    this.senderEmailService.sendEmail(emailsend).subscribe({
      next: () => {
        this.notifi.isProcessing(false)
        this.notifi.toastSuccess("Hệ thống gửi Email đăng ký thi thành công.");
      }, error: () => {
        this.notifi.isProcessing(false)
        this.notifi.toastError('Hệ thống gửi Email đăng ký không thành công');
      }
    })
  }


  capdo_id_select: number = 0;

  selectCapdoOfDmCapDo(item: HskKehoachCapdo) {
    this.capdo_id_select = item.caphsk_id;

  }

  listOrderHuyChange: HskHuyOrder[];

  //
  btnChangeDotthi(item: OrdersHsk) {
    // this.helperService.formatSQLDate(new Date(f.ngayketthuc))) >= this.helperService.formatSQLDate(curentDate)
    const kehoachByOrder = this.keHoachThi.find(f => f.id == item.kehoach_id);
    if (kehoachByOrder && kehoachByOrder.status === 1) {
      const datekehoach = new Date(kehoachByOrder.ngayketthuc);

      this.notifi.isProcessing(false);
      const dateSeverGet = new Date(this.dateTimeService.date)
      if (new Date(this.helperService.formatSQLDate(datekehoach)) >= new Date(this.helperService.formatSQLDate(dateSeverGet))) {
        this.hskHuyOrderService.getDataByOrderIdAndType(item.id, 'change').subscribe({
          next: (data) => {
            this.listOrderHuyChange = data;
            this.check_change_dothi = -1;
            this.change_kehoachthi_id = 0;
            this.displayModal = true;
            this.orderSelect = item;
            this.data_Kehoachthi_change = this.keHoachThi_dangky.filter(f => f.id !== item.kehoach_id)

            this.formHuyOrder.reset({
              user_id: this.auth.user.id,
              kehoach_id: item.kehoach_id,
              caphsk_id: item.caphsk_id,
              order_id: item.id,
              hoten: item['__hoten'],
              mota: '',
              files: null,
              minhchung: null
            })
          }, error: () => {
            this.notifi.toastError('Load dữ liệu không thành công');
          }
        })
      } else {
        this.notifi.toastError('Đã hết thời gian đổi đợt thi')
      }

    } else {
      this.notifi.toastError('Hệ thống đã đóng chức năng đổi đợt thi');
    }
  }

  btnHuyDangkyOrder() {

  }

  onchangeSelectDothi(event) {
    this.check_change_dothi = 0;
    const kehoachIdsHaveSelect = this.orderSelect.params ? Array.from(new Set(this.orderSelect.params.map(m => m['kehoanh_thi_cu']))) : [];
    if (!kehoachIdsHaveSelect.includes(event.value)) {
      forkJoin([
        this.kehoachthiCapdoService.getDataUnlimitAndKehoachId(event.value),
        // this.ordersService.getTotalItemByCapHskAndKehoachId(this.orderSelect.caphsk_id, event.value)
        this.ordersService.getDataMonSelect(event.value)

      ])
        .subscribe({
          next: ([dmCapdo, data]): void => {
            const numOfLuotthi = dmCapdo.find(f => f.caphsk_id == this.orderSelect.caphsk_id) ? dmCapdo.find(f => f.caphsk_id == this.orderSelect.caphsk_id).soluong : null;
            const numOfUse = data.find(f => parseInt(f.caphsk_id) == this.orderSelect.caphsk_id) ? data.find(f => parseInt(f.caphsk_id) == this.orderSelect.caphsk_id).total : null;
            // console.log(numOfLuotthi)
            // console.log(numOfUse)
            this.check_change_dothi =  !numOfUse || ( numOfLuotthi && numOfUse && numOfLuotthi > numOfUse) ? 1 : 2;
          }, error: (err) => {
            this.check_change_dothi = 2;

            this.notifi.toastError(err['message'])
          }
        })
    } else {
      this.check_change_dothi = 3;
      this.notifi.toastError('Bạn đã từng đổi đợt thi này, vui lòng chọn đợt thi khác.');
    }

  }

  async btnAccept() {

    if (this.formHuyOrder.valid) {
      const button = await this.notifi.confirmRounded('Thao tác này sẽ đổi đợt dự thi của thí sinh', 'XÁC NHẬN', [BUTTON_YES, BUTTON_NO]);

      const dataUp = {
        ...this.formHuyOrder.value,
        type: 'change',
        content: {
          kehoanh_thi_cu: this.orderSelect.kehoach_id,
          kehoanh_thi_moi: this.change_kehoachthi_id,
          thoigian_sua: this.helperService.formatSQLDateTime(new Date())
        },

      };

      // console.log(dataUp);

      if (button.name === BUTTON_YES.name) {
        // this.ordersService.changeDotthi(this.orderSelect.id, {kehoach_id: this.change_kehoachthi_id}).subscribe({
        this.notifi.isProcessing(true);
        this.hskHuyOrderService.create(dataUp).pipe(switchMap(m => {

            return this.hskHuyOrderService.ActiveChangeDotthi(m)
          }
        )).subscribe({
          next: () => {
            this.displayModal = false;
            this.getDataOrder();
            this.notifi.isProcessing(false);
            this.notifi.toastSuccess('Thao tác thành công');
          }, error: (err) => {
            this.notifi.isProcessing(false);
            this.notifi.toastError(err['error']['message']);
          }
        })
      }
    } else {
      this.notifi.toastError('Vui lòng nhập lý do đổi đợt thi');
    }

    // const dataUP = {
    //   order_id: this.orderSelect.id,
    //   kehoach_id:this.orderSelect.kehoach_id,
    //   type:'change',
    //   content:{
    //     kehoanh_thi_cu: this.orderSelect.kehoach_id,
    //     kehoanh_thi_moi: this.change_kehoachthi_id,
    //     thoigian_sua: this.helperService.formatSQLDateTime(new Date())
    //   },
    //   hoten:this.orderSelect['__hoten'],
    //   caphsk_id:this.orderSelect.id
    // }
    //if (button.name === BUTTON_YES.name) {
    // this.ordersService.changeDotthi(this.orderSelect.id, {kehoach_id: this.change_kehoachthi_id}).subscribe({
    //   next: () => {
    //     this.displayModal = false;
    //     this.getDataOrder();
    //     this.notifi.isProcessing(false);
    //     this.notifi.toastSuccess('Thao tác thành công');
    //   }, error: (err) => {
    //     this.notifi.isProcessing(false);
    //     this.notifi.toastError(err['error']['message']);
    //   }
    // })
    //}
  }

  btnRouInfo() {
    this.router.navigate(['admin/thi-sinh/thong-tin']);
  }


  displayModalHuyOrder: boolean = false;
  loading_huyorder: 1 | 0 | 2 | -1 = 0; // 1 ddax huy,2 form, 0 loading,-1 mất kết nối mạng;

  resetFormHuyOrder() {
    this.formHuyOrder.reset(
      {
        user_id: null,
        kehoach_id: null,
        caphsk_id: null,
        order_id: null,
        hoten: '',
      }
    )
  }


  btnHuyOrderthi(item: OrdersHsk) {

    const kehoachByOrder = this.keHoachThi.find(f => f.id == item.kehoach_id);
    if (kehoachByOrder && kehoachByOrder.status === 1) {
      const datekehoach = new Date(kehoachByOrder.ngayketthuc);

      this.notifi.isProcessing(false);
      const dateSeverGet = new Date(this.dateTimeService.date)
      if (new Date(this.helperService.formatSQLDate(datekehoach)) >= new Date(this.helperService.formatSQLDate(dateSeverGet))) {
        this.resetFormHuyOrder();
        this.orderSelect = item;
        this.displayModalHuyOrder = true;
        this.loading_huyorder = 0;
        this.formHuyOrder.reset(
          {
            user_id: item.user_id,
            kehoach_id: item.kehoach_id,
            caphsk_id: item.caphsk_id,
            order_id: item.id,
            hoten: item['__hoten'],
            type: 'cancel',
            mota: '',
            files: null,
            minhchung: null
          }
        )
        this.hskHuyOrderService.getDataByOrderIdAndType(item.id, 'cancel').subscribe({
          next: (huyhsk) => {

            // const checkHuy  = huyhsk.reduce()
            this.huyHskByCancel = huyhsk && huyhsk.length > 0 ? huyhsk[0] : null;
            if (!huyhsk[0]) {
              this.loading_huyorder = 2;
            } else {
              this.loading_huyorder = 1;
            }
          },
          error: (err) => {
            this.loading_huyorder = -1;
          }
        })
      } else {
        this.notifi.toastError('Đã hết thời gian hủy đăng ký dự thi');
      }
    } else {
      this.notifi.toastWarning('Đã hết thời gian hủy đăng ký dự thi');
    }
  }

  huyHskByCancel: HskHuyOrder;

  async btnAcceptHuyOrder() {
    // console.log(this.formHuyOrder.value);
    const objectForm = this.formHuyOrder.value
    if (this.formHuyOrder.valid && objectForm['files'] !== null && objectForm['minhchung'] !== null) {
      // console.log(this.formHuyOrder.value);
      const object = this.formHuyOrder.value;
      // console.log(object);

      if (object['minhchung'] !== [] || object['minhchung'] !== [] || (object['minhchung'] !== [] && object['minhchung']) !== []) {
        const html = `
          <p>Yêu cầu này sẽ được cán bộ phụ trách xét duyệt </p>
          <p>Vui lòng chờ thông báo </p>
        `;
        const button = await this.notifi.confirmRounded('Xác nhận hủy đăng ký dữ thi', 'XÁC NHẬN HỦY DỰ THI', [BUTTON_YES, BUTTON_NO]);
        if (button.name === BUTTON_YES.name) {
          this.loading_huyorder = 0;
          this.hskHuyOrderService.create(this.formHuyOrder.value).subscribe({
            next: (data) => {
              // this.loading_huyorder =1;
              this.huyHskByCancel = {...this.formHuyOrder.value, id: data, state: 0}
              this.notifi.toastSuccess('Thao tác thành công');
              this.loading_huyorder = 1;
            }, error: (err) => {
              this.loading_huyorder = 2;
              // console.log(err)
              this.notifi.toastError(err['error']['message']);

            }
          })
        }
      } else {
        this.notifi.toastError('Đơn hoàn lệ phí thi hoặc minh chứng chuyển khoản không được để trống');

      }


    } else {
      this.notifi.toastError('Vui lòng nhập đủ thông tin');
    }

  }

  conventNameDotthi(id: number) {
    return this.keHoachThi.find(f => f.id == id) ? this.keHoachThi.find(f => f.id == id).dotthi : '';
  }

  btnDowloadDon() {
    const link = document.createElement('a');
    link.href = 'assets/files/hsk/don-xin-hoan-thi.docx';
    link.download = 'don-xin-hoan-thi.docx';
    link.click();
  }

  filePermission = {
    canDelete: true,
    canDownload: true,
    canUpload: true
  };

}



