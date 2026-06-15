import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HskHoidongthi} from "@shared/services/hsk-hoidongthi.service";
import {NotificationService} from "@core/services/notification.service";
import {HoidongThisinh, VstepHoidongThisinhService} from "@shared/services/vstep-hoidong-thisinh.service";
import {OrdersVstep, VstepOrdersService} from "@shared/services/vstep-orders.service";
import {ThisinhInfoService} from "@shared/services/thisinh-info.service";
import {DonViService} from "@shared/services/don-vi.service";
import {AuthService} from "@core/services/auth.service";
import {DonVi} from "@shared/models/danh-muc";
import {ConditionOption} from "@shared/models/condition-option";
import {OvicQueryCondition} from "@core/models/dto";
import {debounceTime, forkJoin, Observable, of, Subject, switchMap} from "rxjs";
import {ThiSinhInfo} from "@shared/models/thi-sinh";
import {Hoidongthi} from "@shared/services/vstep-hoidong-thi.service";
import {PaginatorModule} from "primeng/paginator";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {MatMenuModule} from "@angular/material/menu";
import {InputTextModule} from "primeng/inputtext";
import {TableModule} from "primeng/table";
import {NgPaginateEvent} from "@shared/models/ovic-models";
import {BUTTON_NO, BUTTON_YES} from "@core/models/buttons";
import {map} from "rxjs/operators";
import {SplitterModule} from "primeng/splitter";
import {KehoachthiDiemduthi, KehoachthiDiemthiVstepService} from "@shared/services/vstep/kehoachthi-diemthi-vstep.service";
import {DialogModule} from "primeng/dialog";
import {RadioButtonModule} from "primeng/radiobutton";
import {SharedModule} from "@shared/shared.module";
import {SumDiemduthi} from "@modules/admin/features/thi-sinh/thi-sinh-dang-ky/thi-sinh-dang-ky.component";

@Component({
  selector: 'app-add-thi-sinh-v2',
  standalone: true,
  imports: [CommonModule, PaginatorModule, ButtonModule, RippleModule, MatMenuModule, InputTextModule, TableModule, SplitterModule, DialogModule, RadioButtonModule, SharedModule],
  templateUrl: './add-thi-sinh-v2.component.html',
  styleUrls: ['./add-thi-sinh-v2.component.css']
})
export class AddThiSinhV2Component implements OnInit {
  @Input() set hoidong(item: Hoidongthi) {
    this.hoidong_select = {...item};
    this.ngtype = 'loading';


    this.loadInit();
  }

  ngtype                : 'error' | 'loading' | 'data' | 'add' = "loading";
  hoidong_select        : HskHoidongthi;
  dataDonvi             : DonVi[];
  page                  : number = 1;
  rows                  : number = 20;
  search                : string = '';
  recordTotal           : number = 0;
  listData              : HoidongThisinh[];
  private inputChanged  : Subject<string> = new Subject<string>();
  sumThisinh:SumDiemduthi[] =[]

  constructor(
    private notifi: NotificationService,
    private hoidongThisinhService: VstepHoidongThisinhService,
    private ordersService : VstepOrdersService,
    private thisinhService: ThisinhInfoService,
    private donViService:DonViService,
    private auth : AuthService,
    private kehoachthiDiemthiVstepService: KehoachthiDiemthiVstepService

  ) { }

  ngOnInit(): void {
    this.inputChanged.pipe(debounceTime(1000)).subscribe((item: string) => {
      this.searchContentByInput(item);
    });
  }

  loadInit(){
    this.ngtype = 'loading';
    this.donViService.getChildren(this.auth.user.donvi_id).subscribe({
      next:(data)=>{
        this.dataDonvi = data.filter(f=>f.id !== this.auth.user.donvi_id);
        this.getData();
      },error:()=>{
        this.ngtype = "error";
        this.notifi.toastError('Mất kết nối với máy chủ')
      }
    })
  }

