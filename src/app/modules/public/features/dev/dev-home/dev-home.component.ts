import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";


// export interface QuestionOnlyA
@Component({
  selector: 'app-dev-home',
  templateUrl: './dev-home.component.html',
  styleUrls: ['./dev-home.component.css']
})
export class DevHomeComponent implements OnInit {

  formSave:FormGroup;
  constructor(
    private fb :FormBuilder,
  ) {
    this.formSave  = this.fb.group({
      questions:[[],Validators.required]
    })
  }

  ngOnInit(): void {
  }

}
