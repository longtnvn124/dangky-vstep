import {Component, Input, OnInit} from '@angular/core';

import {NotificationService} from "@core/services/notification.service";
import {forkJoin, Observable} from "rxjs";
import {NgPaginateEvent} from "@shared/models/ovic-models";
import {DropdownModule} from "primeng/dropdown";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {TableModule} from "primeng/table";
import {SharedModule} from "@shared/shared.module";
import {NgClass} from "@angular/common";
import {PaginatorModule} from "primeng/paginator";
import {DmDiemduthi, DmDiemDuThiService} from "@shared/services/dm-diem-du-thi.service";
import {OrdersVstep, VstepOrdersService} from "@shared/services/vstep-orders.service";
import {ConditionOption} from "@shared/models/condition-option";
import {OvicQueryCondition} from "@core/models/dto";
import {KeHoachThi} from "@shared/services/kehoachthi-vstep.service";


@Component({
  selector: 'app-danh-sach-thi-sinh',
  templateUrl: './danh-sach-thi-sinh.component.html',
  styleUrls: ['./danh-sach-thi-sinh.component.css'],
  imports: [
    DropdownModule,
    ButtonModule,
    RippleModule,
    TableModule,
    SharedModule,
    NgClass,
    PaginatorModule
  ],
  standalone: true
})
export class DanhSachThiSinhComponent implements OnInit {
  @Input() set kehoachthi(a:KeHoachThi){
    console.log(a)
    this.page = 1;
    this.recordsTotal = 0;

    this._kehoachthi = a;

    this.loadInit();
  }
  dmDiemduthi: DmDiemduthi[] = [];
  listData: OrdersVstep[] = [];


  _kehoachthi : KeHoachThi ;
  isLoading: boolean=false;

  page:number = 1;
  rows:number =  20;
  recordsTotal:number = 0;

  header_excel=['证件姓名*','中文姓名','证件类型*','其它证件名称','证件编号*','性别*','出生日期*','国籍代码*'	,'缴费状态',
    '母语代码*','邮箱',	'联系电话'	,'学习汉语年限*',	'备注',	'考生类型*',	'考生民族*','关联HSKK级别','Nguồn đăng ký','Địa chỉ thường trú'
  ];
  constructor(
    private dmDiemDuThiService: DmDiemDuThiService,
    private ordersService: VstepOrdersService,
    private notificationService:NotificationService,
  ) {
  }

  ngOnInit(): void {
  }


  loadInit(){
    const conditionDm:ConditionOption = {
      condition:[],
      page: '1',
      set:[
        {label:'limit',value:'-1'}
      ]
    }


    forkJoin([
      this.dmDiemDuThiService.getDataByPageNew(conditionDm),
      this.getOrder(this.page,this.rows),
    ]).subscribe({
      next:([dm,orders])=>{
        console.log(dm)
        this.dmDiemduthi = dm.data;
        console.log(orders)
        this.recordsTotal= orders.recordsFiltered;
        this.listData = orders.data.map((m,index)=>{

          m['_index']= (this.page - 1) * this.rows + index +1;
          m['_diemduthi_name'] = dm.data.find(f=>f.id == m.diemduthi_id) ? dm.data.find(f=>f.id == m.diemduthi_id).title:'';
          m['__trangthai_thanhtoan'] = m.trangthai_thanhtoan === 0 ? 'Chưa thanh toán' : 'Đã thanh toán';

          return m;
        })
      },error:()=>{
        this.notificationService.toastError('Mất kết nối với máy chủ');
        this.notificationService.isProcessing(false);
      }
    })
  }


  private getOrder(page:number, limit:number):Observable<{data: OrdersVstep[], recordsFiltered: number}>{
    const conditionOrder:ConditionOption = {
      condition:[
        {
          conditionName:'diemduthi_id',
          condition:OvicQueryCondition.notEqual,
          value:'0'
        },
        {
          conditionName:'kehoach_id',
          condition:OvicQueryCondition.equal,
          value:this._kehoachthi.id.toString()
        }
      ],page:page.toString(),
      set:[
        { label:'limit',value:limit.toString()},
        { label:'with',value:'thisinh'},
      ]
    }

    return this.ordersService.getDataByPageNew(conditionOrder)
  }

  getDataOrderBypage(page:number){
    this.getOrder(page, this.rows).subscribe({
      next:(orders)=>{
        this.recordsTotal= orders.recordsFiltered;
        this.listData = orders.data.map((m,index)=>{

          m['_index']= (this.page - 1) * this.rows + index +1;
          m['_diemduthi_name'] = !!this.dmDiemduthi.find(f=>f.id == m.diemduthi_id) ?  this.dmDiemduthi.find(f=>f.id == m.diemduthi_id).title:'';
          m['__trangthai_thanhtoan'] = m.trangthai_thanhtoan === 0 ? 'Chưa thanh toán' : 'Đã thanh toán';
          return m;
        })

      },error:()=>{
        this.notificationService.toastError('Mất kết nối với máy chủ');
        this.notificationService.isProcessing(false);
      }
    })
  }

