import { Component, OnInit } from '@angular/core';
import {ThisinhInfoService} from "@shared/services/thisinh-info.service";
import {forkJoin, of, switchMap} from "rxjs";
import {ThiSinhInfo} from "@shared/models/thi-sinh";
import {AuthService} from "@core/services/auth.service";
import {NotificationService} from "@core/services/notification.service";
import {ExportToPdfService} from "@shared/services/export-to-pdf.service";
import {HelperService} from "@core/services/helper.service";
import {HskKehoachThiService, KeHoachThi} from "@shared/services/hsk-kehoach-thi.service";
import {HskHoidongKetqua, HskHoidongKetquaService} from "@shared/services/hsk-hoidong-ketqua.service";

@Component({
  selector: 'app-tra-cuu-ket-qua',
  templateUrl: './tra-cuu-ket-qua.component.html',
  styleUrls: ['./tra-cuu-ket-qua.component.css']
})
export class TraCuuKetQuaComponent implements OnInit {
  thisinhInfo:ThiSinhInfo;
  kehoachThi:KeHoachThi[] = [];
  kehoach_id_select:number;
  isLoadding:boolean = false;
  dsKetqua:HskHoidongKetqua[];
  isLoading :boolean =false;
  dotDuThi:HskHoidongKetqua[];
  constructor(

    private hskHoidongKetquaService:HskHoidongKetquaService,
    private thisinhInfoSerice:ThisinhInfoService,
    private thptKehoachThiService:HskKehoachThiService,
    private auth:AuthService,
    private notifi:NotificationService,
    private exportToPdfService:ExportToPdfService,
    private helperSerivce:HelperService

  ) { }

  ngOnInit(): void {
    // this.loadInit()
  }

  loadInit(){
    this.notifi.isProcessing(true);

    forkJoin([

      this.thisinhInfoSerice.getUserInfo(this.auth.user.id),
      this.thptKehoachThiService.getDataUnlimitNotstatus()
    ]).pipe(
      switchMap(([thisinh, kehoachs]) => {
        return forkJoin([

          of(thisinh),
          of(kehoachs),
          this.hskHoidongKetquaService.getKehoachByCccd(thisinh['cccd_so'])
        ]);
      })
    ).subscribe({
      next:([thisinhInfo, kehoachthi,dotduthi])=>{
        // console.log(dotduthi)
        this.thisinhInfo= thisinhInfo;
        this.kehoachThi = kehoachthi;
        this.dotDuThi  = dotduthi.map(m=>{
          m['_kehoachthi'] = kehoachthi.find(f=>f.id=== m.kehoach_id) ? kehoachthi.find(f=>f.id=== m.kehoach_id).dotthi:'';
          return m;
        })

        if(this.dotDuThi.length > 0){
          this.btnSearchData()
        }else{
          this.notifi.toastWarning('Thí sinh chưa có kết quả dự thi');
        }
        this.notifi.isProcessing(false)
      },error:(e)=>{
        this.notifi.isProcessing(false)
      }
    })
  }

  btnSearchData(){
    this.notifi.isProcessing( true)
    this.isLoadding = true;
      this.hskHoidongKetquaService.getdataByCccdSoAndKehoachId(this.thisinhInfo.cccd_so,this.kehoach_id_select).subscribe({
        next:(data)=>{
          this.dsKetqua = data.map((m,index)=>{
            m['__index'] = index+1;
            m['__ngaythi'] = this.helperSerivce.formatSQLToDateDMY(new Date(m.ngaythi));
            return m;
          });
          this.isLoadding = false;
          this.notifi.isProcessing(false);
        },error:(e)=>{
          this.isLoadding = false;
          this.notifi.isProcessing(false);
          this.notifi.toastError('Load dữ liệu không thành công');
        }
      })

  }

  changeDotthi(event){
    this.kehoach_id_select = event.value;
    this.btnSearchData();
  }

  btnXuatPdf(){

  }

  getfile(){
    this.exportToPdfService.textToPDF()
  }
}
