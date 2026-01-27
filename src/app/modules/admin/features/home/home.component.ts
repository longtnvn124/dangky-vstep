import {Component, OnInit, ViewChild} from '@angular/core';
import {ChartComponent} from 'ng-apexcharts';
import {NotificationService} from "@core/services/notification.service";
import {HskSummaryService} from "@shared/services/hsk-summary.service";
import {KeHoachThi, KehoachthiVstepService} from "@shared/services/kehoachthi-vstep.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']

})
export class HomeComponent implements OnInit {
  @ViewChild('c1', {static: true}) private c1Component: ChartComponent;

  chartKehoachthi: any;
  optionsCharts: any;
  chartMonthi: any;
  objectFilter = {};

  listYear: KeHoachThi[] = [];

  constructor(
    private notificationService: NotificationService,
    private kehoachthiVstepService: KehoachthiVstepService,
    private hskSummaryService: HskSummaryService
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


  loadInit() {
    this.notificationService.isProcessing(true);

    this.kehoachthiVstepService.getYearAndSelect('id,nam', -1).subscribe({
      next: (data) => {
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
    console.log(this.objectFilter['nam']);

    this.hskSummaryService.getDataDashboad(this.objectFilter['nam']).subscribe({
      next: (data) => {

        this.totalThisinh =  data['tong_thi_sinh']

        this.totalThisinhDuyet  =  data['thi_sinh_du_dk']

        this.totalOrderTT  =  data['thanhtoan_thanhcong']

        this.totalLephithi  =  data['tongtiem']

        this.chartKehoachthi = {
          labels:data['dotthi'].map(m=>m.dotthi),
          datasets: [
            {
              label: 'Chưa thanh toán',
              data: data['dotthi'].map(m=>m['_totalNotAccept']),
              backgroundColor:'#ffb1c1'
            },
            {
              label: 'Đã thanh toán',
              data: data['dotthi'].map(m=>m['_totalAccept' ]),
              backgroundColor:'#9ad0f5'
            }
          ]
        }



        this.chartMonthi ={
          labels:data['dotthi'].map(m=>m.dotthi),
          datasets: [
            {
              label: 'HSK 3 (Cấp độ 3 + sơ cấp)',
              data: data['dotthi'].map(m=>m['totalDk_3'])
            },{
              label: 'HSK 4 (Cấp độ 4 + trung cấp)',
              data: data['dotthi'].map(m=>m['totalDk_4'])
            },{
              label: 'HSK 5 (Cấp độ 5 + cao cấp)',
              data: data['dotthi'].map(m=>m['totalDk_5'])
            },{
              label: 'HSK 6 (Cấp độ 6 + cao cấp)',
              data: data['dotthi'].map(m=>m['totalDk_6'])
            },

          ]
        }

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
}
