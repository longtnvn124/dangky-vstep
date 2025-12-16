import { Component, OnInit } from '@angular/core';
import {ThemeSettingsService} from "@core/services/theme-settings.service";
import {ThisinhInfoService} from "@shared/services/thisinh-info.service";
import {ThiSinhInfo} from "@shared/models/thi-sinh";
import {NotificationService} from "@core/services/notification.service";
import {NgPaginateEvent} from "@shared/models/ovic-models";
import {debounceTime, of, Subject, switchMap} from "rxjs";
import {BUTTON_CANCEL, BUTTON_YES} from "@core/models/buttons";

@Component({
  selector: 'app-cap-nhat-thong-tin-thi-sinh',
  templateUrl: './cap-nhat-thong-tin-thi-sinh.component.html',
  styleUrls: ['./cap-nhat-thong-tin-thi-sinh.component.css']
})
export class CapNhatThongTinThiSinhComponent implements OnInit {

  private inputChanged: Subject<string> = new Subject<string>();
  listData:ThiSinhInfo[]  = [];
  dataSelect:ThiSinhInfo[]= [];
  //======================================
  rows          :number   = this.themeSettingsService.settings.rows;
  page          :number   = 1;
  recordsTotal  :number   = 0;
  search        :string   = '';
  isLoading     :boolean  = false;
  constructor(
    private themeSettingsService : ThemeSettingsService,
    private thisinhInfoService:ThisinhInfoService,
    private notification:NotificationService
  ) { }

  ngOnInit(): void {
    this.inputChanged.pipe(debounceTime(1000)).subscribe((item: string) => {
      this.searchContentByInput(item);
    });
    this.loadData(1)
  }

  loadData(page:number){
    this.notification.isProcessing(true);
    this.isLoading= true;
    this.page = page;
    this.thisinhInfoService.getDataByLockandSearch(page,this.search).subscribe({
      next:({recordsTotal,data})=>{
        this.recordsTotal = recordsTotal;
        this.listData = data.map((m, index)=>{
          m['_indexTable'] = ( page - 1 ) * 10 + 1 + index;
          m['_gioitinh']   = m.gioitinh === 'nu' ? 'Nữ':'Nam';
          return m;
         });
        this.notification.isProcessing(false)
        this.isLoading= false;

      },error:()=>{
        this.isLoading= false;
        this.notification.isProcessing(false)
        this.notification.toastError('Load dữ liệu không thành công');
      }
    })
  }

  paginate({page}: NgPaginateEvent) {
    this.page = page + 1;
    this.loadData(this.page);
  }

  onInputChange(event: string) {
    this.inputChanged.next(event);
  }
  searchContentByInput(text: string) {
    this.page = 1;
    this.search =text.trim()

    this.loadData(1);
  }


  async btnUpdateLockAndRequest(){
    if(this.dataSelect.length > 0){
      const button = await this.notification.confirmRounded('Yêu cầu cập nhật thông tin cho ' + this.dataSelect.length + ' thí sinh','XÁC NHẬN',  [BUTTON_CANCEL,BUTTON_YES]);
      if (button.name === BUTTON_YES.name) {
        const step: number = 100 / this.dataSelect.length;
        this.notification.loadingAnimationV2({process: {percent: 0}});
        this.updateLockAndRequet(this.dataSelect, step, 0).subscribe({
          next: (mess) => {
            this.notification.toastSuccess('Thao tác thành công');
            this.notification.isProcessing(false);
            this.loadData(1)
          }, error: () => {
            this.notification.toastError('Thao tác vừa thực hiện không thành công');
            this.notification.isProcessing(false);
            this.notification.disableLoadingAnimationV2();
          }
        })
      }
    }else{
      this.notification.toastWarning('Vui lòng chọn thí sinh cần cập nhật ');
    }
  }

  private updateLockAndRequet(list ,step:number,percent :number){
    const index: number = list.findIndex(i => !i['updateBylockAndRequest']);
    if (index !== -1) {
      return this.thisinhInfoService.update(list[index].id , {lock:0, request_update:2}).pipe(switchMap(() => {
        list[index]['updateBylockAndRequest'] = true;
        const newPercent: number = percent + step;
        this.notification.loadingAnimationV2({process: {percent: newPercent}});
        return this.updateLockAndRequet(list, step, newPercent);
      }))
    } else {
      this.notification.disableLoadingAnimationV2();
      return of('complete');
    }
  }

}
