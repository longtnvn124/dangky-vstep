import {Injectable} from '@angular/core';
import {map, Observable} from "rxjs";
import {Dto, OvicConditionParam, OvicQueryCondition} from "@core/models/dto";
import {HttpClient, HttpParams} from "@angular/common/http";
import {getRoute} from "@env";

import {HttpParamsHeplerService} from "@core/services/http-params-hepler.service";
import {ThemeSettingsService} from "@core/services/theme-settings.service";
import {AuthService} from "@core/services/auth.service";
import {SumMonThi} from "@modules/admin/features/thi-sinh/thi-sinh-dang-ky/thi-sinh-dang-ky.component";
import {IctuQueryParams} from "@core/models/ictu-query-params";

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
export class HskOrdersService {

  private api = getRoute('hsk-orders/');

  constructor(
    private http: HttpClient,
    private httpParamsHelper: HttpParamsHeplerService,
    private themeSettingsService: ThemeSettingsService,
    private auth: AuthService
  ) {
  }

  getUserInfo(user_id: number): Observable<OrdersHsk> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'thisinh_id',
        condition: OvicQueryCondition.equal,
        value: user_id.toString(),
      },
      {
        conditionName: 'is_deleted',
        condition: OvicQueryCondition.equal,
        value: '0',
        orWhere: 'and'
      },
    ];
    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions);
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => res.data && res.data[0] ? res.data[0] : null));

  }

  load(page: number, search?: string): Observable<{ recordsTotal: number, data: OrdersHsk[] }> {
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
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => ({
      recordsTotal: res.recordsFiltered,
      data: res.data
    })))

  }

  create(data: any): Observable<number> {
    data['created_by'] = this.auth.user.id;
    return this.http.post<Dto>(this.api, data).pipe(map(res => res.data));
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put<Dto>(''.concat(this.api, id.toString(10)), data);
  }

  delete(id: number): Observable<any> {

    return this.http.delete(''.concat(this.api, id.toString(10)));
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
    const url = text ? ''.concat(getRoute('hsk-orders/return'), text) : this.api;
    return this.http.get<Dto>(url).pipe(map(res => res.data));
  }


  getdata(user_id: number,kehoach_id?:number, trangthai_thanhtoan?:string): Observable<OrdersHsk[]> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'user_id',
        condition: OvicQueryCondition.equal,
        value: user_id.toString(),
      },
    ];
    if(kehoach_id){
      conditions.push({
        conditionName: 'kehoach_id',
        condition: OvicQueryCondition.equal,
        value: kehoach_id.toString(),
      })
    }
    if(trangthai_thanhtoan){
      conditions.push({
        conditionName: 'trangthai_thanhtoan',
        condition: OvicQueryCondition.equal,
        value: trangthai_thanhtoan,
      })
    }
    const fromObject = {
      limit :-1,
      paged:1
    }
    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}).set('with', 'parent'));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => res.data));
  }

  getDataByCreatedBy(user_id: number): Observable<OrdersHsk[]> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'created_by',
        condition: OvicQueryCondition.equal,
        value: user_id.toString(),
      },
      {
        conditionName: 'is_deleted',
        condition: OvicQueryCondition.equal,
        value: '0',
        orWhere: 'and'
      },
    ];
    const fromObject = {}
    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => res.data));
  }

  getDataByIdthisinh(thisinh_id: number): Observable<OrdersHsk[]> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'thisinh_id',
        condition: OvicQueryCondition.equal,
        value: thisinh_id.toString(),
      },
      {
        conditionName: 'is_deleted',
        condition: OvicQueryCondition.equal,
        value: '0',
        orWhere: 'and'
      },
    ];
    const fromObject = {
      paged: 1,
      limit: -1
    }
    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => res.data));
  }

  // getDataByWithThisinh()
  getDataByWithThisinhAndSearchAndPage(page: number, kehoach_id: number, search?: string, status?: number, isThisinh?: boolean): Observable<{
    recordsTotal: number,
    data: OrdersHsk[]
  }> {
    const conditions: OvicConditionParam[] = [];
    if (kehoach_id) {
      conditions.push({
        conditionName: 'kehoach_id',
        condition: OvicQueryCondition.equal,
        value: kehoach_id.toString(),
        orWhere: 'and'
      })
    }
    if (status === 1) {
      conditions.push({
        conditionName: 'trangthai_thanhtoan',
        condition: OvicQueryCondition.equal,
        value: '1',
        orWhere: 'and'
      })
    }
    if (status === 0) {
      conditions.push({
        conditionName: 'trangthai_thanhtoan',
        condition: OvicQueryCondition.notEqual,
        value: '1',
        orWhere: 'and'
      })
    }
    if (isThisinh) {
      conditions.push({
        conditionName: 'thisinh_id',
        condition: OvicQueryCondition.notEqual,
        value: '0',
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
    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}).set('with', 'thisinh'));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => ({
      data: res.data,
      recordsTotal: res.recordsFiltered
    })));
  }

  getDataByKehoachIdAndStatus(kehoach_id: number): Observable<OrdersHsk[]> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'kehoach_id',
        condition: OvicQueryCondition.equal,
        value: kehoach_id.toString(),
      },
      {
        conditionName: 'trangthai_thanhtoan',
        condition: OvicQueryCondition.equal,
        value: '1',
        orWhere: 'and'
      }
    ];
    const fromObject = {

      paged: 1,
      limit: -1,
      orderby: 'status',
      order: "ASC"// dieemr giarm dần,

    }
    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}).set('with', 'thisinh'));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => res.data));
  }

  getdataByNotThisinhIds(paged: number, thisinh_Ids: number[], kehoach_id: number): Observable<{
    data: OrdersHsk[],
    recordsTotal: number
  }> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'kehoach_id',
        condition: OvicQueryCondition.equal,
        value: kehoach_id.toString()
      },
      {
        conditionName: 'trangthai_thanhtoan',
        condition: OvicQueryCondition.equal,
        value: '1',
        orWhere: 'and'
      },
    ];

    const fromObject = {

      paged: paged,
      limit: this.themeSettingsService.settings.rows,
      exclude: thisinh_Ids.join(', '),
      include_by: 'thisinh_id',
      orderby: 'id',
      order: "ASC"// dieemr giarm dần,

    }
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}).set('with', 'thisinh'));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => ({
      recordsTotal: res.recordsFiltered,
      data: res.data
    })))
  }

  activeOrder(ids: number[]): Observable<any> {
    return this.http.post<Dto>(this.api + 'active-order/', {ids: ids});
  }

  getDataByKehoachId(kehoach_id: number): Observable<OrdersHsk[]> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'kehoach_id',
        condition: OvicQueryCondition.equal,
        value: kehoach_id.toString(),
      },

    ];
    const fromObject = {
      paged: 1,
      limit: -1,
      orderby: 'id',
      order: "ASC",// dieemr giarm dần,

    }
    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}).set('with', 'thisinh'));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => res.data));
  }

  getDataBykehoachIdAndStatusUnlimit(kehoach_id: number, unIds ?: number[], type_thanhtoan?: number): Observable<OrdersHsk[]> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'kehoach_id',
        condition: OvicQueryCondition.equal,
        value: kehoach_id.toString(),
      },


    ];
    if (type_thanhtoan === 1) {
      const item: OvicConditionParam = {
        conditionName: 'trangthai_thanhtoan',
        condition: OvicQueryCondition.equal,
        value: '1',
        orWhere: "and"
      }
      conditions.push(item)
    }

    if (type_thanhtoan === 0) {
      const item1: OvicConditionParam = {
        conditionName: 'trangthai_thanhtoan',
        condition: OvicQueryCondition.notEqual,
        value: '1',
        orWhere: "and"
      }

      conditions.push(item1)
    }


    const fromObject = {
      paged: 1,
      limit: -1,
      orderby: 'id',
      order: "ASC",// dieemr giarm dần,
      exclude: unIds.join(','),
      exclude_by: "thisinh_id",


    }
    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}).set('with', 'thisinh'));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => res.data));
  }

  getTotalOrder(): Observable<number> {
    return this.http.get<Dto>(this.api).pipe(map(res => res.recordsFiltered));
  }

  getTotalLephithi(): Observable<number> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'trangthai_thanhtoan',
        condition: OvicQueryCondition.equal,
        value: '1',
      },
      {
        conditionName: 'parent_id',
        condition: OvicQueryCondition.equal,
        value: '0',
      }
    ];
    const fromObject = {
      sum: 'lephithi'
    }
    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => res.data[0]['sum_lephithi']));
  }

  getCountTT(): Observable<number> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'trangthai_thanhtoan',
        condition: OvicQueryCondition.equal,
        value: '1',
      },
      {
        conditionName: 'caphsk_id',
        condition: OvicQueryCondition.notEqual,
        value: '0',
      }
    ];
    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions,);
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => res.recordsFiltered));
  }

  getCountTTbykehoachIds(kehoach_ids: number[], isthisinh?:boolean): Observable<OrdersHsk[]> {
    const conditions: OvicConditionParam[] = [

    ];
    if(isthisinh){
      conditions.push({
        conditionName:'caphsk_id',
        condition:OvicQueryCondition.notEqual,
        value:'0'
      })
    }

    const fromObject = {
      paged: 1,
      limit: -1,
      orderby: 'id',
      order: "ASC",// dieemr giarm dần,
      include: kehoach_ids.join(','),
      include_by: "kehoach_id",
      select: 'id,kehoach_id,trangthai_thanhtoan,caphsk_id',
    }
    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => res.data));
  }


  getDataHavePay(kehoanh_id: number): Observable<OrdersHsk[]> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'kehoach_id',
        condition: OvicQueryCondition.equal,
        value: kehoanh_id.toString(),
        orWhere: "and"
      },

    ];
    const fromObject = {
      paged: 1,
      limit: -1,
      orderby: 'id',
      order: "ASC",// dieemr giarm dần,
      select: 'id,kehoach_id,trangthai_thanhtoan,caphsk_id',
    }
    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => res.data));
  }


   getDataMonSelect(kehoach_id: number): Observable<SumMonThi[]> {
    const conditions: OvicConditionParam[] = [
      // {
      //   conditionName: 'kehoach_id',
      //   condition: OvicQueryCondition.equal,
      //   value: kehoach_id.toString(),
      //   orWhere: "and"
      // },
      // {
      //   conditionName: 'trangthai_thanhtoan',
      //   condition: OvicQueryCondition.equal,
      //   value: '1',
      //   orWhere: "and"
      // },

    ];
    const fromObject = {
      kehoach_id:kehoach_id
    }

    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    // return this.http.get<Dto>(this.api, { params }).pipe(map(res => res.data));
    return this.http.get<Dto>(''.concat(this.api, 'capdo'), {params}).pipe(map(res => res['capdo']));
  }

  getDataByKehoachthiAndPageAndSearch(kehoach_id: number, page: number, caphsk_id?: number, isThisinh?: boolean): Observable<{
    recordsTotal: number,
    data: OrdersHsk[]
  }> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'kehoach_id',
        condition: OvicQueryCondition.equal,
        value: kehoach_id.toString(),
        orWhere: "and"
      },

    ];

    if (caphsk_id) {
      conditions.push({
        conditionName: 'caphsk_id',
        condition: OvicQueryCondition.equal,
        value: caphsk_id.toString(),
        orWhere: "and"
      })
    }

    if (isThisinh) {
      conditions.push({
        conditionName: 'caphsk_id',
        condition: OvicQueryCondition.notEqual,
        value: '0',
        orWhere: "and"
      })
    }
    const fromObject = {
      paged: page,
      limit: this.themeSettingsService.settings.rows,
      orderby: 'id',
      order: "ASC",// dieemr giarm dần,
      select: 'id,kehoach_id,trangthai_thanhtoan,caphsk_id,thisinh_id,lephithi,user_id,parent_id,created_by,updated_by',
    }

    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}).set('with', 'thisinh'));
    // return this.http.get<Dto>(this.api, {params}).pipe(map(res => res));
    return this.http.get<Dto>(this.api, { params }).pipe(map(res => ({
      recordsTotal: res.recordsFiltered,
      data: res.data
    })));
  }

  getDataByKehoachthiAndPageByPageKehoacthi(kehoach_id: number, page: number, caphsk_id?: number, isThisinh?: boolean): Observable<{
    recordsTotal: number,
    data: OrdersHsk[]
  }> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'kehoach_id',
        condition: OvicQueryCondition.equal,
        value: kehoach_id.toString(),
        orWhere: "and"
      },

    ];

    if (caphsk_id) {
      conditions.push({
        conditionName: 'caphsk_id',
        condition: OvicQueryCondition.equal,
        value: caphsk_id.toString(),
        orWhere: "and"
      })
    }

    if (isThisinh) {
      conditions.push({
        conditionName: 'caphsk_id',
        condition: OvicQueryCondition.notEqual,
        value: '0',
        orWhere: "and"
      })
    }
    const fromObject = {
      paged: page,
      limit: this.themeSettingsService.settings.rows,
      orderby: 'id',
      order: "ASC",// dieemr giarm dần,
      select: 'id,kehoach_id,trangthai_thanhtoan,caphsk_id,thisinh_id,lephithi,user_id,parent_id,created_by,updated_by',
    }

    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}).set('with', 'thisinh,huy'));
    // return this.http.get<Dto>(this.api, {params}).pipe(map(res => res));
    return this.http.get<Dto>(this.api, { params }).pipe(map(res => ({
      recordsTotal: res.recordsFiltered,
      data: res.data
    })));
  }

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
          conditionName: 'caphsk_id',
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

  getDataByKehoachIdAndPageAndparentId(kehoach_id: number, page: number, parent_id: number, select: string, user_id: number): Observable<{
    recordsTotal: number,
    data: OrdersHsk[]
  }> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'parent_id',
        condition: OvicQueryCondition.equal,
        value: parent_id.toString(),
      },
      {
        conditionName: 'created_by',
        condition: OvicQueryCondition.equal,
        value: user_id.toString(),
      }
    ];

    if (kehoach_id) {
      conditions.push({
        conditionName: 'kehoach_id',
        condition: OvicQueryCondition.equal,
        value: kehoach_id.toString(),
      })
    }

    const fromObject = {
      paged: page,
      limit: this.themeSettingsService.settings.rows,
      orderby: 'id',
      order: "ASC",// dieemr giarm dần,
      select: select ? select : null

    }

    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}).set('with','children'));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => ({
      recordsTotal: res.recordsFiltered,
      data: res.data
    })));
  }

  getDataByKehoachIdAndPageAndparentIdNotChildren(kehoach_id: number, page: number, parent_id: number, select: string, user_id: number): Observable<{
    recordsTotal: number,
    data: OrdersHsk[]
  }> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'parent_id',
        condition: OvicQueryCondition.equal,
        value: parent_id.toString(),
      },
      {
        conditionName: 'created_by',
        condition: OvicQueryCondition.equal,
        value: user_id.toString(),
      }
    ];

    if (kehoach_id) {
      conditions.push({
        conditionName: 'kehoach_id',
        condition: OvicQueryCondition.equal,
        value: kehoach_id.toString(),
      })
    }

    const fromObject = {
      paged: page,
      limit: this.themeSettingsService.settings.rows,
      orderby: 'id',
      order: "ASC",// dieemr giarm dần,
      select: select ? select : null

    }

    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => ({
      recordsTotal: res.recordsFiltered,
      data: res.data
    })));
  }

  getTotalChildByParentID(parent_id:number,user_id):Observable<number>{
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'parent_id',
        condition: OvicQueryCondition.equal,
        value: parent_id.toString(),
      },
      {
        conditionName: 'created_by',
        condition: OvicQueryCondition.equal,
        value: user_id.toString(),
      }
    ];


    const fromObject = {
      paged: 1,
    }

    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => res.recordsFiltered));
  }


  getDataChildByparentIds(parent_id: number[], select: string): Observable<OrdersHsk[]> {
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
      include_by: 'parent_id'

    }

    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}).set('with', 'user').set('with', 'thisinh'));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => res.data));
  }

  getDataByparentIds(parent_id: number[], select: string): Observable<OrdersHsk[]> {
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

  changeDotthi(id: number, data: any): Observable<any> {
    return this.http.post<Dto>(this.api + 'thay-doi-kehoach/' + id.toString(10), data);
  }

  getTotalItemByCapHskAndKehoachId(caphsk_id: number, kehoach_id: number): Observable<number> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'caphsk_id',
        condition: OvicQueryCondition.equal,
        value: caphsk_id.toString(),
        orWhere: 'and'
      },
      {
        conditionName: 'kehoach_id',
        condition: OvicQueryCondition.equal,
        value: kehoach_id.toString(),
        orWhere: 'and'
      },
      {
        conditionName: 'trangthai_thanhtoan',
        condition: OvicQueryCondition.equal,
        value: '1',
        orWhere: 'and'
      }
    ];
    const fromObject: IctuQueryParams = {
      paged: 1,
      limit: -1,
      select:'id',
    }
    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res=>res.recordsFiltered ));
  }

  // getDataByWithchild()
  getDataByWithChildredAndSearchAndPage(page: number, kehoach_id: number, search?: string, status?: number): Observable<{
    recordsTotal: number,
    data: OrdersHsk[]
  }> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'caphsk_id',
        condition: OvicQueryCondition.notEqual,
        value: '0',
        orWhere: 'and'

      }
    ];
    if (kehoach_id) {
      conditions.push({
        conditionName: 'kehoach_id',
        condition: OvicQueryCondition.equal,
        value: kehoach_id.toString(),
        orWhere: 'and'
      })
    }
    if (status === 1) {
      conditions.push({
        conditionName: 'trangthai_thanhtoan',
        condition: OvicQueryCondition.equal,
        value: '1',
        orWhere: 'and'
      })
    }
    if (status === 0) {
      conditions.push({
        conditionName: 'trangthai_thanhtoan',
        condition: OvicQueryCondition.notEqual,
        value: '1',
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
    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}).set('with', 'thisinh,user'));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => ({
      data: res.data,
      recordsTotal: res.recordsFiltered
    })));
  }

  getDataMonSelectv2(kehoach_id: number): Observable<SumMonThi> {
    const conditions: OvicConditionParam[] = [

    ];
    const fromObject = {
      kehoach_id:kehoach_id
    }

    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder([], new HttpParams({fromObject}));
    return this.http.get<Dto>(''.concat(this.api, 'monthi'), {params}).pipe(map(res => res['monthi']));

  }

  getParentOrder(page: number, kehoach_id: number, search?: string, status?: number): Observable<{
    recordsTotal: number,
    data: OrdersHsk[]
  }> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'parent_id',
        condition: OvicQueryCondition.equal,
        value: '0',
        orWhere: 'and'
      },
      {
        conditionName: 'caphsk_id',
        condition: OvicQueryCondition.equal,
        value: '0',
        orWhere: 'and'
      }
    ];
    if (kehoach_id) {
      conditions.push({
        conditionName: 'kehoach_id',
        condition: OvicQueryCondition.equal,
        value: kehoach_id.toString(),
        orWhere: 'and'
      })
    }
    if (status === 1) {
      conditions.push({
        conditionName: 'trangthai_thanhtoan',
        condition: OvicQueryCondition.equal,
        value: '1',
        orWhere: 'and'
      })
    }
    if (status === 0) {
      conditions.push({
        conditionName: 'trangthai_thanhtoan',
        condition: OvicQueryCondition.notEqual,
        value: '1',
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
    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}).set('with', 'thisinh'));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => ({
      data: res.data,
      recordsTotal: res.recordsFiltered
    })));
  }

  getDataBykehoachIdAndSelectforThongke(kehoach_id: number, select:string, ): Observable<OrdersHsk[]> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'kehoach_id',
        condition: OvicQueryCondition.equal,
        value: kehoach_id.toString(),
      },
      {
        conditionName: 'caphsk_id',
        condition: OvicQueryCondition.notEqual,
        value: '0',
        orWhere:'and'
      },
    ];

    const fromObject = {
      paged: 1,
      limit: -1,
      orderby: 'id',
      order: "ASC",// dieemr giarm dần,
      select:select ? select:'',
    }
    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}).set('with', 'user,thisinh'));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => res.data));
  }

  getDataBykehoachIdAndSelectforThongkeV2(page:number,limit:number,kehoach_id: number, select:string,trangthai_thanhtoan?:string): Observable<{recordsTotal: number, data: OrdersHsk[]}> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'kehoach_id',
        condition: OvicQueryCondition.equal,
        value: kehoach_id.toString(),
      },
      {
        conditionName: 'caphsk_id',
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



  getDataByParentIdAndPage(parent_id: number, page:number,select:string,caphsk_id?:number ): Observable<{
    recordsTotal: number,
    data: OrdersHsk[]
  }> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'parent_id',
        condition: OvicQueryCondition.equal,
        value: parent_id.toString(),
      },
    ];

    if(caphsk_id){
      conditions.push({
        conditionName: 'caphsk_id',
        condition: OvicQueryCondition.equal,
        value: caphsk_id.toString(),
        orWhere : 'and'
      })
    }

    const fromObject = {
      paged: page,
      limit: this.themeSettingsService.settings.rows,
      orderby: 'id',
      order: "ASC",// dieemr giarm dần,
      select:select ? select:'',
    }
    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}).set('with', 'user,thisinh'));

    return this.http.get<Dto>(this.api, {params}).pipe(map(res => ({
      data: res.data,
      recordsTotal: res.recordsFiltered
    })));
  }

  getDataByParentIdAndPageUnlimit(parent_id: number,select:string,caphsk_id?:number ): Observable<OrdersHsk[]> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'parent_id',
        condition: OvicQueryCondition.equal,
        value: parent_id.toString(),
      },
    ];

    if(caphsk_id){
      conditions.push({
        conditionName: 'caphsk_id',
        condition: OvicQueryCondition.equal,
        value: caphsk_id.toString(),
        orWhere : 'and'
      })
    }

    const fromObject = {
      paged: 1,
      limit: -1,
      orderby: 'id',
      order: "ASC",// dieemr giarm dần,
      select:select ? select:'',
    }
    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}).set('with', 'user,thisinh'));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => res.data));
  }

  getdataChangeDptthi(page:number,select:string,caphsk_id?:number,kehoach_id?:number ): Observable<{ recordsTotal: number, data:OrdersHsk[]}>{
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'params',
        condition: OvicQueryCondition.notEqual,
        value: null,
        orWhere : 'and'
      }
    ];

    if(caphsk_id){
      conditions.push({
        conditionName: 'caphsk_id',
        condition: OvicQueryCondition.equal,
        value: caphsk_id.toString(),
        orWhere : 'and'
      })
    }

    if(kehoach_id){
      conditions.push({
        conditionName: 'kehoach_id',
        condition: OvicQueryCondition.equal,
        value: kehoach_id.toString(),
        orWhere : 'and'
      })
    }

    const fromObject = {
      paged: page,
      limit: this.themeSettingsService.settings.rows,
      orderby: 'id',
      order: "ASC",// dieemr giarm dần,
      select:select ? select:'',
    }
    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}).set('with', 'user,thisinh'));

    return this.http.get<Dto>(this.api, {params}).pipe(map(res => ({
      data: res.data,
      recordsTotal: res.recordsFiltered
    })));
  }

  getDataBykehoachIdAndPageAndLimit(page:number , limit:number,kehoach_id:number, trangthai_thanhtoan?:number, select?:string):Observable<any>{

    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'kehoach_id',
        condition: OvicQueryCondition.equal,
        value: kehoach_id.toString(),
      },
    ];

    if(trangthai_thanhtoan == 1){
      conditions.push({
        conditionName: 'trangthai_thanhtoan',
        condition: OvicQueryCondition.equal,
        value: '1',
      })
    }

    const fromObject = {
      paged: page,
      limit: limit,
      select:select ? select : ''
    }
    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}).set('with', 'user'));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => res));
  }

  getdataBykehoachAndUserAndSelectAndTrangthai(user_id: number,kehoach_id?:number, trangthai_thanhtoan?:string,select?:string): Observable<OrdersHsk[]> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'user_id',
        condition: OvicQueryCondition.equal,
        value: user_id.toString(),
      },
    ];
    if(kehoach_id){
      conditions.push({
        conditionName: 'kehoach_id',
        condition: OvicQueryCondition.equal,
        value: kehoach_id.toString(),
      })
    }
    if(trangthai_thanhtoan){
      conditions.push({
        conditionName: 'trangthai_thanhtoan',
        condition: OvicQueryCondition.equal,
        value: trangthai_thanhtoan,
      })
    }
    const fromObject = {
      limit :-1,
      paged:1,
      select:select ? select : '',
    }
    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => res.data));
  }

  getChildrenByPageAndKehoachAndlimitAndselect(page: number,parent_id:number, caphsk: number,limit:number,select?:string): Observable<{
    recordsTotal: number,
    data: OrdersHsk[]
  }> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'parent_id',
        condition: OvicQueryCondition.equal,
        value: parent_id.toString(),
        orWhere: 'and'
      }
    ];
    if(caphsk){
      conditions.push({
        conditionName: 'caphsk_id',
        condition: OvicQueryCondition.equal,
        value: caphsk.toString(),
        orWhere: 'and'
      },)
    }

    const fromObject = {

      paged: page,
      limit: limit,
      orderby: 'id',
      order: "DESC"// dieemr giarm dần DESC
    }
    const params: HttpParams = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}).set('with', 'user,thisinh'));
    return this.http.get<Dto>(this.api, {params});
  }


}
