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
export class SummaryService {

  private readonly apiCheck = getRoute('register-check/');


  constructor(
    private http: HttpClient,
    private httpParamsHelper: HttpParamsHeplerService,
  ) {
  }

  check(data: any): Observable<any> {
    return this.http.post<Dto>(this.apiCheck, data).pipe(map(res => res.data));
  }

}
