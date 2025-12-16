import { Injectable } from '@angular/core';
import {map, Observable} from "rxjs";
import {Dto, OvicConditionParam, OvicQueryCondition} from "@core/models/dto";
import {getRoute} from "@env";
import {HttpClient, HttpParams} from "@angular/common/http";
import {HttpParamsHeplerService} from "@core/services/http-params-hepler.service";
import {ThemeSettingsService} from "@core/services/theme-settings.service";

export interface DmPhu{
  id?:number;
  ten:string;
  ma_ngongnu?:string;
  ten_tiengtrung:string;
  ma_quoctich?:string;
}
@Injectable({
  providedIn: 'root'
})
export class DanhMucHskAddToolService {
  private readonly api = getRoute('hsk-ngonngume/');
  private readonly api2 = getRoute('hsk-quoctich/');

  constructor(
    private http: HttpClient,
    private httpParamsHelper: HttpParamsHeplerService,
    private themeSettingsService: ThemeSettingsService){

  }



  create(data: any): Observable<number> {
    return this.http.post<Dto>(this.api, data).pipe(map(res => res.data));
  }
  create2(data: any): Observable<number> {
    return this.http.post<Dto>(this.api2, data).pipe(map(res => res.data));
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put<Dto>(''.concat(this.api, id.toString(10)), data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(''.concat(this.api, id.toString(10)));
  }

  getDataUnlimitByType(type:'quoctich'|'ngonngume'):Observable<DmPhu[]>{
    const conditions: OvicConditionParam[] = [
    ];
    const fromObject = {
      paged: 1,
      limit: -1,
      orderby: 'id',
      order: "ASC"
    }
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    return this.http.get<Dto>(type=== "quoctich"? this.api2 : this.api, {params}).pipe(map(res => res.data));
  }

}
