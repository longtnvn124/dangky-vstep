import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NotificationService} from "@core/services/notification.service";
import {ThiSinhInfo} from "@shared/models/thi-sinh";
import {forkJoin} from "rxjs";

import {ThisinhInfoService} from "@shared/services/thisinh-info.service";
import {AuthService} from "@core/services/auth.service";
import {ThemeSettingsService} from "@core/services/theme-settings.service";
import {NgPaginateEvent} from "@shared/models/ovic-models";
import {Paginator} from "primeng/paginator";

import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BUTTON_NO, BUTTON_YES} from "@core/models/buttons";
import {SenderEmailService} from "@shared/services/sender-email.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FileService} from "@core/services/file.service";
import {HskOrdersShip, HskOrdersShipService} from "@shared/services/hsk-orders-ship.service";
import {HskKehoachThiService, KeHoachThi} from "@shared/services/hsk-kehoach-thi.service";
import {HskHoidongKetqua, HskHoidongKetquaService} from "@shared/services/hsk-hoidong-ketqua.service";
import {HskOrdersService, OrdersHsk} from "@shared/services/hsk-orders.service";
import {DanhMucCapDoService} from "@shared/services/danh-muc-cap-do.service";
import {DmCapdo} from "@shared/models/danh-muc";

interface Dongia{
  title:string,
  value:number,
  isChange:1|0,
  soluong:number,
  key:1 |0, // được phép xóa hay không
  monthi:string,
}
@Component({
  selector: 'app-yeu-cau-tra-ket-qua',
  templateUrl: './yeu-cau-tra-ket-qua.component.html',
  styleUrls: ['./yeu-cau-tra-ket-qua.component.css']
})
export class YeuCauTraKetQuaComponent implements OnInit {
  @ViewChild(Paginator)       paginator     : Paginator;
  // @ViewChild('tplCreateBill') tplCreateBill : ElementRef;

  //=========================================

  kehoachthi    : KeHoachThi[];
  thisinhInfo   : ThiSinhInfo;
  listData      : HskOrdersShip[];
  formSave      : FormGroup;
  formUpdate      : FormGroup;

  //=========================================
  isLoading:boolean   = true;
  page:number         = 1;
  recordsTotal:number = 0;
  rows:number         = this.themeSettingsService.settings.rows;

  ngType :-1 |1|0|2 |3 |4=0;// trang thái stter 3: mở form

  listStyle = [
    {
      value: 1,
      title: '<div class="thanh-toan-check true text-center"><div></div><label>Đăng ký thành công</label></div>',
    },
    {
      value: 0,
      title: '<div class="thanh-toan-check false text-center"><div></div><label>Chưa thanh toán</label></div>',
    },
    {
      value: -1,
      title: '<div class="thanh-toan-check false text-center"><div></div><label>Đã hủy duyệt</label></div>',
    },
    {
      value: 2,
      title: '<div class="thanh-toan-check check text-center"><div></div><label>Đã thanh toán, chờ duyệt</label></div>',
    }
  ]

  dropChonChuyenphat = [
    {
      value: '1',
      title:'Nhận phiếu tại trung tâm',
    },
    {
      value: '0',
      title: 'Nhận phiếu tại nhà',
    },

  ]

  ngRouterView:1|0|2|-1= 0;

  listKetquaThi :HskHoidongKetqua[] = null;

  kehoach_id_select: number= 0;
  objectThanhtoanClone :Dongia[] = [
    {
      title:'Phí chuyển phát (1 bản gốc)',
      value: 70000,
      isChange:0,
      soluong:1,
      key:0,
      monthi:''
    },{
      title:'Bản sao công chứng ( Phí dịch + công chứng)',
      value: 120000,
      soluong: 0,
      isChange: 1,
      key:1,
      monthi:'bản sao công chứng'
    }
  ];
  objectThanhtoan:Dongia[] = [
    {
      title:'Phí chuyển phát(1 bản gốc)',
      value: 70000,
      isChange:0,
      soluong:1,
      key:0,
      monthi:''
    },{
      title:'Bản sao công chứng( Phí dịch + công chứng)',
      value: 120000,
      soluong: 0,
      isChange: 1,
      key:1,
      monthi:'bản sao công chứng'
    }
  ]
  filePermission = {
    canDelete: true,
    canDownload: true,
    canUpload: true
  };

