import {Component, ElementRef, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Paginator} from "primeng/paginator";

import {NgPaginateEvent} from "@shared/models/ovic-models";
import {filter, forkJoin, Observable, of, Subject, Subscription, switchMap} from "rxjs";
import {ThemeSettingsService} from "@core/services/theme-settings.service";
import {NotificationService} from "@core/services/notification.service";
import {HskHoidongthi} from "@shared/services/hsk-hoidongthi.service";
import {HskExportHoidongService} from "@shared/services/hsk-export-hoidong.service";
import imageCompression from "browser-image-compression";
import getDataUrlFromFile = imageCompression.getDataUrlFromFile;
import {HelperService} from "@core/services/helper.service";
import {KeHoachThi} from "@shared/services/kehoachthi-vstep.service";

@Component({
  selector: 'app-phong-thi',
  templateUrl: './phong-thi.component.html',
  styleUrls: ['./phong-thi.component.css']
})
export class PhongThiComponent implements OnInit {
  @Input() set hoidong(item: HskHoidongthi) {
    this.hoidongSelect = item;
    this.page = 1;
    this.loadInit();
  }

  hoidongSelect: HskHoidongthi;

  // @ViewChild('fromUser', {static: true}) fromUser: TemplateRef<any>;
  // @ViewChild('formregister', {static: true}) formregister: TemplateRef<any>;
  // @ViewChild('templateWaiting') templateWaiting: ElementRef;
  @ViewChild(Paginator) paginator: Paginator;

  isLoading: boolean = true;
  loadInitFail: boolean = false;

  dsKehoachthi: KeHoachThi[];
  recordsTotal: number;
  listData: HskHoidongthiThiSinh[];
  listPhongthi: HskHoidongthiThiSinh[];
  page: number = 1;
  kehoach_id: number = 0;


  rows = this.themeSettingsService.settings.rows;
  menuName = 'thisinhduthi';
  sizeFullWidth: number;
  subscription = new Subscription();
  index = 1;
  search = '';
  needUpdate = false;

  mauthuky: { stt: number, mau: string, name: string, ghichu?: string, type?: string }[] = [
    {stt: 1, mau: 'M01', name: 'Biển phòng thi HSK', ghichu: 'Để file thư ký'},
    {stt: 2, mau: 'M02', name: 'Danh sách phòng thi', ghichu: 'Để file thư ký'},
    {stt: 3, mau: 'M03', name: 'Biên bản mở niêm phong phòng thi', ghichu: 'Để file mẫu vào túi phụ'},
    {stt: 4, mau: 'M04', name: 'Biên bản mở niêm phong phiếu tài khoản', ghichu: 'Để file mẫu vào túi phụ'},
    {stt: 5, mau: 'M05', name: 'Biên bản bù giờ', ghichu: 'Để file mẫu vào túi phụ'},
    {stt: 6, mau: 'M06', name: 'Biên bản thí sinh ra ngoài phòng thi', ghichu: 'Để file mẫu vào túi phụ'},
    {stt: 7, mau: 'M07', name: 'Biên bản xử lý thí sinh vi phạm', ghichu: 'Để file mẫu vào túi phụ'},
    {stt: 8, mau: 'M08', name: 'Danh sách đề nghị sửa chữa sai sót', ghichu: 'Để file mẫu vào túi phụ'},
    {stt: 9, mau: 'M09', name: 'Giấy cam đoan', ghichu: 'Để file mẫu vào túi phụ'},
    {stt: 10, mau: 'M10', name: 'Sơ đồ chỗ ngồi của thí sinh', ghichu: 'Để file mẫu vào túi phụ'},
    {stt: 11, mau: 'M11', name: 'Báo cáo tổng hợp đợt thi', ghichu: 'Để file thư ký'},
    {stt: 11, mau: 'M14', name: 'Danh sách bìa túi phụ', ghichu: 'Để file mẫu vào túi phụ'},
    {stt: 12, mau: 'M15', name: 'Kế hoạch thi', ghichu: 'Để file mẫu vào túi phụ'},
    {stt: 13, mau: 'M16', name: 'Biên bản kiểm tra cơ sở vật chất', ghichu: 'Để file thư ký'},
    {stt: 14, mau: 'M17', name: 'Biên bản niêm phong phòng thi', ghichu: 'Để file thư ký'},
    {stt: 15, mau: 'M18', name: 'Biên bản kích hoạt đề thi', ghichu: 'Để file thư ký'},
    {stt: 16, mau: 'M19', name: 'Biên bản phân công cán bộ coi thi', ghichu: 'Để file thư ký'},
    {stt: 17, mau: 'M21', name: 'Biên bản bàn giao Danh sách ký nộp bài', ghichu: 'Để file mẫu vào túi phụ'},
    {stt: 17, mau: 'M22', name: 'Biên bản cam kết bảo mật', ghichu: 'Để file thư ký'},
    {stt: 18, mau: 'M23', name: 'Báo cáo của trưởng ban coi thi', ghichu: 'Để file thư ký'},
    {stt: 19, mau: 'M24', name: 'Biên bản của cán bộ an ninh', ghichu: 'Để file thư ký'},
    {stt: 20, mau: 'M25', name: 'Biên bản sao lưu dữ liệu', ghichu: 'Để file thư ký'},
    {stt: 21, mau: 'M26', name: 'Biên bản copy camera', ghichu: 'Để file thư ký'},
    {stt: 22, mau: 'M27', name: 'Biên bản sữa chữa sai sót', ghichu: 'Để file mẫu vào túi phụ'},


  ]

