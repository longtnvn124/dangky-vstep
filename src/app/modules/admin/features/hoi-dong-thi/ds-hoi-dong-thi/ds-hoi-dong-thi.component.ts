import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {FormType, NgPaginateEvent, OvicForm} from '@modules/shared/models/ovic-models';
import { Paginator } from 'primeng/paginator';
import {debounceTime, filter, forkJoin, Observable, of, Subject, Subscription, switchMap} from 'rxjs';
import {HskKehoachThiService, KeHoachThi} from "@shared/services/hsk-kehoach-thi.service";
import { ThemeSettingsService } from '@core/services/theme-settings.service';
import {HskHoidongthi, HskHoidongthiService} from "@shared/services/hsk-hoidongthi.service";
import {NotificationService} from "@core/services/notification.service";
import {HelperService} from "@core/services/helper.service";
import {DanhMucCapDoService} from "@shared/services/danh-muc-cap-do.service";
import {DmCapdo} from "@shared/models/danh-muc";
import {HskHoidongthiThiSinh, HskHoidongthiThisinhService} from "@shared/services/hsk-hoidongthi-thisinh.service";
import {BUTTON_NO, BUTTON_YES} from "@core/models/buttons";


interface FormHoiDong extends OvicForm {
  object: HskHoidongthi;
}
@Component({
  selector: 'app-ds-hoi-dong-thi',
  templateUrl: './ds-hoi-dong-thi.component.html',
  styleUrls: ['./ds-hoi-dong-thi.component.css']
})
export class DsHoiDongThiComponent implements OnInit {

  @ViewChild(Paginator) paginator: Paginator;
  @ViewChild('fromUpdate', {static: true}) template: TemplateRef<any>;
  @ViewChild('phongthi', {static: true}) phongthi: TemplateRef<any>;
  @ViewChild('addThiSinh', {static: true}) addThiSinh: TemplateRef<any>;
  @ViewChild('ketquathi', {static: true}) ketquathi: TemplateRef<any>;
  // @ViewChild(AddThiSinhComponent) addThisinhComponent: AddThiSinhComponent;
  // @ViewChild('thiSinhInPhongThi', {static: true}) thiSinhInPhongThi: TemplateRef<any>;
  // @ViewChild('capnhatCathi', {static: true}) capnhatCathi: TemplateRef<any>;
  // @ViewChild('ViewThongKe', {static: true}) viewThongKe: TemplateRef<any>;

  statusList = [
    {
      value: 1,
      label: 'Đã Kích hoạt',
      color: '<span class="badge badge--size-normal badge-success w-100">Đã Kích hoạt</span>'
    },
    {
      value: 0,
      label: 'Chưa kích hoạt',
      color: '<span class="badge badge--size-normal badge-danger w-100">Chưa kích hoạt</span>'
    }
  ];
  listForm = {
    [FormType.ADDITION]: {type: FormType.ADDITION, title: 'Thêm mới hội đồng', object: null, data: null},
    [FormType.UPDATE]: {type: FormType.UPDATE, title: 'Cập nhật hội đồng', object: null, data: null}
  };
  rows = this.themeSettings.settings.rows;
  page: number = 1;
  recordsTotal: number = 0;
  search: string = '';
  formActive: FormHoiDong;
  formSave: FormGroup;
  isLoading: boolean = true;
  loadInitFail: boolean = false;
  dataKeHoach: KeHoachThi[];
  subscription = new Subscription();
  sizeFullWidth = 1024;
  needUpdate = false;
  menuName: 'hoi-dong';
  btn_checkAdd: 'Lưu lại' | 'Cập nhật';
  _kehoach_id: number;
  private OBSERVE_PROCESS_FORM_DATA = new Subject<FormHoiDong>();
  hoidong_id: number;
  listData: HskHoidongthi[];
  kehoach_id_param: number;
  thiSinhSelectTotal: number = 0;
  orderSelectTotal: number = 0;
  dsCapdo: DmCapdo[];



  hoidong_select: HskHoidongthi;