  dmCapdo: DmCapdo[];
  constructor(
    private themeSettingsService:ThemeSettingsService,
    private notifi:NotificationService,
    private kehoachthiService:HskKehoachThiService,
    private thisinhInfoService: ThisinhInfoService,
    private auth:AuthService,
    private fb:FormBuilder,
    private hskOrdersShipService: HskOrdersShipService,
    private hskHoidongKetquaService: HskHoidongKetquaService,
    private senderEmailService: SenderEmailService,
    private hskOrdersService:HskOrdersService,
    private fileSerivce: FileService,
    private dmCapdoService: DanhMucCapDoService
  ) {
    this.formSave = this.fb.group({
      thisinh_id: [null, Validators.required],
      user_id: [null, Validators.required],
      nguoinhan_hoten: ['', Validators.required],
      thisinh_hoten: ['', Validators.required],
      nguoinhan_diachi: ['', Validators.required],
      nguoinhan_phone: ['', Validators.required],
      params: [null, Validators.required],
      kehoach_id:[null,Validators.required],
      lephithi:[null,Validators.required],
      tenphieu:['',Validators.required],
      sobaodanh:['',Validators.required],
      mota:[''],
      caphsk_id:[0,Validators.required],
    })
    this.formUpdate = this.fb.group({
      files:[null, Validators.required]
    })
  }
  ngOnInit(): void {
    this.loadInit()
  }

  loadInit(){
    this.getDanhMuc()
  }
  getDanhMuc(){
    // this.isLoading=true;
    // this.notifi.isProcessing(true);
    this.ngType=0;
    forkJoin<[ KeHoachThi[],ThiSinhInfo, DmCapdo[]]>(
      this.kehoachthiService.getDataUnlimitNotstatus(),
      this.thisinhInfoService.getUserInfo(this.auth.user.id),
      this.dmCapdoService.getDataUnlimit()
    ).subscribe({
      next:([kehoachthi, thisinhinfo, listCapdo])=>{
        this.kehoachthi = kehoachthi ;
        this.thisinhInfo = thisinhinfo;
        this.dmCapdo = listCapdo;

        if( this.kehoachthi && this.thisinhInfo){
          this.loadData(this.page);
        }else{
        }

      },
      error:()=>{
        // this.isLoading=false;
        // this.notifi.isProcessing(false);
        this.ngType=-1;
        this.notifi.toastError('Load dữ liệu không thành công')
      }
    })
  }
  loadData(page:number){
    // this.isLoading=true;
    // this.notifi.isProcessing(true);
    this.ngType= 0;
    this.page = page ? page: this.page;
    this.hskOrdersShipService.getDataByCCCD(this.thisinhInfo.id,this.page).subscribe(
      {
        next:({recordsTotal,data})=>{

          this.recordsTotal= recordsTotal;
          this.listData = data.length>0 ?data.map((m,index)=>{
            m['__index']= (page -1)* this.rows +(index+1);
            m['__status_converted'] = this.listStyle.find(f => f.value == m.trangthai_thanhtoan) ?  this.listStyle.find(f => f.value == m.trangthai_thanhtoan).title : '';
            m['__status_converted_v2'] = m.trangthai_thanhtoan === 1 ? 'Đã xác nhận thanh toán': (m.trangthai_thanhtoan === 0 ? 'Chưa thanh toán': (m.trangthai_thanhtoan===2 ?'Đang chờ duyệt' :''));
            m['__kehoach_thi'] = this.kehoachthi.length>0 && this.kehoachthi.find(f => f.id === m.kehoach_id) ? this.kehoachthi.find(f => f.id === m.kehoach_id).dotthi : '';

            const kehoachthi = this.kehoachthi.find(f => f.id === m.kehoach_id);
            m['__kehoach_thi_convent'] = kehoachthi ? kehoachthi :null;
            m['__lephithi_covered'] = m.lephithi;
            m['__minhchung'] = m['files'] && m['files'].length > 0 ? this.fileSerivce.getPreviewLinkLocalFileNotToken(m['files'][0]) : '';
            m['__capHsk'] = this.dmCapdo.find(f=>f.id === m.caphsk_id) ?  this.dmCapdo.find(f=>f.id === m.caphsk_id).title : '' ;
            return m;
          }) : [];
          // this.isLoading=false;
          // this.notifi.isProcessing(false);

          // this.ngType= data.length> 0 ? 2:1;
          this.ngType= 2;
        },
        error:(e)=>{
          this.isLoading=false;
          this.notifi.isProcessing(false);

          this.notifi.toastError('Tải dữ liệu không thành công');
        }
      }
    )

  }

