import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormType, NgPaginateEvent, OvicForm, OvicTableStructure} from "@shared/models/ovic-models";
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Paginator, PaginatorModule} from "primeng/paginator";
import {debounceTime, filter, Observable, Subject, Subscription} from "rxjs";
import {NotificationService} from "@core/services/notification.service";
import {BUTTON_NO, BUTTON_YES, OvicButton} from "@core/models/buttons";

import {KeHoachThi, KehoachthiVstepService} from "@shared/services/kehoachthi-vstep.service";
import {SharedModule} from "@shared/shared.module";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {SplitterModule} from "primeng/splitter";
import {CalendarModule} from "primeng/calendar";
import {
  KehoachthiDiemthiComponent
} from "@modules/admin/features/ke-hoach-thi/kehoachthi-diemthi/kehoachthi-diemthi.component";
import {NgIf} from "@angular/common";
import {
  DanhSachThiSinhComponent
} from "@modules/admin/features/ke-hoach-thi/danh-sach-thi-sinh/danh-sach-thi-sinh.component";
import {AuthService} from "@core/services/auth.service";
import {KehoachthiDiemthiVstepService} from "@shared/services/kehoachthi-diemthi-vstep.service";
import {ConditionOption} from "@shared/models/condition-option";
import {OvicQueryCondition} from "@core/models/dto";
import {DialogModule} from "primeng/dialog";
import {InputTextModule} from "primeng/inputtext";
import {
  KehoachthiDiemthiV2Component
} from "@modules/admin/features/ke-hoach-thi/kehoachthi-diemthi-v2/kehoachthi-diemthi-v2.component";

interface FormKehoachthi extends OvicForm {
  object: KeHoachThi;
}


@Component({
  selector: 'app-ke-hoach-thi',
  templateUrl: './ke-hoach-thi.component.html',
  styleUrls: ['./ke-hoach-thi.component.css'],
  imports: [
    SharedModule,
    ButtonModule,
    RippleModule,
    PaginatorModule,
    ReactiveFormsModule,
    SplitterModule,
    CalendarModule,
    KehoachthiDiemthiComponent,
    NgIf,
    DanhSachThiSinhComponent,
    DialogModule,
    InputTextModule,
    KehoachthiDiemthiV2Component
  ],
  standalone: true
})
export class KeHoachThiComponent implements OnInit {
  @ViewChild('fromUpdate', {static: true}) template: TemplateRef<any>;
  @ViewChild('formMembers', {static: true}) formMembers: TemplateRef<any>;
  @ViewChild('formDiemthi', {static: true}) formDiemthi: TemplateRef<any>;
  @ViewChild(Paginator) paginator: Paginator;
  listData: KeHoachThi[];
  statusList = [
    {
      value: 1,
      label: 'Active',
      color: '<span class="badge badge--size-normal badge-success w-100">Active</span>'
    },
    {
      value: 0,
      label: 'Inactive',
      color: '<span class="badge badge--size-normal badge-danger w-100">Inactive</span>'
    }
  ];

