import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonModule} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {Paginator, PaginatorModule} from "primeng/paginator";
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {RippleModule} from "primeng/ripple";
import {SharedModule} from "@shared/shared.module";
import {DmDiemDuThiService} from "@shared/services/dm-diem-du-thi.service";
import {FormType, NgPaginateEvent, OvicForm, OvicTableStructure} from "@shared/models/ovic-models";
import {debounceTime, filter, Observable, Subject, Subscription} from "rxjs";
import {NotificationService} from "@core/services/notification.service";
import {OvicButton} from "@core/models/buttons";
import {DonViService} from "@shared/services/don-vi.service";
import {AuthService} from "@core/services/auth.service";
import {DonVi} from "@shared/models/danh-muc";
import {ConditionOption} from "@shared/models/condition-option";
import {OvicQueryCondition} from "@core/models/dto";

interface FormDmMon extends OvicForm {
  object: DonVi;
}

@Component({
  selector: 'app-donvi',
  standalone: true,
    imports: [CommonModule, ButtonModule, DropdownModule, InputTextModule, PaginatorModule, ReactiveFormsModule, RippleModule, SharedModule],
  templateUrl: './donvi.component.html',
  styleUrls: ['./donvi.component.css']
})
export class DonviComponent implements OnInit {

  @ViewChild('fromUpdate', {static: true}) template: TemplateRef<any>;
  @ViewChild(Paginator) paginator: Paginator;
  listData: DonVi[];
  statusList = [
    {
      value: 1,
      label: 'Kích hoạt',
      color: '<span class="badge badge--size-normal badge-success w-100">Kích hoạt</span>'
    },
    {
      value: 0,
      label: 'Đóng kích hoạt',
      color: '<span class="badge badge--size-normal badge-danger w-100">Đóng kích hoạt</span>'
    }
  ];
  tblStructure: OvicTableStructure[] = [
    {
      fieldType: 'normal',
      field: ['__title_converted'],
      innerData: true,
      header: 'Điểm dự thi',
      sortable: false
    },
    {
      fieldType: 'normal',
      field: ['code'],
      innerData: true,
      header: 'Ký hiệu',
      sortable: false
    },
    {
      fieldType: 'normal',
      field: ['phone'],
      innerData: true,
      header: 'Số điện thoại',
      sortable: false
    },
    {
      fieldType: 'normal',
      field: ['email'],
      innerData: true,
      header: 'Email',
      sortable: false
    },

    {
      fieldType: 'normal',
      field: ['__status'],
      innerData: true,
      header: 'Trạng thái',
      sortable: false,
      headClass: 'ovic-w-110px text-center',
      rowClass: 'ovic-w-110px text-center'
    },
    {
      tooltip: '',
      fieldType: 'buttons',
      field: [],
      rowClass: 'ovic-w-110px text-center',
      checker: 'fieldName',
      header: 'Thao tác',
      sortable: false,
      headClass: 'ovic-w-120px text-center',
      buttons: [
        {
          tooltip: 'Sửa',
          label: '',
          icon: 'pi pi-file-edit',
          name: 'EDIT_DECISION',
          cssClass: 'btn-primary rounded'
        },
        {
          tooltip: 'Xoá',
          label: '',
          icon: 'pi pi-trash',
          name: 'DELETE_DECISION',
          cssClass: 'btn-danger rounded'
        }
      ]
    }
  ];

  headButtons = [
    {
      label: 'Thêm mới',
      name: 'BUTTON_ADD_NEW',
      icon: 'pi-plus pi',
      class: 'p-button-rounded p-button-success ml-3 mr-2'
    },
  ];
  listForm = {
    [FormType.ADDITION]: {type: FormType.ADDITION, title: 'Thêm mới điểm dự thi', object: null, data: null},
    [FormType.UPDATE]: {type: FormType.UPDATE, title: 'Cập nhật điểm dự thi', object: null, data: null}
  };


  private OBSERVE_PROCESS_FORM_DATA = new Subject<FormDmMon>();
  formActive    : FormDmMon;
  formSave      : FormGroup;
  rows          : number = 20;
  loadInitFail  : boolean = false;
  subscription  : Subscription = new Subscription();
  sizeFullWidth : number = 1024;
  isLoading     : boolean = true;
  needUpdate    : boolean = false;
  limit :number =20;

  menuName= 'dm_diemduthi';

  page = 1;
  btn_checkAdd: 'Lưu lại' | 'Cập nhật';
  recordsTotal = 0;

  index = 1;
  search='';

