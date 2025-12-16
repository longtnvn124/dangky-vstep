import {Injectable} from '@angular/core';
import {getRoute} from "@env";
import {HttpClient, HttpParams} from "@angular/common/http";
import {HttpParamsHeplerService} from "@core/services/http-params-hepler.service";
import {ThemeSettingsService} from "@core/services/theme-settings.service";
import {map, Observable} from "rxjs";
import {Dto, OvicConditionParam, OvicQueryCondition} from "@core/models/dto";

export interface KeHoachThi {
  id: number;
  nam: number;
  dotthi: string;
  soluong_toida: number;
  ngaybatdau:string;
  ngayketthuc:string;
  mota: string;
  status: 1 | 0;
  ngaythi:string;
}

@Injectable({
  providedIn: 'root'
})
export class HskKehoachThiService {
  private readonly api = getRoute('hsk-kehoach-thi/');

  constructor(
    private http: HttpClient,
    private httpParamsHelper: HttpParamsHeplerService,
    private themeSettingsService: ThemeSettingsService
  ) {
  }

  load(page: number): Observable<{ recordsTotal: number, data: KeHoachThi[] }> {
    const conditions: OvicConditionParam[] = [

    ];
    const fromObject = {
      paged: page,
      limit: this.themeSettingsService.settings.rows,
      orderby: 'dotthi',
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

  search(page: number, ten: string): Observable<{ recordsTotal: number, data: KeHoachThi[] }> {
    const conditions: OvicConditionParam[] = [];
    const fromObject = {
      paged: page,
      limit: this.themeSettingsService.settings.rows,
      orderby: 'id',
      order: 'ASC'
    };
    if (ten) {
      conditions.push({
        conditionName: 'dotthi',
        condition: OvicQueryCondition.like,
        value: `%${ten}%`,
        orWhere: 'and'
      });
    }
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({ fromObject }));
    return this.http.get<Dto>(this.api, { params }).pipe(map(res => ({
      recordsTotal: res.recordsFiltered,
      data: res.data
    })));
  }

  getDataUnlimit(): Observable<KeHoachThi[]> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'status',
        condition: OvicQueryCondition.equal,
        value: '1',
      },
    ];

    const fromObject = {
      paged: 1,
      limit: -1,
      orderby: 'id',
      order: 'ASC'
    };
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({ fromObject }));
    return this.http.get<Dto>(this.api, { params }).pipe(map(res => res.data));
  }
  getDataUnlimitNotstatus(): Observable<KeHoachThi[]> {
    const conditions: OvicConditionParam[] = [
    ];

    const fromObject = {
      paged: 1,
      limit: -1,
      orderby: 'id',
      order: 'ASC'
    };
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({ fromObject }));
    return this.http.get<Dto>(this.api, { params }).pipe(map(res => res.data));
  }



  getDataById(id: number): Observable<KeHoachThi> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'id',
        condition: OvicQueryCondition.equal,
        value: id.toString()
      }

    ];
    const fromObject = {
      paged: 1,
      limit: 1,
      orderby: 'dotthi',
      order: "ASC"
    }
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({ fromObject }));
    return this.http.get<Dto>(this.api, { params }).pipe(map(res => res.data[0]));
  }
  getdataBystatus(status:number): Observable<KeHoachThi[]>{
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'status',
        condition: OvicQueryCondition.equal,
        value: status.toString()
      }

    ];
    const fromObject = {
      orderby: 'id',
      order: "ASC",
      limit:'-1'
    }
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({ fromObject }));
    return this.http.get<Dto>(this.api, { params }).pipe(map(res => res.data));
  }

  getDataUnlimitNotstatusByDESC(): Observable<KeHoachThi[]> {
    const conditions: OvicConditionParam[] = [
    ];

    const fromObject = {
      paged: 1,
      limit: -1,
      orderby: 'id',
      order: 'DESC'
    };
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({ fromObject }));
    return this.http.get<Dto>(this.api, { params }).pipe(map(res => res.data));
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


