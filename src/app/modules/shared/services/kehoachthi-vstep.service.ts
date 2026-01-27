import { Injectable } from '@angular/core';
import {getRoute} from "@env";
import {HttpClient, HttpParams} from "@angular/common/http";
import {HttpParamsHeplerService} from "@core/services/http-params-hepler.service";
import {ThemeSettingsService} from "@core/services/theme-settings.service";
import {map, Observable} from "rxjs";
import {Dto, OvicConditionParam, OvicQueryCondition} from "@core/models/dto";
import {ConditionOption} from "@shared/models/condition-option";
import {DmDiemduthi} from "@shared/services/dm-diem-du-thi.service";

export interface KeHoachThi {
  id: number;
  nam: number;
  title: string;
  ngaybatdau:string;
  ngayketthuc:string;
  diemthi_ids:number[];
  mota: string;
  status: 1 | 0;
  ngaythi:string;
  gia:number;
}

@Injectable({
  providedIn: 'root'
})
export class KehoachthiVstepService {
  private readonly api = getRoute('kehoach-thi/');

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

  search(page: number, ten: string, limit: number ): Observable<{ recordsTotal: number, data: KeHoachThi[] }> {
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

  getDataByPageNew(option: ConditionOption): Observable<{ data: KeHoachThi[], recordsFiltered: number }> {
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

  getYearAndSelect(select:string, limit:number): Observable<KeHoachThi[] > {
    const conditions: OvicConditionParam[] = [
      // {
      //   conditionName:'nam',
      //   condition:OvicQueryCondition.equal,
      //   value:'nam'
      // }
    ];
    const fromObject = {
      paged: 1,
      limit: limit,
      select:select,
      orderby: 'nam',
      groupby: 'nam',
      order: 'DESC'
    };
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({ fromObject }));
    return this.http.get<Dto>(this.api, { params }).pipe(map(res => res.data));
  }

}
