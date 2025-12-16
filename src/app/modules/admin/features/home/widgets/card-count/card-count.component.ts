import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-card-count',
  templateUrl: './card-count.component.html',
  styleUrls: ['./card-count.component.css']
})
export class CardCountComponent implements OnInit {
  @Input()  totalLephithi :number;
  @Input()  label :string;
  constructor() { }

  ngOnInit(): void {
  }

}