  private inputChanged: Subject<string> = new Subject<string>();



  constructor(
    private themeSettings: ThemeSettingsService,
    private kehoachThiService: HskKehoachThiService,
    private hskHoidongthiService: HskHoidongthiService,
    private notifi: NotificationService,
    private fb: FormBuilder,
    private helperService: HelperService,
    private danhMucCapDoService:DanhMucCapDoService,
    private hskHoidongthiThisinhService: HskHoidongthiThisinhService
  ) {
    const observeProcessFormData = this.OBSERVE_PROCESS_FORM_DATA.asObservable().pipe(debounceTime(100)).subscribe(form => this.__processFrom(form));
    this.subscription.add(observeProcessFormData);
    const observeProcessCloseForm = this.notifi.onSideNavigationMenuClosed().pipe(filter(menuName => menuName === this.menuName && this.needUpdate)).subscribe(() => this.loadData());
    this.subscription.add(observeProcessCloseForm);
    const observerOnResize = this.notifi.observeScreenSize.subscribe(size => this.sizeFullWidth = size.width)
    this.subscription.add(observerOnResize);

    this.formSave = this.fb.group({
      kehoach_id: [null, Validators.required],
      title: ['', Validators.required],
      mota: [null],
      state: [1, Validators.required],
      ngaythi: ['', Validators.required],
    })
  }


  ngOnInit(): void {
    this.inputChanged.pipe(debounceTime(1000)).subscribe((item: string) => {
      this.searchContentByInput(item);
    });
    this.loadInit()
  }

  loadInit() {
    this.notifi.isProcessing(true)
    this.isLoading = true;
    forkJoin<[DmCapdo[], KeHoachThi[]]>
    ([
      this.danhMucCapDoService.getDataUnlimit(),
      this.kehoachThiService.getDataUnlimitNotstatus(),
    ]).subscribe({
      next: ([dmCapdo, data]) => {
        this.dsCapdo = dmCapdo;

        this.dataKeHoach = data;

        if (this.dsCapdo && this.dataKeHoach) {
          this.loadData()
        }
        this.notifi.isProcessing(false);
        this.isLoading = false;
      }, error: () => {
        this.notifi.isProcessing(false);
        this.isLoading = false;
        this.notifi.toastError('Mất kết nối với máy chủ');
      }
    })
  }

  changeSelectData(event) {
    this._kehoach_id = event;
    this.getDataHoiDong(event);
  }

  loadData() {
    this.getDataHoiDong(1)
  }


  getDataHoiDong(page: number) {
    this.isLoading = true;
    this.notifi.isProcessing(true);
    this.page = page;
    this.hskHoidongthiService.getDataByKehoachIdAndSearch(this.page, this.search, this._kehoach_id).pipe(switchMap(prj => {
      return this.loadThisinhByHoidong(prj)
    })).subscribe({
      next: ({recordsTotal, data}) => {
        this.recordsTotal = recordsTotal;
        this.listData = data.map((m, index) => {
          m['__indexTable'] = (index + 1) + (this.page - 1) * 10;
          m['__kehoach_coverted'] = this.dataKeHoach && this.dataKeHoach.find(f => f.id === m.kehoach_id) ? this.dataKeHoach.find(f => f.id === m.kehoach_id).dotthi : '';
          const sIndex = this.statusList.findIndex(i => i.value === m.state);
          m['__status_converted'] = sIndex !== -1 ? this.statusList[sIndex].color : '';
          m['__ngaythi'] = m.ngaythi ? this.helperService.formatSQLToDateDMY(new Date(m.ngaythi)) : "";
          // const thisinhData = m['thisinhData'];
          m['__total'] = m['totalThisinh'];
          // this.dmMon.forEach(f => {
          //   m['__mon_' + f.kyhieu.toLowerCase()] = thisinhData ? this.covernumber(this.countOccurrences(f.id, thisinhData)) : '00';
          // })


          return m;
        })
        this.isLoading = false;
        this.notifi.isProcessing(false);
      },
      error: (e) => {
        this.isLoading = false;
        this.notifi.isProcessing(false);
      }
    })
  }

