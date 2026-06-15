import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {FormType, NgPaginateEvent, OvicForm} from '@modules/shared/models/ovic-models';
import {Paginator, PaginatorModule} from 'primeng/paginator';
import {debounceTime, filter, forkJoin, Observable, of, Subject, Subscription, switchMap} from 'rxjs';
import {HskHoidongthi,} from "@shared/services/hsk-hoidongthi.service";
import {NotificationService} from "@core/services/notification.service";
import {HelperService} from "@core/services/helper.service";
import {BUTTON_NO, BUTTON_YES} from "@core/models/buttons";
import {DropdownModule} from "primeng/dropdown";
import {RippleModule} from "primeng/ripple";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
import {MatMenuModule} from "@angular/material/menu";
import {NgIf} from "@angular/common";
import {TooltipModule} from "primeng/tooltip";
import {InputTextModule} from "primeng/inputtext";
import {SharedModule} from "@shared/shared.module";
import {CalendarModule} from "primeng/calendar";
import {Hoidongthi, VstepHoidongThiService} from "@shared/services/vstep-hoidong-thi.service";
import {KeHoachThi, KehoachthiVstepService} from "@shared/services/vstep/kehoachthi-vstep.service";
import {ConditionOption} from "@shared/models/condition-option";
import {OvicQueryCondition} from "@core/models/dto";
import {
  AddThiSinhComponent
} from "@modules/admin/features/hoi-dong-thi/ds-hoi-dong-thi/add-thi-sinh/add-thi-sinh.component";
import {
  HoidongthiPhongthiComponent
} from "@modules/admin/features/hoi-dong-thi/ds-hoi-dong-thi/hoidongthi-phongthi/hoidongthi-phongthi.component";
import {AuthService} from "@core/services/auth.service";
import {
  HoidongthiBieumauComponent
} from "@modules/admin/features/hoi-dong-thi/ds-hoi-dong-thi/hoidongthi-bieumau/hoidongthi-bieumau.component";
import {
  AddThiSinhV2Component
} from "@modules/admin/features/hoi-dong-thi/ds-hoi-dong-thi/add-thi-sinh-v2/add-thi-sinh-v2.component";
import {HoidongThisinh, VstepHoidongThisinhService} from "@shared/services/vstep-hoidong-thisinh.service";
import {Languages, LanguagesService} from "@shared/services/vstep/languages.service";
import {
  KetQuaThiComponent
} from "@modules/admin/features/hoi-dong-thi/ds-hoi-dong-thi/ket-qua-thi/ket-qua-thi.component";
import {FileService} from "@core/services/file.service";
import {ThisinhInfoService} from "@shared/services/thisinh-info.service";
import {
  HoidongPhongthiThisinh,
  VstepHoidongPhongthiThisinhService
} from "@shared/services/vstep-hoidong-phongthi-thisinh.service";
import {OrdersVstep, VstepOrdersService} from "@shared/services/vstep-orders.service";
import {ExWordVstepService} from "@shared/services/export/ex-word-vstep.service";
import {ExpThisinhDuthiService} from "@shared/services/export/exp-thisinh-duthi.service";

interface FormHoiDong extends OvicForm {
  object: HskHoidongthi;
}
@Component({
  selector: 'app-ds-hoi-dong-thi',
  templateUrl: './ds-hoi-dong-thi.component.html',
  styleUrls: ['./ds-hoi-dong-thi.component.css'],
  imports: [
    DropdownModule,
    RippleModule,
    ButtonModule,
    TableModule,
    MatMenuModule,
    NgIf,
    TooltipModule,
    InputTextModule,
    SharedModule,
    PaginatorModule,
    ReactiveFormsModule,
    CalendarModule,
    AddThiSinhComponent,
    HoidongthiPhongthiComponent,
    HoidongthiBieumauComponent,
    AddThiSinhV2Component,
    KetQuaThiComponent,

  ],
  standalone: true
})
export class DsHoiDongThiComponent implements OnInit {

