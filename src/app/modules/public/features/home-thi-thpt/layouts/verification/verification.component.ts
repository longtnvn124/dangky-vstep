import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {RegisterAccountService} from "@shared/services/register-account.service";

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {
  type_check_valid:1|2|3=1;

  constructor(
    private activeRouter:ActivatedRoute,
    private verification:RegisterAccountService,
    private router:Router
  ) { }

  ngOnInit(): void {
    const params: ParamMap = this.activeRouter.snapshot.queryParamMap;
    const object = params.has('code') ? params.get('code') : null;
    if (object){
      this.checkEmail(object);
    }
  }

  checkEmail(text: string){
    this.verification.verifiCationAccountAcpect(text).subscribe({
      next:(data)=>{
        this.type_check_valid =2;
      },error:(e)=>{
        this.type_check_valid =3;
      }
    })
  }

  loginSystems(){
    this.router.navigate(['login/']);
  }
  goHome(){
    this.router.navigate(['']);
  }
}
