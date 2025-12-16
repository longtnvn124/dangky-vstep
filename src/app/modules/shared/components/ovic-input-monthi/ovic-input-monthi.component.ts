import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, Form, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NotificationService} from "@core/services/notification.service";
import {DanhMucMonService} from "@shared/services/danh-muc-mon.service";
import {DmMon} from "@shared/models/danh-muc";

export interface InputMonthi {
  id?: number;
  mon_id: number;
  timeStart: string;
  canbo: string
}

export interface InputMonthiExtend extends InputMonthi {
  form: FormGroup
}


@Component({
  selector: 'ovic-input-monthi',
  templateUrl: './ovic-input-monthi.component.html',
  styleUrls: ['./ovic-input-monthi.component.css']
})
export class OvicInputMonthiComponent implements OnInit {

  @Input() set room(room: { id: number, tenphong: string, soluong: number, monthi: InputMonthi[] }) {
    this.data = room.monthi.map(mt => {
      const form: FormGroup = this.fb.group({
        mon_id: [mt.mon_id, Validators.required],
        timeStart: [mt.timeStart, Validators.required],
      });

      const _object: InputMonthiExtend = {...mt, form};

      form.valueChanges.subscribe(() => {
          _object.mon_id = form.get('mon_id').value;
          _object.timeStart = form.get('timeStart').value;
        }
      )
      return _object
    })
  }

  @Input() formField: AbstractControl<InputMonthi[]>;

  options: InputMonthi[];

  DmMonThi: DmMon[] = [];

  data: InputMonthiExtend[];
  monselectName:string;
  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private danhMucMonService: DanhMucMonService,
  ) {
  }

  ngOnInit(): void {
    this.getMonThi();
    this.addMoreAnswer();
    if (this.formField) {
      this.formField.valueChanges.subscribe(options => this.options = options && Array.isArray(options) ? options : []);
      this.options = this.formField.value && Array.isArray(this.formField.value) ? this.formField.value : [];
      // this.monselectName = this.DmMonThi ?  this.options.map(m=>this.DmMonThi.find(f=>f.id === m.mon_id).tenmon).join(',') : '';
    }
  }

  addMoreAnswer() {
    if (this.formField) {
      const oldValue = Array.isArray(this.formField.value) ? this.formField.value : [];
      const _id = oldValue.reduce((max, item) => max < item.id ? item.id : max, 0)
      oldValue.push({id: _id + 1, mon_id: null, timeStart: '', canbo: ''});
      this.formField.setValue(oldValue);
    }
  }

  getMonThi() {
    this.notificationService.isProcessing(true);
    this.danhMucMonService.getDataUnlimit().subscribe({
      next: (data) => {
        this.DmMonThi = data;
        this.notificationService.isProcessing(false);
      },
      error: () => {
        this.notificationService.isProcessing(false);
      }
    })
  }

  // selelctMon(option, event) {

  //   this.options.find(f => f.id === option.id).mon_id = event.value;
  //   console.log(this.options);
  // }
  //
  // getTimeByForm(option, event) {
  //   console.log(option);
  //   console.log(event);
  //   this.options.find(f => f.id === option.id).timeStart = event;
  //
  // }

  deleteItem(id: number) {
    if (this.options.find(f => f.id === id)) {
      this.options= this.options.filter( f=>f.id !== id);
      this.formField.setValue(this.options);
    }
  }

}
