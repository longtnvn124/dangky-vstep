import {Component, OnInit} from '@angular/core';
import {ThiSinhInfo} from "@shared/models/thi-sinh";
import {AuthService} from "@core/services/auth.service";
import {NotificationService} from "@core/services/notification.service";

import {KeHoachThi, KehoachthiVstepService} from "@shared/services/vstep/kehoachthi-vstep.service";
import {ConditionOption} from "@shared/models/condition-option";
import {map} from "rxjs/operators";
import {OvicQueryCondition} from "@core/models/dto";
import {forkJoin} from "rxjs";
import {HoidongKetqua, HoidongKetquaService} from "@shared/services/vstep/hoidong-ketqua.service";
import {ThisinhInfoService} from "@shared/services/thisinh-info.service";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-tra-cuu-ket-qua',
  templateUrl: './tra-cuu-ket-qua.component.html',
  styleUrls: ['./tra-cuu-ket-qua.component.css'],
  imports: [
    NgIf,
    NgForOf
  ],
  standalone: true
})
export class TraCuuKetQuaComponent implements OnInit {
  thisinhInfo:ThiSinhInfo;
  kehoachThi:KeHoachThi[] = [];
  kehoach_id_select:number;
  isLoading :boolean =false;
  listData:HoidongKetqua[] = [];
  constructor(

    private thisinhInfoService : ThisinhInfoService,
    private kehoachthiVstepService: KehoachthiVstepService,
    private hoidongKetquaService:HoidongKetquaService,
    private auth:AuthService,
    private notifi:NotificationService,
  ) { }

  ngOnInit(): void {
    this.loadInit()
  }

  loadInit(){
      this.notifi.isProcessing(true);
      const condition: ConditionOption= {
        condition:[],
        page:'1',
        set:[{label:'limit', value:'-1'}]
      };
    const conditionLang: ConditionOption= {
      condition:[
        {
          conditionName:'status',
          condition:OvicQueryCondition.equal,
          value:'1'
        }
      ],
      page:'1',
      set:[{label:'limit', value:'-1'}]
    };

    forkJoin([
      this.thisinhInfoService.getUserInfo(this.auth.user.id),
      this.kehoachthiVstepService.getDataByPageNew(condition).pipe(map(m=>m.data))
    ]).subscribe({
        next:([info,data])=>{
          this.notifi.isProcessing(false);
          this.kehoachThi = data;
          this.thisinhInfo = info;
          this.getKetquathi()

        },error:()=>{
          this.notifi.toastError('Mất kết nối với máy chủ');
          this.notifi.isProcessing(false);
        }
      })
  }

  getKetquathi(){
    const conditionLang: ConditionOption= {
      condition:[
        {
          conditionName:'cccd_so',
          condition:OvicQueryCondition.equal,
          value:this.thisinhInfo.cccd_so
        }
      ],
      page:'1',
      set:[{label:'limit', value:'-1'}]
    };

    this.hoidongKetquaService.getDataByPageNew(conditionLang).subscribe({
      next:({data,recordsFiltered})=>{
        this.notifi.isProcessing( false);
        this.listData = data.length > 0 ? data.map((m)=>{

          const kehoach = this.kehoachThi.find(f=>f.id == m.kehoach_id);
          m['_kehoach'] = kehoach ;
          m['_kehoach_name'] = kehoach ? kehoach.title : '';
          return m;
        }): [];

      },error:()=>{
        this.notifi.toastError('Load dữ liệu không thành công');
        this.notifi.isProcessing( false);
      }
    })
  }


}
