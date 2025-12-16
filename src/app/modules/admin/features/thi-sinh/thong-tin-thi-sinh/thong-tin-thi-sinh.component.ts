import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import {FormType, OvicForm} from '@modules/shared/models/ovic-models';
import {ThiSinhInfo} from "@shared/models/thi-sinh";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {debounceTime, forkJoin, Subject, Subscription} from "rxjs";
import {DiaDanh} from '@modules/shared/models/location';
import {AuthService} from '@core/services/auth.service';
import {NotificationService} from "@core/services/notification.service";
import {LocationService} from "@shared/services/location.service";
import {DDMMYYYYDateFormatValidator, NumberLessThanTenValidator, PhoneNumberValidator} from "@core/utils/validators";
import {ThisinhInfoService} from "@shared/services/thisinh-info.service";
import {BUTTON_CANCEL, BUTTON_NO, BUTTON_YES} from "@core/models/buttons";
import {
  DanToc,
  DEFAULT_MODAL_OPTIONS,
  DEPARTMENT_OF_EDUCATION,
  SCHOOL_BY_DEPARTMENT,
  SchoolDepartment
} from "@shared/utils/syscat";
import {DanhMucDoiTuong, DanhMucDoituongUutienService} from "@shared/services/danh-muc-doituong-uutien.service";
import {DmTruongHoc} from "@shared/models/danh-muc";
import {DanhMucTruongHocService} from "@shared/services/danh-muc-truong-hoc.service";
import {DanhMucHskAddToolService, DmPhu} from "@shared/services/danh-muc-hsk-add-tool.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";


interface FormThisinh extends OvicForm {
  object: ThiSinhInfo;
}

// export function replaceCommaValidator(): ValidatorFn {
//   return (control: AbstractControl): ValidationErrors | null => {
//     if (control.value == null) {
//       return null;
//     }
//     const value = control.value.toString();
//     const newValue = value.replace(/,/g, '.');
//     if (newValue !== value) {
//       control.setValue(newValue, {emitEvent: false}); // Update value without emitting event
//     }
//     return null; // Always return null since we're just replacing characters
//   };
// }

export function replaceCommaValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value == null) {
      return null;
    }
    let value = control.value.toString();
    let newValue = value.replace(/,/g, '.');

    // Kiểm tra nếu giá trị chỉ chứa số và dấu chấm hợp lệ (số thực)
    if (/^[0-9]*\.?[0-9]*$/.test(newValue)) {
      if (newValue !== value) {
        control.setValue(newValue, { emitEvent: false });
      }
    } else {
      return { invalidFormat: true }; // Trả về lỗi nếu có ký tự không hợp lệ
    }

    return null;
  };
}

@Component({
  selector: 'app-thong-tin-thi-sinh',
  templateUrl: './thong-tin-thi-sinh.component.html',
  styleUrls: ['./thong-tin-thi-sinh.component.css']
})
export class ThongTinThiSinhComponent implements OnInit {
  @ViewChild('tplNotifiAvata') tplNotifiAvata: ElementRef;

  dataSogiaoduc:DmTruongHoc[];
  checkdata: 1 | 0 = 0;// o :load data
  formSave: FormGroup;

  userInfo: ThiSinhInfo;
  private OBSERVE_PROCESS_FORM_DATA = new Subject<FormThisinh>();
  subscription = new Subscription();
  formActive: FormThisinh;
  titleBtn: 'Lưu thông tin' | 'Cập nhật thông tin' = 'Lưu thông tin';
  sex: { name: string, code: string }[] =
    [
      {name: 'Nữ', code: 'nu'},
      {name: 'Nam', code: 'nam'}
    ];
  dantoc = DanToc;
  provinceOptions: DiaDanh[] = [];

  listForm = {
    [FormType.ADDITION]: {type: FormType.ADDITION, title: 'Thêm mới Thông tin cá nhân ', object: null, data: null},
    [FormType.UPDATE]: {type: FormType.UPDATE, title: 'Cập nhật Thông tin cá nhân ', object: null, data: null}
  };



  hskk_lever = [
    {label:'Sơ cấp',value:'socap',ten_tiengtrung:'HSKK（初级）'},
    {label:'Trung cấp',value:'trungcap',ten_tiengtrung:'HSKK（中级）'},
    {label:'Cao cấp',value:'Cao cấp',ten_tiengtrung:'HSKK（高级）'},
  ]

  danhMucDoiTuong: DanhMucDoiTuong[];

  data_Loaigiayto :{name:string,value:string}[] = [
    {
      name:'Căn cước công dân',
      value:'身份证'
    },
    {
      name:'Hộ chiếu',
      value:'护照'
    },
  ]

