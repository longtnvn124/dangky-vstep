import { Injectable } from '@angular/core';
import {getRoute} from "@env";
import {HttpClient, HttpParams} from "@angular/common/http";
import {HttpParamsHeplerService} from "@core/services/http-params-hepler.service";
import {ThemeSettingsService} from "@core/services/theme-settings.service";
import {map, Observable} from "rxjs";
import {Dto, OvicConditionParam} from "@core/models/dto";
import {HskKehoachCapdo} from "@shared/services/kehoachthi-capdo.service";
import {OrdersHsk} from "@shared/services/hsk-orders.service";
import {ThiSinhInfo} from "@shared/models/thi-sinh";

@Injectable({
  providedIn: 'root'
})
export class HskSummaryService {
  private readonly api = getRoute('summary/');


  constructor(
    private http: HttpClient,
    private httpParamsHelper: HttpParamsHeplerService,
    private themeSettingsService: ThemeSettingsService
  ) {
  }

  create(data: any): Observable<number> {
    return this.http.post<Dto>(this.api, data).pipe(map(res => res.data));
  }

  // load(page: number): Observable<{ recordsTotal: number, data: HskKehoachCapdo[] }> {
  //   const conditions: OvicConditionParam[] = [
  //
  //   ];
  //   const fromObject = {
  //     paged: page,
  //     limit: this.themeSettingsService.settings.rows,
  //     orderby: 'tenmon',
  //     order: "ASC"
  //   }
  //   const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
  //   return this.http.get<Dto>(this.api, {params}).pipe(map(res => ({
  //     recordsTotal: res.recordsFiltered,
  //     data: res.data
  //   })))
  // }

  getDataByKey(kehoach_id: number ): Observable<number> {
      const fromObject = {
        kehoach_id:kehoach_id ? kehoach_id:'',
      }
      const params = this.httpParamsHelper.paramsConditionBuilder([], new HttpParams({fromObject}));
      return this.http.get<Dto>(this.api +'thi-sinh-duyet', {params}).pipe(map(res => res.data));

  }
  getDsOrderByKehoachId(kehoach_id: number ): Observable<OrdersHsk[]> {
    // const fromObject = {
    //   kehoach_id:kehoach_id ? kehoach_id:'',
    // }
    // const params = this.httpParamsHelper.paramsConditionBuilder([], new HttpParams({fromObject}));
    // return this.http.get<Dto>(this.api +'ds-orders', {params}).pipe(map(res => res.data));
    return this.http.get<Dto>(this.api +'ds-orders/' +kehoach_id).pipe(map(res => res.data));
  }

  getDsThisinhByKehoachId(kehoach_id: number ): Observable<ThiSinhInfo[]> {
    // const fromObject = {
    //   // kehoach_id:kehoach_id ? kehoach_id:'',
    // }
    // const params = this.httpParamsHelper.paramsConditionBuilder([], new HttpParams({fromObject}));
    // return this.http.get<Dto>(this.api +'ds-thisinh/' +kehoach_id , {params}).pipe(map(res => res.data));
    return this.http.get<Dto>(this.api +'ds-thisinh/' +kehoach_id).pipe(map(res => res.data));
  }
  getDataDashboad(nam: number ): Observable<any> {
    const fromObject = {
      nam:nam
      // kehoach_id:kehoach_id ? kehoach_id:'',
    }
    const params = this.httpParamsHelper.paramsConditionBuilder([], new HttpParams({fromObject}));
    return this.http.get<Dto>(this.api +'dashboard/' , {params}).pipe(map(res => res.data));

  }

}
