import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {KeHoachThi} from "@shared/services/hsk-kehoach-thi.service";
import {HskOrdersService, OrdersHsk} from "@shared/services/hsk-orders.service";
import {DanhMucCapDoService} from "@shared/services/danh-muc-cap-do.service";
import {DmCapdo} from "@shared/models/danh-muc";
import {NotificationService} from "@core/services/notification.service";
import {forkJoin, from, Observable, of, switchMap} from "rxjs";
import {ThisinhInfoService} from "@shared/services/thisinh-info.service";
import {ThemeSettingsService} from "@core/services/theme-settings.service";
import {NgPaginateEvent} from "@shared/models/ovic-models";
import {DanhMucHskAddToolService} from "@shared/services/danh-muc-hsk-add-tool.service";
import {map} from "rxjs/operators";
import {ExportExcelHskService} from "@shared/services/export-excel-hsk.service";
import {FileService} from "@core/services/file.service";
import {ThiSinhInfo} from "@shared/models/thi-sinh";
import {ExportZipImageService} from "@shared/services/export-zip-image.service";
import {HskSummaryService} from "@shared/services/hsk-summary.service";


@Component({
  selector: 'app-danh-sach-thi-sinh',
  templateUrl: './danh-sach-thi-sinh.component.html',
  styleUrls: ['./danh-sach-thi-sinh.component.css']
})
export class DanhSachThiSinhComponent implements OnInit {
  @Input() set kehoachthi(a:KeHoachThi){
    this.page = 1;
    this.recordsTotal = 0;
    this.capdo_hsk_id_select = null;
    this._kehoachthi = a;
    this.thisinhInKehoach = [];
    this.getDataOrder(a,1);
  }

  hskk_lever = [
    {label:'Sơ cấp',value:'socap',ten_tiengtrung:'HSKK（初级）'},
    {label:'Trung cấp',value:'trungcap',ten_tiengtrung:'HSKK（中级）'},
    {label:'Cao cấp',value:'caocap',ten_tiengtrung:'HSKK（高级）'},
  ]

  _kehoachthi : KeHoachThi ;
  isLoading: boolean=false;
  thisinhInKehoach:OrdersHsk[];
  dmCapdo:DmCapdo[];
  page:number = 1;
  rows:number =  this.themeSettingsService.settings.rows;
  recordsTotal:number = 0;

  header_excel=['证件姓名*','中文姓名','证件类型*','其它证件名称','证件编号*','性别*','出生日期*','国籍代码*'	,'缴费状态',
    '母语代码*','邮箱',	'联系电话'	,'学习汉语年限*',	'备注',	'考生类型*',	'考生民族*','关联HSKK级别','Nguồn đăng ký','Địa chỉ thường trú'
  ];
  constructor(
    private hskOrdersService:HskOrdersService,
    private dmCapdoService: DanhMucCapDoService,
    private notificationService:NotificationService,
    private thisinhInfoService:ThisinhInfoService,
    private themeSettingsService: ThemeSettingsService,
    private danhMucHskAddToolService:DanhMucHskAddToolService,
    private exportExcelHskService :ExportExcelHskService,
    private fileService:FileService,
    private exportZipSevice: ExportZipImageService,
    private hskSummaryService: HskSummaryService,
  ) {
  }

  ngOnInit(): void {
  }

