import { Injectable } from '@angular/core';
import {getRoute} from "@env";
import {HttpClient, HttpParams} from "@angular/common/http";
import {HttpParamsHeplerService} from "@core/services/http-params-hepler.service";
import {ThemeSettingsService} from "@core/services/theme-settings.service";
import {AuthService} from "@core/services/auth.service";
import {map, Observable} from "rxjs";
import {Dto, OvicConditionParam, OvicQueryCondition} from "@core/models/dto";

import {OvicFile} from "@core/models/file";

export interface HskHuyOrder{
  id?:number;
  hoten:string;
  caphsk_id:number;
  kehoach_id:number;
  order_id:number;
  user_id:number;
  content:string;
  file: OvicFile[];
  state?:number;
}
@Injectable({
  providedIn: 'root'
})
export class HskHuyOrderService {
  private api = getRoute('hsk-huy-order/');
  constructor(
    private http: HttpClient,
    private httpParamsHelper: HttpParamsHeplerService,
    private themeSettingsService: ThemeSettingsService,
    private auth: AuthService
  ) {
  }

  create(data: any): Observable<number> {
    return this.http.post<Dto>(this.api, data).pipe(map(res => res.data));
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put<Dto>(''.concat(this.api, id.toString(10)), data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(''.concat(this.api, id.toString(10)));
  }

  getDataByOrderId(order_id: number): Observable<HskHuyOrder> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'order_id',
        condition: OvicQueryCondition.equal,
        value: order_id.toString(),
      },
    ];
    const fromObject = {
      paged: 1,
      limit: 1,
    }
    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => res.data && res.data[0] ? res.data[0] : null));

  }

  getDataByOrderIdAndType(order_id: number,type:string): Observable<HskHuyOrder[]> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'order_id',
        condition: OvicQueryCondition.equal,
        value: order_id.toString(),
      },
      {
        conditionName: 'type',
        condition: OvicQueryCondition.equal,
        value: type
      },
    ];
    const fromObject = {
      paged: 1,
      limit: -1,
    }
    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => res.data));

  }


  getDataByPageAnd(page :number, search: string ,kekhach_id?: number ,caphsk_id?:number,type?:string): Observable<{ recordsTotal: number, data: HskHuyOrder[] }> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'type',
        condition: OvicQueryCondition.equal,
        value: type,
        orWhere: "and"
      }
    ];

    if(kekhach_id){
      conditions.push({
        conditionName: 'kehoach_id',
        condition: OvicQueryCondition.equal,
        value: kekhach_id.toString(),
        orWhere: "and"
      })
    }
    if(caphsk_id){
      conditions.push({
        conditionName: 'caphsk_id',
        condition: OvicQueryCondition.equal,
        value: caphsk_id.toString(),
        orWhere: "and"
      })
    }

    if(search){
      conditions.push({
        conditionName: 'hoten',
        condition: OvicQueryCondition.like,
        value: `%${search}%`,
        orWhere:"and"
      })
    }

    const fromObject = {
      paged: page,
      limit: this.themeSettingsService.settings.rows,
      orderby: 'id',
      order: "DESC"
    }
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}).set('with','order,thisinh,parent'));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => ({
      recordsTotal: res.recordsFiltered,
      data: res.data
    })))

  }

  getDataUnlimitByKehoachIdAndCapHsk(kekhach_id?: number ,caphsk_id?:number,type?:string): Observable<{ recordsTotal: number, data: HskHuyOrder[] }> {
    const conditions: OvicConditionParam[] = [
    ];
    if(kekhach_id){
      conditions.push({
        conditionName: 'kehoach_id',
        condition: OvicQueryCondition.equal,
        value: kekhach_id.toString(),
        orWhere: "and"
      })
    }
    if(caphsk_id){
      conditions.push({
        conditionName: 'caphsk_id',
        condition: OvicQueryCondition.equal,
        value: caphsk_id.toString(),
        orWhere: "and"
      })
    }
    if(type){
      conditions.push({
        conditionName: 'type',
        condition: OvicQueryCondition.equal,
        value: type,
        orWhere: "and"
      })
    }
    const fromObject = {
      paged: 1,
      limit: -1,
      orderby: 'hoten',
      order: "ASC"
    }
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}).set('with','thisinh,'));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => ({
      recordsTotal: res.recordsFiltered,
      data: res.data
    })))
  }

  ActiveChangeDotthi(id:number):Observable<any>{

    return this.http.post<Dto>(this.api + 'accept-change/' + id, {});
  }
}
