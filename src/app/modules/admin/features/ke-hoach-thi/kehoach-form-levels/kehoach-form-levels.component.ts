import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AbstractControl} from "@angular/forms";
import {Subscription} from "rxjs";

interface LevelItem {
  id: number;
  label: string;
  value: string;
  select: number; // 0 | 1
}

@Component({
  selector: 'app-kehoach-form-levels',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kehoach-form-levels.component.html',
  styleUrls: ['./kehoach-form-levels.component.css']
})
export class KehoachFormLevelsComponent implements OnInit, OnDestroy {

  @Input() formFild!: AbstractControl | null;

  data: LevelItem[] = [];

  private valueChangesSub: Subscription | null = null;

  ngOnInit(): void {
    this.data = this.formFild?.value ?? [];
    this.valueChangesSub = this.formFild?.valueChanges.subscribe(value => {
      this.data = value ?? [];
    }) ?? null;
  }

  ngOnDestroy(): void {
    this.valueChangesSub?.unsubscribe();
  }

  toggleSelect(item: LevelItem): void {
    this.data = this.data.map(i => {
      if (i.id === item.id) {
        return {...i, select: i.select === 1 ? 0 : 1};
      }
      return i;
    });
    this.formFild?.setValue(this.data, {emitEvent: false});
  }
}