  paginate({page}: NgPaginateEvent) {
    this.page = page + 1;
    this.getDataOrderBypage(page + 1);
  }


  // capdo_hsk_id_select :number = null;
  // slelectDrop(event:number){
  //   this.capdo_hsk_id_select = event;
  //   this.getDataOrder(this._kehoachthi,this.page);
  // }

  // btnExportDataThisinhByKehoachV2(){
  //
  //   this.notificationService.loadingAnimationV2({text:'Đang tải dữ liệu ',  process: {percent: 0}});
  //   this.notificationService.isProcessing(true);
  //   this.hskOrdersService.getDataByKehoachIdAndNotwidthXuatdanhSach(this._kehoachthi.id,false,1).pipe(switchMap(prj=>{
  //     // const ids_thisinh = Array.from(new Set(prj.map(m=>m.thisinh_id)));
  //
  //     this.notificationService.loadingAnimationV2({text:'Đang tải dữ liệu ',  process: {percent: 25}});
  //
  //     // const parent_ids = Array.from(new Set(prj.map(m=>m.parent_id).filter(f=>f !== 0)));
  //     return forkJoin([
  //       of(prj),
  //       this.hskSummaryService.getDsThisinhByKehoachId(this._kehoachthi.id).pipe(map(m=>{
  //         this.notificationService.loadingAnimationV2({text:'Đang tải dữ liệu ',  process: {percent: 50}});
  //
  //         return m})),
  //       this.danhMucHskAddToolService.getDataUnlimitByType("quoctich").pipe(map(m=>{
  //         this.notificationService.loadingAnimationV2({text:'Đang tải dữ liệu ',  process: {percent: 75}});
  //         return m})),
  //       this.danhMucHskAddToolService.getDataUnlimitByType("ngonngume").pipe(map(m=>{
  //         this.notificationService.loadingAnimationV2({text:'Đang tải dữ liệu ',  process: {percent: 100}});
  //
  //         return m})),
  //       // this.hskOrdersService.getDataByparentIds(parent_ids,'id,trangthai_thanhtoan,status')
  //
  //     ])
  //   })).subscribe({
  //     next:([order,info,quoctich,ngonngume])=>{
  //
  //       const dataEx = [];
  //       const parent_ids = Array.from(new Set(order.map(m=>m.parent_id).filter(f=>f !== 0)));
  //       const data_TuDangky  = order.filter(f=>f['created_by'] === f.user_id && f.parent_id === 0 && f.caphsk_id !== 0 );
  //       const data_Dangky_cha  = order.filter(f=>f.caphsk_id === 0);
  //       // const data_Dangky_con  = order.filter(f=>f['created_by'] !== f.user_id && parent_ids.includes(f.parent_id) );
  //       const data_Dangky_con  = order.filter(f=>f.parent_id && f.caphsk_id !== 0);
  //
  //       const data_map = [].concat(data_TuDangky,data_Dangky_con).filter(f=> !f['huy']);
  //       for(let i = 1;i<=6;i++){
  //          const order_select  = data_map.filter(f=>f.caphsk_id === i ).length>0?  data_map.filter(f=>f.caphsk_id === i && !f['huy']).map((m,index)=>{
  //            const thisinh =  info.find(f=>f.user_id == m.user_id);
  //            // const thisinh = m['thisinh'];
  //            const user = m['user'];
  //            const parent  = m.parent_id !== 0 ? data_Dangky_cha.find(f=>f.id === m.parent_id): null;
  //            const _index_table = index+1;
  //            const _hoten = thisinh ? this.replaceHoten(thisinh.hoten): (user && user['name'] ? this.replaceHoten(user['name']): '');
  //            const _hoten_tiengtrung = thisinh && thisinh.hoten_tiengtrung ? thisinh.hoten_tiengtrung: '';
  //            const _ngaysinh = thisinh ? `'` + this.replaceDatebth(thisinh.ngaysinh): '';
  //            const _loai_giayto = thisinh && thisinh.loai_giayto? thisinh.loai_giayto : '身份证';
  //            const _loai_giayto_khac =thisinh && thisinh.loai_giaytokhac? thisinh.loai_giaytokhac : '';
  //            const _so_cccd:string = thisinh ? ("'" + thisinh.cccd_so.toString()):(user && user['username'] ? user['username']: '');
  //            const _gioitinh = thisinh ? (thisinh.gioitinh === 'nam' ? '男' :'女'): '';
  //            const _ma_quoctich = thisinh && thisinh.ma_quoctich  ? thisinh.ma_quoctich : '542';
  //            const user_thanhtoan= parent ? parent.trangthai_thanhtoan : m.trangthai_thanhtoan;
  //            const _trangthia_thanhtoan = user_thanhtoan === 1 ? '已缴费': '未缴费';
  //            const _ngonngu_me = thisinh && thisinh.ngonngu_me ? thisinh.ngonngu_me:'388';
  //            const _email = thisinh ? thisinh.email :(user ? user['email']: '');
  //            const _phone = thisinh && `'` + thisinh.phone ? thisinh.phone : (user ? `'` + user['phone']: '');
  //            const _namhoc_tiengtrung = thisinh && thisinh.namhoc_tiengtrung ? thisinh.namhoc_tiengtrung : '';
  //            const _ghichu = '';
  //            const _loai_unngvien =  thisinh && thisinh.loai_unngvien ? thisinh.loai_unngvien: '普通';
  //            const _quoctich_ungvien = thisinh && thisinh.quoctich_ungvien ? thisinh.quoctich_ungvien :  '';
  //            const _hskk_lever= this.dmCapdo.find(f=>f.id === i)? this.hskk_lever.find(f=>f.value === this.dmCapdo.find(f=>f.id === i).hskk_lever ).ten_tiengtrung :' ';
  //
  //            let text = ''
  //            if(parent){
  //              text= parent && parent['user']? parent['user']['name']:'Đối tác đăng ký'  ;
  //            }else if ((m.user_id === m['created_by'] && m['updated_by'] === 0) || (m.user_id === m['created_by'] && m['updated_by'] === m.user_id) ){
  //              text='Thí sinh tự đăng ký';
  //            }else {
  //              text= 'Admin xét duyệt';
  //            }
  //
  //            const diachi =thisinh && thisinh['thuongtru_diachi']? thisinh['thuongtru_diachi']['fullAddress'] : '';
  //
  //
  //            return user_thanhtoan === 1 ? {
  //              _hoten:_hoten,
  //              _hoten_tiengtrung:_hoten_tiengtrung,
  //              _loai_giayto:_loai_giayto,
  //              _loai_giayto_khac:_loai_giayto_khac,
  //              _so_cccd :_so_cccd,
  //              _gioitinh:_gioitinh,
  //              _ngaysinh:_ngaysinh,
  //              _ma_quoctich:_ma_quoctich,
  //              _trangthia_thanhtoan:_trangthia_thanhtoan,
  //              _ngonngu_me:_ngonngu_me,
  //              _email:_email,
  //              _phone:_phone,
  //              _namhoc_tiengtrung:_namhoc_tiengtrung,
  //              _ghichu:_ghichu,
  //              _loai_unngvien:_loai_unngvien,
  //              _quoctich_ungvien:_quoctich_ungvien,
  //              _hskk_lever:_hskk_lever,
  //              _created:text,
  //              _diachi:diachi
  //
  //            }: null;
  //
  //          }): [];
  //         dataEx.push(order_select.filter(f=>f!== null));
  //       }
  //
  //
  //       const ngonngumeConvenrt = ngonngume.map(m=>{
  //         return {ma_ngonngu:m['ma_ngonngu'],ten:m['ten'],ten_tiengtrung:m['ten_tiengtrung']};
  //       })
  //       const quoctichConvenrt = quoctich.map(m=>{
  //         return {ma_quoctich:m['ma_quoctich'],ten:m['ten'],ten_tiengtrung:m['ten_tiengtrung']};
  //       })
  //
  //       this.exportExcelHskService.exportExcel(dataEx, ngonngumeConvenrt,quoctichConvenrt,this.header_excel,this._kehoachthi.dotthi);
  //       this.notificationService.disableLoadingAnimationV2()
  //       this.notificationService.isProcessing(false);
  //
  //     },error:()=>{
  //       this.notificationService.isProcessing(false);
  //       this.notificationService.toastError('Load dữ liệu không thanh công ');
  //       this.notificationService.disableLoadingAnimationV2()
  //
  //     }
  //   })
  //
  // }


  replaceHoten(str:string):string{
    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Loại bỏ dấu
    str = str.replace(/đ/g, "d").replace(/Đ/g, "D"); // Thay 'đ' và 'Đ' bằng 'd' và 'D'
    return str.trim().toUpperCase();

  }

  replaceDatebth(dateString:string) {
    const [day, month, year] = dateString.trim().split("/");
    return `${year}-${month}-${day}`;
  }







}
