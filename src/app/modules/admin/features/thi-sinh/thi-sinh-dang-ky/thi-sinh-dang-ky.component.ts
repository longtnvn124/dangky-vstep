import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ThisinhInfoService} from "@shared/services/thisinh-info.service";
import {forkJoin, Observable, of, switchMap} from "rxjs";
import {AuthService} from "@core/services/auth.service";
import {ThiSinhInfo} from "@shared/models/thi-sinh";
import {NotificationService} from "@core/services/notification.service";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {SenderEmailService} from "@shared/services/sender-email.service";
import {HelperService} from "@core/services/helper.service";
import {OrdersHsk} from "@shared/services/hsk-orders.service";
import {User} from "@core/models/user";
import {KeHoachThi, KehoachthiVstepService} from "@shared/services/kehoachthi-vstep.service";
import {KehoachthiDiemduthi, KehoachthiDiemthiVstepService} from "@shared/services/kehoachthi-diemthi-vstep.service";
import {OrdersVstep, VstepOrdersService} from "@shared/services/vstep-orders.service";
import {DmDiemduthi, DmDiemDuThiService} from "@shared/services/dm-diem-du-thi.service";
import {ConditionOption} from "@shared/models/condition-option";
import {OvicQueryCondition} from "@core/models/dto";
import {map} from "rxjs/operators";
import {NgPaginateEvent} from "@shared/models/ovic-models";

export interface SumMonThi {
  caphsk_id: string,
  total: number,
}

export interface SumDiemduthi {
  diemduthi_id: string,
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
  isLoading         : boolean = true;
  loadInitFail      : boolean = false;
  userInfo          : ThiSinhInfo;
  keHoachThi        : KeHoachThi[]= [];
  keHoachThi_dangky : KeHoachThi[]= [];
  formSave          : FormGroup;
  dataOrders        : OrdersVstep[] =[];
  listStyle = [
    {value: 1, title: '<div class="thanh-toan-check true text-center"><div></div><label>Đã thanh toán</label></div>',},
    {value: 0, title: '<div class="thanh-toan-check false text-center"><div></div><label>Chưa thanh toán</label></div>',},
    {value: -1, title: '<div class="thanh-toan-check check text-center"><div></div><label>Đã thanh toán, chờ duyệt</label></div>',},
    {value: 2, title: '<div class="thanh-toan-check check text-center"><div></div><label>Chờ thanh toán</label></div>',}
  ]


  recordTotal               : number = 0;
  page                      : number = 1 ;
  kehoachDiemduthi          : KehoachthiDiemduthi [] = [];
  kehoach_select            : KeHoachThi = null;
  kehoach_diemduthi_select  : KehoachthiDiemduthi = null;
  limit                     : number = 20;


  constructor(
    private kehoachthiVstepService: KehoachthiVstepService,
    private kehoachthiDiemthiVstepService: KehoachthiDiemthiVstepService,
    private helperService :HelperService,
    private ordersService: VstepOrdersService,

    private auth: AuthService,
    private notifi: NotificationService,
    private fb: FormBuilder,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private thisinhInfoService: ThisinhInfoService,

    private senderEmailService: SenderEmailService,

    private dmDiemDuThiService: DmDiemDuThiService,
  ) {
    this.formSave = this.fb.group({
      user_id: [null, Validators.required],
      kehoach_id: [null, Validators.required],
      diemduthi_id: [null, Validators.required],
      lephithi: [null, Validators.required],
    })

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
    this.kehoach_select = null;
    this.kehoach_diemduthi_select = null;
    this.getDataDanhMuc();
  }

