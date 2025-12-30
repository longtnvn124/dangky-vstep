import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {forkJoin, Observable, of, switchMap} from "rxjs";
import {DanhMucCapDoService} from "@shared/services/danh-muc-cap-do.service";
import {HskOrdersService, OrdersHsk} from "@shared/services/hsk-orders.service";
import {UserService} from "@core/services/user.service";
import {HskKehoachThiService, KeHoachThi} from "@shared/services/hsk-kehoach-thi.service";
import {DmCapdo} from "@shared/models/danh-muc";
import {NotificationService} from "@core/services/notification.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ThisinhInfoService} from "@shared/services/thisinh-info.service";
import {User} from "@core/models/user";
import {ThiSinhInfo} from "@shared/models/thi-sinh";
import {WAITING_POPUP} from "@shared/utils/syscat";
import {ExportThiSinhDuThiService} from "@shared/services/export-thi-sinh-du-thi.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HskSummaryService} from "@shared/services/hsk-summary.service";

@Component({
  selector: 'app-thong-ke-du-lieu',
  templateUrl: './thong-ke-du-lieu.component.html',
  styleUrls: ['./thong-ke-du-lieu.component.css']
})
export class ThongKeDuLieuComponent implements OnInit {

  @ViewChild('templateWaiting') templateWaiting: ElementRef;

  dmCapdo:DmCapdo[];
  kehoachthi:KeHoachThi[];

  dataView:OrdersHsk[];
  dataViewClone:OrdersHsk[];
  rows:number = 1;
  isLoading:boolean =false;
  recordsTotal: number;
  dataFillGhichu :{value:string}[] = [];
  paymentStatus:{value:number,label:string}[]= [
    {value:1,label:'Đã thanh toán'},
    {value:0,label:'Chưa thanh toán'}
  ]
  infoStatus:{value:number,label:string}[]= [
    {value:1,label:'Đã cập nhật'},
    {value:0,label:'Chưa cập nhật'}
  ]
  anhChandungStatus:{value:number,label:string}[]= [
    {value:1,label:'Đã cập nhật'},
    {value:0,label:'Chưa cập nhật'}
  ]
  anhCccdStatus:{value:number,label:string}[]= [
    {value:1,label:'Đã cập nhật'},
    {value:0,label:'Chưa cập nhật'}
  ]

  formSave :FormGroup;
  ngOnInit(): void {
    this.loadInit();
  }

  constructor(
    private danhMucCapDoService: DanhMucCapDoService,
    private orderService:HskOrdersService,
    private useService:UserService,
    private hskKehoachThiService: HskKehoachThiService,
    private notifi: NotificationService,
    private fb: FormBuilder,
    private thisinhInfoService: ThisinhInfoService,
    private exportThiSinhDuThiService: ExportThiSinhDuThiService,
    private modalService:NgbModal,
    private hkSummaryService : HskSummaryService,


  ) {
    this.formSave = this.fb.group({
      kehoach_id:[null],
      trangthai_thanhtoan:[null],
      caphsk_id:[null],
      isThontin:[null],
      isAnhchandung:[null],
      isCccd:[null],
      search_cccd:[''],
      search_name:[''],
      search_ghichu:['']
    })
  }

  loadInit(){
    this.getDanhMuc()
  }
  getDanhMuc(){
    this.notifi.isProcessing(true);
    forkJoin([
      this.danhMucCapDoService.getDataUnlimit(),
      this.hskKehoachThiService.getDataUnlimitNotstatus()
    ]).subscribe({
      next:([dmCapdo,kehoachthi])=>{
          this.dmCapdo= dmCapdo;
          this.kehoachthi = kehoachthi;
        this.notifi.isProcessing(false);
      },
      error:()=>{
        this.notifi.isProcessing(false);
        this.notifi.toastError('Load dữ liệu không thành công');
      }
    })
  }