  @ViewChild(Paginator) paginator: Paginator;
  @ViewChild('fromUpdate', {static: true}) template             : TemplateRef<any>;
  @ViewChild('phongthi', {static: true}) phongthi               : TemplateRef<any>;
  @ViewChild('phongthiThisinh', {static: true}) phongthiThisinh : TemplateRef<any>;
  @ViewChild('addThiSinh', {static: true}) addThiSinh           : TemplateRef<any>;
  @ViewChild('ketquathi', {static: true}) ketquathi             : TemplateRef<any>;
  @ViewChild('dsBieumau', {static: true}) dsBieumau             : TemplateRef<any>;
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
  rows              : number = 20;
  page              : number = 1;
  recordsTotal      : number = 0;
  search            : string = '';
  formActive        : FormHoiDong;
  formSave          : FormGroup;
  isLoading         : boolean = true;
  loadInitFail      : boolean = false;
  dataKeHoach       : KeHoachThi[];
  subscription      : Subscription = new Subscription();
  sizeFullWidth     : number = 1024;
  needUpdate        : boolean = false;
  menuName          : string = 'hoi-dong';
  btn_checkAdd      : 'Lưu lại' | 'Cập nhật';
  _kehoach_id       : number;
  private OBSERVE_PROCESS_FORM_DATA = new Subject<FormHoiDong>();
  hoidong_id        : number;
  listData          : Hoidongthi[];
  kehoach_id_param  : number;
  hoidong_select    : Hoidongthi;

  private inputChanged: Subject<string> = new Subject<string>();

  isAdmin           : boolean = false;
  isTramthi         : boolean = false;
  listLanguage      : Languages[];

