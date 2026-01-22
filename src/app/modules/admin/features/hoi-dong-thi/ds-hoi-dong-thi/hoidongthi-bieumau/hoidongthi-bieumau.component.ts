import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Hoidongthi} from "@shared/services/vstep-hoidong-thi.service";

@Component({
  selector: 'app-hoidongthi-bieumau',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hoidongthi-bieumau.component.html',
  styleUrls: ['./hoidongthi-bieumau.component.css']
})
export class HoidongthiBieumauComponent implements OnInit {

  @Input() set hoidong(item:Hoidongthi){

  }
  constructor() { }

  ngOnInit(): void {
  }

}
