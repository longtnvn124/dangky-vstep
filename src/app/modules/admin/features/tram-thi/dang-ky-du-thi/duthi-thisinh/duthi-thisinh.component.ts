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
    this.loadInit(data.id);
  }

  orderParentSelect : OrdersVstep;
  listChild         : OrdersVstep[];
  loading           : boolean = false;
  row               : number = 20;
  recordsTotal      : number = 0;
  page              : number = 1;

  constructor(
    private ordersService: VstepOrdersService,
    private notifi: NotificationService,


  ) {

  }

  ngOnInit(): void {
  }

  loadInit(id: number) {
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
          return m
        }): [];

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
    this.loadInit(this.orderParentSelect.id);
  }
  closeForm(){
    this.notifi.closeSideNavigationMenu();
  }


}
