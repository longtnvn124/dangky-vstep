import { Injectable } from '@angular/core';
import {getRoute} from "@env";
import {HttpClient} from "@angular/common/http";
import {HttpParamsHeplerService} from "@core/services/http-params-hepler.service";
import {ThemeSettingsService} from "@core/services/theme-settings.service";
import {map, Observable} from "rxjs";
import {Dto} from "@core/models/dto";

@Injectable({
  providedIn: 'root'
})
export class HskDoitacCheckService {
  private readonly api = getRoute('register-check/');


  constructor(
    private http: HttpClient,
    private httpParamsHelper: HttpParamsHeplerService,
    private themeSettingsService: ThemeSettingsService
  ) {
  }

  check(data: any): Observable<any> {
    return this.http.post<Dto>(this.api, data).pipe(map(res => res.data));
  }

}
