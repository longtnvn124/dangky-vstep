import { Injectable } from '@angular/core';
import {getRoute} from "@env";
import {HttpClient, HttpParams} from "@angular/common/http";
import {HttpParamsHeplerService} from "@core/services/http-params-hepler.service";
import {ThemeSettingsService} from "@core/services/theme-settings.service";
import {map, Observable} from "rxjs";
import {Dto, OvicConditionParam, OvicQueryCondition} from "@core/models/dto";
import {ConditionOption} from "@shared/models/condition-option";

export interface DmDiemduthi {
  id?:number,
  title:string,
  status:number,
  mota:string,
  diachi:string,
  map:string,
  ma_diemthi:string,
}

@Injectable({
  providedIn: 'root'
})
export class DmDiemDuThiService {
  private readonly api = getRoute('dm-diemduthi/');

  constructor(
    private http: HttpClient,
    private httpParamsHelper: HttpParamsHeplerService,
    private themeSettingsService: ThemeSettingsService
  ) {
  }

  create(data: any): Observable<number> {
    return this.http.post<Dto>(this.api, data).pipe(map(res => res.data));
  }

  load(page: number): Observable<{ recordsTotal: number, data: DmDiemduthi[] }> {
    const conditions: OvicConditionParam[] = [

    ];
    const fromObject = {
      paged: page,
      limit: this.themeSettingsService.settings.rows,
      orderby: 'tenmon',
      order: "ASC"
    }
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => ({
      recordsTotal: res.recordsFiltered,
      data: res.data
    })))
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put<Dto>(''.concat(this.api, id.toString(10)), data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(''.concat(this.api, id.toString(10)));
  }

  search(page: number, ten: string): Observable<{ recordsTotal: number, data: DmDiemduthi[] }> {
    const conditions: OvicConditionParam[] = [];
    const fromObject = {paged: page, limit: this.themeSettingsService.settings.rows, orderby: 'id', order: 'ASC'};
    if (ten) {
      conditions.push({conditionName: 'tenmon', condition: OvicQueryCondition.like, value: `%${ten}%`, orWhere: 'and'});
    }
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => ({
      recordsTotal: res.recordsFiltered,
      data: res.data
    })));
  }

  getDataByPageNew(option: ConditionOption): Observable<{ data: DmDiemduthi[], recordsFiltered: number }> {
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

}
