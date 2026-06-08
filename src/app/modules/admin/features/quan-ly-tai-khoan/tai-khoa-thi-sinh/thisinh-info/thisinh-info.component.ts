import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {User} from "@core/models/user";
import {NotificationService} from "@core/services/notification.service";
import {ThisinhInfoService} from "@shared/services/thisinh-info.service";
import {AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {DDMMYYYYDateFormatValidator, PhoneNumberValidator} from "@core/utils/validators";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {DiaDanh} from "@shared/models/location";
import {LocationService} from "@shared/services/location.service";
import {AuthService} from "@core/services/auth.service";
import {ThiSinhInfo} from "@shared/models/thi-sinh";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {OvicInputAddressNewComponent} from "@shared/components/ovic-input-address-new/ovic-input-address-new.component";
import {InputMaskModule} from "primeng/inputmask";
import {OvicAvataTypeThptComponent} from "@shared/components/ovic-avata-type-thpt/ovic-avata-type-thpt.component";
import {CheckboxModule} from "primeng/checkbox";
import {University, UniversityService} from "@shared/services/university.service";
import {DanToc} from "@shared/utils/syscat";
import {FormType} from "@shared/models/ovic-models";
import {forkJoin} from "rxjs";
import {ConditionOption} from "@shared/models/condition-option";

@Component({
  selector: 'app-thisinh-info',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule, ButtonModule, RippleModule, DropdownModule, InputTextModule, FormsModule, OvicInputAddressNewComponent, InputMaskModule, OvicAvataTypeThptComponent, ReactiveFormsModule, CheckboxModule],
  templateUrl: './thisinh-info.component.html',
  styleUrls: ['./thisinh-info.component.css']
})
export class ThisinhInfoComponent implements OnInit {

  @Input() set user (item :User){
    this._user = item;
    this.loadInit()
  }
  provinceOptions:DiaDanh[]
  formSave: FormGroup;
  _user: User ;
  ngview: 1| 0 | -1 = 0;
  thisinhInfo: ThiSinhInfo ;
  listDoituong:{label:string,value:string}[] = [
    {label:'Thí sinh tự do', value: 'tudo'},
    {label:'Sinh viên ĐHTN', value: 'dhtn'},
  ]
  dantoc = DanToc;
  listUniversity : University[];

  fileName: string = '';

  sex: { name: string, code: string }[] =
    [
      {name: 'Nữ', code: 'nu'},
      {name: 'Nam', code: 'nam'}
    ];
  constructor(
    private notifi: NotificationService,
    private thisinhInfoService :ThisinhInfoService,
    private fb: FormBuilder,
    private locationService: LocationService,
    private auth: AuthService,
    private universityService : UniversityService
  ) {
    this.formSave = this.fb.group({
      user_id: [this.auth.user.id, Validators.required],
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
      email: [this.auth.user.email, Validators.required],
      diachi_congtac: [''],
      doituong:[''],
      doituong_masv:[''],
      doituong_truong:[''],
      doituong_anhthe:[null]

    });
  }



  ngOnInit(): void {
  }

  get f(): { [key: string]: AbstractControl<any> } {
    return this.formSave.controls;
  }

  loadInit(){
    this.ngview = 0 ;
    const conditio: ConditionOption = {
      condition:[
      ],
      page:'1',
      set:[
        {label:'limit',value:'-1'}
      ]
    }
    forkJoin([
      this.locationService.getListByIdAndKey(null, "regions"),
      this.universityService.getDataByPageNew(conditio)
    ])
      .subscribe({
        next: ([diadanh,dataUniversity]) => {

        this.provinceOptions = diadanh;
        this.listUniversity = dataUniversity.data;
        this.loadData(this._user);
      },error:()=>{
        this.ngview = -1 ;
        this.notifi.toastError('Mất kết nối với máy chủ');
      }
    })

  }

  loadData(user: User){
    this.thisinhInfoService.getUserInfo(user.id).subscribe({
      next:(data)=>{

        this.thisinhInfo = data;
        this.formSave.reset({
          user_id: data.user_id,
          ten: data.ten,
          hoten: data.hoten,
          ngaysinh: data.ngaysinh,
          email:data.email,
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
          status:data.status,
          camket: data.camket === 1 ? true : false,
          diachi_congtac: data.diachi_congtac,
          doituong:data.doituong,
          doituong_masv:data.doituong_masv,
          doituong_truong:data.doituong_truong,
          doituong_anhthe:data.doituong_anhthe,

        });

        this.fileName = this.replaceHoten(data.hoten) + '_' + data.cccd_so;
        this.ngview = 1;

      },error:()=>{
        this.notifi.isProcessing(false);
        this.ngview =-1;
      }
    })

  }
  replaceHoten(str:string):string{
    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Loại bỏ dấu
    str = str.replace(/đ/g, "d").replace(/Đ/g, "D"); // Thay 'đ' và 'Đ' bằng 'd' và 'D'
    return str.replace(/\s+/g, '').toUpperCase();

  }

  reLoad(){
    this.loadInit()
  }

  onchangedoituong(event){
    this.f['doituong_truong'].setValue('');
    this.f['doituong_masv'].setValue('');
    this.f['doituong_anhthe'].setValue('');
  }
  changeThuongchu(event) {
    this.f['thuongtru_diachi'].setValue(event);
  }

  btnSaveForm(){
    if(this.f['doituong'].value == 'dhtn' && (!this.f['doituong_masv'].value || !this.f['doituong_truong'].value || !this.f['doituong_anhthe'].value)){
      return this.notifi.toastError('Vui lòng kiểm tra lại: Mã sinh viên; Trường theo học, ảnh thẻ');
    }
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
        this.notifi.isProcessing(true)

        this.thisinhInfoService.update(this.thisinhInfo.id, this.formSave.value).subscribe({
          next: () => {
            this.loadInit()
            this.notifi.isProcessing(false);
            this.notifi.toastSuccess('Thao tác thành công', 'Thông báo');
          },
          error: () => {
            this.notifi.isProcessing(true)
            this.notifi.isProcessing(false);
            this.notifi.toastError('Thao tác thất bại', 'Thông báo')
          }
        })

      } else {
        this.notifi.toastError('Vui lòng thêm ảnh');
      }
    } else {
      this.formSave.markAllAsTouched();
      this.notifi.toastError('Vui lòng nhập đúng và đủ thông tin.');
    }
  }

}