  getDataOrder(kht:KeHoachThi, page:number){
    this.page =page
    this.notificationService.isProcessing(true);
    this.isLoading = true;
    if(this.dmCapdo && this.dmCapdo.length>0 ){
      this.hskOrdersService.getDataByKehoachthiAndPageByPageKehoacthi(kht.id,page,this.capdo_hsk_id_select).pipe(switchMap(
        (m)=>{
          const parent_ids= m.data.map(a=>a.parent_id).filter(f=>f !== 0);
          const setParent_ids = Array.from(new Set(parent_ids));
          return forkJoin([of(m.recordsTotal),of(m.data),setParent_ids.length>0 ?this.hskOrdersService.getDataByparentIds(setParent_ids,'id,trangthai_thanhtoan,user_id,created_by,updated_by'): of([])]);
        })).
        subscribe({
        next:([recordsTotal, data,dataParent])=>{
          this.recordsTotal =recordsTotal;
          const ids_parent = dataParent.map(m=>m.id);
          this.thisinhInKehoach = data.filter(f=>  !ids_parent.includes(f.id)).map((m,index)=>{
            const thisinh = m['thisinh'];
            const user = m['user'];
            m['__index'] = (this.page - 1)*this.rows + (index+1);
            m['__hoten'] = thisinh? thisinh['hoten']:(user ? user.name:'');
            m['__phone'] = thisinh? thisinh['phone']:(user ? user.phone:'');
            m['__cccd_so'] = thisinh? thisinh['cccd_so']:(user ? user.display_name:'');
            m['__lephithi']= m.lephithi;
            m['__capdo'] = this.dmCapdo.find(f=>f.id === m.caphsk_id) ?this.dmCapdo.find(f=>f.id === m.caphsk_id).title : '';

            const parent = dataParent.find(f=>f.id === m.parent_id)
            const user_thanhtoan = m.trangthai_thanhtoan === 0 ? 'Chưa thanh toán' : (m.trangthai_thanhtoan === 1 ? 'Đã thanh toán' : 'Chờ thanh toán');
            m['__trangthai_thanhtoan'] = parent ? (parent.trangthai_thanhtoan === 0 ? 'Chưa thanh toán' : (parent.trangthai_thanhtoan === 1 ? 'Đã thanh toán' : 'Chờ thanh toán')) : user_thanhtoan
            // m['__ghichu'] = parent ? parent['user']['name'] + ' đăng ký':'';
            if(parent){
              m['__ghichu']= parent && parent['user']? parent['user']['name']:'Đối tác đăng ký'  ;
            }else if ((m.user_id === m['created_by'] && m['updated_by'] === 0) || (m.user_id === m['created_by'] && m['updated_by'] === m.user_id) ){
              m['__ghichu']='Thí sinh tự đăng ký';
            }else {
              m['__ghichu']= 'Admin xét duyệt';
            }


            const statusByMy =  m.trangthai_thanhtoan === 1 ? 1 : (m.trangthai_thanhtoan === 0  ? 0 : 2 );

            m['__status_converted'] = parent ? parent.trangthai_thanhtoan : statusByMy ;

            return m;
          }).filter(f => !f['huy']);
          // });
          this.notificationService.isProcessing(false);
          this.isLoading = false;


        },error:()=>{
          this.isLoading = false;

          this.notificationService.isProcessing(false);
          this.notificationService.toastError('load dữ liệu không thành công');
        }
      })

    }else{
      // this.hskOrdersService.getDataByKehoachthiAndPageAndSearch(kht.id,page,this.capdo_hsk_id_select).pipe(switchMap(prj=>{
      //   return forkJoin([of(prj),this.dmCapdoService.getDataUnlimit()])
      // }))
      this.hskOrdersService.getDataByKehoachthiAndPageAndSearch(kht.id,page,this.capdo_hsk_id_select).pipe(switchMap(
        (m)=>{
          const parent_ids= m.data.map(a=>a.parent_id).filter(f=>f !== 0);
          const setParent_ids = Array.from(new Set(parent_ids));
          return forkJoin([
            of(m.recordsTotal),
            of(m.data),
            setParent_ids.length>0 ? this.hskOrdersService.getDataByparentIds(setParent_ids,'id,trangthai_thanhtoan,user_id,created_by,updated_by'): of([]),
            this.dmCapdoService.getDataUnlimitNotStatus()]);
        })).
        subscribe({
        next:([recordsTotal, data,dataParent, dmCapdo])=>{

          this.dmCapdo = dmCapdo;
          this.recordsTotal =recordsTotal;

          const ids_parant = dataParent.map(m=>m.id);
          this.thisinhInKehoach = data.filter(f=>!ids_parant.includes(f.id)).map((m, index)=>{
            const thisinh = m['thisinh'];
            const parent = m.parent_id !== 0 ? dataParent.find(f=>f.id === m.parent_id) : null ;
            const userByThisinh = m['user'];
            m['__index'] = index +1;


            m['__hoten'] = thisinh? thisinh['hoten']:(userByThisinh ? userByThisinh.name:'');
            m['__phone'] = thisinh? thisinh['phone']:(userByThisinh ? userByThisinh.phone:'');
            m['__cccd_so'] = thisinh? thisinh['cccd_so']:(userByThisinh ? userByThisinh.username:'');
            m['__lephithi']= m.lephithi;
            m['__capdo'] = this.dmCapdo.find(f=>f.id === m.caphsk_id) ?this.dmCapdo.find(f=>f.id === m.caphsk_id).title : '';

            m['__lephithi']= m.lephithi;
            const user_thanhtoan = m.trangthai_thanhtoan === 0 ? 'Chưa thanh toán' : (m.trangthai_thanhtoan === 1 ? 'Đã thanh toán' : 'Chờ thanh toán');
            m['__trangthai_thanhtoan'] = parent ? (parent.trangthai_thanhtoan === 0 ? 'Chưa thanh toán' : (parent.trangthai_thanhtoan === 1 ? 'Đã thanh toán' : 'Chờ thanh toán')) : user_thanhtoan;
            const statusByMy =  m.trangthai_thanhtoan === 1 ? 1 : (m.trangthai_thanhtoan === 0  ? 0 : 2 );
            m['__status_converted'] = parent ? parent.trangthai_thanhtoan : statusByMy ;

            m['__capdo'] = this.dmCapdo.find(f=>f.id === m.caphsk_id) ?this.dmCapdo.find(f=>f.id === m.caphsk_id).title : '';
            // m['__ghichu'] = parent ? parent['user']['name'] + ' đăng ký':'';
            if(parent){
              m['__ghichu']= parent && parent['user']? parent['user']['name']:'Đối tác đăng ký'  ;
            }else if ((m.user_id === m['created_by'] && m['updated_by'] === 0) || (m.user_id === m['created_by'] && m['updated_by'] === m.user_id) ){
              m['__ghichu']='Thí sinh tự đăng ký';
            }else {
              m['__ghichu']= 'Admin xét duyệt';
            }

            return m;

          }).filter(f => !f['huy']);
          // });
          this.notificationService.isProcessing(false);
          this.isLoading = false;
        },error:()=>{
          this.notificationService.isProcessing(false);
          this.isLoading = false;

          this.notificationService.toastError('load dữ liệu không thành công');
        }
      })


    }

  }