  convertCaphsk = [
    {tiengtrung: 'HSK三级', tiengviet: 'HSK 3', time_start: '13h30', time_end: '15h00', cathi: 'Chiều'},
    {tiengtrung: 'HSK四级', tiengviet: 'HSK 4', time_start: '9h30', time_end: '10h30', cathi: 'Sáng'},
    {tiengtrung: 'HSK五级', tiengviet: 'HSK 5', time_start: '13h30', time_end: '15h35', cathi: 'Chiều'},
    {tiengtrung: 'HSK六级', tiengviet: 'HSK 6', time_start: '9h00', time_end: '11h20', cathi: 'Sáng'},
    {tiengtrung: 'HSKK（初级）', tiengviet: 'HSKK Sơ cấp', time_start: '15h40', time_end: '16h00', cathi: 'Chiều'},
    {tiengtrung: 'HSKK（中级）', tiengviet: 'HSKK Trung cấp', time_start: '11h25', time_end: '11h48', cathi: 'Sáng'},
    {tiengtrung: 'HSKK（高级）', tiengviet: 'HSKK Cao cấp', time_start: '16h30', time_end: '16h55', cathi: 'Chiều'},
  ]
  cathi = [
    {nameSheet: 'HSK - Sáng', name: 'Sáng', child: ['HSK4+HSKK TC:', 'HSK6,']},
    {nameSheet: 'HSK - Chiều', name: 'Chiều', child: ['HSK3+HSKK SC:', 'HSK5+HSKK CC', 'HSKK CC']}
  ]

  constructor(
    private themeSettingsService: ThemeSettingsService,
    private notifi: NotificationService,
    private hskHoidongthiThisinhService: HskHoidongthiThisinhService,
    private hskExportHoidongService: HskExportHoidongService,
    private HelperService: HelperService,
  ) {

    const observeProcessCloseForm = this.notifi.onSideNavigationMenuClosed().pipe(filter(menuName => menuName === this.menuName && this.needUpdate)).subscribe(() => this.loadData(this.page));
    this.subscription.add(observeProcessCloseForm);
  }

  ngOnInit(): void {
    // this.loadInit();
  }

  loadInit() {

    this.loadData(1);
  }


