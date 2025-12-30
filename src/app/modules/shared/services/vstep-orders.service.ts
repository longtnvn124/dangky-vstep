import { Injectable } from '@angular/core';
import {getRoute} from "@env";
import {HttpClient, HttpParams} from "@angular/common/http";
import {HttpParamsHeplerService} from "@core/services/http-params-hepler.service";
import {ThemeSettingsService} from "@core/services/theme-settings.service";
import {map, Observable} from "rxjs";
import {Dto, OvicConditionParam, OvicQueryCondition} from "@core/models/dto";
import {ConditionOption} from "@shared/models/condition-option";
import {SumDiemduthi, SumMonThi} from "@modules/admin/features/thi-sinh/thi-sinh-dang-ky/thi-sinh-dang-ky.component";

export interface OrdersVstep {
  id: number;
  thisinh_id: number;
  kehoach_id: number;
  mota: string;
  lephithi: number;
  trangthai_thanhtoan: number;
  sotien_thanhtoan: number;
  thoigian_thanhtoan: string;
  status: 1 | 0;
  diemduthi_id: number;
  trangthai_chuyenkhoan: number;
  parent_id?: number;
  params?: params[];
  user_id?:number;

}

export interface params {
  kehoanh_thi_cu: number,
  kehoanh_thi_moi: number,
  thoigian_sua: string
}
export interface OrdersHsk {
  id: number;
  thisinh_id: number;
  kehoach_id: number;
  mota: string;
  lephithi: number;
  trangthai_thanhtoan: number;
  sotien_thanhtoan: number;
  thoigian_thanhtoan: string;
  status: 1 | 0;
  caphsk_id: number;
  tohop_mon_id: number;
  trangthai_chuyenkhoan: number;
  parent_id?: number;
  params?: params[];
  user_id?:number;

}

export interface params {
  kehoanh_thi_cu: number,
  kehoanh_thi_moi: number,
  thoigian_sua: string
}



@Injectable({
  providedIn: 'root'
})
export class VstepOrdersService {
  private readonly api = getRoute('orders/');

  constructor(
    private http: HttpClient,
    private httpParamsHelper: HttpParamsHeplerService,
    private themeSettingsService: ThemeSettingsService
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

  search(page: number, ten: string, limit: number ): Observable<{ recordsTotal: number, data: OrdersVstep[] }> {
    const conditions: OvicConditionParam[] = [];
    const fromObject = {paged: page, limit: limit.toString(), orderby: 'id', order: 'ASC'};
    if (ten) {
      conditions.push({conditionName: 'tenmon', condition: OvicQueryCondition.like, value: `%${ten}%`, orWhere: 'and'});
    }
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => ({
      recordsTotal: res.recordsFiltered,
      data: res.data
    })));
  }

  getDataByPageNew(option: ConditionOption): Observable<{ data: OrdersVstep[], recordsFiltered: number }> {
    let filter = option.page ? this.httpParamsHelper.paramsConditionBuilder(option.condition).set("paged", option.page) : this.httpParamsHelper.paramsConditionBuilder(option.condition);
    if (option.set && option.set.length)
      option.set.forEach(f => {
        filter = filter.set(f.label, f.value);
      })
    return this.http.get<Dto>(this.api, {params: filter}).pipe(
      map(res => {
        return {data: res.data, recordsFiltered: res.recordsFiltered}
      })
    );
  }
  getPayment(id: number, url: string, orderDescription: string): Observable<any> {
    const conditions: OvicConditionParam[] = [];
    const fromObject = {
      returnUrl: url,
      orderDescription: orderDescription
    }
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    return this.http.get<Dto>(''.concat(this.api, id.toString(10) + '/create-payment-url'), {params}).pipe(map(res => res));
  }

  checkPaymentByUser(text: string): Observable<any> {
    const url = text ? ''.concat(getRoute('orders/return'), text) : this.api;
    return this.http.get<Dto>(url).pipe(map(res => res.data));
  }

  getDataTotalDiemthiByKehoach(kehoach_id: number): Observable<SumDiemduthi[]> {
    const conditions: OvicConditionParam[] = [

    ];
    const fromObject = {
      kehoach_id:kehoach_id
    }

    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    // return this.http.get<Dto>(this.api, { params }).pipe(map(res => res.data));
    return this.http.get<Dto>(''.concat(this.api, 'diemduthi'), {params}).pipe(map(res => res['diemduthi']));
  }

  activeOrder(ids: number[]): Observable<any> {
    return this.http.post<Dto>(this.api + 'active-order/', {ids: ids});
  }


}
