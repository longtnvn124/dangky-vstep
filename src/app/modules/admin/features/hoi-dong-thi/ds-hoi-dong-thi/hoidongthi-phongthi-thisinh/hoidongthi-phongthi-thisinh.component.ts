import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Hoidongthi} from "@shared/services/vstep-hoidong-thi.service";

@Component({
  selector: 'app-hoidongthi-phongthi-thisinh',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hoidongthi-phongthi-thisinh.component.html',
  styleUrls: ['./hoidongthi-phongthi-thisinh.component.css']
})
export class HoidongthiPhongthiThisinhComponent implements OnInit {

  @Input() set hoidongthi(a:Hoidongthi){

  }

  _hoidongthi : Hoidongthi = null;

  ngview
  constructor() { }

  ngOnInit(): void {
  }

}
