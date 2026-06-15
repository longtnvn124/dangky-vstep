import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Hoidongthi} from "@shared/services/vstep-hoidong-thi.service";
import {VstepHoidongPhongthiService} from "@shared/services/vstep-hoidong-phongthi.service";
import {
  HoidongPhongthiThisinh,
  VstepHoidongPhongthiThisinhService
} from "@shared/services/vstep-hoidong-phongthi-thisinh.service";
import {DonViService} from "@shared/services/don-vi.service";
import {ThisinhInfoService} from "@shared/services/thisinh-info.service";
import {NotificationService} from "@core/services/notification.service";
import {AuthService} from "@core/services/auth.service";
import {DonVi} from "@shared/models/danh-muc";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {ConditionOption} from "@shared/models/condition-option";
import {OvicQueryCondition} from "@core/models/dto";
import {forkJoin, Observable, of, switchMap} from "rxjs";
import {ExExcelVstepService} from "@shared/services/export/ex-excel-vstep.service";
import {ExWordVstepService} from "@shared/services/export/ex-word-vstep.service";

@Component({
  selector: 'app-hoidongthi-bieumau',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule, ButtonModule, RippleModule],
  templateUrl: './hoidongthi-bieumau.component.html',
  styleUrls: ['./hoidongthi-bieumau.component.css']
})
export class HoidongthiBieumauComponent implements OnInit {

  @Input() set hoidong(item:Hoidongthi){
    this.hoidongSelect = item;

    this.getDanhmuc()
  }

  hoidongSelect: Hoidongthi;

  isLoadding: 1|0|-1  = -1;

  listDonvi: DonVi[];

  constructor(
    private vstepHoidongPhongthiService: VstepHoidongPhongthiService,
    private hoidongPhongthiThisinhService: VstepHoidongPhongthiThisinhService,
    private donViService: DonViService,
    private thisinhInfoService: ThisinhInfoService,
    private notifi: NotificationService,
    private auth:AuthService,
    private exExcelVstepService: ExExcelVstepService,
    private exWordVstepService: ExWordVstepService,
  ) { }

  ngOnInit(): void {
  }

  reLoad(){
    this.getDanhmuc()
  }

  getDanhmuc(){
    this.isLoadding = 0
    this.donViService.getChildren(this.auth.user.donvi_id).subscribe({
      next:(data)=>{
        this.listDonvi  = data;

        this.isLoadding =1;
      },
      error:()=>{
        this.isLoadding= -1;
        this.notifi.toastError('Mất kết nối với máy chủ' )
      }
    })
  }

  loopgetPhongthiThisinh(arr:HoidongPhongthiThisinh[], recordTotal:number, limit:number,page:number):Observable<HoidongPhongthiThisinh[]>{
    if(arr.length < recordTotal){
      const condition: ConditionOption = {
        condition:[
          {
            conditionName:'hoidong_id',
            condition:OvicQueryCondition.equal,
            value:this.hoidongSelect.id.toString()
          }
        ],
        page:page.toString(),
        set:[
          {label:'limit',value :limit.toString()},
          {label:'with',value :'thisinh'},
        ]
      }
      return this.hoidongPhongthiThisinhService.getDataByPageNew(condition).pipe(switchMap(m=>{
        return this.loopgetPhongthiThisinh(arr.concat(m.data),m.recordsFiltered,limit,page+1)
      }))
    }else{
      return of(arr)
    }
  }


  btnDsThisinh(){
    this.notifi.loadingAnimationV2({process:{percent:0}});


      const conditon: ConditionOption= {
        condition:[
          {
            conditionName:'hoidong_id',
            condition:OvicQueryCondition.equal,
            orWhere:'and',
            value:this.hoidongSelect.id.toString()
          }
        ],
        page:'1',
        set:[
          {
            label:'limit', value:'-1'
          }
        ]
      }

      this.vstepHoidongPhongthiService.getDataByPageNew(conditon).pipe(switchMap(m=>{
        return forkJoin([of(m.data), this.loopgetPhongthiThisinh([],1,200,1)])
      })).subscribe({
        next:([hdPhongthi, hdPhongthiThisinh])=>{

          const listPhongthi = hdPhongthi.map(m=>{
            m['_listThisinh']= hdPhongthiThisinh.filter(f=>f.diemduthi_id == m.diemduthi_id && m.id == f.hoidong_phongthi_id);
            m['_diemthi'] = this.listDonvi.find(f=>f.id == m.diemduthi_id)
            return m;
          }).filter(f=>f['_listThisinh'].length > 0);

          this.notifi.loadingAnimationV2({process:{percent:100}});
          this.notifi.disableLoadingAnimationV2();

          if(listPhongthi){
            this.exExcelVstepService.exDsThisinhByPhongthi(listPhongthi,this.hoidongSelect['__ngonngu'],this.hoidongSelect,'dsthisinh','portrait')

          }else{
            this.notifi.toastWarning('Chưa có danh sách phòng thi hoặc chưa xếp phòng thi cho thí sinh');
          }
        },error:()=>{
          this.notifi.isProcessing(false);
          this.notifi.disableLoadingAnimationV2();

          this.notifi.toastError('Load dữ liệu không thành công');

        }
      })
  }

