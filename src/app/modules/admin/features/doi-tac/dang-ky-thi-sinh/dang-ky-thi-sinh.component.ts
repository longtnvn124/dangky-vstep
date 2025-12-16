import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ThisinhInfoService} from "@shared/services/thisinh-info.service";
import {HskOrdersService, OrdersHsk} from "@shared/services/hsk-orders.service";
import {HskKehoachThiService, KeHoachThi} from "@shared/services/hsk-kehoach-thi.service";
import {DanhMucCapDoService} from "@shared/services/danh-muc-cap-do.service";
import {NotificationService} from "@core/services/notification.service";
import {forkJoin, Observable, of, pipe, Subscription, switchMap} from "rxjs";
import {DmCapdo} from "@shared/models/danh-muc";
import * as XLSX from "xlsx";
import {RegisterAccountService} from "@shared/services/register-account.service";
import {catchError, finalize, tap} from "rxjs/operators";
import {UserService} from "@core/services/user.service";
import {AuthService} from "@core/services/auth.service";
import {ThemeSettingsService} from "@core/services/theme-settings.service";
import {NgPaginateEvent} from "@shared/models/ovic-models";
import {Paginator} from "primeng/paginator";
import {HelperService} from "@core/services/helper.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SenderEmailService} from "@shared/services/sender-email.service";
import {RegisterUserService} from "@shared/services/register-user.service";
import {HskDoitacCheckService} from "@shared/services/hsk-doitac-check.service";
import {DATA_UNIT_START_TEST} from "@shared/utils/syscat";
import {parseHtmlGracefully} from "@angular/core/schematics/utils/parse_html";
import {HskKehoachCapdo, KehoachthiCapdoService} from "@shared/services/kehoachthi-capdo.service";

type AOA = any[][];

@Component({
  selector: 'app-dang-ky-thi-sinh',
  templateUrl: './dang-ky-thi-sinh.component.html',
  styleUrls: ['./dang-ky-thi-sinh.component.css']
})
export class DangKyThiSinhComponent implements OnInit {
  @ViewChild('fromViewRegiter', {static: true}) viewRegiter: TemplateRef<any>;

  @ViewChild(Paginator) paginator: Paginator;
  ngType: number = 0;
  isLoading: boolean = false;
  file_name: string;

  dmCapdo: DmCapdo[];
  kehoanhThi: KeHoachThi[];
  kehoanhThiAll: KeHoachThi[];


  ketquaImportView: any[] = [];
  ketquaImportViewPayment: any[] = [];

  modalAddOrder: boolean = false;
  check_accept: boolean = false;

  hskk_lever = [
    {label: 'Sơ cấp', value: 'socap', ten_tiengtrung: 'HSKK（初级）'},
    {label: 'Trung cấp', value: 'trungcap', ten_tiengtrung: 'HSKK（中级）'},
    {label: 'Cao cấp', value: 'Cao cấp', ten_tiengtrung: 'HSKK（高级）'},
  ];

  kehoach_id_select: number;

  errorFileType: boolean = false;
  loading: boolean = false;

  typeView: number = 1;


  recordTotal: number = 0;
  listData: OrdersHsk[];
  page: number = 1;
  rows: number;
  sizeFullWidth:number =1024;
  subscription = new Subscription();
  dothi_id: number = null;
  notifi_loadding: boolean = false;
  listCheckResult: any[] = [];
  menuName:string = 'view';
  orderParent: OrdersHsk;
  constructor(
    private themeSetting: ThemeSettingsService,
    private thisinhInfoService: ThisinhInfoService,
    private orderService: HskOrdersService,
    private hskKehoachThiService: HskKehoachThiService,
    private capdoHskService: DanhMucCapDoService,
    private notifi: NotificationService,
    private registerUserService: RegisterUserService,
    private auth: AuthService,
    private helperService: HelperService,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private senderEmailService: SenderEmailService,
    private hskDoitacCheckService: HskDoitacCheckService,
    private kehoachthiCapdoService: KehoachthiCapdoService
  ) {
    this.rows = this.themeSetting.settings.rows;
    const observerOnResize = this.notifi.observeScreenSize.subscribe(size => this.sizeFullWidth = size.width)
    this.subscription.add(observerOnResize);

  }