  constructor(
    private kehoachthiVstepService: KehoachthiVstepService,
    private hoidongThiService: VstepHoidongThiService,
    private notifi: NotificationService,
    private fb: FormBuilder,
    private helperService: HelperService,
    private auth: AuthService,
    private hoidongThisinhService: VstepHoidongThisinhService,
    private languagesService: LanguagesService,
    private fileService: FileService,
    private thisinhInfoService: ThisinhInfoService,
    private hoidongPhongthiThisinhService: VstepHoidongPhongthiThisinhService,
    private orderService: VstepOrdersService,
    private expThisinhDuthiService: ExpThisinhDuthiService
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
      tiento_sbd: ['', Validators.required],
      url:['']
    })

    this.isAdmin= this.auth.userHasRole('admin');
    this.isTramthi = this.auth.userHasRole('diem-du-thi')
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

    const conditon :ConditionOption = {
      condition:[]
      ,page: '1',
      set:[
        {
          label:'limit',value:'-1'
        }
      ]
    }
    const conditionLang : ConditionOption ={
      condition: [
        {
          conditionName:'status',
          condition:OvicQueryCondition.equal,
          value:'1'
        }
      ],
      page: '1',
      set:[
        {label: 'limit',value: '-1'}
      ]
    }

    forkJoin([
      this.kehoachthiVstepService.getDataByPageNew(conditon),
      this.languagesService.getDataByPageNew(conditionLang),
    ])

      .subscribe({
      next:([{data},langs])=>{
        this.dataKeHoach = data.map(m=>{
          m['_ngonngu'] = langs.data.find(f=>f.id == m.ngonngu) ?langs.data.find(f=>f.id == m.ngonngu).title : '';
          return m;
        });
        this.listLanguage = langs.data
        if (this.dataKeHoach) {
          this.loadData()
        }
        this.notifi.isProcessing(false);
        this.isLoading = false;
      },error:()=>{
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
    const condition : ConditionOption = {
      condition: [],
      page: page.toString(),
      set:[
        { label:'limit',value: this.rows.toString()},
        { label:'order',value: 'DESC'}
      ]
    }
    if(this.search){
      condition.condition.push({
        conditionName:'title',
        condition:OvicQueryCondition.like,
        value:`%${this.search}%`
      })
    }
    if(this._kehoach_id){
      condition.condition.push({
        conditionName:'kehoach_id',
        condition:OvicQueryCondition.equal,
        value:this._kehoach_id.toString()
      })
    }
    this.hoidongThiService.getDataByPageNew(condition).subscribe({
      next: ({data,recordsFiltered}) => {
        this.recordsTotal = recordsFiltered;
        this.listData = data.map((m, index) => {
          m['__indexTable'] = (index + 1) + (this.page - 1) * 10;

          const kehoach = this.dataKeHoach && this.dataKeHoach.find(f => f.id === m.kehoach_id) ? this.dataKeHoach.find(f => f.id === m.kehoach_id) : null;
          m['__kehoach'] = kehoach ;
          m['__kehoach_coverted'] = kehoach ? kehoach.title : '';
          const sIndex = this.statusList.findIndex(i => i.value === m.state);
          m['__status_converted'] = sIndex !== -1 ? this.statusList[sIndex].color : '';
          m['__ngaythi'] = m.ngaythi ? this.helperService.formatSQLToDateDMY(new Date(m.ngaythi)) : "";
          // const thisinhData = m['thisinhData'];
          // m['__total'] = m['totalThisinh'];
          m['__ngonngu'] = kehoach && kehoach.ngonngu ? (this.listLanguage.find(f=>f.id == kehoach.ngonngu) ? this.listLanguage.find(f=>f.id == kehoach.ngonngu).title : ''  ) : '';
          return m;
        })

        this.isLoading = false;
        this.notifi.isProcessing(false);
      },
      error: () => {
        this.isLoading = false;
        this.notifi.isProcessing(false);
        this.notifi.toastError('Mất kết nối với máy chủ')
      }
    })
  }

  // private loadThisinhByHoidong(data: Hoidongthi[] ): Observable<Hoidongthi[] > {
  //   try {
  //     const index: number = data.findIndex(t => !t['_haveThisinh']);
  //     if (index !== -1) {
  //       return this.kehoachthiVstepService.getTotalThisinh(data[index].id).pipe(
  //         switchMap(m => {
  //           // console.log(m);
  //           data[index]['_haveThisinh'] = true;
  //           data[index]['totalThisinh'] = m;
  //           return this.loadThisinhByHoidong(input);
  //         })
  //       );
  //     } else {
  //       return of(input);
  //     }
  //   } catch (e) {
  //     return of(input);
  //   }
  // }

  private __processFrom({data, object, type}: FormHoiDong) {
    this.isLoading = true;
    const observer$: Observable<any> = type === FormType.ADDITION ? this.hoidongThiService.create(data) : this.hoidongThiService.update(object.id, data);
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
            tiento_sbd: '',
            url: '',
          });
        }
        this.notifi.closeSideNavigationMenu();
        this.notifi.toastSuccess('Thao tác thành công', 'Thông báo');
        this.isLoading = false;
        this.getDataHoiDong(1);
      },
      error: () => {
        this.notifi.closeSideNavigationMenu();
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
        ngaythi: '',
        tiento_sbd:'',
        url:'',

      });
    } else if (type === 'update') {
      this.btn_checkAdd = "Cập nhật"
      const object1 = this.listData.find(u => u.id === item.id);
      this.formSave.reset({
        kehoach_id: object1.kehoach_id,
        title: object1.title,
        mota: object1.mota,
        state: object1.state,
        ngaythi: object1.ngaythi ? new Date(object1.ngaythi) : null,
        tiento_sbd:object1.tiento_sbd,
        url:object1.url,
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
      tiento_sbd: this.f['tiento_sbd'].value,
      url: this.f['url'].value,
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

  async btnDelete(item: Hoidongthi) {
    const confirm = await this.notifi.confirmDelete();
    if (confirm) {
      this.hoidongThiService.delete(item.id).pipe(switchMap(m=>{
        return this.hoidongThisinhService.deleteByKey(item.id,'hoidong_id')
      })).subscribe({
        next: () => {
          // this.page = Math.max(1, this.page - (this.listData.length > 1 ? 0 : 1));
          // this.listData.filter(f => f.id !== item.id)
          this.notifi.isProcessing(false);
          this.notifi.toastSuccess('Thao tác thành công');
          this.getDataHoiDong(1);

        }, error: () => {
          this.notifi.isProcessing(false);
          this.notifi.toastError('Thao tác không thành công');
        }
      })
    }
  }

  btnAddThisinh(item: Hoidongthi) {
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

  btnViewPhongthi(item: Hoidongthi){
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
  btnViewBieumau(item: Hoidongthi){
    this.notifi.isProcessing(false);
    this.hoidong_select = {...item};
    this.hoidong_id = item.id;
    this.kehoach_id_param = item.kehoach_id;
    this.notifi.openSideNavigationMenu({
      template: this.dsBieumau,
      size: this.sizeFullWidth,
      offsetTop: '0px'
    });
  }



  paginate({page}: NgPaginateEvent) {
    this.page = page + 1;

    this.getDataHoiDong(this.page);
  }

  async btnLockData(hoidong: HskHoidongthi) {
    const button = await this.notifi.confirmRounded('Thao tác nay sẽ khóa dữ liệu hội đồng thi ', 'XÁC NHẬN KHÓA DỮ LIỆU ', [BUTTON_NO, BUTTON_YES]);
    if (button.name === BUTTON_YES.name) {
      this.notifi.isProcessing(true);
      this.hoidongThiService.update(hoidong.id, {lock: 1}).subscribe({
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

  btnKetquathi(item: Hoidongthi) {
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


  btnExportHoso(item: Hoidongthi){
    this.hoidong_select = {...item};
    this.notifi.loadingAnimationV2({process:{percent: 0}})

    this.loopgetPhongthiThisinh(item.id,[],1,200,1).pipe(
      switchMap(m=>{
        this.notifi.loadingAnimationV2({process:{percent: 50}})

        return forkJoin([
          of(m),

          this.loopGetOrder(item.kehoach_id,[],1,200,1)
        ])
      })
    )

      .subscribe({
      next:([data,orders])=>{
        this.notifi.loadingAnimationV2({process:{percent: 100}})
        const dataMap = [];
        data.forEach((e,index)=>{
          const orderbyMap= orders.find(f=>f.diemduthi_id == e.diemduthi_id && f.thisinh_id == e.thisinh_id);
          const itemmap  = {
            index:index+1,
            hoten: e['thisinh'] ? (e['thisinh']['hoten'] ? e['thisinh']['hoten']: '' ) : e['hoten'],
            gioitinh: e['thisinh'] && e['thisinh']['gioitinh'] ? (e['thisinh']['gioitinh'] == 'nu' ? 'Nu' : 'Nam') : '',
            ngaysinh: e['thisinh']  && e['thisinh']['ngaysinh']  ? e['thisinh']['ngaysinh'] : '',
            noisinh: e['thisinh']  && e['thisinh']['noisinh']  ? e['thisinh']['noisinh'] : '',
            cccd_so: e['thisinh']  && e['thisinh']['cccd_so']  ? e['thisinh']['cccd_so'] : '',
            cccd_ngaycap: e['thisinh']  && e['thisinh']['cccd_ngaycap']  ? e['thisinh']['cccd_ngaycap'] : '',
            cccd_noicap: e['thisinh']  && e['thisinh']['cccd_noicap']  ? e['thisinh']['cccd_noicap'] : '',
            phone: e['thisinh']  && e['thisinh']['phone']  ? e['thisinh']['phone'] : '',
            email: e['thisinh']  && e['thisinh']['email']  ? e['thisinh']['email'] : '',
            thuongtru: e['thisinh']  && e['thisinh']['thuongtru_diachi']  ? e['thisinh']['thuongtru_diachi']['fullAddress'] : '',
            doituong : orderbyMap && orderbyMap.parent_id !== 0 ? 'Đối tác đăng ký ' :( e['thisinh']['doituong'] == 'tudo'? 'Thí sinh Tự do' : 'Sinh viên Thuộc ĐHTN'),
            capthi:e.capthi,
            anh_chandung: e['thisinh'] && e['thisinh']['anh_chandung'] ? this.fileService.getPreviewLinkLocalFileNotToken(e['thisinh']['anh_chandung'][0]) : '',
            doituong_anhthe: e['thisinh'] && e['thisinh']['doituong_anhthe'] ? this.fileService.getPreviewLinkLocalFileNotToken(e['thisinh']['doituong_anhthe'][0]) : '',
            cccd_mattruoc: e['thisinh'] && e['thisinh']['cccd_img_truoc'] ? this.fileService.getPreviewLinkLocalFileNotToken(e['thisinh']['cccd_img_truoc'][0]) : '',
            cccd_matsau: e['thisinh'] && e['thisinh']['cccd_img_sau'] ? this.fileService.getPreviewLinkLocalFileNotToken(e['thisinh']['cccd_img_sau'][0]) : '',
          }

          dataMap.push(itemmap);
        })

        const header = ['STT', 'Họ và tên','Giới tính','Ngày sinh','Nơi sinh','CCCD','Ngày cấp','Nơi cấp','Điện thoại','Email','Địa chủ thường trú','Đối tượng','Cấp thi','Ảnh chân dung','Ảnh thẻ SV','CCCD mặt trước','CCCD mặt sau'];
        this.expThisinhDuthiService.exportHosoLuuTru(dataMap,'HosoLuutruThisinh','Hosoluutru_' + item.title,[header],'Hồ sơ lưu trữ đợt thi ' + item['__kehoach_coverted'] )
        // this.expThisinhDuthiService.export(dataMap,'Hosoluutru_' + item.title,header,'vstep',header,'');
      },error:()=>{
          this.notifi.isProcessing(false);
          this.notifi.toastError('Mất kết nối với máy chủ');
        }
    })
  }

  private loopgetPhongthiThisinh(hoidong_id:number, arr:HoidongPhongthiThisinh[], recordTotal:number, limit:number,page:number):Observable<HoidongPhongthiThisinh[]>{
    if(arr.length < recordTotal){
      const condition: ConditionOption = {
        condition:[
          {
            conditionName:'hoidong_id',
            condition:OvicQueryCondition.equal,
            value:hoidong_id.toString()
          }
        ],
        page:page.toString(),
        set:[
          {label:'limit',value :limit.toString()},
          {label:'with',value :'thisinh'},
        ]
      }
      return this.hoidongPhongthiThisinhService.getDataByPageNew(condition).pipe(switchMap(m=>{
        return this.loopgetPhongthiThisinh(hoidong_id,arr.concat(m.data),m.recordsFiltered,limit,page+1)
      }))
    }else{
      return of(arr)
    }
  }

  private loopGetOrder(kehoach_id:number, arr:OrdersVstep[], recordTotal:number, limit:number,page:number):Observable<OrdersVstep[]>{
    if(arr.length < recordTotal){
      const condition: ConditionOption = {
        condition:[
          {
            conditionName:'kehoach_id',
            condition:OvicQueryCondition.equal,
            value:kehoach_id.toString()
          },
          {
            conditionName:'trangthai_thanhtoan',
            condition:OvicQueryCondition.equal,
            value:'1'
          }
        ],
        page:page.toString(),
        set:[
          {label:'limit',value :limit.toString()},
        ]
      }
      return this.orderService.getDataByPageNew(condition).pipe(switchMap(m=>{
        return this.loopGetOrder(kehoach_id,arr.concat(m.data),m.recordsFiltered,limit,page+1)
      }))
    }else{
      return of(arr)
    }
  }


}