  btnDsThisinhNopbai(){
    this.notifi.loadingAnimationV2({process:{percent:0}});
    const conditon: ConditionOption= {
      condition:[
        {
          conditionName:'hoidong_id',
          condition:OvicQueryCondition.equal,
          orWhere:'and',
          value:this.hoidongSelect.id.toString()
        }
      ],
      page:'1',
      set:[{label:'limit', value:'-1'}]
    }

    this.vstepHoidongPhongthiService.getDataByPageNew(conditon).pipe(switchMap(m=>{


      return forkJoin([of(m.data), this.loopgetPhongthiThisinh([],1,200,1)])
    })).subscribe({
      next:([hdPhongthi, hdPhongthiThisinh])=>{

        const listPhongthi = hdPhongthi.map(m=>{

          m['_listThisinh']= hdPhongthiThisinh.filter(f=>f.diemduthi_id == m.diemduthi_id && m.id == f.hoidong_phongthi_id);

          m['_diemthi'] = this.listDonvi.find(f=>f.id == m.diemduthi_id)

          return m;
        }).filter(f=>f['_listThisinh'].length > 0);

        this.notifi.loadingAnimationV2({process:{percent:100}});
        this.notifi.disableLoadingAnimationV2();


        if(listPhongthi.length >0){
          this.exExcelVstepService.exDsThisinhKynopbai(listPhongthi,this.hoidongSelect['__ngonngu'],this.hoidongSelect,'dsKynopbai', 'portrait')

        }else{
          this.notifi.toastWarning('Chưa có danh sách phòng thi hoặc chưa xếp phòng thi cho thí sinh');
        }


      },error:()=>{
        this.notifi.disableLoadingAnimationV2();
        this.notifi.toastError('Load dữ liệu không thành công');

      }
    })

  }
  btnDsXacnhanThongtinThisinh(){
    this.notifi.isProcessing(true);
    this.notifi.loadingAnimationV2({process:{percent:0}});
    const conditon: ConditionOption= {
      condition:[
        {
          conditionName:'hoidong_id',
          condition:OvicQueryCondition.equal,
          orWhere:'and',
          value:this.hoidongSelect.id.toString()
        }
      ],
      page:'1',
      set:[{label:'limit', value:'-1'}]
    }

    this.vstepHoidongPhongthiService.getDataByPageNew(conditon).pipe(switchMap(m=>{


      return forkJoin([of(m.data), this.loopgetPhongthiThisinh([],1,200,1)])
    })).subscribe({
      next:([hdPhongthi, hdPhongthiThisinh])=>{


        const listPhongthi = hdPhongthi.map(m=>{

          m['_listThisinh']= hdPhongthiThisinh.filter(f=>f.diemduthi_id == m.diemduthi_id && m.id == f.hoidong_phongthi_id);

          m['_diemthi'] = this.listDonvi.find(f=>f.id == m.diemduthi_id)

          return m;
        }).filter(f=>f['_listThisinh'].length > 0);

        this.notifi.loadingAnimationV2({process:{percent:100}});
        this.notifi.disableLoadingAnimationV2();

        if(listPhongthi.length>0){
          this.exExcelVstepService.exDsThisinhKyXacnhan(listPhongthi,this.hoidongSelect['__ngonngu'],this.hoidongSelect,'dsThisinhXacnhan', 'landscape')

        }else{
          this.notifi.toastWarning('Chưa có danh sách phòng thi hoặc chưa xếp phòng thi cho thí sinh');

        }

      },error:()=>{
        this.notifi.isProcessing(false);
        this.notifi.disableLoadingAnimationV2();
        this.notifi.toastError('Load dữ liệu không thành công');

      }
    })

  }