  loadData(page: number) {

    this.isLoading = true;
    const limit = this.themeSettingsService.settings.rows;
    this.index = (page * limit) - limit + 1;
    this.notifi.isProcessing(true);
    this.notifi.loadingAnimationV2({process: {percent: 0}})
    this.hskHoidongthiThisinhService.getDataByHoidongAndGroundBy(this.hoidongSelect.id, 'caphsk', 'caphsk').subscribe({
      next: (data) => {
        this.notifi.loadingAnimationV2({process: {percent: 100}})
        this.isLoading = false;
        this.listPhongthi = data.length > 0 ? data.sort((a, b) => a.caphsk.localeCompare(b.caphsk)).map((m, index) => {
          m['_index'] = index + 1;
          m['_capHsk'] = this.convertCaphsk.find(f => f.tiengtrung === m.caphsk) ? this.convertCaphsk.find(f => f.tiengtrung === m.caphsk).tiengviet : m['cap_hsk'];
          return m;
        }) : [];

      },
      error: (e) => {
        this.notifi.disableLoadingAnimationV2();
        //     this.isLoading = false;

      }
    });
    // this.hskHoidongthiThisinhService.getDataByHoidongAndGroundBy(this.hoidongSelect.id, 'phongthi', 'phongthi').pipe(switchMap(m => {
    //   this.notifi.loadingAnimationV2({process: {percent: 50}})
    //   return this.loopDataPhongthiAndCapthi(m, this.hoidongSelect.id)
    // })).subscribe({
    //   next: (data) => {
    //     // this.listData =data;
    //     this.listData = data;
    //
    //
    //     this.listPhongthi = data.length > 0 ? this.sortPhongthi(data).map(m => {
    //
    //       m['_capHsk'] = this.convertCaphsk.find(f => f.tiengtrung === m.caphsk) ? this.convertCaphsk.find(f => f.tiengtrung === m.caphsk).tiengviet : m['cap_hsk'];
    //       m['_thoigian_duthi'] = m['thoigian_duthi'] ? this.HelperService.formatDatatimeVN(new Date(m['thoigian_duthi'])) : m['thoigian_duthi'];
    //       return m;
    //     }) : [];
    //
    //     console.log(this.listPhongthi);
    //
    //     this.notifi.disableLoadingAnimationV2();
    //     this.notifi.isProcessing(false);
    //     this.isLoading = false;
    //   }, error: () => {
    //     this.notifi.disableLoadingAnimationV2();
    //     this.notifi.isProcessing(false);
    //     this.isLoading = false;
    //     this.notifi.toastError('Load dữ liệu không thành công');
    //   }
    // })
  }

  btnPhieuThukyDowload(item: any) {

    if (item['mau'] == 'M01') {
      this.btnEpM01()

    } else if (item['mau'] == 'M02') {
      this.btnEpM02()

    } else if (item['mau'] == 'M03') {

      const link = document.createElement('a');
      link.href = 'assets/files/hsk/bieumau/M03.docx';
      link.download = 'M03.docx';
      link.click();
    } else if (item['mau'] == 'M04') {
      // this.btnEpM11()
      const link = document.createElement('a');
      link.href = 'assets/files/hsk/bieumau/M04.docx';
      link.download = 'M04.docx';
      link.click();
    } else if (item['mau'] == 'M05') {
      // this.btnEpM11()
      const link = document.createElement('a');
      link.href = 'assets/files/hsk/bieumau/M05.docx';
      link.download = 'M05.docx';
      link.click();
    } else if (item['mau'] == 'M06') {
      // this.btnEpM11()
      const link = document.createElement('a');
      link.href = 'assets/files/hsk/bieumau/M06.docx';
      link.download = 'M06.docx';
      link.click();
    } else if (item['mau'] == 'M07') {
      // this.btnEpM11()
      const link = document.createElement('a');
      link.href = 'assets/files/hsk/bieumau/M07.docx';
      link.download = 'M07.docx';
      link.click();
    } else if (item['mau'] == 'M08') {
      // this.btnEpM11()
      const link = document.createElement('a');
      link.href = 'assets/files/hsk/bieumau/M08.docx';
      link.download = 'M08.docx';
      link.click();
    } else if (item['mau'] == 'M09') {
      // this.btnEpM11()
      const link = document.createElement('a');
      link.href = 'assets/files/hsk/bieumau/M09.docx';
      link.download = 'M09.docx';
      link.click();
    } else if (item['mau'] == 'M10') {
      // this.btnEpM11()
      const link = document.createElement('a');
      link.href = 'assets/files/hsk/bieumau/M10.docx';
      link.download = 'M10.docx';
      link.click();
    } else if (item['mau'] == 'M11') {
      // this.btnEpM11()
      const link = document.createElement('a');
      link.href = 'assets/files/hsk/bieumau/M11.docx';
      link.download = 'M11.docx';
      link.click();
    } else if (item['mau'] == 'M12') {
      // this.btnEpM11()
      const link = document.createElement('a');
      link.href = 'assets/files/hsk/bieumau/M12.docx';
      link.download = 'M12.docx';
      link.click();
    } else if (item['mau'] == 'M13') {
      // this.btnEpM11()
      const link = document.createElement('a');
      link.href = 'assets/files/hsk/bieumau/M13.docx';
      link.download = 'M13.docx';
      link.click();
    } else if (item['mau'] == 'M14') {
      // this.btnEpM11()
      // const link = document.createElement('a');
      // link.href = 'assets/files/hsk/bieumau/M14.docx';
      // link.download = 'M14.docx';
      // link.click();
      this.btnEpM14();
    } else if (item['mau'] == 'M15') {
      // this.btnEpM11()
      const link = document.createElement('a');
      link.href = 'assets/files/hsk/bieumau/M15.docx';
      link.download = 'M15.docx';
      link.click();
    } else if (item['mau'] == 'M16') {
      // this.btnEpM11()
      const link = document.createElement('a');
      link.href = 'assets/files/hsk/bieumau/M16.docx';
      link.download = 'M16.docx';
      link.click();
    } else if (item['mau'] == 'M17') {
      // this.btnEpM11()
      const link = document.createElement('a');
      link.href = 'assets/files/hsk/bieumau/M17.docx';
      link.download = 'M17.docx';
      link.click();
    } else if (item['mau'] == 'M18') {
      // this.btnEpM11()
      const link = document.createElement('a');
      link.href = 'assets/files/hsk/bieumau/M18.docx';
      link.download = 'M18.docx';
      link.click();
    } else if (item['mau'] == 'M19') {
      // this.btnEpM11()
      const link = document.createElement('a');
      link.href = 'assets/files/hsk/bieumau/M19.xlsx';
      link.download = 'M19.xlsx';
      link.click();
    } else if (item['mau'] == 'M20') {
      // this.btnEpM11()
      const link = document.createElement('a');
      link.href = 'assets/files/hsk/bieumau/M20.docx';
      link.download = 'M20.docx';
      link.click();
    } else if (item['mau'] == 'M21') {
      this.btnExportM21()
    } else if (item['mau'] == 'M22') {
      // this.btnEpM11()
      const link = document.createElement('a');
      link.href = 'assets/files/hsk/bieumau/M22.docx';
      link.download = 'M22.docx';
      link.click();
    } else if (item['mau'] == 'M23') {
      // this.btnEpM11()
      const link = document.createElement('a');
      link.href = 'assets/files/hsk/bieumau/M23.docx';
      link.download = 'M23.docx';
      link.click();
    } else if (item['mau'] == 'M24') {
      // this.btnEpM11()
      const link = document.createElement('a');
      link.href = 'assets/files/hsk/bieumau/M24.docx';
      link.download = 'M24.docx';
      link.click();
    } else if (item['mau'] == 'M25') {
      // this.btnEpM11()
      const link = document.createElement('a');
      link.href = 'assets/files/hsk/bieumau/M25.docx';
      link.download = 'M25.docx';
      link.click();
    } else if (item['mau'] == 'M26') {
      // this.btnEpM11()
      const link = document.createElement('a');
      link.href = 'assets/files/hsk/bieumau/M26.docx';
      link.download = 'M26.docx';
      link.click();
    } else if (item['mau'] == 'M27') {
      // this.btnEpM11()
      const link = document.createElement('a');
      link.href = 'assets/files/hsk/bieumau/M27.docx';
      link.download = 'M27.docx';
      link.click();
    }


  }

