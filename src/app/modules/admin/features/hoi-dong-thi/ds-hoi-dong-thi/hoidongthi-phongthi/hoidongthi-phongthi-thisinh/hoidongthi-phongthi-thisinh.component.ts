import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HoidongPhongthi} from "@shared/services/vstep-hoidong-phongthi.service";
import {ConditionOption} from "@shared/models/condition-option";
import {NotificationService} from "@core/services/notification.service";
import {
  HoidongPhongthiThisinh,
  VstepHoidongPhongthiThisinhService
} from "@shared/services/vstep-hoidong-phongthi-thisinh.service";
import {DonViService} from "@shared/services/don-vi.service";
import {OvicQueryCondition} from "@core/models/dto";
import {forkJoin, of, switchMap} from "rxjs";
import {ThisinhInfoService} from "@shared/services/thisinh-info.service";
import {map} from "rxjs/operators";
import {TableModule} from "primeng/table";
import {PaginatorModule} from "primeng/paginator";
import {NgPaginateEvent} from "@shared/models/ovic-models";

@Component({
  selector: 'app-hoidongthi-phongthi-thisinh',
  standalone: true,
  imports: [CommonModule, TableModule, PaginatorModule],
  templateUrl: './hoidongthi-phongthi-thisinh.component.html',
  styleUrls: ['./hoidongthi-phongthi-thisinh.component.css']
})
export class HoidongthiPhongthiThisinhComponent implements OnInit {

  @Input() set hoidongPhongthi(item:HoidongPhongthi){
    this.hoidongPhongthiSelect = item;
    this.page = 1;
    this.loadInit(item)

  }

  ngView                : 0|-1| 1 = 0;
  page                  : number = 1;
  limit                 : number = 20;
  recordTotal           : number = 0;
  hoidongPhongthiSelect : HoidongPhongthi;
  listData              : HoidongPhongthiThisinh[]
  constructor(
    private notifi: NotificationService,
    private hoidongPhongthiThisinhService: VstepHoidongPhongthiThisinhService,
    private donViService: DonViService,
    private thisinhInfoService: ThisinhInfoService
  ) { }

  ngOnInit(): void {
  }

  loadInit(item:HoidongPhongthi){
    this.ngView = 0
    const conditionPt:ConditionOption = {
      condition:[
        {
          conditionName:'hoidong_id',
          condition:OvicQueryCondition.equal,
          value:item.hoidong_id,
        },
        {
          conditionName:'diemduthi_id',
          condition:OvicQueryCondition.equal,
          value:item.diemduthi_id,
        },
        {
          conditionName:'hoidong_phongthi_id',
          condition:OvicQueryCondition.equal,
          value:item.id,
        }
      ],
      page:this.page.toString(),
      set:[
        {
          label:'limit',value:'20',
        },
        {
          label:'order_by',value:'id',
        }
      ]
    };

    this.hoidongPhongthiThisinhService.getDataByPageNew(conditionPt).pipe(switchMap(m=>{
      const thísinhIds = m.data.map(m=>m.thisinh_id);

      const condditionThisinh:ConditionOption ={
        condition: [
          {conditionName:'id',condition:OvicQueryCondition.equal,value:thísinhIds.toString(),orWhere:'in'}
        ],page:'1',
        set:[
          {label:'limit',value:thísinhIds.length.toString()},
          {label:'select',value:'id,hoten,ngaysinh,noisinh,cccd_so,email,phone'},
        ]
      }

      return forkJoin([
        of(m),
        this.thisinhInfoService.getDataByPageNew(condditionThisinh).pipe(map(m=>m.data))
      ])
    })).subscribe({
      next:([{data,recordsFiltered},thisinh])=>{
        this.recordTotal =recordsFiltered;
        this.listData = data.map((m,index)=>{
          m['_index'] = (this.page - 1)*this.limit + (index+ 1);
          m['_thisinh'] = thisinh.find(f=>f.id == m.thisinh_id)

          return m;
        })

        console.log(this.listData);

        this.ngView= 1;
      },error:()=>{
        this.ngView= -1;
        this.notifi.toastError('Mất kết nối với máy chủ');
      }
    })

  }
  paginate({page}: NgPaginateEvent) {
    this.page = page + 1;
    this.loadInit(this.hoidongPhongthiSelect);
  }

}
