import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {HskOrdersService, OrdersHsk} from "@shared/services/hsk-orders.service";
import {NotificationService} from "@core/services/notification.service";
import {ThemeSettingsService} from "@core/services/theme-settings.service";
import {Paginator} from "primeng/paginator";
import {NgPaginateEvent} from "@shared/models/ovic-models";
import {forkJoin, Observable, of, switchMap} from "rxjs";
import {DanhMucCapDoService} from "@shared/services/danh-muc-cap-do.service";
import {DmCapdo} from "@shared/models/danh-muc";
import {ExportExcelHskService} from "@shared/services/export-excel-hsk.service";
import {ExportThiSinhDuThiService} from "@shared/services/export-thi-sinh-du-thi.service";

@Component({
  selector: 'app-thi-sinh-by-dang-ky',
  templateUrl: './thi-sinh-by-dang-ky.component.html',
  styleUrls: ['./thi-sinh-by-dang-ky.component.css']
})
export class ThiSinhByDangKyComponent implements OnInit {
  @ViewChild(Paginator) paginator: Paginator;

  @Input() set orderParent(data: OrdersHsk) {
    this.orderParentSelect = data;

    this.listChild = [];
    this.page = 1;
    this.loadInit(data.id);
  }

  orderParentSelect: OrdersHsk;
  listChild: OrdersHsk[];
  loading: boolean = false;
  row: number = 0;
  recordsTotal: number = 0;
  page: number = 1;
  dmCapdos: DmCapdo[]

  constructor(
    private orderServic: HskOrdersService,
    private notifi: NotificationService,
    private themeSeting: ThemeSettingsService,
    private capdoHskService: DanhMucCapDoService,
    private exportThiSinhDuThiService: ExportThiSinhDuThiService,
  ) {
    this.row = this.themeSeting.settings.rows;
  }

  ngOnInit(): void {
  }

  loadInit(id: number) {
    this.loading = true;
    forkJoin([
      this.capdoHskService.getDataUnlimit(),
      // this.orderServic.getDataByParentIdAndPage(id, this.page, 'id,trangthai_thanhtoan,lephithi,user_id,kehoach_id,thisinh_id,caphsk_id', this.caphsk_id_select),
      this.lopGetStudentByParent(1,this.orderParentSelect.id,100,[],1,'id,trangthai_thanhtoan,lephithi,user_id,kehoach_id,thisinh_id,caphsk_id',this.caphsk_id_select)
    ])
      .subscribe({
        // next: ([dmCapdos, {recordsTotal, data}]) => {
        next: ([dmCapdos,data ]) => {
          this.dmCapdos = dmCapdos;
          // this.recordsTotal = recordsTotal;
          this.listChild = data.length> 0 ? data.map((m,index)=>{
            const user = m['user'];
            m['_indexTable'] = (this.page - 1) * 10 + (index + 1);
            m['_hoten'] = user ? user['name'] : '';
            m['_email'] = user ? user['email'] : '';
            m['_cccd_so'] = user ? user['username'] : '';
            m['_phone'] = user ? user['phone'] : '';
            m['__capdo_covered'] = this.dmCapdos && this.dmCapdos.length > 0 ? (this.dmCapdos.find(f => f.id === m.caphsk_id) ? this.dmCapdos.find(f => f.id === m.caphsk_id).title : '') : ' ';
            m['__lephithi'] = m.lephithi;
            return m
          }): [];

          this.loading = false;

        }, error: (err) => {
          this.loading = false;
          this.notifi.toastError('load dữ liệu không thành công');
        }
      })
  }

  private lopGetStudentByParent(page:number,parent_id:number, limit:number, data:OrdersHsk[],recordsTotal:number,select:string,caphsk:number):Observable<OrdersHsk[]>{

    if(data.length<recordsTotal){

      return this.orderServic.getChildrenByPageAndKehoachAndlimitAndselect(page,parent_id,caphsk,limit,select).pipe(
        switchMap(m=>{
          return this.lopGetStudentByParent(page+1,parent_id,limit,data.concat(...m.data),m['recordsFiltered'],select,caphsk)
        })
      )
    }else{
      return of(data);
    }
  }

  paginate({page}: NgPaginateEvent) {
    this.page = page + 1;
    this.loadInit(this.orderParentSelect.id);
  }

  caphsk_id_select: number = null;

  selectCapdo(event: number) {

    this.caphsk_id_select = event;
    this.page = 1;
    this.loadInit(this.orderParentSelect.id);

  }

