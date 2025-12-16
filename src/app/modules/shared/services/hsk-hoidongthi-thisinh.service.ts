import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {HttpParamsHeplerService} from "@core/services/http-params-hepler.service";
import {ThemeSettingsService} from "@core/services/theme-settings.service";
import {Observable} from "rxjs";
import {Dto, OvicConditionParam, OvicQueryCondition} from "@core/models/dto";
import {getRoute} from "@env";
import {map} from "rxjs/operators";

export interface HskHoidongthiThiSinh {
  id?:number;
  hoidong_id:number;
  kehoach_id;
  sobaodanh:string;
  hoten:string;
  hoten_tiengtrung:string;
  gioitinh:string;
  loai_giayto:string;
  cccd_so:string;
  ngaysinh:string;
  quoctich:string;
  ngonngu_me:string;
  trangthai_dangky:string;
  phone:string;
  email:string;
  diachi:string;
  caphsk:string;
  thoigian_duthi:string;
  loai_ungvien:string;
  quoctich_ungvien:string;
  phongthi:string;
  thoigian_dangky:string;
  loai_dangky:string;
  trungtam_duthi:string;
  loai_duthi:string;
  trungtam_ghichu:string;
  ungvien_ghichu:string;
  phienbanthi:string;
  ngongu_thieuso:string;
  loai_kiemtra:string;
}
@Injectable({
  providedIn: 'root'
})


export class HskHoidongthiThisinhService {
  private readonly api = getRoute('hsk-hoidongthi-thisinh/');

  constructor(
    private http: HttpClient,
    private httpParamsHelper: HttpParamsHeplerService,
    private themeSettingsService: ThemeSettingsService
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

  search(page: number, search: string): Observable<{ recordsTotal: number, data: HskHoidongthiThiSinh[] }> {
    const conditions: OvicConditionParam[] = [];

    if (search) {
      conditions.push({
        conditionName: 'hoten',
        condition: OvicQueryCondition.like,
        value: `%${search}%`,
        orWhere: 'and'
      });
    }

    const fromObject = {
      paged: page,
      limit: this.themeSettingsService.settings.rows,
      orderby: 'id',
      order: 'ASC'
    };
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => ({
      recordsTotal: res.recordsFiltered,
      data: res.data
    })));
  }

  getTotalThisinh(hoidong_id:number): Observable<number> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName:'hoidong_id',
        condition : OvicQueryCondition.equal,
        value:hoidong_id.toString()
      }
    ];

    const fromObject = {
    };
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => res.recordsTotal));
  }

  getDataByHoidongAndSearch(page: number,hoidong_id:number, search?: string, limit?:number): Observable<{ recordsTotal: number, data: HskHoidongthiThiSinh[] }> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'hoidong_id',
        condition: OvicQueryCondition.equal,
        value: hoidong_id.toString(),
        orWhere: 'and'
      }
    ];

    if (search) {
      conditions.push({
        conditionName: 'hoten',
        condition: OvicQueryCondition.like,
        value: `%${search}%`,
        orWhere: 'and'
      });
    }

    const fromObject = {
      paged: page,
      limit: limit ? limit: this.themeSettingsService.settings.rows,
      orderby: 'id',
      order: 'ASC'
    };
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => ({
      recordsTotal: res.recordsFiltered,
      data: res.data
    })));
  }

  getPhongthiByHoidongAndSearch(page: number,hoidong_id:number): Observable<HskHoidongthiThiSinh[] > {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'hoidong_id',
        condition: OvicQueryCondition.equal,
        value: hoidong_id.toString(),
        orWhere: 'and'
      }
    ];

    const fromObject = {
      paged: 1,
      limit: -1,
      groupby:'phongthi'
    };
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => res.data));
  }

  deleteByHoidong(id: number, key:string): Observable<any> {
    return this.http.delete(''.concat(this.api, id.toString(10),'?by=',key));
  }


  getDataByHoidongAndGroundBy(hoidong_id,groupby:string,select:string): Observable<HskHoidongthiThiSinh[] > {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'hoidong_id',
        condition: OvicQueryCondition.equal,
        value: hoidong_id.toString(),
        orWhere: 'and'
      }
    ];

    const fromObject = {
      paged: 1,
      limit: -1,
      groupby:groupby,
      select:select
    };
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => res.data));
  }

  getDataByHoidongAndPhongthiAndGroundBy(hoidong_id,phongthi:string,groupby:string,select:string): Observable<HskHoidongthiThiSinh[] > {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'hoidong_id',
        condition: OvicQueryCondition.equal,
        value: hoidong_id.toString(),
        orWhere: 'and'
      },
      {
        conditionName: 'phongthi',
        condition: OvicQueryCondition.equal,
        value: phongthi,
        orWhere: 'and'
      }
    ];

    const fromObject = {
      paged: 1,
      limit: -1,
      groupby:groupby,
      select:select
    };
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => res.data));
  }

  getdataByhoidongAndphongthiAndcapthiAndthoigian(hoidong_id: number, phongthi?:string,caphsk?:string,thoigian_duthi?:string): Observable<HskHoidongthiThiSinh[]> {
    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'hoidong_id',
        condition: OvicQueryCondition.equal,
        value: hoidong_id.toString(),
      },



    ];

    if(phongthi){
      conditions.push(
        {
          conditionName: 'phongthi',
          condition: OvicQueryCondition.equal,
          value: phongthi,
        },
      )
    }
    if(caphsk){
      conditions.push(
        {
          conditionName: 'caphsk',
          condition: OvicQueryCondition.equal,
          value: caphsk,
        },
      )
    }

    if(thoigian_duthi){
      conditions.push(
        {
          conditionName: 'thoigian_duthi',
          condition: OvicQueryCondition.equal,
          value: thoigian_duthi,
        },
      )
    }



    const fromObject = {
      paged: 1,
      limit: -1,
      orderby: 'id',
      order: 'ASC'
    };
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => res.data));
  }

  getTotalThisinhByhoidongAndPhongthiAndCapthi(hoidong_id:number,phongthi:string,caphsk:string):Observable<number>{

    const conditions: OvicConditionParam[] = [
      {
        conditionName: 'hoidong_id',
        condition: OvicQueryCondition.equal,
        value: hoidong_id.toString(),
      },
      {
        conditionName: 'phongthi',
        condition: OvicQueryCondition.equal,
        value: phongthi,
      },
      {
        conditionName: 'caphsk',
        condition: OvicQueryCondition.equal,
        value: caphsk,
      }

    ];



    const fromObject = {
    };
    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));
    return this.http.get<Dto>(this.api, {params}).pipe(map(res => res.recordsFiltered));
  }


}
