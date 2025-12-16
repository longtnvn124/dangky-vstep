import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Paginator} from "primeng/paginator";
import { DmTruongHoc} from "@shared/models/danh-muc";
import {FormType, NgPaginateEvent, OvicForm, OvicTableStructure} from "@shared/models/ovic-models";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {debounceTime, filter, forkJoin, Observable, of, Subject, Subscription, switchMap} from "rxjs";
import {ThemeSettingsService} from "@core/services/theme-settings.service";
import {NotificationService} from "@core/services/notification.service";
import {OvicButton} from "@core/models/buttons";
import {DanhMucTruongHocService} from "@shared/services/danh-muc-truong-hoc.service";
import {LocationService} from "@shared/services/location.service";
import {DiaDanh} from "@shared/models/location";
import {DEPARTMENT_OF_EDUCATION, SCHOOL_BY_DEPARTMENT} from "@shared/utils/syscat";

interface FormDmTruonghoc extends OvicForm {
  object: DmTruongHoc;
}

@Component({
  selector: 'app-truong-hoc',
  templateUrl: './truong-hoc.component.html',
  styleUrls: ['./truong-hoc.component.css']
})
export class TruongHocComponent implements OnInit {

  @ViewChild('fromUpdate', {static: true}) template: TemplateRef<any>;
  @ViewChild('formMembers', {static: true}) formMembers: TemplateRef<any>;
  @ViewChild(Paginator) paginator: Paginator;
  listData: DmTruongHoc[];
  sogiaoduc: DmTruongHoc[];
  statusList = [
    {
      value: 1,
      label: 'Đã kích hoạt',
      color: '<span class="badge badge--size-normal badge-success w-100">Đã kích hoạt</span>'
    },
    {
      value: 0,
      label: 'Chưa kích hoạt',
      color: '<span class="badge badge--size-normal badge-danger w-100">Chưa kích hoạt</span>'
    }
  ];

  listForm = {
    [FormType.ADDITION]: {type: FormType.ADDITION, title: 'Thêm mới trường học', object: null, data: null},
    [FormType.UPDATE]: {type: FormType.UPDATE, title: 'Cập nhật trường học', object: null, data: null}
  };
  formActive: FormDmTruonghoc;
  formSave: FormGroup;

  private OBSERVE_PROCESS_FORM_DATA = new Subject<FormDmTruonghoc>();

  rows = this.themeSettingsService.settings.rows;
  loadInitFail = false;
  subscription = new Subscription();
  sizeFullWidth = 1024;
  isLoading = true;
  needUpdate = false;

  menuName: 'dm_chuyenmuc';

  page = 1;
  btn_checkAdd: 'Lưu lại' | 'Cập nhật';
  recordsTotal = 0;

  index = 1;
  search = '';

  provinces: DiaDanh[]
  private inputChanged: Subject<string> = new Subject<string>();

  sogiaoduc_select:number[]= [];
  constructor(
    private themeSettingsService: ThemeSettingsService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private locationService: LocationService,
    private danhMucTruongHocService: DanhMucTruongHocService
  ) {
    this.formSave = this.fb.group({
      ten: ['', Validators.required],
      parent_id: [0],
      province: [null, Validators.required],
      address: [''],
      status: [1, Validators.required],
    });

    const observeProcessFormData = this.OBSERVE_PROCESS_FORM_DATA.asObservable().pipe(debounceTime(100)).subscribe(form => this.__processFrom(form));
    this.subscription.add(observeProcessFormData);
    const observeProcessCloseForm = this.notificationService.onSideNavigationMenuClosed().pipe(filter(menuName => menuName === this.menuName && this.needUpdate)).subscribe(() => this.loadData(this.page));
    this.subscription.add(observeProcessCloseForm);
    const observerOnResize = this.notificationService.observeScreenSize.subscribe(size => this.sizeFullWidth = size.width)
    this.subscription.add(observerOnResize);

  }

  ngOnInit(): void {
    this.inputChanged.pipe(debounceTime(1000)).subscribe((item: string) => {
      this.searchContentByInput(item);
    });

    this.notificationService.isProcessing(true);
    this.locationService.listProvinces().subscribe({
      next: (data) => {
        this.provinces = data;
        if (data) {
          this.loadInit();
        }
        this.notificationService.isProcessing(false);

      }, error: () => {
        this.notificationService.isProcessing(false);
      }
    })

  }


  loadInit() {
    this.isLoading = true;
    this.loadData(1);
  }

