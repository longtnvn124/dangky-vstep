import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Paginator, PaginatorModule} from "primeng/paginator";
import {ThiSinhInfo} from "@shared/models/thi-sinh";
import {AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {debounceTime, Subject, Subscription} from "rxjs";
import {TableModule} from "primeng/table";
import {InputSwitchModule} from "primeng/inputswitch";
import {TooltipModule} from "primeng/tooltip";
import {MatMenuModule} from "@angular/material/menu";
import {InputTextModule} from "primeng/inputtext";
import {InputMaskModule} from "primeng/inputmask";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {SharedModule} from "@shared/shared.module";
import {CheckboxModule} from "primeng/checkbox";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {DiaDanh} from "@shared/models/location";
import {DanToc} from "@shared/utils/syscat";
import {NotificationService} from "@core/services/notification.service";
import {ThisinhInfoService} from "@shared/services/thisinh-info.service";
import {LocationService} from "@shared/services/location.service";
import {DDMMYYYYDateFormatValidator, PhoneNumberValidator} from "@core/utils/validators";
import {NgPaginateEvent} from "@shared/models/ovic-models";
import {OvicInputAddressNewComponent} from "@shared/components/ovic-input-address-new/ovic-input-address-new.component";
import {AuthService} from "@core/services/auth.service";
import {ConditionOption} from "@shared/models/condition-option";
import {OvicQueryCondition} from "@core/models/dto";

@Component({
  selector: 'app-thongtin-thisinh',
  standalone: true,
  imports: [CommonModule, TableModule, InputSwitchModule, TooltipModule, MatMenuModule, FormsModule, PaginatorModule, ReactiveFormsModule, InputTextModule, InputMaskModule, ButtonModule, RippleModule, SharedModule, CheckboxModule, MatProgressBarModule, OvicInputAddressNewComponent],
  templateUrl: './thongtin-thisinh.component.html',
  styleUrls: ['./thongtin-thisinh.component.css']
})
export class ThongtinThisinhComponent implements OnInit {

  @ViewChild('fromUpdate', {static: true}) template: TemplateRef<any>;
  @ViewChild('formAcount', {static: true}) formAcount: TemplateRef<any>;
  @ViewChild(Paginator) paginator: Paginator;
  listData              : ThiSinhInfo[];
  page                  : number = 1;
  index                 : number = 1;
  recordsTotal          : number = 0;
  formSave              : FormGroup;
  search                : string = '';
  menuName              : string = 'thi-sinh';
  subscription          : Subscription = new Subscription();
  sizeFullWidth         : number = 1024;
  rows                  : number = 20;
  isLoading             : boolean = true;
  private inputChanged  : Subject<string> = new Subject<string>();
  thissinhSelect        : ThiSinhInfo;
  provinceOptions       : DiaDanh[];
  thisinh_user_id       : number = 0;
  file_name             : string = '';

  protected readonly dantoc = DanToc;

  sex: { name: string, code: string }[] = [
    {name: 'Nữ', code: 'nu'},
    {name: 'Nam', code: 'nam'}
  ];

  isTramthi : boolean = false;

  constructor
  (
    private notificationService: NotificationService,
    private thisinhInfoService: ThisinhInfoService,
    private fb: FormBuilder,
    private locationService: LocationService,
    private auth: AuthService
  ) {
    const observerOnResize = this.notificationService.observeScreenSize.subscribe(size => this.sizeFullWidth = size.width)
    this.subscription.add(observerOnResize);
    this.formSave = this.fb.group({
      ten: [''],
      hoten: [this.auth.user.display_name, Validators.required],
      ngaysinh: ['', [Validators.required, DDMMYYYYDateFormatValidator]],
      dantoc: [''],
      tongiao: [''],
      gioitinh: ['', Validators.required],
      noisinh: [''],
      phone: [this.auth.user.phone, [Validators.required, PhoneNumberValidator, Validators.minLength(6)]],
      anh_chandung: [null, Validators.required],
      cccd_so: [this.auth.user.username, [Validators.required,]],
      cccd_ngaycap: ['', [Validators.required, DDMMYYYYDateFormatValidator]],
      cccd_noicap: ['Cục quản lý hành chính về TTXH', Validators.required],
      cccd_img_truoc: [null, Validators.required],
      cccd_img_sau: [null, Validators.required],
      thuongtru_diachi: [{}, ],
      status: [0],
      camket: [0, Validators.required],
      email: ['', Validators.required],
    });

    this.isTramthi = this.auth.userHasRole('diem-du-thi')
  }

  ngOnInit(): void {
    this.inputChanged.pipe(debounceTime(1000)).subscribe((item: string) => {
      this.searchContentByInput(item);
    });
    this.getDataCitis();
    this.loadInit();
  }

  loadInit() {
    this.loadData(1);
  }

  getDataCitis() {
    this.locationService.getListByIdAndKey(null,'regions').subscribe({
      next:(data)=>{
        this.provinceOptions = data;
      },error:()=>{

      }
    })

  }

  loadData(page: number, search ?: string) {

    this.isLoading = true;
    this.page = page;
    this.notificationService.isProcessing(true);

    const conddition:ConditionOption = {
      condition:[

      ],
      page:page.toString(),
      set:[
        {
          label:'limit',value: this.rows.toString(),
        },
        {
          label:'order',value: this.rows.toString(),
        }
      ]
    };
    if(search){
      conddition.condition.push({
        conditionName:'hoten',
        condition:OvicQueryCondition.like,
        value:`%${search}%`
      })
    }
    if(this.isTramthi){
      conddition.condition.push({
        conditionName:'created_by',
        condition:OvicQueryCondition.equal,
        value:this.auth.user.id.toString()
      })
    }
    this.thisinhInfoService.getDataByPageNew(conddition).subscribe({
      next: ({data, recordsFiltered}) => {
        this.recordsTotal = recordsFiltered;
        this.listData = data.map((m, index) => {
          m['_indexTable'] = this.rows * (page - 1) + index + 1;
          m['_gioitinh'] = m.gioitinh === 'nam' ? 'Nam' : "Nữ";
          m['_have_avata'] = m.anh_chandung && m.anh_chandung[0] ;
          return m;
        })
        this.isLoading = false;
        this.notificationService.isProcessing(false);
      },
      error: () => {
        this.isLoading = false;
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Load dữ liệu không thành công');
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
  get f(): { [key: string]: AbstractControl<any> } {
    return this.formSave.controls;
  }
  searchContentByInput(value) {
    const data = value.trim();
    this.onSearch(data);
  }
  onSearch(text: string) {
    this.search = text;
    this.loadData(1, this.search);
  }



  closeForm() {
    // this.loadInit();
    this.notificationService.closeSideNavigationMenu(this.menuName);
  }

  btnEDit(item: ThiSinhInfo) {
    this.file_name = item.cccd_so.toString();
    this.thissinhSelect = {...item};


    this.formSave.reset({
      ten: item.ten,
      hoten: item.hoten,
      ngaysinh: item.ngaysinh,
      gioitinh: item.gioitinh,
      dantoc: item.dantoc,
      tongiao: item.tongiao,
      noisinh: item.noisinh,
      phone: item.phone,
      anh_chandung: item.anh_chandung,
      cccd_so: item.cccd_so,
      cccd_ngaycap: item.cccd_ngaycap,
      cccd_noicap: item.cccd_noicap,
      cccd_img_truoc: item.cccd_img_truoc,
      cccd_img_sau: item.cccd_img_sau,
      thuongtru_diachi: item.thuongtru_diachi,
      status: item.status,
      camket: item.camket === 1 ,
      // quoctich: item.quoctich === 1 ? true : false,
      email:item.email,

    });
    this.notificationService.openSideNavigationMenu({
      name: this.menuName,
      template: this.template,
      size: this.sizeFullWidth,
      offsetTop: '0px'
    });
  }


  async btnDelete(item: ThiSinhInfo
  ) {const confirm = await this.notificationService.confirmDelete();
    if (confirm) {
      this.thisinhInfoService.delete(item.id).subscribe({
        next: () => {
          this.page = Math.max(1, this.page - (this.listData.length > 1 ? 0 : 1));
          this.notificationService.isProcessing(false);
          this.notificationService.toastSuccess('Thao tác thành công');
          this.loadData(this.page, this.search);

        }, error: () => {
          this.notificationService.isProcessing(false);
          this.notificationService.toastError('Thao tác không thành công');
        }
      })
    }
  }

  btnSaveEdit() {
    if(this.thissinhSelect){
      this.thisinhInfoService.update(this.thissinhSelect.id,this.formSave.value).subscribe({
        next:()=>{

          this.notificationService.isProcessing(false);
          this.notificationService.toastSuccess('Cập nhật dữ liệu thành công');

        },error:()=>{
          this.notificationService.toastError('Cập nhật dữ liệu không thành công');
          this.notificationService.isProcessing(false);

        }
      })
    }
  }


  changeThuongchu(event) {
    this.f['thuongtru_diachi'].setValue(event);
  }

  btnEditAcount(item:ThiSinhInfo){
    this.thissinhSelect = item;

    this.notificationService.openSideNavigationMenu({
      name: this.menuName,
      template: this.formAcount,
      size: this.sizeFullWidth,
      offsetTop: '0px'
    });

    this.thisinh_user_id = item.user_id;
  }

  btnUnLock(item:ThiSinhInfo){
    const select = item['lock'] === 1 ? 0 : 1;
    this.notificationService.isProcessing(true);
    this.thisinhInfoService.update( item.id , {lock:select}).subscribe({
      next:()=>{
        this.loadData(this.page,this.search);
        this.notificationService.isProcessing(false)
        this.notificationService.toastSuccess(' Cập nhật trạng thái khoá thành công ')
      },error:()=>{
        this.loadData(this.page,this.search);
        this.notificationService.isProcessing(false)
        this.notificationService.toastError(' Cập nhật trạng thái khoá thất bại ')
      }
    })
  }
}