  private loadThisinhByHoidong(input: { recordsTotal: number; data: HskHoidongthi[] }): Observable<{
    recordsTotal: number;
    data: HskHoidongthi[]
  }> {
    try {
      const index: number = input.data.findIndex(t => !t['_haveThisinh']);
      if (index !== -1) {
        return this.hskHoidongthiThisinhService.getTotalThisinh(input.data[index].id).pipe(
          switchMap(m => {
            // console.log(m);
            input.data[index]['_haveThisinh'] = true;
            input.data[index]['totalThisinh'] = m;
            return this.loadThisinhByHoidong(input);
          })
        );
      } else {
        return of(input);
      }
    } catch (e) {
      return of(input);
    }
  }

  private __processFrom({data, object, type}: FormHoiDong) {
    this.isLoading = true;
    const observer$: Observable<any> = type === FormType.ADDITION ? this.hskHoidongthiService.create(data) : this.hskHoidongthiService.update(object.id, data);
    observer$.subscribe({
      next: () => {
        this.needUpdate = true;
        if (type === FormType.ADDITION) {
          this.formSave.reset({
            kehoach_id: null,
            title: '',
            mota: '',
            status: 1,
            ngaythi: '',
            tiento_sobaodanh: 'TNU241'
          });
        }
        this.getDataHoiDong(this._kehoach_id);
        this.isLoading = false;
        this.notifi.toastSuccess('Thao tác thành công', 'Thông báo');
      },
      error: () => {
        this.isLoading = false;
        this.notifi.toastError('Thao tác thất bại', 'Thông báo');
      }
    });
  }

  get f(): { [key: string]: AbstractControl<any> } {
    return this.formSave.controls;
  }

  searchContentByInput(text: string) {
    this.page = 1;
    this.search = text.trim();
    this.getDataHoiDong(this.page);
  }

  onInputChange(event: string) {
    this.inputChanged.next(event);
  }

  btnAddNew(type: 'add' | 'update', item?: HskHoidongthi) {
    if (type === 'add') {
      this.btn_checkAdd = "Lưu lại";
      this.formActive = this.listForm[FormType.ADDITION];
      this.preSetupForm(this.menuName);
      this.formSave.reset({
        kehoach_id: null,
        title: '',
        mota: '',
        state: 1,
        ngaythi: ''
      });
    } else if (type === 'update') {
      this.btn_checkAdd = "Cập nhật"
      const object1 = this.listData.find(u => u.id === item.id);
      this.formSave.reset({
        kehoach_id: object1.kehoach_id,
        title: object1.title,
        mota: object1.mota,
        state: object1.state,
        ngaythi: object1.ngaythi ? new Date(object1.ngaythi) : null
      });
      this.formActive = this.listForm[FormType.UPDATE];
      this.formActive.object = object1;
      this.preSetupForm(this.menuName);
    }
  }

  private preSetupForm(name: string) {
    this.notifi.isProcessing(false);
    this.notifi.openSideNavigationMenu({
      name: name,
      template: this.template,
      size: 1024,
      offsetTop: '0px'
    });
  }

  closeForm() {
    this.loadInit();
    this.notifi.closeSideNavigationMenu(this.menuName);
  }

  formatSQLDateTime(date: Date): string {
    const y = date.getFullYear().toString();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    //'YYYY-MM-DD hh:mm:ss' type of sql DATETIME format
    return `${y}-${m}-${d}`;
  }

