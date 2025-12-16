import { Injectable } from '@angular/core';
import {getRoute} from "@env";
import {HttpClient, HttpParams} from "@angular/common/http";
import {HttpParamsHeplerService} from "@core/services/http-params-hepler.service";
import {ThemeSettingsService} from "@core/services/theme-settings.service";
import {AuthService} from "@core/services/auth.service";
import {map, Observable} from "rxjs";

import {Dto, OvicConditionParam, OvicQueryCondition} from "@core/models/dto";

export interface config {
  id?: number;
  config_key:string;
  title:string;
  value:string;
}
@Injectable({
  providedIn: 'root'
})
export class ConfigsService {
  private readonly api = getRoute('configs/');

  constructor(
    private http: HttpClient,
    private httpParamsHelper: HttpParamsHeplerService,
    private themeSettingsService: ThemeSettingsService,
    private auth: AuthService
  ) {
  }
  getdatabyconfig_key(config_key:string):Observable<config>{
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'config_key',
        condition: OvicQueryCondition.like,
        value: config_key
      },
    ];
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions);
    return this.http.get<Dto>(this.api,{params}).pipe(map(res =>res.data[0]));
  }


}