  loadData(page: number, ) {
    const limit = this.themeSettingsService.settings.rows;
    this.index = (page * limit) - limit + 1;

    forkJoin<[DmTruongHoc[], { recordsTotal: number; data: DmTruongHoc[] }]>(
      this.danhMucTruongHocService.getSogiaoduc(),
      this.danhMucTruongHocService.getDataBySearchAndids(page,this.search, this.sogiaoduc_select)
    )
      .subscribe({
        next: ([sogiaoduc, {data, recordsTotal}]) => {
          this.sogiaoduc = sogiaoduc
          this.recordsTotal = recordsTotal;
          this.listData = data.map((m,index) => {
            const sIndex = this.statusList.findIndex(i => i.value === m.status);
            m['__index_table'] = (page - 1 )*10 + index + 1;
            m['__status'] = sIndex !== -1 ? this.statusList[sIndex].color : '';
            m['__ten_converted'] = `<b>${m.ten}</b><br>` + (m.address ? m.address : '');
            m['__sogiaoduc_converted'] = sogiaoduc.find(f=>f.id === m.parent_id) ? sogiaoduc.find(f=>f.id === m.parent_id).ten :'' ;
            return m;
          })
          this.isLoading = false;
        }, error: () => {
          this.isLoading = false;
          this.notificationService.toastError('Mất kết nối với máy chủ');
        }
      })
  }

  private __processFrom({data, object, type}: FormDmTruonghoc) {
    this.notificationService.isProcessing(true);

    const observer$: Observable<any> = type === FormType.ADDITION ? this.danhMucTruongHocService.create(data) : this.danhMucTruongHocService.update(object.id, data);
    observer$.subscribe({
      next: () => {
        this.needUpdate = true;
        this.loadData(1);
        this.notificationService.toastSuccess('Thao tác thành công', 'Thông báo');
        this.notificationService.isProcessing(false);
      },
      error: () => {
        this.notificationService.toastError('Thao tác thất bại', 'Thông báo');
        this.notificationService.isProcessing(false);

      }
    });
  }

  paginate({page}: NgPaginateEvent) {
    this.page = page + 1;
    this.loadData(this.page);
  }


  private preSetupForm(name: string) {
    if (this.provinces) {
      this.notificationService.isProcessing(false);
      this.notificationService.openSideNavigationMenu({
        name,
        template: this.template,
        size: 600,
        offsetTop: '0px'
      });
    }
  }

  closeForm() {
    this.loadInit();
    this.notificationService.closeSideNavigationMenu(this.menuName);
  }
  btnAdd(){
    this.btn_checkAdd = "Lưu lại";
    this.formSave.reset({
      ten: '',
      province: '',
      parent_id: 0,
      address: '',
      status: null,

    });
    this.formActive = this.listForm[FormType.ADDITION];
    this.preSetupForm(this.menuName);
  }
  btnUpdate(item: DmTruongHoc){
    this.btn_checkAdd = "Cập nhật";
    this.formSave.reset({
      ten: item.ten,
      parent_id: item.parent_id,
      address: item.address,
      status: item.status,
      province: item.province
    })
    this.formActive = this.listForm[FormType.UPDATE];
    this.formActive.object = item;
    this.preSetupForm(this.menuName);
  }
  async btnDelete(item:DmTruongHoc){
    const confirm = await this.notificationService.confirmDelete();
    if (confirm) {
      this.danhMucTruongHocService.delete(item.id).subscribe({
        next: () => {
          this.page = Math.max(1, this.page - (this.listData.length > 1 ? 0 : 1));
          this.notificationService.isProcessing(false);
          this.notificationService.toastSuccess('Thao tác thành công');
          this.loadData(this.page);

        }, error: () => {
          this.notificationService.isProcessing(false);
          this.notificationService.toastError('Thao tác không thành công');
        }
      })
    }
  }
  async handleClickOnTable(button: OvicButton) {
    if (!button) {
      return;
    }
    const decision = button.data && this.listData ? this.listData.find(u => u.id === button.data) : null;
    switch (button.name) {
      case 'BUTTON_ADD_NEW':
        this.btn_checkAdd = "Lưu lại";
        this.formSave.reset({
          ten: '',
          province: '',
          parent_id: 0,
          address: '',
          status: null,

        });
        this.formActive = this.listForm[FormType.ADDITION];
        this.preSetupForm(this.menuName);
        break;
      case 'EDIT_DECISION':
        this.btn_checkAdd = "Cập nhật";

        const object1 = this.listData.find(u => u.id === decision.id);
        this.formSave.reset({
          ten: object1.ten,
          parent_id: object1.parent_id,
          address: object1.address,
          status: object1.status,
          province: object1.province
        })
        this.formActive = this.listForm[FormType.UPDATE];
        this.formActive.object = object1;
        this.preSetupForm(this.menuName);
        break;
      case 'DELETE_DECISION':
        const confirm = await this.notificationService.confirmDelete();
        if (confirm) {
          this.danhMucTruongHocService.delete(decision.id).subscribe({
            next: () => {
              this.page = Math.max(1, this.page - (this.listData.length > 1 ? 0 : 1));
              this.notificationService.isProcessing(false);
              this.notificationService.toastSuccess('Thao tác thành công');
              this.loadData(this.page);

            }, error: () => {
              this.notificationService.isProcessing(false);
              this.notificationService.toastError('Thao tác không thành công');
            }
          })
        }
        break;
      default:
        break;
    }
  }

