import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {KeHoachThi} from "@shared/services/kehoachthi-vstep.service";
import {KehoachthiDiemduthi, KehoachthiDiemthiVstepService} from "@shared/services/kehoachthi-diemthi-vstep.service";
import {NotificationService} from "@core/services/notification.service";
import {ConditionOption} from "@shared/models/condition-option";
import {OvicQueryCondition} from "@core/models/dto";
import {AuthService} from "@core/services/auth.service";
import {DonViService} from "@shared/services/don-vi.service";
import {DonVi} from "@shared/models/danh-muc";
import {forkJoin, Observable, of, switchMap} from "rxjs";
import {map} from "rxjs/operators";
import {BUTTON_NO, BUTTON_YES} from "@core/models/buttons";
import { MatProgressBarModule } from "@angular/material/progress-bar";

interface LevelSoluong {
  value: string;
  label: string;
  soluong: number;
}

interface DiemthiLevel {
  id?: number;
  kehoach_id: number;
  diemduthi_id: number;
  diemduthi_title: string;
  soluong: number;
  levels: LevelSoluong[];
}

@Component({
  selector: 'app-kehoachthi-diemthi-v3',
  standalone: true,
  imports: [CommonModule, ButtonModule, RippleModule, MatProgressBarModule],
  templateUrl: './kehoachthi-diemthi-v3.component.html',
  styleUrls: ['./kehoachthi-diemthi-v3.component.css']
})
export class KehoachthiDiemthiV3Component implements OnInit {

  @Input() set kehoachthi(a: KeHoachThi) {
    this._kehoachthi = a;
    this.availableLevels = (a.levels ?? []).filter(l => l.select === 1);
    this.loadInit();
  }

  _kehoachthi: KeHoachThi;
  availableLevels: { label: string; value: string; select: number }[] = [];

  listData: DiemthiLevel[] = [];
  dmDiemduthi: DonVi[] = [];
  ngType: -1 | 0 | 1 = 0;

  constructor(
    private donViService: DonViService,
    private kehoachthiDiemthiVstepService: KehoachthiDiemthiVstepService,
    private notifi: NotificationService,
    private auth: AuthService
  ) {
  }

  ngOnInit(): void {
  }

  loadInit(): void {
    this.ngType = 0;

    const conditionDm: ConditionOption = {
      condition: [
        {conditionName: 'status', condition: OvicQueryCondition.equal, value: '1'},
        {conditionName: 'parent_id', condition: OvicQueryCondition.equal, value: this.auth.user.donvi_id.toString()},
      ],
      page: '1',
      set: [
        {label: 'limit', value: '-1'},
        {label: 'orderby', value: 'title'},
      ]
    };

    const conditionDiemthi: ConditionOption = {
      condition: [
        {conditionName: 'kehoach_id', condition: OvicQueryCondition.equal, value: this._kehoachthi.id.toString()},
      ],
      page: '1',
      set: [
        {label: 'limit', value: '-1'},
        {label: 'with', value: 'donvi'},
      ]
    };

    forkJoin([
      this.donViService.getDataByPageNew(conditionDm).pipe(map(m => m.data)),
      this.kehoachthiDiemthiVstepService.getDataByPageNew(conditionDiemthi)
    ]).subscribe({
      next: ([dmDiemDuthi, {data}]) => {
        this.listData = data.map((m: any) => {
          const diemthi: DonVi = m['donvi'];
          const parsedLevels: LevelSoluong[] = m['levels'] ?? [];
          return {
            id: m.id,
            kehoach_id: m.kehoach_id,
            diemduthi_id: m.diemduthi_id,
            diemduthi_title: diemthi ? diemthi.title : '',
            soluong: m.soluong,
            levels: parsedLevels.length > 0
              ? parsedLevels
              : this.availableLevels.map(l => ({value: l.value, label: l.label, soluong: 0}))
          } as DiemthiLevel;
        });

        const dataIds = data.map(m => m.diemduthi_id);
        this.dmDiemduthi = dmDiemDuthi.filter(f => !dataIds.includes(f.id)).map(m => {
          m['select'] = false;
          return m;
        });

        this.ngType = 1;
      },
      error: () => {
        this.ngType = -1;
        this.notifi.toastError('Mất kết nối với máy chủ');
      }
    });
  }

