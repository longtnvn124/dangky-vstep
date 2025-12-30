import { Injectable } from '@angular/core';
import {getRoute} from "@env";
import {HttpClient, HttpParams} from "@angular/common/http";
import {HttpParamsHeplerService} from "@core/services/http-params-hepler.service";
import {ThemeSettingsService} from "@core/services/theme-settings.service";
import {AuthService} from "@core/services/auth.service";
import {Observable} from "rxjs";
import {Dto, OvicConditionParam, OvicQueryCondition} from "@core/models/dto";
import {map} from "rxjs/operators";
export interface DanhMucDoiTuong{
  id?:number;
  doituong:string;
  mota:string;
  status:number;
}
@Injectable({
  providedIn: 'root'
})
export class DanhMucDoituongUutienService {

  private readonly api = getRoute('dm-doituong-uutien/');
  constructor(
    private http: HttpClient,
    private httpParamsHelper: HttpParamsHeplerService,
    private themeSettingsService: ThemeSettingsService,
    private auth: AuthService
  ) { }

  load(page: number, search?:string): Observable<{ recordsTotal: number, data: DanhMucDoiTuong[] }> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'is_deleted',
        condition: OvicQueryCondition.equal,
        value: '0'
      },
    ];

    if(search){
      const c1:OvicConditionParam[]=[
        {
          conditionName: 'ten',
          condition: OvicQueryCondition.like,
          value: `%${search}%`,
          orWhere:'and'
        }
      ]
      conditions.push(...c1);
    }
    const fromObject = {
      paged: page,
      limit: this.themeSettingsService.settings.rows,
      orderby: 'id',
      order: "ASC"
    }
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({ fromObject }));
    return this.http.get<Dto>(this.api, { params }).pipe(map(res => ({ recordsTotal: res.recordsFiltered, data: res.data })))
  }

  create(data: any): Observable<number> {
    data['created_by'] = this.auth.user.id;
    return this.http.post<Dto>(this.api, data).pipe(map(res => res.data));
  }
  update(id: number, data: any): Observable<any> {
    data['updated_by'] = this.auth.user.id;
    return this.http.put<Dto>(''.concat(this.api, id.toString(10)), data);
  }
  delete(id: number): Observable<any> {
    return this.http.delete(''.concat(this.api, id.toString(10)));
  }
  getdataUnlimit():Observable<DanhMucDoiTuong[]>{
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'status',
        condition: OvicQueryCondition.equal,
        value: '1'
      },
    ];


    const fromObject = {
      paged: 1,
      limit: -1,
      orderby: 'id',
      order: "ASC"
    }
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({ fromObject }));
    return this.http.get<Dto>(this.api, { params }).pipe(map(res => res.data ));
  }
}
