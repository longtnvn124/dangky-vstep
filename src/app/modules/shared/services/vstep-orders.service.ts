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
  is_child_payment?: number;

  capthi:string,
  trangthai_duyet:number;
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
  // ------------------------------------------------------------------------------
  getDataByKehoachIdAndNotwidthXuatdanhSach(kehoach_id: number,  isThisinh?: boolean, trangthai_thanhtoan?:number): Observable<OrdersHsk[]> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'kehoach_id',
        condition: OvicQueryCondition.equal,
        value: kehoach_id.toString(),
      },

    ];
    if (isThisinh) {
      conditions.push(
        {
          conditionName: 'diemduthi_id',
          condition: OvicQueryCondition.notEqual,
          value: '0',
          orWhere: "and"
        },
      )
    }
    if (trangthai_thanhtoan === 1) {
      conditions.push(
        {
          conditionName: 'trangthai_thanhtoan',
          condition: OvicQueryCondition.equal,
          value: '1',
          orWhere: "and"
        },
      )
    }
    const fromObject = {
      paged: 1,
      limit: -1,
      orderby: 'id',
      order: "ASC",// dieemr giarm dần,

    }
    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}).set('with','huy'));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => res.data));
  }

  getDataBykehoachIdAndSelectforThongkeV2(page:number,limit:number,kehoach_id: number, select:string,trangthai_thanhtoan?:string): Observable<{recordsTotal: number, data: OrdersVstep[]}> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'kehoach_id',
        condition: OvicQueryCondition.equal,
        value: kehoach_id.toString(),
      },
      {
        conditionName: 'diemduthi_id',
        condition: OvicQueryCondition.notEqual,
        value: '0',
        orWhere:'and'
      },
    ];
    if( trangthai_thanhtoan && trangthai_thanhtoan == '1'){
      conditions.push({
        conditionName: 'trangthai_thanhtoan',
        condition: OvicQueryCondition.equal,
        value: '1',
        orWhere:'and'
      })
    }
    if( trangthai_thanhtoan &&trangthai_thanhtoan ==  '0'){
      conditions.push({
          conditionName: 'trangthai_thanhtoan',
          condition: OvicQueryCondition.notEqual,
          value: '1',
          orWhere:'and'
        }
      )
    }

    const fromObject = {
      paged: page,
      limit: limit,
      orderby: 'id',
      order: "ASC",// dieemr giarm dần,
      select:select ? select:'',
    }
    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}).set('with', 'user,thisinh'));
    return this.http.get<Dto>(this.api, {params});
  }

  getDataByparentIds(parent_id: number[], select: string): Observable<OrdersVstep[]> {
    const conditions: OvicConditionParam[] = [
      // {
      //   conditionName: 'parent_id',
      //   condition: OvicQueryCondition.equal,
      //   value: parent_id.toString(),
      // },

    ];

    const fromObject = {
      paged: 1,
      limit: -1,
      orderby: 'id',
      order: "ASC",// dieemr giarm dần,
      select: select ? select : null,
      include: parent_id.join(','),
      include_by: 'id'

    }

    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}).set('with','user,thisinh'));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => res.data));
  }


  // ------------------------------------new --------------------------------------
  getPaymentV2(id: number): Observable<any> {
    const conditions: OvicConditionParam[] = [];
    const fromObject = {
      // returnUrl: url,
      // orderDescription: orderDescription
    }
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    return this.http.get<Dto>(''.concat(this.api, id.toString(10) + '/create-payment-url'), {params}).pipe(map(res => res));
  }
  checkPaymentV2(token:string):Observable<any>{
    const conditions: OvicConditionParam[] = [];
    const fromObject = {
      // returnUrl: url,
      // orderDescription: orderDescription
    }
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    return this.http.get<Dto>(''.concat(this.api, 'payment-check/',token), {params}).pipe(map(res => res));
  }




}