  dotthi_select : KeHoachThi;
  onSelectKehoachThi(event: number){
    this.dotthi_select = this.kehoachthi.find(f=>f.id === event);
    if(event !== null){
      this.notifi.isProcessing(true);
      // this.orderService.getDataBykehoachIdAndSelectforThongke(this.dotthi_select.id,'id,kehoach_id,caphsk_id,lephithi,trangthai_thanhtoan,user_id,parent_id,created_by,updated_by')
      //   .pipe(switchMap(m=>{
      //     const idsParent = Array.from(new Set(m.filter(a => a.parent_id !== 0).map(a => a.parent_id)));
      //
      //     return forkJoin([of(m),this.orderService.getDataByparentIds(idsParent,'id,kehoach_id,caphsk_id,lephithi,trangthai_thanhtoan,user_id,parent_id,created_by,updated_by')]);
      //   }))

      // this.hkSummaryService.getDsOrderByKehoachId(event).pipe( switchMap(order=>{
        this.logGetOrderByKehoachId(1,150 ,event,[],1).pipe( switchMap(order=>{


        const data_TuDangky  = order.filter(f=>f['created_by'] === f.user_id && f.parent_id === 0 && f.caphsk_id !== 0 );
        const data_Dangky_cha  = order.filter(f=>f.caphsk_id === 0);
        const data_Dangky_con  = order.filter(f=>f.parent_id && f.caphsk_id !== 0);

        const dataChild:OrdersHsk[] = [].concat(data_TuDangky,data_Dangky_con).filter(f=>!f['huy']);
        return forkJoin([this.loopGetThisinh(dataChild,150), of(data_Dangky_cha)])
      }))

        .subscribe({
        next:([dataOrder,dataParent])=>{


          const dataMap = dataOrder.map((m)=>{
            const user:User = m['user'];
            const thisinh:ThiSinhInfo = m['thisinh'];
            const parent:OrdersHsk = m.parent_id === 0 ? null : (dataParent.find(f=>f.id === m.parent_id) ?dataParent.find(f=>f.id === m.parent_id) : null);
            m['__status_converted'] = m.trangthai_thanhtoan;
            m['__capthi_converted'] = this.dmCapdo.length>0 && this.dmCapdo.find(f=>f.id === m.caphsk_id) ? this.dmCapdo.find(f=>f.id === m.caphsk_id).title : '';
            m['__hoten']= user && user['name'] ? user['name'] :(thisinh ? thisinh.hoten : '');
            m['__cccd_so']= user ? user.username :(thisinh ? thisinh.cccd_so : '');
            m['__phone']= user ? user.phone :(thisinh ? thisinh.phone : '');
            m['__email']= user ? user.email :(thisinh ? thisinh.email : '');
            m['__lephithi']= m.lephithi;
            m['__isInfo']= thisinh ? 1:0;
            m['__isAvata']= thisinh && thisinh.anh_chandung ? 1:0;
            m['__isCccdImg']= thisinh && thisinh.cccd_img_truoc && thisinh.cccd_img_truoc ? 1:0;
            m['__ngaysinh']= thisinh ? thisinh.ngaysinh :'';
            m['__gioitinh']= thisinh ? (thisinh.gioitinh === 'nam'? 'Nam': "Nữ"): '';
            // m['__lephithi']= m.lephithi;
            // m['__lephithi']= m.lephithi;

            if(parent){
                m['__ghichu']= parent && parent['user']? parent['user']['name']:'Đối tác đăng ký'  ;
            }else if ((m.user_id === m['created_by'] && m['updated_by'] === 0) || (m.user_id === m['created_by'] && m['updated_by'] === m.user_id) ){
              m['__ghichu']='Thí sinh tự đăng ký';
            }else {
              m['__ghichu']= 'Admin xét duyệt';
            }
            return m;
          })
          const dataGhichu = [...new Set(dataMap.map(m => m['__ghichu']))].map(value => ({ value }));
          this.dataView =dataMap;
          this.dataViewClone =dataMap;
          this.dataFillGhichu = [...dataGhichu];
          this.notifi.isProcessing(false);
          this.notifi.disableLoadingAnimationV2();
        },
        error:()=>{
          this.notifi.isProcessing(false);
          this.notifi.disableLoadingAnimationV2();
        }
      });
    }else{
      this.dataView =null;
      this.dataViewClone =null;
    }
  }



  logGetOrderByKehoachId(page:number,limit:number,kehoach_id:number,data:OrdersHsk[],recordsFiltered:number):Observable<OrdersHsk[]>{
    if (data.length < recordsFiltered) {


      return this.orderService.getDataBykehoachIdAndPageAndLimit(page,limit,kehoach_id).pipe(
        switchMap(m=>{

          return this.logGetOrderByKehoachId(page+1,limit,kehoach_id,data.concat(m['data']),m['recordsFiltered'])
        })
      )
    } else{
      return of(data);
    }
  }