  paginate({page}: NgPaginateEvent) {
    this.page = page + 1;
    this.getDataOrder(this._kehoachthi, this.page);
  }


  capdo_hsk_id_select :number = null;
  slelectDrop(event:number){
    this.capdo_hsk_id_select = event;
    this.getDataOrder(this._kehoachthi,this.page);
  }

  btnExportDataThisinhByKehoachV2(){

    this.notificationService.loadingAnimationV2({text:'Đang tải dữ liệu ',  process: {percent: 0}});
    this.notificationService.isProcessing(true);
    this.hskOrdersService.getDataByKehoachIdAndNotwidthXuatdanhSach(this._kehoachthi.id,false,1).pipe(switchMap(prj=>{
      // const ids_thisinh = Array.from(new Set(prj.map(m=>m.thisinh_id)));

      this.notificationService.loadingAnimationV2({text:'Đang tải dữ liệu ',  process: {percent: 25}});

      // const parent_ids = Array.from(new Set(prj.map(m=>m.parent_id).filter(f=>f !== 0)));
      return forkJoin([
        of(prj),
        this.hskSummaryService.getDsThisinhByKehoachId(this._kehoachthi.id).pipe(map(m=>{
          this.notificationService.loadingAnimationV2({text:'Đang tải dữ liệu ',  process: {percent: 50}});

          return m})),
        this.danhMucHskAddToolService.getDataUnlimitByType("quoctich").pipe(map(m=>{
          this.notificationService.loadingAnimationV2({text:'Đang tải dữ liệu ',  process: {percent: 75}});
          return m})),
        this.danhMucHskAddToolService.getDataUnlimitByType("ngonngume").pipe(map(m=>{
          this.notificationService.loadingAnimationV2({text:'Đang tải dữ liệu ',  process: {percent: 100}});

          return m})),
        // this.hskOrdersService.getDataByparentIds(parent_ids,'id,trangthai_thanhtoan,status')

      ])
    })).subscribe({
      next:([order,info,quoctich,ngonngume])=>{

        const dataEx = [];
        const parent_ids = Array.from(new Set(order.map(m=>m.parent_id).filter(f=>f !== 0)));
        const data_TuDangky  = order.filter(f=>f['created_by'] === f.user_id && f.parent_id === 0 && f.caphsk_id !== 0 );
        const data_Dangky_cha  = order.filter(f=>f.caphsk_id === 0);
        // const data_Dangky_con  = order.filter(f=>f['created_by'] !== f.user_id && parent_ids.includes(f.parent_id) );
        const data_Dangky_con  = order.filter(f=>f.parent_id && f.caphsk_id !== 0);

        const data_map = [].concat(data_TuDangky,data_Dangky_con).filter(f=> !f['huy']);
        for(let i = 1;i<=6;i++){
           const order_select  = data_map.filter(f=>f.caphsk_id === i ).length>0?  data_map.filter(f=>f.caphsk_id === i && !f['huy']).map((m,index)=>{
             const thisinh =  info.find(f=>f.user_id == m.user_id);
             // const thisinh = m['thisinh'];
             const user = m['user'];
             const parent  = m.parent_id !== 0 ? data_Dangky_cha.find(f=>f.id === m.parent_id): null;
             const _index_table = index+1;
             const _hoten = thisinh ? this.replaceHoten(thisinh.hoten): (user && user['name'] ? this.replaceHoten(user['name']): '');
             const _hoten_tiengtrung = thisinh && thisinh.hoten_tiengtrung ? thisinh.hoten_tiengtrung: '';
             const _ngaysinh = thisinh ? `'` + this.replaceDatebth(thisinh.ngaysinh): '';
             const _loai_giayto = thisinh && thisinh.loai_giayto? thisinh.loai_giayto : '身份证';
             const _loai_giayto_khac =thisinh && thisinh.loai_giaytokhac? thisinh.loai_giaytokhac : '';
             const _so_cccd:string = thisinh ? ("'" + thisinh.cccd_so.toString()):(user && user['username'] ? user['username']: '');
             const _gioitinh = thisinh ? (thisinh.gioitinh === 'nam' ? '男' :'女'): '';
             const _ma_quoctich = thisinh && thisinh.ma_quoctich  ? thisinh.ma_quoctich : '542';
             const user_thanhtoan= parent ? parent.trangthai_thanhtoan : m.trangthai_thanhtoan;
             const _trangthia_thanhtoan = user_thanhtoan === 1 ? '已缴费': '未缴费';
             const _ngonngu_me = thisinh && thisinh.ngonngu_me ? thisinh.ngonngu_me:'388';
             const _email = thisinh ? thisinh.email :(user ? user['email']: '');
             const _phone = thisinh && `'` + thisinh.phone ? thisinh.phone : (user ? `'` + user['phone']: '');
             const _namhoc_tiengtrung = thisinh && thisinh.namhoc_tiengtrung ? thisinh.namhoc_tiengtrung : '';
             const _ghichu = '';
             const _loai_unngvien =  thisinh && thisinh.loai_unngvien ? thisinh.loai_unngvien: '普通';
             const _quoctich_ungvien = thisinh && thisinh.quoctich_ungvien ? thisinh.quoctich_ungvien :  '';
             const _hskk_lever= this.dmCapdo.find(f=>f.id === i)? this.hskk_lever.find(f=>f.value === this.dmCapdo.find(f=>f.id === i).hskk_lever ).ten_tiengtrung :' ';

             let text = ''
             if(parent){
               text= parent && parent['user']? parent['user']['name']:'Đối tác đăng ký'  ;
             }else if ((m.user_id === m['created_by'] && m['updated_by'] === 0) || (m.user_id === m['created_by'] && m['updated_by'] === m.user_id) ){
               text='Thí sinh tự đăng ký';
             }else {
               text= 'Admin xét duyệt';
             }

             const diachi =thisinh && thisinh['thuongtru_diachi']? thisinh['thuongtru_diachi']['fullAddress'] : '';


             return user_thanhtoan === 1 ? {
               _hoten:_hoten,
               _hoten_tiengtrung:_hoten_tiengtrung,
               _loai_giayto:_loai_giayto,
               _loai_giayto_khac:_loai_giayto_khac,
               _so_cccd :_so_cccd,
               _gioitinh:_gioitinh,
               _ngaysinh:_ngaysinh,
               _ma_quoctich:_ma_quoctich,
               _trangthia_thanhtoan:_trangthia_thanhtoan,
               _ngonngu_me:_ngonngu_me,
               _email:_email,
               _phone:_phone,
               _namhoc_tiengtrung:_namhoc_tiengtrung,
               _ghichu:_ghichu,
               _loai_unngvien:_loai_unngvien,
               _quoctich_ungvien:_quoctich_ungvien,
               _hskk_lever:_hskk_lever,
               _created:text,
               _diachi:diachi

             }: null;

           }): [];
          dataEx.push(order_select.filter(f=>f!== null));
        }


        const ngonngumeConvenrt = ngonngume.map(m=>{
          return {ma_ngonngu:m['ma_ngonngu'],ten:m['ten'],ten_tiengtrung:m['ten_tiengtrung']};
        })
        const quoctichConvenrt = quoctich.map(m=>{
          return {ma_quoctich:m['ma_quoctich'],ten:m['ten'],ten_tiengtrung:m['ten_tiengtrung']};
        })

        this.exportExcelHskService.exportExcel(dataEx, ngonngumeConvenrt,quoctichConvenrt,this.header_excel,this._kehoachthi.dotthi);
        this.notificationService.disableLoadingAnimationV2()
        this.notificationService.isProcessing(false);

      },error:()=>{
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Load dữ liệu không thanh công ');
        this.notificationService.disableLoadingAnimationV2()

      }
    })

  }


