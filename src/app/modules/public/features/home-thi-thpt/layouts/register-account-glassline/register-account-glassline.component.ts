import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { RegisterAccountService } from '@shared/services/register-account.service';
import { RegisterAccountComponent } from '../register-account/register-account.component';

@Component({
  selector: 'app-register-account-glassline',
  templateUrl: './register-account-glassline.component.html',
  styleUrls: ['./register-account-glassline.component.css']
})
export class RegisterAccountGlasslineComponent extends RegisterAccountComponent {
  constructor(
    fb: FormBuilder,
    auth: AuthService,
    registerAccountService: RegisterAccountService,
    router: Router,
    notification: NotificationService
  ) {
    super(fb, auth, registerAccountService, router, notification);
  }
}