  getData(){
    this.notifi.isProcessing(true);

    const condtion :ConditionOption = {
      condition: [
        {
          conditionName:'hoidong_id',
          condition:OvicQueryCondition.equal,
          value:this.hoidong_select.id.toString()
        },

      ],
      page: this.page.toString(),
      set:[
        {label:'limit',value:this.rows.toString()},
        {label:'order',value:'ASC'},
        // {label:'orderby',value:'hoten'},
      ]
    }
    if(this.search){
      condtion.condition.push(
        {
          conditionName:'hoten',
          condition:OvicQueryCondition.like,
          value:`%${this.search}%`
        },
      )
    }

    this.hoidongThisinhService.getDataByPageNew(condtion).pipe(switchMap(prj=>{

      const thisinh_ids = Array.from(new Set(prj.data.map(m=>m.thisinh_id)))
      return forkJoin([
        of(prj),
        this.loopGetThisinh(1,20,thisinh_ids,[])
      ])
    })).subscribe({
      next:([{data,recordsFiltered},thisinhs])=>{
        this.recordTotal = recordsFiltered;
        this.listData = data.length>0 ? data.map((m,index)=>{
          m['__index'] = (this.page -1)*this.rows +( index + 1);

          m['_diemduthi'] = this.dataDonvi.find(f=>f.id == m.diemduthi_id) ? this.dataDonvi.find(f=>f.id == m.diemduthi_id).title : '';

          const thisinh = thisinhs.find(f=>f.id === m.thisinh_id)
          m['_thisinh'] = thisinh;
          m['_hoten'] = thisinh ? thisinh.hoten : '';
          m['_cccd'] = thisinh ? thisinh.cccd_so : '';
          m['_email'] = thisinh ? thisinh.email:'';
          m['_phone'] = thisinh ? thisinh.phone:'';
          m['_gioitinh'] = thisinh && thisinh.gioitinh ? (thisinh.gioitinh == 'nam' ? 'Nam' : 'Nữ') :'';
          m['_ngaysinh'] = thisinh ? thisinh.ngaysinh:'';

          return m;
        }): [];

        this.notifi.isProcessing(false);
        this.ngtype =  'data';
      },error:()=>{
        this.notifi.isProcessing(false);
        this.ngtype = 'error';
        this.notifi.toastError('load dữ liệu không thành công');
      }
    })
  }

  loopGetThisinh(page:number,limit:number,ids:number[],data:ThiSinhInfo[]):Observable<ThiSinhInfo[]>{
    const start = (page- 1)*limit;
    const end = start  + limit

    if( (page == 0 ? limit : limit *page) < ids.length){
      const ids_select = ids.slice(start , end);
      const conditionDm : ConditionOption = {
        condition: [
          {
            conditionName: 'id',
            condition:OvicQueryCondition.equal,
            value:ids_select.toString(),
            orWhere:'in'
          }
        ],
        page: '1',
        set: [
          {label: 'limit', value:ids_select.length.toString(),}
        ]
      }
      return this.thisinhService.getDataByPageNew(conditionDm).pipe(switchMap(a=>{
        return this.loopGetThisinh(page + 1,limit,ids,data.concat(a.data))
      }))

    }else{
      const ids_select = ids.slice(start,end );
      const conditionDm : ConditionOption = {
        condition: [
          {
            conditionName: 'id',
            condition:OvicQueryCondition.equal,
            value:ids_select.toString(),
            orWhere:'in'
          }
        ],
        page: '1',
        set: [
          {label: 'limit', value:ids_select.length.toString(),}
        ]
      }
      return this.thisinhService.getDataByPageNew(conditionDm).pipe(switchMap(a=>{
        return of(data.concat(a.data))
      }))
    }
  }

  onInputChange(event: string) {
    this.inputChanged.next(event);
  }

  searchContentByInput(text: string) {
    this.page = 1;
    this.search= text ? text.trim():'';
    this.getData();
  }


  paginate({page}: NgPaginateEvent) {
    this.page = page + 1;
    this.getData();
  }


  async btnDeletedUpload(){
    const html = `
        <p>Thao tác này sẽ xóa tất cả kết quả dữ liệu đã tải lên ?</p>
    `;
    const head = 'XÁC NHẬN';
    const btn =  await this.notifi.confirmRounded(html,head,[BUTTON_NO,BUTTON_YES]);
    if(btn.name === 'yes'){
      this.notifi.isProcessing(true);
      this.hoidongThisinhService.deleteByKey(this.hoidong_select.id,'hoidong_id').subscribe({
        next:()=>{
          this.notifi.toastSuccess('Thao tác thành công');
          this.notifi.isProcessing(false);
          this.getData();
        },
        error:()=>{
          this.notifi.toastError('Thao tác không thành công');
          this.notifi.isProcessing(false);

        }
      })
    }
  }


