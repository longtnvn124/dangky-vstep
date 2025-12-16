import { OvicFile } from "@core/models/file";
import {
  InputDiaDanh
} from "@shared/components/ovic-input-address-four-layouts/ovic-input-address-four-layouts.component";

export interface ThiSinhInfo {
  id?: number;
  user_id: number;
  hoten: string;
  namhoc_tiengtrung:number;
  hoten_tiengtrung:number;
  ten: string;
  ngaysinh: string;
  gioitinh: string;
  dantoc: string;
  tongiao: string;
  noisinh: string;
  noisinhkhac: string;
  quequan: InputDiaDanh;
  phone: string;
  anh_chandung: OvicFile;
  cccd_so: string;
  cccd_ngaycap: string;
  cccd_noicap: string;
  cccd_img_truoc: OvicFile;
  cccd_img_sau: OvicFile,
  thuongtru_diachi: InputDiaDanh;
  khuvuc: number;// id khu vuc
  status: 0 | 1;// khoá
  camket: 0 | 1;
  quoctich:0 | 1;//0: viet nam , 1 nuoc ngoai
  doituong:string;
  lock?:number;
  request_update?:number;
  email?:string;
  hskk_lever?:string;
  loai_giayto?:string;
  loai_giaytokhac?:string;
  ghichu?:string;
  ma_quoctich?:string;
  ngonngu_me?:string;
  loai_unngvien?:string;
  quoctich_ungvien?:string;
}