  get f(): { [key: string]: AbstractControl<any> } {
    return this.formSave.controls;
  }

  saveForm() {
    if (this.formSave.valid) {
      this.formActive.data = {
        ten: this.formSave.value.ten.trim(),
        status: this.formSave.value.status,
        parent_id: this.formSave.value.parent_id === 0 || this.formSave.value.parent_id === null ? 0 : this.formSave.value.parent_id,
        province: this.formSave.value.province,
        address: this.formSave.value.address
      };
      this.OBSERVE_PROCESS_FORM_DATA.next(this.formActive);

    } else {
      this.formSave.markAllAsTouched();
      this.notificationService.toastError('Vui lòng nhập đủ thông tin');
    }
  }

  // cap1 = DEPARTMENT_OF_EDUCATION;
  // cap2 = SCHOOL_BY_DEPARTMENT;

  // btnAddTool() {
  //
  //   const step: number = 100 / this.cap1.length;
  //   this.notificationService.loadingAnimationV2({process: {percent: 0}});
  //   this.createParrent(this.cap1, step, 0).subscribe({
  //     next: (mess) => {
  //       this.notificationService.toastSuccess('Gửi Email thông báo lịch thi thành công');
  //       this.notificationService.isProcessing(false);
  //     }, error: () => {
  //       this.notificationService.toastError('Gửi Email thông báo lịch thi không thành công');
  //       this.notificationService.isProcessing(false);
  //       this.notificationService.disableLoadingAnimationV2();
  //     }
  //   })
  // }

  // private createParrent(list, step: number, percent: number) {
  //   const index: number = list.findIndex(i => !i['created']);
  //   if (index !== -1) {
  //     const item = list[index];
  //     const datacreated = {ten: item['label'], status: 1, parent_id: 0}
  //     return this.danhMucTruongHocService.create(datacreated).pipe(switchMap(prj => {
  //       list[index]['created'] = true;
  //       const newPercent: number = percent + step;
  //       this.notificationService.loadingAnimationV2({process: {percent: newPercent}});
  //       // return this.upDatePhongthi(list, step, newPercent);
  //       const dataChild = this.cap2.filter(f => f.department_edu === list[index]['label'])
  //       return this.createdChild(dataChild, prj).pipe(switchMap(() => {
  //         return this.createParrent(list, step, newPercent);
  //       }));
  //     }))
  //   } else {
  //     this.notificationService.disableLoadingAnimationV2();
  //     return of('complete');
  //   }
  // }


  private createdChild(list, parent_id: number) {

    const index: number = list.findIndex(i => !i['created']);
    const data_item = list[index]
    if (index !== -1) {
      const dataChildUpload = {
        ten: data_item['school_name'],
        status: 1,
        parent_id: parent_id,
        address: data_item['school_address'],
        province: 'Tỉnh ' + data_item['province'],

      }
      return this.danhMucTruongHocService.create(dataChildUpload).pipe(switchMap(() => {
        list[index]['created'] = true;
        return this.createdChild(list, parent_id);
      }))
    } else {
      return of('complete');
    }

  }


  searchContentByInput(text: string) {
    this.page = 1;

    this.search= text.trim()

    this.loadData(this.page );
  }

  onInputChange(event: string) {

    this.inputChanged.next(event);
  }
  multiChange(event){
    this.page=1;
    this.loadData(this.page);
  }
}
