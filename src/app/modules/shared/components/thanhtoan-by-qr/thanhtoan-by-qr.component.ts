import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from "@shared/shared.module";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {interval, merge, Observable, Subject, takeUntil} from "rxjs";
import {User} from "@core/models/user";
import {ThiSinhInfo} from "@shared/models/thi-sinh";
import {OrdersVstep, VstepOrdersService} from "@shared/services/vstep-orders.service";
import {NotificationService} from "@core/services/notification.service";
import {AuthService} from "@core/services/auth.service";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";

interface ResultData {
  "checkout_url"  : string;
  "token_code"    : string;
  "qrcode"        : string;
}

@Component({
  selector: 'app-thanhtoan-by-qr',
  standalone: true,
  imports: [CommonModule, SharedModule, MatProgressBarModule, ButtonModule, RippleModule],
  templateUrl: './thanhtoan-by-qr.component.html',
  styleUrls: ['./thanhtoan-by-qr.component.css']
})
export class ThanhtoanByQrComponent implements OnInit {


  @Input() set order(item: OrdersVstep){
    this._order = item;
    this.loadInit()
  }

  check :number = 3;
  @Input() content : string = 'DK HSK';

  @Input() remainingTime : number = 30*60; //phút

  ngType:'error' |'loading' |'getQr' |'timeUp'|'result' = "loading";

  _order:OrdersVstep;
  @Input() userInfo : ThiSinhInfo;
  @Input() type:'thisinh'|'doitac' = 'thisinh';

  destroy$: Subject<string> = new Subject<string>();
  timeCloser$: Subject<string> = new Subject<string>();

  remainingTimeClone: number = 0; // 30 minutes in seconds
  isTimeOver:boolean =false;
  resultData:ResultData;

  authInfo:User;

  datacheck:{result_code:string,result_data:ResultData,result_message:string};
  errorCodeMap: { label: string, value: string }[] = [
    {label: "0000", value: "Thành công"},
    {label: "0001", value: "Lỗi không xác định"},
    {label: "0002", value: "Tên hàm không hợp lệ"},
    {label: "0003", value: "Merchant_site_code không hợp lệ"},
    {label: "0004", value: "Version không hợp lệ"},
    {label: "0005", value: "Order_code không hợp lệ"},
    {label: "0006", value: "Order_description không hợp lệ"},
    {label: "0007", value: "Định dạng số tiền không hợp lệ (Nên để định dạng float, Ví dụ: 10000.00)"},
    {label: "0008", value: "Loại tiền tệ không hợp lệ"},
    {label: "0009", value: "Buyer fullname không hợp lệ"},
    {label: "0010", value: "Buyer_email không hợp lệ"},
    {label: "0011", value: "Buyer_mobile không hợp lệ"},
    {label: "0012", value: "Buyer_address không hợp lệ"},
    {label: "0013", value: "Return_url không hợp lệ"},
    {label: "0014", value: "Cancel_url không hợp lệ"},
    {label: "0015", value: "Notify_url không hợp lệ"},
    {label: "0016", value: "Time_limit không hợp lệ"},
    {label: "0017", value: "Mã checksum không hợp lệ"},
    {label: "0018", value: "Token_code không hợp lệ"},
    {label: "0027", value: "Currency không hợp lệ"},
    {label: "0101", value: "Dữ liệu truyền lên đúng, nhưng không thể tạo đơn hàng cho merchant này"},
    {label: "0102", value: "Hủy giao dịch thất bại. Trạng thái đơn hàng không hợp lệ!"}
  ];

  constructor(
    private ordersService:VstepOrdersService,
    private notifi:NotificationService,
    private auth:AuthService,
  ) {
    this.authInfo = this.auth.user
  }

  ngOnDestroy(): void {
    this.destroy$.next('closed');
    this.destroy$.complete();
    this.timeCloser$.next('close');
    this.timeCloser$.complete();
  }

  ngOnInit(): void {
  }


  loadInit(){
    this.ngType = 'loading';
    this.remainingTimeClone =this.remainingTime;

    this.ordersService.getPaymentV2(this._order.id).subscribe({
      next:({data})=>{
        this.resultData = data['result_data'];
        this.ngType= "getQr";
        this.startTimer(this.remainingTimeClone);

        // this.ngType= "timeUp";
        // this.check = 12;


      },error:(e)=>{
        console.log(e)
        // this.ngType = 'getQr';
        this.ngType = 'error';
        // this.notifi.toastError(e['error']['message']);
      }
    })

  }

  startTimer(remainingTime: number): void {
    const closer$: Observable<string> = merge(
      this.destroy$,
      this.timeCloser$
    );

    // this.mode = 'PANEL';

    let couter = 0;
    const perious = Math.floor(Math.random() * 5) + 1;
    interval(1000).pipe(takeUntil(closer$)).subscribe(() => {
      if (remainingTime > 0) {
        remainingTime--;
        this.remainingTimeClone = Math.max(remainingTime, 0);
      } else {
        this.remainingTimeClone = 0;
        this.stopTimer();
        this.isTimeOver = true;
        // this.updateTimeLeft();
        this.ngType ="timeUp";
      }
      if (++couter === perious) {
        this.updateTimeLeft();
        couter = 0;
      }
    });
  }

  getFormattedTime(): string {
    const minutes: number = Math.floor(this.remainingTimeClone / 60);
    const seconds: number = this.remainingTimeClone % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  stopTimer(): void {
    this.timeCloser$.next('close');
  }

  updateTimeLeft(){
    this.ordersService.checkPaymentV2(this.resultData.token_code).subscribe({
      next:({data})=>{
        if(!data){
          this.ngType ="timeUp";
          this.isTimeOver = true;
          this.remainingTimeClone = 0;
          this.stopTimer()
        }else{
          if(![1,2].includes(data['result_data']['`status`'])){
            this.remainingTimeClone = 0;
            this.stopTimer()
            this.ngType ="result";
          }
          this.datacheck = data['result_data'];
        }
      },
      error:(e)=>{
        this.notifi.toastError('Mất kết nối với máy chủ');
      }
    })
  }

  reload(){
    this.loadInit()
  }

}