  ngOnInit(): void {
    this.activeRouter.queryParams.subscribe(params => {
      const queryString = this.createQueryString(params);
      if (queryString) {
        this.checkCodeParram('?' + queryString);
      }
    });
    this.loadInit();
  }

  createQueryString(params: any): string {
    let queryString = '';
    Object.keys(params).forEach(key => {
      if (queryString !== '') {
        queryString += '&';
      }
      queryString += `${key}=${encodeURIComponent(params[key])}`;
    });
    return queryString;
  }

  checkCodeParram(text: string) {
    this.notifi.isProcessing(true);
    this.orderService.checkPaymentByUser(text).subscribe({
      next: () => {
        this.ngType = 1;
        this.notifi.isProcessing(false);
      },
      error: () => {
        this.ngType = -1;
        this.notifi.isProcessing(false);
        this.notifi.toastError('Bạn chưa thanh toán!');
      },
    })
  }

  btnchecksite() {
    this.ngType = 0;
    this.router.navigate(['admin/doi-tac/dang-ky-thi-sinh/']);
    this.loadInit();
  }



  loadInit() {
    this.notifi.isProcessing(true);
    forkJoin([
      this.capdoHskService.getDataUnlimit(),
      this.hskKehoachThiService.getDataUnlimitNotstatus(),
    ]).subscribe({
      next: ([dmCapdo, kehoachthi]) => {
        this.dmCapdo = dmCapdo.map((m, index) => {
          m['_index'] = index + 1;
          return m;
        });
        this.kehoanhThi = kehoachthi.filter(f => f.status === 1);
        this.kehoanhThiAll = kehoachthi;

        if (this.dmCapdo && this.kehoanhThi) {
          this.loadData(1)
        }
        this.modalAddOrder = false;
        this.notifi.isProcessing(false);
      }, error: () => {
        this.modalAddOrder = false;
        this.notifi.isProcessing(false);
        this.notifi.toastError('Load dữ liệu không thành công');

      }
    })
  }

  btrSwitchType(type: number) {
    this.typeView = type;
    if (this.typeView === 1) {
      this.page = 1;
      this.modalAddOrder = false;
      this.loadData(1)
    } else {
      this.file_name = '';
      this.ketquaImportView = [];
      this.ketquaImportViewPayment = [];
    }
  }


  selectkehoachthiBySiteKetqua(event) {
    this.dothi_id = event;
    this.loadData(this.page);
  }

  loadData(page: number) {
    this.modalAddOrder = false;
    this.notifi.isProcessing(true);

    this.orderService.getDataByKehoachIdAndPageAndparentIdNotChildren(
      this.dothi_id, page, 0, 'id,trangthai_thanhtoan,lephithi,kehoach_id,created_at,thoigian_thanhtoan,user_id,thisinh_id', this.auth.user.id).
      pipe(switchMap(m=>
      {return forkJoin([ of(m['recordsTotal']),this.loopGetTotalChild(m['data'],this.auth.user.id)])
      }))
      .subscribe({
      next: ([recordsTotal, data]) => {
        this.recordTotal = recordsTotal;
        this.listData = data.map((m, index) => {
          const child = m['children']
          const user = m['user'];
          m['__index_table'] =  this.page*10 + (index + 1);
          // m['__child'] = child ? child : [];
          // m['__child_lenghlt'] = child.length;

          m['__recordsTotal']= m['recordsTotal'] ? m['recordsTotal']: 0;
          m['__donviName'] = user ? user['name'] : this.auth.user.display_name;
          m['__dotthi_coverted'] = this.kehoanhThiAll.find(f => f.id === m.kehoach_id) ? this.kehoanhThiAll.find(f => f.id === m.kehoach_id).dotthi : '';
          m['__ngay_dangky'] = m['created_at'] ? this.formatSQLDateTime(new Date(m['created_at'])) : '';
          m['__ngay_thanhtoan'] = m['thoigian_thanhtoan'] ? this.formatSQLDateTime(new Date(m['thoigian_thanhtoan'])) : '';
          return m;
        })
        this.notifi.isProcessing(false);

      }, error: (e) => {
        this.notifi.isProcessing(false);
        this.notifi.toastError('Load dữ liệu không thành công ');
      }
    })
  }

