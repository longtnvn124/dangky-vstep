import { Injectable } from '@angular/core';
import { getRoute } from "@env";
import { HttpClient } from "@angular/common/http";
import { HttpParamsHeplerService } from "@core/services/http-params-hepler.service";
import { ThemeSettingsService } from "@core/services/theme-settings.service";
import { AuthService } from "@core/services/auth.service";
import { Observable } from "rxjs";
import { Dto } from "@core/models/dto";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class RegisterAccountService {
  // private readonly api = getRoute('register/');
  private readonly api = getRoute('register-account/');

  constructor(
    private http: HttpClient,
    private httpParamsHelper: HttpParamsHeplerService,
    private themeSettingsService: ThemeSettingsService,
    private auth: AuthService
  ) {
  }

  registerAccount(data: any): Observable<any> {
    return this.http.post<Dto>(''.concat(this.api), data).pipe(map(res => res));
  }


  VerifiCationAccount(id: number, data: any): Observable<any> {
    return this.http.post<Dto>(''.concat(getRoute('verification/'), id.toString(10)), data);
  }

  verifiCationAccountAcpect(text: string): Observable<any> {
    // return this.http.get<Dto>(''.concat(getRoute('verification/'),text),null).pipe(map(res=>res));
    const url = text ? ''.concat(getRoute('verification/'), text) : this.api;
    return this.http.get<Dto>(url).pipe(map(res => res.data));
  }
}
