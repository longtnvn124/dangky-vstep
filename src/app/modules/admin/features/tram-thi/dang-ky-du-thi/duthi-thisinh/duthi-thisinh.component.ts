import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgPaginateEvent} from "@shared/models/ovic-models";
import {forkJoin, switchMap} from "rxjs";
import {Paginator, PaginatorModule} from "primeng/paginator";
import {OrdersVstep, VstepOrdersService} from "@shared/services/vstep-orders.service";
import {NotificationService} from "@core/services/notification.service";
import {ConditionOption} from "@shared/models/condition-option";
import {OvicQueryCondition} from "@core/models/dto";
import {SharedModule} from "@shared/shared.module";
import {TableModule} from "primeng/table";
import {DmDiemduthi, DmDiemDuThiService} from "@shared/services/dm-diem-du-thi.service";
import {KehoachthiDiemduthi, KehoachthiDiemthiVstepService} from "@shared/services/vstep/kehoachthi-diemthi-vstep.service";
import {DonVi} from "@shared/models/danh-muc";
import {DonViService} from "@shared/services/don-vi.service";
import {AuthService} from "@core/services/auth.service";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-duthi-thisinh',
  standalone: true,
  imports: [CommonModule, PaginatorModule, SharedModule, TableModule],
  templateUrl: './duthi-thisinh.component.html',
  styleUrls: ['./duthi-thisinh.component.css']
})
export class DuthiThisinhComponent implements OnInit {

  @ViewChild(Paginator) paginator: Paginator;

  @Input() set orderParent(data: OrdersVstep) {
    this.orderParentSelect = data;

    this.listChild = [];
    this.page = 1;
    this.loadInit();
  }

  listDmDiemduthi   : KehoachthiDiemduthi[];
  orderParentSelect : OrdersVstep;
  listChild         : OrdersVstep[];
  loading           : boolean = false;
  row               : number = 20;
  recordsTotal      : number = 0;
  page              : number = 1;

  constructor(
    private ordersService: VstepOrdersService,
    private notifi: NotificationService,
    private donViService:DonViService,
    private kehoachthiDiemthiVstepService:KehoachthiDiemthiVstepService,

  ) {

  }

  ngOnInit(): void {
  }


  loadInit(){


    const conditionKehoach: ConditionOption= {
      condition:[
        {conditionName:'kehoach_id',condition:OvicQueryCondition.equal,value:this.orderParentSelect.kehoach_id.toString()},
      ],
      page:'1',
      set:[
        {label:'limit',value:'-1'},
        {label:'order_by',value:'id'},
        {label:'order',value:'DESC'},
      ]
    }

    this.notifi.isProcessing(true)

    this.kehoachthiDiemthiVstepService.getDataByPageNew(conditionKehoach).pipe(switchMap(m=>{
      const donvi_ids =m.data.map(a=>a.diemduthi_id);

      const conditiondv: ConditionOption= {
        condition:[
          {conditionName:'id',condition:OvicQueryCondition.equal,value:donvi_ids.toString(), orWhere: 'in'},
        ],
        page:'1',
        set:[
          {label:'limit',value:'-1'},
        ]
      }

      return this.donViService.getDataByPageNew(conditiondv).pipe(map(dv=>{
          return m.data.length > 0  ? m.data.map(a=>{
            a['_diemduthi_name'] = dv.data.find(f=>f.id == a.diemduthi_id) ? dv.data.find(f=>f.id == a.diemduthi_id).title: '';
            a['_diemduthi'] = dv.data.find(f=>f.id == a.diemduthi_id) ;
            return a;
          }) : [];

        }))

      // return this.donViService.getDonViByIds(donvi_ids.toString()).pipe(map(dv=>{
      //   return m.data.length > 0  ? m.data.map(a=>{
      //     a['_diemduthi_name'] = dv.find(f=>f.id == a.diemduthi_id) ? dv.find(f=>f.id == a.diemduthi_id).title: '';
      //     a['_diemduthi'] = dv.find(f=>f.id == a.diemduthi_id) ;
      //     return a;
      //   }) : [];
      //
      // }))
    })).subscribe({
      next:(data)=>{

        this.listDmDiemduthi = data;
        this.notifi.isProcessing(false);
        if(this.listDmDiemduthi.length >0){
          this.loaldata(this.orderParentSelect.id);

        }else{
          this.notifi.toastWarning('Đợt thi chưa có thí sinh hoặc chưa có điểm dự thi');
        }

      },
      error:()=>{
        this.loading = false ;
        this.notifi.toastError('Mất kết nối với máy chủ ');
      }
    })

  }

  loaldata(id: number) {
    this.loading = true;

    const condition:ConditionOption ={
      condition:[
        {
          conditionName:'parent_id',
          condition:OvicQueryCondition.equal,
          value:id.toString()
        }
      ],page:this.page.toString(),
      set:[
        {label:'limit',value:'20'},
        {label:'select',value:'id,trangthai_thanhtoan,lephithi,user_id,kehoach_id,thisinh_id,diemduthi_id'},
        {label:'with',value:'user,thisinh'}
      ]
    }

    this.ordersService.getDataByPageNew(condition).subscribe({
      next:({data,recordsFiltered})=>{
        this.recordsTotal = recordsFiltered;
        this.notifi.isProcessing(false)
        this.listChild = data.length> 0 ? data.map((m,index)=>{
          const user = m['user'];
          m['_indexTable'] = (this.page - 1) * 10 + (index + 1);
          m['_hoten'] = user ? user['name'] : '';
          m['_email'] = user ? user['email'] : '';
          m['_cccd_so'] = user ? user['username'] : '';
          m['_phone'] = user ? user['phone'] : '';
          m['__lephithi'] = m.lephithi;
          m['__diemduthi'] = this.listDmDiemduthi.find(f=>f.diemduthi_id == m.diemduthi_id ) ? this.listDmDiemduthi.find(f=>f.diemduthi_id == m.diemduthi_id )['_diemduthi_name'] : '';

          m['__capthi'] = this.orderParentSelect['_kehoach']['levels'].find(f=>f.key == m.capthi) ? this.orderParentSelect['_kehoach']['levels'].find(f=>f.key == m.capthi).label : m.capthi;
          return m
        }): [];

        console.log(this.listChild);
        this.notifi.isProcessing(false)
        this.loading = false;

      },error:()=>{
        this.loading = false;

        this.notifi.isProcessing(false)
        this.notifi.toastError('Mất kết nối với máy chủ');
      }
    })


  }



  paginate({page}: NgPaginateEvent) {
    this.page = page + 1;
    this.loaldata(this.orderParentSelect.id);
  }
  closeForm(){
    this.notifi.closeSideNavigationMenu();
  }


}