  btnEpM01() {
    this.notifi.isProcessing(true);
    this.notifi.loadingAnimationV2({process: {percent: 0}})

    this.hskHoidongthiThisinhService.getDataByHoidongAndGroundBy(this.hoidongSelect.id, 'phongthi', 'phongthi').pipe(switchMap(m => {
      this.notifi.loadingAnimationV2({process: {percent: 50}})
      return this.loopDataPhongthiAndCapthi(m, this.hoidongSelect.id)
    })).subscribe({
      next: (data) => {
        const result = [];
        data.forEach(e => {
          if (Array.isArray(e['child'])) {

            const arrMap = e['child'].map(m => {
              m['objectCaphsk'] = this.convertCaphsk.find(f => f.tiengtrung === m.caphsk)
              return m;
            })
            result.push(...arrMap);
          }
        });
        this.notifi.loadingAnimationV2({process: {percent: 100}});

        this.notifi.disableLoadingAnimationV2();
        this.notifi.isProcessing(false);
        this.hskExportHoidongService.m01(this.sortPhongthi(result), this.hoidongSelect, 'BIỂN PHÒNG THI HSK');
      }, error: () => {
        this.notifi.isProcessing(false);
        this.notifi.toastError('Thao tác không thành công');
        this.notifi.disableLoadingAnimationV2();

      }
    })
  }