  paginate({page}: NgPaginateEvent) {
    this.page = page + 1;
    this.loadData(this.page);
  }

  btnReload(){
    this.getDanhMuc();
  }

  get f(): { [key: string]: AbstractControl<any> } {
    return this.formSave.controls;
  }

  get upload(): { [key: string]: AbstractControl<any> } {
    return this.formUpdate.controls;
  }



  displayPhieu: boolean =false;
  kehoachthiByThisinh:HskHoidongKetqua[];
  btnViewFormPhieu(){
    // this.displayPhieu= true;
    this.listKetquaThi= null;
    this.listKetquaThi = null;
    this.objectThanhtoan = [... this.objectThanhtoanClone];
    this.resetForm();


    this.hskHoidongKetquaService.getKehoachByCccd(this.thisinhInfo.cccd_so).subscribe({
      next:(data)=>{
        this.kehoachthiByThisinh = data.length >0 ? data.map(m=>{
          m['dotthi'] = this.kehoachthi.find(f=>f.id === m.kehoach_id) ? this.kehoachthi.find(f=>f.id === m.kehoach_id).dotthi : '';
          return m;
        }) :[];

        // this.kehoachthiByThisinh
        // console.log(this.kehoachthiByThisinh);
        this.ngType =3;
      },error:()=>{
        this.notifi.toastError('Load dữ liệu không thành công');
      }
    })

  }


  listOrderByKehoachSelect :OrdersHsk[] = [];

  btnSelectKehoachthi(kehoach_id:number){
    // console.log(kehoach_id);
    this.kehoach_id_select = kehoach_id
    if(kehoach_id){
      this.isLoading = true;
      forkJoin([
        this.hskHoidongKetquaService.getdataByCccdSoAndKehoachId(this.thisinhInfo.cccd_so.toString(),kehoach_id),
        this.hskOrdersService.getdataBykehoachAndUserAndSelectAndTrangthai(this.auth.user.id,kehoach_id,'1','id,kehoach_id,caphsk_id,trangthai_thanhtoan')
      ])
      .subscribe({
        next:([data, listOrder])=>{
          this.isLoading = false;
          this.listKetquaThi = data;
          // console.log(listOrder)
          this.listOrderByKehoachSelect = [];
          if(listOrder.length>0){
            this.listOrderByKehoachSelect= listOrder.filter(f=>f['huy'] == false).map(m=>{
              m['_caphsk'] =this.dmCapdo.find(f=>f.id === m.caphsk_id) ? this.dmCapdo.find(f=>f.id === m.caphsk_id).title : 'Không xác định';
              return m;
            })

              this.f['caphsk_id'].setValue(this.listOrderByKehoachSelect[0].caphsk_id);
            // console.log(this.formSave.value);
          }
        },error:()=>{
          this.isLoading = false;

          this.notifi.toastError('Load dữ liệu không thành công');
        }
      })
    }
  }



