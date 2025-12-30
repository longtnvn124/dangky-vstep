import { Injectable } from '@angular/core';
import {getRoute} from "@env";
import {HttpClient} from "@angular/common/http";
import {HttpParamsHeplerService} from "@core/services/http-params-hepler.service";
import {Observable} from "rxjs";
import {Dto} from "@core/models/dto";
import {map} from "rxjs/operators";
import {ConditionOption} from "@shared/models/condition-option";

export interface HoidongThisinh {
  id?:number,
  hoidong_id:number,
  kehoach_id:number,
  thisinh_id:number,
  diemduthi_id:number,
  hoten:string,
}

@Injectable({
  providedIn: 'root'
})
export class VstepHoidongThisinhService {
  private readonly api = getRoute('hoidongthi-thisinh/');

  constructor(
    private http: HttpClient,
    private httpParamsHelper: HttpParamsHeplerService,
    ) {}
  create(data: any): Observable<number> {
    return this.http.post<Dto>(this.api, data).pipe(map(res => res.data));
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put<Dto>(''.concat(this.api, id.toString(10)), data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(''.concat(this.api, id.toString(10)));
  }

  getDataByPageNew(option: ConditionOption): Observable<{ data:HoidongThisinh [], recordsFiltered: number }> {
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

  deleteByKey(id:number,key:string): Observable<any> {
    return this.http.delete(''.concat(this.api, id.toString(10),'?by=',key));
  }



}
