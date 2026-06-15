import {Component, Input, OnInit} from '@angular/core';
import {forkJoin, Observable, of, switchMap} from "rxjs";
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
import {KeHoachThi} from "@shared/services/vstep/kehoachthi-vstep.service";
import {HskSummaryService} from "@shared/services/hsk-summary.service";
import {NotificationService} from "@core/services/notification.service";
import {User} from "@core/models/user";
import {ThiSinhInfo} from "@shared/models/thi-sinh";
import {DonViService} from "@shared/services/don-vi.service";
import {Auth} from "@core/models/auth";
import {AuthService} from "@core/services/auth.service";
import {DonVi} from "@shared/models/danh-muc";
import {ExpThisinhDuthiService} from "@shared/services/export/exp-thisinh-duthi.service";


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
    this.page = 1;
    this.recordsTotal = 0;

    this._kehoachthi = a;

    this.loadInit();
  }
  dmDiemduthi: DonVi[] = [];
  listData: OrdersVstep[] = [];


  _kehoachthi : KeHoachThi ;
  isLoading: boolean=false;

  page:number = 1;
  rows:number =  20;
  recordsTotal:number = 0;


  constructor(
    private dmDiemDuThiService: DmDiemDuThiService,
    private donViService: DonViService,
    private ordersService: VstepOrdersService,
    private notifi:NotificationService,
    private auth:AuthService,
    private expThisinhDuthiService: ExpThisinhDuthiService
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
      this.donViService.getChildren(this.auth.user.donvi_id),
      this.getOrder(this.page,this.rows),
    ]).subscribe({
      next:([dm,orders])=>{

        this.dmDiemduthi = dm;

        this.recordsTotal= orders.recordsFiltered;
        this.listData = orders.data.map((m,index)=>{

          m['_index']= (this.page - 1) * this.rows + index +1;
          m['_diemduthi_name'] = dm.find(f=>f.id == m.diemduthi_id) ? dm.find(f=>f.id == m.diemduthi_id).title:'';
          m['__trangthai_thanhtoan'] = m.trangthai_thanhtoan === 0 ? 'Chưa thanh toán' : 'Đã thanh toán';

          return m;
        })
      },error:()=>{
        this.notifi.toastError('Mất kết nối với máy chủ');
        this.notifi.isProcessing(false);
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

          // ['__ghichu'] == parent && parent['user'] && parent['user']['name'] ? (parent['user']['name'] + ' đăng ký' ):'';
          return m;
        })

      },error:()=>{
        this.notifi.toastError('Mất kết nối với máy chủ');
        this.notifi.isProcessing(false);
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

  btnExportDataThisinhByKehoachV2(){

      this.notifi.isProcessing(true);


      // this.ordersService.getDataBykehoachIdAndSelectforThongke(this.kehoach_id,'id,kehoach_id,caphsk_id,lephithi,trangthai_thanhtoan,user_id,parent_id,created_by,updated_by')
      this.loopGetOrderBy(1,200,this._kehoachthi.id,[],1,'id,kehoach_id,diemduthi_id,lephithi,trangthai_thanhtoan,thoigian_thanhtoan,user_id,parent_id,created_by,updated_by','1')
        .pipe(switchMap(m=>{
          const idsParent = Array.from(new Set(m.filter(a => a.parent_id !== 0).map(a => a.parent_id)));
          return forkJoin([of(m),idsParent.length> 0? this.ordersService.getDataByparentIds(idsParent,'id,kehoach_id,diemduthi_id,lephithi,trangthai_thanhtoan,thoigian_thanhtoan,user_id,parent_id,created_by,updated_by'):of([])]);
        }))
        .subscribe({
          next:([dataOrder,dataParent])=>{
            const dataMap = dataOrder.map((m,index)=>{
              const user:User = m['user'];
              const thisinh:ThiSinhInfo = m['thisinh'];
              const parent:OrdersVstep = m.parent_id === 0 ? null : dataParent.find(f=>f.id === m.parent_id);
              m['__index'] = index + 1;
              m['__madk'] = 'hsk' + m.id;
              m['__status_converted'] = m.trangthai_thanhtoan === 1 ? 'Thanh toán thành công': (  m.trangthai_thanhtoan === 0 ? 'Chưa thanh toán' : (m.trangthai_thanhtoan === 2 ? 'Giao dịch đang sử lý' : ''));
              m['__capthi_converted'] = this.dmDiemduthi.length>0 && this.dmDiemduthi.find(f=>f.id == m.diemduthi_id) ? this.dmDiemduthi.find(f=>f.id === m.diemduthi_id).title : '';
              m['__hoten']= user ? user['name'] :(thisinh ? thisinh.hoten : '');
              m['__cccd_so']= user ? user.username :(thisinh ? thisinh.cccd_so : '');
              m['__email']= user && user.email ? user.email :(thisinh && thisinh.email ? thisinh.email : '');
              m['__ngaysinh']= thisinh ? thisinh.ngaysinh : '';
              m['__gioitinh']= thisinh && thisinh.gioitinh ? (thisinh.gioitinh === 'nam' ?'Nam': 'Nữ' ) : '';
              m['__phone']= user ? user.phone :(thisinh ? thisinh.phone : '');
              m['__lephithi']= m.lephithi;
              m['__isInfo']= thisinh ? 1:0;
              m['__isAvata']= thisinh && thisinh.anh_chandung ? 1:0;
              m['__isCccdImg']= thisinh && thisinh.cccd_img_truoc && thisinh.cccd_img_truoc ? 1:0;
              m['__lephithi']= m.lephithi;

              if(parent){
                m['__ghichu']= parent && parent['user']? parent['user']['name'] + ' đăng ký':'Đối tác đăng ký'  ;
              }else if ((m.user_id === m['created_by'] && m['updated_by'] === 0) || (m.user_id === m['created_by'] && m['updated_by'] === m.user_id) ){
                m['__ghichu']='Thí sinh tự đăng ký';
              }else {
                m['__ghichu']= 'Admin xét duyệt';
              }
              return {
                index: m['__index'],
                madk: m['__madk'],
                status: m['__status_converted'],
                hoten: m['__hoten'],
                ngaysinh: m['__ngaysinh'],
                gioitinh: m['__gioitinh'],
                cccd: m['__cccd_so'],
                email: m['__email'],
                phone: m['__phone'],
                capthi: m['__capthi_converted'],
                ghichu: m['__ghichu'],
                thoigian_thanhtoan:m['thoigian_thanhtoan'] ? this.formatSQLDateTime( new Date(m['thoigian_thanhtoan'])):''
              };
            });

            if (dataMap) {

              const header = ['STT','Mã ĐK','Trạng thái','Họ và tên','Ngày sinh','Giới tính','CCCD','Email','Số ĐT', 'Điểm dự thi','Ghi chú','Thời gian thanh toán']

              this.expThisinhDuthiService.export(dataMap,this._kehoachthi.title, this._kehoachthi.title,[header],'Danh sách đăng ký thành công');
              this.notifi.isProcessing(false);

            }


            this.notifi.isProcessing(false);
            this.notifi.disableLoadingAnimationV2();
          },
          error:()=>{
            this.notifi.isProcessing(false);
            this.notifi.disableLoadingAnimationV2();
            this.notifi.toastError('Load dữ liệu không thành công');

          }
        });
    }

  loopGetOrderBy(page:number,limit:number, kehoach_id:number, data:OrdersVstep[] ,recordsFiltered:number, select:string, trangthai_thanhtoan:string):Observable<OrdersVstep[]>{
    if (data.length < recordsFiltered) {

      return this.ordersService.getDataBykehoachIdAndSelectforThongkeV2(page,limit,kehoach_id,select,trangthai_thanhtoan).pipe(
        switchMap(m=>{

          return this.loopGetOrderBy(page+1,limit,kehoach_id,data.concat(m['data']),m['recordsFiltered'],select,trangthai_thanhtoan)
        })
      )
    } else{
      return of(data);
    }
  }




  // =================================================

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