  objectAdd:{
    searchByAdd:string,
    diemduthiSelect_id:number,
    kehoachDiemduthi:KehoachthiDiemduthi[],
    ordersClone:OrdersVstep[]
    orders:OrdersVstep[]
    ordersSelect:OrdersVstep[]
    objectCheck:{
      type:'change'| 'notChange',
      diemduthi_change_id:number
    }
  } = {
    searchByAdd:'',
    diemduthiSelect_id:null,
    kehoachDiemduthi:[],
    ordersClone:[],
    orders:[],
    ordersSelect:[],
    objectCheck : {
      type:'notChange',
      diemduthi_change_id:0
    }
  }
  viewAddUpload(){
      this.ngtype = 'add';

    const condkehoachDiemduthi: ConditionOption = {
      condition: [
        {
          conditionName: 'kehoach_id',
          condition: OvicQueryCondition.equal,
          value: this.hoidong_select.kehoach_id.toString()
        },

      ],
      page: '1',
      set: [
        {
          label: 'limit', value: '-1',
        },
        {
          label: 'with', value: 'donvi',
        },

      ]
    };
      const condThisinhByHoidongKhac :ConditionOption = {
        condition:[
          {
            conditionName:'kehoach_id',
            condition:OvicQueryCondition.equal,
            value:this.hoidong_select.kehoach_id.toString()
          },
        ],
        page:'1',
        set:[
          {
            label:'limit',value:'-1'
          },

        ]
      };

      forkJoin([
        this.kehoachthiDiemthiVstepService.getDataByPageNew(condkehoachDiemduthi).pipe(map(m=>m.data)),

        this.loopGetOrderBy(1,200,[],1,'id,trangthai_thanhtoan,thisinh_id,kehoach_id,diemduthi_id,user_id'),
        this.hoidongThisinhService.getDataByPageNew(condThisinhByHoidongKhac).pipe(map(m=>m.data)),
        this.hoidongThisinhService.getDataTotalDiemthiByKehoach(this.hoidong_select.kehoach_id,this.hoidong_select.id)
      ]).subscribe({
        next:([kehoach_dienduthi,orders,hoidongThisinhKhac,sumThisinh])=>{

          this.sumThisinh = sumThisinh.map(m=>{
            m['_diemduthi'] = this.dataDonvi.find(f=>f.id == m.diemduthi_id) ? this.dataDonvi.find(f=>f.id ==  m.diemduthi_id).title : '';
            return m
          }) ;

          const idsHoidongThisinhKhac = hoidongThisinhKhac.length >0 ? hoidongThisinhKhac.map(m=>m.thisinh_id) : [] ;
          const ordersNotUse = orders.filter(f=>  !idsHoidongThisinhKhac.includes(f.thisinh_id) && !f['huy']).map(m=>{

            m['_hoten'] = m['thisinh'] ? m['thisinh']['hoten'] : '';
            m['_email'] = m['thisinh'] ? m['thisinh']['email'] : '';
            m['_phone'] = m['thisinh'] ? m['thisinh']['phone'] : '';
            m['_cccd'] = m['thisinh'] ? m['thisinh']['cccd_so'] : '';
            m['_ngaysinh'] = m['thisinh'] ? m['thisinh']['ngaysinh'] : '';
            m['_diemduthi'] = kehoach_dienduthi.find(f=>f.diemduthi_id == m.diemduthi_id) ? kehoach_dienduthi.find(f=>f.diemduthi_id == m.diemduthi_id)['donvi']['title'] :'';
            m['_gioitinh'] = m['thisinh'] && m['thisinh'].gioitinh ? (m['thisinh'].gioitinh == 'nam' ? 'Nam' : 'Nữ') :'';
            m['_capthi'] = m.capthi && this.hoidong_select['_kehoach']['levels'].find(f=>f.value == m.capthi ) ? this.hoidong_select['_kehoach']['levels'].find(f=>f.value == m.capthi ).label : '';
            return m;
          })

          this.objectAdd = {
            searchByAdd:'',
            diemduthiSelect_id:null,
            ordersClone:ordersNotUse,
            orders:ordersNotUse,
            ordersSelect:[],
            kehoachDiemduthi:kehoach_dienduthi.map(m=>{

              m['_title'] = m['donvi'] ? m['donvi']['title'] : '';
              return m
            }),

            objectCheck : {
              type:'notChange',
              diemduthi_change_id:0
            }
          }

        },error:()=>{
          this.notifi.toastWarning('Load dữ liệu không thành công');
        }
      })
  }

  loopGetOrderBy(page:number,limit:number, data:OrdersVstep[] ,recordsFiltered:number, select:string):Observable<OrdersVstep[]>{
    if (data.length < recordsFiltered) {

      const conditon :ConditionOption = {
        condition: [
          {
            conditionName:'kehoach_id',
            condition:OvicQueryCondition.equal,
            value:this.hoidong_select.kehoach_id.toString(),
          },
          {
            conditionName:'trangthai_thanhtoan',
            condition:OvicQueryCondition.equal,
            value:'1'
          },
          {
            conditionName:'diemduthi_id',
            condition:OvicQueryCondition.notEqual,
            value:'0'
          },
          {
            conditionName:'thisinh_id',
            condition:OvicQueryCondition.notEqual,
            value:'0'
          },

        ],page:page.toString(),
        set:[
          {label:'limit', value: limit.toString()},
          {label:'select', value:select},
          {label:'with',value:'thisinh'}
        ]
      }

      return this.ordersService.getDataByPageNew(conditon).pipe(
        switchMap(m=>{

          return this.loopGetOrderBy(page+1,limit,data.concat(m['data']),m['recordsFiltered'],select)
        })
      )
    } else{
      return of(data);
    }
  }

