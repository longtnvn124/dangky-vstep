import { Injectable } from '@angular/core';
import {getRoute} from "@env";
import {HttpClient} from "@angular/common/http";
import {HttpParamsHeplerService} from "@core/services/http-params-hepler.service";
import {map, Observable} from "rxjs";
import {Dto} from "@core/models/dto";
import {ConditionOption} from "@shared/models/condition-option";


export interface HoidongPhongthiThisinh {
  id                  ?: number;
  hoidong_id          : number;
  kehoach_id          : number;
  hoidong_phongthi_id : number;
  diemduthi_id        : number;
  thisinh_id          : number;
  user_id             : number;
}
@Injectable({
  providedIn: 'root'
})
export class VstepHoidongPhongthiThisinhService {
  private readonly api = getRoute('hoidongthi-phongthi-thisinh/');

  constructor(
    private http: HttpClient,
    private httpParamsHelper: HttpParamsHeplerService,
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


  getDataByPageNew(option: ConditionOption): Observable<{ data:HoidongPhongthiThisinh [], recordsFiltered: number }> {
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
  // deleltePhongthi(hoidong_id:number,diemduthi_id:number): Observable<any>{
  //
  //   return this.http.delete(''.concat(this.api,'xoa-phongthi/',hoidong_id.toString(),'/' ,diemduthi_id.toString()))
  // }
}
