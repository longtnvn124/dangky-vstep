import {HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {getRoute} from "@env";
import {Observable} from "rxjs";
import {Dto} from "@core/models/dto";
import {map} from "rxjs/operators";

export interface SystemConfig {
  id : number;
  config_key : string;
  title : string;
  value : number; // 0 : off | 1 : on
  created_by : number;
  updated_by : number;
  created_at : string;
  updated_at: string;
  params?: any;
}
@Injectable({
  providedIn: 'root'
})
export class SysConfigsService {

  private readonly api : string = getRoute( 'configs/' );

  constructor( private http : HttpClient ) {
  }

  getAppConfigs( select : string = '' ) : Observable<SystemConfig[]> {
    // return environment.production ? this.http.get<Dto>( this.api ).pipe( map( r => r.data ) ) : of( [] );
    const params : HttpParams = select ? new HttpParams().set( 'select' , select ) : new HttpParams();
    return this.http.get<Dto>( this.api , { params } ).pipe( map( r => r.data ) );
  }
}
