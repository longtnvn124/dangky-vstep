import {Injectable} from '@angular/core';
import {getRoute} from "@env";
import {HttpClient, HttpParams} from "@angular/common/http";
import {HttpParamsHeplerService} from "@core/services/http-params-hepler.service";
import {ThemeSettingsService} from "@core/services/theme-settings.service";
import {Observable} from "rxjs";
import {Dto, OvicConditionParam, OvicQueryCondition} from "@core/models/dto";
import {map} from "rxjs/operators";

export interface HskHoidongKetqua{
  id?: number;
  hoidong_id: number;
  kehoach_id: number;
  caphsk: string;
  ngaythi: string;
  sobaodanh: string;
  hoten: string;
  hoten_tiengtrung: string;
  gioitinh: string;
  quoctich: string;
  tongdiem: string;
  tongmuc: string;
  chitet_diem: string;
  dieukien_dat: string;
  ten_chungchi: string;
  ma_chungchi: string;
  cap_chungchi:string;
  ten_trungtam:string;
  ma_thunghiem:string;
  loaigiayto:string;
  ghichu  // cccd_so:string;
  _dangky:string;
}

@Injectable({
  providedIn: 'root'
})
export class HskHoidongKetquaService {

  private readonly api = getRoute('hsk-hoidong-ketqua/');

  constructor(
    private http: HttpClient,
    private httpParamsHelper: HttpParamsHeplerService,
    private themeSettingsService: ThemeSettingsService
  ) {

  }

  load(page: number): Observable<{ recordsTotal: number, data: HskHoidongKetqua[] }> {
    const conditions: OvicConditionParam[] = [];
    const fromObject = {
      paged: page,
      limit: this.themeSettingsService.settings.rows,
      orderby: 'id',
      order: "ASC"
    }
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => ({
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

  getDatabyKehoach_id(kehoach_id: number): Observable<{ recordsTotal: number, data: HskHoidongKetqua[] }> {
    const conditions: OvicConditionParam[] = [];
    const fromObject = {
      paged: 1,
      limit: this.themeSettingsService.settings.rows,
      orderby: 'id',
      order: "ASC"
    }
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => ({
      recordsTotal: res.recordsFiltered,
      data: res.data
    })))
  }
  getDataByHoidongAndSearch(page:number,hoidong_id: number,search?:string): Observable<{ recordsTotal: number, data: HskHoidongKetqua[] }> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName:'hoidong_id',
        condition:OvicQueryCondition.equal,
        value: hoidong_id.toString()
      }
    ];

    if(search){
      conditions.push({
        conditionName:'hoten',
        condition:OvicQueryCondition.like,
        value: `%${search}%`
      })
    }
    const fromObject = {
      paged: page,
      limit: this.themeSettingsService.settings.rows,
      orderby: 'id',
      order: "ASC"
    }
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => ({
      recordsTotal: res.recordsFiltered,
      data: res.data
    })))
  }

  getdataBythisinhIdAndKehoachId(thisinh_id: number, kehoach_id: number): Observable<HskHoidongKetqua[]> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'thisinh_id',
        condition: OvicQueryCondition.equal,
        value: thisinh_id.toString()
      },
      {
        conditionName: 'kehoach_id',
        condition: OvicQueryCondition.equal,
        value: kehoach_id.toString()
      },
    ];
    const fromObject = {
      paged: 1,
      limit: this.themeSettingsService.settings.rows,
      orderby: 'id',
      order: "ASC"
    }
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => res.data));
  }

  getdataByCccdSoAndKehoachId(cccd_so: string, kehoach_id?: number): Observable<HskHoidongKetqua[]> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'cccd_so',
        condition: OvicQueryCondition.like,
        value: cccd_so.toString()
      },
    ];
    if(kehoach_id){
      conditions.push({
        conditionName: 'kehoach_id',
        condition: OvicQueryCondition.equal,
        value: kehoach_id.toString()
      })
    }
    const fromObject = {
      paged: 1,
      limit: -1,
      orderby: 'id',
      order: "ASC"
    }
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => res.data));
  }

  searchbytextAndHoidongId(page: number, search?: string, hoidong_id?: number): Observable<{
    recordsTotal: number,
    data: HskHoidongKetqua[]
  }> {
    const conditions: OvicConditionParam[] = [];
    if (hoidong_id) {
      conditions.push({
        conditionName: 'hoidong_id',
        condition: OvicQueryCondition.equal,
        value: hoidong_id.toString(),
        orWhere: "and"
      })
    }
    if (search) {
      conditions.push(
        {
          conditionName: 'sobd',
          condition: OvicQueryCondition.like,
          value: `%${search}%`,
          orWhere: 'and'
        },
        {
          conditionName: 'hoten',
          condition: OvicQueryCondition.like,
          value: `%${search}%`,
          orWhere:'or'
        },
        {
          conditionName: 'cccd_so',
          condition: OvicQueryCondition.like,
          value: `%${search}%`,
          orWhere: 'or'
        },
      )
    }
    const fromObject = {
      paged: page,
      limit: this.themeSettingsService.settings.rows,
      orderby: 'id',
      order: "ASC"
    }
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => ({
      recordsTotal: res.recordsFiltered,
      data: res.data
    })))
  }


  getDataUnlimitByHoidongId(hoidong_id:number):Observable<HskHoidongKetqua[]>{
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'hoidong_id',
        condition: OvicQueryCondition.equal,
        value: hoidong_id.toString()
      },
    ];
    const fromObject = {
      paged: 1,
      limit: -1,
      orderby: 'id',
      order: "ASC"
    }
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => res.data));
  }

  getDataUnlimitBycccd_soAnd_ngaysinh(cccd_so:number,ngaysinh:string):Observable<HskHoidongKetqua[]>{
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'cccd_so',
        condition: OvicQueryCondition.equal,
        value: cccd_so.toString()
      },
      {
        conditionName: 'ngaysinh',
        condition: OvicQueryCondition.equal,
        value: ngaysinh.toString()
      },
    ];
    const fromObject = {
      paged: 1,
      limit: -1,
      orderby: 'id',
      order: "ASC"
    }
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => res.data));
  }
  getKehoachByCccd(cccd_so:string):Observable<HskHoidongKetqua[]>{
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'cccd_so',
        condition: OvicQueryCondition.like,
        value: cccd_so.toString()
      },
    ];
    const fromObject = {
      paged: 1,
      limit: -1,
      orderby: 'id',
      order: "ASC",
      groupby:'kehoach_id'
    }
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => res.data));
  }
  deleteByHoidong(id: number, key:string): Observable<any> {
    return this.http.delete(''.concat(this.api, id.toString(10),'?by=',key));
  }



}
