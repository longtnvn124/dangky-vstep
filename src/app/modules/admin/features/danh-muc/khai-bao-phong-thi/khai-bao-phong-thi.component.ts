import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DanhMucPhongThiService, DmPhongThi } from "@shared/services/danh-muc-phong-thi.service";
import { NotificationService } from "@core/services/notification.service";
import { ThemeSettingsService } from "@core/services/theme-settings.service";
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { FormType, NgPaginateEvent, OvicForm } from '@modules/shared/models/ovic-models';
import { Options } from 'plyr';
import { Observable, Subject, Subscription, debounceTime, filter } from 'rxjs';
import { Paginator } from 'primeng/paginator';
import { ThiSinhService } from '@modules/shared/services/thi-sinh.service';
import { invalid } from 'moment';


interface FormPhongthi extends OvicForm {
  object: DmPhongThi;
}

const PinableValidator = (control: AbstractControl): ValidationErrors | null => {

  if (control.get('fromAt').valid && control.get('toAt').valid) {
    return control.get('fromAt').value <= control.get('toAt').value ? null : { invalid: true };
  } else {
    return { invalid: true };
  }
}

@Component({
  selector: 'app-khai-bao-phong-thi',
  templateUrl: './khai-bao-phong-thi.component.html',
  styleUrls: ['./khai-bao-phong-thi.component.css']
})
export class KhaiBaoPhongThiComponent implements OnInit {
  @ViewChild('fromUpdate', { static: true }) template: TemplateRef<any>;
  @ViewChild(Paginator) paginator: Paginator;


  listData: DmPhongThi[] = [];
  recordsTotal: number;
  rows: number = this.themeSettingsService.settings.rows;
  page: number = 1;

  formActive: FormPhongthi;
  formSave: FormGroup;
  sizeFullWidth = 1024;
  private OBSERVE_PROCESS_FORM_DATA = new Subject<FormPhongthi>();
  menuName: 'dm_phongthi';
  subscription = new Subscription();
  listForm = {
    [FormType.ADDITION]: { type: FormType.ADDITION, title: 'Thêm mới ', object: null, data: null },
    [FormType.UPDATE]: { type: FormType.UPDATE, title: 'Cập nhật', object: null, data: null }
  };
  needUpdate = false;
  btn_checkAdd: "Lưu lại" | "Cập nhật";

  private inputChanged: Subject<DmPhongThi> = new Subject<DmPhongThi>();
  constructor(
    private danhMucPhongThiService: DanhMucPhongThiService,
    private notifi: NotificationService,
    private themeSettingsService: ThemeSettingsService,
    private fb: FormBuilder
  ) {

    const observeProcessFormData = this.OBSERVE_PROCESS_FORM_DATA.asObservable().pipe(debounceTime(100)).subscribe(form => this.__processFrom(form));
    this.subscription.add(observeProcessFormData);
    const observeProcessCloseForm = this.notifi.onSideNavigationMenuClosed().pipe(filter(menuName => menuName === this.menuName && this.needUpdate)).subscribe(() => this.loadData(this.page));
    this.subscription.add(observeProcessCloseForm);
    const observerOnResize = this.notifi.observeScreenSize.subscribe(size => this.sizeFullWidth = size.width)
    this.subscription.add(observerOnResize);
    this.formSave = this.fb.group({
      fromAt: [null, Validators.required],
      toAt: [null, Validators.required],
      soluong: [null, Validators.required],

    }, { validators: PinableValidator });
  }

  ngOnInit(): void {
    this.inputChanged.pipe(debounceTime(500)).subscribe((item: DmPhongThi) => { this.updateContentByInput(item); });
    this.loadInit();
  }

  loadInit() {
    this.loadData(1);
  }

  loadData(page: number) {
    this.notifi.isProcessing(true);
    this.danhMucPhongThiService.load(page).subscribe({
      next: ({ recordsTotal, data }) => {
        this.recordsTotal = recordsTotal;
        this.listData = data;
        this.notifi.isProcessing(false);
      }, error: () => {
        this.notifi.isProcessing(false);

      }
    })
  }


  btnAddnew() {
    this.notifi.isProcessing(true);
    this.btn_checkAdd = "Lưu lại";
    this.formSave.reset({
      fromAt: null,
      toAt: null,
      soluong: null,
    });
    this.formActive = this.listForm[FormType.ADDITION];
    this.preSetupForm(this.menuName);
  }


  async btnDelete(item: DmPhongThi) {
    const confirm = await this.notifi.confirmDelete();
    if (confirm) {
      this.danhMucPhongThiService.delete(item.id).subscribe({
        next: () => {
          this.notifi.isProcessing(false);
          this.notifi.toastSuccess('Thao tác thành công');
          this.loadData(this.page);
        }, error: () => {
          this.notifi.isProcessing(false);
          this.notifi.toastError('Thao tác không thành công');
        }
      })
    }
  }


  closeForm() {
    this.loadInit();
    this.notifi.closeSideNavigationMenu(this.menuName);
  }
  get f(): { [key: string]: AbstractControl<any> } {
    return this.formSave.controls;
  }

  private preSetupForm(name: string) {
    this.notifi.isProcessing(false);
    this.notifi.openSideNavigationMenu({
      name,
      template: this.template,
      size: 800,
      offsetTop: '0px'
    });
  }

  paginate({ page }: NgPaginateEvent) {
    this.page = page + 1;
    this.loadData(this.page);
  }


  private __processFrom({ data, object, type }: FormPhongthi) {
    const observer$: Observable<any> = type === FormType.ADDITION ? this.danhMucPhongThiService.create(data) : this.danhMucPhongThiService.update(object.id, data);
    observer$.subscribe({
      next: () => {
        this.needUpdate = true;
        this.loadData(this.page);
        if (FormType.ADDITION) {
          this.formSave.reset({
            fromAt: null,
            toAt: null,
            soluong: null,
          });
        }
        this.notifi.toastSuccess('Thao tác thành công', 'Thông báo');
      },
      error: () => this.notifi.toastError('Thao tác thất bại', 'Thông báo')
    });
  }
  saveForm() {

    if (this.formSave.valid) {
      this.formActive.data = this.formSave.value;
      this.OBSERVE_PROCESS_FORM_DATA.next(this.formActive);
    }
    else {
      this.formSave.markAllAsTouched();
      this.notifi.toastError('Vui lòng nhập đúng thông tin');
    }
  }

  onInputChange(event: DmPhongThi) {

    this.inputChanged.next(event);
  }
  updateContentByInput(item: DmPhongThi) {
    const from = item.fromAt;
    const to = item.toAt;
    if (from <= to) {
      const newData = {
        id: item.id,
        fromAt: item.fromAt,
        toAt: item.toAt,
        soluong: item.soluong
      }
      this.danhMucPhongThiService.update(item.id, newData).subscribe({
        next: () => {
          this.loadData(this.page)
          this.notifi.toastSuccess('Cập nhật thành công');
        }, error: () => {
          this.notifi.toastError('Thao tác không thành công');;
        }
      })
    } else {
      this.notifi.toastWarning('Số bạn mới nhập không phù hợp ');
    }


  }

}
