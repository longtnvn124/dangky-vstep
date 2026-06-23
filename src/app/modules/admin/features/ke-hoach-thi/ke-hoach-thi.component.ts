import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormType, NgPaginateEvent, OvicForm, OvicTableStructure} from "@shared/models/ovic-models";
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Paginator, PaginatorModule} from "primeng/paginator";
import {debounceTime, filter, forkJoin, Observable, of, Subject, Subscription, switchMap} from "rxjs";
import {NotificationService} from "@core/services/notification.service";
import {BUTTON_NO, BUTTON_YES, OvicButton} from "@core/models/buttons";

import {KeHoachThi, KehoachthiVstepService} from "@shared/services/vstep/kehoachthi-vstep.service";
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
import {KehoachthiDiemthiVstepService} from "@shared/services/vstep/kehoachthi-diemthi-vstep.service";
import {ConditionOption} from "@shared/models/condition-option";
import {OvicQueryCondition} from "@core/models/dto";
import {DialogModule} from "primeng/dialog";
import {InputTextModule} from "primeng/inputtext";
import {Languages, LanguagesService} from "@shared/services/vstep/languages.service";
import {ConfigsService} from "@shared/services/configs.service";
import {
  KehoachFormDongiaComponent
} from "@modules/admin/features/ke-hoach-thi/kehoach-form-dongia/kehoach-form-dongia.component";
import {
  KehoachFormLevelsComponent
} from "@modules/admin/features/ke-hoach-thi/kehoach-form-levels/kehoach-form-levels.component";
import {SharedModule} from "@shared/shared.module";
import {User} from "@core/models/user";
import {ThiSinhInfo} from "@shared/models/thi-sinh";
import {OrdersVstep, VstepOrdersService} from "@shared/services/vstep-orders.service";
import {FileService} from "@core/services/file.service";
import {ExWordVstepService} from "@shared/services/export/ex-word-vstep.service";


interface FormKehoachthi extends OvicForm {
  object: KeHoachThi;
}


@Component({
  selector: 'app-ke-hoach-thi',
  templateUrl: './ke-hoach-thi.component.html',
  styleUrls: ['./ke-hoach-thi.component.css'],
  imports: [
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
    KehoachFormDongiaComponent,
    KehoachFormLevelsComponent,
    SharedModule,
  ],
  standalone: true
})
export class KeHoachThiComponent implements OnInit {
  @ViewChild( 'dataToExport' , { static : false } ) dataToExport : ElementRef;
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
      headClass: 'ovic-w-150px text-center',
      rowClass: 'ovic-w-150px text-center'
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

  listLanguage: Languages[];


  configPayers : {label:string,value:string,key:string}[];
  constructor(

    private notifi: NotificationService,
    private fb: FormBuilder,
    private kehoachthiVstepService: KehoachthiVstepService,
    private auth: AuthService,
    private kehoachthiDiemthiVstepService: KehoachthiDiemthiVstepService,
    private configsService: ConfigsService,
    private languagesService: LanguagesService,
    private ordersService :VstepOrdersService,
    private fileService: FileService,
    private exWordVstepService: ExWordVstepService
  ) {
    const roleAdmin =  this.auth.roles.map(m=>m.name).includes('admin')

    if(roleAdmin){
      this.tblStructure.push({
        tooltip: '',
        fieldType: 'buttons',
        field: [],
        rowClass: 'ovic-w-200px text-center',
        checker: 'fieldName',
        header: 'Thao tác',
        sortable: false,
        headClass: 'ovic-w-200px text-center',
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
            tooltip: 'Hồ sơ lưu trữ đăng ký',
            label: '',
            icon: 'pi pi-server',
            name: 'HOSO_DECISION',
            cssClass: 'btn-secondary rounded'
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
      dongia:['',Validators.required],
      ngonngu:[null,Validators.required],
      levels:[null,Validators.required]

    });
  }

  ngOnInit(): void {
    this.loadInit()
  }

  loadInit() {
    this.isLoading = true;

    const conditionUniver :ConditionOption = {
      condition:[
        {
          conditionName:'status',
          condition:OvicQueryCondition.equal,
          value:'1'
        }
      ],
      page: '1',
      set:[
        {label : 'limit',value:'-1'}
      ]
    };

    forkJoin([
      this.languagesService.getDataByPageNew(conditionUniver),
      this.configsService.getdatabyconfig_key('PAYERS')
    ])
      .subscribe({
        next:([lag, config])=>{
          this.listLanguage= lag.data;
          this.configPayers = JSON.parse(config.value);
          this.isLoading = false;
          this.loadData(1);

        },error:()=>{

          this.isLoading = false;
          this.notifi.toastError('Mất kết nối với máy chủ ');
        }
      })


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
          dongia:this.configPayers,
          ngonngu:'',
          levels:''

        });
        this.formActive = this.listForm[FormType.ADDITION];
        this.preSetupForm(this.menuName);
        break;
      case 'EDIT_DECISION':
        this.btn_checkAdd = "Cập nhật";
        const object1 = this.listData.find(u => u.id === decision.id);

