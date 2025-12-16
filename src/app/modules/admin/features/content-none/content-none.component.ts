import { Component , OnInit } from '@angular/core';
import {Moment} from "moment";
import {AuthService} from "@core/services/auth.service";

@Component( {
	selector    : 'app-content-none' ,
	templateUrl : './content-none.component.html' ,
	styleUrls   : [ './content-none.component.css' ]
} )
export class ContentNoneComponent implements OnInit {

  path: string = '/admin';
	constructor(
    private  auth : AuthService
  ) {
    if(this.auth.roles.find(r=>r.name === 'doitac_hsk')){
      this.path= '/admin/doi-tac/dang-ky-thi-sinh';
    }else if(this.auth.roles.find(r=>r.name === 'admin_hsk')){
      this.path= '/admin/dashboard';
    }else{
      this.path='/admin/thi-sinh/dang-ky';
    }
	}

	ngOnInit() : void {

	}
}
