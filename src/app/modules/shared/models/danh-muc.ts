import {OvicFile} from "@core/models/file";


export interface DmChung {
  is_deleted: number; //1: deleted; 0: not deleted
  deleted_by: number;
  created_by: number;
  updated_by: number;
  created_at: string; // sql timestamp
  updated_at: string; // sql timestamp
}
export interface DmMon extends DmChung {
  id: number;
  tenmon: string;
  kyhieu: string;// viet tat
  status: number; //1 Active; 0: inactive
}


export interface DmToHopMon extends DmChung {
  id: number;
  tentohop: string;
  mon_ids: number[];
  status: number; //1 Active; 0: inactive
}

export interface DmCapdo extends DmChung{
  id: number;
  title:string;
  status:number;
  gia?:number;
  hskk_lever?:string;
  mota:string;
}


export interface DmDotThi extends DmChung {
  id: number;
  ten_dotthi: string;
  time_start: string;
  time_end: string;
  status: number; //1 Active; 0: inactive
}

export interface DmTruongHoc extends DmChung {
  id: number;
  ten: string;
  parent_id: number;
  address: string;
  province: number; //1 Active; 0: inactive
  status: number; //1 Active; 0: inactive
}












export interface DonVi {
  id: number;
  title: string;
  parent_id: number; //Đơn vị cấp trên ID
  description: string;
  status: number; //1 Active; 0: inactive
}


export const KieuDuLieuNguLieu: { label: string, value: LoaiNguLieu }[] = [
  {label: 'Hình ảnh', value: 'image'},
  {label: 'Video', value: 'video'},
  {label: 'Âm thanh', value: 'audio'},
  {label: 'Video 360', value: 'video360'},
  {label: 'Hình ảnh 360', value: 'image360'},
  {label: 'Text', value: 'text'},
  {label: 'Tài liệu', value: 'others'},
];

export type LoaiNguLieu = 'image' | 'video' | 'audio' | 'video360' | 'image360' | 'text' | 'others'