  reLoad(): void {
    this.loadInit();
  }

  onSelectDiemthi(event: any, item: DonVi): void {
    this.dmDiemduthi.find(f => f.id == item.id)['select'] = event.select;
  }

  async createNew(): Promise<void> {
    const diemthiIds = this.listData.map(m => m.diemduthi_id);
    const dataAdd = this.dmDiemduthi.filter(f => !diemthiIds.includes(f.id) && f['select']);

    if (dataAdd.length > 0) {
      const head = 'XÁC NHẬN THÊM ĐIỂM DỰ THI CHO KỲ THI';
      const html = `<p class="text-left">- Thêm điểm dự thi cho đợt thi <strong>${this._kehoachthi.title}</strong></p>`;
      const btn = await this.notifi.confirm(html, head, [BUTTON_NO, BUTTON_YES]);

      if (btn.name === 'yes') {
        const step = 100 / dataAdd.length;
        this.notifi.loadingAnimationV2({process: {percent: 0}});
        this.loopCreatedDiemduthi(dataAdd, this._kehoachthi.id, step, 0).subscribe({
          next: () => {
            this.notifi.toastSuccess('Thao tác thành công');
            this.notifi.isProcessing(false);
            this.loadInit();
            this.notifi.disableLoadingAnimationV2();
          },
          error: () => {
            this.notifi.toastError('Thao tác thất bại');
            this.notifi.isProcessing(false);
            this.notifi.disableLoadingAnimationV2();
          }
        });
      }
    } else {
      this.notifi.toastWarning('Danh sách chọn đã có hoặc chưa được chọn!');
    }
  }

  private loopCreatedDiemduthi(data: any[], kehoach_id: number, step: number, percent: number): Observable<any> {
    const index = data.findIndex(i => !i['isCreated']);
    if (index !== -1) {
      const item = {
        diemduthi_id: data[index].id,
        kehoach_id: kehoach_id,
        levels: this.availableLevels.map(l => ({value: l.value, soluong: 0}))
      };
      return this.kehoachthiDiemthiVstepService.create(item).pipe(switchMap(() => {
        data[index]['isCreated'] = true;
        const newPercent = percent + step;
        this.notifi.loadingAnimationV2({process: {percent: newPercent}});
        return this.loopCreatedDiemduthi(data, kehoach_id, step, newPercent);
      }));
    } else {
      return of(data);
    }
  }

  async deleteItem(item: DiemthiLevel): Promise<void> {
    const btn = await this.notifi.confirmDelete();
    if (btn) {
      this.notifi.isProcessing(true);
      this.kehoachthiDiemthiVstepService.delete(item.id).subscribe({
        next: () => {
          this.notifi.toastSuccess('Thao tác thành công');
          this.notifi.isProcessing(false);
          this.loadInit();
        },
        error: () => {
          this.notifi.toastError('Thao tác không thành công');
          this.notifi.isProcessing(false);
        }
      });
    }
  }

  updateLevelSoluong(item: DiemthiLevel, levelValue: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '');
    input.value = value;

    const level = item.levels.find(l => l.value === levelValue);
    if (level) {
      level.soluong = value ? parseInt(value, 10) : 0;
      this.saveLevels(item);
    }
  }

  saveLevels(item: DiemthiLevel): void {
    this.kehoachthiDiemthiVstepService.update(item.id, {levels: item.levels}).subscribe({
      next: () => {
        this.notifi.toastSuccess('Lưu số lượng thành công');
      },
      error: () => {
        this.notifi.toastError('Lưu số lượng thất bại');
      }
    });
  }
}
