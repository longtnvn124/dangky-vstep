import {Component, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AbstractControl, FormsModule} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-kehoach-form-dongia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kehoach-form-dongia.component.html',
  styleUrls: ['./kehoach-form-dongia.component.css']
})
export class KehoachFormDongiaComponent implements OnInit, OnDestroy {

  @Input() formFild!: AbstractControl | null;

  data: { label: string, value: string, key: string }[] = [];

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

  updateValue(key: string, value: string): void {
    const data = [...(this.formFild?.value ?? [])];

    const index = data.findIndex(item => item.key === key);

    if (index !== -1) {
      data[index].value = value;
      this.formFild?.setValue(data, {emitEvent: false});
    }
  }

  @ViewChildren('dongiaInput') inputs!: QueryList<ElementRef<HTMLInputElement>>;

  onInput(key: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const sanitized = input.value.replace(/\D/g, '');
    if (sanitized !== input.value) {
      input.value = sanitized;
      this.updateValue(key, sanitized);
    }
  }

  onEnter(event: Event, index: number): void {
    event.preventDefault();
    const inputsArray = this.inputs.toArray();
    const nextIndex = index + 1;
    if (nextIndex < inputsArray.length) {
      inputsArray[nextIndex].nativeElement.focus();
    }
  }

  onBlur(key: string, value: string): void {
    if (value) {
      // Remove leading zeros, keep at least "0" if the string is all zeros
      const cleaned = value.replace(/^0+(?=\d)/, '');
      if (cleaned !== value) {
        const data = [...(this.formFild?.value ?? [])];
        const index = data.findIndex(item => item.key === key);
        if (index !== -1) {
          data[index].value = cleaned;
          this.formFild?.setValue(data, {emitEvent: false});
        }
      }
    }
  }

  numberOnly(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Delete', 'Home', 'End'];
    if (allowedKeys.includes(event.key)) {
      return;
    }
    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (event.ctrlKey && ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase())) {
      return;
    }
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }
}