   loopGetThisinh(data:OrdersHsk[],limit:number):Observable<OrdersHsk[]>{
     const missingThisinh = data.filter(m => !m['thisinh']);
     if (missingThisinh.length === 0) {
       return of(data);
     }

     const dataimport = missingThisinh.slice(0, limit).map(m => m.user_id);
     // return this.thisinhInfoService.getDataByUserIds(dataimport).pipe(
     //   switchMap((thsinh) => {
     //     // Cập nhật lại thông tin 'thisinh' cho các phần tử tương ứng
     //     data.forEach(m => {
     //       if (!m['thisinh']) {
     //         m['thisinh'] = thsinh.find(f => f.user_id === m.user_id);
     //       }
     //     });
     //     return this.loopGetThisinh(data, limit);
     //   })
     // );

     return this.thisinhInfoService.getDataByUserIds(dataimport).pipe(
       switchMap((thsinh) => {
         if (thsinh.length === 0) {
           missingThisinh.slice(0, limit).forEach(m => (m['thisinh'] = null));
           return of(data);
         }

         data.forEach(m => {
           if (!m['thisinh']) {
             m['thisinh'] = thsinh.find(f => f.user_id === m.user_id) || null;
           }
         });
         return this.loopGetThisinh(data, limit);
       })
     );
   }
  btnSearch(){

    const findData = this.formSave.value;
    let dataSearch = this.dataView;
    if(findData['trangthai_thanhtoan'] !== null){
      dataSearch = dataSearch.filter(f=> (findData['trangthai_thanhtoan'] === 1)? f.trangthai_thanhtoan === 1 : f.trangthai_thanhtoan !== 1 );
    }
    if(findData['caphsk_id'] !== null){
      dataSearch = dataSearch.filter(f=>f.caphsk_id === findData['caphsk_id']);
    }
    if(findData['isThontin'] !== null){
      dataSearch = dataSearch.filter(f=>f['__isInfo'] === findData['isThontin']);
    }
    if(findData['isAnhchandung'] !== null){
      dataSearch = dataSearch.filter(f=>f['__isAvata'] === findData['isAnhchandung']);
    }
    if(findData['isCccd'] !== null){
      dataSearch = dataSearch.filter(f=>f['__isCccdImg'] === findData['isCccd']);
    }

    if(findData['search_name'] ){
      const searchText:string= findData['search_name'].trim().toLowerCase();
      const regex = new RegExp(searchText, 'i');
      dataSearch = dataSearch.filter(f=>regex.test(f['__hoten'].toLowerCase()));
    }
    if(findData['search_cccd']){
      const searchText:string= findData['search_cccd'].trim();
      const regex = new RegExp(searchText, 'i');
      dataSearch = dataSearch.filter(f=>regex.test(f['__cccd_so']));
    }

    if(findData['search_ghichu']){
      const searchText:string= findData['search_ghichu'].trim();
      const regex = new RegExp(searchText, 'i');
      dataSearch = dataSearch.filter(f=>regex.test(f['__ghichu']));
    }

    this.dataViewClone = [...dataSearch];

  }

  exportDataFilter(){
    if (this.dataViewClone .length>0) {
      this.notifi.isProcessing(true);
      this.modalService.open(this.templateWaiting, WAITING_POPUP);
      const datacheck :OrdersHsk[] = JSON.parse(JSON.stringify(this.dataViewClone)).map((m,index)=>{

        return{
          index: index+1,
          status: m.trangthai_thanhtoan === 1 ? 'Thanh toán thành công': 'Chưa thanh toán',
          hoten: m['__hoten'],
          ngaysinh: m['__ngaysinh'],
          gioitinh: m['__gioitinh'],
          cccd: m['__cccd_so'],
          email: m['__email'],
          phone: m['__phone'],
          lephithi: m['__lephithi'],
          capthi: m['__capthi_converted'],
          has_info:m['__isInfo'] ==1 ? 'Đã cập nhật':'Chưa cập nhật',
          has_avata:m['__isAvata'] ==1 ? 'Đã cập nhật':'Chưa cập nhật',
          has_cccd:m['__isCccdImg'] ==1 ? 'Đã cập nhật':'Chưa cập nhật',
          ghichu: m['__ghichu'],
        }

      });

      this.notifi.isProcessing(false);

      if (datacheck) {
        this.modalService.dismissAll();
        this.exportThiSinhDuThiService.exportToLongHskThongke(datacheck, this.dotthi_select.dotthi);
      }

    } else {
      this.notifi.toastError('Vui lòng chọn đợt thi');
      this.notifi.isProcessing(false);

    }
  }

}
