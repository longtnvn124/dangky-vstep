import { Injectable } from '@angular/core';
import {Dto, OvicConditionParam, OvicQueryCondition} from "@core/models/dto";
import {Observable} from "rxjs";
import {getRoute} from "@env";
import {HttpClient, HttpParams} from "@angular/common/http";
import {HttpParamsHeplerService} from "@core/services/http-params-hepler.service";
import {ThemeSettingsService} from "@core/services/theme-settings.service";
import {AuthService} from "@core/services/auth.service";
import {map} from "rxjs/operators";

export interface HskOrdersShip {
  id?:number;
  nguoinhan_hoten:string;
  thisinh_hoten:string;
  nguoinhan_diachi:string;
  nguoinhan_phone:string;
  trangthai_thanhtoan:number;
  thisinh_id:number;
  kehoach_id:number;
  params:ShipParams[];
  lephithi:number;
  thoigian_thanhtoan:string;
  mota:string;
  caphsk_id:number;
  sobaodanh:string;
}

export interface ShipParams{
  // monthi:string;
  // soluong_phieu:number;
  title:string;
  value:number;
  isChange:number;
  soluong:1;
  key:number;
  monthi:string;

}

@Injectable({
  providedIn: 'root'
})
export class HskOrdersShipService {

  private api = getRoute('hsk-orders-ship/');

  constructor(
    private http: HttpClient,
    private httpParamsHelper: HttpParamsHeplerService,
    private themeSettingsService: ThemeSettingsService,
    private auth: AuthService
  ) { }

  getUserInfo(user_id: number): Observable<HskOrdersShip> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'thisinh_id',
        condition: OvicQueryCondition.equal,
        value: user_id.toString(),
      },

    ];
    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions);
    return this.http.get<Dto>(this.api, { params }).pipe(map(res => res.data && res.data[0] ? res.data[0] : null));

  }

  load(page: number, search?: string): Observable<{ recordsTotal: number, data: HskOrdersShip[] }> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'is_deleted',
        condition: OvicQueryCondition.equal,
        value: '0'
      },
    ];
    if (search) {
      conditions.push({
        conditionName: 'hoten',
        condition: OvicQueryCondition.like,
        value: `%${search}%`,
        orWhere: "and"
      })
    }
    const fromObject = {
      paged: page,
      limit: this.themeSettingsService.settings.rows,
      orderby: 'user_id',
      order: "ASC"
    }
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({ fromObject }));
    return this.http.get<Dto>(this.api, { params }).pipe(map(res => ({
      recordsTotal: res.recordsFiltered,
      data: res.data
    })))

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

  getDataByCCCD(thisinh_id:number,page:number,select?:string):Observable<{ recordsTotal: number, data: HskOrdersShip[] }>{

    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'thisinh_id',
        condition: OvicQueryCondition.equal,
        value: thisinh_id.toString()
      },
    ];
    const fromObject = {
      paged: page,
      limit: this.themeSettingsService.settings.rows,
      orderby: 'id',
      order: "ASC",
      select:select ? select: '',
    }
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({ fromObject }));
    return this.http.get<Dto>(this.api, { params }).pipe(map(res => ({
      recordsTotal: res.recordsFiltered,
      data: res.data
    })))

  }

  getPayment(id: number, url: string, orderDescription:string): Observable<any> {
    const conditions: OvicConditionParam[] = [

    ];
    const fromObject = {
      returnUrl: url,
      orderDescription:orderDescription
    }
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({ fromObject }));
    return this.http.get<Dto>(''.concat(this.api, id.toString(10) + '/create-payment-url'), { params }).pipe(map(res => res.data));
  }
  checkPaymentByUser(text: string): Observable<any> {
    // const url = text ? ''.concat(getRoute('thpt-orders-ship/return'), text) : this.api;
    const url = text ? ''.concat(getRoute('thpt-orders/return'), text) : this.api;
    return this.http.get<Dto>(url).pipe(map(res => res.data));
  }

  getDataByWithThisinhAndSearchAndPage(page: number, kehoach_id: number, search?: string, status?:string): Observable<{ recordsTotal: number, data: HskOrdersShip[] }> {
    const conditions: OvicConditionParam[] = [
    ];
    if (kehoach_id) {
      conditions.push({
        conditionName: 'kehoach_id',
        condition: OvicQueryCondition.equal,
        value: kehoach_id.toString(),
        orWhere: 'and'
      })
    }
    if(status){
      conditions.push({
        conditionName: 'trangthai_thanhtoan',
        condition: OvicQueryCondition.equal,
        value: status,
        orWhere: 'and'
      })
    }


    const fromObject = {
      search: search ? search : '',
      paged: page,
      limit: this.themeSettingsService.settings.rows,
      orderby: 'id',
      order: "DESC"// dieemr giarm dần DESC
    }
    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({ fromObject }).set('with', 'thisinh'));
    return this.http.get<Dto>(this.api, { params }).pipe(map(res => ({ data: res.data, recordsTotal: res.recordsFiltered })));
  }

  getDataByKehoachId(kehoach_id: number, haveThanhtoan?:string): Observable<HskOrdersShip[]> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'kehoach_id',
        condition: OvicQueryCondition.equal,
        value: kehoach_id.toString(),
      },
    ];

    if(haveThanhtoan){
      conditions.push(
        {
          conditionName: 'trangthai_thanhtoan',
          condition: OvicQueryCondition.equal,
          value: haveThanhtoan,
        }
      )
    }

    const fromObject = {
      paged: 1,
      limit: -1,
      orderby: 'id',
      order: "ASC",// dieemr giarm dần,

    }
    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({ fromObject }).set('with', 'thisinh'));
    return this.http.get<Dto>(this.api, { params }).pipe(map(res => res.data));
  }


  sendMinhchung(id: number, data: any): Observable<any> {
    return this.http.post<Dto>(''.concat(this.api , id.toString(10) ,`/verification`), data);
  }

  activeShip(id:number):Observable<any>{
    return this.http.post<Dto>(this.api +'active-order/', {ids: [id]});
  }
  cancelShip(id:number):Observable<any>{
    return this.http.post<Dto>(this.api +'cancel-order/', {ids: [id]});
  }
}
