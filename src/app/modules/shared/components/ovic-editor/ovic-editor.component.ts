import {Component, OnInit, Input, SimpleChanges, OnChanges, OnDestroy} from '@angular/core';
import {AbstractControl} from '@angular/forms';
import {HelperService} from '@core/services/helper.service';
import {MODULES_QUILL} from "@shared/utils/syscat";
import {Subject, takeUntil, timer} from "rxjs";

@Component({
  selector: 'ovic-editor',
  templateUrl: './ovic-editor.component.html',
  styleUrls: ['./ovic-editor.component.css'],
})
export class OvicEditorComponent implements OnInit, OnDestroy {
  protected readonly module_quill = MODULES_QUILL;

  @Input() height = '320px';
  private _formControl: AbstractControl;
  @Input() set formField(formControl: AbstractControl) {
    this._formControl = formControl;
    this.clearPrevious.next();
    if (formControl) {
      formControl.valueChanges.pipe(takeUntil(this.clearPrevious)).subscribe(value => {
        this.setData(value);
      });

      // waiting for form built
      timer(500).pipe(takeUntil(this.clearPrevious)).subscribe(()=> this.setData(formControl.value));
    }
  }
  get formControl(): AbstractControl {
    return this._formControl;
  }
  @Input() readonly: boolean = false;

  @Input() set default(value: string) {
    this.setData(value);
  }

  textContents: any;

  private clearPrevious: Subject<void> = new Subject();

  constructor(
    private helperService: HelperService
  ) {
  }

  ngOnInit(): void {
    this.setData(this.default);
    // if(this.formField){
    //   this.textContents
    // }
  }

  setData(data: string) {
    this.textContents = data ? this.helperService.decodeHTML(data) : '';
  }

  onTextChange(event) {
    // this.formField.setValue(this.helperService.decodeHTML(event.htmlValue));
    this._formControl.setValue(this.helperService.decodeHTML(event.htmlValue));
  }

  ngOnDestroy(): void {
    this.clearPrevious.next();
    this.clearPrevious.complete();
  }

}
