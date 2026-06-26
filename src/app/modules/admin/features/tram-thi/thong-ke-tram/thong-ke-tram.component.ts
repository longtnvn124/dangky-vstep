import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonModule} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {RippleModule} from "primeng/ripple";
import {SharedModule} from "@shared/shared.module";
import {TableModule} from "primeng/table";
import {TooltipModule} from "primeng/tooltip";
import {DonVi} from "@shared/models/danh-muc";
import {KeHoachThi, KehoachthiVstepService} from "@shared/services/vstep/kehoachthi-vstep.service";
import {OrdersVstep, VstepOrdersService} from "@shared/services/vstep-orders.service";
import {NotificationService} from "@core/services/notification.service";
import {ThisinhInfoService} from "@shared/services/thisinh-info.service";

import {DonViService} from "@shared/services/don-vi.service";
import {AuthService} from "@core/services/auth.service";
import {ConditionOption} from "@shared/models/condition-option";
import {forkJoin, Observable, of, switchMap} from "rxjs";
import {map} from "rxjs/operators";
import {User} from "@core/models/user";
import {ThiSinhInfo} from "@shared/models/thi-sinh";
import {OvicQueryCondition} from "@core/models/dto";
import {
  KehoachthiDiemduthi,
  KehoachthiDiemthiVstepService
} from "@shared/services/vstep/kehoachthi-diemthi-vstep.service";


@Component({
  selector: 'app-thong-ke-tram',
  standalone: true,
    imports: [CommonModule, ButtonModule, DropdownModule, FormsModule, InputTextModule, MatProgressBarModule, ReactiveFormsModule, RippleModule, SharedModule, SharedModule, TableModule, TooltipModule],
  templateUrl: './thong-ke-tram.component.html',
  styleUrls: ['./thong-ke-tram.component.css']
})
export class ThongKeTramComponent implements OnInit {

  @ViewChild('templateWaiting') templateWaiting: ElementRef;

  // dataDonvi: DonVi[] = [];
  dataDonvi: KehoachthiDiemduthi[] = [];
  kehoachthi:KeHoachThi[];

  dataView:OrdersVstep[];
  dataViewClone:OrdersVstep[];
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

    private notifi: NotificationService,
    private fb: FormBuilder,
    private thisinhInfoService: ThisinhInfoService,
    private kehoachthiVstepService:KehoachthiVstepService,
    private donViService:DonViService,
    private orderService:VstepOrdersService,
    private auth:AuthService,
    private kehoachthiDiemthiVstepService: KehoachthiDiemthiVstepService

  ) {
    this.formSave = this.fb.group({
      kehoach_id:[null],
      trangthai_thanhtoan:[null],
      diemduthi_id:[null],
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

    const conditionKehoach:ConditionOption= {
      condition:[],
      page:'1',
      set:[
        {label:'limit',value:'-1'},
      ]
    }


    this.kehoachthiVstepService.getDataByPageNew(conditionKehoach).pipe(map(m=>m.data))
    .subscribe({
      next:(kehoachthi)=>{
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

    const conditionKehoachDiemrthi :ConditionOption = {
      condition:[
        {
          conditionName:'kehoach_id',
          condition:OvicQueryCondition.equal,
          value:event.toString()
        }
      ],
      page:'1',
      set:[
        {
          label:'limit',value:'-1',
        },
        {
          label:'with',value:'donvi',
        },
      ]
    }

    if(event !== null){
      this.notifi.isProcessing(true);
      this.logGetOrderByKehoachId(1,150 ,event,[],1).pipe( switchMap(order=>{
        const data_TuDangky  = order.filter(f=> f.parent_id === 0 && f.diemduthi_id !== 0 );
        const data_Dangky_cha  = order.filter(f=>f.diemduthi_id === 0);
        const data_Dangky_con  = order.filter(f=>f.parent_id && f.diemduthi_id !== 0);
        const dataChild:OrdersVstep[] = [].concat(data_TuDangky,data_Dangky_con).filter(f=>!f['huy']);
        return forkJoin([this.loopGetThisinh(dataChild,150), of(data_Dangky_cha), this.kehoachthiDiemthiVstepService.getDataByPageNew(conditionKehoachDiemrthi).pipe(map(m=>m.data))])
      }))

        .subscribe({
          next:([dataOrder,dataParent,dataDiemduthi])=>{

            this.dataDonvi = dataDiemduthi.map(m=>{
              m['_title'] = m['donvi']? m['donvi']['title']:'';
              return m;
            })
            const dataMap = dataOrder.map((m)=>{
              const user:User = m['user'];
              const thisinh:ThiSinhInfo = m['thisinh'];
              const parent:OrdersVstep = m.parent_id === 0 ? null : (dataParent.find(f=>f.id === m.parent_id) ?dataParent.find(f=>f.id === m.parent_id) : null);
              m['__status_converted'] = m.trangthai_thanhtoan;
              m['__capthi_converted'] = this.dataDonvi.length>0 && this.dataDonvi.find(f=>f.diemduthi_id === m.diemduthi_id) ? this.dataDonvi.find(f=>f.diemduthi_id === m.diemduthi_id)['_title'] : '';
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



  logGetOrderByKehoachId(page:number,limit:number,kehoach_id:number,data:OrdersVstep[],recordsFiltered:number):Observable<OrdersVstep[]>{
    if (data.length < recordsFiltered) {

      const condi: ConditionOption= {
        condition:[
          {
            conditionName:'trangthai_thanhtoan',
            condition:OvicQueryCondition.equal,
            value:'1'
          },
          {
            conditionName:'kehoach_id',
            condition:OvicQueryCondition.equal,
            value:kehoach_id.toString()
          },
          {
            conditionName:'created_by',
            condition:OvicQueryCondition.equal,
            value:this.auth.user.id.toString()
          },
        ],
        page:page.toString(),
        set:[
          {label:'limit',value:limit.toString()}
        ]
      }

      return this.orderService.getDataByPageNew(condi).pipe(
        switchMap(m=>{

          return this.logGetOrderByKehoachId(page+1,limit,kehoach_id,data.concat(m.data),m.recordsFiltered)
        })
      )
    } else{
      return of(data);
    }
  }



  loopGetThisinh(data:OrdersVstep[],limit:number):Observable<OrdersVstep[]>{
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
    if(findData['diemduthi_id'] !== null){
      dataSearch = dataSearch.filter(f=>f.diemduthi_id == findData['diemduthi_id']);
    }
    if(findData['isThontin'] !== null){
      dataSearch = dataSearch.filter(f=>f['__isInfo'] == findData['isThontin']);
    }
    if(findData['isAnhchandung'] !== null){
      dataSearch = dataSearch.filter(f=>f['__isAvata'] == findData['isAnhchandung']);
    }
    if(findData['isCccd'] !== null){
      dataSearch = dataSearch.filter(f=>f['__isCccdImg'] == findData['isCccd']);
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

}
