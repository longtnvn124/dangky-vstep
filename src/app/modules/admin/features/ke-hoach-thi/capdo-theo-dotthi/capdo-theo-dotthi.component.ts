import {Component, Input, OnInit, Renderer2} from '@angular/core';
import {KeHoachThi} from "@shared/services/hsk-kehoach-thi.service";
import {DanhMucCapDoService} from "@shared/services/danh-muc-cap-do.service";
import {forkJoin, Observable, of, switchMap} from "rxjs";
import {HskKehoachCapdo, KehoachthiCapdoService} from "@shared/services/kehoachthi-capdo.service";
import {DmCapdo} from "@shared/models/danh-muc";
import {NotificationService} from "@core/services/notification.service";

@Component({
  selector: 'app-capdo-theo-dotthi',
  templateUrl: './capdo-theo-dotthi.component.html',
  styleUrls: ['./capdo-theo-dotthi.component.css']
})
export class CapdoTheoDotthiComponent implements OnInit {
  @Input() set kehoachthi(a:KeHoachThi){

    this._kehoachthi = a;
    this.loadInit()
  }
  _kehoachthi :KeHoachThi;
  dmCapdo: DmCapdo[];
  dataKehohoachCapdo:HskKehoachCapdo[];
  ngType:1|0 = 0;
  constructor(
    private danhMucCapDoService:DanhMucCapDoService,
    private kehoachthiCapdoService:KehoachthiCapdoService,
    private notifi: NotificationService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
  }

  loadInit(){
    forkJoin<[DmCapdo[],HskKehoachCapdo[]]>([
      this.danhMucCapDoService.getDataUnlimit(),
      this.kehoachthiCapdoService.getDataUnlimitAndKehoachId(this._kehoachthi.id)
    ]).subscribe({
      next:([dm,dataKehach])=>{
        this.dmCapdo =dm;
        this.dataKehohoachCapdo = dataKehach.length>0 ? dataKehach.map((m,index)=>{
          m['_index'] = index+1;
          m['_ten_capdo'] = dm.find(f=>f.id === m.caphsk_id)? dm.find(f=>f.id === m.caphsk_id).title : '';
          return m;
          }): [];

        this.ngType =dataKehach.length>0 ? 1: 0;
        this.notifi.isProcessing(false);
      },error:()=>{
        this.notifi.isProcessing(false);

      }
    })
  }
  btnCreated(){
    const dataCapdo = this.dmCapdo.map(m=>{
      return{caphsk_id:m.id,kehoach_id:this._kehoachthi.id}
    })
    const step: number = 100 / dataCapdo.length;
    if(dataCapdo){
      this.loopCreatd(dataCapdo, step,0).subscribe({
        next:()=>{
          this.notifi.disableLoadingAnimationV2();
          this.loadInit();
        },
        error:()=>{
          this.notifi.disableLoadingAnimationV2();
        }
      })
    }
  }

  loopCreatd(data,step: number, percent: number):Observable<any[]>{
    const index: number = data.findIndex(i => !i['__isHave']);
    if (index !== -1) {
      const item = data[index];


      const newPercent: number = percent + step;
      this.notifi.loadingAnimationV2({process: {percent: newPercent}});
      return this.kehoachthiCapdoService.create(item).pipe(switchMap(()=>{
        data[index]['__isHave'] = true;
        return this.loopCreatd(data,step,newPercent)
      }));

    }else{
      return of([]);
    }
  }
  inputChange(event,item:HskKehoachCapdo){

    if(event.target.value<=0){
      this.notifi.toastError('Số nhập vào không hợp lệ');
    }else{
      this.kehoachthiCapdoService.update(item.id,{soluong :event.target.value }).subscribe({
        next:()=>{
          this.notifi.toastSuccess('Cập nhật dữ liệu không thành công ');
        },
        error:()=>{
          this.notifi.toastError('Cập nhật dữ liệu không thành công ');
        }
      })
    }

  }
}
