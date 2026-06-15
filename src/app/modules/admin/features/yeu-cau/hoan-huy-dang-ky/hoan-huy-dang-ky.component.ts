import { Component, OnInit } from '@angular/core';
import {TabViewModule} from "primeng/tabview";
import {HoanComponent} from "@modules/admin/features/yeu-cau/hoan-huy-dang-ky/hoan/hoan.component";
import {HuyComponent} from "@modules/admin/features/yeu-cau/hoan-huy-dang-ky/huy/huy.component";

@Component({
  selector: 'app-hoan-huy-dang-ky',
  templateUrl: './hoan-huy-dang-ky.component.html',
  styleUrls: ['./hoan-huy-dang-ky.component.css'],
  imports: [
    TabViewModule,
    HoanComponent,
    HuyComponent
  ],
  standalone: true
})
export class HoanHuyDangKyComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