  replaceHoten(str:string):string{
    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Loại bỏ dấu
    str = str.replace(/đ/g, "d").replace(/Đ/g, "D"); // Thay 'đ' và 'Đ' bằng 'd' và 'D'
    return str.trim().toUpperCase();

  }

  replaceDatebth(dateString:string) {
    const [day, month, year] = dateString.trim().split("/");
    return `${year}-${month}-${day}`;
  }

  btnExport(){
    this.notificationService.isProcessing(true);
    this.notificationService.loadingAnimationV2({text:'Đang tải dữ liệu',  process: {percent: 0}});
    this.hskOrdersService.getDataByKehoachIdAndNotwidthXuatdanhSach(this._kehoachthi.id,false).pipe(switchMap(prj=>{
      // const ids_thisinh = Array.from(new Set(prj.map(m=>m.thisinh_id)));
      const ids_thisinh_user = Array.from(new Set(prj.map(m=>m.user_id)));
      this.notificationService.loadingAnimationV2({text:'Đang tải dữ liệu ',  process: {percent:50}});
      const parent_ids = Array.from(new Set(prj.map(m=>m.parent_id))).filter(f=>f!== 0);
      return forkJoin([ of(prj),
        this.hskOrdersService.getDataByparentIds(parent_ids,'id,trangthai_thanhtoan'),
        this.thisinhInfoService.getDataByUserIds(ids_thisinh_user).pipe(switchMap(m=>{
          this.notificationService.loadingAnimationV2({text:'Đang tải dữ liệu ',  process: {percent: 70}});
          return forkJoin([of(m),this.loadThiSinhAvatarProcess(m.filter(f=>f.anh_chandung))])
        }))])
    })).subscribe({
      next:([ordd,parentd,[thisinh,avatar]])=>{
        console.log(avatar);

        const parent_ids = Array.from(new Set(ordd.map(m=>m.parent_id).filter(f=>f !== 0)));
        const data_TuDangky  = ordd.filter(f=>f['created_by'] === f.user_id && !parent_ids.includes(f.id) );
        const data_Dangky_cha  = ordd.filter(f=>f['created_by'] === f.user_id && parent_ids.includes(f.id) );
        const data_Dangky_con  = ordd.filter(f=>f['created_by'] !== f.user_id && parent_ids.includes(f.parent_id) );

        const data_map = [].concat(data_TuDangky,data_Dangky_con).filter(f=> !f['huy']);


        const arrMap = this.dmCapdo.map(m=>{
          const order  = data_map.filter(f=>f.caphsk_id === m.id).map(a=>{
            const parrent = parentd.find(b=>b.id === a.parent_id);
            a['__trangthai_thanhtoan'] = parrent ? parrent.trangthai_thanhtoan : a.trangthai_thanhtoan;
            return a;
          }).filter(f=>f.trangthai_thanhtoan === 1);
          // const thisinhIds = Array.from(new Set(order.map(c=>c.thisinh_id)));
          const user_ids = Array.from(new Set(order.map(c=>c.user_id)));

          m['_thisinh'] = Array.from(avatar).filter(d=> user_ids.includes(d.user_id));


          return m;
        })
        this.exportZipSevice.exportImageByZip(arrMap,this._kehoachthi.dotthi,'_avatarSrc')
        this.notificationService.disableLoadingAnimationV2();
        this.notificationService.isProcessing(false);

      },error:(e)=>{
        this.notificationService.disableLoadingAnimationV2();
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Mất kết nối trong quá trình tải file');
      }
    })

  }

