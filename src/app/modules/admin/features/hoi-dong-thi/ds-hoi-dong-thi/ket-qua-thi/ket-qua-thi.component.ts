import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Paginator} from "primeng/paginator";
import {HskHoidongthi} from "@shared/services/hsk-hoidongthi.service";

@Component({
  selector: 'app-ket-qua-thi',
  templateUrl: './ket-qua-thi.component.html',
  styleUrls: ['./ket-qua-thi.component.css']
})
export class KetQuaThiComponent implements OnInit {
  @ViewChild(Paginator) paginator: Paginator;

  @Input() set hoidong(item: HskHoidongthi) {
    this.loadInit();
  }



  constructor(


  ) {
  }

  ngOnInit(): void {

  }

  loadInit() {


  }



}