  tblStructure: OvicTableStructure[] = [
    {
      fieldType: 'normal',
      field: ['__ten_converted'],
      innerData: true,
      header: 'Tên',
      sortable: false
    },
    // {
    //   fieldType: 'normal',
    //   field: ['soluong_toida'],
    //   innerData: true,
    //   header: 'Số lượng đăng ký tối đa/ mỗi môn thi',
    //   sortable: false,
    //   rowClass: 'ovic-w-200px text-center',
    //   headClass: 'ovic-w-200px text-center',
    // },
    {
      fieldType: 'normal',
      field: ['ngaythi'],
      innerData: true,
      header: 'Ngày thi',
      sortable: false,
      rowClass: 'ovic-w-200px text-center',
      headClass: 'ovic-w-200px text-center',
    },
    {
      fieldType: 'normal',
      field: ['__time_coverted'],
      innerData: true,
      header: 'Thời hạn đăng ký',
      sortable: false,
      rowClass: 'ovic-w-200px text-center',
      headClass: 'ovic-w-200px text-center',
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

  ];

  headButtons = [

  ];
  listForm = {
    [FormType.ADDITION]: {type: FormType.ADDITION, title: 'Thêm mới đợt thi', object: null, data: null},
    [FormType.UPDATE]: {type: FormType.UPDATE, title: 'Cập nhật đợt thi', object: null, data: null}
  };
  formActive: FormKehoachthi;
  formSave: FormGroup;

  private OBSERVE_PROCESS_FORM_DATA = new Subject<FormKehoachthi>();

  rows:number = 20;
  limit:number = 20;
  loadInitFail:boolean = false;
  subscription:Subscription = new Subscription();
  sizeFullWidth :number= 1024;
  isLoading:boolean = true;
  needUpdate:boolean = false;

  menuName:string = 'ke-hoach-thi';
  kehoach_select:KeHoachThi;
  page = 1;
  btn_checkAdd: 'Lưu lại' | 'Cập nhật';
  recordsTotal = 0;

  index = 1;
  search = '';

  constructor(

    private notifi: NotificationService,
    private fb: FormBuilder,
    private kehoachthiVstepService: KehoachthiVstepService,
    private auth: AuthService,
    private kehoachthiDiemthiVstepService: KehoachthiDiemthiVstepService,
  ) {
    const roleAdmin =  this.auth.roles.map(m=>m.name).includes('admin')

    if(roleAdmin){
      this.tblStructure.push({
        tooltip: '',
        fieldType: 'buttons',
        field: [],
        rowClass: 'ovic-w-110px text-center',
        checker: 'fieldName',
        header: 'Thao tác',
        sortable: false,
        headClass: 'ovic-w-180px text-center',
        buttons: [
          {
            tooltip: 'Cập nhật số lượng dự thi theo điểm thi',
            label: '',
            icon: 'pi pi-book',
            name: 'DIEMTHI_DECISION',
            cssClass: 'btn-warning rounded'
          },
          {
            tooltip: 'danh sách dự thi',
            label: '',
            icon: 'pi pi-users',
            name: 'MEMBER_DECISION',
            cssClass: 'btn-success rounded'
          },
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
      });
      this.headButtons.push( {
        label: 'Thêm mới ',
        name: 'BUTTON_ADD_NEW',
        icon: 'pi-plus pi',
        class: 'p-button-rounded p-button-success ml-3 mr-2'
      },);

    }else{
      this.tblStructure.push({
        tooltip: '',
        fieldType: 'buttons',
        field: [],
        rowClass: 'ovic-w-110px text-center',
        checker: 'fieldName',
        header: 'Thao tác',
        sortable: false,
        headClass: 'ovic-w-180px text-center',
        buttons: [
          {
            tooltip: 'Cập nhật số lượng dự thi',
            label: '',
            icon: 'pi pi-cog',
            name: 'DIEMTHI_SETTING_DECISION',
            cssClass: 'btn-warning rounded'
          },
        ]
      })
    }
    const observeProcessFormData = this.OBSERVE_PROCESS_FORM_DATA.asObservable().pipe(debounceTime(100)).subscribe(form => this.__processFrom(form));
    this.subscription.add(observeProcessFormData);
    const observeProcessCloseForm = this.notifi.onSideNavigationMenuClosed().pipe(filter(menuName => menuName === this.menuName && this.needUpdate)).subscribe(() => this.loadData(this.page));
    this.subscription.add(observeProcessCloseForm);
    const observerOnResize = this.notifi.observeScreenSize.subscribe(size => this.sizeFullWidth = size.width)
    this.subscription.add(observerOnResize);

    this.formSave = this.fb.group({
      nam: [null, Validators.required],
      title: ['', Validators.required],
      // soluong_toida:[0, Validators.required],
      ngaybatdau:['',Validators.required],
      ngayketthuc:['',Validators.required],
      mota:[''],
      ngaythi:['',Validators.required],
      status: 1,
      gia:[null,Validators.required] ,

    });
  }

  ngOnInit(): void {
    this.loadInit()
  }

  loadInit() {
    this.isLoading = true;
    this.loadData(1);
  }

  loadData(page: number, search?: string) {
    const limit = this.limit;
    this.index = (page * limit) - limit + 1;
    let newsearch: string = search ? search : this.search;
    this.kehoachthiVstepService.search(page, newsearch,this.limit).subscribe({
      next: ({data, recordsTotal}) => {
        this.recordsTotal = recordsTotal;
        this.listData = data.map(m => {
          m['__ten_converted'] = `<b>${m.title}</b><br>`;
          // m['__value_converted'] = m.value + ' VNĐ';
          const sIndex = this.statusList.findIndex(i => i.value === m.status);
          m['__status'] = sIndex !== -1 ? this.statusList[sIndex].color : '';
          m['__time_coverted'] =  this.strToTime(m.ngaybatdau) + ' - ' + this.strToTime(m.ngayketthuc);
          return m;
        })
        this.isLoading = false;
      }, error: () => {
        this.isLoading = false;
        this.notifi.toastError('Mất kết nối với máy chủ');
      }
    })
  }

  private __processFrom({data, object, type}: FormKehoachthi) {
    const observer$: Observable<any> = type === FormType.ADDITION ? this.kehoachthiVstepService.create(data) : this.kehoachthiVstepService.update(object.id, data);
    observer$.subscribe({
      next: () => {
        this.notifi.closeSideNavigationMenu();
        this.needUpdate = true;
        this.loadData(1, this.search);
        this.notifi.toastSuccess('Thao tác thành công', 'Thông báo');
      },
      error: () => this.notifi.toastError('Thao tác thất bại', 'Thông báo')
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
    this.notifi.isProcessing(false);
    this.notifi.openSideNavigationMenu({
      name,
      template: this.template,
      size: this.sizeFullWidth,
      offsetTop: '0px'
    });
  }

  closeForm() {
    this.loadInit();
    this.notifi.closeSideNavigationMenu(this.menuName);
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
          nam: null,
          title: '',
          mota:'',
          status: 1,
          ngaybatdau: '',
          ngayketthuc: '',
          ngaythi:'',
          gia:null

        });
        this.formActive = this.listForm[FormType.ADDITION];
        this.preSetupForm(this.menuName);
        break;
      case 'EDIT_DECISION':
        this.btn_checkAdd = "Cập nhật";
        const object1 = this.listData.find(u => u.id === decision.id);

        this.formActive = this.listForm[FormType.UPDATE];
        this.formActive.object = object1;
        this.preSetupForm(this.menuName);
        this.formSave.reset({
          nam:object1.nam,
          title:object1.title,
          mota:object1.mota,
          status:object1.status,
          ngaythi:object1.ngaythi,
          gia:object1.gia,
          ngaybatdau: object1.ngaybatdau ? new Date(object1.ngaybatdau) : null,
          ngayketthuc:object1.ngayketthuc ? new Date(object1.ngayketthuc) : null,
        })


        break;
      case 'DELETE_DECISION':
        const confirm = await this.notifi.confirmDelete();
        if (confirm) {
          this.kehoachthiVstepService.delete(decision.id).subscribe({
            next: () => {
              this.page = Math.max(1, this.page - (this.listData.length > 1 ? 0 : 1));
              this.notifi.isProcessing(false);
              this.notifi.toastSuccess('Thao tác thành công');
              this.loadData(this.page);

            }, error: () => {
              this.notifi.isProcessing(false);
              this.notifi.toastError('Thao tác không thành công');
            }
          })
        }
        break;
      case 'MEMBER_DECISION':
        const object2 = this.listData.find(u => u.id === decision.id);
        this.kehoach_select = {...object2};

        this.notifi.openSideNavigationMenu({
          name:this.menuName,
          template: this.formMembers,
          size: this.sizeFullWidth,
          offsetTop: '0px'
        });

        break;
      case 'DIEMTHI_DECISION':
        const object3 = this.listData.find(u => u.id === decision.id);
        this.kehoach_select = {...object3};

        this.notifi.openSideNavigationMenu({
          name:this.menuName,
          template: this.formDiemthi,
          size: this.sizeFullWidth,
          offsetTop: '0px'
        });
        break;
      case 'DIEMTHI_SETTING_DECISION':
        this.kehoach_select = {...this.listData.find(u => u.id === decision.id)};

        this.soLuongDiemduthiTheoTram(this.listData.find(u => u.id === decision.id))

        break;
      default:
        break;
    }
  }


  soluongDkByDiemduthi  : number = null;
  typeDkByDiemduthi     : boolean = false;
  displayModal          : boolean = false;
  soLuongDiemduthiTheoTram(object : KeHoachThi){
    console.log(object);

    this.notifi.isProcessing(true);
    const condition:ConditionOption = {
      condition:[
        {
          conditionName:'diemduthi_id',
          condition:OvicQueryCondition.equal,
          value:this.auth.user.donvi_id.toString(),
        },
        {
          conditionName:'kehoach_id',
          condition:OvicQueryCondition.equal,
          value:object.id.toString(),
        },

      ],page:'1',
       set:[
         {label:'limit',value:'1'},

       ]
    };

    this.kehoachthiDiemthiVstepService.getDataByPageNew(condition).subscribe({
      next:({data})=>{
        this.notifi.isProcessing(false);
        this.soluongDkByDiemduthi = data.length>0 ? data[0].soluong : null;
        this.typeDkByDiemduthi = data.length > 0 ? true : false;

        this.displayModal = true;

      },error:()=>{
        this.notifi.isProcessing(false);
        this.notifi.toastError('Load dữ liệu không thành công');
      }
    })
  }

  get f(): { [key: string]: AbstractControl<any> } {
    return this.formSave.controls;
  }

  saveForm() {
    const titleInput = this.f['title'].value.trim();
    this.f['title'].setValue(titleInput);
    if (this.formSave.valid) {
      if (titleInput !== '') {
          this.formSave.value['ngaybatdau'] = this.formatSQLDateTime(new Date(this.formSave.value['ngaybatdau']));
          this.formSave.value['ngayketthuc'] = this.formatSQLDateTime(new Date(this.formSave.value['ngayketthuc']));
          this.formActive.data = this.formSave.value;
          this.OBSERVE_PROCESS_FORM_DATA.next(this.formActive);
      } else {
        this.notifi.toastError('Vui lòng không nhập khoảng trống');
      }
    } else {
      this.formSave.markAllAsTouched();
      this.notifi.toastError('Vui lòng nhập đủ thông tin');
    }
  }

  formatSQLDateTime(date: Date): string {
    const y = date.getFullYear().toString();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    // const h = date.getHours().toString().padStart(2, '0');
    // const min = date.getMinutes().toString().padStart(2, '0');
    // const sec = '00';
    return `${y}-${m}-${d}`;
  }

  strToTime(input: string): string {
    const date = input ? new Date(input) : null;
    let result = '';
    if (date) {
      result += [date.getDate().toString().padStart(2, '0'), (date.getMonth() + 1).toString().padStart(2, '0'), date.getFullYear().toString()].join('/');
    }
    return result;
  }


  async btnAcceptDiemduthi(){
    if(this.soluongDkByDiemduthi && this.soluongDkByDiemduthi > 0 ){
      const btn = await this.notifi.confirmRounded('','Xác nhận',[BUTTON_YES,BUTTON_NO]);

      if(btn.name == 'yes'){
        const item = {
          kehoach_id:this.kehoach_select.id,
          soluong : this.soluongDkByDiemduthi,
          diemduthi_id:this.auth.user.donvi_id,
        }
        this.kehoachthiDiemthiVstepService.create(item).subscribe({
          next:()=>{
            this.displayModal=false;
            this.notifi.toastSuccess('Thao tác thành công');
            this.notifi.isProcessing(false);
          },error:()=>{
            this.notifi.isProcessing(false);
            this.notifi.toastError('Mất kết nối với máy chủ');
          }
        })
      }

    }else{
      this.notifi.toastError('Vui lòng cài đặt số lượng thí sinh được phép dự thi');
    }
  }
}
