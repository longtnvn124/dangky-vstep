import {Injectable} from '@angular/core';
import {Dto, OvicConditionParam, OvicQueryCondition} from "@core/models/dto";
import {map, Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {HskKehoachCapdo} from "@shared/services/kehoachthi-capdo.service";
import {ThemeSettingsService} from "@core/services/theme-settings.service";
import {HttpParamsHeplerService} from "@core/services/http-params-hepler.service";
import {getRoute} from "@env";

export interface EmailCheck{
  id: number;
  created_at:string;
  created_by:number;
  deleted_by:number;
  is_deleted: number;
  realm:string;
  seen:number;
  sender:number;
  subject:string;
  to:string;
  updated_at:string;
  updated_by:number;
  user_email:string;
  user_name:string;
}
@Injectable({
  providedIn: 'root'
})
export class MailCheckService {
  private readonly api = getRoute('mail-track/');

  constructor(
    private http: HttpClient,
    private themeSettingsService: ThemeSettingsService,
    private httpParamsHelper:HttpParamsHeplerService
  ) {
  }

  search(page: number, saerch:string): Observable<{ recordsTotal: number, data: EmailCheck[] }> {
    const conditions: OvicConditionParam[] = [

    ];
    if (saerch){
      conditions.push({
        conditionName:'user_email',
        condition:OvicQueryCondition.like,
        value :` %${saerch}%`
      })
    }
    const fromObject = {
      paged: page,
      limit: this.themeSettingsService.settings.rows,
      order: "ASC"
    }
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => ({
      recordsTotal: res.recordsFiltered,
      data: res.data
    })))
  }
}
