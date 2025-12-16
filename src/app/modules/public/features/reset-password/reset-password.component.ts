import {Component, OnDestroy, OnInit} from '@angular/core';
import {state, style, trigger} from '@angular/animations';
import {Subscription} from 'rxjs';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {NotificationService} from '@core/services/notification.service';
import {AuthService} from '@core/services/auth.service';
import * as test from "node:test";
import {PassCheckValidator} from "@core/utils/validators";


export function customInputValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const inputValue: string = control.value;
    const errors: { [key: string]: any } = {};
    if (!/[A-Za-z]/.test(inputValue) || !/\d/.test(inputValue)) {
      errors['noAlphaNumeric'] = true;
    }
    if (inputValue.length < 8) {
      errors['minLength'] = true;
    }
    if (!/[^A-Za-z0-9]/.test(inputValue)) {
      errors['noSpecialCharacter'] = true;
    }
    if (!/[A-Z]/.test(inputValue)) {
      errors['noUpperCase'] = true;
    }
    return Object.keys(errors).length !== 0 ? errors : null;
  };
}
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  animations: [
    trigger('showError', [
      state('showed', style({
        opacity: 1,
        visibility: 'visible',
        transform: 'translateY(0)',
        'z-index': 10
      })),
      state('hide', style({
        opacity: 0,
        visibility: 'hidden',
        transform: 'translateY(20px)',
        'z-index': -1
      }))
    ])
  ]
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

  condition = false;

  errValidateForm = 'hide';

  errTimeOut = null;

  errMessage: string;

  subscription: Subscription;

  formConfirm: FormGroup;

  showPassword1: 'password' | 'test' = 'password';


  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.formConfirm = this.formBuilder.group({
      token: ['', Validators.required],
      password: ['', [Validators.required, PassCheckValidator,customInputValidator()]],
    });
  }

  get f() {
    return this.formConfirm.controls;
  }

  ngOnInit(): void {
    this.subscription = this.route.queryParamMap.subscribe(params => this.setToken(params));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if (this.errTimeOut) {
      clearTimeout(this.errTimeOut);
    }
  }

  setToken(param: ParamMap) {
    if (param.has('token') && param.get('token')) {
      this.condition = true;
      this.f['token'].setValue(param.get('token'));
    }
  }

  checkData() {
    this.errValidateForm = 'hide';
    this.errMessage = 'no message';
    clearTimeout(this.errTimeOut);

    if (!this.f['token'].value) {
      this.showError('token trống, vui lòng quay lại trang chủ');
      return;
    }

    if (this.f['password'].invalid) {
      this.showError('Trường mật khẩu mới phải có > 5 ký tự');
      return;
    }
    if (this.f['password'].invalid) {
      this.showError('Trường mật khẩu mới phải có > 5 ký tự');
      return;
    }

    this.notificationService.isProcessing(true);
    this.auth.resetPassword({...this.formConfirm.value,password_confirmation : this.f['password'].value}).subscribe(
      {
        next: () => {
          this.notificationService.isProcessing(false);
          this.router.navigateByUrl('/login').then(() => this.notificationService.toastSuccess('Cập nhật mật khẩu mới thành công'));
        },
        error: () => {
          this.notificationService.toastError('Thao tác thất bại');
          this.notificationService.isProcessing(false);
        }
      }
    );
  }

  showError(message: string) {
    if (this.errTimeOut) {
      clearTimeout(this.errTimeOut);
    }
    this.errMessage = message;
    this.errValidateForm = 'showed';
    this.errTimeOut = setTimeout(() => this.errValidateForm = 'hide', 3000);
  }

  btnshow1() {
    this.showPassword1 = this.showPassword1 === 'test' ? 'password' : "test";
  }



}