  getDataDanhMuc() {
    this.isLoading = true;
    this.notifi.isProcessing(true);

    const conditonKehoach :ConditionOption = {
      condition: [
        {conditionName: 'status', condition:OvicQueryCondition.equal, value:'1', orWhere: "and"}
      ],
      page: '1',
      set:[
        { label:'limit', value:'-1'},
        { label:'orderby', value:'ngaybatdau'},
        { label:'order', value:'ASC'},
      ]
    }
    forkJoin<[ThiSinhInfo, KeHoachThi[]]>(
      [
        this.thisinhInfoService.getUserInfo(this.auth.user.id),
        this.kehoachthiVstepService.getDataByPageNew(conditonKehoach).pipe(map(m=>m.data)),

      ]
    ).subscribe({
      next: ([ thisinhInfo, keHoachThi,]) => {

        this.userInfo = thisinhInfo;

        const curentDate = new Date();

        const kehoachthiParam = keHoachThi.map(m => {
          m['_date_convertd'] = this.strToTime(m.ngaybatdau) + ' - ' + this.strToTime(m.ngayketthuc);
          return m;
        })

        this.keHoachThi = kehoachthiParam;
        this.keHoachThi_dangky = kehoachthiParam.filter(f => f.status === 1 && (this.helperService.formatSQLDate(new Date(f.ngayketthuc))) >= this.helperService.formatSQLDate(curentDate));
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


  getDataOrder() {
    const conditionOrder : ConditionOption = {
      condition:[
        {
          conditionName:'user_id',
          condition:OvicQueryCondition.equal,
          value:this.auth.user.id.toString(),
        }
      ],
      page:this.page.toString(),
      set:[
        {
          label:'limit', value:this.limit.toString(),
        },
        {
          label:'order',value : 'DESC'
        }
      ]
    }


    this.ordersService.getDataByPageNew(conditionOrder).pipe(switchMap(m=>{

      const diemthi_ids = Array.from(new Set( m.data.map(a=>a.diemduthi_id)));
      const condionDiemduthi : ConditionOption = {
        condition:[
          {
            conditionName:'id',
            condition:OvicQueryCondition.equal,
            value:diemthi_ids.toString()
          },
        ],
        page: '1',
        set:[
          {label: 'limit', value:diemthi_ids.length.toString()},
          {label: 'order', value:'DESC'},
        ]
      }
      return forkJoin(
        of(m),
        this.dmDiemDuThiService.getDataByPageNew(condionDiemduthi).pipe(map(a=>a.data))
      )
    })).subscribe({
      next: ([{data,recordsFiltered}, datadm],) => {
        this.recordTotal =recordsFiltered;
        let i = 1;
        this.dataOrders = data.map(m => {

          m['_indexTable'] = i++;
          m['__kehoach_thi'] = this.keHoachThi && this.keHoachThi.find(f => f.id === m.kehoach_id).title ? this.keHoachThi.find(f => f.id === m.kehoach_id).title : '';
          m['__kehoach_thi_status'] = this.keHoachThi && this.keHoachThi.find(f => f.id === m.kehoach_id) ? this.keHoachThi.find(f => f.id === m.kehoach_id).status : 0;
          m['__lephithi_covered'] = m.lephithi;
          const parent = m['parent'];

          const _trangthai: number = parent ? parent.trangthai_thanhtoan : m.trangthai_thanhtoan;
          m['__trangthai_thanhtoan'] = _trangthai;
          m['__status_converted'] = _trangthai === 1 ? this.listStyle.find(f => f.value === 1).title : (_trangthai === 0 ? this.listStyle.find(f => f.value === 0).title : (_trangthai === 2 ? this.listStyle.find(f => f.value === 2).title : ''));

          m['__have_parent'] = m.parent_id !== 0 ? true : false;
          const userParent = parent ? parent['user'] : null;
          m['__ghichu'] = userParent ? userParent['name'] + ' đăng ký ' : '';
          m['__hoten'] = m['user'] && m['user']['name'] ? m['user']['name'] : '';

          m['__diemduthi_covered'] = datadm && datadm.length > 0 ? (datadm.find(f => f.id === m.diemduthi_id) ? datadm.find(f => f.id === m.diemduthi_id).title : '') : ' ';


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


  SaveForm() {
    this.f['user_id'].setValue(this.auth.user.id);
    console.log(this.formSave);
    if (this.formSave.valid) {
      this.isLoading = true;

      const formadd = this.formSave.value;
      const checkConditon: ConditionOption = {
        condition: [
          {
            conditionName: 'kehoach_id', condition: OvicQueryCondition.equal, value: formadd.kehoach_id.toString()
          },
          {
            conditionName: 'diemduthi_id', condition: OvicQueryCondition.equal, value: formadd.diemduthi_id.toString()
          },
          {
            conditionName: 'user_id', condition: OvicQueryCondition.equal, value: formadd.user_id.toString()
          },
        ], page: '1',
        set: [
          {label: 'limit', value: '1'}
        ]
      }
        this.ordersService.getDataByPageNew(checkConditon).subscribe({
          next:({data})=>{
            if(data.length> 0 ){
             this.isLoading = false;
             this.notifi.toastError('Bạn đã đăng ký đợt thi với với điểm thi này, vui lòng chọn đợt thi khác!');
            }else{
              this.ordersService.create(formadd).subscribe({
                next:(id)=>{
                  const order = {
                    id: id,
                    thisinh_id: this.userInfo ? this.userInfo.id : 0,
                    user_id: this.auth.user.id,
                    kehoach_id: formadd.kehoach_id,
                    mota: '',
                    lephithi: formadd.lephithi,
                    status: 1,
                    diemduthi: formadd.diemduthi_id,
                  }
                  this.sendEmail(this.userInfo,order).subscribe({
                    next: () => {
                      this.loadInit();
                      this.resetForm();
                      this.notifi.isProcessing(false)
                      this.isLoading =false;
                      this.notifi.toastSuccess("Hệ thống gửi Email đăng ký thi thành công.");
                    }, error: () => {
                      this.notifi.isProcessing(false)
                      this.isLoading =false;
                      this.notifi.toastError('Hệ thống gửi Email đăng ký không thành công');
                    }
                  })


                },error:(err)=>{
                  this.notifi.isProcessing( false);
                  this.isLoading = false;
                  this.notifi.toastWarning(err['error']['message']);
                }
              })
            }


          },error:(err)=>{
            this.isLoading = false;
            this.notifi.toastWarning(err['error']['message']);
          }
        })
    }else{
      this.notifi.toastError('Vui lòng chọn đủ thông tin');
    }
  }

  getPayment(item: OrdersHsk) {
    const kehoachSelect = this.keHoachThi.find(f => f.id === item.kehoach_id)
    if (item.parent_id === 0) {
      if (kehoachSelect.status === 1) {
        this.isLoading = true;
        if (this.helperService.formatSQLDate(new Date()) <= this.helperService.formatSQLDate(new Date(kehoachSelect.ngayketthuc))) {
          const fullUrl: string = `${location.origin}${this.router.serializeUrl(this.router.createUrlTree(['admin/thi-sinh/dang-ky/']))}`;

          const content = 'VSTEP' + item.id + '-' + item['__kehoach_thi'];
          this.ordersService.getPayment(item.id, fullUrl, content).subscribe({
            next: (res) => {
              console.log(res);
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


  sendEmail(thiSinh: ThiSinhInfo, order:any):Observable<any> {

    let message = `

        <p>Bạn đã đăng ký thi Vstep Đại học Thái Nguyên (TNU-VSTEP):</p>

        <p style="font-weight:700;">THÔNG TIN THÍ SINH:</p>
        <table width="100%" style="border:0;">
            <tr>
                <td style="width:250px;">Họ và tên:</td>
                <td style="font-weight:600">${thiSinh.hoten}</td>
            </tr>
            <tr>
                <td style="width:250px;">CCCD (Hoặc hộ chiếu):</td>
                <td style="font-weight:600">${thiSinh.cccd_so}</td>
            </tr>
        </table>

        <p>THÔNG TIN ĐĂNG KÝ</p>
        <table style=" border: 1px solid black;border-collapse: collapse;">
          <tr style="border: 1px solid black;border-collapse: collapse;">
            <th style="border: 1px solid black;border-collapse: collapse;text-align:center;" width="100px"><strong>Đợt thi</strong></th>
            <th style="border: 1px solid black;border-collapse: collapse;text-align:left;" >${this.kehoach_select.title}</th>

          </tr>
          <tr style="border: 1px solid black;border-collapse: collapse;">
            <th style="border: 1px solid black;border-collapse: collapse;text-align:center;" width="100"><strong>Điểm dự thi</strong></th>
            <th style="border: 1px solid black;border-collapse: collapse;text-align:left;" >${this.kehoach_diemduthi_select['_diemduthi'].title}</th>

          </tr>
          <tr style="border: 1px solid black;border-collapse: collapse;">
            <th style="border: 1px solid black;border-collapse: collapse;text-align:center;" width="100px"><strong>Lệ phí thi</strong></th>
            <th style="border: 1px solid black;border-collapse: collapse;text-align:left;" >${parseInt(String(order.lephithi)).toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})}</th>
          </tr>


    `;
    // <td style="border: 1px solid black;border-collapse: collapse;">${this.dmCapdos.find(f => f.id === order.caphsk_id) ? this.dmCapdos.find(f => f.id === order.caphsk_id).title : ''}</td>

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
    return  this.senderEmailService.sendEmail(emailsend)
  }



  btnRouInfo() {
    this.router.navigate(['admin/thi-sinh/thong-tin']);
  }



  //===========new ====================
  selectKehoachthi(event){
    this.f['lephithi'].setValue(event.gia);
    this.kehoach_select = event;
    if(!event){
      return;
    }
    console.log(event);
    this.notifi.isProcessing( true);

    const conditionKehoachDiemthi :ConditionOption = {
      condition:[
        {
          conditionName:'kehoach_id',
          condition:OvicQueryCondition.equal,
          value:event.id.toString()
        }
      ],page:'1',
      set:[
        {label:'limit',value:'-1'},

      ]
    }

    this.kehoachthiDiemthiVstepService.getDataByPageNew(conditionKehoachDiemthi).pipe(switchMap(m=>{
      const ids = Array.from(m.data.map(a=>a.diemduthi_id));
      console.log(ids)
      return forkJoin([
        of(m),
        this.loopGetOrderBy(1,20,ids,[]),
        this.ordersService.getDataTotalDiemthiByKehoach(event.id)
      ])
    })).subscribe({
      next:([datakehoachDiemduthi, dmDimethduthi,sumDiemduthi])=>{
        this.kehoachDiemduthi = datakehoachDiemduthi.data.map(m=> {
          const diemduthi = dmDimethduthi.find(f=>f.id == m.diemduthi_id);

          m['_diemduthi'] = diemduthi;


          const sumByDiemduthi = sumDiemduthi.find(f=>parseInt(f.diemduthi_id) == m.diemduthi_id);
          const soluongBySum = sumByDiemduthi ? sumByDiemduthi.total : 0;

          m['_soluongByDiemduthi']= m.soluong > soluongBySum? (m.soluong - soluongBySum ) : 0;

          m['_title'] = diemduthi ? diemduthi.title + '[' + m['_soluongByDiemduthi'] + ']' : '';

          return m;
        }).filter(f=>f['_soluongByDiemduthi'] > 0)

        this.notifi.isProcessing(false);

      },error:()=>{
        this.notifi.toastError('Load dữ liệu không thành công');
        this.notifi.isProcessing(false);
      }
    })

  }

  loopGetOrderBy(page:number,limit:number, diemduthi_ids: number[] ,data:DmDiemduthi[]):Observable<DmDiemduthi[]>{
    const start = (page- 1)*limit;
    const end = start  + limit

    if( (page == 0 ? limit : limit *page) < diemduthi_ids.length){
      const diemduthi_ids_select = diemduthi_ids.slice(start , end);
      const conditionDm : ConditionOption = {
         condition: [
           {
             conditionName: 'id',
             condition:OvicQueryCondition.equal,
             value:diemduthi_ids_select.toString(),
             orWhere:'in'
           }
         ],
        page: '1',
        set: [
          {label: 'limit', value:diemduthi_ids_select.length.toString(),}
        ]
      }
      return this.dmDiemDuThiService.getDataByPageNew(conditionDm).pipe(switchMap(a=>{
        return this.loopGetOrderBy(page + 1,limit,diemduthi_ids,data.concat(a.data))
      }))

    }else{
      const diemduthi_ids_select = diemduthi_ids.slice(start,end );
      const conditionDm : ConditionOption = {
        condition: [
          {
            conditionName: 'id',
            condition:OvicQueryCondition.equal,
            value:diemduthi_ids_select.toString(),
            orWhere:'in'
          }
        ],
        page: '1',
        set: [
          {label: 'limit', value:diemduthi_ids_select.length.toString(),}
        ]
      }

      return this.dmDiemDuThiService.getDataByPageNew(conditionDm).pipe(switchMap(a=>{
        return of(data.concat(a.data))
      }))
    }
  }


  selectDiemduthi(event){
    console.log(event);
    this.kehoach_diemduthi_select =event;


  }
  paginate({page}: NgPaginateEvent) {
    this.page = page + 1;
    this.getDataOrder();
  }

}



