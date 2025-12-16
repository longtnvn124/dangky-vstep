import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from '@core/services/notification.service';
import {HelperService} from '@core/services/helper.service';
import {ThemeSettingsService} from '@core/services/theme-settings.service';
import {LocationService} from '@shared/services/location.service';
import {debounceTime, merge, Observable, of, switchMap} from 'rxjs';
import {DiaDanh} from '@shared/models/location';
import {map, tap} from 'rxjs/operators';

export interface InputDiaDanh {
  province: number,
  district: number,
  wards: number,
  address: string,
  fullAddress: string;
}

@Component({
  selector: 'ovic-input-address-four-layouts',
  templateUrl: './ovic-input-address-four-layouts.component.html',
  styleUrls: ['./ovic-input-address-four-layouts.component.css']
})
export class OvicInputAddressFourLayoutsComponent implements OnInit, OnChanges {
  @Input() disabled: boolean = false;

  @Input() set formField(field: AbstractControl) {

    this._formField = field;
  }

  private _formField: AbstractControl;

  get formField(): AbstractControl {
    return this._formField;
  }

  // @Input() data : InputDiaDanh;
  data: any;

  @Output() provinceLoaded = new EventEmitter<DiaDanh[]>();

  @Output() onChanges = new EventEmitter<InputDiaDanh>();

  form: FormGroup;

  provinceOptions: DiaDanh[] = [];
  districtOptions: DiaDanh[] = [];
  wardsOptions: DiaDanh[] = [];
  fields = {
    province: ['', Validators.required],
    district: ['', Validators.required],
    wards: ['',],
    address: ['']
  };
  isLoading = true;
  errorLoadProvinces = false;
  errorLoadDistricts = false;
  errorLoadWards = false;

  fullAddress = ['', '', '', ''];

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private helperService: HelperService,
    private locationService: LocationService,
    private themeSettingsService: ThemeSettingsService
  ) {
    this.form = this.fb.group(this.fields);

    const onChangeProvince$ = this.f['province'].valueChanges;
    const onChangeDistrict$ = this.f['district'].valueChanges;
    const onChangeWards$ = this.f['wards'].valueChanges;
    const onChangeAddress$ = this.f['address'].valueChanges;

    merge(onChangeProvince$, onChangeDistrict$, onChangeWards$, onChangeAddress$).pipe(debounceTime(500)).subscribe(() => {
      const address = this.f['address'].value;
      const district = this.f['district'].valid ? this.districtOptions.reduce((t, row) => t += row.id === this.f['district'].value ? row.name : '', '') : '';
      const wards = this.f['wards'].valid ? this.wardsOptions.reduce((t, row) => t += row.id === this.f['wards'].value ? row.name : '', '') : '';
      const province = this.f['province'].valid ? this.provinceOptions.reduce((t, row) => t += row.id === this.f['province'].value ? row.name : '', '') : '';
      const fullAddress = [address, wards, district, province].filter(Boolean).map(u => u.trim()).join(', ');
      this.onChanges.emit({fullAddress, ...this.form.value});
    });

    onChangeProvince$.pipe(tap(() => this.isLoading = true), switchMap(id => id ? this.locationService.listDistrictByProvinceId(id) : of([]))).subscribe(options => {
      this.districtOptions = options;
      // this.f[ 'district' ].setValue( null );
      this.isLoading = false;
    });

    onChangeDistrict$.pipe(tap(() => this.isLoading = true), switchMap(id => id ? this.locationService.listWardsByDistrictId(id) : of([]))).subscribe(options => {
      this.wardsOptions = options;
      // this.f[ 'wards' ].setValue( null );
      this.isLoading = false;
    });

  }

  get f(): { [key: string]: AbstractControl<any> } {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.loadProvince();
    this.data = this._formField ? this._formField.value : {};
    if (this.formField) {
      this.data = this._formField ? this._formField.value : {};
      this.f['province'].setValue(this.data ? this.data['province'] : null);
      this.f['district'].setValue(this.data ? this.data['district'] : null);
      this.f['wards'].setValue(this.data ? this.data['wards'] : null);
      this.f['address'].setValue(this.data ? this.data['address'] : null);
    }
  }

  loadProvince() {
    this.locationService.listProvinces().pipe(tap(provinces => this.provinceLoaded.emit(provinces))).subscribe({
      next: provinces => {
        this.errorLoadProvinces = false;
        this.isLoading = false;
        this.provinceOptions = provinces;
      },
      error: () => {
        this.errorLoadProvinces = true;
        this.isLoading = false;
      }
    });
  }

  loadDistrict(provinceId: number): Observable<DiaDanh[]> {
    return this.locationService.listProvinces();
  }

  loadWards(districtCode: string = null): Observable<DiaDanh[]> {
    return of([]);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      if (this.data) {
        this.f['province'].setValue(this.data.province);
        this.f['district'].setValue(this.data.district);
        this.f['wards'].setValue(this.data.wards);
        this.f['address'].setValue(this.data.address);
      }
    }
  }

}