  btnBangTenPhong(){

    this.notifi.isProcessing(true);
    this.notifi.loadingAnimationV2({process:{percent:0}});
    const conditon: ConditionOption= {
      condition:[
        {
          conditionName:'hoidong_id',
          condition:OvicQueryCondition.equal,
          orWhere:'and',
          value:this.hoidongSelect.id.toString()
        }
      ],
      page:'1',
      set:[{label:'limit', value:'-1'}]
    }

    this.vstepHoidongPhongthiService.getDataByPageNew(conditon).pipe(switchMap(m=>{


      return forkJoin([of(m.data), this.loopgetPhongthiThisinh([],1,200,1)])
    })).subscribe({
      next:([hdPhongthi, hdPhongthiThisinh])=>{


        const listPhongthi = hdPhongthi.map(m=>{

          m['_listThisinh']= hdPhongthiThisinh.filter(f=>f.diemduthi_id == m.diemduthi_id && m.id == f.hoidong_phongthi_id);

          m['_diemthi'] = this.listDonvi.find(f=>f.id == m.diemduthi_id)

          return m;
        }).filter(f=>f['_listThisinh'].length > 0);

        this.notifi.loadingAnimationV2({process:{percent:100}});
        this.notifi.disableLoadingAnimationV2();

        if(listPhongthi.length>0){
          this.exWordVstepService.bienphongthi(listPhongthi,'bienphongthi-' + this.hoidongSelect.title)

        }else{
          this.notifi.toastWarning('Chưa có danh sách phòng thi hoặc chưa xếp phòng thi cho thí sinh');

        }

      },error:()=>{
        this.notifi.isProcessing(false);
        this.notifi.disableLoadingAnimationV2();
        this.notifi.toastError('Load dữ liệu không thành công');

      }
    })


  }
  btnTuidunghosophongthi(){
    this.notifi.isProcessing(true);
    this.notifi.loadingAnimationV2({process:{percent:0}});
    const conditon: ConditionOption= {
      condition:[
        {
          conditionName:'hoidong_id',
          condition:OvicQueryCondition.equal,
          orWhere:'and',
          value:this.hoidongSelect.id.toString()
        }
      ],
      page:'1',
      set:[{label:'limit', value:'-1'}]
    }

    this.vstepHoidongPhongthiService.getDataByPageNew(conditon).pipe(switchMap(m=>{


      return forkJoin([of(m.data), this.loopgetPhongthiThisinh([],1,200,1)])
    })).subscribe({
      next:([hdPhongthi, hdPhongthiThisinh])=>{


        const listPhongthi = hdPhongthi.map(m=>{

          m['_listThisinh']= hdPhongthiThisinh.filter(f=>f.diemduthi_id == m.diemduthi_id && m.id == f.hoidong_phongthi_id);

          m['_diemthi'] = this.listDonvi.find(f=>f.id == m.diemduthi_id)

          return m;
        }).filter(f=>f['_listThisinh'].length > 0);

        this.notifi.loadingAnimationV2({process:{percent:100}});
        this.notifi.disableLoadingAnimationV2();

        if(listPhongthi.length>0){
          this.exWordVstepService.tuidungHosophongthi(listPhongthi,'tuidungHoso-' + this.hoidongSelect.title,this.hoidongSelect['__ngonngu'] )

        }else{
          this.notifi.toastWarning('Chưa có danh sách phòng thi hoặc chưa xếp phòng thi cho thí sinh');

        }

      },error:()=>{
        this.notifi.isProcessing(false);
        this.notifi.disableLoadingAnimationV2();
        this.notifi.toastError('Load dữ liệu không thành công');

      }
    })
  }
  btnTuidungphieutaikhoan(){
    this.notifi.isProcessing(true);
    this.notifi.loadingAnimationV2({process:{percent:0}});
    const conditon: ConditionOption= {
      condition:[
        {
          conditionName:'hoidong_id',
          condition:OvicQueryCondition.equal,
          orWhere:'and',
          value:this.hoidongSelect.id.toString()
        }
      ],
      page:'1',
      set:[{label:'limit', value:'-1'}]
    }

    this.vstepHoidongPhongthiService.getDataByPageNew(conditon).pipe(switchMap(m=>{


      return forkJoin([of(m.data), this.loopgetPhongthiThisinh([],1,200,1)])
    })).subscribe({
      next:([hdPhongthi, hdPhongthiThisinh])=>{



        const listPhongthi = hdPhongthi.map(m=>{

          m['_listThisinh']= hdPhongthiThisinh.filter(f=>f.diemduthi_id == m.diemduthi_id && m.id == f.hoidong_phongthi_id);

          m['_diemthi'] = this.listDonvi.find(f=>f.id == m.diemduthi_id)

          return m;
        }).filter(f=>f['_listThisinh'].length > 0);

        this.notifi.loadingAnimationV2({process:{percent:100}});
        this.notifi.disableLoadingAnimationV2();

        if(listPhongthi.length>0){
          this.exWordVstepService.tuidungPhieutaikhoan(listPhongthi,'tuidungPhieutaikhoan-' + this.hoidongSelect.title,this.hoidongSelect['__ngonngu'] )

        }else{
          this.notifi.toastWarning('Chưa có danh sách phòng thi hoặc chưa xếp phòng thi cho thí sinh');

        }

      },error:()=>{
        this.notifi.isProcessing(false);
        this.notifi.disableLoadingAnimationV2();
        this.notifi.toastError('Load dữ liệu không thành công');

      }
    })
  }

}
