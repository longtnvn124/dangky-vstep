
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FileService } from '@core/services/file.service';
import { NotificationService } from '@core/services/notification.service';
import { DiaDanh } from '@modules/shared/models/location';
import { ThiSinhInfo } from '@modules/shared/models/thi-sinh';
import { LocationService } from '@modules/shared/services/location.service';
import { ThisinhInfoService } from '@modules/shared/services/thisinh-info.service';
import {NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {ImageModule} from "primeng/image";

@Component({
  selector: 'app-thong-tin-thi-sinh',
  templateUrl: './thong-tin-thi-sinh.component.html',
  styleUrls: ['./thong-tin-thi-sinh.component.css'],
  imports: [
    NgSwitch,
    NgSwitchCase,
    NgIf,
    ImageModule
  ],
  standalone: true
})
export class ThongTinThiSinhComponent implements OnInit {
  @Input() set user_id(id: number){
    if (id) {
      this.locationService.getListByIdAndKey(1,'provinces').subscribe({
        next: (data) => {
          this.provinceOptions = data;
          this.loadData(id);
        }
      })

    }
  };

  @Input() maxWidth:string ;

  ngchangeType: 0 | 1 = 0;//o :load

    listDoituong:{label:string,value:string}[] = [
    {label:'Thí sinh tự do', value: 'tudo'},
    {label:'Sinh viên ĐHTN', value: 'dhtn'},
  ]

  provinceOptions: DiaDanh[];
  constructor(
    private thisinhInfoService: ThisinhInfoService,
    private fileSerive: FileService,
    private notifi: NotificationService,
    private locationService: LocationService
  ) { }

  ngOnInit(): void {


  }


  loadInit() {
    // this.loadData()
  }

  userInfo: ThiSinhInfo;

  loadData(id: number) {
    this.thisinhInfoService.getUserByUserId(id).subscribe({
      next: (data) => {

        this.userInfo =data.length>0? data.map(m => {
          m['__anh_chandung_covented'] = m.anh_chandung && m.anh_chandung[0] ? this.fileSerive.getPreviewLinkLocalFile(m.anh_chandung[0]) : '';
          m['__cccd_mattruoc_covented'] = m.cccd_img_truoc && m.cccd_img_truoc[0] ? this.fileSerive.getPreviewLinkLocalFile(m.cccd_img_truoc[0]) : '';
          m['__cccd_matsau_covented'] = m.cccd_img_sau && m.cccd_img_sau[0] ? this.fileSerive.getPreviewLinkLocalFile(m.cccd_img_sau[0]) : '';
          m['__doituong_anhthe'] = m.doituong_anhthe && m.doituong_anhthe[0] ? this.fileSerive.getPreviewLinkLocalFile(m.doituong_anhthe[0]) : '';

          m['_doituong_name'] = this.listDoituong.find(f => f.value === m.doituong)?.label || '';
          return m;
        })[0] : null;

        this.notifi.isProcessing(false);

        this.ngchangeType = 1;
      }, error: (e) => {
        this.notifi.isProcessing(false);
        this.notifi.toastError('Tải dữ liệu thí sinh không thành công');
      }
    })
  }
}