  constructor(

    private notificationService: NotificationService,
    private fb: FormBuilder,
    private donViService:DonViService,
    private auth:AuthService,
  ) {

    this.formSave = this.fb.group({
      title: ['', Validators.required],
      status:[1,Validators.required],
      code: ['', [Validators.required, Validators.maxLength(5)] ],
      description: [''],
      phone: [''],
      email: [''],
      parent_id: [this.auth.user.donvi_id, Validators.required],
    });

    const observeProcessFormData = this.OBSERVE_PROCESS_FORM_DATA.asObservable().pipe(debounceTime(100)).subscribe(form => this.__processFrom(form));
    this.subscription.add(observeProcessFormData);
    const observeProcessCloseForm = this.notificationService.onSideNavigationMenuClosed().pipe(filter(menuName => menuName === this.menuName && this.needUpdate)).subscribe(() => this.loadData(this.page));
    this.subscription.add(observeProcessCloseForm);
    const observerOnResize = this.notificationService.observeScreenSize.subscribe(size => this.sizeFullWidth = size.width)
    this.subscription.add(observerOnResize);

  }

  ngOnInit(): void {
    this.loadInit()
  }

  loadInit() {
    this.isLoading = true;
    this.loadData(1);
  }

  loadData(page:number, search?:string) {
    const limit =this.limit;
    this.index = (page * limit) - limit + 1;
    let newsearch:string = search? search : this.search;

    const condition: ConditionOption ={
      condition:[
        {
          conditionName:'parent_id',
          condition:OvicQueryCondition.equal,
          value:this.auth.user.donvi_id.toString()
        }
      ],page:page.toString(),
      set:[
        {label:'limit',value:this.limit.toString()},
        {
          label:'orderby',value:'id'
        }
      ]
    }

    this.donViService.getDataByPageNew(condition).subscribe({
      next: ({data, recordsFiltered}) => {
        this.recordsTotal = recordsFiltered;
        this.listData = data.map(m => {
          const sIndex = this.statusList.findIndex(i => i.value === m.status);
          m['__title_converted'] = `<b>${m.title}</b><br>`;
          m['__status'] = sIndex !== -1 ? this.statusList[sIndex].color : '';
          // m['__gia_conventd'] = this.formatNumber(m.gia) + (m.gia ? ' VNĐ' :'');
          return m;
        })
        this.isLoading = false;
      }, error: () => {
        this.isLoading = false;
        this.notificationService.toastError('Mất kết nối với máy chủ');
      }
    })
  }

  private __processFrom({data, object, type}: FormDmMon) {
    const observer$: Observable<any> = type === FormType.ADDITION ? this.donViService.createDonVi(data) : this.donViService.updateDonVi(object.id, data);
    observer$.subscribe({
      next: () => {
        this.needUpdate = true;
        this.loadData(1, this.search);
        this.notificationService.toastSuccess('Thao tác thành công', 'Thông báo');
        this.notificationService.closeSideNavigationMenu();
      },
      error: () => this.notificationService.toastError('Thao tác thất bại', 'Thông báo')
    });
  }

  paginate({page}: NgPaginateEvent) {
    this.page = page + 1;
    this.loadData(this.page);
  }

  onSearch(text: string) {
    this.search = text;
    this.paginator.changePage(1);
    this.loadData(1, text);
  }

  private preSetupForm(name: string) {
    this.notificationService.isProcessing(false);
    this.notificationService.openSideNavigationMenu({
      name,
      template: this.template,
      size: 600,
      offsetTop: '0px'
    });
  }

  closeForm() {
    this.loadInit();
    this.notificationService.closeSideNavigationMenu(this.menuName);
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
          title: '',
          code: '',
          description: '',
          phone: '',
          email: '',
          parent_id: this.auth.user.donvi_id,
          status:1
        });
        this.formActive = this.listForm[FormType.ADDITION];
        this.preSetupForm(this.menuName);
        break;
      case 'EDIT_DECISION':
        this.btn_checkAdd = "Cập nhật";

        const object1 = this.listData.find(u => u.id === decision.id);
        this.formSave.reset({
          title: object1.title,
          code: object1.code,
          description: object1.description,
          phone: object1.phone,
          email: object1.email,
          parent_id: object1.parent_id,
          status:object1.status

        })
        this.formActive = this.listForm[FormType.UPDATE];
        this.formActive.object = object1;
        this.preSetupForm(this.menuName);
        break;
      case 'DELETE_DECISION':
        const confirm = await this.notificationService.confirmDelete();
        if (confirm) {
          this.donViService.deleteDonVi(decision.id).subscribe({
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
    const titleInput = this.f['title'].value.trim();
    this.f['title'].setValue(titleInput);
    console.log(this.formSave.value)
    if (this.formSave.valid) {
      if (titleInput !== '') {
        this.formActive.data = this.formSave.value;
        this.OBSERVE_PROCESS_FORM_DATA.next(this.formActive);
      } else {
        this.notificationService.toastError('Vui lòng không nhập khoảng trống');
      }
    } else {
      this.formSave.markAllAsTouched();
      this.notificationService.toastError('Vui lòng nhập đủ thông tin');
    }
  }


}