  eventSearch(event){
    this.objectAdd.searchByAdd = event;
    if(this.objectAdd.diemduthiSelect_id){
      this.objectAdd.orders = [... this.objectAdd.ordersClone.filter(f=>f.diemduthi_id == this.objectAdd.diemduthiSelect_id && this.removeTextVietnamese(f['_hoten']).includes(this.removeTextVietnamese(event)))]
    }else{
      this.objectAdd.orders = [... this.objectAdd.ordersClone.filter(f=>this.removeTextVietnamese(f['_hoten']).includes(this.removeTextVietnamese(event)))]
    }
  }
  removeTextVietnamese(str: string) {
    return str
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
      .replace(/[èéẹẻẽêềếệểễ]/g, "e")
      .replace(/[ìíịỉĩ]/g, "i")
      .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
      .replace(/[ùúụủũưừứựửữ]/g, "u")
      .replace(/[ỳýỵỷỹ]/g, "y")
      .replace(/đ/g, "d")
      .toLowerCase();
  }




  onChangeDrdByFormAdd(event){
    this.objectAdd.diemduthiSelect_id = event? event['value']:null;
    if(!event.value){
      this.objectAdd.orders = [... this.objectAdd.ordersClone.filter(f=>this.removeTextVietnamese(f['_hoten']).includes(this.removeTextVietnamese(this.objectAdd.searchByAdd)))]
    }else{
      this.objectAdd.orders = [...this.objectAdd.ordersClone.filter(f=>this.removeTextVietnamese(f['_hoten']).includes(this.removeTextVietnamese(this.objectAdd.searchByAdd)) && f.diemduthi_id == event['value'])]
    }
  }

  viewAddThisinh:boolean  = false;

  listChangeDiemduthi:{title:string,key:string,value:number}[] =[
    {
      title:'Theo thí sinh đăng ký',value:1,key:'notChange'
    },
    {
      title:'Thay đổi điểm dự thi',value:2,key:'change'
    },
  ]
  btnViewFormAddThisinh(){
    this.objectAdd.objectCheck ={type:null,diemduthi_change_id:0};
    this.viewAddThisinh= true;
  }

  btnViewSelect(event){
    // console.log(event)
    //
    // console.log(this.objectAdd.objectCheck);
  }

  addThisinh(){
    const listThisinh = this.objectAdd.ordersSelect;


    // return  console.log(listThisinh);
    const objercheck = this.objectAdd.objectCheck;

    if (!listThisinh || listThisinh.length === 0){
      return this.notifi.toastError('Vui lòng chọn thí sinh muốn thêm vào hội đồng');
    }
    const step: number = 100 / listThisinh.length;
    this.notifi.loadingAnimationV2({process: {percent: 0}});
    // this.loopUploadData(this.dataUpload, step, 0).subscribe({
    this.loopCreatedThisinhWithHoidong(listThisinh,objercheck,step,0).subscribe({
      next:()=>{

        this.notifi.disableLoadingAnimationV2();
        this.notifi.toastSuccess('Thao tác thành công');
        this.viewAddThisinh= false;

        this.loadInit();

      },error:()=>{
        this.notifi.toastError("Mất Kết nối với máy chủ");
        this.notifi.disableLoadingAnimationV2();
      }
    })

  }


  private loopCreatedThisinhWithHoidong(data: OrdersVstep[],objectCheck:{type:string,diemduthi_change_id:number},step:number,percent:number):Observable<OrdersVstep[]>{
    const index = data.findIndex(f=>!f['isCreated'])
    if (index !== -1) {
      const item  = {

        thisinh_id:data[index].thisinh_id ,
        diemduthi_id:objectCheck.type == 'change' ? objectCheck.diemduthi_change_id : data[index].diemduthi_id ,
        capthi:data[index]['_capthi'] ? data[index]['_capthi'] : '' ,
        hoten:data[index]['_hoten'] ,
        user_id:data[index].user_id ,
        hoidong_id:this.hoidong_select.id,
        kehoach_id:this.hoidong_select.kehoach_id};
      return this.hoidongThisinhService.create(item).pipe(switchMap(m=>{
        data[index]['isCreated']= true;
        const newPercent: number = percent + step;
        this.notifi.loadingAnimationV2({process: {percent: newPercent}});
        return this.loopCreatedThisinhWithHoidong(data,objectCheck,step,newPercent);
      }))
    }else{
      return of(data);
    }


  }

}
