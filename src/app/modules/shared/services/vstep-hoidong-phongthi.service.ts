import { Injectable } from '@angular/core';
import {getRoute} from "@env";
import {HttpClient} from "@angular/common/http";
import {HttpParamsHeplerService} from "@core/services/http-params-hepler.service";
import {ThemeSettingsService} from "@core/services/theme-settings.service";
import {map, Observable} from "rxjs";
import {Dto} from "@core/models/dto";
import {ConditionOption} from "@shared/models/condition-option";
import {Hoidongthi} from "@shared/services/vstep-hoidong-thi.service";

export interface HoidongPhongthi {
  id?:number,
  hoidong_id,
  diemduthi_id:number,
  soluong:number,
  giangvien:string,
  phongthi:string,

}
@Injectable({
  providedIn: 'root'
})
export class VstepHoidongPhongthiService {
  private readonly api = getRoute('hoidongthi-phongthi/');

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
  deleteByKey(id:number,key:string): Observable<any> {
    return this.http.delete(''.concat(this.api, id.toString(10),'?by=',key));
  }


  getDataByPageNew(option: ConditionOption): Observable<{ data:HoidongPhongthi [], recordsFiltered: number }> {
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