  private loopDataPhongthiAndCapthi(data: HskHoidongthiThiSinh[], hoidong_id: number): Observable<HskHoidongthiThiSinh[]> {
    const index = data.findIndex(f => !f['data']);

    if (index !== -1) {
      return this.hskHoidongthiThisinhService.getDataByHoidongAndPhongthiAndGroundBy(hoidong_id, data[index].phongthi, 'caphsk', 'phongthi,caphsk,thoigian_duthi').pipe(switchMap(m => {
        data[index]['child'] = m.length > 0 ? m.sort((a, b) => {
          return new Date(a.thoigian_duthi).getTime() - new Date(b.thoigian_duthi).getTime();
        }).map(m => {
          m['_capHsk'] = this.convertCaphsk.find(f => f.tiengtrung === m.caphsk) ? this.convertCaphsk.find(f => f.tiengtrung === m.caphsk).tiengviet : m['cap_hsk'];
          m['_thoigian_duthi'] = m['thoigian_duthi'] ? this.HelperService.formatDatatimeVN(new Date(m['thoigian_duthi'])) : m['thoigian_duthi'];
          m['_objectCaphsk'] = this.convertCaphsk.find(f => f.tiengtrung === m.caphsk) ? this.convertCaphsk.find(f => f.tiengtrung === m.caphsk) : null;
          return m;
        }) : [];
        data[index]['data'] = true;
        return this.loopDataPhongthiAndCapthi(data, hoidong_id);
      }))
    } else {
      return of(data);
    }
  }

  sortPhongthi(arr: any[]) {
    return arr.sort((a, b) => {
      const getNumbers = str => str.match(/\d+(\.\d+)?/g)?.map(Number) || [];

      const [aMajor, aMinor] = getNumbers(a.phongthi);
      const [bMajor, bMinor] = getNumbers(b.phongthi);

      if (aMajor !== bMajor) return aMajor - bMajor;
      return (aMinor || 0) - (bMinor || 0);
    });
  }

  btnEpM02() {

    this.notifi.isProcessing(true);
    this.notifi.loadingAnimationV2({process: {percent: 0}})

    this.hskHoidongthiThisinhService.getDataByHoidongAndGroundBy(this.hoidongSelect.id, 'phongthi', 'phongthi').pipe(switchMap(m => {
      this.notifi.loadingAnimationV2({process: {percent: 50}})
      return forkJoin([
        this.loopDataPhongthiAndCapthi(m, this.hoidongSelect.id),
        this.loopGetDataByEpMO2(1, 50, this.hoidongSelect.id, [], 1)
      ])
    })).subscribe({
      next: ([databyPhong, dataAll]) => {
        const result = [];
        databyPhong.forEach(e => {
          if (Array.isArray(e['child'])) {

            const arrMap = e['child'].map(m => {
              m['objectCaphsk'] = this.convertCaphsk.find(f => f.tiengtrung === m.caphsk);
              m['__dataChild'] = dataAll.filter(f => f.phongthi === m.phongthi && f.caphsk === m.caphsk).map((a, index) => {
                return {
                  index: index + 1,
                  sobaodanh: a.sobaodanh,
                  hoten: a.hoten,
                  gioitinh: a.gioitinh,
                  ngaysinh: a.ngaysinh,
                  cccd_so: a.cccd_so,
                  phongthi: a.phongthi,
                  ghichu: ''
                }
              });
              m['__hoidong'] = this.hoidongSelect;
              return m;
            })
            result.push(...arrMap);
          }
        });

        this.notifi.loadingAnimationV2({process: {percent: 100}});

        this.notifi.disableLoadingAnimationV2();
        this.notifi.isProcessing(false);

        this.hskExportHoidongService.m02(result, this.arrHeadM02, 'Danh sách Phòng thi');

      }, error: () => {
        this.notifi.isProcessing(false);
        this.notifi.toastError('Thao tác không thành công');
        this.notifi.disableLoadingAnimationV2();

      }
    })


    // this.notifi.isProcessing(true);
    // this.notifi.loadingAnimationV2({process: {percent: 0}})
    // this.hskHoidongthiThisinhService.getDataByHoidongAndGroundBy(this.hoidongSelect.id, 'caphsk', 'caphsk').pipe(
    //   switchMap(m => {
    //     this.notifi.loadingAnimationV2({process: {percent: 50}})
    //
    //     return forkJoin([
    //       of(m),
    //       this.loopGetDataByEpMO2(1, 50, this.hoidongSelect.id, [], 1)
    //     ])
    //   })
    // ).subscribe({
    //   next: ([capthi, data]) => {
    //     const capthiMap = capthi.map(m => {
    //
    //       m['ObjectCapHsk'] = this.convertCaphsk.find(f => f.tiengtrung === m.caphsk);
    //
    //       const newData = Array.from(
    //         data.filter(f => f.caphsk == m.caphsk).map((m, index) => {
    //           return {
    //             index: index + 1,
    //             sobaodanh: m.sobaodanh,
    //             hoten: m.hoten,
    //             gioitinh: m.gioitinh,
    //             ngaysinh: m.ngaysinh,
    //             cccd_so: m.cccd_so,
    //             phongthi: m.phongthi,
    //             ghichu: ''
    //           }
    //         }))
    //       m['__hoidong'] = (this.hoidongSelect);
    //
    //       m['child'] = newData;
    //       return m;
    //
    //     })
    //
    //     const orderMap = Array.from(this.convertCaphsk.map(item => item.tiengtrung));
    //
    //     capthiMap.sort((a, b) => {
    //       return orderMap.indexOf(a.caphsk) - orderMap.indexOf(b.caphsk);
    //     });
    //     this.hskExportHoidongService.m02(capthiMap, this.arrHeadM02, 'Danh sách Phòng thi');
    //     this.notifi.disableLoadingAnimationV2()
    //
    //     this.notifi.isProcessing(false);
    //
    //   }, error: () => {
    //     this.notifi.isProcessing(false);
    //     this.notifi.disableLoadingAnimationV2()
    //
    //   }
    // })
  }

