import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {forkJoin} from "rxjs";
import {NotificationService} from "@core/services/notification.service";
import {TableModule} from "primeng/table";
import {SharedModule} from "@shared/shared.module";
import {NgForOf, NgIf} from "@angular/common";
import {OrdersVstep, VstepOrdersService} from "@shared/services/vstep-orders.service";
import {KeHoachThi, KehoachthiVstepService} from "@shared/services/kehoachthi-vstep.service";
import {ConditionOption} from "@shared/models/condition-option";
import {map} from "rxjs/operators";
import {OvicQueryCondition} from "@core/models/dto";

@Component({
  selector: 'app-thi-sinh-dang-ky-thi',
  templateUrl: './thi-sinh-dang-ky-thi.component.html',
  styleUrls: ['./thi-sinh-dang-ky-thi.component.css'],
  imports: [
    TableModule,
    SharedModule,
    NgForOf,
    NgIf
  ],
  standalone: true
})
export class ThiSinhDangKyThiComponent implements OnInit,OnChanges {
  @Input() thiSinh_id: number;
  ngchangeType: 0 | 1 = 0;//o :load

  isLoading:boolean=false;
  loadInitFail:boolean=false;
  listdata:OrdersVstep[];
  listStyle = [
    {value: 1, title: '<div class="thanh-toan true"><div></div><label> Đã thanh toán</label></div>',},
    {value: 0, title: '<div class="thanh-toan false"><div></div><label> Chưa thanh toán</label></div>',},
    {value: 2, title: '<div class="thanh-toan check"><div></div><label> Đã thanh toán, chờ duyệt</label></div>',}
  ]
  constructor(
    private OrderService:VstepOrdersService,
    private kehoachthiVstepService:KehoachthiVstepService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    if(this.thiSinh_id){
      this.loadData(this.thiSinh_id);
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.thiSinh_id) {
      this.loadData(this.thiSinh_id);
    }
  }

  loadInit(){
    this.loadData(this.thiSinh_id);

  }


  loadData(thisinh_id:number){
    this.notificationService.isProcessing(true);

    const conditionKehoach: ConditionOption ={
      condition:[],
      page:'1',
      set:[{label:'limit',value:'-1'}]
    }
    const conditionthisinh: ConditionOption ={
      condition:[
        {
          conditionName:'thisinh_id',
          condition:OvicQueryCondition.equal,
          value:thisinh_id.toString()
        }
      ],
      page:'1',
      set:[{label:'limit',value:'-1'}]
    }


    forkJoin<[KeHoachThi[], OrdersVstep[]]>(
      this.kehoachthiVstepService.getDataByPageNew(conditionKehoach).pipe(map(m=>m.data)),
      this.OrderService.getDataByPageNew(conditionthisinh).pipe(map(m=>m.data))
    ).subscribe({
      next:([kehoachthi, orrder])=>{
        this.listdata = orrder.map((m,index)=>{
          m['_indexTable'] = index+1;
          m['_kehoachthi_covented'] =kehoachthi.find(f=>f.id === m.kehoach_id) ? kehoachthi.find(f=>f.id === m.kehoach_id).title :'';
          // m['_mon_ids_covertd'] = m.mon_id.map(f=>dmMon && dmMon.find(a=>a.id === f)? dmMon.find(a=>a.id === f).tenmon :'');
          m['__lephithi_covered'] = m.lephithi;
          m['__status_converted'] =  m['trangthai_thanhtoan'] === 1 ? this.listStyle.find(f => f.value === 1).title :(m.trangthai_chuyenkhoan ===0 ? this.listStyle.find(f => f.value === 0).title : this.listStyle.find(f => f.value === 2).title) ;
          return m;
        })
        this.notificationService.isProcessing(false);

      },
      error:()=>{
        this.notificationService.isProcessing(false);

        this.notificationService.toastError('Mất kết nối với máy chủ');
      }
    })
  }
}