  file_name:string = '';
  dmQuoctich:DmPhu[];
  dmNgonngume:DmPhu[];
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private thisinhInfoService: ThisinhInfoService,
    private notifi: NotificationService,
    private locationService: LocationService,
    private danhMucDoituongUutienService: DanhMucDoituongUutienService,
    private danhMucTruongHocService: DanhMucTruongHocService,
    private dmPhuservice: DanhMucHskAddToolService,
    private modalSerivce: NgbModal
  ) {
    const observeProcessFormData = this.OBSERVE_PROCESS_FORM_DATA.asObservable().pipe(debounceTime(100)).subscribe(form => this.__processFrom(form));
    this.subscription.add(observeProcessFormData);

    this.formSave = this.fb.group({
      user_id: [this.auth.user.id, Validators.required],
      ten: [''],
      hoten: [this.auth.user.display_name, Validators.required],
      hoten_tiengtrung: ['',],
      namhoc_tiengtrung: [null, [Validators.required,NumberLessThanTenValidator, replaceCommaValidator()]],
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
      thuongtru_diachi_moi: [{}, ],
      status: [0],
      camket: [0, Validators.required],
      // quoctich: [null],
      email: [this.auth.user.email, Validators.required],
      // hskk_lever: [null,],
      ma_quoctich:['',Validators.required],
      ngonngu_me:['',Validators.required],
      loai_giayto:['',Validators.required],
    });
    this.file_name = this.replaceHoten(this.auth.user.display_name)+ '_' + this.auth.user.username;

  }

  replaceHoten(str:string):string{
    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Loại bỏ dấu
    str = str.replace(/đ/g, "d").replace(/Đ/g, "D"); // Thay 'đ' và 'Đ' bằng 'd' và 'D'
    return str.replace(/\s+/g, '').toUpperCase();

  }


  get f(): { [key: string]: AbstractControl<any> } {
    return this.formSave.controls;
  }

  ngOnInit(): void {
    this.viewNotifiAvatar = true;
    this.loadInit();
  }

  loadInit() {
    this.getDataCitis();
  }

  getDataCitis() {
    forkJoin<[DiaDanh[], DanhMucDoiTuong[],DmTruongHoc[], DmPhu[],DmPhu[]]>(
      this.locationService.listProvinces(),
      this.danhMucDoituongUutienService.getdataUnlimit(),
      this.danhMucTruongHocService.getSogiaoduc(),
      this.dmPhuservice.getDataUnlimitByType("quoctich"),
      this.dmPhuservice.getDataUnlimitByType('ngonngume')
    ).subscribe({
      next: ([diadanh, doituong,sogiaoduc, dmQuoctich,dmNgonngume]) => {
        this.provinceOptions = diadanh;
        this.danhMucDoiTuong = doituong;
        this.dataSogiaoduc = sogiaoduc;
        this.dmQuoctich = dmQuoctich;
        this.dmNgonngume = dmNgonngume;
        if(this.provinceOptions.length>0 && this.danhMucDoiTuong.length>0 &&this.dataSogiaoduc.length>0 ){
          this._getDataUserInfo(this.auth.user.id);

        }
      }
    })

  }

  async _getDataUserInfo(user_id: number) {
    this.notifi.isProcessing(true);
    this.thisinhInfoService.getUserInfo(user_id).subscribe({
      next: data => {
        if (data && this.provinceOptions) {
          this.checkdata = 1;
          this.titleBtn = "Cập nhật thông tin";
          this.formActive = this.listForm[FormType.UPDATE];
          this.formActive.object = data;
          if (data.status === 1) {
            this.formSave.disable();
          }
          this.formSave.reset({
            user_id: this.auth.user.id,
            ten: data.ten,
            hoten: data.hoten,
            namhoc_tiengtrung: data.namhoc_tiengtrung,
            hoten_tiengtrung: data.hoten_tiengtrung,
            ngaysinh: data.ngaysinh,
            gioitinh: data.gioitinh,
            dantoc: data.dantoc,
            tongiao: data.tongiao,
            noisinh: data.noisinh,
            phone: data.phone,
            anh_chandung: data.anh_chandung,
            cccd_so: data.cccd_so,
            cccd_ngaycap: data.cccd_ngaycap,
            cccd_noicap: data.cccd_noicap,
            cccd_img_truoc: data.cccd_img_truoc,
            cccd_img_sau: data.cccd_img_sau,
            thuongtru_diachi: data.thuongtru_diachi,
            thuongtru_diachi_moi: data['thuongtru_diachi_moi'],
            status:data.status,
            camket: data.camket === 1 ? true : false,
            // quoctich: data.quoctich === 1 ? true : false,
            email: data.email? data.email : this.auth.user.email ,
            ma_quoctich:data.ma_quoctich,
            ngonngu_me:data.ngonngu_me,
            loai_giayto:data.loai_giayto,

          });
          // this.changeInfoDepartment10(data.lop10_department)
          // this.changeInfoDepartment11(data.lop11_department)
          // this.changeInfoDepartment12(data.lop12_department)
          this.changeThuongchu(data.thuongtru_diachi);
          this.changeThuongchuMoi(data['thuongtru_diachi_moi']);
          this.userInfo = data;

          this.file_name = this.replaceHoten(this.auth.user.display_name)+ '_' + data.cccd_so;
          console.log(this.file_name);

        } else {
          this.checkdata = 1;
          this.formActive = this.listForm[FormType.ADDITION];
          this.titleBtn = "Lưu thông tin";
          this.userInfo = null;
        }
        this.notifi.isProcessing(false);
      }, error: (e) => {
        this.notifi.isProcessing(false);
      }
    });

  }

  private __processFrom({data, object, type}: FormThisinh) {
    this.notifi.isProcessing(true);

    if (type === FormType.ADDITION) {
      this.thisinhInfoService.create(data).subscribe({
        next: () => {
          if (type === FormType.ADDITION) {
            this.formActive = this.listForm[FormType.UPDATE];
          }
          this._getDataUserInfo(this.auth.user.id);
          this.notifi.isProcessing(false);
          this.notifi.toastSuccess('Thao tác thành công', 'Thông báo');
        },
        error: () => {
          this.notifi.isProcessing(false);
          this.notifi.toastError('Thao tác thất bại', 'Thông báo')
        }
      })
    }
    if (type === FormType.UPDATE) {

      if(this.userInfo.request_update === 2){
        data['request_update'] = 0;
        data['lock'] = 1;
      }


      this.thisinhInfoService.update(object.id, data).subscribe({
        next: () => {
          if (type === FormType.ADDITION) {
            this.formActive = this.listForm[FormType.UPDATE];
          }
          this._getDataUserInfo(this.auth.user.id);
          this.notifi.isProcessing(false);
          this.notifi.toastSuccess('Thao tác thành công', 'Thông báo');
        },
        error: () => {
          this.notifi.isProcessing(false);
          this.notifi.toastError('Thao tác thất bại', 'Thông báo')
          this._getDataUserInfo(this.auth.user.id);
        }
      })
    }

  }

  saveForm() {
    if (this.formSave.valid) {
      this.f['ten'].setValue(this.f['hoten'].value.split(' ').pop());
      this.f['hoten'].setValue(this.f['hoten'].value?.toString().trim());
      const mattruoc = this.f['cccd_img_truoc'].value[0] != null ? this.f['cccd_img_truoc'].value : null;
      const matsau = this.f['cccd_img_sau'].value[0] != null ? this.f['cccd_img_sau'].value : null;
      const anh_chandung = this.f['anh_chandung'].value[0] != null ? this.f['anh_chandung'].value : null;

      this.f['cccd_img_truoc'].setValue(mattruoc);
      this.f['cccd_img_sau'].setValue(matsau);
      this.f['anh_chandung'].setValue(anh_chandung);

      const check_camket = this.f['camket'].value ? 1 : 0;
      this.f['camket'].setValue(check_camket);

      // const quoctich = this.f['quoctich'].value ? 1 : 0;
      // this.f['quoctich'].setValue(quoctich);



      if (mattruoc && matsau && anh_chandung) {
        this.formActive.data = this.formSave.value;
        this.OBSERVE_PROCESS_FORM_DATA.next(this.formActive);
      } else {
        this.notifi.toastError('Vui lòng thêm ảnh');
      }
    } else {
      this.formSave.markAllAsTouched();
      this.notifi.toastError('Vui lòng nhập đúng và đủ thông tin.');
    }

  }

  async privateData() {

    if (this.userInfo) {
      const button = await this.notifi.confirmRounded('<p class="text-danger">Xác nhận</p>', 'Khoá thông tin', [BUTTON_NO, BUTTON_YES]);
      if (button.name === BUTTON_YES.name) {
        this.notifi.isProcessing(true);
        this.thisinhInfoService.update(this.userInfo.id, {status: 1}).subscribe({
          next: () => {
            this.notifi.toastSuccess('Khoá thông tin thành công');
            this.notifi.isProcessing(false);
            this._getDataUserInfo(this.auth.user.id);
          }, error: () => {
            this.notifi.toastError('Mất kết nối với máy chủ');
            this.notifi.isProcessing(false);
          }
        })
      }
    } else {
      this.notifi.toastWarning('Bạn chưa lưu thông tin thí sinh');
    }
  }

  changeThuongchu(event) {
    this.f['thuongtru_diachi'].setValue(event);
  }
  changeThuongchuMoi(event) {
    this.f['thuongtru_diachi_moi'].setValue(event);
  }


  isRequestUpdate:boolean = false;
  async btnRequsetUpdate(){
    const button = await this.notifi.confirmRounded('Gửi yêu cầu cập nhật thông tin ','XÁC NHẬN',  [BUTTON_CANCEL,BUTTON_YES]);
    if (button.name === BUTTON_YES.name) {
      this.isRequestUpdate= true;
      this.thisinhInfoService.update(this.userInfo.id,{request_update:1}).subscribe({
        next:(data)=>{
          this._getDataUserInfo(this.auth.user.id)
          this.isRequestUpdate= false;
          this.notifi.toastSuccess('Yêu cầu đã được gửi đi, vui lòng quay lại sau.');

        },error:()=>{
          this.isRequestUpdate= false;
          this.notifi.toastError('Thao tác không thành công');
        }
      })
    }
  }

  viewNotifiAvatar:boolean= false;
  btnviewNotifiAvatar(){
    // this.viewNotifiAvatar = true;

    this.modalSerivce.open( this.tplNotifiAvata,DEFAULT_MODAL_OPTIONS);
  }

}