  arrHeadM02 = ['STT', 'SBD', 'Họ và tên', 'Giới tính', 'Ngày sinh', 'Số CCCD/Hộ chiếu', 'Phòng thi', 'Ghi chú',];

  private loopGetDataByEpMO2(page: number, limit: number, hoidong_id: number, data: HskHoidongthiThiSinh[], recordsFiltered: number): Observable<HskHoidongthiThiSinh[]> {
    if (data.length < recordsFiltered) {


      return this.hskHoidongthiThisinhService.getDataByHoidongAndSearch(page, hoidong_id, '', limit).pipe(
        switchMap(m => {

          return this.loopGetDataByEpMO2(page + 1, limit, hoidong_id, data.concat(m['data']), m['recordsTotal'])
        })
      )
    } else {
      return of(data);
    }
  }

  btnEpM14() {
    this.notifi.isProcessing(true);
    this.notifi.loadingAnimationV2({process: {percent: 0}})

    this.hskHoidongthiThisinhService.getDataByHoidongAndGroundBy(this.hoidongSelect.id, 'phongthi', 'phongthi').pipe(switchMap(m => {
      this.notifi.loadingAnimationV2({process: {percent: 50}})
      return this.loopDataPhongthiAndCapthi(m, this.hoidongSelect.id)
    })).subscribe({
      next: (data) => {
        const result = [];
        data.forEach(e => {
          if (Array.isArray(e['child'])) {

            const arrMap = e['child'].map(m => {
              m['objectCaphsk'] = this.convertCaphsk.find(f => f.tiengtrung === m.caphsk)
              return m;
            })
            result.push(...arrMap);
          }
        });
        this.notifi.loadingAnimationV2({process: {percent: 100}});

        this.notifi.disableLoadingAnimationV2();
        this.notifi.isProcessing(false);
        this.hskExportHoidongService.m14(this.sortPhongthi(result), this.hoidongSelect, 'Danh sách bìa túi phụ');
      }, error: () => {
        this.notifi.isProcessing(false);
        this.notifi.toastError('Thao tác không thành công');
        this.notifi.disableLoadingAnimationV2();

      }
    })

  }

  btnDownloadTuiphu(item: HskHoidongthiThiSinh) {

  }

