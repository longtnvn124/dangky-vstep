import { Injectable } from '@angular/core';
import {getRoute} from "@env";
import {HttpClient} from "@angular/common/http";
import {HttpParamsHeplerService} from "@core/services/http-params-hepler.service";
import {ThemeSettingsService} from "@core/services/theme-settings.service";
import {AuthService} from "@core/services/auth.service";
import {Observable} from "rxjs";
import {Dto} from "@core/models/dto";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class RegisterUserService {

  // private readonly api = getRoute('register/');
  private readonly api = getRoute('register-user/');

  constructor(
    private http: HttpClient,
    private httpParamsHelper: HttpParamsHeplerService,
    private themeSettingsService: ThemeSettingsService,
    private auth: AuthService
  ) {
  }

  creatUser(data: any): Observable<any> {
    return this.http.post<Dto>(''.concat(this.api), data).pipe(map(res => res));
  }


}