  private loopGetTotalChild(data:OrdersHsk[], user_id:number):Observable<OrdersHsk[]>{
    const index = data.findIndex(f=>!f['recordsTotal']);
    if( index !== -1){

      return  this.orderService.getTotalChildByParentID(data[index].id ,user_id).pipe(switchMap(m=>{
          data[index]['recordsTotal']= m;
        return this.loopGetTotalChild(data,user_id)
      }))
    }else{
      return  of(data);
    }

  }

  formatSQLDateTime(date: Date): string {
    const y = date.getFullYear().toString();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    const h = date.getHours().toString().padStart(2, '0');
    const min = date.getMinutes().toString().padStart(2, '0');
    const sec = '00';
    //'YYYY-MM-DD hh:mm:ss' type of sql DATETIME format
    return `${d}-${m}-${y} ${h}:${min}`;
  }

  paginate({page}: NgPaginateEvent) {
    this.page = page + 1;
    this.loadData(this.page);
  }

  inputFile() {
    const inputFile: HTMLInputElement = Object.assign(document.createElement('input'), {
      type: 'file',
      accept: '.xlsx',
      multiple: false,
      onchange: () => {
        this.onDroppedFiles(inputFile.files);

        setTimeout(() => inputFile.remove(), 1000)
      }
    });
    inputFile.click();


  }