  btnExportM12(caphsk: HskHoidongthiThiSinh) {
    this.notifi.loadingAnimationV2({process: {percent: 0}});

    this.hskHoidongthiThisinhService.getdataByhoidongAndphongthiAndcapthiAndthoigian(this.hoidongSelect.id, null, caphsk.caphsk, null)
      .subscribe({
        next: (data) => {
          this.notifi.disableLoadingAnimationV2();
          const danhSachPhongThiObj = Array.from(
            new Map(data.map(ts => [ts.phongthi, { phongThi: ts.phongthi }])).values()
          ).map((phong, index) => {
            const thisinhByPhong = data.filter(f => f.phongthi === phong.phongThi);
            const arrThisinh = thisinhByPhong.length > 0
              ? this.sortBySobd(thisinhByPhong).map((thiSinh, i) => ({
                index: i + 1,
                sobaodanh: thiSinh.sobaodanh,
                hoten: thiSinh.hoten,
                gioitinh: thiSinh.gioitinh,
                ngaysinh: thiSinh.ngaysinh,
                cccd_so: thiSinh.cccd_so,
                phongthi: thiSinh.phongthi,
                kynop: ''
              }))
              : [];

            // Gán vào từng phòng
            return {
              ...phong,
              __dataChild: arrThisinh,
              objectCaphsk:caphsk

            };
          });

          // console.log(danhSachPhongThiObj); // hoặc gán vào biến trong component
          if(danhSachPhongThiObj.length>0){
                  this.hskExportHoidongService.exportM12V2(danhSachPhongThiObj, this.hoidongSelect,['TT','Số báo danh','Họ và tên','Giới tính','Ngày sinh','CCCD/Hộ chiếu','Phòng thi','Ký nộp'], caphsk['_capHsk'] + ' - danh sách ký nộp');
            //       this.hskExportHoidongService.exportM12(arrMap, phongthi, this.hoidongSelect, phongthi.phongthi + ' - danh sách ký nộp');

          }
        },
        error: (err) => {
          console.error('Lỗi khi tải dữ liệu:', err);
          this.notifi.disableLoadingAnimationV2();

        }
      });

    // this.hskHoidongthiThisinhService.getdataByhoidongAndphongthiAndcapthiAndthoigian(this.hoidongSelect.id, phongthi.phongthi, phongthi.caphsk, phongthi.thoigian_duthi).subscribe({
    //   next: (data) => {
    //
    //     const arrMap = data.length > 0 ? this.sortArrByName(data).map((m, index) => {
    //
    //       return {
    //         index: index + 1,
    //         sobaodanh: m.sobaodanh,
    //         hoten: m.hoten,
    //         gioitinh: m.gioitinh,
    //         ngaysinh: m.ngaysinh,
    //         cccd_so: m.cccd_so,
    //         phonthi: m.phongthi,
    //         kynop: ''
    //       };
    //     }) : [];
    //     if (arrMap.length > 0) {
    //       this.hskExportHoidongService.exportM12(arrMap, phongthi, this.hoidongSelect, phongthi.phongthi + ' - danh sách ký nộp');
    //     }
    //
    //   }, error: (e) => {
    //     this.notifi.isProcessing(false);
    //     this.notifi.toastError('Load dữ liệu không thành công');
    //   }
    // })

  }

    btnExportM13(caphsk:HskHoidongthiThiSinh)
    {

      // this.notifi.loadingAnimationV2({process: {percent: 0}});
      // this.hskHoidongthiThisinhService.getdataByhoidongAndphongthiAndcapthiAndthoigian(this.hoidongSelect.id, phongthi.phongthi, phongthi.caphsk, phongthi.thoigian_duthi).subscribe({
      //   next: (data) => {
      //     // console.log(data);
      //     const arrMap = data.length > 0 ? this.sortArrByName(data).map((m, index) => {
      //       this.notifi.loadingAnimationV2({process: {percent: 100}});
      //
      //       return {
      //         index: index + 1,
      //         sobaodanh: m.sobaodanh,
      //         hoten: m.hoten,
      //         gioitinh: m.gioitinh,
      //         ngaysinh: m.ngaysinh,
      //         cccd_so: m.cccd_so,
      //         phonthi: m.phongthi,
      //         chungchi: '',
      //         kynop: ''
      //       };
      //     }) : [];
      //     if (arrMap.length > 0) {
      //       this.hskExportHoidongService.exportM13(arrMap, phongthi, this.hoidongSelect, phongthi.phongthi + ' - Sổ cấp chứng chỉ');
      //     }
      //
      //     this.notifi.disableLoadingAnimationV2();
      //   }, error: (e) => {
      //     this.notifi.disableLoadingAnimationV2();
      //     this.notifi.isProcessing(false);
      //     this.notifi.toastError('Load dữ liệu không thành công');
      //   }
      // })

      this.notifi.loadingAnimationV2({process: {percent: 0}});

      this.hskHoidongthiThisinhService.getdataByhoidongAndphongthiAndcapthiAndthoigian(this.hoidongSelect.id, null, caphsk.caphsk, null)
        .subscribe({
          next: (data) => {
            this.notifi.disableLoadingAnimationV2();
            const danhSachPhongThiObj = Array.from(
              new Map(data.map(ts => [ts.phongthi, { phongThi: ts.phongthi }])).values()
            ).map((phong, index) => {
              const thisinhByPhong = data.filter(f => f.phongthi === phong.phongThi);
              const arrThisinh = thisinhByPhong.length > 0
                ? this.sortBySobd(thisinhByPhong).map((thiSinh, i) => ({
                  index: i + 1,
                  sobaodanh: thiSinh.sobaodanh,
                  hoten: thiSinh.hoten,
                  gioitinh: thiSinh.gioitinh,
                  ngaysinh: thiSinh.ngaysinh,
                  cccd_so: thiSinh.cccd_so,
                  phongthi: thiSinh.phongthi,
                  chungchi: '',
                  kynop: ''
                }))
                : [];

              // Gán vào từng phòng
              return {
                ...phong,
                __dataChild: arrThisinh,
                objectCaphsk:caphsk

              };
            });

            // console.log(danhSachPhongThiObj); // hoặc gán vào biến trong component
            if(danhSachPhongThiObj.length>0){
              this.hskExportHoidongService.exportM13V2(danhSachPhongThiObj, this.hoidongSelect,['TT','Số báo danh','Họ và tên','Giới tính','Ngày sinh','CCCD/Hộ chiếu','Phòng thi','Chứng chỉ','Ký nộp'], caphsk['_capHsk'] + ' - danh sách sổ cấp chứng chỉ');
              //       this.hskExportHoidongService.exportM12(arrMap, phongthi, this.hoidongSelect, phongthi.phongthi + ' - danh sách ký nộp');

            }
          },
          error: (err) => {
            console.error('Lỗi khi tải dữ liệu:', err);
            this.notifi.disableLoadingAnimationV2();

          }
        });


    }

