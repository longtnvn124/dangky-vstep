import {Component, OnInit} from '@angular/core';
import {NotificationService} from "@core/services/notification.service";
import {HskSummaryService} from "@shared/services/hsk-summary.service";
import {KeHoachThi, KehoachthiVstepService} from "@shared/services/vstep/kehoachthi-vstep.service";
import {SharedModule} from "@shared/shared.module";
import {ChartModule} from "primeng/chart";
import {DonViService} from "@shared/services/don-vi.service";
import {forkJoin} from "rxjs";
import {AuthService} from "@core/services/auth.service";
import {DonVi} from "@shared/models/danh-muc";
import {NgIf} from "@angular/common";

interface DataRaw {
  dotthi: any[]
  thanhtoan_thanhcong: number;
  thi_sinh_du_dk: number;
  tong_thi_sinh: number;
  tongtien: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,

  imports: [
    SharedModule,
    ChartModule,
    NgIf
  ]
})
export class HomeComponent implements OnInit {

  chartKehoachthi: any;
  optionsCharts: any;
  chartMonthi: any;
  objectFilter = {};

  dataRaw: DataRaw;

  listYear: KeHoachThi[] = [];

  constructor(
    private notificationService: NotificationService,
    private kehoachthiVstepService: KehoachthiVstepService,
    private hskSummaryService: HskSummaryService,
    private donViService: DonViService,
    private auth: AuthService
  ) {
    this.optionsCharts = {
      indexAxis: 'x',
      maintainAspectRatio: false,
      aspectRatio: 1,
      plugins: {
        legend: {
          labels: {
            // color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            font: {
              weight: 500
            }
          },
          grid: {
            drawBorder: false
          }
        },
        y: {
          ticks: {},
          grid: {
            drawBorder: false
          }
        }
      }
    };
  }

  ngOnInit(): void {
    this.loadInit()
  }


  totalThisinh: number = 0;
  totalLephithi: number = 0;
  totalOrderTT: number = 0;
  totalThisinhDuyet: number = 0;
  kehoachthi: KeHoachThi[];
  listDonvi: DonVi[];

  loadInit() {
    this.notificationService.isProcessing(true);

    forkJoin([
      this.donViService.getChildren(this.auth.user.donvi_id),
      this.kehoachthiVstepService.getYearAndSelect('id,nam', -1)
    ]).subscribe({
      next: ([listDonvi, data]) => {
        this.listDonvi = listDonvi;
        this.listYear = data;
        if (this.listYear.length > 0) {
          this.objectFilter['nam'] = this.listYear && this.listYear[0] && this.listYear[0].nam ? this.listYear[0].nam : null;

          this.getDataDashBoad()
        }
        this.notificationService.isProcessing(false);

      }, error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Mất kết nối với máy chủ');
      }
    })


  }


  getDataDashBoad() {
    this.hskSummaryService.getDataDashboad(this.objectFilter['nam']).subscribe({
      next: (data) => {
        this.dataRaw = data;

        this.totalThisinh = data['tong_thi_sinh']
        this.totalThisinhDuyet = data['thi_sinh_du_dk']
        this.totalOrderTT = data['thanhtoan_thanhcong']
        this.totalLephithi = data['tongtien']
        this.chartKehoachthi = {
          labels: data['dotthi'].map(m => m.title),
          datasets: [
            {
              label: 'Đã thanh toán',
              data: data['dotthi'].map(m => m['_totalAccept']),
              backgroundColor: '#9ad0f5'
            },
            {
              label: 'Chưa thanh toán',
              data: data['dotthi'].map(m => m['_totalNotAccept']),
              backgroundColor: '#ffb1c1'
            },
          ]
        }


        // this.chartMonthi ={
        //   labels:data['dotthi'].map(m=>m.dotthi),
        //   datasets: [
        //     {
        //       label: 'HSK 3 (Cấp độ 3 + sơ cấp)',
        //       data: data['dotthi'].map(m=>m['totalDk_3'])
        //     },{
        //       label: 'HSK 4 (Cấp độ 4 + trung cấp)',
        //       data: data['dotthi'].map(m=>m['totalDk_4'])
        //     },{
        //       label: 'HSK 5 (Cấp độ 5 + cao cấp)',
        //       data: data['dotthi'].map(m=>m['totalDk_5'])
        //     },{
        //       label: 'HSK 6 (Cấp độ 6 + cao cấp)',
        //       data: data['dotthi'].map(m=>m['totalDk_6'])
        //     },
        //
        //   ]
        // }

        this.notificationService.isProcessing(false);

      }, error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Mất kết nối với máy chủ');
      }
    })
  }

  onChangeFilter(event) {
    this.objectFilter['nam'] = event.nam;
    this.getDataDashBoad();
  }

  ViewChitiet: boolean = false;
  dataRawSelect: any;

  clickDataChart(event) {
    this.ViewChitiet = false;
    if (event['element']['datasetIndex'] == 1) {
      this.ViewChitiet = false;
    } else {

      const dataRawSelect = this.dataRaw['dotthi'][event['element']['index']];
      this.dataRawSelect = dataRawSelect;
      this.chartMonthi = {
        labels: [dataRawSelect['title']],
        datasets: dataRawSelect['_capdo'].map(m => {
          return {
            label: this.listDonvi.find(f => f.id == m.diemduthi_id) ? this.listDonvi.find(f => f.id == m.diemduthi_id).title : '',
            data: [m['totalDk']]
          }
        })

      };
      this.ViewChitiet = true;

    }

  }
}