  saveForm() {
    const titleInput = this.f['title'].value.trim();

    // if (this.formActive === this.listForm[FormType.ADDITION]) {
    //   const tiento = this.tientos.find(f => f.tiento_sobaodanh === this.f['tiento_sobaodanh'].value) ? '' : this.f['tiento_sobaodanh'].value;
    //   this.f['tiento_sobaodanh'].setValue(tiento)
    //   if (tiento === '') {
    //     this.notifi.toastWarning('Tiền tố số báo danh đã trùng với hội đồng khác, vui lòng nhập lại ');
    //   }
    // }

    const object = {
      title: titleInput,
      ngaythi: this.formatSQLDateTime(new Date(this.formSave.value['ngaythi'])),
      kehoach_id: this.f['kehoach_id'].value,
      mota: this.f['mota'].value,
      state: this.f['state'].value,
    }

    if (this.formSave.valid) {
      if (titleInput !== '') {
        this.formActive.data = object;
        this.OBSERVE_PROCESS_FORM_DATA.next(this.formActive);
      } else {
        this.notifi.toastWarning('Vui lòng không nhập khoảng trống');
      }
    } else {
      this.formSave.markAllAsTouched();
      this.notifi.toastWarning('Vui lòng nhập đủ thông tin');
    }
  }

  async btnDelete(item: HskHoidongthi) {
    const confirm = await this.notifi.confirmDelete();
    if (confirm) {
      this.hskHoidongthiService.delete(item.id).subscribe({
        next: () => {
          // this.page = Math.max(1, this.page - (this.listData.length > 1 ? 0 : 1));
          // this.listData.filter(f => f.id !== item.id)
          this.notifi.isProcessing(false);
          this.notifi.toastSuccess('Thao tác thành công');
          this.getDataHoiDong(this._kehoach_id);

        }, error: () => {
          this.notifi.isProcessing(false);
          this.notifi.toastError('Thao tác không thành công');
        }
      })
    }
  }

  btnAddThisinh(item: HskHoidongthi) {
    this.notifi.isProcessing(false);
    this.hoidong_select = {...item};
    this.hoidong_id = item.id;
    this.kehoach_id_param = item.kehoach_id;
    this.notifi.openSideNavigationMenu({
      template: this.addThiSinh,
      size: this.sizeFullWidth,
      offsetTop: '0px'
    });
  }

  btnViewPhongthi(item: HskHoidongthi){
    this.notifi.isProcessing(false);
    this.hoidong_select = {...item};
    this.hoidong_id = item.id;
    this.kehoach_id_param = item.kehoach_id;
    this.notifi.openSideNavigationMenu({
      template: this.phongthi,
      size: this.sizeFullWidth,
      offsetTop: '0px'
    });
  }


  onDataChange(event) {
    this.thiSinhSelectTotal = event.thisinhSelect;
    this.orderSelectTotal = event.orderSelect;
  }

  covernumber(input: number) {
    return input < 10 ? '0' + input : input.toString();
  }

  paginate({page}: NgPaginateEvent) {
    this.page = page + 1;

    this.getDataHoiDong(this.page);
  }

  countOccurrences(number, data) {
    return data.reduce((acc, item) => acc + (item.monthi_ids.includes(number) ? 1 : 0), 0);
  }
  async btnLockData(hoidong: HskHoidongthi) {
    const button = await this.notifi.confirmRounded('Thao tác nay sẽ khóa dữ liệu hội đồng thi ', 'XÁC NHẬN KHÓA DỮ LIỆU ', [BUTTON_NO, BUTTON_YES]);
    if (button.name === BUTTON_YES.name) {
      this.notifi.isProcessing(true);
      this.hskHoidongthiService.update(hoidong.id, {lock: 1}).subscribe({
        next: () => {
          this.notifi.isProcessing(false);
          this.notifi.toastSuccess('Khóa hội đồng thành công');
          this.loadData();
        },
        error: () => {
          this.notifi.isProcessing(false);
          this.notifi.toastError('Khóa hội đồng không thành công ');
        }
      })
    }
  }

  btnKetquathi(item: HskHoidongthi) {
    this.notifi.isProcessing(false);
    this.hoidong_select = {...item};
    this.hoidong_id = item.id;
    this.kehoach_id_param = item.kehoach_id;
    this.notifi.openSideNavigationMenu({
      template: this.ketquathi,
      size: this.sizeFullWidth,
      offsetTop: '0px'
    });
  }


}
