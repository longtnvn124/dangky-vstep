import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NotificationService} from "@core/services/notification.service";
import {UserService} from "@core/services/user.service";
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from "@angular/forms";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {User} from "@core/models/user";
import {take} from "rxjs/operators";
import { SharedModule } from "@modules/shared/shared.module";
import { ContextMenuModule } from "primeng/contextmenu";

@Component({
  selector: 'app-form-update-user',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule, ButtonModule, RippleModule, ReactiveFormsModule, SharedModule, ContextMenuModule],
  templateUrl: './form-update-user.component.html',
  styleUrls: ['./form-update-user.component.css']
})
export class FormUpdateUserComponent implements OnInit {

  @Input() set User(item: User) {
    this.user_id = item.id;
    this.loadInit();
  }

  @Output() updateSuccess = new EventEmitter<void>();

  user_id: number = null;
  fonm: FormGroup;
  typeView: 1 | 0 | -1 = 0;
  isSubmitting = false;
  private initialFormValue = {
    display_name: '',
    username: '',
    phone: '',
    email: '',
    password: '',
    status: 0,
    verified: 0
  };

  type_password: 'password' | 'text' = 'text';

  constructor(
    private notifi: NotificationService,
    private userService: UserService,
    private fb: FormBuilder,
    private elementRef: ElementRef<HTMLElement>
  ) {
    this.fonm = this.fb.group({
      display_name: ['', Validators.required],
      username: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.minLength(8)],
      status: [0, [Validators.min(0), Validators.max(1)]],
      verified: [0, [Validators.min(0), Validators.max(1)]]
    });
  }

  get f() {
    return this.fonm.controls;
  }

  ngOnInit(): void {}

  loadInit(): void {
    this.typeView = 0;
    this.userService.getUser(this.user_id).pipe(take(1)).subscribe({
      next: (data) => {
        this.initialFormValue = {
          display_name: data.display_name,
          username: data.username,
          phone: data.phone,
          email: data.email,
          password: '',
          status: data.status == 0 ? 0 : 1,
          verified: data.verified == 0 ? 0 : 1
        };
        this.fonm.setValue(this.initialFormValue);
        this.fonm.markAsPristine();
        this.fonm.markAsUntouched();
      
        this.typeView = 1;
      },
      error: (err) => {
        this.notifi.toastError(err['error']['message']);
        this.typeView = -1;
      }
    });
  }

  reLoad(): void {
    this.loadInit();
  }

  btnUpdate(): void {
    if (this.isSubmitting) {
      return;
    }

    if (!this.fonm.valid) {
      this.fonm.markAllAsTouched();
      this.focusFirstError();
      this.notifi.toastWarning('Vui lòng kiểm tra lại thông tin');
      return;
    }

    const payload: Partial<User> = {
      display_name: this.fonm.value.display_name,
      username: this.fonm.value.username,
      phone: this.fonm.value.phone,
      email: this.fonm.value.email,
      status: this.fonm.value.status,
      verified: this.fonm.value.verified
    };

    if (this.fonm.value.password && this.fonm.value.password.trim() !== '') {
      payload.password = this.fonm.value.password;
    }

    this.isSubmitting = true;
    this.userService.updateUserInfo(this.user_id, payload).pipe(take(1)).subscribe({
      next: () => {
        this.initialFormValue = {
          ...this.fonm.value,
          password: ''
        };
        this.fonm.patchValue({password: ''});
        this.fonm.markAsPristine();
        this.notifi.toastSuccess('Cập nhật tài khoản thành công');
        this.isSubmitting = false;
        this.updateSuccess.emit();
      },
      error: () => {
        this.notifi.toastError('Thao tác không thành công');
        this.isSubmitting = false;
      }
    });
  }

  resetForm(): void {
    this.fonm.reset(this.initialFormValue);
    this.fonm.markAsPristine();
    this.fonm.markAsUntouched();
  }

  changeStatus(value: number): void {
    this.f['status'].setValue(value);
  }

  changeVerified(value: number): void {
    this.f['verified'].setValue(value);
  }

  private focusFirstError(): void {
    setTimeout(() => {
      this.elementRef.nativeElement.querySelector<HTMLElement>('.form-row__input--error')?.focus();
    });
  }

  btnShowPassWord(){
    this.type_password = this.type_password === 'password' ? 'text' : 'password';
  }
}