  btnAdditionOrSubtrac(item: Dongia, type: 1 | -1) {
    if (type === -1 && item['soluong'] === 0) {
      return item; // Không thay đổi nếu đã là 0
    }
    item['soluong'] += type;
    return item;
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
  btnSelectCapBykehoach(item:OrdersHsk){
    // console.log(item.caphsk_id);
    this.f['caphsk_id'].setValue(item.caphsk_id);

  }

  async btnAcceptPhieu(){
    this.f['kehoach_id'].setValue(this.kehoach_id_select);
    this.f['params'].setValue(this.objectThanhtoan);
    this.f['thisinh_id'].setValue(this.thisinhInfo.id);
    this.f['user_id'].setValue(this.auth.user.id);
    this.f['lephithi'].setValue(this.viewDongiaAll(this.objectThanhtoan));

    const kehoach = this.kehoachthi.find(f=>f.id === this.kehoach_id_select);
    this.f['tenphieu'].setValue('Phiếu kết quả ' + (kehoach ? 'đợt thi ' + kehoach.dotthi : '' ) );

    this.isLoading =true;
    if(this.formSave.valid){
      const html = `
            <p>Xác nhận thanh toán ${this.viewDongiaAll(this.objectThanhtoan).toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND'
      })} </p>
            <p>Thao tác này sẽ tạo phiếu chuyển phát, vui lòng thực hiện thanh toán để nhận phiếu điểm sớm nhất!</p>
        `;
      const header = 'XÁC NHẬN TẠO PHIẾU';
      const btn = await this.notifi.confirmRounded(html,header,[ BUTTON_NO , BUTTON_YES ])
      this.notifi.isProcessing(true);

      if(btn.name == 'yes'){
        // this.sendEmail(this.formSave.value);
        this.hskOrdersShipService.create(this.formSave.value).subscribe({
          next:()=>{
            this.sendEmail(this.formSave.value);
            this.notifi.toastSuccess('Tạo mới thành công');
            this.notifi.isProcessing(false);
            this.displayPhieu=false;
            this.resetForm();
            this.loadData(1);
          },
          error:()=>{
            this.notifi.isProcessing(false);
            this.notifi.toastError('Tạo mới không thành công');
          },
        })
      }else{
        this.notifi.isProcessing(false);

      }
    }else{
      this.notifi.toastError('Vui lòng nhập đủ thông tin');
    }
  }

  sendEmail( form) {

    let message = `

        <p>Bạn đã đăng ký chuyển phát Chứng chỉ Bài thi HSK trên máy tính của Đại học Thái Nguyên (HSK-TNU):</p>

        <p style="font-weight:700;">THÔNG TIN CHUYỂN PHÁT:</p>
        <table width="100%" style="border:0;">
            <tr>
                <td style="width:250px;">Họ và tên người nhận:</td>
                <td style="font-weight:600">${form['nguoinhan_hoten']}</td>
            </tr>

            <tr>
                <td style="width:250px;">Số điện thoại người nhận:</td>
                <td style="font-weight:600">${form['nguoinhan_phone']}</td>
            </tr>
            <tr>
                <td style="width:250px;">Địa chỉ người nhận:</td>
                <td style="font-weight:600">${form['nguoinhan_diachi']}</td>
            </tr>
            <tr>
                <td style="width:250px;">Cấp HSK:</td>
                <td style="font-weight:600">${this.dmCapdo.find(f=>f.id === form['caphsk_id']) ? this.dmCapdo.find(f=>f.id === form['caphsk_id']) :''}</td>
            </tr>
            <tr>
                <td style="width:250px;">Số báo danh:</td>
                <td style="font-weight:600">${form['sobaodanh']}</td>
            </tr>

        </table>

        <p>Nội dung chuyển phát:</p>
        <table style=" border: 1px solid black;border-collapse: collapse;">
          <tr style="border: 1px solid black;border-collapse: collapse;">
            <th style="border: 1px solid black;border-collapse: collapse;text-align:center;" width="300px"><strong>Nội dung</strong></th>
            <th style="border: 1px solid black;border-collapse: collapse;text-align:center;" width="150px"><strong>Số lượng</strong></th>
            <th style="border: 1px solid black;border-collapse: collapse;text-align:center;" width="150px"><strong>Đơn giá </strong></th>
          </tr>
    `;

    const params = form['params'];

    params.forEach(e=>{
      message += `
      <tr style="border: 1px solid black;border-collapse: collapse;">
        <td style="border: 1px solid black;border-collapse: collapse;">${e['title']}</td>
        <td style="border: 1px solid black;border-collapse: collapse;text-align:center ;">${e['soluong']}</td>
        <td style="border: 1px solid black;border-collapse: collapse; text-align:right;">${ (this.viewDongiaItem(e)).toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND'
      })}</td>
      </tr>
    `;
    })

    message += `
  <tr>
    <th colspan="2" style="border: 1px solid black;border-collapse: collapse;"><strong>Tổng (VNĐ)</strong></th>
    <td style="border: 1px solid black;border-collapse: collapse;text-align:right;"><strong> ${this.viewDongiaAll(params).toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND'
    })}</strong></td>
  </tr>
    </table>
    <p style="color: #ce3b04;">- Trạng thái thanh toán: Chưa thanh toán.</p>
    <p>- Bạn vui lòng thanh toán lệ phí thi để hoàn tất quá trình đăng ký chuyển phát.</p>
`;
    const emailsend: any = {
      to: this.auth.user.email,
      // to: 'longkakainfo@gmail.com',
      title: ' Email thông báo đăng ký chuyển phát',
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

  resetForm(){
    this.formSave.reset({
      thisinh_id: null,
      user_id: null,
      nguoinhan_hoten:'',
      thisinh_hoten:'',
      nguoinhan_diachi: '',
      nguoinhan_phone: '',
      params: null,
      kehoach_id:null,
      lephithi:null,
      tenphieu:'',
      mota:'',
      caphsk_id:0,
    })
  }


  viewOrderShipSelect:boolean = false;
  orderShipSelect:HskOrdersShip;

  viewInfoPhieu(item:HskOrdersShip){
    this.orderShipSelect = item;
    this.viewOrderShipSelect= true;
  }

  displayPament : boolean=false;
  async getPayment(item: HskOrdersShip) {

    const htmlbody =`
      <p class="text-center">Điều khoản hỗ trợ dịch vụ chuyển phát nhanh. </p>
      <p class="text-justify">Tôi là thí sinh thi tiếng Trung (HSK) tại Trung tâm Khảo thí và Quản lý chất lượng giáo dục. Tôi đồng ý ủy quyền cho bên chuyển phát hỗ trợ lấy chứng chỉ và chuyển phát về theo địa chỉ mà tôi đã đăng ký với mức phí chuyển phát 70.000VND, dịch vụ chuyển phát bao gồm: </p>
      <p class="text-justify">- Sử dụng điều khoản bảo hiểm hàng hóa (trong trường hợp bị mất chứng chỉ bên vận chuyển phối hợp làm thủ tục để được cấp lại 01 bản mới từ phía CTI-TQ) </p>
      <p class="text-justify">- Sử dụng gói chuyển phát nhanh giao hàng từ 3-5 ngày hành chính. </p>
      <p class="text-justify">- Đăng ký gói dịch thuật công chứng (nếu có)</p>
      <p class="text-justify">- Thí sinh không có nhu cầu chuyển phát chọn <strong>"Có"</strong></p>
      <p class="text-justify"> Tôi đồng ý các điều khoản trên</p>

    `;
    const btn = await this.notifi.confirmRounded(htmlbody,'THÔNG BÁO',[BUTTON_YES,BUTTON_NO])
    console.log(btn);
    if(btn.name == 'yes'){
      this.displayPament =true;
      this.orderShipSelect = item;
      this.formUpdate.reset({
        files:null
      })
    }



  }


  async deleteRow(data:OrdersHsk) {
    const kehoach = data['__kehoach_thi_convent']
    if(kehoach && kehoach['cancel_or_change'] !== 1){
      const confirm = await this.notifi.confirmDelete();
      if (confirm) {
        this.hskOrdersShipService.delete(data.id).subscribe({
          next: () => {
            // this.getDataOrder();
            this.loadData(this.page);
            this.notifi.isProcessing(false);
            this.notifi.toastSuccess('Thao tác thành công');
          }, error: () => {
            this.notifi.isProcessing(false);
            this.notifi.toastError('Thao tác không thành công');
          }
        })
      }
    }else{
      this.notifi.toastError('Đợt thi đã bị hủy, vui lòng không thực hiện thao tác');
    }

  }

  btnReturnHome(){
    this.ngType= 2;
  }

  async btnAccessFile(){
    if(this.formUpdate.valid){
      const html = `

            <p>Thao tác này sẽ gửi ảnh minh chứng lên hệ thống,vui lòng chờ xét duyệt</p>
        `;
      const header = 'XÁC NHẬN THANH TOÁN';

      const btn = await this.notifi.confirmRounded(html,header,[ BUTTON_NO , BUTTON_YES ])
      if(btn.name ==='yes'){
        this.notifi.isProcessing(true);
        this.hskOrdersShipService.sendMinhchung(this.orderShipSelect.id, this.formUpdate.value).subscribe({
          next:()=>{

            this.displayPhieu= false;
            this.displayPament =false;

            // const a = JSON.stringify(req.body.files)

            this.loadInit();
            this.notifi.toastSuccess('Thao tác thành công');
            this.notifi.isProcessing(false);

          },
          error:()=>{
            this.notifi.isProcessing(false);
            this.notifi.toastError('Thao tác không thành công');
          }
        })
      }
    }else{
      // this.
      this.notifi.toastError('Vui lòng cập nhật ảnh mình chứng');
    }
  }
  btnSelectChuyenphat(bl : string){
    console.log(bl)
    if(bl == '0'){
      this.objectThanhtoan.find(f=>f.isChange == 0).soluong= 1;
    }else{
      this.objectThanhtoan.find(f=>f.isChange == 0).soluong= 0;

    }
  }


}