    sortArrByName(arr: HskHoidongthiThiSinh[])
    {
      const collator = new Intl.Collator('vi', {sensitivity: 'base'});
      return arr.sort((a, b) => {
        const lastA = a.hoten.trim().split(" ").pop();
        const lastB = b.hoten.trim().split(" ").pop();
        return collator.compare(lastA, lastB);
      });
    }

    btnExportM21()
    {

      this.notifi.loadingAnimationV2({process: {percent: 0}})
      this.hskHoidongthiThisinhService.getDataByHoidongAndGroundBy(this.hoidongSelect.id, 'phongthi', 'phongthi').pipe(switchMap(m => {
        this.notifi.loadingAnimationV2({process: {percent: 50}})
        return this.loopDataPhongthiAndCapthi(m, this.hoidongSelect.id).pipe(switchMap(m => {
          const allChildren: HskHoidongthiThiSinh[] = m.reduce((acc, item) => {
            return acc.concat(item['child'] || []);
          }, []);
          return this.loopGetNumOfPhongthiCapthi(allChildren, this.hoidongSelect.id)
        }))
      })).subscribe({
        next: (data) => {
          // this.listData =data;

          const newCathi = this.cathi.map(m => {
            m['_arr'] = data.length > 0 ? this.sortPhongthi(data.filter(f => f['_objectCaphsk']['cathi'] === m.name)) : [];
            return m;
          })
          const total = data.reduce((m, item) => m + item['soluong'], 0);
          this.hskExportHoidongService.m21(newCathi, this.hoidongSelect, 'M21-Biên bản bàn giao danh sách ký nộp');
          this.notifi.disableLoadingAnimationV2();
          this.notifi.isProcessing(false);
          this.isLoading = false;
        }, error: () => {
          this.notifi.disableLoadingAnimationV2();
          this.notifi.isProcessing(false);
          this.isLoading = false;
          this.notifi.toastError('Load dữ liệu không thành công');
        }
      })
    }

    loopGetNumOfPhongthiCapthi(data: HskHoidongthiThiSinh[], hoidong_id: number): Observable < HskHoidongthiThiSinh[] > {
      const index = data.findIndex(f => !f['have'])
      if(index !== -1
  )
    {
      const item = data[index];
      // return of(data);
      return this.hskHoidongthiThisinhService.getTotalThisinhByhoidongAndPhongthiAndCapthi(hoidong_id, item.phongthi, item.caphsk).pipe(switchMap(m => {
        data[index]['have'] = true;
        data[index]['soluong'] = m;

        return this.loopGetNumOfPhongthiCapthi(data, hoidong_id);
      }));

    }
  else
    {
      return of(data)

    }
  }

  sortBySobd(arr:any[]){

      return arr
        .map(item => ({
          ...item,
          last5: parseInt(item.sobaodanh.slice(-5), 10)
        }))
        .sort((a, b) => a.last5 - b.last5)
        .map(({ last5, ...rest }) => rest); // loại bỏ last5 nếu không cần
  }


  }