  private loadThiSinhAvatarProcess(info: ThiSinhInfo[]): Observable<ThiSinhInfo[]> {
    try {
      const index: number = info.findIndex(t => !t['_avatarLoaded']);
      if (index !== -1) {
        const item = info[index];

        return this.fileService.getFileAsBlobByName(item['anh_chandung'][0].id.toString()).pipe(
          switchMap(blob => {
            // đánh dấu đã load
            info[index]['_avatarLoaded'] = true;

            const safeName = this.replaceHoten(item.hoten);
            const newFileName = `${safeName}_${item.cccd_so}.jpg`;
            const file = new File([blob], newFileName, { type: blob.type || 'image/jpeg' });


            info[index]['_avatarFile'] = file;
            info[index]['_avatarName'] = newFileName;
            return forkJoin<[string, ThiSinhInfo[]]>(
              from(this.fileService.blobToBase64(file)),
              this.loadThiSinhAvatarProcess(info)
            ).pipe(
              map(([src, loadedData]) => {
                loadedData[index]['_avatarSrc'] = src
                  ? src.replace(/^data:.*;base64/, 'data:image/jpeg;base64')
                  : src;
                return loadedData;
              })
            );
          })
        );
      } else {
        return of(info);
      }
    } catch (e) {
      return of(info);
    }
  }