        this.formActive = this.listForm[FormType.UPDATE];
        this.formActive.object = object1;

        this.formSave.reset({
          nam:object1.nam,
          title:object1.title,
          mota:object1.mota,
          status:object1.status,
          ngaythi:object1.ngaythi,
          ngaybatdau: object1.ngaybatdau ? new Date(object1.ngaybatdau) : null,
          ngayketthuc:object1.ngayketthuc ? new Date(object1.ngayketthuc) : null,

          dongia: object1.dongia ? object1.dongia : this.configPayers,
          ngonngu:object1.ngonngu ? object1.ngonngu : null ,
          levels:object1.levels? object1.levels: [],
        })

        this.preSetupForm(this.menuName);
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
      case 'HOSO_DECISION':
        this.kehoach_select = {...this.listData.find(u => u.id === decision.id)};
        this.getHosoLuutru(this.kehoach_select);
        break;
      default:
        break;
    }
  }


  soluongDkByDiemduthi  : number = null;
  typeDkByDiemduthi     : boolean = false;
  displayModal          : boolean = false;
  soLuongDiemduthiTheoTram(object : KeHoachThi){


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

  onChagelang(event){
    if(event){

    this.f['levels'].setValue([].concat(event['levels']));
    }else{
      this.f['levels'].setValue([]);
    }
  }

  async getHosoLuutru(item:KeHoachThi){

    this.notifi.loadingAnimationV2({process: {percent : 0}});
    this.loopGetOrderBy(1,200,item.id,[],1,'id,kehoach_id,diemduthi_id,capthi,lephithi,trangthai_thanhtoan,thoigian_thanhtoan,user_id,parent_id','1')
      .pipe(switchMap(m=>{

        console.log(m);
        const idsParent = Array.from(new Set(m.filter(a => a.parent_id !== 0).map(a => a.parent_id)));
        return forkJoin([
          of(m),
          idsParent.length> 0? this.ordersService.getDataByparentIds(idsParent,'id,kehoach_id,diemduthi_id,capthi,lephithi,trangthai_thanhtoan,thoigian_thanhtoan,user_id,parent_id'):of([]),
        ]);
      }))
      .subscribe({
        next:([dataOrder,dataParent])=>{

          const dataMap = dataOrder.filter(f=>!f['huy']).map((m,index)=>{
            const user:User = m['user'];
            const thisinh:ThiSinhInfo = m['thisinh'];
            const parent:OrdersVstep = m.parent_id === 0 ? null : dataParent.find(f=>f.id === m.parent_id);
            const ngonngu = this.listLanguage.find(f=>f.id == item.ngonngu);

            m['__hoten']= thisinh ? thisinh.hoten : '';
            m['__cccd_so']= user ? user.username :(thisinh ? thisinh.cccd_so : '');
            m['__email']= thisinh && thisinh.email ? thisinh.email : '';
            m['__ngaysinh']= thisinh ? thisinh.ngaysinh : '';
            m['__gioitinh']= thisinh && thisinh.gioitinh ? (thisinh.gioitinh === 'nam' ?'Nam': 'Nữ' ) : '';
            m['__phone']= user ? user.phone :(thisinh ? thisinh.phone : '');
            m['__ngonngu']=ngonngu ? ngonngu.title : '';
            m['__doituong']=  parent ? 'doitac' : (thisinh && thisinh['doituong'] == 'dhtn' ? 'dhtn' : 'tudo' );
            m['__anhthe']= thisinh && thisinh.anh_chandung && thisinh.anh_chandung[0] ? this.fileService.getPreviewLinkLocalFile(thisinh.anh_chandung[0]) :'';
            m['__anhthesinhvien']= thisinh && thisinh.doituong_anhthe && thisinh.doituong_anhthe[0] ? this.fileService.getPreviewLinkLocalFile(thisinh.doituong_anhthe[0]) :'';
            m['__anh_cccd_truoc']= thisinh && thisinh.cccd_img_truoc && thisinh.cccd_img_truoc[0] ? this.fileService.getPreviewLinkLocalFile(thisinh.cccd_img_truoc[0]) :'';
            m['__anh_cccd_sau']= thisinh && thisinh.cccd_img_sau && thisinh.cccd_img_sau[0] ? this.fileService.getPreviewLinkLocalFile(thisinh.cccd_img_sau[0]) :'';
            m['__capthi'] = item.levels.map(lv=>{
              lv['check'] = lv.value.toLowerCase() == m.capthi.toLowerCase()
              return lv;
            }).filter(f=>f.select == 1).concat(
              Array(6).fill({
                label: '',
                value: '',
                check: false,
                select : 1
              })
            )
              .slice(0, 6);

            return {
              hoten: m['__hoten'],
              ngaysinh: m['__ngaysinh'],
              gioitinh: m['__gioitinh'],
              cccd_so: m['__cccd_so'],
              cccd_ngaycap: thisinh && thisinh['cccd_ngaycap'] ? thisinh['cccd_ngaycap'] :'',
              cccd_noicap: thisinh && thisinh['cccd_noicap'] ? thisinh['cccd_noicap'] :'',
              email: m['__email'],
              phone: m['__phone'],
              capthi: m['__capthi'],
              anh_chandung :m['__anhthe'],
              doituong_anhthe :m['__anhthesinhvien'],
              cccd_mattruoc :m['__anh_cccd_truoc'],
              cccd_matsau :m['__anh_cccd_sau'],
              thuongtru:thisinh && thisinh['thuongtru_diachi'] ? thisinh['thuongtru_diachi']['fullAddress'] : '',
              dotthi:item.title,
              ngonngu: ngonngu ? ngonngu.title : '',
              doituong: m['__doituong'],
              dothi: item.title
            };
          });

          if (dataMap.length > 0 ) {
            this.exWordVstepService.hosoLuutruThisinh(dataMap,'hosoluutru' + item.title);
          }else{
            this.notifi.toastWarning('Đợt thi chưa có lượt đăng ký ');
            this.notifi.disableLoadingAnimationV2();
          }

        },
        error:()=>{
          this.notifi.isProcessing(false);
          this.notifi.disableLoadingAnimationV2();
          this.notifi.toastError('Load dữ liệu không thành công');

        }
      });
  }

  loopGetOrderBy(page:number,limit:number, kehoach_id:number, data:OrdersVstep[] ,recordsFiltered:number, select:string, trangthai_thanhtoan:string):Observable<OrdersVstep[]>{
    if (data.length < recordsFiltered) {

      return this.ordersService.getDataBykehoachIdAndSelectforThongkeV2(page,limit,kehoach_id,select,trangthai_thanhtoan).pipe(
        switchMap(m=>{

          return this.loopGetOrderBy(page+1,limit,kehoach_id,data.concat(m['data']),m['recordsFiltered'],select,trangthai_thanhtoan)
        })
      )
    } else{
      return of(data);
    }
  }




}