  btnExportData() {
    this.notifi.isProcessing(true);
      this.orderServic.getDataByParentIdAndPageUnlimit(this.orderParentSelect.id, 'id,trangthai_thanhtoan,lephithi,user_id,kehoach_id,thisinh_id,caphsk_id', this.caphsk_id_select).subscribe({
        next: (data) => {
          const dataParam = data.length ? data.map((m, index) => {
            const user = m['user'];
            m['_indexTable'] = index + 1;
            m['_hoten'] = user ? user['name'] : '';
            m['_email'] = user ? user['email'] : '';
            m['_cccd_so'] = user ? user['username'] : '';
            m['_phone'] = user ? user['phone'] : '';
            m['__capdo_covered'] = this.dmCapdos && this.dmCapdos.length > 0 ? (this.dmCapdos.find(f => f.id === m.caphsk_id) ? this.dmCapdos.find(f => f.id === m.caphsk_id).title : '') : ' ';
            m['__lephithi'] = m.lephithi;
            const thisinh = m['thisinh'];
            return {
              _indexTable: m['_indexTable'],
              _hoten: m['_hoten'],
              _ngaysinh:thisinh && thisinh['ngaysinh'] ?thisinh['ngaysinh']: '',
              _gioitinh:thisinh ? (thisinh['gioitinh'] =='nam' ?"Nam":"Nữ" ): '',
              _cccd_so: m['_cccd_so'],
              _email: m['_email'],
              _phone: m['_phone'],
              __capdo_covered: m['__capdo_covered'],
              __lephithi: m['__lephithi'],
            }
          }) : [];
          if (dataParam.length >0){
            const titleParams:string = this.orderParentSelect['__dotthi_coverted'] +  (this.caphsk_id_select && this.dmCapdos.find(f=>f.id === this.caphsk_id_select) ? '(' + this.dmCapdos.find(f=>f.id === this.caphsk_id_select).title +')' :'' );
            this.exportThiSinhDuThiService.exportToLongHskDotacSelectcapdo(dataParam,titleParams );
            this.notifi.isProcessing(false);

          }else {
            this.notifi.toastError('không có dữ liệu');
            this.notifi.isProcessing(false);

          }
        },
        error:()=>{
          this.notifi.isProcessing(false);
          this.notifi.toastError('Có lỗi trong quá trình load dữ liệu');

        }
      })

  }
  btnExportDataV2() {
    this.notifi.isProcessing(true);

    this.lopGetStudentByParent(1,this.orderParentSelect.id,100,[],1,'id,trangthai_thanhtoan,lephithi,user_id,kehoach_id,thisinh_id,caphsk_id',this.caphsk_id_select).subscribe({
      next:(data)=>{
        const dataParam = data.length>0 ? data.map((m, index) => {
          const user = m['user'];
          m['_indexTable'] = index + 1;
          m['_hoten'] = user ? user['name'] : '';
          m['_email'] = user ? user['email'] : '';
          m['_cccd_so'] = user ? user['username'] : '';
          m['_phone'] = user ? user['phone'] : '';
          m['__capdo_covered'] = this.dmCapdos && this.dmCapdos.length > 0 ? (this.dmCapdos.find(f => f.id === m.caphsk_id) ? this.dmCapdos.find(f => f.id === m.caphsk_id).title : '') : ' ';
          m['__lephithi'] = m.lephithi;
          const thisinh = m['thisinh'];
          return {
            _indexTable: m['_indexTable'],
            _hoten: m['_hoten'],
            _ngaysinh:thisinh && thisinh['ngaysinh'] ?thisinh['ngaysinh']: '',
            _gioitinh:thisinh ? (thisinh['gioitinh'] =='nam' ?"Nam":"Nữ" ): '',
            _cccd_so: m['_cccd_so'],
            _email: m['_email'],
            _phone: m['_phone'],
            __capdo_covered: m['__capdo_covered'],
            __lephithi: m['__lephithi'],
          }
        }) : [];

        if (dataParam.length >0){
          const titleParams:string = this.orderParentSelect['__dotthi_coverted'] +  (this.caphsk_id_select && this.dmCapdos.find(f=>f.id === this.caphsk_id_select) ? '(' + this.dmCapdos.find(f=>f.id === this.caphsk_id_select).title +')' :'' );
          this.exportThiSinhDuThiService.exportToLongHskDotacSelectcapdo(dataParam,titleParams );
          this.notifi.isProcessing(false);

        }else {
          this.notifi.toastError('không có dữ liệu');
          this.notifi.isProcessing(false);

        }

      },error:()=>{
        this.notifi.toastError('Load dữ liệu không thành công');
      }
    })
    // const dataParam = this.listChild.length>0 ? this.listChild.map((m, index) => {
    //   const user = m['user'];
    //   m['_indexTable'] = index + 1;
    //   m['_hoten'] = user ? user['name'] : '';
    //   m['_email'] = user ? user['email'] : '';
    //   m['_cccd_so'] = user ? user['username'] : '';
    //   m['_phone'] = user ? user['phone'] : '';
    //   m['__capdo_covered'] = this.dmCapdos && this.dmCapdos.length > 0 ? (this.dmCapdos.find(f => f.id === m.caphsk_id) ? this.dmCapdos.find(f => f.id === m.caphsk_id).title : '') : ' ';
    //   m['__lephithi'] = m.lephithi;
    //   const thisinh = m['thisinh'];
    //   return {
    //     _indexTable: m['_indexTable'],
    //     _hoten: m['_hoten'],
    //     _ngaysinh:thisinh && thisinh['ngaysinh'] ?thisinh['ngaysinh']: '',
    //     _gioitinh:thisinh ? (thisinh['gioitinh'] =='nam' ?"Nam":"Nữ" ): '',
    //     _cccd_so: m['_cccd_so'],
    //     _email: m['_email'],
    //     _phone: m['_phone'],
    //     __capdo_covered: m['__capdo_covered'],
    //     __lephithi: m['__lephithi'],
    //   }
    // }) : [];
    // if (dataParam.length >0){
    //   const titleParams:string = this.orderParentSelect['__dotthi_coverted'] +  (this.caphsk_id_select && this.dmCapdos.find(f=>f.id === this.caphsk_id_select) ? '(' + this.dmCapdos.find(f=>f.id === this.caphsk_id_select).title +')' :'' );
    //   this.exportThiSinhDuThiService.exportToLongHskDotacSelectcapdo(dataParam,titleParams );
    //   this.notifi.isProcessing(false);
    //
    // }else {
    //   this.notifi.toastError('không có dữ liệu');
    //   this.notifi.isProcessing(false);
    //
    // }
  }

}
