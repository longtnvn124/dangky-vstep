import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Paginator} from "primeng/paginator";
import {FormType, NgPaginateEvent, OvicTableStructure} from "@shared/models/ovic-models";
import { FormGroup} from "@angular/forms";
import {filter,Subscription} from "rxjs";
import {ThemeSettingsService} from "@core/services/theme-settings.service";
import {NotificationService} from "@core/services/notification.service";
import {HelperService} from "@core/services/helper.service";
import {EmailCheck, MailCheckService} from "@core/services/mail-check.service";

// interface FormDmMon extends OvicForm {
//   object: DmCapdo;
// }

@Component({
  selector: 'app-mail-check',
  templateUrl: './mail-check.component.html',
  styleUrls: ['./mail-check.component.css']
})
export class MailCheckComponent implements OnInit {


  @ViewChild('fromUpdate', {static: true}) template: TemplateRef<any>;
  @ViewChild('formMembers', {static: true}) formMembers: TemplateRef<any>;
  @ViewChild(Paginator) paginator: Paginator;
  listData: EmailCheck[];

  statusList = [
    {
      value: 1,
      label: 'Đã xem',
      color: '<span class="badge badge--size-normal badge-success w-100">Đã xem</span>'
    },
    {
      value: 0,
      label: 'Chưa xem',
      color: '<span class="badge badge--size-normal badge-danger w-100">Chưa xem</span>'
    }
  ];
  tblStructure: OvicTableStructure[] = [
    {
      fieldType: 'normal',
      field: ['to'],
      innerData: true,
      header: 'Email received',
      sortable: false
    },
    {
      fieldType: 'normal',
      field: ['subject'],
      innerData: true,
      header: 'subject',
      sortable: false
    },
    {
      fieldType: 'normal',
      field: ['user_email'],
      innerData: true,
      header: 'Email send',
      sortable: false
    },
    {
      fieldType: 'normal',
      field: ['__senDate'],
      innerData: true,
      header: 'Send date',
      sortable: false
    },
    {
      fieldType: 'normal',
      field: ['__viewingDate'],
      innerData: true,
      header: 'Viewing date',
      sortable: false
    },
    {
      fieldType: 'normal',
      field: ['__status'],
      innerData: true,
      header: 'Status',
      sortable: false
    },
  ];

  headButtons = [

  ];
  listForm = {
    [FormType.ADDITION]: {type: FormType.ADDITION, title: 'Thêm mới cấp độ HSK', object: null, data: null},
    [FormType.UPDATE]: {type: FormType.UPDATE, title: 'Cập nhật cấp độ HSK', object: null, data: null}
  };

  formSave: FormGroup;


  rows = this.themeSettingsService.settings.rows;
  loadInitFail = false;
  subscription = new Subscription();
  sizeFullWidth = 1024;
  isLoading = true;
  needUpdate = false;

  menuName: 'dm_chuyenmuc';

  page = 1;
  btn_checkAdd: 'Lưu lại' | 'Cập nhật';
  recordsTotal = 0;

  index = 1;
  search='';

  constructor(
    private themeSettingsService: ThemeSettingsService,
    private notificationService: NotificationService,
    private mailCheckService: MailCheckService,
    private helperService: HelperService
  ) {

    const observeProcessCloseForm = this.notificationService.onSideNavigationMenuClosed().pipe(filter(menuName => menuName === this.menuName && this.needUpdate)).subscribe(() => this.loadData(this.page));
    this.subscription.add(observeProcessCloseForm);
    const observerOnResize = this.notificationService.observeScreenSize.subscribe(size => this.sizeFullWidth = size.width)
    this.subscription.add(observerOnResize);

  }

  ngOnInit(): void {
    this.loadInit()
  }

  loadInit() {
    this.isLoading = true;
    this.loadData(1);
  }

  loadData(page:number, search?:string) {
    const limit = this.themeSettingsService.settings.rows;
    this.index = (page * limit) - limit + 1;
    let newsearch:string = search? search : this.search;
    this.mailCheckService.search(page, newsearch).subscribe({
      next: ({data, recordsTotal}) => {
        this.recordsTotal = recordsTotal;
        this.listData = data.map(m => {
          m['__senDate'] =this.helperService.formatSQLToDateDMY(new Date(m.created_at));
          m['__viewingDate'] = m.updated_at ?  this.helperService.formatSQLToDateDMY(new Date(m.created_at)) : '' ;
          m['__status'] = this.statusList.find(f=>f.value === m.seen).color;
          return m;
        })

        // console.log( this.listData);
        this.isLoading = false;
      }, error: () => {
        this.isLoading = false;
        this.notificationService.toastError('Mất kết nối với máy chủ');
      }
    })
  }

  formatNumber(num:number) {
    return num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : '';
  }


  paginate({page}: NgPaginateEvent) {
    this.page = page + 1;
    this.loadData(this.page);
  }

  onSearch(text: string) {
    this.search = text;
    this.paginator.changePage(1);
    this.loadData(1, text);
  }





}
