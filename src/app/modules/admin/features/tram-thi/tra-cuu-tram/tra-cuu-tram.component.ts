import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {RippleModule} from 'primeng/ripple';
import {TableModule} from 'primeng/table';
import {CardModule} from 'primeng/card';
import {DividerModule} from 'primeng/divider';
import {TooltipModule} from 'primeng/tooltip';
import {SharedModule} from '@shared/shared.module';
import {NotificationService} from '@core/services/notification.service';
import {HoidongKetqua, HoidongKetquaService} from '@shared/services/vstep/hoidong-ketqua.service';
import {KeHoachThi, KehoachthiVstepService} from '@shared/services/vstep/kehoachthi-vstep.service';
import {ConditionOption} from '@shared/models/condition-option';
import {OvicQueryCondition} from '@core/models/dto';

@Component({
  selector: 'app-tra-cuu-tram',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
    RippleModule,
    SharedModule,
    TableModule,
    CardModule,
    DividerModule,
    TooltipModule
  ],
  templateUrl: './tra-cuu-tram.component.html',
  styleUrls: ['./tra-cuu-tram.component.css']
})
export class TraCuuTramComponent implements OnInit {

  kehoachList: KeHoachThi[] = [];

  formSearch: FormGroup;

  result: HoidongKetqua[] = [];

  isLoading = false;

  noResult = false;

  hasSearched = false;

  constructor(
    private fb: FormBuilder,
    private hoidongKetquaService: HoidongKetquaService,
    private kehoachthiVstepService: KehoachthiVstepService,
    private notifi: NotificationService
  ) {
    this.formSearch = this.fb.group({
      kehoach_id: [null],
      keyword: ['']
    });
  }

  ngOnInit(): void {
    this.loadKeHoachThi();
  }

  private loadKeHoachThi(): void {
    const condition: ConditionOption = {
      condition: [],
      page: '1',
      set: [{label: 'limit', value: '-1'}]
    };
    this.kehoachthiVstepService.getDataByPageNew(condition)
      .subscribe({
        next: (res) => {
          this.kehoachList = res.data;
        },
        error: () => {
          this.notifi.toastError('Tải danh sách kỳ thi không thành công');
        }
      });
  }

  onSearch(): void {
    const {kehoach_id, keyword} = this.formSearch.value;
    const keywordTrimmed = (keyword || '').trim();

    if (!keywordTrimmed) {
      this.notifi.toastWarning('Vui lòng nhập số báo danh hoặc CCCD / Hộ chiếu');
      return;
    }

    this.isLoading = true;
    this.hasSearched = true;
    this.noResult = false;
    this.result = [];

    const conditions: ConditionOption = {
      condition: [],
      page: '1',
      set: [
        {label: 'limit', value: '-1'}
      ]
    };

    // Add kehoach_id filter if selected
    if (kehoach_id) {
      conditions.condition.push({
        conditionName: 'kehoach_id',
        condition: OvicQueryCondition.equal,
        value: kehoach_id.toString()
      });
    }

    // Search by sobaodanh or cccd_so (using OR via separate conditions)
    this.searchByField(keywordTrimmed, conditions);
  }

  private searchByField(keyword: string, baseCondition: ConditionOption): void {
    // Clone conditions for sobaodanh search


    baseCondition.set.push({
      label:'search' ,value:keyword  ? keyword : ''
    })
    // Execute both searches
    this.hoidongKetquaService.getDataByPageNew(baseCondition).subscribe({
      next:({data})=>{
        this.result = data;
        this.noResult = this.result.length === 0;
        this.isLoading = false;
      },error:() =>{
        this.isLoading = false;
        this.noResult = true;
        this.notifi.toastError('Tra cứu không thành công');
      }
    })

  }


  resetSearch(): void {
    this.formSearch.reset({kehoach_id: null, keyword: ''});
    this.result = [];
    this.noResult = false;
    this.hasSearched = false;
  }
}