  onDroppedFiles(fileList: FileList) {
    const file: File = fileList.item(0);
    this.file_name = file.name;
    this.errorFileType = !(file && this.validateExcelFile(file));
    if (!this.errorFileType) {
      this.loading = true;

      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const wb: XLSX.WorkBook = XLSX.read(e.target.result, {type: 'binary'});

        /* grab first sheet */

        let arrData = [];


        for (let i = 0; i < 6; i++) {
          const sheetNameSelect = wb.SheetNames[i];
          const ws: XLSX.WorkSheet = wb.Sheets[sheetNameSelect];
          const rawData: AOA = <AOA>(XLSX.utils.sheet_to_json(ws, {header: 1}));
          const filterData = rawData.filter(u => !!(Array.isArray(u) && u.length));
          filterData.shift();
          if (filterData.length > 0) {
            const arr = this.covertDataExport(filterData, i + 1);
            arrData = [].concat(...arrData, arr);
          }
        }
        this.ketquaImportView = arrData;

        // this.ketquaImportViewPayment = this.convertInmPortPayment(arrData, 'hsk_capdangky').map(m => {
        //   const capdo = this.dmCapdo.find(f => f.id === parseInt(m.cap_hsk))
        //   m['_capdo_hsk_convent'] = capdo ? capdo.title : '';
        //   m['_dongia'] = capdo ? capdo.gia : '';
        //   m['_thanhtien'] = capdo ? capdo.gia * parseInt(String(m.soluong)) : 0;
        //
        //   return m;
        // });
      };
      reader.readAsBinaryString(file);
    } else {
      this.errorFileType = true;
      this.loading = false;
    }

  }

  validateExcelFile(file: File): boolean {
    return file.name ? file.name.split('.').pop().toLowerCase() === 'xlsx' : false;
  }

  covertDataExport(datafile: any, capdo_hsk: number) {
    const data: any[] = [];

    datafile.forEach(row => {
      const cell = {
        hoten: row[0],
        hoten_tiengtrung: row[1],
        loai_giayto: row[2],
        loai_giaytokhac: row[3],
        cccd_so: row[4].trim(),
        gioitinh: row[5],
        ngaysinh: row[6],
        ma_quoctich: row[7] ,
        trangthai_thanhtoan: row[8],
        ngonngu_me: row[9],
        email: row[10].trim(),
        phone: row[11],
        namhoc_tiengtrung: row[12],
        ghichu: row[13],
        loai_unngvien: row[14],
        quoctich_ungvien: row[15],
        hskk_lever: row[16],
        hsk_capdangky: capdo_hsk
      }

      data.push(cell)
    })

    return data;


  }

  convertInmPortPayment(arr: any[], key: string) {
    const counts = arr.reduce((acc, obj) => {
      const value = obj[key];
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([name, soluong]) => ({cap_hsk: name, soluong: soluong}));
  }

  delelteItemImport(item) {
    this.ketquaImportView = this.ketquaImportView.filter(f => f['cccd_so'] !== item['cccd_so']);
    this.ketquaImportViewPayment = this.convertInmPortPayment(this.ketquaImportView, 'hsk_capdangky').map(m => {
      const capdo = this.dmCapdo.find(f => f.id === parseInt(m.cap_hsk))
      m['_capdo_hsk_convent'] = capdo ? capdo.title : '';
      m['_dongia'] = capdo ? capdo.gia : '';
      m['_thanhtien'] = capdo ? capdo.gia * parseInt(String(m.soluong)) : 0;
      return m;
    });
  }

  changeKehoachthi(event) {
    this.kehoach_id_select = event.value;
    this.listCheckResult = [];
    this.ketquaImportViewPayment = [];
  }

  btnSubmitData() {
    this.modalAddOrder = true;
    this.listCheckResult = [];
    this.ketquaImportViewPayment = [];
  }

  btnReset() {
    this.ketquaImportView = [];
    this.file_name = '';
  }

  generate_password() {
    const lower = 'abcdefghijklmnopqrstuvwxyz'; // Chữ cái thường
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Chữ cái hoa
    const digits = '0123456789';                 // Số
    const symbols = '#?!@$%^&*-'; // Ký tự đặc biệt
    const requiredCharacters = [
      lower[Math.floor(Math.random() * lower.length)], // Một chữ cái thường
      upper[Math.floor(Math.random() * upper.length)], // Một chữ cái hoa
      digits[Math.floor(Math.random() * digits.length)], // Một số
      symbols[Math.floor(Math.random() * symbols.length)], // Một ký tự đặc biệt
    ];
    const allCharacters = lower + upper + digits + symbols;
    while (requiredCharacters.length < 12) {
      requiredCharacters.push(allCharacters[Math.floor(Math.random() * allCharacters.length)]);
    }
    return requiredCharacters.sort(() => Math.random() - 0.5).join('');
  }

  getTotalThanhtien(arr, key: string): number {
    return arr.reduce((sum, item) => sum + item[key], 0);
  }

  btnPayment() {
    if (this.kehoach_id_select) {
      if (this.listCheckResult.length > 0) {
        this.notifi.loadingAnimationV2({process: {percent: 0}});
        this.createUserLogin(this.listCheckResult).pipe(
          // switchMap(data => this.loopEmailByThiSinh(data, step, 0),),
          switchMap(data => {
            this.notifi.loadingAnimationV2({process: {percent: 25}});
            return this.loopCreatUserInfo(data);
          }),

          switchMap(data2 => {
            this.notifi.loadingAnimationV2({process: {percent: 50}});
            return this.createOrder(data2);
          }),
          switchMap(() => {
            this.notifi.loadingAnimationV2({process: {percent: 75}});
            return this.sendEmail(this.auth.user, this.kehoach_id_select, this.ketquaImportViewPayment);
          }),

        ).subscribe({
          next: (data) => {
            this.notifi.toastSuccess('Đăng ký thi thành công');
            this.notifi.disableLoadingAnimationV2()
            this.loading = false;
            this.isLoading = false;
            this.typeView = 1;
            this.page = 1;
            this.loadData(1);
          },
          error: (e) => {
            this.loading = false;
            this.isLoading = false;
            this.notifi.disableLoadingAnimationV2()
            this.notifi.toastError('Đã có lỗi trong quá trình thực hiện đăng ký');
          }
        })
      } else {
        this.notifi.toastError('Hệ thống chưa ghi nhận có thí sinh được import');
      }

    } else {
      this.notifi.toastError('Vui lòng chọn đợt thi đăng ký cho thí sinh');
    }
  }


  private createUserLogin(data: any[]): Observable<any[]> {
    const index: number = data.findIndex(i => i['__user_id'] == 0 );
    if (index !== -1) {
      const item = data[index];
      const itemRegiter = {
        username: item.cccd_so.trim(),
        email: item.email,
        password: this.generate_password(),
        display_name: item.hoten,
        phone: item.cccd_so.trim() + '_'+ item.phone,
        // verify_url: `${location.origin}${this.router.serializeUrl(this.router.createUrlTree(['verification/']))}`
        verify_url: `https://hsk.tnu.edu.vn/verification`
      }

      // data[index]['__canUser'] = true;
      return this.registerUserService.creatUser(itemRegiter).pipe(
        switchMap((prj) => {
            data[index]['__user_id'] = parseInt(prj['data']);
            data[index]['__have_old_user'] = parseInt['user_exist'];
            data[index]['__have_send_email'] = prj['verified'] === 1;
            return this.createUserLogin(data)
          }
        ))
    } else {

      return of(data);
    }
  }
  private loopCreatUserInfo(data: any[]): Observable<any[]> {

    const index: number = data.findIndex(i => !i['__canInfo']);
    if (index !== -1) {

      const item = data[index];
      const itemCreate = {
        user_id: item['__user_id'],
        hoten: item['hoten'],
        namhoc_tiengtrung: this.replaceNamhoc(item['namhoc_tiengtrung'].trim()),
        hoten_tiengtrung: item['hoten_tiengtrung'],
        ten: item['hoten'].trim().split(' ').pop(),
        ngaysinh: this.replaceBirth(item['ngaysinh']),
        gioitinh: item['gioitinh'].trim() === '男' ? 'nam' : 'nu',
        phone: item['phone'].replace(/'/g,""),
        cccd_so: item['cccd_so'].replace(/'/g,""),
        status: 0,
        camket: 1,
        quoctich: 0,//0: viet nam , 1 nuoc ngoai
        email: item['email'],
        ghichu: item['ghichu'],
        loai_giayto: item['loai_giayto'],
        loai_giaytokhac: item['loai_giaytokhac'],
        ma_quoctich: item['ma_quoctich'],
        ngonngu_me: item['ngonngu_me'],
        loai_unngvien: item['loai_unngvien'],
        quoctich_ungvien: item['quoctich_ungvien'],
        hskk_lever: this.hskk_lever.find(f => f.ten_tiengtrung === item['hskk_lever']) ? this.hskk_lever.find(f => f.ten_tiengtrung === item['hskk_lever']).value : item['hskk_lever'],
      }
      data[index]['__canInfo'] = true;
      return this.thisinhInfoService.create(itemCreate).pipe(
        switchMap(m => {
          data[index]['__thisinh_id'] = m ? m : null;
          return this.loopCreatUserInfo(data)
        }))
    } else {
      return of(data);
    }

  }

  replaceBirth(dateString: string) {
    if (dateString) {
      const [year, month, day] = dateString.trim().split("-");
      return `${day}/${month}/${year}`;
    } else {
      return null;
    }
  }

  replaceNamhoc(str: string) {
    const match = str.match(/\d+/); // Tìm các chữ số trong chuỗi
    return match ? parseInt(match[0], 10) : null;
  }

  private createOrder(data: any[]) {

    const itemCreated = {
      user_id: this.auth.user.id,
      kehoach_id: this.kehoach_id_select,
      lephithi: this.getTotalThanhtien(this.ketquaImportViewPayment, '_thanhtien')
    }
    return this.orderService.create(itemCreated).pipe(switchMap(m => {
      itemCreated['id'] = m;
      return this.loopCreatedOrder(data, itemCreated);
    }));

  }

  private loopCreatedOrder(data: any, itemParent: any, ) {
    const index: number = data.findIndex(i => !i['__canOrder']);
    if (index !== -1) {
      const item = data[index];

      const itemCreate = {
        parent_id: itemParent['id'],
        kehoach_id: itemParent['kehoach_id'],
        caphsk_id: item['hsk_capdangky'],
        user_id: item['__user_id'],
        lephithi: this.dmCapdo.find(f => f.id === item['hsk_capdangky']).gia,
        thisinh_id: item['__thisinh_id'],

      }
      data[index]['__canOrder'] = true;

      return this.orderService.create(itemCreate).pipe(
        switchMap((m) => {
          return this.loopCreatedOrder(data, itemParent)
        }))
    } else {
      return of(data);
    }

  }

  btnItemPayment(item: OrdersHsk) {
    const kehoachSelect = this.kehoanhThiAll.find(f => f.id === item.kehoach_id)
    if (kehoachSelect.status === 1) {
      this.isLoading = true;
      if (this.helperService.formatSQLDate(new Date()) <= this.helperService.formatSQLDate(new Date(kehoachSelect.ngayketthuc))) {
        const fullUrl: string = `${location.origin}${this.router.serializeUrl(this.router.createUrlTree(['admin/doi-tac/dang-ky-thi-sinh/']))}`;
        const content = 'TNU-HSK' + item.id;
        this.orderService.getPayment(item.id, fullUrl, content).subscribe({
          next: (data) => {
            window.location.assign(data['data']);
            this.ngType = 0;
            this.notifi.isProcessing(false);
            this.isLoading = false;
          }, error: () => {
            this.isLoading = false;
            this.notifi.isProcessing(false);
          }
        })
      } else {
        this.isLoading = false;
        this.notifi.toastError('Đã hết thời hạn đăng ký trong đợt thi này');
      }
    } else {
      this.notifi.toastWarning('Đã hết thời hạn đăng ký trong đợt thi này');
    }
  }


  async btnDeleteItem(item: OrdersHsk) {
    const confirm = await this.notifi.confirmDelete();
    if (confirm) {
      forkJoin([
        this.orderService.getDataChildByparentIds([item.id], 'id,parent_id,user_id,thisinh_id').pipe(
          switchMap(m => {
            const step: number = 100 / m.length;
            return this.loopDeleteItemChildById(m, step, 0)
          })
        ),
        this.orderService.delete(item.id),
      ]).subscribe({
        next: () => {
          this.page = Math.max(1, this.page - (this.listData.length > 1 ? 0 : 1));
          this.notifi.isProcessing(false);
          this.notifi.toastSuccess('Thao tác thành công');
          this.notifi.disableLoadingAnimationV2()
          this.loadData(this.page);

        }, error: () => {
          this.notifi.disableLoadingAnimationV2()
          this.notifi.isProcessing(false);
          this.notifi.toastError('Thao tác không thành công');
        }
      })
    }

  }

  loopDeleteItemChildById(data: OrdersHsk[], step: number, percent: number) {
    const index: number = data.findIndex(i => !i['__canDelete']);
    if (index !== -1) {
      const item = data[index];
      data[index]['__canDelete'] = true;
      const newPercent: number = percent + step;
      this.notifi.loadingAnimationV2({process: {percent: newPercent}});
      return this.orderService.delete(item.id).pipe(
        switchMap(() => {

            return this.loopDeleteItemChildById(data, step, newPercent)
          }
        ))
    } else {
      return 'comple';
    }
  }


  sendEmail(user, kehoach_id: number, arrCapdo: any[]) {

    let message = `

        <p>Bạn đã đăng ký thi Bài thi đánh giá năng lực tiếng trung HSK của Đại học Thái Nguyên (TNU):</p>

        <p style="font-weight:700;">THÔNG TIN ĐĂNG KÝ:</p>
        <table width="100%" style="border:0;">
            <tr>
                <td style="width:100px;">Đối tác: </td>
                <td style="font-weight:600">${user.display_name}</td>
            </tr>
            <tr>
                <td style="width:100px;">đợt thi đăng ký: </td>
                <td style="font-weight:600">${this.kehoanhThi.find(f => f.id === kehoach_id) ? this.kehoanhThi.find(f => f.id === kehoach_id).dotthi : ''}</td>
            </tr>
        </table>

        <p>CẤP ĐỘ ĐĂNG KÝ</p>
        <table style=" border: 1px solid black;border-collapse: collapse;">
          <tr style="border: 1px solid black;border-collapse: collapse;">
            <th style="border: 1px solid black;border-collapse: collapse;text-align:center;" width="50px"><strong>STT</strong></th>
            <th style="border: 1px solid black;border-collapse: collapse;text-align:center;" width="150px"><strong>Cấp HSK</strong></th>
            <th style="border: 1px solid black;border-collapse: collapse;text-align:center;" width="150px"><strong>Số lượng</strong></th>
            <th style="border: 1px solid black;border-collapse: collapse;text-align:center;" width="150px"><strong>Đơn giá </strong></th>
            <th style="border: 1px solid black;border-collapse: collapse;text-align:center;" width="150px"><strong>Thành tiền </strong></th>
          </tr>

    `;
    arrCapdo.forEach((m, index) => {
      message += `
         <tr style="border: 1px solid black;border-collapse: collapse;">
            <td style="border: 1px solid black;border-collapse: collapse;text-align:center;">${index + 1}</td>
            <td style="border: 1px solid black;border-collapse: collapse;text-align:center;">${m['_capdo_hsk_convent']}</td>
            <td style="border: 1px solid black;border-collapse: collapse;text-align:center">${m['soluong']}</td>
            <td style="border: 1px solid black;border-collapse: collapse;text-align:right;">${parseInt(String(m['_dongia'])).toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND'
      })}</td>
            <td style="border: 1px solid black;border-collapse: collapse;text-align:right;">${parseInt(String(m['_thanhtien'])).toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND'
      })}</td>
          </tr>
      `;
    })


    message += `
    <tr>
        <th colspan="4" style="border: 1px solid black;border-collapse: collapse;"><strong>Tổng (VNĐ)</strong></th>
        <td style="border: 1px solid black;border-collapse: collapse;text-align:right;"><strong> ${parseInt(String(this.getTotalThanhtien(arrCapdo, '_thanhtien'))).toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND'
    })}</strong></td>
    </tr>
    </table>
    <p style="color: #ce3b04;">- Trạng thái thanh toán: Chưa thanh toán.</p>
    <p>- Bạn vui lòng thanh toán lệ phí thi để hoàn tất quá trình đăng ký .</p>
`;
    const emailsend: any = {
      to: this.auth.user.email,
      title: ' Email thông báo đăng ký thành công',
      message: message
    }
    this.notifi.isProcessing(true)
    return this.senderEmailService.sendEmail(emailsend).pipe(
      catchError(() => {
        this.notifi.toastError('Hệ thống gửi Email đăng ký không thành công');
        this.notifi.isProcessing(false);
        return of('comple')
      }),
      switchMap(e => {
        this.notifi.toastSuccess("Hệ thống gửi Email đăng ký thi thành công.");
        this.notifi.isProcessing(false);
        return of(e);
      })
    )
  }


  tableCapdo : HskKehoachCapdo[]
  checkTabelCapdo: boolean = false;
  checkthisinhAffterImport() {
    this.tableCapdo = null;
    this.checkTabelCapdo = false;
    const datacheck = JSON.parse(JSON.stringify(this.ketquaImportView));
    this.notifi_loadding = true;
    if (this.kehoach_id_select && datacheck.length > 0) {
      this.loopCheckInfo(datacheck).pipe(
        finalize(() => this.notifi_loadding = false) // Đảm bảo loading được tắt
      ).pipe(switchMap((m)=>{
        return forkJoin([
          of(m),
          this.orderService.getDataMonSelect(this.kehoach_id_select),
          this.kehoachthiCapdoService.getDataUnlimitAndKehoachId(this.kehoach_id_select)
        ])
      })).subscribe({
        next: ([data,hsk_capdo,kehoach_capdo]) => {
          // console.log("Kết quả kiểm tra:", data.filter(f => f['__check']?.has_payment == 0));
          const dataParam  = data.filter(f => f['__check']?.has_payment == 0).map(m=>{
            m['__user_id'] = m['__check']['user_id'] ? m['__check']['user_id'] : 0 ;
            return m;
          })
          this.listCheckResult = dataParam;

          const caphsk_ids = Array.from(new Set(dataParam.map(m=>m['hsk_capdangky'] + '')));
          this.tableCapdo = kehoach_capdo.map(m=>{
            m['_haveUse'] = caphsk_ids.includes(m.caphsk_id.toString());
            const soluong = m.soluong;

            const caodo =hsk_capdo.find(f=>f.caphsk_id == m.caphsk_id.toString()) ?  hsk_capdo.find(f=>f.caphsk_id == m.caphsk_id.toString()).total : 0;

            const soluonghsk_id = dataParam.filter(f=>f['hsk_capdangky'] === m.caphsk_id).length


            const soluongconlai =(soluong -caodo) >0 ?(soluong -caodo) : 0;
            m['__remaining']   = soluongconlai;
            m['__soluong_search'] = soluongconlai === 0 && soluonghsk_id === 0 ? 0 : ( (soluongconlai - soluonghsk_id) <= 0 ? 0 : (soluongconlai - soluonghsk_id) ) ;


            m['_title'] = this.dmCapdo.find(f=>f.id === m.caphsk_id) ? this.dmCapdo.find(f=>f.id === m.caphsk_id).title :'';
            return m;
          });
          this.checkTabelCapdo = !this.tableCapdo.some(item => item['_haveUse'] && item['__soluong_search'] <= 0);
          this.ketquaImportViewPayment = this.convertInmPortPayment(this.listCheckResult, 'hsk_capdangky').map(m => {
            const capdo = this.dmCapdo.find(f => f.id === parseInt(m.cap_hsk))
            m['_capdo_hsk_convent'] = capdo ? capdo.title : '';
            m['_dongia'] = capdo ? capdo.gia : '';
            m['_thanhtien'] = capdo ? capdo.gia * parseInt(String(m.soluong)) : 0;

            return m;
          });

        },
        error: (err) => {
          console.error("Lỗi khi kiểm tra:", err);
        }
      });
    } else {
      this.notifi_loadding = false;
      this.notifi.toastError('Vui lòng chọn đợt đăng ký hoặc danh sách thí sinh import');
    }
  }

  private loopCheckInfo(data: any[]): Observable<any[]> {
    const index: number = data.findIndex(i => !i['have_check']);
    if (index !== -1) {
      data[index]['have_check'] = true;
      const check = data[index];
      const item = {
        username: check["cccd_so"],
        email: check['email'],
        phone: check['phone'],
        caphsk_id: check['hsk_capdangky'],
        kehoach_id: this.kehoach_id_select
      };
      return this.hskDoitacCheckService.check(item).pipe(
        switchMap(m => {
          data[index]['__check'] = m;
          return this.loopCheckInfo(data);
        })
      );
    } else {
      return of(data);
    }
  }



  private preSetupForm(name: string) {
    this.notifi.isProcessing(false);
    this.notifi.openSideNavigationMenu({
      name,
      template: this.viewRegiter,
      size: this.sizeFullWidth,
      offsetTop: '0px'
    });
  }
  closeForm() {
    // this.loadInit();
    this.notifi.closeSideNavigationMenu(this.menuName);
  }
  btnViewThisinhBydangky(item :OrdersHsk){
    this.orderParent = {... item};
    this.notifi.isProcessing(true);
    this.preSetupForm(this.menuName);

  }
}

