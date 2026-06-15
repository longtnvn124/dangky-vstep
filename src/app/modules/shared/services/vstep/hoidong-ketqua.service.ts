import {Injectable} from '@angular/core';
import {getRoute} from "@env";
import {HttpClient, HttpParams} from "@angular/common/http";
import {HttpParamsHeplerService} from "@core/services/http-params-hepler.service";
import {ThemeSettingsService} from "@core/services/theme-settings.service";
import {Observable} from "rxjs";
import {Dto, OvicConditionParam, OvicQueryCondition} from "@core/models/dto";
import {map} from "rxjs/operators";
import {ConditionOption} from "@shared/models/condition-option";
import {OrdersVstep} from "@shared/services/vstep-orders.service";

export interface HoidongKetqua{
  id?: number;
  hoidong_id?: number;
  kehoach_id?: number;
  sobaodanh: string;
  hoten: string;
  gioitinh: string;
  dantoc: string;
  quoctich: string;
  ngaysinh: string;
  phongthi: string;
  listening: string;
  speaking: string;
  reading: string;
  writing: string;
  total: string;
  khung_nlnn: string;
  cccd_so:string;
  vbcc:string;
  ngaythi:string;
}

@Injectable({
  providedIn: 'root'
})
export class HoidongKetquaService {

  private readonly api = getRoute('hoidong-ketqua/');

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

  search(page: number, ten: string, limit: number ): Observable<{ recordsTotal: number, data: HoidongKetqua[] }> {
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

  getDataByPageNew(option: ConditionOption): Observable<{ data: HoidongKetqua[], recordsFiltered: number }> {
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
  deleteByHoidong(id: number, key:string): Observable<any> {
    return this.http.delete(''.concat(this.api, id.toString(10),'?by=',key));
  }



}