  // private loadThiSinhAvatarProcess(info:ThiSinhInfo[]): Observable<ThiSinhInfo[]> {
  //   try {
  //     const index: number = info.findIndex(t => !t['_avatarLoaded']);
  //     if (index !== -1) {
  //       // return  this.fileService.getFileAsBlobByName(info[index]['anh_chandung'][0].id.toString()).pipe(switchMap(blob => {
  //       //   info[index]['_avatarLoaded'] = true;
  //       //   return forkJoin<[string, ThiSinhInfo[]]>(
  //       //     from(this.fileService.blobToBase64(blob)),
  //       //     this.loadThiSinhAvatarProcess(info)
  //       //   ).pipe(map(([src, loadedData]) => {
  //       //     loadedData[index]['_avatarSrc'] = src ? src.replace('data:application/octet-stream;base64', 'data:image/jpeg;base64') : src;
  //       //     return loadedData;
  //       //   }))
  //       // }))
  //
  //       const item = info[index];
  //       if(item.cccd_so === 'c8282043'){
  //         console.log(item);
  //
  //       }
  //
  //       return this.fileService.getFileAsBlobByName(info[index]['anh_chandung'][0].id.toString()).pipe(
  //         switchMap(blob => {
  //           info[index]['_avatarLoaded'] = true;
  //
  //           // 👉 Đổi tên file ở đây
  //           const newFileName = `${this.replaceHoten(item.hoten)}_${item.cccd_so}.jpg`;
  //           const file = new File([blob], newFileName, { type: blob.type });
  //
  //           // Lưu lại vào info nếu muốn dùng sau
  //           info[index]['_avatarFile'] = file;
  //           info[index]['_avatarName'] = newFileName;
  //           return forkJoin<[string, ThiSinhInfo[]]>(
  //             from(this.fileService.blobToBase64(file)), // convert file thay vì blob
  //             this.loadThiSinhAvatarProcess(info)
  //           ).pipe(
  //             map(([src, loadedData]) => {
  //               loadedData[index]['_avatarSrc'] = src
  //                 ? src.replace('data:application/octet-stream;base64', 'data:image/jpeg;base64')
  //                 : src;
  //               return loadedData;
  //             })
  //           );
  //         })
  //       );
  //     } else {
  //       return of(info)
  //     }
  //   } catch (e) {
  //     return of(info)
  //   }
  // }




}
