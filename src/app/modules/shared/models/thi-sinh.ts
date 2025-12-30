import { OvicFile } from "@core/models/file";
import {
  InputDiaDanh
} from "@shared/components/ovic-input-address-four-layouts/ovic-input-address-four-layouts.component";

export interface ThiSinhInfo {
  id?: number;
  user_id: number;
  hoten: string;
  ten: string;
  ngaysinh: string;
  gioitinh: string;
  dantoc: string;
  tongiao: string;
  noisinh: string;
  quequan: InputDiaDanh;
  phone: string;
  anh_chandung: OvicFile;
  cccd_so: string;
  cccd_ngaycap: string;
  cccd_noicap: string;
  cccd_img_truoc: OvicFile;
  cccd_img_sau: OvicFile,
  thuongtru_diachi: InputDiaDanh;
  status: 0 | 1;// khoá
  camket: 0 | 1;
  lock?:number;
  email?:string;

}
