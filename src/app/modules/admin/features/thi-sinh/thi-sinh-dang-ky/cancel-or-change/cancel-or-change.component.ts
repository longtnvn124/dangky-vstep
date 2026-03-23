import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {OrdersVstep} from "@shared/services/vstep-orders.service";
import {ThiSinhInfo} from "@shared/models/thi-sinh";
import {HskHuyOrderService} from "@shared/services/hsk-huy-order.service";
import {SummaryService} from "@shared/services/summary.service";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {MatProgressBarModule} from "@angular/material/progress-bar";

@Component({
  selector: 'app-cancel-or-change',
  standalone: true,
  imports: [CommonModule, ButtonModule, RippleModule, MatProgressBarModule],
  templateUrl: './cancel-or-change.component.html',
  styleUrls: ['./cancel-or-change.component.css']
})
export class CancelOrChangeComponent implements OnInit {

  @Input() set order( item : OrdersVstep){
    this.orderSelect = {...item};
    this.ngView = 0;
  }
  ngView : 0|-1|1 =1;

  orderSelect: OrdersVstep;

  @Input() type :string =''; //cannel, change
  @Input() userInfo : ThiSinhInfo ;
  constructor(
    private huyOrder: HskHuyOrderService,
    private summaryService : SummaryService
  ) { }

  ngOnInit(): void {
  }

  loadInit(){

  }

  reload(){
    this.loadInit()
  }
}
