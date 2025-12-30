import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NotificationService} from "@core/services/notification.service";
import {debounceTime, filter, forkJoin, Observable, of, Subject, Subscription, switchMap} from "rxjs";
import {Paginator, PaginatorModule} from 'primeng/paginator';
import {NgPaginateEvent} from "@shared/models/ovic-models";
import {BUTTON_NO, BUTTON_YES} from "@core/models/buttons";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {WAITING_POPUP} from "@shared/utils/syscat";
import {ExportThiSinhDuThiService} from "@shared/services/export-thi-sinh-du-thi.service";

import {User} from "@core/models/user";
import {ThiSinhInfo} from "@shared/models/thi-sinh";
import {OrdersVstep, VstepOrdersService} from "@shared/services/vstep-orders.service";
import {DmDiemDuThiService} from "@shared/services/dm-diem-du-thi.service";
import {KeHoachThi, KehoachthiVstepService} from "@shared/services/kehoachthi-vstep.service";
import {ConditionOption} from "@shared/models/condition-option";
import {OvicQueryCondition} from "@core/models/dto";
import {map} from "rxjs/operators";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {NgClass, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {SharedModule} from "@shared/shared.module";
import {CheckboxModule} from "primeng/checkbox";
import {TableModule} from "primeng/table";
import {MatMenuModule} from "@angular/material/menu";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {InputTextModule} from "primeng/inputtext";
import {TooltipModule} from "primeng/tooltip";
import {
  ThiSinhDangKyThiComponent
} from "@modules/admin/features/danh-sach-du-thi/thi-sinh-du-thi/thi-sinh-dang-ky-thi/thi-sinh-dang-ky-thi.component";
import {
  ThongTinThiSinhComponent
} from "@modules/admin/features/danh-sach-du-thi/thi-sinh-du-thi/thong-tin-thi-sinh/thong-tin-thi-sinh.component";

@Component({
  selector: 'app-thi-sinh-du-thi',
  templateUrl: './thi-sinh-du-thi.component.html',
  styleUrls: ['./thi-sinh-du-thi.component.css'],
  standalone: true,
  imports: [
    MatProgressBarModule,
    PaginatorModule,
    NgClass,
    SharedModule,
    NgSwitch,
    NgSwitchCase,
    CheckboxModule,
    TableModule,
    MatMenuModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    NgIf,
    TooltipModule,
    ThiSinhDangKyThiComponent,
    ThongTinThiSinhComponent
  ]
})
export class ThiSinhDuThiComponent implements OnInit {
  @ViewChild('fromUser', {static: true}) fromUser: TemplateRef<any>;
  @ViewChild('formregister', {static: true}) formregister: TemplateRef<any>;
  @ViewChild('templateWaiting') templateWaiting: ElementRef;
  @ViewChild(Paginator) paginator: Paginator;

  isLoading     : boolean = true;
  loadInitFail  : boolean = false;

  dsKehoachthi  : KeHoachThi[];

  recordsTotal  : number = 0 ;
  listData      : OrdersVstep[] = [];
  dataSelct     : OrdersVstep[] = [];
  page          : number = 1;
  kehoach_id    : number = 0;


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

  constructor(

    private ordersService:VstepOrdersService,
    private notifi: NotificationService,

    private dmDiemDuThiService:DmDiemDuThiService,
    private kehoachthiVstepService : KehoachthiVstepService,

    private modalService: NgbModal,
    private exportThiSinhDuThiService: ExportThiSinhDuThiService
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
    const conditionKehoach: ConditionOption = {
      condition: [

      ],page: '1',
      set:[
        { label:'limit', value:'-1'},
      ]
    }


    this.kehoachthiVstepService.getDataByPageNew(conditionKehoach).subscribe({
      next:({data})=>{
        this.dsKehoachthi = data;
        if (this.dsKehoachthi) {
          this.loadData(1);
        }
      },error:()=>{
        this.notifi.isProcessing(false);
        this.notifi.toastError('Load dữ liệu không thành công');
      }
    })

  }

  loadData(page: number, kehoach_id?: number, search?: string,) {
    this.selectDataByCheckbox({checker:false});
    this.isLoading = true;
    this.notifi.isProcessing(true);

    const condition :ConditionOption = {
      condition:[
        {
          conditionName:'diemduthi_id',
          condition:OvicQueryCondition.notEqual,
          value: '0'
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
    if(this.statusSelect ===1 ){
      condition.condition.push({
        conditionName:'trangthai_thanhtoan',
        condition:OvicQueryCondition.equal,
        value: '1'
      })
    }
    if(this.statusSelect ===0 ){
      condition.condition.push({
        conditionName:'trangthai_thanhtoan',
        condition:OvicQueryCondition.notEqual,
        value: '1'
      })
    }
    this.ordersService.getDataByPageNew(condition).pipe(switchMap(m=>{
      const diemduthi_ids = Array.from(new Set(m.data.map(a=>a.diemduthi_id)));
      const parent_ids = Array.from(new Set(m.data.map(a=>a.parent_id).filter(f=>f !== 0)));

      const conditionDdiemduthi:ConditionOption = {
        condition : [
          { conditionName: 'id',condition: OvicQueryCondition.equal, value:diemduthi_ids.toString(),orWhere:'in' }
        ],
        page:'1',
        set:[{
          label:'limit',value:diemduthi_ids.length.toString(),
        }]
      }

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
        this.dmDiemDuThiService.getDataByPageNew(conditionDdiemduthi).pipe(map(n=>n.data)),
        this.ordersService.getDataByPageNew(conditionOrderParent).pipe(map(m=>m.data))
      ])

    })).subscribe({
      next:([{data,recordsFiltered},diemduthi,orderParent])=>{
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
          m['__dotthi_coverted'] = this.dsKehoachthi.find(f => f.id === m.kehoach_id) ? this.dsKehoachthi.find(f => f.id === m.kehoach_id).title : '';
          // m['__monthi_covered'] = this.dsCapdo.find(f=>f.id === m.caphsk_id) ? m.mon_id.map(b => this.dsMon.find(f => f.id == b) ? this.dsMon.find(f => f.id == b) : []) : [];

          m['__status_converted'] = m.trangthai_thanhtoan ;

          m['__time_thanhtoan'] =m['thoigian_thanhtoan'] ? this.formatSQLDateTime( new Date(m['thoigian_thanhtoan'])):'';
          m['__diemthi_convenrtd'] = diemduthi.length>0 && diemduthi.find(f=>f.id === m.diemduthi_id) ? diemduthi.find(f=>f.id === m.diemduthi_id).title : '';
          m['__ghichu'] = parent && parent['user'] && parent['user']['name'] ? (parent['user']['name'] + ' đăng ký' ):'';
          return m;
        }) : [];

        this.notifi.isProcessing(false);
        this.isLoading = false;
      },error:()=>{
        this.notifi.isProcessing(false);
        this.isLoading = false;
        this.notifi.toastError('Load dữ liệu không thành công');
      }
    })


  }

  loadDropdow(event) {
    console.log(event)
    // if(!event){
    //   return
    // }

    this.kehoach_id = event ? event.id: null;
    this.page = 1;
    this.loadData(this.page, this.kehoach_id, this.search);
  }

  statusSelect : number
  loadDropdowStatusTT(event) {

    this.statusSelect = event;
    this.page = 1;
    this.loadData(this.page, this.kehoach_id, this.search);
  }

  closeForm() {
    this.notifi.closeSideNavigationMenu(this.menuName);
  }

  // onSearch(text: string) {
  //   // this.dataSelct = [];
  //   this.search = text;
  //   this.paginator.changePage(1);
  //   this.page = 1;
  //   this.loadData(1, this.kehoach_id, text);
  // }

  paginate({page}: NgPaginateEvent) {
    this.page = page + 1;
    this.dataSelct = [];
    this.loadData(this.page,this.kehoach_id, this.search);
  }

  thisinh_id: number;

  searchContentByInput(text: string) {
    this.page = 1;

    let viTri = text.indexOf("vsat");

    this.search = viTri === -1 ? text.trim() : text.slice(viTri + 4).trim()


    this.loadData(1, this.kehoach_id, this.search);
  }

  onInputChange(event: string) {

    this.inputChanged.next(event);
  }

  btnViewTT(item: OrdersVstep) {
    this.thisinh_id = item.user_id;

    this.notifi.openSideNavigationMenu({
      name: this.menuName,
      template: this.fromUser,
      size: this.sizeFullWidth,
      offsetTop: '0px'
    });
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
      // this.modalService.open(this.templateWaiting, WAITING_POPUP);
      // this.modalService.dismissAll();
    } else {
      this.notifi.toastWarning('Vui lòng chọn thi sinh');
    }
  }
  async btnDelete_ids(){
    if (this.dataSelct.length > 0) {
      const select_ids = this.dataSelct.map(m => m.id);
      const select_leght = this.dataSelct.length;
      const button = await this.notifi.confirmRounded('Xác nhận xóa đăng ký thi  ' + select_leght + ' thí sinh ?','XÁC NHẬN', [BUTTON_YES, BUTTON_NO]);
      if (button.name === BUTTON_YES.name) {
        this.notifi.isProcessing(true);
        this.modalService.open(this.templateWaiting, WAITING_POPUP);

        select_ids.forEach((f,index)=>{
          setTimeout(()=>{
            this.ordersService.delete(f).subscribe({
              next:()=>{
                this.listData= this.listData.filter(a=>a.id !==f);
                this.notifi.isProcessing(false);
              },error:()=>{
                this.notifi.toastError('Thao tác không thành công');
                this.notifi.isProcessing(false);

              }
            })
          },(index+1)*200);
        });
        this.modalService.dismissAll();
        this.dataSelct=[];
      }
      // this.modalService.open(this.templateWaiting, WAITING_POPUP);
      // this.modalService.dismissAll();
    } else {
      this.notifi.toastWarning('Vui lòng chọn thi sinh');
    }
  }

  btnExportExcelV2Hsk(){

    if (this.kehoach_id !== 0) {
      this.notifi.isProcessing(true);
      this.modalService.open(this.templateWaiting, WAITING_POPUP);

      // this.ordersService.getDataBykehoachIdAndSelectforThongke(this.kehoach_id,'id,kehoach_id,caphsk_id,lephithi,trangthai_thanhtoan,user_id,parent_id,created_by,updated_by')
      this.loopGetOrderBy(1,200,this.kehoach_id,[],1,'id,kehoach_id,caphsk_id,lephithi,trangthai_thanhtoan,thoigian_thanhtoan,user_id,parent_id,created_by,updated_by',this.statusSelect.toString())
        .pipe(switchMap(m=>{
          const idsParent = Array.from(new Set(m.filter(a => a.parent_id !== 0).map(a => a.parent_id)));
          const conditionDiemduthi : ConditionOption = {
            condition: [

            ],page:'1',
            set:[{ label: 'limit',value : '-1'}, ]
          }

          return forkJoin([
            of(m),
            idsParent.length> 0? this.loopGetOrderByParentId(1,200,idsParent,[],'id,kehoach_id,diemduthi,lephithi,trangthai_thanhtoan,thoigian_thanhtoan,user_id,parent_id,created_by,updated_by'):of([]),
            this.dmDiemDuThiService.getDataByPageNew(conditionDiemduthi).pipe(map(a=>a.data))
          ]);
        }))
        .subscribe({
          next:([dataOrder,dataParent ,diemduthi])=>{
            const dataMap = dataOrder.map((m,index)=>{
              const user:User = m['user'];
              const thisinh:ThiSinhInfo = m['thisinh'];
              const parent:OrdersVstep = m.parent_id === 0 ? null : dataParent.find(f=>f.id === m.parent_id);
              m['__index'] = index + 1;
              m['__madk'] = 'hsk' + m.id;
              m['__status_converted'] = m.trangthai_thanhtoan === 1 ? 'Thanh toán thành công': (  m.trangthai_thanhtoan === 0 ? 'Chưa thanh toán' : (m.trangthai_thanhtoan === 2 ? 'Giao dịch đang sử lý' : ''));
              m['__capthi_converted'] = diemduthi.length>0 && diemduthi.find(f=>f.id === m.diemduthi_id) ? diemduthi.find(f=>f.id === m.diemduthi_id).title : '';
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
                m['__ghichu']= parent && parent['user']? parent['user']['name']:'Đối tác đăng ký'  ;
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
              this.modalService.dismissAll();
              this.exportThiSinhDuThiService.exportToLongHsk(dataMap, this.dsKehoachthi.find(f => f.id === this.kehoach_id).title);
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
    } else {
      this.notifi.toastError('Vui lòng chọn đợt thi');
    }
  }
  selectDataByCheckbox(event){
    if (event.checked === true){
      this.dataSelct = this.listData.filter(f=>f.trangthai_thanhtoan !== 1);
    }else {
      this.dataSelct = [];
    }
  }

  formatSQLDateTime(date: Date): string {
    const y = date.getFullYear().toString();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    const h = date.getHours().toString().padStart(2, '0');
    const min = date.getMinutes().toString().padStart(2, '0');

    //'YYYY-MM-DD hh:mm:ss' type of sql DATETIME format
    return `${d}-${m}-${y} ${h}:${min}`;
  }

  loopGetOrderBy(page:number,limit:number, kehoach_id:number, data:OrdersVstep[] ,recordsFiltered:number, select:string, trangthai_thanhtoan:string):Observable<OrdersVstep[]>{
    if (data.length < recordsFiltered) {

      const conditon :ConditionOption = {
         condition: [
           {
             conditionName:'kehoach_id',
             condition:OvicQueryCondition.equal,
             value: kehoach_id.toString()
           }
         ],page:page.toString(),
        set:[
          {label:'limit', value: limit.toString()},
          {label:'select', value:select}
        ]
      }
      if(trangthai_thanhtoan == '1'){
        conditon.condition.push({
          conditionName:'trangthai_thanhtoan',
          condition:OvicQueryCondition.equal,
          value: '1'
        })
      }
      if(trangthai_thanhtoan == '0'){
        conditon.condition.push({
          conditionName:'trangthai_thanhtoan',
          condition:OvicQueryCondition.notEqual,
          value: '1'
        })
      }

      return this.ordersService.getDataByPageNew(conditon).pipe(
        switchMap(m=>{

          return this.loopGetOrderBy(page+1,limit,kehoach_id,data.concat(m['data']),m['recordsFiltered'],select,trangthai_thanhtoan)
        })
      )
    } else{
      return of(data);
    }
  }
  loopGetOrderByParentId(page:number,limit:number, parent_ids: number[] ,data:OrdersVstep[], select:string):Observable<OrdersVstep[]>{
    const start = (page- 1)*limit;
    const end = start  + limit

    if( (page == 0 ? limit : limit *page) < parent_ids.length){
      const diemduthi_ids_select = parent_ids.slice(start , end);
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
          {label: 'limit', value:diemduthi_ids_select.length.toString(),},
          {label: 'select', value:select,}
        ]
      }
      return this.ordersService.getDataByPageNew(conditionDm).pipe(switchMap(a=>{
        return this.loopGetOrderByParentId(page + 1,limit,parent_ids,data.concat(a.data),select)
      }))

    }else{
      const diemduthi_ids_select = parent_ids.slice(start,end );
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

      return this.ordersService.getDataByPageNew(conditionDm).pipe(switchMap(a=>{
        return of(data.concat(a.data))
      }))
    }
  }


}
