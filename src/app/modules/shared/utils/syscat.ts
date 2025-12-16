import { AbstractControl , ValidationErrors , ValidatorFn } from '@angular/forms';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap/modal/modal-config';

export const FULL_SIZE_MODAL_OPTIONS : NgbModalOptions = {
  scrollable  : true ,
  size        : 'xl' ,
  windowClass : 'modal-xxl ovic-modal-class ovic-modal-full-size' ,
  centered    : true
};

export const LARGE_MODAL_OPTIONS : NgbModalOptions = {
  scrollable  : true ,
  size        : 'xl' ,
  windowClass : 'modal-xxl ovic-modal-class' ,
  centered    : true
};

export const DEFAULT_MODAL_OPTIONS : NgbModalOptions = {
  size        : 'lg' ,
  backdrop    : 'static' ,
  centered    : true ,
  windowClass : 'ovic-modal-class max-w-600px'
};

export const NORMAL_MODAL_OPTIONS : NgbModalOptions = {
  size        : 'md' ,
  backdrop    : 'static' ,
  centered    : true ,
  windowClass : 'ovic-modal-class'
};

export const NORMAL_MODAL_OPTIONS_ROUND : NgbModalOptions = {
  size        : 'md' ,
  backdrop    : 'static' ,
  centered    : true ,
  windowClass : 'ovic-modal-class ovic-modal--rounded'
};

export const SM_MODAL_OPTIONS : NgbModalOptions = {
  size        : 'sm' ,
  backdrop    : 'static' ,
  centered    : true ,
  windowClass : 'ovic-modal-class'
};

export const DEFAULT_MODAL_OPTIONS_NO_BACKDROP : NgbModalOptions = {
  size        : 'lg' ,
  centered    : true ,
  windowClass : 'ovic-modal-class'
};

export const DanToc = [
  { name : 'kinh' , label : 'Kinh' } ,
  { name : 'tay' , label : 'Tày' } ,
  { name : 'thai' , label : 'Thái' } ,
  { name : 'muong' , label : 'Mường' } ,
  { name : 'nung' , label : 'Nùng' } ,
  { name : 'dao' , label : 'Dao' } ,
  { name : 'h-mong' , label : 'H\'mông' } ,
  { name : 'khmer' , label : 'Khmer' } ,
  { name : 'gia-rai' , label : 'Gia Rai' } ,
  { name : 'ede' , label : 'Ê Đê' } ,
  { name : 'bana' , label : 'Ba Na' } ,
  { name : 'xo-dang' , label : 'Xơ Đăng' } ,
  { name : 'san-chay' , label : 'Sán Chay(Cao lan - Sán chỉ )' } ,
  { name : 'co-ho' , label : 'Cơ Ho' } ,
  { name : 'hoa' , label : 'Hoa' } ,
  { name : 'cham' , label : 'Chăm' } ,
  { name : 'san-diu' , label : 'Sán Dìu' } ,
  { name : 'tho' , label : 'Thổ' } ,
  { name : 'hre' , label : 'Hrê' } ,
  { name : 'ra-gia' , label : 'Ra Glai' } ,
  { name : 'm-nong' , label : 'M\'Nông' } ,
  { name : 'x-tieng' , label : 'X\'Tiêng' } ,
  { name : 'bru-van-kieu' , label : 'Bru-Vân Kiều' } ,
  { name : 'kho-mu' , label : 'Khơ Mú' } ,
  { name : 'co-tu' , label : 'Cơ Tu' } ,
  { name : 'giay' , label : 'Giáy' } ,
  { name : 'gie-trieng' , label : 'Giẻ Triêng' } ,
  { name : 'ta-oi' , label : 'Tà Ôi' } ,
  { name : 'ma' , label : 'Mạ' } ,
  { name : 'co' , label : 'Co' } ,
  { name : 'cho-ro' , label : 'Chơ Ro' } ,
  { name : 'xinh-mun' , label : 'Xinh Mun' } ,
  { name : 'ha-nhi' , label : 'Hà Nhì' } ,
  { name : 'chu-ru' , label : 'Chu Ru' } ,
  { name : 'lao' , label : 'Lào' } ,
  { name : 'khang' , label : 'Kháng' } ,
  { name : 'la-chi' , label : 'La Chí' } ,
  { name : 'phu-la' , label : 'Phù Lá' } ,
  { name : 'la-hu' , label : 'La Hủ' } ,
  { name : 'la-ha' , label : 'La Ha' } ,
  { name : 'pa-then' , label : 'Pà Thẻn' } ,
  { name : 'chut' , label : 'Chứt' } ,
  { name : 'lu' , label : 'Lự' } ,
  { name : 'lo-lo' , label : 'Lô Lô' } ,
  { name : 'mang' , label : 'Mảng' } ,
  { name : 'co-lao' , label : 'Cờ Lao' } ,
  { name : 'bo-y' , label : 'Bố Y' } ,
  { name : 'cong' , label : 'Cống' } ,
  { name : 'ngay' , label : 'Ngái' } ,
  { name : 'si-la' , label : 'Si La' } ,
  { name : 'pu-peo' , label : 'Pu Péo' } ,
  { name : 'ro-mam' , label : 'Rơ măm' } ,
  { name : 'brau' , label : 'Brâu' } ,
  { name : 'o-du' , label : 'Ơ Đu' },
  { name : 'khac' , label : 'Khác' }
];

export const TonGiaoVietNam = [
  { name : 'khong' , label : 'Không' } ,
  { name : 'phat-giao' , label : 'Phật giáo' } ,
  { name : 'hoi-giao' , label : 'Hồi giáo' } ,
  { name : 'bahai' , label : 'Bahai' } ,
  { name : 'cong-giao' , label : 'Công giáo' } ,
  { name : 'tin-lanh' , label : 'Tin lành' } ,
  { name : 'mac-mon' , label : 'Mặc môn' } ,
  { name : 'phat-giao-hoa-hao' , label : 'Phật giáo Hòa Hảo' } ,
  { name : 'cao-dai' , label : 'Cao Đài' } ,
  { name : 'buu-son-ky-huong' , label : 'Bửu Sơn Kỳ Hương' } ,
  { name : 'tinh-do-cu-si-phat-hoi' , label : 'Tịnh Độ Cư Sĩ Phật Hội' } ,
  { name : 'tu-an-hieu-nghia' , label : 'Tứ Ân Hiếu Nghĩa' } ,
  { name : 'phat-duong-nam-tong-minh-su-dao' , label : 'Phật Đường Nam Tông Minh Sư Đạo' } ,
  { name : 'minh-ly-dao-tam-tong-mieu' , label : 'Minh Lý Đạo Tam Tông Miếu' } ,
  { name : 'ba-la-mon-kho-me' , label : 'Bà la môn Khơ me' } ,
  { name : 'phat-giao-hieu-nghia-ta-lon' , label : 'Phật giáo Hiếu Nghĩa Tà Lơn' }
];

export const FileType = new Map( [
  [ 'application/vnd.google-apps.folder' , 'folder' ] ,
  [ 'audio/mpeg' , 'mp3' ] ,
  [ 'audio/mp3' , 'mp3' ] ,
  [ 'audio/x-aac' , 'x-aac' ] ,
  [ 'application/zip' , 'zip' ] ,
  [ 'application/x-zip-compressed' , 'zip' ] ,
  [ 'application/x-rar-compressed' , 'rar' ] ,
  [ 'application/x-7z-compressed' , 'zip' ] ,
  [ 'application/msword' , 'doc' ] ,
  [ 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' , 'docx' ] ,
  [ 'application/vnd.ms-powerpoint' , 'ppt' ] ,
  [ 'application/vnd.openxmlformats-officedocument.presentationml.presentation' , 'pptx' ] ,
  [ 'application/vnd.ms-excel' , 'xls' ] ,
  [ 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' , 'xlsx' ] ,
  [ 'application/vnd.google-apps.spreadsheet' , 'xlsx' ] ,
  [ 'application/pdf' , 'pdf' ] ,
  [ 'video/x-msvideo' , 'video' ] ,
  [ 'video/mp4' , 'mp4' ] ,
  [ 'image/png' , 'img' ] ,
  [ 'image/jpeg' , 'img' ] ,
  [ 'image/jpg' , 'img' ] ,
  [ 'image/gif' , 'img' ] ,
  [ 'text/plain' , 'text' ]
] );


export const AppValidators = {
  arrayInput : {
    needInputAtLeast : ( length : number ) : ValidatorFn => ( control : AbstractControl ) : ValidationErrors | null => ( control.value && Array.isArray( control.value ) && control.value.length >= length ) ? null : { notValidLength : 'content does not meet the minimum content requirements' }
  }
};

export const TypeOptions : { value : string, label : string }[] = [
  { value : 'DIRECT' , label : 'Chuyển cảnh' } ,
  { value : 'INFO' , label : 'Thông tin' }
];

export const MAXIMIZE_MODAL_OPTIONS : NgbModalOptions = {
  scrollable  : true ,
  size        : 'xl' ,
  windowClass : 'modal-maximize ovic-modal-class' ,
  centered    : true
};

export const TYPE_FILE_LIST        = {
  docx  : 'docx' ,
  pptx  : 'pptx' ,
  ppt   : 'ppt' ,
  pdf   : 'pdf' ,
  xlsx  : 'xlsx' ,
  audio : 'audio' ,
  video : 'video' ,
  image : 'image' ,
  text  : 'text' ,
  zip   : 'zip'
};
export const OvicVideoSourceObject = {
  local       : 'local' ,
  serverFile  : 'serverFile' ,
  vimeo       : 'vimeo' ,
  youtube     : 'youtube' ,
  googleDrive : 'googleDrive' ,
  encrypted   : 'encrypted' ,
  serverAws   : 'serverAws'
};
export const VIDEO_SOURCE          = [
  { name : 'Youtube' , key : 'youtube' } ,
  { name : 'Server Files' , key : 'serverFile' }
];

export const WAITING_POPUP : NgbModalOptions = {
  scrollable  : true ,
  size        : 'xl' ,
  windowClass : 'modal-xxl ovic-modal-class' ,
  centered    : true ,
  backdrop    : 'static'
};

export const WAITING_POPUP_SPIN : NgbModalOptions = {
  scrollable  : true ,
  size        : 'xl' ,
  windowClass : 'modal-xxl ovic-modal-class popup-spin' ,
  centered    : true ,
  backdrop    : 'static'
};

export const WAITING_FOR_EXCEL : NgbModalOptions = {
  scrollable  : true ,
  size        : 'xl' ,
  windowClass : 'modal-xxl ovic-modal-for-excel' ,
  centered    : true ,
  backdrop    : 'static'
};

export const KEY_NAME_CONTESTANT_ID : string = 'contestant';

export const KEY_NAME_CONTESTANT_PHONE : string = 'contestantPhone';
export const KEY_NAME_CONTESTANT_EMAIL : string = 'contestantEmail';

export const KEY_NAME_SHIFT_ID : string = 'shift_id';

export const  CONG_THONG_TIN:{id:number,url:string, img:string}[]=[
  {
    id:1,url:'https://thainguyen.gov.vn',img:'assets/svg/cthainguyen.svg'
  },
  {
    id:2,url:'https://thainguyen.dcs.vn',img:'assets/svg/Cobualiem.svg'
  },
  {
    id:3,url:'',img:'assets/svg/UBNDtinh.svg'
  },
  {
    id:4,url:'https://tuyengiaothainguyen.org.vn/',img:'assets/svg/bantuyengiao.svg'
  },
]
export const MODULES_QUILL:any={
  VideoResize : {
    displaySize : true ,
    modules: [ 'Resize', 'DisplaySize', 'Toolbar' ],
  },
  imageResize : {
    displaySize : true ,
    modules     : [ 'Resize' , 'DisplaySize' , 'Toolbar' ]
  }
}

export const TYPE_FILE_IMAGE:string[] = ['image/png', 'image/gif','image/jpeg', 'image/bmp',' image/x-icon'];
export const TYPE_FILE_VIDEO:string[] = ['video/mp4', 'image/gif', 'image/jpeg', 'image/bmp', 'image/x-icon'];
export const TYPE_FILE_SCORM:string[] = ['application/zip', 'application/x-zip-compressed', 'application/x-7z-compressed' ,];


export const DATA_UNIT_START_TEST:{name: string, code:number}[]= [
  {name: 'Cơ quan ĐHTN và các Trung tâm trực thuộc và thuộc, Nhà xuất bản',code:1},
  {name: 'Trường Ngoại ngữ',code:2},
  {name: 'Khoa Quốc tế',code:3},
  {name: 'Trường Đại học Khoa học',code:4},
  {name: 'Trường Đại học Y - Dược',code:5},
  {name: 'Trường Đại học Kinh tế và Quản trị kinh doanh',code:6},
  {name: 'Trường Đại học Nông Lâm',code:7},
  {name: 'Trường Đại học Công nghệ Thông tin và Truyền thông',code:8},
  {name: 'Trường Đại học Sư phạm',code:9},
  {name: 'Trường Đại học Kỹ thuật Công nghiệp',code:10},
  {name: 'Trường Cao đẳng Kinh tế kỹ thuật',code:11},
  {name: 'Phân hiệu Đại học Thái Nguyên tại tỉnh Lào Cai',code:12},
  {name: 'Phân hiệu Đại học Thái Nguyên tại tỉnh Hà Giang',code:13},
  {name: 'Huyện đoàn Phú Bình',code:14},
  {name: ' Huyện đoàn Phú Lương',code:15},
  {name: 'Huyện đoàn Phổ Yên',code:16},
  {name: 'Huyện đoàn Đại Từ',code:17},
  {name: 'Huyện đoàn Định Hóa',code:18},
  {name: 'Huyện đoàn Đồng Hỷ',code:19},
  {name: 'Thành đoàn Sông Công',code:20},
  {name: 'Thành đoàn Phổ Yên',code:21},
  {name: 'Thành đoàn Thái Nguyên',code:22},
  {name: 'Đoàn Thanh niên Công an tỉnh',code:23},
  {name: 'Đoàn thanh niên Bệnh viện Trung ương Thái Nguyên',code:24},
  {name: 'Trợ lý thanh niên Bộ Chỉ huy Quân sự tỉnh Thái Nguyên',code:25},
  {name: 'Đoàn thanh niên Khối các cơ quan tỉnh Thái Nguyên',code:26},
  {name: 'Đoàn thanh niên Công ty Cổ phần Gang Thép Thái Nguyên',code:27},
  {name: 'Đoàn thanh niên Công ty Cổ phần Kim Loại Mầu - Vimico Thái Nguyên',code:28},
  {name: 'Đoàn thanh niên Công ty TNHH MTV Xi Măng Quang Sơn Thái Nguyên',code:29},
  {name: 'Đoàn thanh niên Ban Quản lý các khu Công nghiệp tỉnh Thái Nguyên',code:30},
  {name: 'Các đối tượng quan tâm', code: 31}
];

export const TYPE_CONTESTANT_TRACKING:{title:string, value:number, icon:string,class:string}[] =[
  {
    title:'Thí sinh bắt đầu bài thi',value:1,icon:'pi pi-check-square ',class:''
  },
  {
    title:'Thí sinh đã Vào lại trình thi',value:-1,icon:'pi pi-stopwatch ',class:'p-button-secondary'
  },
  {
    title:'Thí sinh đã nộp bài',value:2,icon:'pi pi-verified ',class:'p-button-success'
  },
  {
    title:'Thí sinh đã trở lại phòng thi',value:3,icon:'pi pi-sign-in ',class:'p-button-warning'
  },
  {
    title:'Thí sinh đã rời khỏi phòng thi',value:-3,icon:'pi pi-sign-out ',class:'p-button-danger'
  },
];

export const DEPARTMENT_OF_EDUCATION:{id:number,label:string}[]= [
  {id:1,label:'Sở GD&ĐT Tỉnh Thái Nguyên'},
  {id:2,label:'Sở GD&ĐT Vĩnh Phúc'},
  {id:3,label:'Sở GD&ĐT Bắc Ninh'},
  {id:4,label:'Sở GD&ĐT Quảng Ninh'},
  {id:5,label:'Sở GD&ĐT Hưng Yên'},
  {id:6,label:'Sở GD&ĐT Hà Giang'},
  {id:7,label:'Sở GD&ĐT Tuyên Quang'},
  {id:8,label:'Sở GD&ĐT Yên Bái'},
  {id:9,label:'Sở GD&ĐT Thái Bình'},
  {id:10,label:'Sở GD&ĐT Cao Bằng'},
  {id:11,label:'Sở GD&ĐT Lạng Sơn'},
  {id:12,label:'Sở GD&ĐT Sơn La'},
  {id:13,label:'Sở GD&ĐT Bắc Giang'},
  {id:14,label:'Sở GD&ĐT Hòa Bình'},
  {id:15,label:'Sở GD&ĐT Ninh Bình'},
  {id:16,label:'Sở GD&ĐT Điện Biên'},
  {id:17,label:'Sở GD&ĐT Hải Phòng'},
  {id:18,label:'Sở GD&ĐT Lai Châu'},
  {id:19,label:'Sở GD&ĐT Bắc Kạn'},
  {id:20,label:'Sở GD&ĐT Phú Thọ'},
  {id:21,label:'Sở GD&ĐT Hà Nam'},
  {id:22,label:'Sở GD&ĐT Thanh Hóa'},
  {id:23,label:'Sở GD&ĐT Lào Cai'},
  {id:24,label:'Sở GD&ĐT Hải Dương'},
  {id:25,label:'Sở GD&ĐT Nam Định'},
  {id:26,label:'Sở GD&ĐT Hà Tĩnh'},
  {id:27,label:'Sở GD&ĐT Quảng Nam'},
  {id:28,label:'Sở GD&ĐT Gia Lai'},
  {id:29,label:'Không thuộc sở giáo dục nào'},
  {id:30,label:'Sở GD&ĐT Hà Nội'},
]

export interface SchoolDepartment{
  school_name:string;
  department_edu:string;
  province:string;
  province_name:string;
  school_address:string;
}
export const SCHOOL_BY_DEPARTMENT:SchoolDepartment[]=[
  {
    school_name: "Trường THPT Võ Nguyên Giáp",
    department_edu: "Sở GD&ĐT Tỉnh Thái Nguyên",
    province: "Thái Nguyên",
    province_name: "Thành phố Phổ Yên",
    school_address: "Phường Đắc Sơn, Thành phố Phổ Yên, tỉnh Thái Nguyên"
  },
  {
    school_name: "Trường THPT Bình Yên",
    department_edu: "Sở GD&ĐT Tỉnh Thái Nguyên",
    province: "Thái Nguyên",
    province_name: "Huyện Định Hóa ",
    school_address: "Thôn Yên Thông, xã Bình Yên, huyện Định Hóa, tỉnh Thái Nguyên"
  },
  {
    school_name: "Trường THPT Bắc Sơn",
    department_edu: "Sở GD&ĐT Tỉnh Thái Nguyên",
    province: "Thái Nguyên",
    province_name: "Thành phố Phổ Yên",
    school_address: "Phường Bắc Sơn - Thành phố Phổ Yên - tỉnh Thái Nguyên"
  },
  {
    school_name: "Trường THPT Chu Văn An",
    department_edu: "Sở GD&ĐT Tỉnh Thái Nguyên",
    province: "Thái Nguyên",
    province_name: "Thành phố Thái Nguyên",
    school_address: "271 Lưu Nhân Chú, Hương Sơn, Thành phố Thái Nguyên, Thái Nguyên"
  },
  {
    school_name: "Trường THPT Dương Tự Minh",
    department_edu: "Sở GD&ĐT Tỉnh Thái Nguyên",
    province: "Thái Nguyên",
    province_name: "Thành phố Thái Nguyên",
    school_address: "723 Đường Dương Tự Minh, Phường Quang Vinh, TP Thái Nguyên, Thái Nguyên"
  },
  {
    school_name: "Trường THPT Gang Thép",
    department_edu: "Sở GD&ĐT Tỉnh Thái Nguyên",
    province: "Thái Nguyên",
    province_name: "Thành phố Thái Nguyên",
    school_address: "Tổ 28 Phường Trung Thành, TP. Thái Nguyên, Tỉnh Thái Nguyên"
  },
  {
    school_name: "Trường THPT Thái Nguyên",
    department_edu: "Sở GD&ĐT Tỉnh Thái Nguyên",
    province: "Thái Nguyên",
    province_name: "Thành phố Thái Nguyên",
    school_address: "127 Đường Lương Thế Vinh, Quang Trung, Thành phố Thái Nguyên, Thái Nguyên"
  },
  {
    school_name: "Trường THPT Hoàng Quốc Việt",
    department_edu: "Sở GD&ĐT Tỉnh Thái Nguyên",
    province: "Thái Nguyên",
    province_name: "Huyện Võ Nhai",
    school_address: "Võ Nhai, Thái Nguyên"
  },
  {
    school_name: "Trường THPT Khánh Hòa",
    department_edu: "Sở GD&ĐT Tỉnh Thái Nguyên",
    province: "Thái Nguyên",
    province_name: "Thành phố Thái Nguyên",
    school_address: "Xã Sơn Cẩm, Thành phố Thái Nguyên, tỉnh Thái Nguyên"
  },
  {
    school_name: "Trường THPT Lê Hồng Phong",
    department_edu: "Sở GD&ĐT Tỉnh Thái Nguyên",
    province: "Thái Nguyên",
    province_name: "Thành phố Phổ Yên",
    school_address: "Phổ Yên, Thái Nguyên"
  },
  {
    school_name: "Trường THPT Lý Nam Đế",
    department_edu: "Sở GD&ĐT Tỉnh Thái Nguyên",
    province: "Thái Nguyên",
    province_name: "Thành phố Sông Công",
    school_address: "Thành phố Sông Công, Thái Nguyên"
  },
  {
    school_name: "Trường THPT Lưu Nhân Chú",
    department_edu: "Sở GD&ĐT Tỉnh Thái Nguyên",
    province: "Thái Nguyên",
    province_name: "Huyện Đại Từ",
    school_address: "Đại Từ, Thái Nguyên"
  },
  {
    school_name: "Trường THPT Lương Ngọc Quyến",
    department_edu: "Sở GD&ĐT Tỉnh Thái Nguyên",
    province: "Thái Nguyên",
    province_name: "Thành phố Thái Nguyên",
    school_address: "Tổ 30, Phường Hoàng Văn Thụ, Thành phố Thái Nguyên, Tỉnh Thái nguyên"
  },
  {
    school_name: "Trường THPT Lương Phú",
    department_edu: "Sở GD&ĐT Tỉnh Thái Nguyên",
    province: "Thái Nguyên",
    province_name: "Huyện Phú Bình",
    school_address: "Xóm Mảng - Xã Lương Phú - Huyện Phú Bình - Tỉnh Thái Nguyên"
  },
  {
    school_name: "Trường THPT Nguyễn Huệ",
    department_edu: "Sở GD&ĐT Tỉnh Thái Nguyên",
    province: "Thái Nguyên",
    province_name: "Huyện Đại Từ",
    school_address: "Xã Phú Thịnh, huyện Đại Từ, tỉnh Thái Nguyên"
  },
  {
    school_name: "Trường THPT Ngô Quyền",
    department_edu: "Sở GD&ĐT Tỉnh Thái Nguyên",
    province: "Thái Nguyên",
    province_name: "Thành phố Thái Nguyên",
    school_address: "Phường Thịnh Đán, Thành phố Thái Nguyên, Thái Nguyên"
  },
  {
    school_name: "Trường THPT Phú Bình",
    department_edu: "Sở GD&ĐT Tỉnh Thái Nguyên",
    province: "Thái Nguyên",
    province_name: "Huyện Phú Bình",
    school_address: "Phú Bình, Thái Nguyên"
  },
  {
    school_name: "Trường THPT Phú Lương",
    department_edu: "Sở GD&ĐT Tỉnh Thái Nguyên",
    province: "Thái Nguyên",
    province_name: "Huyện Phú Lương",
    school_address: "Phú Lương, Thái Nguyên"
  },
  {
    school_name: "Trường THPT Phổ Yên",
    department_edu: "Sở GD&ĐT Tỉnh Thái Nguyên",
    province: "Thái Nguyên",
    province_name: "Thành phố Phổ Yên",
    school_address: "Số nhà 245 đường Hoàng Quốc Việt - xã Tân Hương, TP Phổ Yên, tỉnh Thái Nguyên"
  },
  {
    school_name: "Trường THPT Sông Công",
    department_edu: "Sở GD&ĐT Tỉnh Thái Nguyên",
    province: "Thái Nguyên",
    province_name: "Thành phố Sông Công",
    school_address: "TP Sông Công, Thái Nguyên"
  },
  {
    school_name: "Trường THPT Trại Cau",
    department_edu: "Sở GD&ĐT Tỉnh Thái Nguyên",
    province: "Thái Nguyên",
    province_name: "Huyện Đồng Hỷ",
    school_address: "Đồng Hỷ, Thái Nguyên"
  },
  {
    school_name: "Trường THPT Trần Phú",
    department_edu: "Sở GD&ĐT Tỉnh Thái Nguyên",
    province: "Thái Nguyên",
    province_name: "Huyện Võ Nhai",
    school_address: "Võ Nhai, Thái Nguyên"
  },
  {
    school_name: "Trường THPT Yên Ninh",
    department_edu: "Sở GD&ĐT Tỉnh Thái Nguyên",
    province: "Thái Nguyên",
    province_name: "Huyện Phú Lương",
    school_address: "Xóm Bằng Ninh - Xã Yên Ninh - Phú Lương - Thái Nguyên"
  },
  {
    school_name: "Trường THPT Điềm Thụy",
    department_edu: "Sở GD&ĐT Tỉnh Thái Nguyên",
    province: "Thái Nguyên",
    province_name: "Huyện Phú Bình",
    school_address: "Xóm Thuần pháp, Xã Điềm Thuỵ, Huyện Phú Bình, Tỉnh Thái Nguyên"
  },
  {
    school_name: "TRƯỜNG THPT Đại Từ",
    department_edu: "Sở GD&ĐT Tỉnh Thái Nguyên",
    province: "Thái Nguyên",
    province_name: "Huyện Đại Từ",
    school_address: "Thị trấn Hùng Sơn, Huyện Đại Từ, Tỉnh Thái Nguyên"
  },
  {
    school_name: "Trường THPT Định Hoá",
    department_edu: "Sở GD&ĐT Tỉnh Thái Nguyên",
    province: "Thái Nguyên",
    province_name: "Huyện Định Hóa ",
    school_address: "TDP Hợp Thành, Thị trấn Chợ Chu, Huyện Định Hóa, Tỉnh Thái Nguyên"
  },
  {
    school_name: "Trường THPT Đồng Hỷ",
    department_edu: "Sở GD&ĐT Tỉnh Thái Nguyên",
    province: "Thái Nguyên",
    province_name: "Huyện Đồng Hỷ",
    school_address: "Đồng Hỷ, Thái Nguyên"
  },
  {
    school_name: "Trường THPT Đội Cấn",
    department_edu: "Sở GD&ĐT Tỉnh Thái Nguyên",
    province: "Thái Nguyên",
    province_name: "Huyện Đại Từ",
    school_address: "Hà Thượng, Đại Từ, Thái Nguyên"
  },
  {
    school_name: "Trường THPT Iris",
    department_edu: "Sở GD&ĐT Tỉnh Thái Nguyên",
    province: "Thái Nguyên",
    province_name: "Thành phố Thái Nguyên",
    school_address: "Gia Sàng, TP Thái Nguyên, Thái Nguyên"
  },
  {
    school_name: "Trường THPT Chuyên Thái Nguyên",
    department_edu: "Sở GD&ĐT Tỉnh Thái Nguyên",
    province: "Thái Nguyên",
    province_name: "Thành phố Thái Nguyên",
    school_address: "Tổ 6, phường Túc Duyên, Thành phố Thái Nguyên, tỉnh Thái Nguyên"
  },

  {
    school_name: "Trường THPT Nguyễn Viết Xuân",
    department_edu: "Sở GD&ĐT Vĩnh Phúc",
    province: "Vĩnh Phúc",
    province_name: "Huyện Vĩnh Tường",
    school_address: "Xã Đại Đồng - Huyện Vĩnh Tường - Tỉnh Vĩnh Phúc"
  },
  {
    school_name: "Trường THPT Đội Cấn",
    department_edu: "Sở GD&ĐT Vĩnh Phúc",
    province: "Vĩnh Phúc",
    province_name: "Huyện Vĩnh Tường",
    school_address: "Xã Tam Phúc -Huyện Vĩnh Tường - Tỉnh Vĩnh Phúc"
  },
  {
    school_name: "Trường THPT Bến Tre",
    department_edu: "Sở GD&ĐT Vĩnh Phúc",
    province: "Vĩnh Phúc",
    province_name: "Thành phố Phúc Yên",
    school_address: "Thành phố Phúc Yên - Tỉnh Vĩnh Phúc"
  },
  {
    school_name: "Trường THPT Vĩnh Yên",
    department_edu: "Sở GD&ĐT Vĩnh Phúc",
    province: "Vĩnh Phúc",
    province_name: "Thành phố Vĩnh Yên ",
    school_address: "Phường Hội Hợp - Thành phố Vĩnh Yên - Tỉnh Vĩnh Phúc"
  },
  {
    school_name: "Trường THPT Lê Xoay",
    department_edu: "Sở GD&ĐT Vĩnh Phúc",
    province: "Vĩnh Phúc",
    province_name: "Huyện Vĩnh Tường",
    school_address: "Khu Hồ Xuân Hương, tt. Vĩnh Tường, Vĩnh Tường, Vĩnh Phúc"
  },
  {
    school_name: "Trường THPT Xuân Hòa",
    department_edu: "Sở GD&ĐT Vĩnh Phúc",
    province: "Vĩnh Phúc",
    province_name: "Thị xã Phúc Yên",
    school_address: "Phường Xuân Hòa, Thị xã Phúc Yên, Tỉnh Vĩnh Phúc"
  },
  {
    school_name: "Trường THPT Tam Dương 2",
    department_edu: "Sở GD&ĐT Vĩnh Phúc",
    province: "Vĩnh Phúc",
    province_name: "Huyện Tam Dương",
    school_address: "Xã Duy Phiên - Huyện Tam Dương - Vĩnh Phúc"
  },
  {
    school_name: "Trường THPT Đồng Đậu",
    department_edu: "Sở GD&ĐT Vĩnh Phúc",
    province: "Vĩnh Phúc",
    province_name: "Thành phố Vĩnh Yên ",
    school_address: "Trung Nguyên - Thị trấn Yên Lạc - TP Vĩnh Yên - Vĩnh Phúc"
  },
  {
    school_name: "Trường THPT Trần Hưng Đạo",
    department_edu: "Sở GD&ĐT Vĩnh Phúc",
    province: "Vĩnh Phúc",
    province_name: "Huyện Tam Dương",
    school_address: "Thị trấn Hợp Hoà - huyện Tam Dương - Tỉnh Vĩnh Phúc"
  },
  {
    school_name: "Trường THPT Kim Ngọc",
    department_edu: "Sở GD&ĐT Vĩnh Phúc",
    province: "Vĩnh Phúc",
    province_name: "Thành phố Vĩnh Yên ",
    school_address: "Ngõ 9 - Đường Lý Thường Kiệt - Phường Đồng Tâm-Vĩnh Yên-Vĩnh Phúc"
  },
  {
    school_name: "Trường THPT Võ Thị Sáu",
    department_edu: "Sở GD&ĐT Vĩnh Phúc",
    province: "Vĩnh Phúc",
    province_name: "Huyện Bình Xuyên",
    school_address: "Xã Phú Xuân - Huyện Bình Xuyên - Tỉnh Vĩnh Phúc"
  },
  {
    school_name: "Trường THPT Quang Hà",
    department_edu: "Sở GD&ĐT Vĩnh Phúc",
    province: "Vĩnh Phúc",
    province_name: "Huyện Bình Xuyên",
    school_address: "TT Gia Khánh - Huyện Bình Xuyên - Tỉnh Vĩnh Phúc"
  },
  {
    school_name: "Trường THPT Yên Lạc 2",
    department_edu: "Sở GD&ĐT Vĩnh Phúc",
    province: "Vĩnh Phúc",
    province_name: "Huyện Yên Lạc",
    school_address: "Xã Liên Châu - Yên Lạc - Vĩnh Phúc"
  },
  {
    school_name: "Trường THPT Trần Phú",
    department_edu: "Sở GD&ĐT Vĩnh Phúc",
    province: "Vĩnh Phúc",
    province_name: "Thành phố Vĩnh Yên ",
    school_address: "Phường Liên Bảo, TP Vĩnh Yên, Tỉnh Vĩnh Phúc"
  },
  {
    school_name: "Trường THPT Bình Xuyên",
    department_edu: "Sở GD&ĐT Vĩnh Phúc",
    province: "Vĩnh Phúc",
    province_name: "Huyện Bình Xuyên",
    school_address: "Huyện Bình Xuyên, Tỉnh Vĩnh Phúc"
  },
  {
    school_name: "Trường THPT Nguyễn Duy Thì",
    department_edu: "Sở GD&ĐT Vĩnh Phúc",
    province: "Vĩnh Phúc",
    province_name: "Huyện Bình Xuyên",
    school_address: "Xã Bá Hiến - Huyện Bình Xuyên - Tỉnh Vĩnh Phúc"
  },
  {
    school_name: "Trường THPT Nguyễn Thị Giang",
    department_edu: "Sở GD&ĐT Vĩnh Phúc",
    province: "Vĩnh Phúc",
    province_name: "Huyện Vĩnh Tường",
    school_address: "Xã Lũng Hòa, huyện Vĩnh Tường, Tỉnh Vĩnh Phúc"
  },
  {
    school_name: "Trường THPT Phạm Công Bình",
    department_edu: "Sở GD&ĐT Vĩnh Phúc",
    province: "Vĩnh Phúc",
    province_name: "Huyện Yên Lạc",
    school_address: "Xã Nguyệt Đức - Huyện Yên Lạc - Tỉnh Vĩnh Phúc"
  },
  {
    school_name: "Trường PTDTNT Thpt Phúc Yên",
    department_edu: "Sở GD&ĐT Vĩnh Phúc",
    province: "Vĩnh Phúc",
    province_name: "Thị xã Phúc Yên",
    school_address: "Thôn Gốc Duỗi - Xã Ngọc Thanh - Phúc Yên - Vĩnh Phúc"
  },
  {
    school_name: "Trường THPT Hai Bà Trưng",
    department_edu: "Sở GD&ĐT Vĩnh Phúc",
    province: "Vĩnh Phúc",
    province_name: "Thị xã Phúc Yên",
    school_address: "Hùng Vương- Thị Xã Phúc Yên - Tỉnh Vĩnh Phúc"
  },
  {
    school_name: "Trường THPT Tam Đảo",
    department_edu: "Sở GD&ĐT Vĩnh Phúc",
    province: "Vĩnh Phúc",
    province_name: "Huyện Tam Đảo",
    school_address: "Xã Tam Quan – Huyện Tam Đảo – Tỉnh Vĩnh Phúc"
  },
  {
    school_name: "Trường THPT Liễn Sơn",
    department_edu: "Sở GD&ĐT Vĩnh Phúc",
    province: "Vĩnh Phúc",
    province_name: "Huyện Lập Thạch",
    school_address: "TT Hoa Sơn - Huyện Lập Thạch - Tỉnh Vĩnh Phúc"
  },
  {
    school_name: "Trường THPT Trần Nguyên Hãn",
    department_edu: "Sở GD&ĐT Vĩnh Phúc",
    province: "Vĩnh Phúc",
    province_name: "Huyện Lập Thạch",
    school_address: "Xã Triệu Đề - huyện Lập Thạch - tỉnh Vĩnh Phúc"
  },
  {
    school_name: "Trường THPT Bình Sơn",
    department_edu: "Sở GD&ĐT Vĩnh Phúc",
    province: "Vĩnh Phúc",
    province_name: "Huyện Sông Lô",
    school_address: "Xã Nhân Đạo - Huyện Sông Lô - Tỉnh Vĩnh Phúc"
  },
  {
    school_name: "Trường THPT Ngô Gia Tự",
    department_edu: "Sở GD&ĐT Vĩnh Phúc",
    province: "Vĩnh Phúc",
    province_name: "Huyện Lập Thạch",
    school_address: "Thị trấn Lập Thạch - huyện Lập Thạch - tỉnh Vĩnh Phúc"
  },
  {
    school_name: "Trường THPT Chuyên Vĩnh Phúc",
    department_edu: "Sở GD&ĐT Vĩnh Phúc",
    province: "Vĩnh Phúc",
    province_name: "Thành phố Vĩnh Yên ",
    school_address: "Phố Chu Văn An, Phường Liên Bảo, TP Vĩnh Yên, tỉnh Vĩnh Phúc"
  },
  {
    school_name: "Trường THPT Triệu Thái",
    department_edu: "Sở GD&ĐT Vĩnh Phúc",
    province: "Vĩnh Phúc",
    province_name: "Huyện Lập Thạch",
    school_address: "Thị trấn Lập Thạch - Lập Thạch - Vĩnh Phúc"
  },
  {
    school_name: "Trường THPT Tam Dương",
    department_edu: "Sở GD&ĐT Vĩnh Phúc",
    province: "Vĩnh Phúc",
    province_name: "Huyện Tam Dương",
    school_address: "Thị trấn Hợp Hòa - Tam Dương - Vĩnh Phúc"
  },
  {
    school_name: "Trường THPT Sông Lô",
    department_edu: "Sở GD&ĐT Vĩnh Phúc",
    province: "Vĩnh Phúc",
    province_name: "Huyện Sông Lô",
    school_address: "Xã Đồng Thịnh - huyện Sông Lô - tỉnh Vĩnh Phúc"
  },
  {
    school_name: "Trường THPT Liên Bảo",
    department_edu: "Sở GD&ĐT Vĩnh Phúc",
    province: "Vĩnh Phúc",
    province_name: "Thành phố Vĩnh Yên ",
    school_address: "Đường Phan Bội Châu - Phường Liên Bảo - Thành phố Vĩnh Yên - Tỉnh Vĩnh Phúc"
  },
  {
    school_name: "Trường THPT Vĩnh Tường",
    department_edu: "Sở GD&ĐT Vĩnh Phúc",
    province: "Vĩnh Phúc",
    province_name: "Huyện Vĩnh Tường",
    school_address: "Huyện Vĩnh Tường - tỉnh Vĩnh phúc"
  },
  {
    school_name: "Trường THPT Chuyên Bắc Ninh",
    department_edu: "Sở GD&ĐT Bắc Ninh",
    province: "Bắc Ninh",
    province_name: "Thành phố Bắc Ninh",
    school_address: "Khu Hồ Ngọc Lân 4, Đường Ngô Sỹ Liên, Phường Kinh Bắc, Tp Bắc Ninh, tỉnh Bắc Ninh"
  },
  {
    school_name: "Trường THPT Hàn Thuyên",
    department_edu: "Sở GD&ĐT Bắc Ninh",
    province: "Bắc Ninh",
    province_name: "Thành phố Bắc Ninh",
    school_address: "Phường Đại Phúc, Thành phố Bắc Ninh"
  },
  {
    school_name: "Trường THPT Lý Nhân Tông",
    department_edu: "Sở GD&ĐT Bắc Ninh",
    province: "Bắc Ninh",
    province_name: "Thành phố Bắc Ninh",
    school_address: "Xã Vạn An, Thành phố Bắc Ninh"
  },
  {
    school_name: "Trường THPT Nguyễn Du",
    department_edu: "Sở GD&ĐT Bắc Ninh",
    province: "Bắc Ninh",
    province_name: "Thành phố Bắc Ninh",
    school_address: "Phường Võ Cường, Thành phố Bắc Ninh, Tỉnh Bắc Ninh"
  },
  {
    school_name: "Trường THPT Yên Phong Số 1",
    department_edu: "Sở GD&ĐT Bắc Ninh",
    province: "Bắc Ninh",
    province_name: "Huyện Yên Phong",
    school_address: "Số 66 Huỳnh Thúc Kháng, Thị trấn Chờ, Yên Phong, Bắc Ninh"
  },
  {
    school_name: "Trường THPT Yên Phong Số 2",
    department_edu: "Sở GD&ĐT Bắc Ninh",
    province: "Bắc Ninh",
    province_name: "Huyện Yên Phong",
    school_address: "Thôn Lạc Trung, xã Yên Trung, huyện Yên Phong, Bắc Ninh"
  },
  {
    school_name: "Trường PTNK Thể dục thể thao OLYMPIC",
    department_edu: "Sở GD&ĐT Bắc Ninh",
    province: "Bắc Ninh",
    province_name: "Thị Xã Từ Sơn",
    school_address: "Phường Trang Hạ, Thị Xã Từ Sơn, tỉnh Bắc Ninh"
  },
  {
    school_name: "Trường Phổ thông liên cấp Lương Thế Vinh",
    department_edu: "Sở GD&ĐT Bắc Ninh",
    province: "Bắc Ninh",
    province_name: "Thành phố Bắc Ninh",
    school_address: "Khu Khúc Toại, phường Khúc Xuyên, TP Bắc Ninh"
  },
  {
    school_name: "Trường THPT Gia Bình số 1",
    department_edu: "Sở GD&ĐT Bắc Ninh",
    province: "Bắc Ninh",
    province_name: "Huyện Gia Bình",
    school_address: "Thôn Phố Ngụ -Xã Nhân Thắng - Huyện Gia Bình - Bắc Ninh"
  },
  {
    school_name: "Trường THPT Hoàng Quốc Việt",
    department_edu: "Sở GD&ĐT Bắc Ninh",
    province: "Bắc Ninh",
    province_name: "Thành phố Bắc Ninh",
    school_address: "Phường Thị Cầu, Thành phố Bắc Ninh, tỉnh Bắc Ninh"
  },
  {
    school_name: "Trường THPT Hàm Long",
    department_edu: "Sở GD&ĐT Bắc Ninh",
    province: "Bắc Ninh",
    province_name: "Thành phố Bắc Ninh",
    school_address: "Phường Nam Sơn, Thành phố Bắc Ninh, tỉnh Bắc Ninh"
  },
  {
    school_name: "Trường THPT Lê Văn Thịnh",
    department_edu: "Sở GD&ĐT Bắc Ninh",
    province: "Bắc Ninh",
    province_name: "Huyện Gia Bình",
    school_address: "Đường Lê Văn Thịnh, Thị trấn Gia Bình, Huyện Gia Bình, tỉnh Bắc Ninh"
  },
  {
    school_name: "Trường THPT Lý Thái Tổ",
    department_edu: "Sở GD&ĐT Bắc Ninh",
    province: "Bắc Ninh",
    province_name: "Thành phố Từ Sơn",
    school_address: "Phường Đình Bảng, Thành phố Từ Sơn, tỉnh Bắc Ninh"
  },
  {
    school_name: "Trường THPT Lý Thường Kiệt",
    department_edu: "Sở GD&ĐT Bắc Ninh",
    province: "Bắc Ninh",
    province_name: "Thành phố Bắc Ninh",
    school_address: "Phố Và - Phường Hạp Lĩnh - TP.Bắc Ninh - Bắc Ninh"
  },
  {
    school_name: "Trường THPT Lương Tài",
    department_edu: "Sở GD&ĐT Bắc Ninh",
    province: "Bắc Ninh",
    province_name: "Huyện Lương Tài",
    school_address: "Thị trấn Thứa, Huyện Lương Tài, tỉnh Bắc Ninh"
  },
  {
    school_name: "Trường THPT Lương Tài số 2",
    department_edu: "Sở GD&ĐT Bắc Ninh",
    province: "Bắc Ninh",
    province_name: "Huyện Lương Tài",
    school_address: "Xã Trung Kênh, Huyện Lương Tài, tỉnh Bắc Ninh"
  },
  {
    school_name: "Trường THPT Nguyễn Văn Cừ",
    department_edu: "Sở GD&ĐT Bắc Ninh",
    province: "Bắc Ninh",
    province_name: "Thị Xã Từ Sơn",
    school_address: "Xã Phù Khê, Thị xã Từ Sơn, tỉnh Bắc Ninh"
  },
  {
    school_name: "Trường THPT Nguyễn Đăng Đạo",
    department_edu: "Sở GD&ĐT Bắc Ninh",
    province: "Bắc Ninh",
    province_name: "Huyện Tiên Du",
    school_address: "Số 88 - Nguyễn Đăng Đạo - Thị trấn Lim - Tiên Du - Bắc Ninh"
  },
  {
    school_name: "Trường THPT Ngô Gia Tự",
    department_edu: "Sở GD&ĐT Bắc Ninh",
    province: "Bắc Ninh",
    province_name: "Thị Xã Từ Sơn",
    school_address: "Đường Nguyễn Quán Quang, Xã Tam Sơn, Thị xã Từ Sơn, Tỉnh Bắc Ninh"
  },
  {
    school_name: "Trường THPT Quế Võ số 1",
    department_edu: "Sở GD&ĐT Bắc Ninh",
    province: "Bắc Ninh",
    province_name: "Thị xã Quế Võ",
    school_address: "Phường Phố Mới, thị xã Quế Võ, tỉnh Bắc Ninh"
  },
  {
    school_name: "Trường THPT Quế Võ số 2",
    department_edu: "Sở GD&ĐT Bắc Ninh",
    province: "Bắc Ninh",
    province_name: "Huyện Quế Võ",
    school_address: "Xã Đào Viên, Huyện Quế Võ, tỉnh Bắc Ninh"
  },
  {
    school_name: "Trường THPT Quế Võ số 3",
    department_edu: "Sở GD&ĐT Bắc Ninh",
    province: "Bắc Ninh",
    province_name: "Huyện Quế Võ",
    school_address: "Xã Mộ Đạo, Huyện Quế Võ, tỉnh Bắc Ninh"
  },
  {
    school_name: "Trường THPT Thuận Thành số 1",
    department_edu: "Sở GD&ĐT Bắc Ninh",
    province: "Bắc Ninh",
    province_name: "Huyện Thuận Thành",
    school_address: "Xã Gia Đông, Huyện Thuận Thành, tỉnh Bắc Ninh"
  },
  {
    school_name: "Trường THPT Thuận Thành số 2",
    department_edu: "Sở GD&ĐT Bắc Ninh",
    province: "Bắc Ninh",
    province_name: "Huyện Thuận Thành",
    school_address: "Xã Thanh Khương, Huyện Thuận Thành, tỉnh Bắc Ninh"
  },
  {
    school_name: "Trường THPT Thuận Thành số 3",
    department_edu: "Sở GD&ĐT Bắc Ninh",
    province: "Bắc Ninh",
    province_name: "Huyện Thuận Thành",
    school_address: "Song Hồ, Thuận Thành, Bắc Ninh"
  },
  {
    school_name: "Trường THPT Tiên Du số 1",
    department_edu: "Sở GD&ĐT Bắc Ninh",
    province: "Bắc Ninh",
    province_name: "Huyện Tiên Du",
    school_address: "Xã Việt Đoàn, Huyện Tiên Du, tỉnh Bắc Ninh"
  },
  {
    school_name: "Trường THPT Từ Sơn",
    department_edu: "Sở GD&ĐT Bắc Ninh",
    province: "Bắc Ninh",
    province_name: "Thị Xã Từ Sơn",
    school_address: "Phường Trang Hạ, Thị xã Từ Sơn, Tỉnh Bắc Ninh"
  },
  {
    school_name: "Trường THPT Chuyên Hạ Long",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Thành phố Hạ Long",
    school_address: "Tổ 7 - Khu 2B - P. Hồng Hải - TP. Hạ Long - Tỉnh Quảng Ninh"
  },
  {
    school_name: "Trường THPT.DTNT tỉnh",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Thành phố Hạ Long",
    school_address: "P.Hồng Hải, TP Hạ Long"
  },
  {
    school_name: "Trường THPT Hòn Gai",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Thành phố Hạ Long",
    school_address: "P. Hồng Hải, TP Hạ Long"
  },
  {
    school_name: "Trường THPT Ngô Quyền",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Thành phố Hạ Long",
    school_address: "P.Cao Thắng,TP Hạ Long"
  },
  {
    school_name: "Trường THPT Vũ Văn Hiếu",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Thành phố Hạ Long",
    school_address: "P.Hà Tu, TP Hạ Long"
  },
  {
    school_name: "Trường THPT Bãi Cháy",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Thành phố Hạ Long",
    school_address: "P.Bãi Cháy, TP Hạ Long"
  },
  {
    school_name: "Trường THPT Hạ Long",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Thành phố Hạ Long",
    school_address: "P.Cao Xanh, TP Hạ Long"
  },
  {
    school_name: "Trường THPT Nguyễn Bình Khiêm",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Thành phố Hạ Long",
    school_address: "P.Hà Khẩu, TP Hạ Long"
  },
  {
    school_name: "Trường THPT Cẩm Phả",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Thành phố Cẩm Phả",
    school_address: "P.Cẩm Thành, Cẩm Phả"
  },
  {
    school_name: "Trường THPT Lê Hồng Phong",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Thành phố Cẩm Phả",
    school_address: "P.Cẩm Phú, Cẩm Phả"
  },
  {
    school_name: "Trường THPT Cửa Ông",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Thành phố Cẩm Phả",
    school_address: "P.Cửa Ông, Cẩm Phả"
  },
  {
    school_name: "Trường THPT Lê Quý Đôn",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Thành phố Cẩm Phả",
    school_address: "P.Quang Hanh, Cẩm Phả"
  },
  {
    school_name: "Trường THPT Mông Dương",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Thành phố Cẩm Phả",
    school_address: "P.Mông Dương, Cẩm Phả"
  },
  {
    school_name: "Trường THPT Lương Thế Vinh",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Thành phố Cẩm Phả",
    school_address: "P.Cẩm Trung, Cẩm Phả"
  },
  {
    school_name: "Trường THPT Hùng Vương",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Thành phố Cẩm Phả",
    school_address: "P.Cẩm Phú, Cẩm Phả"
  },
  {
    school_name: "Trường THPT Uông Bí",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Thành phố Uông Bí",
    school_address: "P.Quang Trung, Uông Bí"
  },
  {
    school_name: "Trường THPT Hoàng Văn Thụ",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Thành phố Uông Bí",
    school_address: "P.Vành Danh, Uông Bí"
  },
  {
    school_name: "Trường THPT Hồng Đức",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Thành phố Uông Bí",
    school_address: "P.Quang Trung, Uông Bí"
  },
  {
    school_name: "Trường THPT Nguyễn Tất Thành",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Thành phố Uông Bí",
    school_address: "P.Phương Đông,Uông Bí"
  },
  {
    school_name: "Trường THPT Trần Phú",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Thành phố Móng Cái",
    school_address: "P.Ka Long, TP Móng Cái"
  },
  {
    school_name: "Trường THPT Lý Thường Kiệt",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Thành phố Móng Cái",
    school_address: "P.Hải Tiến, TP Móng Cái"
  },
  {
    school_name: "Trường THPT Bình Liêu",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Huyện Bình Liêu",
    school_address: "TT Bình Liêu, Bình Liêu"
  },
  {
    school_name: "Trường THPT Đầm Hà",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Huyện Đầm Hà",
    school_address: "TT Đầm Hà, Đầm Hà"
  },
  {
    school_name: "Trường THPT Quảng Hà",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Huyện Hải Hà",
    school_address: "TT Quảng Hà, Hải Hà"
  },
  {
    school_name: "Trường THPT Nguyễn Du",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Huyện Hải Hà",
    school_address: "TT Quảng Hà, Hải Hà"
  },
  {
    school_name: "Trường THPT Tiên Yên",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Huyện Tiên Yên",
    school_address: "TT Tiên Yên, Tiên Yên"
  },
  {
    school_name: "Trường THPT Hải Đông",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Huyện Tiên Yên",
    school_address: "X.Đông Hải, Tiên Yên"
  },
  {
    school_name: "Trường THPT Nguyễn Trãi",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Huyện Tiên Yên",
    school_address: "X.Tiên Lãng, Tiên Yên"
  },
  {
    school_name: "Trường THPT Ba Chẽ",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Huyện Ba Chẽ",
    school_address: "TT Ba Chẽ, H. Ba Chẽ"
  },
  {
    school_name: "Trường THPT Đông Triều",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Huyện Đông Triều",
    school_address: "TT Đông Triều, H.Đông Triều"
  },
  {
    school_name: "Trường THPT Hoàng Quốc Việt",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Huyện Đông Triều",
    school_address: "TT Mạo Khê, H.Đông Triều"
  },
  {
    school_name: "Trường THPT Hoàng Hoa Thám",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Huyện Đông Triều",
    school_address: "X.Hoàng Quế, H.Đông Triều"
  },
  {
    school_name: "Trường THPT Lê Chân",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Huyện Đông Triều",
    school_address: "X.Thuỷ An, H.Đông Triều"
  },
  {
    school_name: "Trường THPT Bạch Đằng",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Thị xã Quảng Yên",
    school_address: "P.Quảng Yên, TX Quảng Yên"
  },
  {
    school_name: "Trường THPT Minh Hà",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Thị xã Quảng Yên",
    school_address: "P. Cẩm La, TX Quảng Yên"
  },
  {
    school_name: "Trường THPT Đông Thành",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Thị xã Quảng Yên",
    school_address: "P. Minh Thành, TX Quảng Yên"
  },
  {
    school_name: "Trường THPT Yên Hưng",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Thị xã Quảng Yên",
    school_address: "P.Quảng Yên, TX Quảng Yên"
  },
  {
    school_name: "Trường THPT Trần Quốc Tuấn",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Thị xã Quảng Yên",
    school_address: "P. Minh Thành, TX Quảng Yên"
  },
  {
    school_name: "Trường THPT Ngô Gia Tự",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Thị xã Quảng Yên",
    school_address: "P. Liên Hoà, TX Quảng Yên"
  },
  {
    school_name: "Trường THPT Hoành Bồ",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Huyện Hoành Bồ",
    school_address: "T.Trấn Trới, Hoành Bồ"
  },
  {
    school_name: "Trường THPT Quảng La",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Huyện Hoành Bồ",
    school_address: "Xã Quảng La, H. Hoành Bồ"
  },
  {
    school_name: "Trường THPT Thống Nhất",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Huyện Vân Đồn",
    school_address: "Xã Thống Nhất, H. Hoành Bồ"
  },
  {
    school_name: "Trường THPT Hải Đảo",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Huyện Vân Đồn",
    school_address: "Xã Hạ Long, Vân Đồn"
  },
  {
    school_name: "Trường THPT Quan Lạn",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Huyện Vân Đồn",
    school_address: "Xã Quan Lạn,Vân Đồn"
  },
  {
    school_name: "Trường THPT Trần Khánh Dư",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Huyện Vân Đồn",
    school_address: "Xã Đông Xá, Vân Đồn"
  },
  {
    school_name: "Trường THPT Cô Tô",
    department_edu: "Sở GD&ĐT Quảng Ninh",
    province: "Quảng Ninh",
    province_name: "Thị trấn Cô Tô",
    school_address: "T.trấn Cô Tô, Cô Tô"
  },
  {
    school_name: "Trường THPT Chuyên tỉnh Hưng Yên",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Thành phố Hưng Yên",
    school_address: "Ph. An Tảo, TP Hưng Yên"
  },
  {
    school_name: "Trường THPT TP Hưng Yên",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Thành phố Hưng Yên",
    school_address: "Ph. Quang Trung, TP Hưng Yên"
  },
  {
    school_name: "Trường THPT Tô Hiệu",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Thành phố Hưng Yên",
    school_address: "Ph. Hiến Nam, TP Hưng Yên"
  },
  {
    school_name: "Trường THPT Quang Trung",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Thành phố Hưng Yên",
    school_address: "Xã Bảo Khê TP Hưng Yên"
  },
  {
    school_name: "Trường THPT Kim Động",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Huyện Kim Động",
    school_address: "Xã Lương Bằng H Kim Động"
  },
  {
    school_name: "Trường THPT Đức Hợp",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Huyện Kim Động",
    school_address: "Xã Đức Hợp H Kim Động"
  },
  {
    school_name: "Trường THPT Nghĩa Dân",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Huyện Kim Động",
    school_address: "Xã Nghĩa Dân, Kim Động, HY"
  },
  {
    school_name: "Trường THPT Nguyễn Trãi",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Huyện Kim Động",
    school_address: "Xã Lương Bằng H. Kim Động HY"
  },
  {
    school_name: "Trường THPT Ân Thi",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Huyện Ân Thi",
    school_address: "TTr. Ân Thi, Huyện Ân Thi"
  },
  {
    school_name: "Trường THPT Ng Trung Ngạn",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Huyện Ân Thi",
    school_address: "Xã Hồ Tùng Mậu H Ân Thi"
  },
  {
    school_name: "Trường THPT Lê Quý Đôn",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Huyện Ân Thi",
    school_address: "TTr. Ân Thi, Ân Thi"
  },
  {
    school_name: "Trường THPT Phạm Ngũ Lão",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Huyện Ân Thi",
    school_address: "Xã Tân Phúc H Ân Thi"
  },
  {
    school_name: "Trường THPT Khoái Châu",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Huyện Khoái Châu",
    school_address: "TTr. Khoái Châu"
  },
  {
    school_name: "Trường THPT Nam Khoái Châu",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Huyện Khoái Châu",
    school_address: "Xã Đại Hưng H Khoái Châu"
  },
  {
    school_name: "Trường THPT Trần Quang Khải",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Huyện Khoái Châu",
    school_address: "Xã Dạ Trạch H Khoái Châu"
  },
  {
    school_name: "Trường THPT Phùng Hưng",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Huyện Khoái Châu",
    school_address: "Xã Phùng Hưng H Khoái Châu"
  },
  {
    school_name: "Trường THPT Nguyễn Siêu",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Huyện Khoái Châu",
    school_address: "Xã Đông Kết, Khoái Châu, HY"
  },
  {
    school_name: "Trường THPT Yên Mỹ",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Huyện Yên Mỹ",
    school_address: "Xã Tân Lập H Yên Mỹ"
  },
  {
    school_name: "Trường THPT Triệu Quang Phục",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Huyện Yên Mỹ",
    school_address: "Yên Phú H Yên Mỹ"
  },
  {
    school_name: "Trường THPT Hồng Bàng",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Huyện Yên Mỹ",
    school_address: "TTr. Yên Mỹ H Yên Mỹ"
  },
  {
    school_name: "Trường THPT Minh Châu",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Huyện Yên Mỹ",
    school_address: "Xã Tân Lập, Yên Mỹ, Hưng Yên"
  },
  {
    school_name: "Trường THPT Tiên Lữ",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Huyện Tiên Lữ",
    school_address: "TTr. Vương H Tiên Lữ"
  },
  {
    school_name: "Trường THPT Trần Hưng Đạo",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Huyện Tiên Lữ",
    school_address: "Xã Thiện Phiến H Tiên Lữ"
  },
  {
    school_name: "Trường THPT Hoàng Hoa Thám",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Huyện Tiên Lữ",
    school_address: "Xã Thuỵ Lôi H Tiên Lữ"
  },
  {
    school_name: "Trường THPT Ngô Quyền",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Huyện Tiên Lữ",
    school_address: "TTr. Vương, Tiên Lữ, Hưng Yên"
  },
  {
    school_name: "Trường THPT Phù Cừ",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Huyện Phù Cừ",
    school_address: "Xã Tống Phan H Phù Cừ"
  },
  {
    school_name: "Trường THPT Nam Phù Cừ",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Huyện Phù Cừ",
    school_address: "Xã Tam Đa H Phù Cừ"
  },
  {
    school_name: "Trường THPT Nguyễn Du",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Huyện Phù Cừ",
    school_address: "TTr. Phù Cừ, Phù Cừ, Hưng Yên"
  },
  {
    school_name: "Trường THPT Mỹ Hào",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Huyện Mỹ Hào",
    school_address: "TTr. Bần H Mỹ Hào"
  },
  {
    school_name: "Trường THPT Nguyễn Thiện Thuật",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Huyện Mỹ Hào",
    school_address: "Xã Bạch Sam H Mỹ Hào"
  },
  {
    school_name: "Trường THPT Hồng Đức",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Huyện Mỹ Hào",
    school_address: "Xã Dị Sử, Mỹ Hào, Hưng Yên"
  },
  {
    school_name: "Trường THPT Văn Lâm",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Huyện Văn Lâm",
    school_address: "Xã Lạc Đạo H Văn Lâm"
  },
  {
    school_name: "Trường THPT Trưng Vương",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Huyện Văn Lâm",
    school_address: "Xã Trưng Trắc H Văn Lâm"
  },
  {
    school_name: "Trường THPT Hùng Vương",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Huyện Văn Lâm",
    school_address: "H. Văn Lâm, Hưng Yên"
  },
  {
    school_name: "Trường THPT Lương Tài",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Huyện Văn Lâm",
    school_address: "Xã Lương Tài, Văn Lâm, HY"
  },
  {
    school_name: "Trường THPT Văn Giang",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Huyện Văn Giang",
    school_address: "Xã Cửu Cao H Văn Giang"
  },
  {
    school_name: "Trường THPT Dương Quảng Hàm",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Huyện Văn Giang",
    school_address: "Xã Liên Nghĩa, Văn Giang, HY"
  },
  {
    school_name: "Trường THPT Nguyễn Công Hoan",
    department_edu: "Sở GD&ĐT Hưng Yên",
    province: "Hưng Yên",
    province_name: "Huyện Văn Giang",
    school_address: "Xã Long Hưng,Văn Giang, HY"
  },
  {
    school_name: "Trường THPT Chuyên",
    department_edu: "Sở GD&ĐT Hà Giang",
    province: "Hà Giang",
    province_name: "Thành phố Hà Giang",
    school_address: "Phường Minh Khai, TP Hà Giang"
  },
  {
    school_name: "Trường THPT Lê Hồng Phong",
    department_edu: "Sở GD&ĐT Hà Giang",
    province: "Hà Giang",
    province_name: "Thành phố Hà Giang",
    school_address: "Phường Minh Khai, TP Hà Giang"
  },
  {
    school_name: "Trường THPT Ngọc Hà",
    department_edu: "Sở GD&ĐT Hà Giang",
    province: "Hà Giang",
    province_name: "Thành phố Hà Giang",
    school_address: "Xã Ngọc Đường, TP Hà Giang"
  },
  {
    school_name: "Trường THPT Đồng Văn",
    department_edu: "Sở GD&ĐT Hà Giang",
    province: "Hà Giang",
    province_name: "Huyện Đồng Văn",
    school_address: "TT. Đồng Văn, H. Đồng Văn"
  },
  {
    school_name: "Trường THPT Mèo Vạc",
    department_edu: "Sở GD&ĐT Hà Giang",
    province: "Hà Giang",
    province_name: "Huyện Mèo Vạc",
    school_address: "TT. Mèo Vạc, H. Mèo Vạc"
  },
  {
    school_name: "Trường THPT Yên Minh",
    department_edu: "Sở GD&ĐT Hà Giang",
    province: "Hà Giang",
    province_name: "Huyện Yên Minh",
    school_address: "TT. Yên Minh, H.Yên minh"
  },
  {
    school_name: "Trường THPT Mậu Duệ",
    department_edu: "Sở GD&ĐT Hà Giang",
    province: "Hà Giang",
    province_name: "Huyện Yên Minh",
    school_address: "Xã Mậu Duệ, H. Yên Minh"
  },
  {
    school_name: "Trường THPT Quản Bạ",
    department_edu: "Sở GD&ĐT Hà Giang",
    province: "Hà Giang",
    province_name: "Huyện Quản Bạ",
    school_address: "TT. Tam Sơn, H.Quản Bạ"
  },
  {
    school_name: "Trường THPT Quyết Tiến",
    department_edu: "Sở GD&ĐT Hà Giang",
    province: "Hà Giang",
    province_name: "Huyện Quản Bạ",
    school_address: "Xã Quyết Tiến, H. Quản Bạ"
  },
  {
    school_name: "Trường THPT Vị Xuyên",
    department_edu: "Sở GD&ĐT Hà Giang",
    province: "Hà Giang",
    province_name: "Huyện Vị Xuyên",
    school_address: "TT. Vị Xuyên, H.Vị Xuyên"
  },
  {
    school_name: "Trường THPT Việt Lâm",
    department_edu: "Sở GD&ĐT Hà Giang",
    province: "Hà Giang",
    province_name: "Huyện Vị Xuyên",
    school_address: "TT. Việt Lâm, H.Vị Xuyên"
  },
  {
    school_name: "Trường THPT Bắc Mê",
    department_edu: "Sở GD&ĐT Hà Giang",
    province: "Hà Giang",
    province_name: "Huyện Bắc Mê",
    school_address: "TT. Yên Phú, H.Bắc Mê"
  },
  {
    school_name: "Trường THPT Hoàng Su Phì",
    department_edu: "Sở GD&ĐT Hà Giang",
    province: "Hà Giang",
    province_name: "Huyện Hoàng Su Phì",
    school_address: "TT. Vinh Quang, H. Hoàng Su Phì"
  },
  {
    school_name: "Trường THPT Thông Nguyên",
    department_edu: "Sở GD&ĐT Hà Giang",
    province: "Hà Giang",
    province_name: "Huyện Hoàng Su Phì",
    school_address: "Xã Thông Nguyên, H. Hoàng Su Phì"
  },
  {
    school_name: "Trường THPT Xín Mần",
    department_edu: "Sở GD&ĐT Hà Giang",
    province: "Hà Giang",
    province_name: "Huyện Xín Mần",
    school_address: "TT. Cốc Pài, H Xín Mần"
  },
  {
    school_name: "Trường THPT Đồng Yên",
    department_edu: "Sở GD&ĐT Hà Giang",
    province: "Hà Giang",
    province_name: "Huyện Bắc Quang",
    school_address: "Xã Đồng Yên, H. Bắc Quang"
  },
  {
    school_name: "Trường THPT Việt Vinh",
    department_edu: "Sở GD&ĐT Hà Giang",
    province: "Hà Giang",
    province_name: "Huyện Bắc Quang",
    school_address: "TT. Việt Quang, H. Bắc Quang"
  },
  {
    school_name: "Trường THPT Hùng An",
    department_edu: "Sở GD&ĐT Hà Giang",
    province: "Hà Giang",
    province_name: "Huyện Bắc Quang",
    school_address: "Xã Hùng An, H. Bắc Quang"
  },
  {
    school_name: "Trường THPT Liên Hiệp",
    department_edu: "Sở GD&ĐT Hà Giang",
    province: "Hà Giang",
    province_name: "Huyện Bắc quang",
    school_address: "Xã Liên Hiệp, H. Bắc quang"
  },
  {
    school_name: "Trường THPT Kim Ngọc",
    department_edu: "Sở GD&ĐT Hà Giang",
    province: "Hà Giang",
    province_name: "Huyện Bắc Quang",
    school_address: "Xã Kim Ngọc, H. Bắc Quang"
  },
  {
    school_name: "Trường THPT Xuân Giang",
    department_edu: "Sở GD&ĐT Hà Giang",
    province: "Hà Giang",
    province_name: "Huyện Quang Bình",
    school_address: "Xã Xuân Giang, H.Quang Bình"
  },
  {
    school_name: "Trường THPT Quang Bình",
    department_edu: "Sở GD&ĐT Hà Giang",
    province: "Hà Giang",
    province_name: "Huyện Quang Bình",
    school_address: "TT. Yên Bình - H. Quang Bình"
  },
  {
    school_name: "Trường Phổ thông Dân tộc nội trú THPT tỉnh Tuyên Quang",
    department_edu: "Sở GD&ĐT Tuyên Quang",
    province: "Tuyên Quang",
    province_name: "Thành phố Tuyên Quang",
    school_address: "Ph. Nông Tiến, TP.Tuyên Quang"
  },
  {
    school_name: "Trường THPT Chuyên tỉnh",
    department_edu: "Sở GD&ĐT Tuyên Quang",
    province: "Tuyên Quang",
    province_name: "Thành phố Tuyên Quang",
    school_address: "Ph. Minh Xuân, TP.Tuyên Quang, tỉnh Tuyên Quang"
  },
  {
    school_name: "Trường THPT Tân Trào",
    department_edu: "Sở GD&ĐT Tuyên Quang",
    province: "Tuyên Quang",
    province_name: "Thành phố Tuyên Quang",
    school_address: "Ph. Tân Quang, TP.Tuyên Quang, tỉnh Tuyên Quang"
  },
  {
    school_name: "Trường THPT ỷ La",
    department_edu: "Sở GD&ĐT Tuyên Quang",
    province: "Tuyên Quang",
    province_name: "Thành phố Tuyên Quang",
    school_address: "P.Tân Hà, TP.Tuyên Quang, tỉnh Tuyên Quang"
  },
  {
    school_name: "Trường THPT Nguyễn Văn Huyên",
    department_edu: "Sở GD&ĐT Tuyên Quang",
    province: "Tuyên Quang",
    province_name: "Thành phố Tuyên Quang",
    school_address: "An Tường, TP.Tuyên Quang, tỉnh Tuyên Quang"
  },
  {
    school_name: "Trường THPT Sông Lô",
    department_edu: "Sở GD&ĐT Tuyên Quang",
    province: "Tuyên Quang",
    province_name: "Huyện Lâm Bình",
    school_address: "Đội Cấn, TP.Tuyên Quang, tỉnh Tuyên Quang"
  },
  {
    school_name: "Trường THPT Thượng Lâm",
    department_edu: "Sở GD&ĐT Tuyên Quang",
    province: "Tuyên Quang",
    province_name: "Huyện Lâm Bình",
    school_address: "Xã Thượng Lâm, H. Lâm Bình, Tuyên Quang"
  },
  {
    school_name: "Trường THPT Lâm Bình",
    department_edu: "Sở GD&ĐT Tuyên Quang",
    province: "Tuyên Quang",
    province_name: "Huyện Na Hang",
    school_address: "Xã Lăng Can, H.Lâm Bình, Tuyên Quang"
  },
  {
    school_name: "Trường THPT Na Hang",
    department_edu: "Sở GD&ĐT Tuyên Quang",
    province: "Tuyên Quang",
    province_name: "Huyện Na Hang",
    school_address: "TT Na Hang, H. Na Hang, Tuyên Quang"
  },
  {
    school_name: "Trường THPT Yên Hoa",
    department_edu: "Sở GD&ĐT Tuyên Quang",
    province: "Tuyên Quang",
    province_name: "Huyện Chiêm Hóa",
    school_address: "Xã Yên Hoa, Na Hang, Tuyên Quang"
  },
  {
    school_name: "Trường THPT Chiêm Hóa",
    department_edu: "Sở GD&ĐT Tuyên Quang",
    province: "Tuyên Quang",
    province_name: "Huyện Chiêm Hóa",
    school_address: "TT. Vĩnh Lộc, H. Chiêm Hóa, Tuyên Quang"
  },
  {
    school_name: "Trường THPT Kim Bình",
    department_edu: "Sở GD&ĐT Tuyên Quang",
    province: "Tuyên Quang",
    province_name: "Huyện Chiêm Hóa",
    school_address: "Xã Kim Bình, H. Chiêm Hóa, Tuyên Quang"
  },
  {
    school_name: "Trường THPT Minh Quang",
    department_edu: "Sở GD&ĐT Tuyên Quang",
    province: "Tuyên Quang",
    province_name: "Huyện Chiêm Hóa",
    school_address: "Xã Minh Quang, H. Chiêm Hóa, Tuyên Quang"
  },
  {
    school_name: "Trường THPT Hà Lang",
    department_edu: "Sở GD&ĐT Tuyên Quang",
    province: "Tuyên Quang",
    province_name: "Huyện Chiêm Hóa",
    school_address: "Xã Hà Lang, H.Chiêm Hóa, Tuyên Quang"
  },
  {
    school_name: "Trường THPT Đầm Hồng",
    department_edu: "Sở GD&ĐT Tuyên Quang",
    province: "Tuyên Quang",
    province_name: "Huyện Chiêm Hóa",
    school_address: "Xã Đầm Hồng, H.Chiêm Hóa, Tuyên Quang"
  },
  {
    school_name: "Trường THPT Hòa Phú",
    department_edu: "Sở GD&ĐT Tuyên Quang",
    province: "Tuyên Quang",
    province_name: "Huyện Hàm Yên",
    school_address: "Xã Hòa Phú, H. Chiêm Hóa, Tuyên Quang"
  },
  {
    school_name: "Trường THPT Hàm Yên",
    department_edu: "Sở GD&ĐT Tuyên Quang",
    province: "Tuyên Quang",
    province_name: "Huyện Hàm Yên",
    school_address: "TT. Tân Yên, H. Hàm Yên, Tuyên Quang"
  },
  {
    school_name: "Trường THPT Phù Lưu",
    department_edu: "Sở GD&ĐT Tuyên Quang",
    province: "Tuyên Quang",
    province_name: "Huyện Hàm Yên",
    school_address: "Xã Phù Lưu, Hàm Yên, Tuyên Quang"
  },
  {
    school_name: "Trường THPT Thái Hòa",
    department_edu: "Sở GD&ĐT Tuyên Quang",
    province: "Tuyên Quang",
    province_name: "Huyện Yên Sơn",
    school_address: "Xã Thái Hòa, Hàm Yên, Tuyên Quang"
  },
  {
    school_name: "Trường THPT Xuân Huy",
    department_edu: "Sở GD&ĐT Tuyên Quang",
    province: "Tuyên Quang",
    province_name: "Huyện Yên Sơn",
    school_address: "Xã Trung Môn, Yên Sơn, Tuyên Quang"
  },
  {
    school_name: "Trường THPT Trung Sơn",
    department_edu: "Sở GD&ĐT Tuyên Quang",
    province: "Tuyên Quang",
    province_name: "Huyện Yên Sơn",
    school_address: "Xã Trung Sơn, Yên Sơn, Tuyên Quang"
  },
  {
    school_name: "Trường THPT Xuân Vân",
    department_edu: "Sở GD&ĐT Tuyên Quang",
    province: "Tuyên Quang",
    province_name: "Huyện Yên Sơn",
    school_address: "Xã Xuân Vân, Yên Sơn, Tuyên Quang"
  },
  {
    school_name: "Trường THPT Tháng 10",
    department_edu: "Sở GD&ĐT Tuyên Quang",
    province: "Tuyên Quang",
    province_name: "Huyện Sơn Dương",
    school_address: "Xã Mỹ Bằng, Yên Sơn, Tuyên Quang"
  },
  {
    school_name: "Trường THPT Sơn Dương",
    department_edu: "Sở GD&ĐT Tuyên Quang",
    province: "Tuyên Quang",
    province_name: "Huyện Sơn Dương",
    school_address: "TT. Sơn Dương, H. Sơn Dương, Tuyên Quang"
  },
  {
    school_name: "Trường THPT Kim Xuyên",
    department_edu: "Sở GD&ĐT Tuyên Quang",
    province: "Tuyên Quang",
    province_name: "Huyện Sơn Dương",
    school_address: "Xã Hồng Lạc, Sơn Dương, Tuyên Quang"
  },
  {
    school_name: "Trường THPT ATK Tân Trào",
    department_edu: "Sở GD&ĐT Tuyên Quang",
    province: "Tuyên Quang",
    province_name: "Huyện Sơn Dương",
    school_address: "Xã Tân Trào, Sơn Dương, Tuyên Quang"
  },
  {
    school_name: "Trường THPT Đông Thọ",
    department_edu: "Sở GD&ĐT Tuyên Quang",
    province: "Tuyên Quang",
    province_name: "Huyện Sơn Dương",
    school_address: "Xã Đông Thọ, Sơn Dương, Tuyên Quang"
  },
  {
    school_name: "Trường THPT Kháng Nhật",
    department_edu: "Sở GD&ĐT Tuyên Quang",
    province: "Tuyên Quang",
    province_name: "Huyện Sơn Dương",
    school_address: "Xã Kháng Nhật, Sơn Dương, Tuyên Quang"
  },
  {
    school_name: "Trường THPT Sơn Nam",
    department_edu: "Sở GD&ĐT Tuyên Quang",
    province: "Tuyên Quang",
    province_name: "Huyện Sơn Dương",
    school_address: "Xã Sơn Nam, Sơn Dương, Tuyên Quang"
  },
  {
    school_name: "Trường THPT Chuyên Nguyễn Tất Thành",
    department_edu: "Sở GD&ĐT Yên Bái",
    province: "Yên Bái",
    province_name: "Thành phố Yên Bái",
    school_address: "P.Đồng Tâm -TP Yên Bái"
  },
  {
    school_name: "Trường THPT Nguyễn Huệ",
    department_edu: "Sở GD&ĐT Yên Bái",
    province: "Yên Bái",
    province_name: "Thành phố Yên Bái",
    school_address: "P.Đồng Tâm -TP Yên Bái"
  },
  {
    school_name: "Trường THPT Lý Thường Kiệt",
    department_edu: "Sở GD&ĐT Yên Bái",
    province: "Yên Bái",
    province_name: "Thành phố Yên Bái",
    school_address: "P.Hồng Hà -TP Yên Bái"
  },
  {
    school_name: "Trường THPT Dân tộc nội trú",
    department_edu: "Sở GD&ĐT Yên Bái",
    province: "Yên Bái",
    province_name: "Thành phố Yên Bái",
    school_address: "P.Đồng Tâm -TP Yên Bái"
  },
  {
    school_name: "Trường THPT Hoàng Quốc Việt",
    department_edu: "Sở GD&ĐT Yên Bái",
    province: "Yên Bái",
    province_name: "Thành phố Yên Bái",
    school_address: "Xã Giới Phiên - TP Yên Bái"
  },
  {
    school_name: "Trường THPT Đồng Tâm",
    department_edu: "Sở GD&ĐT Yên Bái",
    province: "Yên Bái",
    province_name: "Thành phố Yên Bái",
    school_address: "P.Đồng Tâm -TP Yên Bái"
  },
  {
    school_name: "Trường THPT Nghĩa Lộ",
    department_edu: "Sở GD&ĐT Yên Bái",
    province: "Yên Bái",
    province_name: "Thị xã Nghĩa Lộ",
    school_address: "P. Tân An -TX Nghĩa Lộ"
  },
  {
    school_name: "Trường THPT Nguyễn Trãi",
    department_edu: "Sở GD&ĐT Yên Bái",
    province: "Yên Bái",
    province_name: "Thị xã Nghĩa Lộ",
    school_address: "P. Pú Trạng -TX Nghĩa Lộ"
  },
  {
    school_name: "Trường PT DTNT THPT Miền Tây",
    department_edu: "Sở GD&ĐT Yên Bái",
    province: "Yên Bái",
    province_name: "Thị xã Nghĩa Lộ",
    school_address: "P. Pú Trạng -TX Nghĩa Lộ"
  },
  {
    school_name: "Trường THPT Chu Văn An",
    department_edu: "Sở GD&ĐT Yên Bái",
    province: "Yên Bái",
    province_name: "Huyện Văn Yên",
    school_address: "TT. Mậu A -Văn Yên"
  },
  {
    school_name: "Trường THPT Nguyễn Lương Bằng",
    department_edu: "Sở GD&ĐT Yên Bái",
    province: "Yên Bái",
    province_name: "Huyện Văn Yên",
    school_address: "Xã An Thịnh -Văn Yên"
  },
  {
    school_name: "Trường THPT Trần Phú",
    department_edu: "Sở GD&ĐT Yên Bái",
    province: "Yên Bái",
    province_name: "Huyện Văn Yên",
    school_address: "Xã An Bình - Huyện Văn Yên"
  },
  {
    school_name: "Trường THPT Cảm Ân",
    department_edu: "Sở GD&ĐT Yên Bái",
    province: "Yên Bái",
    province_name: "Huyện Yên Bình",
    school_address: "Xã Cảm Ân -Yên Bình"
  },
  {
    school_name: "Trường THPT Trần Nhật Duật",
    department_edu: "Sở GD&ĐT Yên Bái",
    province: "Yên Bái",
    province_name: "Huyện Yên Bình",
    school_address: "TT. Yên Bình -Yên Bình"
  },
  {
    school_name: "Trường THPT Thác Bà",
    department_edu: "Sở GD&ĐT Yên Bái",
    province: "Yên Bái",
    province_name: "Huyện Yên Bình",
    school_address: "TT. Thác Bà -Yên Bình"
  },
  {
    school_name: "Trường THPT Cảm Nhân",
    department_edu: "Sở GD&ĐT Yên Bái",
    province: "Yên Bái",
    province_name: "Huyện Yên Bình",
    school_address: "Xã Cảm Nhân -Yên Bình"
  },
  {
    school_name: "Trường THPT Mù Cang Chải",
    department_edu: "Sở GD&ĐT Yên Bái",
    province: "Yên Bái",
    province_name: "Huyện Mù Cang Chải",
    school_address: "TT. Mù Cang Chải - Mù Cang Chải"
  },
  {
    school_name: "Trường THPT Văn Chấn",
    department_edu: "Sở GD&ĐT Yên Bái",
    province: "Yên Bái",
    province_name: "Huyện Văn Chấn",
    school_address: "Xã Cát Thịnh -Văn Chấn"
  },
  {
    school_name: "Trường THPT Sơn Thịnh",
    department_edu: "Sở GD&ĐT Yên Bái",
    province: "Yên Bái",
    province_name: "Huyện Văn Chấn",
    school_address: "Xã Sơn Thịnh -Văn Chấn"
  },
  {
    school_name: "Trường THPT Lê Quý Đôn",
    department_edu: "Sở GD&ĐT Yên Bái",
    province: "Yên Bái",
    province_name: "Huyện Trấn Yên",
    school_address: "TT. Cổ Phúc -Trấn Yên"
  },
  {
    school_name: "Trường THPT Trạm Tấu",
    department_edu: "Sở GD&ĐT Yên Bái",
    province: "Yên Bái",
    province_name: "Huyện Trạm Tấu",
    school_address: "TT. Trạm Tấu - Trạm Tấu"
  },
  {
    school_name: "Trường THPT Mai Sơn",
    department_edu: "Sở GD&ĐT Yên Bái",
    province: "Yên Bái",
    province_name: "Huyện Lục Yên",
    school_address: "Xã Mai Sơn - Lục Yên"
  },
  {
    school_name: "Trường THPT Hoàng Văn Thụ",
    department_edu: "Sở GD&ĐT Yên Bái",
    province: "Yên Bái",
    province_name: "Huyện Lục Yên",
    school_address: "TT. Yên Thế - Lục Yên"
  },
  {
    school_name: "Trường THPT Hồng Quang",
    department_edu: "Sở GD&ĐT Yên Bái",
    province: "Yên Bái",
    province_name: "Huyện Lục Yên",
    school_address: "Xã Động Quan - Lục Yên"
  },
  {
    school_name: "Trường THPT Chuyên",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Thành phố Thái Bình",
    school_address: "Đường Lý Thường Kiệt, TP Thái Bình"
  },
  {
    school_name: "Trường THPT Lê Quý Đôn",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Thành phố Thái Bình",
    school_address: "Đường Lý Bôn, Thành phố Thái Bình"
  },
  {
    school_name: "Trường THPT Nguyễn Đức Cảnh",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Thành phố Thái Bình",
    school_address: "Số 24 Đinh Tiên Hoàng, Kỳ Bá, TP Thái Bình"
  },
  {
    school_name: "Trường THPT Nguyễn Công Trứ",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Thành phố Thái Bình",
    school_address: "Phố Kim Đồng, Trần Hưng Đạo, TP Thái Bình"
  },
  {
    school_name: "Trường THPT Nguyễn Thái Bình",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Thành phố Thái Bình",
    school_address: "Đường Hoàng Văn Thái, Thành phố Thái Bình"
  },
  {
    school_name: "Trường THPT Quỳnh Côi",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Huyện Quỳnh Phụ",
    school_address: "Thị trấn Quỳnh Côi, Quỳnh Phụ, Thái Bình"
  },
  {
    school_name: "Trường THPT Quỳnh Thọ",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Huyện Quỳnh Phụ",
    school_address: "Quỳnh Thọ, Quỳnh Phụ, Thái Bình"
  },
  {
    school_name: "Trường THPT Phụ Dực",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Huyện Quỳnh Phụ",
    school_address: "Thị trấn An Bài, Quỳnh Phụ, Thái Bình"
  },
  {
    school_name: "Trường THPT Nguyễn Huệ",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Huyện Quỳnh Phụ",
    school_address: "Quỳnh Hưng, Quỳnh Phụ, Thái Bình"
  },
  {
    school_name: "Trường THPT Trần Hưng Đạo",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Huyện Quỳnh Phụ",
    school_address: "Xã An Vũ, Quỳnh Phụ- Thái Bình"
  },
  {
    school_name: "Trường THPT Hưng Nhân",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Huyện Hưng Hà",
    school_address: "Thị trấn Hưng Nhân, Hưng Hà, Thái Bình"
  },
  {
    school_name: "Trường THPT Bắc Duyên Hà",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Huyện Hưng Hà",
    school_address: "Thị trấn Hưng Hà, Hưng Hà, Thái Bình"
  },
  {
    school_name: "Trường THPT Nam Duyên Hà",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Huyện Hưng Hà",
    school_address: "Xã Minh Hoà, Hưng Hà, Thái Bình"
  },
  {
    school_name: "Trường THPT Đông Hưng Hà",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Huyện Hưng Hà",
    school_address: "Xã Hùng Dũng, Hưng Hà, Thái Bình"
  },
  {
    school_name: "Trường THPT Trần Thị Dung",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Huyện Hưng Hà",
    school_address: "Thị trấn Hưng Nhân, Hưng Hà, Thái Bình"
  },
  {
    school_name: "Trường THPT Tiên Hưng",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Thị trấn Đông Hưng",
    school_address: "Xã Thăng Long, Đông Hưng, Thái Bình"
  },
  {
    school_name: "Trường THPT Bắc Đông Quan",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Thị trấn Đông Hưng",
    school_address: "Thị trấn Đông Hưng, Thái Bình"
  },
  {
    school_name: "Trường THPT Nam Đông Quan",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Thị trấn Đông Hưng",
    school_address: "Xã Đông á, Đông Hưng, Thái Bình"
  },
  {
    school_name: "Trường THPT Mê Linh",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Thị trấn Đông Hưng",
    school_address: "Xã Mê Linh, Đông Hưng, Thái Bình"
  },
  {
    school_name: "Trường THPT Đông Quan",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Thị trấn Đông Hưng",
    school_address: "Thị trấn Đông Hưng, Thái Bình"
  },
  {
    school_name: "Trường THPT Tư thục Đông Hưng",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Thị trấn Đông Hưng",
    school_address: "Xã Đông Xuân, Đông Hưng, Thái Bình"
  },
  {
    school_name: "Trường THPT Nguyễn Trãi",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Thị trấn Vũ Thư",
    school_address: "Xã Hoà Bình, Vũ Thư, Thái Bình"
  },
  {
    school_name: "Trường THPT Vũ Tiên",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Thị trấn Vũ Thư",
    school_address: "Xã Việt Thuận, Vũ Thư, Thái Bình"
  },
  {
    school_name: "Trường THPT Lý Bôn",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Thị trấn Vũ Thư",
    school_address: "Xã Hiệp Hoà, Vũ Thư, Thái Bình"
  },
  {
    school_name: "Trường THPT Hùng Vương",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Thị trấn Vũ Thư",
    school_address: "Thị trấn Vũ Thư, Thái Bình"
  },
  {
    school_name: "Trường THPT Phạm Quang Thẩm",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Thị trấn Vũ Thư",
    school_address: "Xã Vũ Tiến, Vũ Thư, Thái Bình"
  },
  {
    school_name: "Trường THPT Nguyễn Du",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Huyện Kiên Xương",
    school_address: "Thị trấn Thanh Nê, Kiến Xương, Thái Bình"
  },
  {
    school_name: "Trường THPT Bắc Kiến Xương",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Huyện Kiên Xương",
    school_address: "Xã Nam Cao, Kiến Xương, Thái Bình"
  },
  {
    school_name: "Trường THPT Chu Văn An",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Huyện Kiên Xương",
    school_address: "Xã Vũ Quý, Kiến Xương, Thái Bình"
  },
  {
    school_name: "Trường THPT Bình Thanh",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Huyện Kiên Xương",
    school_address: "Xã Bình Thanh, Kiến Xương, Thái Bình"
  },
  {
    school_name: "Trường THPT Hồng Đức",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Huyện Kiên Xương",
    school_address: "Thị trấn Thanh Nê, Kiến Xương, Thái Bình"
  },
  {
    school_name: "Trường THPT Tây Tiền Hải",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Thị trấn Tiền Hải",
    school_address: "Thị trấn Tiền Hải, Thái Bình"
  },
  {
    school_name: "Trường THPT Nam Tiền Hải",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Thị trấn Tiền Hải",
    school_address: "Xã Nam Trung, Tiền Hải, Thái Bình"
  },
  {
    school_name: "Trường THPT Đông Tiền Hải",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Thị trấn Tiền Hải",
    school_address: "Xã Đông Xuyên, Tiền Hải, Thái Bình"
  },
  {
    school_name: "Trường THPT Hoàng Văn Thái",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Thị trấn Tiền Hải",
    school_address: "Thị trấn Tiền Hải, Thái Bình"
  },
  {
    school_name: "Trường THPT Đông Thụy Anh",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Huyện Thái Thụy",
    school_address: "Xã Thụy Hà, Thái Thụy, Thái Bình"
  },
  {
    school_name: "Trường THPT Tây Thụy Anh",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Huyện Thái Thụy",
    school_address: "Xã Thụy Sơn, Thái Thụy, Thái Bình"
  },
  {
    school_name: "Trường THPT Thái Ninh",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Huyện Thái Thụy",
    school_address: "Xã Thái Hưng, Thái Thụy, Thái Bình"
  },
  {
    school_name: "Trường THPT Thái Phúc",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Huyện Thái Thụy",
    school_address: "Xã Thái Phúc, Thái Thụy, Thái Bình"
  },
  {
    school_name: "Trường THPT Diêm Điền",
    department_edu: "Sở GD&ĐT Thái Bình",
    province: "Thái Bình",
    province_name: "Huyện Thái Thụy",
    school_address: "Khu 6 TT Diêm Điền, Thái Thuỵ Thái Bình"
  },
  {
    school_name: "Trường THPT DTNT Cao Bằng",
    department_edu: "Sở GD&ĐT Cao Bằng",
    province: "Cao Bằng",
    province_name: "Thành phố Cao Bằng",
    school_address: "Thành phố Cao Bằng"
  },
  {
    school_name: "Trường THPT Thành phố Cao Bằng",
    department_edu: "Sở GD&ĐT Cao Bằng",
    province: "Cao Bằng",
    province_name: "Thành phố Cao Bằng",
    school_address: "Thành phố Cao Bằng"
  },
  {
    school_name: "Trường THPT Chuyên Cao Bằng",
    department_edu: "Sở GD&ĐT Cao Bằng",
    province: "Cao Bằng",
    province_name: "Thành phố Cao Bằng",
    school_address: "Thành phố Cao Bằng"
  },
  {
    school_name: "Trường THPT Cao Bình",
    department_edu: "Sở GD&ĐT Cao Bằng",
    province: "Cao Bằng",
    province_name: "Thành phố Cao Bằng",
    school_address: "Xã Hưng Đạo, Thành phố Cao Bằng"
  },
  {
    school_name: "Trường THPT Bế Văn Đàn",
    department_edu: "Sở GD&ĐT Cao Bằng",
    province: "Cao Bằng",
    province_name: "Thành phố Cao Bằng",
    school_address: "Nà Cáp, Ph. sông Hiến, TP Cao Bằng"
  },
  {
    school_name: "Trường THPT Bảo Lạc",
    department_edu: "Sở GD&ĐT Cao Bằng",
    province: "Cao Bằng",
    province_name: "Thị trấn Bảo Lạc",
    school_address: "TT Bảo Lạc, Cao Bằng"
  },
  {
    school_name: "Trường THPT Bản Ngà",
    department_edu: "Sở GD&ĐT Cao Bằng",
    province: "Cao Bằng",
    province_name: "Thị trấn Bảo Lạc",
    school_address: "Huy Giáp, Bảo Lạc, Cao Bằng"
  },
  {
    school_name: "Trường THPT Thông Nông",
    department_edu: "Sở GD&ĐT Cao Bằng",
    province: "Cao Bằng",
    province_name: "Thị trấn Thông Nông",
    school_address: "TT Thông Nông, Cao Bằng"
  },
  {
    school_name: "Trường THPT Hà Quảng",
    department_edu: "Sở GD&ĐT Cao Bằng",
    province: "Cao Bằng",
    province_name: "Huyện Hà Quảng",
    school_address: "TT Xuân Hoà, Hà Quảng, Cao Bằng"
  },
  {
    school_name: "Trường THPT Nà Giàng",
    department_edu: "Sở GD&ĐT Cao Bằng",
    province: "Cao Bằng",
    province_name: "Huyện Hà Quảng",
    school_address: "Nà Giàng, Hà Quảng, Cao Bằng"
  },
  {
    school_name: "Trường THPT Lục Khu",
    department_edu: "Sở GD&ĐT Cao Bằng",
    province: "Cao Bằng",
    province_name: "Huyện Hà Quảng",
    school_address: "Thượng Thôn, Hà Quảng, Cao Bằng"
  },
  {
    school_name: "Trường THPT Trà Lĩnh",
    department_edu: "Sở GD&ĐT Cao Bằng",
    province: "Cao Bằng",
    province_name: "Huyện Trà Lĩnh",
    school_address: "TT Hùng Quốc, Trà Lĩnh, Cao Bằng"
  },
  {
    school_name: "Trường THPT Quang Trung",
    department_edu: "Sở GD&ĐT Cao Bằng",
    province: "Cao Bằng",
    province_name: "Huyện Trà Lĩnh",
    school_address: "Quang Trung, Trà Lĩnh, Cao Bằng"
  },
  {
    school_name: "Trường THPT Trùng Khánh",
    department_edu: "Sở GD&ĐT Cao Bằng",
    province: "Cao Bằng",
    province_name: "Thị trấn Trùng Khánh",
    school_address: "TT Trùng Khánh,Cao Bằng"
  },
  {
    school_name: "Trường THPT Pò Tấu",
    department_edu: "Sở GD&ĐT Cao Bằng",
    province: "Cao Bằng",
    province_name: "Thị trấn Trùng Khánh",
    school_address: "Xã Chí Viễn, Trùng Khánh, Cao Bằng"
  },
  {
    school_name: "Trường THPT Thông Huề",
    department_edu: "Sở GD&ĐT Cao Bằng",
    province: "Cao Bằng",
    province_name: "Thị trấn Trùng Khánh",
    school_address: "Thông Huề, Trùng Khánh, Cao Bằng"
  },
  {
    school_name: "Trường THPT Nguyên Bình",
    department_edu: "Sở GD&ĐT Cao Bằng",
    province: "Cao Bằng",
    province_name: "Thị trấn Nguyên Bình",
    school_address: "TT Nguyên Bình, Cao Bằng"
  },
  {
    school_name: "Trường THPT Tinh Túc",
    department_edu: "Sở GD&ĐT Cao Bằng",
    province: "Cao Bằng",
    province_name: "Thị trấn Nguyên Bình",
    school_address: "Tinh Túc, Nguyên Bình, Cao Bằng"
  },
  {
    school_name: "Trường THPT Nà Bao",
    department_edu: "Sở GD&ĐT Cao Bằng",
    province: "Cao Bằng",
    province_name: "Thị trấn Nguyên Bình",
    school_address: "Lang Môn, Nguyên Bình, Cao Bằng"
  },
  {
    school_name: "Trường THPT Hoà An",
    department_edu: "Sở GD&ĐT Cao Bằng",
    province: "Cao Bằng",
    province_name: "Huyện Hòa An",
    school_address: "TT Nước Hai, Hoà An, Cao Bằng"
  },
  {
    school_name: "Trường THPT Quảng Uyên",
    department_edu: "Sở GD&ĐT Cao Bằng",
    province: "Cao Bằng",
    province_name: "Thị trấn Quảng Uyên",
    school_address: "TT Quảng Uyên, Cao Bằng"
  },
  {
    school_name: "Trường THPT Đống Đa",
    department_edu: "Sở GD&ĐT Cao Bằng",
    province: "Cao Bằng",
    province_name: "Thị trấn Quảng Uyên",
    school_address: "Xã Ngọc Động, Quảng Uyên"
  },
  {
    school_name: "Trường THPT Thạch An",
    department_edu: "Sở GD&ĐT Cao Bằng",
    province: "Cao Bằng",
    province_name: "Huyện Thạch An",
    school_address: "TT Đông Khê, Thạch An, Cao Bằng"
  },
  {
    school_name: "Trường THPT Canh Tân",
    department_edu: "Sở GD&ĐT Cao Bằng",
    province: "Cao Bằng",
    province_name: "Huyện Thạch An",
    school_address: "Canh Tân, Thạch An , Cao Bằng"
  },
  {
    school_name: "Trường THPT Hạ Lang",
    department_edu: "Sở GD&ĐT Cao Bằng",
    province: "Cao Bằng",
    province_name: "Huyện Hạ Lang",
    school_address: "Thanh Nhật, Hạ Lang, Cao Bằng"
  },
  {
    school_name: "Trường THPT Bằng Ca",
    department_edu: "Sở GD&ĐT Cao Bằng",
    province: "Cao Bằng",
    province_name: "Huyện Hạ Lang",
    school_address: "Lý Quốc, Hạ Lang, Cao Bằng"
  },
  {
    school_name: "Trường THPT Bảo Lâm",
    department_edu: "Sở GD&ĐT Cao Bằng",
    province: "Cao Bằng",
    province_name: "Huyện Bảo Lâm",
    school_address: "Mông Ân, Bảo Lâm , Cao Bằng"
  },
  {
    school_name: "Trường THPT Lý Bôn",
    department_edu: "Sở GD&ĐT Cao Bằng",
    province: "Cao Bằng",
    province_name: "Huyện Bảo Lâm",
    school_address: "Lý Bôn, Bảo Lâm, Cao Bằng"
  },
  {
    school_name: "Trường THPT Phục Hoà",
    department_edu: "Sở GD&ĐT Cao Bằng",
    province: "Cao Bằng",
    province_name: "Huyện Phục Hòa",
    school_address: "TT Hòa Thuận, Phục Hoà, Cao Bằng"
  },
  {
    school_name: "Trường THPT Cách Linh",
    department_edu: "Sở GD&ĐT Cao Bằng",
    province: "Cao Bằng",
    province_name: "Huyện Phục Hòa",
    school_address: "Xã Cánh Linh, Phục Hoà, Cao Bằng"
  },
  {
    school_name: "Trường THPT Việt Bắc",
    department_edu: "Sở GD&ĐT Lạng Sơn",
    province: "Lạng Sơn",
    province_name: "Thành phố Lạng Sơn",
    school_address: "Số 72, đường Phai Vệ, P. Đông Kinh, TP Lạng Sơn"
  },
  {
    school_name: "Trường THPT Chuyên Chu Văn An",
    department_edu: "Sở GD&ĐT Lạng Sơn",
    province: "Lạng Sơn",
    province_name: "Thành phố Lạng Sơn",
    school_address: "Số 55- Đường Tổ Sơn- P. Chi Lăng- TP Lạng Sơn"
  },
  {
    school_name: "Trường THPT DT Nội trú tỉnh",
    department_edu: "Sở GD&ĐT Lạng Sơn",
    province: "Lạng Sơn",
    province_name: "Thành phố Lạng Sơn",
    school_address: "Ph. Đông Kinh-TP Lạng Sơn, tỉnh Lạng Sơn"
  },
  {
    school_name: "Trường THPT Ngô Thì Sỹ",
    department_edu: "Sở GD&ĐT Lạng Sơn",
    province: "Lạng Sơn",
    province_name: "Thành phố Lạng Sơn",
    school_address: "Ph. Vĩnh Trại, TP Lạng Sơn, tỉnh Lạng Sơn"
  },
  {
    school_name: "Trường THPT Tràng Định",
    department_edu: "Sở GD&ĐT Lạng Sơn",
    province: "Lạng Sơn",
    province_name: "Huyện Tràng Định",
    school_address: "TTr Thất Khê, H. Tràng Định, tỉnh Lạng Sơn"
  },
  {
    school_name: "Trường THPT Bình Độ",
    department_edu: "Sở GD&ĐT Lạng Sơn",
    province: "Lạng Sơn",
    province_name: "Huyện Tràng Định",
    school_address: "Thôn Nà Nạ, Xã Quốc Việt, H. Tràng Định"
  },
  {
    school_name: "Trường THPT Bình Gia",
    department_edu: "Sở GD&ĐT Lạng Sơn",
    province: "Lạng Sơn",
    province_name: "Huyện Bình Gia",
    school_address: "TTr Bình Gia, H. Bình Gia, Tỉnh Lạng Sơn"
  },
  {
    school_name: "Trường THPT Pác Khuông",
    department_edu: "Sở GD&ĐT Lạng Sơn",
    province: "Lạng Sơn",
    province_name: "Huyện Bình Gia",
    school_address: "Thôn Pác Khuông, xã Thiện Thuật, H. Bình Gia, LS"
  },
  {
    school_name: "Trường THPT Văn Lãng",
    department_edu: "Sở GD&ĐT Lạng Sơn",
    province: "Lạng Sơn",
    province_name: "Huyện Văn Lãng",
    school_address: "TTr Na Sầm, H. Văn Lãng, tỉnh Lạng Sơn"
  },
  {
    school_name: "Trường THPT Bắc Sơn",
    department_edu: "Sở GD&ĐT Lạng Sơn",
    province: "Lạng Sơn",
    province_name: "Huyện Bắc Sơn",
    school_address: "TTr. Bắc Sơn, H. Bắc Sơn, Lạng Sơn"
  },
  {
    school_name: "Trường THPT Vũ Lễ",
    department_edu: "Sở GD&ĐT Lạng Sơn",
    province: "Lạng Sơn",
    province_name: "Huyện Bắc Sơn",
    school_address: "Xã Vũ Lễ, H. Bắc Sơn, Tỉnh Lạng Sơn"
  },
  {
    school_name: "Trường THPT Lương Văn Tri",
    department_edu: "Sở GD&ĐT Lạng Sơn",
    province: "Lạng Sơn",
    province_name: "Huyện Văn Quan",
    school_address: "TTr. Văn Quan, H. Văn Quan, Lạng Sơn"
  },
  {
    school_name: "Trường THPT Văn Quan",
    department_edu: "Sở GD&ĐT Lạng Sơn",
    province: "Lạng Sơn",
    province_name: "Huyện Văn Quan",
    school_address: "Phố Điềm He, xã Văn An, H. Văn Quan, Lạng Sơn"
  },
  {
    school_name: "Trường THPT Đồng Đăng",
    department_edu: "Sở GD&ĐT Lạng Sơn",
    province: "Lạng Sơn",
    province_name: "Huyện Cao Lộc",
    school_address: "Khu Hoàng V.Thụ, T.trấn Đồng Đăng, H. Cao Lộc"
  },
  {
    school_name: "Trường THPT Cao Lộc",
    department_edu: "Sở GD&ĐT Lạng Sơn",
    province: "Lạng Sơn",
    province_name: "Huyện Cao Lộc",
    school_address: "TTr. Cao Lộc, H. Cao Lộc, tỉnh Lạng Sơn"
  },
  {
    school_name: "Trường THPT Lộc Bình",
    department_edu: "Sở GD&ĐT Lạng Sơn",
    province: "Lạng Sơn",
    province_name: "Huyện Lộc Bình",
    school_address: "TTr. Lộc Bình, H. Lộc Bình, Lạng Sơn"
  },
  {
    school_name: "Trường THPT Na Dương",
    department_edu: "Sở GD&ĐT Lạng Sơn",
    province: "Lạng Sơn",
    province_name: "Huyện Lộc Bình",
    school_address: "Khu 9, TTr. Na Dương, H. Lộc Bình"
  },
  {
    school_name: "Trường THPT Tú Đoạn",
    department_edu: "Sở GD&ĐT Lạng Sơn",
    province: "Lạng Sơn",
    province_name: "Huyện Lộc Bình",
    school_address: "Thôn Rinh Chùa, xã Tú Đoạn, H. Lộc Bình"
  },
  {
    school_name: "Trường THPT Chi Lăng",
    department_edu: "Sở GD&ĐT Lạng Sơn",
    province: "Lạng Sơn",
    province_name: "Huyện Chi Lăng",
    school_address: "Khu Hòa Bình, TTr. Đồng Mỏ, Chi Lăng"
  },
  {
    school_name: "Trường THPT Hòa Bình",
    department_edu: "Sở GD&ĐT Lạng Sơn",
    province: "Lạng Sơn",
    province_name: "Huyện Chi Lăng",
    school_address: "Thôn Pa Ràng- Xã Hòa Bình-H.Chi Lăng, Lạng Sơn."
  },
  {
    school_name: "Trường THPT Đồng Bành",
    department_edu: "Sở GD&ĐT Lạng Sơn",
    province: "Lạng Sơn",
    province_name: "Huyện Chi Lăng",
    school_address: "TTr Chi Lăng, H. Chi Lăng, tỉnh Lạng Sơn"
  },
  {
    school_name: "Trường THPT Đình Lập",
    department_edu: "Sở GD&ĐT Lạng Sơn",
    province: "Lạng Sơn",
    province_name: "Huyện Đình Lập",
    school_address: "TTr. Đình Lập, H. Đình Lập, Lạng Sơn"
  },
  {
    school_name: "Trường THPT Hữu Lũng",
    department_edu: "Sở GD&ĐT Lạng Sơn",
    province: "Lạng Sơn",
    province_name: "Huyện Hữu Lũng",
    school_address: "Số 123 Đ.Xương Giang,TTr Hữu Lũng, H. Hữu Lũng"
  },
  {
    school_name: "Trường THPT Vân Nham",
    department_edu: "Sở GD&ĐT Lạng Sơn",
    province: "Lạng Sơn",
    province_name: "Huyện Hữu Lũng",
    school_address: "Xã Vân Nham, H. Hữu Lũng, tỉnh Lạng Sơn"
  },
  {
    school_name: "Trường THPT Tô Hiệu",
    department_edu: "Sở GD&ĐT Sơn La",
    province: "Sơn La",
    province_name: "Thành phố Sơn La",
    school_address: "Phường Tô Hiệu - Thành phố Sơn La"
  },
  {
    school_name: "Trường THPT Chiềng Sinh",
    department_edu: "Sở GD&ĐT Sơn La",
    province: "Sơn La",
    province_name: "Thành phố Sơn La",
    school_address: "Phường Chiềng Sinh -TP. Sơn La"
  },
  {
    school_name: "Trường THPT Chuyên",
    department_edu: "Sở GD&ĐT Sơn La",
    province: "Sơn La",
    province_name: "Thành phố Sơn La",
    school_address: "Phường Chiềng Lề -Thành phố Sơn La"
  },
  {
    school_name: "Trường THPT Nguyễn Du",
    department_edu: "Sở GD&ĐT Sơn La",
    province: "Sơn La",
    province_name: "Thành phố Sơn La",
    school_address: "Xã Chiềng Đen -Thành phố Sơn La"
  },
  {
    school_name: "Trường THPT Quỳnh Nhai",
    department_edu: "Sở GD&ĐT Sơn La",
    province: "Sơn La",
    province_name: "Huyện Quỳnh Nhai",
    school_address: "Xã Mường Giàng - Huyện Quỳnh Nhai"
  },
  {
    school_name: "Trường THPT Mường Giôn",
    department_edu: "Sở GD&ĐT Sơn La",
    province: "Sơn La",
    province_name: "Huyện Quỳnh Nhai",
    school_address: "Xã Mường Giôn - Huyện Quỳnh Nhai"
  },
  {
    school_name: "Trường THPT Mường La",
    department_edu: "Sở GD&ĐT Sơn La",
    province: "Sơn La",
    province_name: "Huyện Mường La",
    school_address: "Thị Trấn - Huyện Mường La"
  },
  {
    school_name: "Trường THPT Mường Bú",
    department_edu: "Sở GD&ĐT Sơn La",
    province: "Sơn La",
    province_name: "Huyện Mường La",
    school_address: "Xã Mường Bú - Huyện Mường La"
  },
  {
    school_name: "Trường THPT Thuận Châu",
    department_edu: "Sở GD&ĐT Sơn La",
    province: "Sơn La",
    province_name: "Huyện Thuận Châu",
    school_address: "Thị Trấn - Huyện Thuận Châu"
  },
  {
    school_name: "Trường THPT Tông Lệnh",
    department_edu: "Sở GD&ĐT Sơn La",
    province: "Sơn La",
    province_name: "Huyện Thuận Châu",
    school_address: "Xã Tông Lệnh - Huyện Thuận Châu"
  },
  {
    school_name: "Trường THPT Bình Thuận",
    department_edu: "Sở GD&ĐT Sơn La",
    province: "Sơn La",
    province_name: "Huyện Thuận Châu",
    school_address: "Xã Bình Thuận - Huyện Thuận Châu"
  },
  {
    school_name: "Trường THPT Co Mạ",
    department_edu: "Sở GD&ĐT Sơn La",
    province: "Sơn La",
    province_name: "Huyện Thuận Châu",
    school_address: "Xã Co Mạ - Huyện Thuận Châu"
  },
  {
    school_name: "Trường THPT Bắc Yên",
    department_edu: "Sở GD&ĐT Sơn La",
    province: "Sơn La",
    province_name: "Huyện Bắc Yên",
    school_address: "Thị Trấn - Huyện Bắc Yên"
  },
  {
    school_name: "Trường THPT Phù Yên",
    department_edu: "Sở GD&ĐT Sơn La",
    province: "Sơn La",
    province_name: "Huyện Bắc Yên",
    school_address: "Thị Trấn - Huyện Phù Yên"
  },
  {
    school_name: "Trường THPT Gia Phù",
    department_edu: "Sở GD&ĐT Sơn La",
    province: "Sơn La",
    province_name: "Huyện Phù Yên",
    school_address: "Thị tứ Gia Phù - Huyện Phù Yên"
  },
  {
    school_name: "Trường THPT Tân Lang",
    department_edu: "Sở GD&ĐT Sơn La",
    province: "Sơn La",
    province_name: "Huyện Phù Yên",
    school_address: "Xã Tân Lang - Huyện Phù Yên"
  },
  {
    school_name: "Trường THPT Mai Sơn",
    department_edu: "Sở GD&ĐT Sơn La",
    province: "Sơn La",
    province_name: "Huyện Mai Sơn",
    school_address: "Thị Trấn Hát lót - Huyện Mai Sơn"
  },
  {
    school_name: "Trường THPT Cò Nòi",
    department_edu: "Sở GD&ĐT Sơn La",
    province: "Sơn La",
    province_name: "Huyện Mai Sơn",
    school_address: "Xã Cò Nòi - Huyện Mai Sơn"
  },
  {
    school_name: "Trường THPT Chu Văn Thịnh",
    department_edu: "Sở GD&ĐT Sơn La",
    province: "Sơn La",
    province_name: "Huyện Mai Sơn",
    school_address: "Xã Chiềng Ban - Huyện Mai Sơn"
  },
  {
    school_name: "Trường THPT Yên Châu",
    department_edu: "Sở GD&ĐT Sơn La",
    province: "Sơn La",
    province_name: "Huyện Yên Châu",
    school_address: "Thị Trấn - Huyện Yên Châu"
  },
  {
    school_name: "Trường THPT Phiêng Khoài",
    department_edu: "Sở GD&ĐT Sơn La",
    province: "Sơn La",
    province_name: "Huyện Yên Châu",
    school_address: "Xã Phiêng Khoài - Huyện Yên Châu"
  },
  {
    school_name: "Trường THPT Sông Mã",
    department_edu: "Sở GD&ĐT Sơn La",
    province: "Sơn La",
    province_name: "Huyện Sông Mã",
    school_address: "Thị Trấn - Huyện Sông Mã"
  },
  {
    school_name: "Trường THPT Chiềng Khương",
    department_edu: "Sở GD&ĐT Sơn La",
    province: "Sơn La",
    province_name: "Huyện Sông Mã",
    school_address: "Xã Chiềng Khương - Huyện Sông Mã"
  },
  {
    school_name: "Trường THPT Mường Lầm",
    department_edu: "Sở GD&ĐT Sơn La",
    province: "Sơn La",
    province_name: "Huyện Sông Mã",
    school_address: "Xã Mường Lầm - Huyện Sông Mã"
  },
  {
    school_name: "Trường THPT Chiềng Sơn",
    department_edu: "Sở GD&ĐT Sơn La",
    province: "Sơn La",
    province_name: "Huyện Mộc Châu",
    school_address: "Xã Chiềng Sơn - Huyện Mộc Châu"
  },
  {
    school_name: "Trường THPT Tân Lập",
    department_edu: "Sở GD&ĐT Sơn La",
    province: "Sơn La",
    province_name: "Huyện Mộc Châu",
    school_address: "Xã Tân Lập - Huyện Mộc Châu"
  },
  {
    school_name: "Trường THPT Mộc Lỵ",
    department_edu: "Sở GD&ĐT Sơn La",
    province: "Sơn La",
    province_name: "Huyện Mộc Châu",
    school_address: "Thị Trấn - Huyện Mộc Châu"
  },
  {
    school_name: "Trường THPT Thảo Nguyên",
    department_edu: "Sở GD&ĐT Sơn La",
    province: "Sơn La",
    province_name: "Huyện Mộc Châu",
    school_address: "TT Nông trường - Huyện Mộc Châu"
  },
  {
    school_name: "Trường THPT Sốp Cộp",
    department_edu: "Sở GD&ĐT Sơn La",
    province: "Sơn La",
    province_name: "Huyện Sốp Cộp",
    school_address: "Xã Sốp Cộp - Huyện Sốp Cộp"
  },
  {
    school_name: "Trường THPT Mộc Hạ",
    department_edu: "Sở GD&ĐT Sơn La",
    province: "Sơn La",
    province_name: "Huyện Vân Hồ",
    school_address: "Xã Mộc Hạ -Huyện Vân Hồ"
  },

  {
    school_name: "Trường THPT Ngô Sỹ Liên",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Thành phố Bắc Giang",
    school_address: "P. Ngô Quyền, Tp. Bắc Giang"
  },
  {
    school_name: "Trường THPT Chuyên Bắc Giang",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Thành phố Bắc Giang",
    school_address: "P. Ngô Quyền, Tp. Bắc Giang"
  },
  {
    school_name: "Trường THPT Thái Thuận",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Thành phố Bắc Giang",
    school_address: "P. Ngô Quyền, Tp. Bắc Giang"
  },
  {
    school_name: "Trường THPT Dân lập Nguyên Hồng",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Thành phố Bắc Giang",
    school_address: "P. Trần Nguyên Hãn, Tp. Bắc Giang"
  },
  {
    school_name: "Trường THPT Dân lập Hồ Tùng Mậu",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Thành phố Bắc Giang",
    school_address: "Xã Đa Mai, Tp. Bắc Giang"
  },
  {
    school_name: "Trường THPT DTNT tỉnh",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Thành phố Bắc Giang",
    school_address: "P. Ngô Quyền, Tp. Bắc Giang"
  },
  {
    school_name: "Trường THPT Giáp Hải",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Thành phố Bắc Giang",
    school_address: "Xã Tân Mỹ-Tp.Bắc Giang"
  },
  {
    school_name: "Trường THPT Yên Thế",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Yên Thế",
    school_address: "TTr. Cầu Gồ, H. Yên Thế"
  },
  {
    school_name: "Trường THPT Bố Hạ",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Yên Thế",
    school_address: "Xã Bố Hạ, H. Yên Thế"
  },
  {
    school_name: "Trường THPT Mỏ Trạng",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Yên Thế",
    school_address: "Xã Tam Tiến, H. Yên Thế"
  },
  {
    school_name: "Trường THPT Lục Ngạn 1",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Lục Ngạn",
    school_address: "TTr. Chũ, H. Lục Ngạn"
  },
  {
    school_name: "Trường THPT Lục Ngạn 2",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Lục Ngạn",
    school_address: "Xã Tân Hoa, H. Lục Ngạn"
  },
  {
    school_name: "Trường THPT Lục ngạn 3",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Lục Ngạn",
    school_address: "Xã Phượng Sơn, H. Lục Ngạn"
  },
  {
    school_name: "Trường Trung THPT Lục Ngạn số 4",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Lục Ngạn",
    school_address: "Xã Tân Sơn, H. Lục Ngạn"
  },
  {
    school_name: "Trường THPT bán công Lục Ngạn",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Lục Ngạn",
    school_address: "TTr. Chũ, H. Lục Ngạn"
  },
  {
    school_name: "Trường THPT Sơn Động",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Sơn Động",
    school_address: "Xã An Lập, H. Sơn Động"
  },
  {
    school_name: "Trường THPT Sơn Động 2",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Sơn Động",
    school_address: "Xã Cẩm Đàn, H. Sơn Động"
  },
  {
    school_name: "Trường THPT Sơn Động 3",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Sơn Động",
    school_address: "Xã Thanh Sơn, H. Sơn Động"
  },
  {
    school_name: "Trường THPT Lục Nam",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Lục Nam",
    school_address: "TTr. Đồi ngô, H. Lục Nam"
  },
  {
    school_name: "Trường THPT Cẩm Lý",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Lục Nam",
    school_address: "Xã Cẩm Lý, H. Lục Nam"
  },
  {
    school_name: "Trường THPT Phương Sơn",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Lục Nam",
    school_address: "Xã Phương Sơn, H. Lục Nam"
  },
  {
    school_name: "Trường THPT Tứ Sơn",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Lục Nam",
    school_address: "Xã Trường Sơn, H. Lục Nam"
  },
  {
    school_name: "Trường THPT Tân Yên 1",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Tân Yên",
    school_address: "TT Cao Thượng, H. Tân Yên"
  },
  {
    school_name: "Trường THPT Dân lập Đồi Ngô",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Lục Nam",
    school_address: "TTr. Đồi Ngô, H. Lục Nam"
  },
  {
    school_name: "Trường THPT Tư thục Thanh Hồ",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Lục Nam",
    school_address: "Xã Thanh Lâm, H. Lục Nam"
  },
  {
    school_name: "Trường THPT Tân Yên 2",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Tân Yên",
    school_address: "Xã Lam Cốt, H. Tân Yên"
  },
  {
    school_name: "Trường THPT Nhã Nam",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Tân Yên",
    school_address: "Xã Nhã Nam, H. Tân Yên"
  },
  {
    school_name: "Trường THPT Dân lập Tân Yên",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Tân Yên",
    school_address: "TTr. Cao Thượng, H. Tân Yên"
  },
  {
    school_name: "Trường THPT Hiệp Hoà 1",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Hiệp Hòa",
    school_address: "TTr. Thắng, H. Hiệp Hoà"
  },
  {
    school_name: "Trường THPT Hiệp Hoà 2",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Hiệp Hòa",
    school_address: "Xã Bắc Lý, H. Hiệp Hoà"
  },
  {
    school_name: "Trường THPT Hiệp Hoà 3",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Hiệp Hòa",
    school_address: "Xã Hùng Sơn, H. Hiệp hoà"
  },
  {
    school_name: "Trường THPT Dân lập Hiệp Hoà 1",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Hiệp Hòa",
    school_address: "TTr. Thắng, H. Hiệp Hoà"
  },
  {
    school_name: "Trường THPT Dân lập Hiệp Hoà 2",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Hiệp Hòa",
    school_address: "Xã Hương Lâm, H. Hiệp Hoà"
  },
  {
    school_name: "Trường THPT Hiệp Hòa 4",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Hiệp Hòa",
    school_address: "Xã Hoàng Vân, H. Hiệp Hòa"
  },
  {
    school_name: "Trường THPT Lạng Giang 1",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Lạng Giang",
    school_address: "Xã Yên Mỹ, H. Lạng Giang"
  },
  {
    school_name: "Trường THPT Lạng Giang 2",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Lạng Giang",
    school_address: "Xã Tân Thịnh, H. Lạng Giang"
  },
  {
    school_name: "Trường THPT Lạng Giang 3",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Lạng Giang",
    school_address: "Xã Mỹ Hà, H. Lạng Giang"
  },
  {
    school_name: "Trường THPT Dân lập Thái Đào",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Lạng Giang",
    school_address: "Xã Thái Đào, H. Lạng Giang"
  },
  {
    school_name: "Trường THPT Dân Lập Phi Mô",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Lạng Giang",
    school_address: "Xã Phi Mô, H. Lạng Giang"
  },
  {
    school_name: "Trường THPT Việt Yên 1",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Việt Yên",
    school_address: "TTr. Bích Động, H. Việt Yên"
  },
  {
    school_name: "Trường THPT Việt Yên 2",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Việt Yên",
    school_address: "Xã Tự Lạn, H. Việt Yên"
  },
  {
    school_name: "Trường THPT Lý Thường Kiệt",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Việt Yên",
    school_address: "Xã Tiên Sơn, H. Việt Yên"
  },
  {
    school_name: "Trường THPT Tư thục Việt Yên",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Việt Yên",
    school_address: "Xã Quảng Minh, H. Việt Yên"
  },
  {
    school_name: "Trường THPT Yên Dũng 1",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Yên Dũng",
    school_address: "Xã Nham Sơn, H. Yên Dũng"
  },
  {
    school_name: "Trường THPT Yên Dũng 2",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Yên Dũng",
    school_address: "Xã Tân An, H. Yên Dũng"
  },
  {
    school_name: "Trường THPT Yên Dũng 3",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Yên Dũng",
    school_address: "Xã Cảnh Thuỵ, H. Yên Dũng"
  },
  {
    school_name: "Trường THPT Dân lập Yên Dũng 1",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Yên Dũng",
    school_address: "Xã Tiền Phong, H. Yên Dũng"
  },
  {
    school_name: "Trường THPT Dân lập Quang Trung",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Yên Dũng",
    school_address: "Xã Cảnh Thuỵ, H. Yên Dũng"
  },
  {
    school_name: "Trường THPT Tư thục Thái Sơn",
    department_edu: "Sở GD&ĐT Bắc Giang",
    province: "Bắc Giang",
    province_name: "Huyện Yên Dũng",
    school_address: "Xã Quỳnh Sơn, H. Yên Dũng"
  },

  {
    school_name: "Trường THPT chuyên Hoàng Văn Thụ",
    department_edu: "Sở GD&ĐT Hòa Bình",
    province: "Hòa Bình",
    province_name: "Thành phố Hòa Bình",
    school_address: "Ph. Thịnh Lang -Thành phố HB"
  },
  {
    school_name: "Trường THPT Lạc Long Quân",
    department_edu: "Sở GD&ĐT Hòa Bình",
    province: "Hòa Bình",
    province_name: "Thành phố Hòa Bình",
    school_address: "Ph. Tân Thịnh -Thành phố HB"
  },
  {
    school_name: "Trường THPT Nguyễn Du",
    department_edu: "Sở GD&ĐT Hòa Bình",
    province: "Hòa Bình",
    province_name: "Thành phố Hòa Bình",
    school_address: "Ph. Tân Thịnh -Thành phố HB"
  },
  {
    school_name: "Trường THPT Công Nghiệp",
    department_edu: "Sở GD&ĐT Hòa Bình",
    province: "Hòa Bình",
    province_name: "Thành phố Hòa Bình",
    school_address: "Ph. Đồng Tiến -Thành phố HB"
  },
  {
    school_name: "Trường THPT Ngô Quyền",
    department_edu: "Sở GD&ĐT Hòa Bình",
    province: "Hòa Bình",
    province_name: "Thành phố Hòa Bình",
    school_address: "Ph. Chăm Mát -Thành phố HB"
  },
  {
    school_name: "Trường THPT Đà Bắc",
    department_edu: "Sở GD&ĐT Hòa Bình",
    province: "Hòa Bình",
    province_name: "Huyện Đà Bắc",
    school_address: "TTr. Đà Bắc -H. Đà Bắc"
  },
  {
    school_name: "Trường THPT Mường Chiềng",
    department_edu: "Sở GD&ĐT Hòa Bình",
    province: "Hòa Bình",
    province_name: "Huyện Đà Bắc",
    school_address: "Xã Mường Chiềng -H. Đà Bắc"
  },
  {
    school_name: "Trường THPT Yên Hoà",
    department_edu: "Sở GD&ĐT Hòa Bình",
    province: "Hòa Bình",
    province_name: "Huyện Đà Bắc",
    school_address: "Xã Yên Hoà - H. Đà Bắc"
  },
  {
    school_name: "Trường THPT Mai Châu A",
    department_edu: "Sở GD&ĐT Hòa Bình",
    province: "Hòa Bình",
    province_name: "Huyện Mai Châu",
    school_address: "TTr. Mai Châu -H. Mai Châu"
  },
  {
    school_name: "Trường THPT Mai Châu B",
    department_edu: "Sở GD&ĐT Hòa Bình",
    province: "Hòa Bình",
    province_name: "Huyện Mai Châu",
    school_address: "Xã Xăm Khoè -H. Mai Châu"
  },
  {
    school_name: "Trường THPT Tân Lạc",
    department_edu: "Sở GD&ĐT Hòa Bình",
    province: "Hòa Bình",
    province_name: "Huyện Tân Lạc",
    school_address: "TTr. Mường Khến -Huyên Tân Lạc"
  },
  {
    school_name: "Trường THPT Mường Bi",
    department_edu: "Sở GD&ĐT Hòa Bình",
    province: "Hòa Bình",
    province_name: "Huyện Tân Lạc",
    school_address: "Xã Phong Phú -H. Tân Lạc"
  },
  {
    school_name: "Trường THPT Đoàn Kết",
    department_edu: "Sở GD&ĐT Hòa Bình",
    province: "Hòa Bình",
    province_name: "Huyện Tân Lạc",
    school_address: "Xã Đông Lai -H. Tân Lạc"
  },
  {
    school_name: "Trường THPT Lũng Vân",
    department_edu: "Sở GD&ĐT Hòa Bình",
    province: "Hòa Bình",
    province_name: "Huyện Tân Lạc",
    school_address: "Xã Lũng Vân -H. Tân Lạc"
  },
  {
    school_name: "Trường THPT Lạc Sơn",
    department_edu: "Sở GD&ĐT Hòa Bình",
    province: "Hòa Bình",
    province_name: "Huyện Lạc Sơn",
    school_address: "TTr. Vụ Bản -H. Lạc Sơn"
  },
  {
    school_name: "Trường THPT Cộng Hoà",
    department_edu: "Sở GD&ĐT Hòa Bình",
    province: "Hòa Bình",
    province_name: "Huyện Lạc Sơn",
    school_address: "Xã Nhân Nghĩa -H. Lạc Sơn"
  },
  {
    school_name: "Trường THPT Đại Đồng",
    department_edu: "Sở GD&ĐT Hòa Bình",
    province: "Hòa Bình",
    province_name: "Huyện Lạc Sơn",
    school_address: "Xã Ân Nghĩa -H. Lạc Sơn"
  },
  {
    school_name: "Trường THPT Quyết Thắng",
    department_edu: "Sở GD&ĐT Hòa Bình",
    province: "Hòa Bình",
    province_name: "Huyện Lạc Sơn",
    school_address: "Xã Thượng Cốc - H. Lạc Sơn"
  },
  {
    school_name: "Trường THPT Kỳ Sơn",
    department_edu: "Sở GD&ĐT Hòa Bình",
    province: "Hòa Bình",
    province_name: "Huyện Kỳ Sơn",
    school_address: "Xã Dân Hạ -H. Kỳ Sơn"
  },
  {
    school_name: "Trường THPT Phú Cường",
    department_edu: "Sở GD&ĐT Hòa Bình",
    province: "Hòa Bình",
    province_name: "Huyện Kỳ Sơn",
    school_address: "Xã Hợp Thịnh -H. Kỳ Sơn"
  },
  {
    school_name: "Trường THPT Lương Sơn",
    department_edu: "Sở GD&ĐT Hòa Bình",
    province: "Hòa Bình",
    province_name: "Huyện Lương Sơn",
    school_address: "TTr. Lương Sơn -H. Lương Sơn"
  },
  {
    school_name: "Trường THPT Nguyễn Trãi",
    department_edu: "Sở GD&ĐT Hòa Bình",
    province: "Hòa Bình",
    province_name: "Huyện Lương Sơn",
    school_address: "TTr. Lương Sơn -H. Lương Sơn"
  },
  {
    school_name: "Trường THPT Nam Lương Sơn",
    department_edu: "Sở GD&ĐT Hòa Bình",
    province: "Hòa Bình",
    province_name: "Huyện Lương Sơn",
    school_address: "Xã Thành Lập -H. Lương Sơn"
  },
  {
    school_name: "Trường THPT Cù Chính Lan",
    department_edu: "Sở GD&ĐT Hòa Bình",
    province: "Hòa Bình",
    province_name: "Huyện Lương Sơn",
    school_address: "Xã Long Sơn -H. Lương Sơn"
  },
  {
    school_name: "Trường THPT Kim Bôi",
    department_edu: "Sở GD&ĐT Hòa Bình",
    province: "Hòa Bình",
    province_name: "Huyện Kim Bôi",
    school_address: "Xã Kim Bình -H. Kim Bôi"
  },
  {
    school_name: "Trường THPT 19\/5",
    department_edu: "Sở GD&ĐT Hòa Bình",
    province: "Hòa Bình",
    province_name: "Huyện Kim Bôi",
    school_address: "Xã Tú Sơn -H. Kim Bôi"
  },
  {
    school_name: "Trường THPT Bắc Sơn",
    department_edu: "Sở GD&ĐT Hòa Bình",
    province: "Hòa Bình",
    province_name: "Huyện Kim Bôi",
    school_address: "Xã Bắc Sơn - H. Kim Bôi"
  },
  {
    school_name: "Trường THPT Sào Báy",
    department_edu: "Sở GD&ĐT Hòa Bình",
    province: "Hòa Bình",
    province_name: "Huyện Kim Bôi",
    school_address: "Xã Sào Báy - H. Kim Bôi"
  },
  {
    school_name: "Trường THPT Thanh Hà",
    department_edu: "Sở GD&ĐT Hòa Bình",
    province: "Hòa Bình",
    province_name: "Huyện Lạc Thủy",
    school_address: "TTr. Thanh Hà -H. Lạc Thủy"
  },
  {
    school_name: "Trường THPT Lạc Thuỷ A",
    department_edu: "Sở GD&ĐT Hòa Bình",
    province: "Hòa Bình",
    province_name: "Huyện Lạc Thủy",
    school_address: "TTr. Chi Nê -H. Lạc Thuỷ"
  },
  {
    school_name: "Trường THPT Lạc Thuỷ B",
    department_edu: "Sở GD&ĐT Hòa Bình",
    province: "Hòa Bình",
    province_name: "Huyện Lạc Thủy",
    school_address: "Xã Cố Nghĩa -H. Lạc Thuỷ"
  },
  {
    school_name: "Trường THPT Lạc Thuỷ C",
    department_edu: "Sở GD&ĐT Hòa Bình",
    province: "Hòa Bình",
    province_name: "Huyện Lạc Thủy",
    school_address: "Xã An Bình -H. Lạc Thuỷ"
  },
  {
    school_name: "Trường THPT Yên Thuỷ A",
    department_edu: "Sở GD&ĐT Hòa Bình",
    province: "Hòa Bình",
    province_name: "Huyện Yên Thủy",
    school_address: "TTr. Hàng Trạm -H. Yên Thuỷ"
  },
  {
    school_name: "Trường THPT Yên Thuỷ B",
    department_edu: "Sở GD&ĐT Hòa Bình",
    province: "Hòa Bình",
    province_name: "Huyện Yên Thủy",
    school_address: "Xã Bảo Hiệu -H. Yên Thuỷ"
  },
  {
    school_name: "Trường THPT Yên Thuỷ C",
    department_edu: "Sở GD&ĐT Hòa Bình",
    province: "Hòa Bình",
    province_name: "Huyện Yên Thủy",
    school_address: "Xã Yên Trị -H. Yên Thuỷ"
  },
  {
    school_name: "Trường THPT Cao Phong",
    department_edu: "Sở GD&ĐT Hòa Bình",
    province: "Hòa Bình",
    province_name: "Huyện Cao Phong",
    school_address: "TTr. Cao Phong -H. Cao Phong"
  },
  {
    school_name: "Trường THPT Thạch Yên",
    department_edu: "Sở GD&ĐT Hòa Bình",
    province: "Hòa Bình",
    province_name: "Huyện Cao Phong",
    school_address: "Xã Dũng Phong - H. Cao Phong"
  },

  {
    school_name: "Trường THPT Chuyên Lương Văn Tụy",
    department_edu: "Sở GD&ĐT Ninh Bình",
    province: "Ninh Bình",
    province_name: "Thành phố Ninh Bình",
    school_address: "Ph. Tân Thành TP Ninh Bình"
  },
  {
    school_name: "Trường THPT Đinh Tiên Hoàng",
    department_edu: "Sở GD&ĐT Ninh Bình",
    province: "Ninh Bình",
    province_name: "Thành phố Ninh Bình",
    school_address: "Ph. Bích Đào TP Ninh Bình"
  },
  {
    school_name: "Trường THPT Trần Hưng Đạo",
    department_edu: "Sở GD&ĐT Ninh Bình",
    province: "Ninh Bình",
    province_name: "Thành phố Ninh Bình",
    school_address: "Ph. Ninh Phong TP Ninh Bình"
  },
  {
    school_name: "Trường THPT Ninh Bình Bạc Liêu",
    department_edu: "Sở GD&ĐT Ninh Bình",
    province: "Ninh Bình",
    province_name: "Thành phố Ninh Bình",
    school_address: "Ph. Phúc Thành TP Ninh Bình"
  },
  {
    school_name: "Trường THPT Nguyễn Công Trứ",
    department_edu: "Sở GD&ĐT Ninh Bình",
    province: "Ninh Bình",
    province_name: "Thành phố Ninh Bình",
    school_address: "Ph. Phúc Thành TP Ninh Bình"
  },
  {
    school_name: "Trường THPT Nguyễn Huệ",
    department_edu: "Sở GD&ĐT Ninh Bình",
    province: "Ninh Bình",
    province_name: "Thị xã Tam Điệp",
    school_address: "Ph. Bắc Sơn TX Tam Điệp"
  },
  {
    school_name: "Trường THPT Ngô Thì Nhậm",
    department_edu: "Sở GD&ĐT Ninh Bình",
    province: "Ninh Bình",
    province_name: "Thị xã Tam Điệp",
    school_address: "Ph. Đông Sơn TX Tam Điệp"
  },
  {
    school_name: "Trường THPT Nho Quan A",
    department_edu: "Sở GD&ĐT Ninh Bình",
    province: "Ninh Bình",
    province_name: "Huyện Nho Quan",
    school_address: "Xã Quỳnh Lưu H. Nho Quan"
  },
  {
    school_name: "Trường THPT Nho Quan B",
    department_edu: "Sở GD&ĐT Ninh Bình",
    province: "Ninh Bình",
    province_name: "Huyện Nho Quan",
    school_address: "TTr. Nho Quan H Nho Quan"
  },
  {
    school_name: "Trường THPT DT Nội Trú",
    department_edu: "Sở GD&ĐT Ninh Bình",
    province: "Ninh Bình",
    province_name: "Huyện Nho Quan",
    school_address: "TTr. Nho Quan H Nho Quan"
  },
  {
    school_name: "Trường THPT Nho Quan C",
    department_edu: "Sở GD&ĐT Ninh Bình",
    province: "Ninh Bình",
    province_name: "Huyện Nho Quan",
    school_address: "Xã Gia Lâm H. Nho Quan"
  },
  {
    school_name: "Trường THPT Gia Viễn A",
    department_edu: "Sở GD&ĐT Ninh Bình",
    province: "Ninh Bình",
    province_name: "Huyện Gia Viễn",
    school_address: "Xã Gia Phú H Gia Viễn"
  },
  {
    school_name: "Trường THPT Gia Viễn B",
    department_edu: "Sở GD&ĐT Ninh Bình",
    province: "Ninh Bình",
    province_name: "Huyện Gia Viễn",
    school_address: "Xã Gia Lập H Gia Viễn"
  },
  {
    school_name: "Trường THPT Gia Viễn C",
    department_edu: "Sở GD&ĐT Ninh Bình",
    province: "Ninh Bình",
    province_name: "Huyện Gia Viễn",
    school_address: "Xã Gia Sinh H Gia Viễn"
  },
  {
    school_name: "Trường THPT Hoa Lư A",
    department_edu: "Sở GD&ĐT Ninh Bình",
    province: "Ninh Bình",
    province_name: "Huyện Hoa Lư",
    school_address: "TTr. Thiên Tôn H Hoa Lư"
  },
  {
    school_name: "Trường THPT Trương Hán Siêu",
    department_edu: "Sở GD&ĐT Ninh Bình",
    province: "Ninh Bình",
    province_name: "Huyện Hoa Lư",
    school_address: "Xã Ninh Mỹ, H. Hoa Lư"
  },
  {
    school_name: "Trường THPT Yên Mô A",
    department_edu: "Sở GD&ĐT Ninh Bình",
    province: "Ninh Bình",
    province_name: "Huyện Yên Mô",
    school_address: "Xã Khánh Thượng H Yên Mô"
  },
  {
    school_name: "Trường THPT Yên Mô B",
    department_edu: "Sở GD&ĐT Ninh Bình",
    province: "Ninh Bình",
    province_name: "Huyện Yên Mô",
    school_address: "Xã Yên Mạc H Yên Mô"
  },
  {
    school_name: "Trường THPT Tạ Uyên",
    department_edu: "Sở GD&ĐT Ninh Bình",
    province: "Ninh Bình",
    province_name: "Huyện Yên Mô",
    school_address: "Xã Yên Phong H Yên Mô"
  },
  {
    school_name: "Trường THPT Kim Sơn A",
    department_edu: "Sở GD&ĐT Ninh Bình",
    province: "Ninh Bình",
    province_name: "Huyện Kim Sơn",
    school_address: "TTr. Phát Diệm H Kim Sơn"
  },
  {
    school_name: "Trường THPT Kim Sơn B",
    department_edu: "Sở GD&ĐT Ninh Bình",
    province: "Ninh Bình",
    province_name: "Huyện Kim Sơn",
    school_address: "Xã Hùng Tiến H Kim Sơn"
  },
  {
    school_name: "Trường THPT Bình Minh",
    department_edu: "Sở GD&ĐT Ninh Bình",
    province: "Ninh Bình",
    province_name: "Huyện Kim Sơn",
    school_address: "TTr. Bình Minh H Kim Sơn"
  },
  {
    school_name: "Trường THPT Kim Sơn C",
    department_edu: "Sở GD&ĐT Ninh Bình",
    province: "Ninh Bình",
    province_name: "Huyện Kim Sơn",
    school_address: "Xã Thượng Kiệm H Kim Sơn"
  },
  {
    school_name: "Trường THPT Yên Khánh A",
    department_edu: "Sở GD&ĐT Ninh Bình",
    province: "Ninh Bình",
    province_name: "Huyện Yên Khánh",
    school_address: "Xã Khánh Hội H Yên Khánh"
  },
  {
    school_name: "Trường THPT Yên Khánh B",
    department_edu: "Sở GD&ĐT Ninh Bình",
    province: "Ninh Bình",
    province_name: "Huyện Yên Khánh",
    school_address: "Xã Khánh Cư H Yên Khánh"
  },
  {
    school_name: "Trường THPT Vũ Duy Thanh",
    department_edu: "Sở GD&ĐT Ninh Bình",
    province: "Ninh Bình",
    province_name: "Huyện Yên Khánh",
    school_address: "Xã Khánh Nhạc H Yên Khánh"
  },
  {
    school_name: "Trường THPT Yên Khánh C",
    department_edu: "Sở GD&ĐT Ninh Bình",
    province: "Ninh Bình",
    province_name: "Huyện Yên Khánh",
    school_address: "Xã Khánh Cường H Yên Khánh"
  },

  {
    school_name: "Trường THPT Thành phố Điên Biên Phủ",
    department_edu: "Sở GD&ĐT Điện Biên",
    province: "Điện Biên",
    province_name: "Thành phố Điên Biên Phủ",
    school_address: "Phố 7, Phường Mường Thanh, Thành phố Điên Biên Phủ"
  },
  {
    school_name: "Trường THPT Chuyên Lê Quý Đôn",
    department_edu: "Sở GD&ĐT Điện Biên",
    province: "Điện Biên",
    province_name: "Thành phố Điên Biên Phủ",
    school_address: "Phố 10, Mường Thanh Thành phố Điên Biên Phủ"
  },
  {
    school_name: "Trường THPT Phan Đình Giót",
    department_edu: "Sở GD&ĐT Điện Biên",
    province: "Điện Biên",
    province_name: "Thành phố Điên Biên Phủ",
    school_address: "Phố 5, Phường Him Lam-Thành phố Điên Biên Phủ"
  },
  {
    school_name: "Trường THPT thị xã Mường Lay",
    department_edu: "Sở GD&ĐT Điện Biên",
    province: "Điện Biên",
    province_name: "Thị xã Mường Lay",
    school_address: "Phường Na Lay, Thị xã Mường Lay"
  },
  {
    school_name: "Trường THPT huyện Điện Biên",
    department_edu: "Sở GD&ĐT Điện Biên",
    province: "Điện Biên",
    province_name: "Huyện Điện Biên",
    school_address: "Xã Noong Hẹt, Huyện Điện Biên"
  },
  {
    school_name: "Trường THPT Thanh Chăn",
    department_edu: "Sở GD&ĐT Điện Biên",
    province: "Điện Biên",
    province_name: "Huyện Điện Biên",
    school_address: "Xã Thanh Chăn, Huyện Điện Biên"
  },
  {
    school_name: "Trường THPT Mường Nhà",
    department_edu: "Sở GD&ĐT Điện Biên",
    province: "Điện Biên",
    province_name: "Huyện Điện Biên",
    school_address: "Xã Mường Nhà, huyện Điện Biên"
  },
  {
    school_name: "Trường THPT Nà Tấu",
    department_edu: "Sở GD&ĐT Điện Biên",
    province: "Điện Biên",
    province_name: "Huyện Điện Biên",
    school_address: "Xã Nà Tấu, huyện Điện Biên"
  },
  {
    school_name: "Trường PT DTN THPT huyện Điện Biên",
    department_edu: "Sở GD&ĐT Điện Biên",
    province: "Điện Biên",
    province_name: "Thành phố Điên Biên Phủ",
    school_address: "Phường Nam Thanh- T.P Điện Biên Phủ"
  },
  {
    school_name: "Trường THPT Thanh Nưa",
    department_edu: "Sở GD&ĐT Điện Biên",
    province: "Điện Biên",
    province_name: "Huyện Điện Biên",
    school_address: "Xã Thanh Nưa, huyện Điện Biên"
  },
  {
    school_name: "Trường THPT Tuần Giáo",
    department_edu: "Sở GD&ĐT Điện Biên",
    province: "Điện Biên",
    province_name: "Huyện Tuần Giáo",
    school_address: "Khối 2A, Huyện Tuần Giáo"
  },
  {
    school_name: "Trường THPT Mùn Chung",
    department_edu: "Sở GD&ĐT Điện Biên",
    province: "Điện Biên",
    province_name: "Huyện Tuần Giáo",
    school_address: "Xã Mùn Chung, huyện Tuần Giáo"
  },
  {
    school_name: "Trường PT DTN THPT huyện Tuần Giáo",
    department_edu: "Sở GD&ĐT Điện Biên",
    province: "Điện Biên",
    province_name: "Huyện Tuần Giáo",
    school_address: "Thị trấn Tuần Giáo, huyện Tuần Giáo"
  },
  {
    school_name: "Trường THPT Mường Chà",
    department_edu: "Sở GD&ĐT Điện Biên",
    province: "Điện Biên",
    province_name: "Huyện Mường Chà",
    school_address: "Thị trấn Mường Chà, huyện Mường Chà"
  },
  {
    school_name: "Trường PT DTN THPT Mường Chà",
    department_edu: "Sở GD&ĐT Điện Biên",
    province: "Điện Biên",
    province_name: "Huyện Mường Chà",
    school_address: "Thị trấn Mường Chà, huyện Mường Chà"
  },
  {
    school_name: "Trường THPT Tủa Chùa",
    department_edu: "Sở GD&ĐT Điện Biên",
    province: "Điện Biên",
    province_name: "Huyện Tủa Chùa",
    school_address: "Phố Thắng Lợi, thị trấn Tủa Chùa, huyện Tủa Chùa"
  },
  {
    school_name: "Trường THPT Tả Sìn Thàng",
    department_edu: "Sở GD&ĐT Điện Biên",
    province: "Điện Biên",
    province_name: "Huyện Tủa Chùa",
    school_address: "Xã Tả Sìn Thàng, huyện Tủa Chùa"
  },
  {
    school_name: "Trường PT DTN THPT huyện Tủa Chùa",
    department_edu: "Sở GD&ĐT Điện Biên",
    province: "Điện Biên",
    province_name: "Huyện Tủa Chùa",
    school_address: "Khu Thành Công, thị trấn Tủa Chùa, huyện Tủa Chùa"
  },
  {
    school_name: "Trường THPT Trần Can",
    department_edu: "Sở GD&ĐT Điện Biên",
    province: "Điện Biên",
    province_name: "Huyện Điện Biên Đông",
    school_address: "Thị trấn Điện Biên Đông, huyện Điện Biên Đông"
  },
  {
    school_name: "Trường THPT Mường Luân",
    department_edu: "Sở GD&ĐT Điện Biên",
    province: "Điện Biên",
    province_name: "Huyện Điện Biên Đông",
    school_address: "Xã Mường Luân, huyện Điện Biên Đông"
  },
  {
    school_name: "Trường PT DTN THPT Điện Biên Đông",
    department_edu: "Sở GD&ĐT Điện Biên",
    province: "Điện Biên",
    province_name: "Huyện Điện Biên Đông",
    school_address: "Thị trấn Điện Biên Đông, huyện Điện Biên Đông"
  },
  {
    school_name: "Trường THPT Mường Nhé",
    department_edu: "Sở GD&ĐT Điện Biên",
    province: "Điện Biên",
    province_name: "Huyện Mường Nhé",
    school_address: "Xã Mường Nhé, huyện Mường Nhé"
  },
  {
    school_name: "Trường THPT DTNT H. Mường Nhé",
    department_edu: "Sở GD&ĐT Điện Biên",
    province: "Điện Biên",
    province_name: "Huyện Mường Nhé",
    school_address: "Xã Mường Nhé, huyện Mường Nhé"
  },
  {
    school_name: "Trường THPT Mường ảng",
    department_edu: "Sở GD&ĐT Điện Biên",
    province: "Điện Biên",
    province_name: "Huyện Mường Ảng",
    school_address: "Thị trấn Mường Ảng, huyện Mường Ảng"
  },
  {
    school_name: "Trường THPT Búng Lao",
    department_edu: "Sở GD&ĐT Điện Biên",
    province: "Điện Biên",
    province_name: "Huyện Mường Ảng",
    school_address: "Xã Búng Lao, huyện Mường ảng"
  },
  {
    school_name: "Trường PT DTN THPT Mường Ảng",
    department_edu: "Sở GD&ĐT Điện Biên",
    province: "Điện Biên",
    province_name: "Huyện Mường Ảng",
    school_address: "Thị trấn Mường Ảng, huyện Mường Ảng"
  },
  {
    school_name: "Trường THPT Chà Cang",
    department_edu: "Sở GD&ĐT Điện Biên",
    province: "Điện Biên",
    province_name: "Huyện Nậm Pồ",
    school_address: "Xã Chà Cang, huyện Nậm Pồ"
  },

  {
    school_name: "Trường THPT Lê Hồng Phong",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Quận Hồng Bàng",
    school_address: "P. Hạ Lý, Q.Hồng Bàng HP"
  },
  {
    school_name: "Trường THPT Hồng Bàng",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Quận Hồng Bàng",
    school_address: "P.Sở Dầu, Q.Hồng Bàng HP"
  },
  {
    school_name: "Trường THPT Lương Thế Vinh",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Quận Hồng Bàng",
    school_address: "P..Minh Khai, Q.Hồng Bàng"
  },
  {
    school_name: "Trường THPT Ngô Quyền",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Quận Lê Chân",
    school_address: "P..Mê Linh, Q. Lê chân"
  },
  {
    school_name: "Trường THPT Trần Nguyên Hãn",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Quận Lê Chân",
    school_address: "P.Lam Sơn, Q. Lê Chân"
  },
  {
    school_name: "Trường THPT Lê Chân",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Quận Lê Chân",
    school_address: "P. Vĩnh Niệm, Q. Lê Chân"
  },
  {
    school_name: "Trường THPT Lý Thái Tổ",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Quận Lê Chân",
    school_address: "P. Nghĩa Xá, Q. Lê Chân"
  },
  {
    school_name: "Trường THPT Chuyên Trần Phú",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Quận Ngô Quyền",
    school_address: "P. Lương Khánh Thiện,Q. Ngô Quyền"
  },
  {
    school_name: "Trường THPT Thái Phiên",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Quận Ngô Quyền",
    school_address: "P.Cầu Tre, Q. Ngô Quyền"
  },
  {
    school_name: "Trường THPT Hàng Hải",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Quận Ngô Quyền",
    school_address: "P. Đổng Quốc Bình, Q. Ngô Quyền"
  },
  {
    school_name: "Trường THPT Thăng Long",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Quận Ngô Quyền",
    school_address: "P. Lạch Tray, Q. Ngô Quyền"
  },
  {
    school_name: "Trường THPT Marie Curie",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Quận Ngô Quyền",
    school_address: "P. Đằng Giang, Q. Ngô Quyền"
  },
  {
    school_name: "Trường THPT Hermann Gmeiner",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Quận Ngô Quyền",
    school_address: "P. Đằng Giang, Q. Ngô Quyền"
  },
  {
    school_name: "Trường THPT Anhxtanh",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Quận Ngô Quyền",
    school_address: "P. Máy Tơ, Q. Ngô Quyền"
  },
  {
    school_name: "Trường THPT Lương Khánh Thiện",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Quận Ngô Quyền",
    school_address: "số 39 Lương Khánh Thiện, Q.Ngô Quyền"
  },
  {
    school_name: "Trường THPT Kiến An",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Quận Kiến An",
    school_address: "P. Ngọc Sơn, Q. Kiến An"
  },
  {
    school_name: "Trường THPT Phan Đăng Lưu",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Quận Kiến An",
    school_address: "P. Ngọc Sơn, Q. Kiến An"
  },
  {
    school_name: "Trường THPT Đồng Hòa",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Quận Kiến An",
    school_address: "P. Đồng Hòa, Q. Kiến An"
  },
  {
    school_name: "Trường THPT Hải An",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Quận Hải An",
    school_address: "P. Cát Bi, Q. Hải An"
  },
  {
    school_name: "Trường THPT Lê Quý Đôn",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Quận Hải An",
    school_address: "P. Cát Bi, Q. Hải An"
  },
  {
    school_name: "Trường THPT Phan Chu Trinh",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Quận Hải An",
    school_address: "P. Đằng Lâm, Q. Hải An"
  },
  {
    school_name: "Trường THPT Đồ Sơn",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Quận Đồ Sơn",
    school_address: "P. Ngọc Xuyên, Q. Đồ Sơn"
  },
  {
    school_name: "Trường THPT Nội Trú Đồ Sơn",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Quận Đồ Sơn",
    school_address: "P.Vạn Sơn, Q. Đồ Sơn"
  },
  {
    school_name: "Trường THPT An Lão",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Huyện An Lão",
    school_address: "TTr. An Lão, H.An Lão"
  },
  {
    school_name: "Trường THPT Trần Hưng Đạo",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Huyện An Lão",
    school_address: "Xã An Thái, H. An Lão"
  },
  {
    school_name: "Trường THPT Trần Tất Văn",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Huyện An Lão",
    school_address: "Xã An Thắng, H. An Lão"
  },
  {
    school_name: "Trường THPT Quốc Tuấn",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Huyện An Lão",
    school_address: "Xã Quốc Tuấn, H. An Lão"
  },
  {
    school_name: "Trường THPT Kiến Thụy",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Huyện Kiến Thụy",
    school_address: "TTr. Núi Đối, H. Kiến Thụy"
  },
  {
    school_name: "Trường THPT Nguyễn Đức Cảnh",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Huyện Kiến Thụy",
    school_address: "Xã Tú Sơn, H. Kiến Thụy"
  },
  {
    school_name: "Trường THPT Nguyễn Huệ",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Huyện Kiến Thụy",
    school_address: "TTr. Núi Đối, H. Kiến Thụy"
  },
  {
    school_name: "Trường THPT Thụy Hương",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Huyện Kiến Thụy",
    school_address: "Xã Thụy Hương, H. Kiến Thụy"
  },
  {
    school_name: "Trường THPT Phạm Ngũ Lão",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Huyện Thủy Nguyên",
    school_address: "Xã Ngũ Lão, H. Thủy Nguyên"
  },
  {
    school_name: "Trường THPT Bạch Đằng",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Huyện Thủy Nguyên",
    school_address: "Xã Lưu Kiếm, H. Thủy Nguyên"
  },
  {
    school_name: "Trường THPT Quang Trung",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Huyện Thủy Nguyên",
    school_address: "Xã Cao Nhân, H. Thủy Nguyên"
  },
  {
    school_name: "Trường THPT Lý Thường Kiệt",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Huyện Thủy Nguyên",
    school_address: "Xã Thủy Sơn, H.Thủy Nguyên"
  },
  {
    school_name: "Trường THPT Lê ích Mộc",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Huyện Thủy Nguyên",
    school_address: "Xã Kỳ Sơn, H. Thủy Nguyên"
  },
  {
    school_name: "Trường THPT Thủy Sơn",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Huyện Thủy Nguyên",
    school_address: "Xã Thủy Sơn, H.Thủy Nguyên"
  },
  {
    school_name: "Trường THPT 25\/10",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Huyện Thủy Nguyên",
    school_address: "Xã Thủy Sơn, H.Thủy Nguyên"
  },
  {
    school_name: "Trường THPT Nam Triệu",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Huyện Thủy Nguyên",
    school_address: "Xã Phục Lễ, H. Thủy Nguyên"
  },
  {
    school_name: "Trường THPT Nguyễn Trãi",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Huyện An Dương",
    school_address: "Xã An Hưng, H. An Dương"
  },
  {
    school_name: "Trường THPT An Dương",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Huyện An Dương",
    school_address: "TTr. An Dương, H. An Dương"
  },
  {
    school_name: "Trường THPT Tân An",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Huyện An Dương",
    school_address: "Xã Tân Tiến, H. An Dương"
  },
  {
    school_name: "Trường THPT An Hải",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Huyện An Dương",
    school_address: "TTr. An Dương, H. An Dương"
  },
  {
    school_name: "Trường THPT Tiên Lãng",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Huyện Tiên Lãng",
    school_address: "TTr. Tiên lãng, H. Tiên Lãng"
  },
  {
    school_name: "Trường THPT Toàn Thắng",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Huyện Tiên Lãng",
    school_address: "Xã Toàn Thắng, H. Tiên Lãng"
  },
  {
    school_name: "Trường THPT Hùng Thắng",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Huyện Tiên Lãng",
    school_address: "Xã Hùng Thắng, H. Tiên Lãng"
  },
  {
    school_name: "Trường THPT Nhữ Văn Lan",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Huyện Tiên Lãng",
    school_address: "TTr. Tiên Lãng, H. Tiên Lãng"
  },
  {
    school_name: "Trường THPT Nguyễn Bỉnh Khiêm",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Huyện Vĩnh Bảo",
    school_address: "Xã Lý Học, H. Vĩnh Bảo"
  },
  {
    school_name: "Trường THPT Tô Hiệu",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Huyện Vĩnh Bảo",
    school_address: "Xã Vĩnh An, H. Vĩnh Bảo"
  },
  {
    school_name: "Trường THPT Vĩnh Bảo",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Huyện Vĩnh Bảo",
    school_address: "TTr. Vĩnh Bảo, H. Vĩnh Bảo"
  },
  {
    school_name: "Trường THPT Cộng Hiền",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Huyện Vĩnh Bảo",
    school_address: "Xã Cộng Hiền, H. Vĩnh Bảo"
  },
  {
    school_name: "Trường THPT Nguyễn Khuyến",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Huyện Vĩnh Bảo",
    school_address: "TTr. Vĩnh Bảo, H. Vĩnh Bảo"
  },
  {
    school_name: "Trường THPT Cát Bà",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Huyện Cát Hải",
    school_address: "TTr. Cát Bà, H.Cát Hải"
  },
  {
    school_name: "Trường THPT Cát Hải",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Huyện Cát Hải",
    school_address: "Xã Văn Phong, H. Cát Hải"
  },
  {
    school_name: "Trường THPT Mạc Đĩnh Chi",
    department_edu: "Sở GD&ĐT Hải Phòng",
    province: "Hải Phòng",
    province_name: "Quận Dương Kính",
    school_address: "P. Anh Dũng, Q. Dương Kinh"
  },

  {
    school_name: "Trường THPT Chuyên Lê Quý Đôn",
    department_edu: "Sở GD&ĐT Lai Châu",
    province: "Lai Châu",
    province_name: "Thành phố Lai Châu",
    school_address: "Phường Đoàn Kết -TP Lai Châu - tỉnh Lai Châu"
  },
  {
    school_name: "Trường THPT Thành phố",
    department_edu: "Sở GD&ĐT Lai Châu",
    province: "Lai Châu",
    province_name: "Thành phố Lai Châu",
    school_address: "Phường Tân Phong - TP Lai Châu - tỉnh Lai Châu"
  },
  {
    school_name: "Trường THPT Quyết Thắng",
    department_edu: "Sở GD&ĐT Lai Châu",
    province: "Lai Châu",
    province_name: "Thành phố Lai Châu",
    school_address: "Phường Quyết Thắng- TP Lai Châu - tỉnh Lai Châu"
  },
  {
    school_name: "Trường THPT Dân tộc Nội trú Tỉnh",
    department_edu: "Sở GD&ĐT Lai Châu",
    province: "Lai Châu",
    province_name: "Thành phố Lai Châu",
    school_address: "Phường Quyết Thắng - TP Lai Châu - tỉnh Lai Châu"
  },
  {
    school_name: "Trường THPT Bình Lư",
    department_edu: "Sở GD&ĐT Lai Châu",
    province: "Lai Châu",
    province_name: "Huyện Tam Đường",
    school_address: "TT Tam Đường - huyện Tam Đường- Lai Châu"
  },
  {
    school_name: "Trường THPT Phong Thổ",
    department_edu: "Sở GD&ĐT Lai Châu",
    province: "Lai Châu",
    province_name: "Huyện Phong Thổ ",
    school_address: "TT Phong Thổ - huyện Phong Thổ - tỉnh Lai Châu"
  },
  {
    school_name: "Trường THPT Mường So",
    department_edu: "Sở GD&ĐT Lai Châu",
    province: "Lai Châu",
    province_name: "Huyện Phong Thổ",
    school_address: "Xã Mường So - huyện Phong Thổ - huyện Lai Châu"
  },
  {
    school_name: "Trường THPT Dào San",
    department_edu: "Sở GD&ĐT Lai Châu",
    province: "Lai Châu",
    province_name: "Huyện Phong Thổ",
    school_address: "Xã Dào San - huyện Phong Thổ - tỉnh Lai Châu"
  },
  {
    school_name: "Trường THPT Sìn Hồ",
    department_edu: "Sở GD&ĐT Lai Châu",
    province: "Lai Châu",
    province_name: "Huyện Sìn Hồ",
    school_address: "TT Sìn Hồ - huyện Sìn Hồ - tỉnh Lai Châu"
  },
  {
    school_name: "Trường THPT Nậm Tăm",
    department_edu: "Sở GD&ĐT Lai Châu",
    province: "Lai Châu",
    province_name: "Huyện Sìn Hồ",
    school_address: "Xã Nậm Tăm - huyện Sìn Hồ - tỉnh Lai Châu"
  },
  {
    school_name: "Trường THPT Mường Tè",
    department_edu: "Sở GD&ĐT Lai Châu",
    province: "Lai Châu",
    province_name: "Huyện Mường Tè",
    school_address: "TT Mường Tè - huyện Mường Tè - tỉnh Lai Châu"
  },
  {
    school_name: "Trường THPT Dân tộc Nội trú Ka Lăng",
    department_edu: "Sở GD&ĐT Lai Châu",
    province: "Lai Châu",
    province_name: "Huyện Mường Tè",
    school_address: "Xã Ka Lăng - huyện Mường Tè - tỉnh Lai Châu"
  },
  {
    school_name: "Trường THPT Than Uyên",
    department_edu: "Sở GD&ĐT Lai Châu",
    province: "Lai Châu",
    province_name: "Huyện Than Uyên",
    school_address: "TT Than Uyên - huyện Than Uyên - tỉnh Lai Châu"
  },
  {
    school_name: "Trường THPT Mường Than",
    department_edu: "Sở GD&ĐT Lai Châu",
    province: "Lai Châu",
    province_name: "Huyện Than Uyên",
    school_address: "Xã Phúc Than - huyện Than Uyên - tỉnh Lai Châu"
  },
  {
    school_name: "Trường THPT Mường Kim",
    department_edu: "Sở GD&ĐT Lai Châu",
    province: "Lai Châu",
    province_name: "Huyện Than Uyên",
    school_address: "Xã Mường Kim - huyện Than Uyên - tỉnh Lai Châu"
  },
  {
    school_name: "Trường THPT Tân uyên",
    department_edu: "Sở GD&ĐT Lai Châu",
    province: "Lai Châu",
    province_name: "Huyện Tân Uyên",
    school_address: "TT Tân Uyên - huyện Tân Uyên tỉnh Lai Châu"
  },
  {
    school_name: "Trường THPT Trung Đồng",
    department_edu: "Sở GD&ĐT Lai Châu",
    province: "Lai Châu",
    province_name: "Huyện Tân Uyên",
    school_address: "Xã Trung Đồng - huyện Tân Uyên - tỉnh Lai Châu"
  },
  {
    school_name: "Trường THPT Nậm Nhùn",
    department_edu: "Sở GD&ĐT Lai Châu",
    province: "Lai Châu",
    province_name: "Huyện Nậm Nhùn",
    school_address: "TT Nậm Nhùn - huyện Nậm Nhùn - tỉnh Lai Châu"
  },

  {
    school_name: "Trường THPT Bắc Kạn",
    department_edu: "Sở GD&ĐT Bắc Kạn",
    province: "Bắc Kạn",
    province_name: "Thị xã Bắc Kạn",
    school_address: "P.Sông Cầu TX Bắc Kạn"
  },
  {
    school_name: "Trường THPT Chuyên",
    department_edu: "Sở GD&ĐT Bắc Kạn",
    province: "Bắc Kạn",
    province_name: "Thị xã Bắc Kạn",
    school_address: "P. Sông Cầu -TX Bắc Kạn"
  },
  {
    school_name: "Trường THPT Dân lập Hùng Vương",
    department_edu: "Sở GD&ĐT Bắc Kạn",
    province: "Bắc Kạn",
    province_name: "Thị xã Bắc Kạn",
    school_address: "Ph. Chí Kiên TX Bắc Kạn"
  },
  {
    school_name: "Trường THPT Chợ Đồn",
    department_edu: "Sở GD&ĐT Bắc Kạn",
    province: "Bắc Kạn",
    province_name: "Huyện Chợ Đồn",
    school_address: "TT Bằng Lũng -H. Chợ Đồn"
  },
  {
    school_name: "Trường THPT Bình Trung",
    department_edu: "Sở GD&ĐT Bắc Kạn",
    province: "Bắc Kạn",
    province_name: "Huyện Chợ Đồn",
    school_address: "Xã Bình Trung H Chợ Đồn"
  },
  {
    school_name: "Trường THPT Phủ Thông",
    department_edu: "Sở GD&ĐT Bắc Kạn",
    province: "Bắc Kạn",
    province_name: "Huyện Bạch Thông",
    school_address: "TT Phủ Thông -H. Bạch Thông"
  },
  {
    school_name: "Trường THPT Na Rỳ",
    department_edu: "Sở GD&ĐT Bắc Kạn",
    province: "Bắc Kạn",
    province_name: "Huyện Na Rỳ",
    school_address: "TT Yến Lạc -H. Na Rỳ"
  },
  {
    school_name: "Trường THPT Ngân Sơn",
    department_edu: "Sở GD&ĐT Bắc Kạn",
    province: "Bắc Kạn",
    province_name: "Huyện Ngân Sơn",
    school_address: "Xã Vân Tùng -H. Ngân Sơn"
  },
  {
    school_name: "Trường THPT Ba Bể",
    department_edu: "Sở GD&ĐT Bắc Kạn",
    province: "Bắc Kạn",
    province_name: "Huyện Ba Bể",
    school_address: "TT Chợ Rã -H. Ba Bể"
  },
  {
    school_name: "Trường THPT Quảng Khê",
    department_edu: "Sở GD&ĐT Bắc Kạn",
    province: "Bắc Kạn",
    province_name: "Huyện Ba Bể",
    school_address: "Xã Quảng khê -H Ba Bể"
  },
  {
    school_name: "Trường THPT Chợ Mới",
    department_edu: "Sở GD&ĐT Bắc Kạn",
    province: "Bắc Kạn",
    province_name: "Huyện Chợ Mới",
    school_address: "Xã Yên Đĩnh -H. Chợ Mới"
  },
  {
    school_name: "Trường THPT Yên Hân",
    department_edu: "Sở GD&ĐT Bắc Kạn",
    province: "Bắc Kạn",
    province_name: "Huyện Chợ Mới",
    school_address: "Xã Yên Hân -H. Chợ Mới"
  },
  {
    school_name: "Trường THPT Bộc Bố",
    department_edu: "Sở GD&ĐT Bắc Kạn",
    province: "Bắc Kạn",
    province_name: "Huyện Pác Nặm",
    school_address: "Xã Bộc Bố -H. Pác Nặm"
  },

  {
    school_name: "Trường THPT Chuyên Hùng Vương",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Thành phố Việt Trì",
    school_address: "Phường Tân Dân, TP.Viêt Trì"
  },
  {
    school_name: "Trường THPT Việt Trì",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Thành phố Việt Trì",
    school_address: "Phường Gia Cẩm, TP.Viêt Trì"
  },
  {
    school_name: "Trường THPT Công nghiệp Việt Trì",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Thành phố Việt Trì",
    school_address: "Phường Thanh Miếu, TP.Việt Trì"
  },
  {
    school_name: "Trường THPT Kĩ thuật Việt Trì",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Thành phố Việt Trì",
    school_address: "Phường Vân Phú, TP. Việt Trì"
  },
  {
    school_name: "Trường THPT Nguyễn Tất Thành",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Thành phố Việt Trì",
    school_address: "Phường Gia Cẩm, TP.Việt Trì"
  },
  {
    school_name: "Trường THPT Vũ Thê Lang",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Thành phố Việt Trì",
    school_address: "Phường Tân Dân, TP.Việt Trì"
  },
  {
    school_name: "Trường THPT Herman",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Thành phố Việt Trì",
    school_address: "Phường Dữu Lâu, TP.Viêt Trì"
  },
  {
    school_name: "Trường THPT Trần Phú",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Thành phố Việt Trì",
    school_address: "Phường Thanh Miếu, TP.Việt Trì"
  },
  {
    school_name: "Trường THPT Lê Qúy Đôn",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Thành phố Việt Trì",
    school_address: "Phường Dữu Lâu, Thành phố Việt Trì"
  },
  {
    school_name: "Trường THPT Dân lập Âu cơ",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Thành phố Việt Trì",
    school_address: "Phường Tân Dân, Thành phố Việt Trì"
  },
  {
    school_name: "Trường THPT Dân lập Vân Phú",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Thành phố Việt Trì",
    school_address: "Xã Vân Phú, Thành phố Việt Trì"
  },
  {
    school_name: "Trường THPT Bán Công Công nghiệp Việt Trì",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Thành phố Việt Trì",
    school_address: "Phường Thanh miếu, Thành phố Việt Trì"
  },
  {
    school_name: "Trường THPT Hùng Vương",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Thị xã Phú Thọ",
    school_address: "Phường Hùng Vương, TX. Phú Thọ"
  },
  {
    school_name: "Trường THPT thị xã Phú Thọ",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Thị xã Phú Thọ",
    school_address: "Phường Hùng Vương, TX. Phú Thọ"
  },
  {
    school_name: "Trường THPT Trường Thịnh",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Thị xã Phú Thọ",
    school_address: "Phường Trường Thịnh, Thị xã Phú Thọ"
  },
  {
    school_name: "Trường THPT Bán Công Hùng Vương",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Thị xã Phú Thọ",
    school_address: "Phường Hùng Vương, TX. Phú Thọ"
  },
  {
    school_name: "Trường THPT Đoan Hùng",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Đoan Hùng",
    school_address: "Thị trấn Đoan Hùng, huyện Đoan Hùng"
  },
  {
    school_name: "Trường THPT Chân Mộng",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Đoan Hùng",
    school_address: "Xã Chân Mộng, huyện Đoan Hùng"
  },
  {
    school_name: "Trường THPT Quế Lâm",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Đoan Hùng",
    school_address: "Xã Quế Lâm, huyện Đoan Hùng"
  },
  {
    school_name: "Trường THPT Bán Công Đoan Hùng",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Đoan Hùng",
    school_address: "Thị trấn Đoan Hùng, huyện Đoan Hùng"
  },
  {
    school_name: "Trường THPT Thanh Ba",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Thanh Ba",
    school_address: "Xã Ninh Dân, huyện Thanh Ba"
  },
  {
    school_name: "Trường THPT Yển Khê",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Thanh Ba",
    school_address: "Xã Yển Khê, huyện Thanh Ba"
  },
  {
    school_name: "Trường THPT Bán Công Thanh Ba",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Thanh Ba",
    school_address: "Xã Ninh Dân, huyện Thanh Ba"
  },
  {
    school_name: "Trường THPT Hạ Hoà",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Hạ Hoà",
    school_address: "Thị trấn Hạ Hoà, huyện Hạ Hoà"
  },
  {
    school_name: "Trường THPT Vĩnh Chân",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Hạ Hoà",
    school_address: "Xã Vĩnh Chân, huyện Hạ Hoà"
  },
  {
    school_name: "Trường THPT Xuân áng",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Hạ Hoà",
    school_address: "Xã Xuân áng, huyện Hạ Hoà"
  },
  {
    school_name: "Trường THPT Nguyễn Bỉnh Khiêm",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Hạ Hoà",
    school_address: "Thị trấn Hạ Hoà, huyện Hạ Hoà"
  },
  {
    school_name: "Trường THPT Cẩm Khê",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Cẩm Khê",
    school_address: "Thị trấn Sông Thao, huyện Cẩm Khê"
  },
  {
    school_name: "Trường THPT Hiền Đa",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Cẩm Khê",
    school_address: "Xã Hiền Đa, huyện Cẩm Khê"
  },
  {
    school_name: "Trường THPT Phương Xá",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Cẩm Khê",
    school_address: "Xã Phương xá, huyện Cẩm Khê"
  },
  {
    school_name: "Trường THPT Bán Công Cẩm Khê",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Cẩm Khê",
    school_address: "Thị Trấn Sông thao, huyện Cẩm Khê"
  },
  {
    school_name: "Trường THPT Yên Lập",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Yên Lập",
    school_address: "Thị trấn Yên Lập, huyện Yên Lập"
  },
  {
    school_name: "Trường THPT Lương Sơn",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Yên Lập",
    school_address: "Xã Lương Sơn, huyện Yên Lập"
  },
  {
    school_name: "Trường THPT Minh Hoà",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Yên Lập",
    school_address: "Xã Minh Hoà, huyện Yên Lập"
  },
  {
    school_name: "Trường THPT Thanh Sơn",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Thanh Sơn",
    school_address: "Thị trấn Thanh Sơn, huyện Thanh Sơn"
  },
  {
    school_name: "Trường THPT Văn Miếu",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Thanh Sơn",
    school_address: "Xã Văn Miếu, huyện Thanh Sơn"
  },
  {
    school_name: "Trường THPT Hương Cần",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Thanh Sơn",
    school_address: "Xã Hương Cần, huyện Thanh Sơn"
  },
  {
    school_name: "Trường THPT Bán Công Thanh Sơn",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Thanh Sơn",
    school_address: "Thị trấn Thanh Sơn, H. Thanh Sơn"
  },
  {
    school_name: "Trường THPT Phù Ninh",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Phù Ninh",
    school_address: "Xã Phú Lộc, huyện Phù Ninh"
  },
  {
    school_name: "Trường THPT Tử Đà",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Phù Ninh",
    school_address: "Xã Tử Đà, huyện Phù Ninh"
  },
  {
    school_name: "Trường THPT Trung Giáp",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Phù Ninh",
    school_address: "Xã Trung Giáp, huyện Phù Ninh"
  },
  {
    school_name: "Trường THPT Nguyễn Huệ",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Phù Ninh",
    school_address: "Thị trấn Phong Châu, huyện Phù Ninh"
  },
  {
    school_name: "Trường THPT Bán Công Phù Ninh",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Phù Ninh",
    school_address: "Xã Phú Lộc, huyện Phù Ninh"
  },
  {
    school_name: "Trường THPT Phan Đăng Lưu",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Phù Ninh",
    school_address: "Thị trấn Phong Châu, H. Phù Ninh"
  },
  {
    school_name: "Trường THPT Long Châu Sa",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Lâm Thao",
    school_address: "Thị trấn Lâm Thao, huyện Lâm Thao"
  },
  {
    school_name: "Trường THPT Phong Châu",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Lâm Thao",
    school_address: "Thị trấn Hùng Sơn, huyện Lâm Thao"
  },
  {
    school_name: "Trường THPT Lâm Thao",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Lâm Thao",
    school_address: "Thị trấn Lâm Thao, huyện Lâm Thao"
  },
  {
    school_name: "Trường THPT Bán Công Phong Châu",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Lâm Thao",
    school_address: "Thị trấn Hùng Sơn, H. Lâm Thao"
  },
  {
    school_name: "Trường THPT Tam Nông",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Tam Nông",
    school_address: "Xã Hương Nộn, huyện Tam Nông"
  },
  {
    school_name: "Trường THPT Mỹ Văn",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Tam Nông",
    school_address: "Xã Mỹ Văn, huyện Tam Nông"
  },
  {
    school_name: "Trường THPT Hưng Hoá",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Tam Nông",
    school_address: "Thị trấn Hưng Hoá, huyện Tam Nông"
  },
  {
    school_name: "Trường THPT Bán Công Tam Nông",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Tam Nông",
    school_address: "Xã Hương Nộm, H. Tam Nông"
  },
  {
    school_name: "Trường THPT Thanh Thuỷ",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Thanh Thuỷ",
    school_address: "Xã La Phù, huyện Thanh Thuỷ"
  },
  {
    school_name: "Trường THPT Trung Nghĩa",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Thanh Thuỷ",
    school_address: "Xã Trung Nghĩa, huyện Thanh Thuỷ"
  },
  {
    school_name: "Trường THPT Tản Đà",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Thanh Thuỷ",
    school_address: "Thị trấn Thanh Thuỷ, huyện Thanh Thuỷ"
  },
  {
    school_name: "Trường THPT Minh Đài",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Tân Sơn",
    school_address: "Xã Minh Đài, huyện Tân Sơn"
  },
  {
    school_name: "Trường THPT Thạch Kiệt",
    department_edu: "Sở GD&ĐT Phú Thọ",
    province: "Phú Thọ",
    province_name: "Huyện Tân Sơn",
    school_address: "Xã Thạch Kiệt, huyện Tân Sơn"
  },

  {
    school_name: "Trường THPT Chuyên Biên Hòa",
    department_edu: "Sở GD&ĐT Hà Nam",
    province: "Hà Nam",
    province_name: "Thành phố Phủ Lý",
    school_address: "P. Minh Khai, TP Phủ Lý"
  },
  {
    school_name: "Trường THPT A Phủ Lý",
    department_edu: "Sở GD&ĐT Hà Nam",
    province: "Hà Nam",
    province_name: "Thành phố Phủ Lý",
    school_address: "P. Lê Hồng Phong, Phủ Lý"
  },
  {
    school_name: "Trường THPT B Phủ Lý",
    department_edu: "Sở GD&ĐT Hà Nam",
    province: "Hà Nam",
    province_name: "Thành phố Phủ Lý",
    school_address: "Xã Thanh Châu, Phủ Lý"
  },
  {
    school_name: "Trường THPT Dân lập Lương Thế Vinh",
    department_edu: "Sở GD&ĐT Hà Nam",
    province: "Hà Nam",
    province_name: "Thành phố Phủ Lý",
    school_address: "P. Lương Khánh Thiện PLý"
  },
  {
    school_name: "Trường THPT C Phủ Lý",
    department_edu: "Sở GD&ĐT Hà Nam",
    province: "Hà Nam",
    province_name: "Thành phố Phủ Lý",
    school_address: "Xã Tiên Hiệp, TP Phủ Lý"
  },
  {
    school_name: "Trường THPT A Duy Tiên",
    department_edu: "Sở GD&ĐT Hà Nam",
    province: "Hà Nam",
    province_name: "Huyện Duy Tiên",
    school_address: "TTr. Hoà Mạc, Duy Tiên"
  },
  {
    school_name: "Trường THPT B Duy Tiên",
    department_edu: "Sở GD&ĐT Hà Nam",
    province: "Hà Nam",
    province_name: "Huyện Duy Tiên",
    school_address: "TTr. Đồng văn, Duy Tiên"
  },
  {
    school_name: "Trường THPT C Duy Tiên",
    department_edu: "Sở GD&ĐT Hà Nam",
    province: "Hà Nam",
    province_name: "Huyện Duy Tiên",
    school_address: "Xã Tiên Hiệp, Duy Tiên"
  },
  {
    school_name: "Trường THPT Nguyễn Hữu Tiến",
    department_edu: "Sở GD&ĐT Hà Nam",
    province: "Hà Nam",
    province_name: "Huyện Duy Tiên",
    school_address: "Xã Trác Văn, Duy Tiên"
  },
  {
    school_name: "Trường THPT A Kim Bảng",
    department_edu: "Sở GD&ĐT Hà Nam",
    province: "Hà Nam",
    province_name: "Huyện Kim Bảng",
    school_address: "TTr. Quế, Kim Bảng"
  },
  {
    school_name: "Trường THPT B Kim Bảng",
    department_edu: "Sở GD&ĐT Hà Nam",
    province: "Hà Nam",
    province_name: "Huyện Kim Bảng",
    school_address: "Xã Tân Sơn, Kim Bảng"
  },
  {
    school_name: "Trường THPT C Kim Bảng",
    department_edu: "Sở GD&ĐT Hà Nam",
    province: "Hà Nam",
    province_name: "Huyện Kim Bảng",
    school_address: "Xã Đồng Hoá, Kim Bảng"
  },
  {
    school_name: "Trường THPT Lý Thường Kiệt",
    department_edu: "Sở GD&ĐT Hà Nam",
    province: "Hà Nam",
    province_name: "Huyện Kim Bảng",
    school_address: "Xã Thi Sơn - Kim Bảng"
  },
  {
    school_name: "Trường THPT Lý Nhân",
    department_edu: "Sở GD&ĐT Hà Nam",
    province: "Hà Nam",
    province_name: "Huyện Lý Nhân",
    school_address: "TTr. Vĩnh Trụ, Lý Nhân"
  },
  {
    school_name: "Trường THPT Bắc Lý",
    department_edu: "Sở GD&ĐT Hà Nam",
    province: "Hà Nam",
    province_name: "Huyện Lý Nhân",
    school_address: "Xã Bắc Lý, Lý Nhân"
  },
  {
    school_name: "Trường THPT Nam Lý",
    department_edu: "Sở GD&ĐT Hà Nam",
    province: "Hà Nam",
    province_name: "Huyện Lý Nhân",
    school_address: "Xã Tiến Thắng, Lý Nhân"
  },
  {
    school_name: "Trường THPT Dân lập Trần Hưng Đạo",
    department_edu: "Sở GD&ĐT Hà Nam",
    province: "Hà Nam",
    province_name: "Huyện Lý Nhân",
    school_address: "TTr. Vĩnh Trụ, Lý Nhân"
  },
  {
    school_name: "Trường THPT Nam Cao",
    department_edu: "Sở GD&ĐT Hà Nam",
    province: "Hà Nam",
    province_name: "Huyện Lý Nhân",
    school_address: "Xã Nhân Mỹ, Lý Nhân"
  },
  {
    school_name: "Trường THPT A Thanh Liêm",
    department_edu: "Sở GD&ĐT Hà Nam",
    province: "Hà Nam",
    province_name: "Huyện Thanh Liêm",
    school_address: "X.Liêm Thuận, Thanh Liêm"
  },
  {
    school_name: "Trường THPT B Thanh Liêm",
    department_edu: "Sở GD&ĐT Hà Nam",
    province: "Hà Nam",
    province_name: "Huyện Thanh Liêm",
    school_address: "Thanh Nguyên, Thanh Liêm"
  },
  {
    school_name: "Trường THPT Dân lập Thanh Liêm",
    department_edu: "Sở GD&ĐT Hà Nam",
    province: "Hà Nam",
    province_name: "Huyện Thanh Liêm",
    school_address: "Xã Thanh Lưu, Thanh Liêm"
  },
  {
    school_name: "Trường THPT C Thanh Liêm",
    department_edu: "Sở GD&ĐT Hà Nam",
    province: "Hà Nam",
    province_name: "Huyện Thanh Liêm",
    school_address: "Xã Thanh Thuỷ, Thanh Liêm"
  },
  {
    school_name: "Trường THPT Lê Hoàn",
    department_edu: "Sở GD&ĐT Hà Nam",
    province: "Hà Nam",
    province_name: "Huyện Thanh Liêm",
    school_address: "Xã Liêm Cần, Thanh Liêm"
  },
  {
    school_name: "Trường THPT A Bình Lục",
    department_edu: "Sở GD&ĐT Hà Nam",
    province: "Hà Nam",
    province_name: "Huyện Bình Lục",
    school_address: "TTr. Bình Mỹ, Bình Lục"
  },
  {
    school_name: "Trường THPT B Bình Lục",
    department_edu: "Sở GD&ĐT Hà Nam",
    province: "Hà Nam",
    province_name: "Huyện Bình Lục",
    school_address: "Xã Vũ Bản , Bình Lục"
  },
  {
    school_name: "Trường THPT C Bình Lục",
    department_edu: "Sở GD&ĐT Hà Nam",
    province: "Hà Nam",
    province_name: "Huyện Bình Lục",
    school_address: "Xã Tràng An, Bình Lục"
  },
  {
    school_name: "Trường THPT Dân lập Bình Lục",
    department_edu: "Sở GD&ĐT Hà Nam",
    province: "Hà Nam",
    province_name: "Huyện Bình Lục",
    school_address: "TTr. Bình Mỹ, Bình Lục"
  },
  {
    school_name: "Trường THPT Nguyễn Khuyến",
    department_edu: "Sở GD&ĐT Hà Nam",
    province: "Hà Nam",
    province_name: "Huyện Bình Lục",
    school_address: "Xã Tiêu Động, Bình Lục"
  },

  {
    school_name: "Trường THPT Đào Duy Từ",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Thành phố Thanh Hóa",
    school_address: "P. Ba Đình, TP Thanh Hóa"
  },
  {
    school_name: "Trường THPT Hàm Rồng",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Thành phố Thanh Hóa",
    school_address: "P. Trường Thi,TP Thanh Hoá"
  },
  {
    school_name: "Trường THPT Nguyễn Trãi",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Thành phố Thanh Hóa",
    school_address: "P. Điện Biên, TP Thanh Hoá"
  },
  {
    school_name: "Trường THPT Tô Hiến Thành",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Thành phố Thanh Hóa",
    school_address: "P.Đông Sơn, TP Thanh Hoá"
  },
  {
    school_name: "Trường THPT Trường Thi",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Thành phố Thanh Hóa",
    school_address: "P. Trường Thi, TP Thanh Hoá"
  },
  {
    school_name: "Trường THPT Lý Thường Kiệt",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Thành phố Thanh Hóa",
    school_address: "P. Đông sơn, TP Thanh Hoá"
  },
  {
    school_name: "Trường THPT Đào Duy Anh",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Thành phố Thanh Hóa",
    school_address: "P. Ngọc Trạo, TP Thanh Hoá"
  },
  {
    school_name: "Trường THPT Dân Tộc Nội trú tỉnh TH",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Thành phố Thanh Hóa",
    school_address: "P. Đông Sơn, TP Thanh Hoá"
  },
  {
    school_name: "Trường THPT Chuyên Lam Sơn",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Thành phố Thanh Hóa",
    school_address: "P. Ba Đình, TP Thanh Hoá"
  },
  {
    school_name: "Trường THPT Đông Sơn",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Thành phố Thanh Hóa",
    school_address: "Xã Đông Tân, TP Thanh Hóa"
  },
  {
    school_name: "Trường THPT Nguyễn Huệ",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Thành phố Thanh Hóa",
    school_address: "Xã Quảng Đông, TP Thanh Hóa"
  },
  {
    school_name: "Trường THPT Bỉm Sơn",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Thị xã Bỉm Sơn",
    school_address: "P. Ba Đình, Thị xã Bỉm Sơn"
  },
  {
    school_name: "Trường THPT Lê Hồng Phong",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Thị xã Bỉm Sơn",
    school_address: "P. Lam Sơn, Thị xã Bỉm Sơn"
  },
  {
    school_name: "Trường THPT Sầm Sơn",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Thị xã Sầm Sơn",
    school_address: "P. Trường Sơn,Thị xã Sầm Sơn"
  },
  {
    school_name: "Trường THPT Nguyễn Thị Lợi",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Thị xã Sầm Sơn",
    school_address: "P. Trung Sơn, Thị xã Sầm Sơn"
  },
  {
    school_name: "Trường THPT Quan Hoá",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Quan Hoá",
    school_address: "Thị trấn Quan Hoá"
  },
  {
    school_name: "Trường THPT Quan Sơn",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Quan Sơn",
    school_address: "Thị trấn Quan Sơn"
  },
  {
    school_name: "Trường THPT Quan Sơn 2",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Quan Sơn",
    school_address: "Xã Mường Mìn - H. Quan Sơn"
  },
  {
    school_name: "Trường THPT Mường Lát",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Thị trấn Mường Lát",
    school_address: "Thị trấn Mườg Lát"
  },
  {
    school_name: "Trường THPT Bá Thước",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Bá Thước",
    school_address: "Thị trấn Cành Nàng, Bá Thước"
  },
  {
    school_name: "Trường THPT Hà Văn Mao",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Bá Thước",
    school_address: "Xã Điền Trung, Bá Thước"
  },
  {
    school_name: "Trường THPT Bá Thước 3",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Bá Thước",
    school_address: "Xã Lũng Niên, Bá Thước"
  },
  {
    school_name: "Trường THPT Cầm Bá Thước",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Thường Xuân",
    school_address: "Thị trấn Thường Xuân"
  },
  {
    school_name: "Trường THPT Thường Xuân 2",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Thường Xuân",
    school_address: "Xã Luận Thành, Thường Xuân"
  },
  {
    school_name: "Trường THPT Thường Xuân 3",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Thường Xuân",
    school_address: "Xã Vạn Xuân, Thường Xuân"
  },
  {
    school_name: "Trường THPT Như Xuân",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Như Xuân",
    school_address: "Thị trấn Yên Cát, Như Xuân"
  },
  {
    school_name: "Trường THPT Như Xuân 2",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Như Xuân",
    school_address: "Xã Bãi Thành, Như Xuân"
  },
  {
    school_name: "Trường THPT Như Thanh",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Như Thanh",
    school_address: "Thị trấn Bến Sung, Như Thanh"
  },
  {
    school_name: "Trường THPT Như Thanh 2",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Như Thanh",
    school_address: "Thị trấn Bến Sung, Như Thanh"
  },
  {
    school_name: "Trường THPT Lang Chánh",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Lang Chánh",
    school_address: "Thị trấn Lang Chánh"
  },
  {
    school_name: "Trường THPT Ngọc Lặc",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Ngọc Lặc",
    school_address: "Thị trấn Ngọc Lặc"
  },
  {
    school_name: "Trường THPT Lê Lai",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Ngọc Lặc",
    school_address: "Xã Kiên Thọ, Ngọc Lặc"
  },
  {
    school_name: "Trường THPT Bắc Sơn",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Ngọc Lặc",
    school_address: "Xã Ngọc Liên, Ngọc Lặc"
  },
  {
    school_name: "Trường THPT Thạch Thành 1",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Thạch Thành ",
    school_address: "Xã Thành Thọ, Thạch Thành"
  },
  {
    school_name: "Trường THPT Thạch Thành 2",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Thạch Thành ",
    school_address: "Xã Thạch Tân, Thạch Thành"
  },
  {
    school_name: "Trường THPT Thạch Thành 3",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Thạch Thành ",
    school_address: "Xã Thành Vân, Thạch Thành"
  },
  {
    school_name: "Trường THPT Thạch Thành 4",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Thạch Thành ",
    school_address: "Xã Thạch Quảng, Thạch Thành"
  },
  {
    school_name: "Trường THPT Cẩm Thuỷ 1",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Cẩm Thuỷ ",
    school_address: "Thị trấn Cẩm Thuỷ"
  },
  {
    school_name: "Trường THPT Cẩm Thuỷ 2",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Cẩm Thuỷ ",
    school_address: "Xã Phúc Do, Cẩm Thuỷ"
  },
  {
    school_name: "Trường THPT Cẩm Thuỷ 3",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Cẩm Thuỷ ",
    school_address: "Xã Cẩm Thạch, Cẩm Thuỷ"
  },
  {
    school_name: "Trường THPT Lê Lợi",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Thọ Xuân",
    school_address: "Thị Trấn Thọ Xuân"
  },
  {
    school_name: "Trường THPT Lê Hoàn",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Thọ Xuân",
    school_address: "Xã Xuân Lai, Thọ Xuân"
  },
  {
    school_name: "Trường THPT Lam Kinh",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Thọ Xuân",
    school_address: "Thị Trấn Lam Sơn, Thọ Xuân"
  },
  {
    school_name: "Trường THPT Thọ Xuân 4",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Thọ Xuân",
    school_address: "Xã Thọ Lập, Thọ Xuân"
  },
  {
    school_name: "Trường THPT Lê Văn Linh",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Thọ Xuân",
    school_address: "Thị trấn Thọ Xuân"
  },
  {
    school_name: "Trường THPT Thọ Xuân 5",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Thọ Xuân ",
    school_address: "Thôn 385 Xã Thọ Xương"
  },
  {
    school_name: "Trường THPT Vĩnh Lộc",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Vĩnh Lộc",
    school_address: "Thị Trấn Vĩnh Lộc"
  },
  {
    school_name: "Trường THPT Tống Duy Tân",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Vĩnh Lộc",
    school_address: "Xã Vĩnh Tân, Vĩnh Lộc"
  },
  {
    school_name: "Trường THPT Trần Khát Chân",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Vĩnh Lộc",
    school_address: "Thị trấn Vĩnh Lộc"
  },
  {
    school_name: "Trường THPT Thiệu Hoá",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Thiệu Hoá",
    school_address: "Thị Trấn Vạn Hà, Thiệu Hoá"
  },
  {
    school_name: "Trường THPT Nguyễn Quán Nho",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Thiệu Hoá",
    school_address: "Xã Thiệu Quang, Thiệu Hoá"
  },
  {
    school_name: "Trường THPT Lê Văn Hưu",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Thiệu Hoá",
    school_address: "Xã Thiệu Vận, Thiệu Hoá"
  },
  {
    school_name: "Trường THPT Triệu Sơn 1",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Triệu Sơn ",
    school_address: "Thị trấn, Triệu Sơn"
  },
  {
    school_name: "Trường THPT Triệu Sơn 2",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Triệu Sơn ",
    school_address: "Xã Nông Trường, Triệu Sơn"
  },
  {
    school_name: "Trường THPT Triệu Sơn 3",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Triệu Sơn ",
    school_address: "Xã Hợp Lý, Triệu Sơn"
  },
  {
    school_name: "Trường THPT Triệu Sơn 4",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Triệu Sơn ",
    school_address: "Xã Thọ Dân, Triệu Sơn"
  },
  {
    school_name: "Trường THPT Triệu Sơn 5",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Triệu Sơn ",
    school_address: "Xã Đồng Lợi, Triệu Sơn"
  },
  {
    school_name: "Trường THPT Triệu Sơn 6",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Triệu Sơn ",
    school_address: "Dân Lực, Triệu Sơn"
  },
  {
    school_name: "Trường THPT Triệu Sơn",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Triệu Sơn",
    school_address: "Thị Trấn Triệu sơn"
  },
  {
    school_name: "Trường THPT Nông Cống 1",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Nông Cống ",
    school_address: "Thị Trấn Nông Cống"
  },
  {
    school_name: "Trường THPT Nông Cống 2",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Nông Cống ",
    school_address: "Xã Trung Thành, Nông Cống"
  },
  {
    school_name: "Trường THPT Nông Cống 3",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Nông Cống ",
    school_address: "Xã Công Liêm, Nông Cống"
  },
  {
    school_name: "Trường THPT Nông Cống 4",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Nông Cống ",
    school_address: "Xã Trường Sơn, N. Cống"
  },
  {
    school_name: "Trường THPT Triệu Thị Trinh",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Nông Cống ",
    school_address: "Xã Vạn Hòa, Nông Cống"
  },
  {
    school_name: "Trường THPT Nông Cống",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Nông Cống",
    school_address: "Xã Trung Chính, Nông Cống"
  },
  {
    school_name: "Trường THPT Đông Sơn 1",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Đông Sơn ",
    school_address: "Xã Đông Xuân, Đông Sơn"
  },
  {
    school_name: "Trường THPT Đông Sơn 2",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Đông Sơn ",
    school_address: "Xã Đông Văn, Đông Sơn"
  },
  {
    school_name: "Trường THPT Nguyễn Mộng Tuân",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Đông Sơn ",
    school_address: "Thị Trấn Rừng Thông, Đông Sơn"
  },
  {
    school_name: "Trường THPT Hà Trung",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Hà Trung",
    school_address: "Xã Hà Bình, Hà Trung"
  },
  {
    school_name: "Trường THPT Hoàng Lệ Kha",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Hà Trung",
    school_address: "Thị Trấn Hà Trung"
  },
  {
    school_name: "Trường THPT Nguyễn Hoàng",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Hà Trung",
    school_address: "Thị Trấn Hà Trung"
  },
  {
    school_name: "Trường THPT Lương Đắc Bằng",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Hoằng Hóa",
    school_address: "Thị Trấn Bút Sơn, Hoằng Hoá"
  },
  {
    school_name: "Trường THPT Hoằng Hoá 2",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Hoằng Hóa",
    school_address: "Xã Hoằng Kim, Hoằng Hoá"
  },
  {
    school_name: "Trường THPT Hoằng Hoá 3",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Hoằng Hóa",
    school_address: "Xã Hoằng Ngọc, Hoằng Hoá"
  },
  {
    school_name: "Trường THPT Hoằng Hoá 4",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Hoằng Hóa",
    school_address: "Xã Hoằng Thành, Hoằng Hoá"
  },
  {
    school_name: "Trường THPT Lưu Đình Chất",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Hoằng Hóa",
    school_address: "Xã Hoằng Quỳ, Hoằng Hoá"
  },
  {
    school_name: "Trường THPT Lê Viết Tạo",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Hoằng Hóa",
    school_address: "Xã Hoằng Đạo, Hoằng Hoá"
  },
  {
    school_name: "Trường THPT Hoằng Hoá",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Hoằng Hóa",
    school_address: "Xã Hoằng Ngọc - Hoằng Hoá"
  },
  {
    school_name: "Trường THPT Ba Đình",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Nga Sơn",
    school_address: "Thị Trấn Nga Sơn"
  },
  {
    school_name: "Trường THPT Mai Anh Tuấn",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Nga Sơn",
    school_address: "Xã Nga Thành, Nga Sơn"
  },
  {
    school_name: "Trường THPT Trần Phú",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Nga Sơn",
    school_address: "Thị Trấn Nga sơn"
  },
  {
    school_name: "Trường THPT Nga Sơn",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Nga Sơn",
    school_address: "Xã Nga Trung, Nga Sơn"
  },
  {
    school_name: "Trường THPT Hậu Lộc 1",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Hậu Lộc ",
    school_address: "Xã Phú Lộc, Hậu lộc"
  },
  {
    school_name: "Trường THPT Hậu Lộc 2",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Hậu Lộc ",
    school_address: "Xã Văn Lộc, Hậu Lộc"
  },
  {
    school_name: "Trường THPT Đinh Chương Dương",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Hậu Lộc ",
    school_address: "Thị Trấn Hậu Lộc"
  },
  {
    school_name: "Trường THPT Hậu Lộc 3",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Hậu Lộc ",
    school_address: "Xã Đại Lộc, Hậu Lộc"
  },
  {
    school_name: "Trường THPT Hậu Lộc 4",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Hậu Lộc ",
    school_address: "Xã Hưng Lộc, Hậu Lộc"
  },
  {
    school_name: "Trường THPT Quảng Xương 1",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Quảng Xương",
    school_address: "Thị Trấn Quảng Xương"
  },
  {
    school_name: "Trường THPT Quảng Xương 2",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Quảng Xương",
    school_address: "Xã Quảng Ngọc, Quảng Xương"
  },
  {
    school_name: "Trường THPT Quảng Xương 3",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Quảng Xương",
    school_address: "Xã Quảng Minh, Quảng Xương"
  },
  {
    school_name: "Trường THPT Quảng Xương 4",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Quảng Xương",
    school_address: "Xã Quảng Lợi, Quảng Xương"
  },
  {
    school_name: "Trường THPT Nguyễn Xuân Nguyên",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Quảng Xương",
    school_address: "Xã Quảng Giao, Quảng Xương"
  },
  {
    school_name: "Trường THPT Đặng Thai Mai",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Quảng Xương",
    school_address: "Xã Quảng Bình, Quảng Xương"
  },
  {
    school_name: "Trường THPT Tĩnh Gia 1",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Tĩnh Gia ",
    school_address: "Thị Trấn Tĩnh Gia"
  },
  {
    school_name: "Trường THPT Tĩnh Gia 2",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Tĩnh Gia ",
    school_address: "Xã Triêu Dương, Tĩnh Gia"
  },
  {
    school_name: "Trường THPT Tĩnh Gia 3",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Tĩnh Gia ",
    school_address: "Xã Hải Yến, Tĩnh Gia"
  },
  {
    school_name: "Trường THPT Tĩnh Gia 5",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Tĩnh Gia ",
    school_address: "Thị Trấn Tĩnh Gia"
  },
  {
    school_name: "Trường THPT Tĩnh Gia 4",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Tĩnh Gia ",
    school_address: "Hải An, Tĩnh Gia"
  },
  {
    school_name: "Trường THPT Yên Định 1",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Yên Định ",
    school_address: "Thị Trấn Quán Lào, Yên Định"
  },
  {
    school_name: "Trường THPT Yên Định 2",
    department_edu: "Sở GD&ĐT Thanh Hóa",
    province: "Thanh Hóa",
    province_name: "Huyện Yên Định ",
    school_address: "Xã Yên Trường, Yên Định"
  },

  {
    school_name: "Trường THPT số 1 Bắc Hà",
    department_edu: "Sở GD&ĐT Lào Cai",
    province: "Lào Cai",
    province_name: "Huyện Bắc Hà",
    school_address: "TTr. Bắc Hà -H Bắc Hà"
  },
  {
    school_name: "Trường THPT số 2 Bắc Hà",
    department_edu: "Sở GD&ĐT Lào Cai",
    province: "Lào Cai",
    province_name: "Huyện Bắc Hà",
    school_address: "Xã Bảo Nhai -H Bắc Hà"
  },
  {
    school_name: "Trường THPT Số 1 Sa Pa",
    department_edu: "Sở GD&ĐT Lào Cai",
    province: "Lào Cai",
    province_name: "Huyện SaPa",
    school_address: "TTr. Sa Pa -H Sa Pa"
  },
  {
    school_name: "Trường THPT số 2 Sa Pa",
    department_edu: "Sở GD&ĐT Lào Cai",
    province: "Lào Cai",
    province_name: "Huyện SaPa",
    school_address: "Xã Bản Hồ -H Sa Pa"
  },
  {
    school_name: "Trường THPT Số 1 Bát Xát",
    department_edu: "Sở GD&ĐT Lào Cai",
    province: "Lào Cai",
    province_name: "Huyện Bát Xát",
    school_address: "TTr. Bát Xát -H Bát Xát"
  },
  {
    school_name: "Trường THPT Số 2 Bát Xát",
    department_edu: "Sở GD&ĐT Lào Cai",
    province: "Lào Cai",
    province_name: "Huyện Bát Xát",
    school_address: "Xã Bản Vược – H Bát Xát"
  },
  {
    school_name: "Trường THPT Số 1 Si Ma Cai",
    department_edu: "Sở GD&ĐT Lào Cai",
    province: "Lào Cai",
    province_name: "Huyện Si Ma Cai",
    school_address: "Xã Si Ma Cai -H Si Ma Cai"
  },
  {
    school_name: "Trường THPT Số 2 Si ma cai",
    department_edu: "Sở GD&ĐT Lào Cai",
    province: "Lào Cai",
    province_name: "Huyện Si Ma Cai",
    school_address: "Xã Sín Chéng – H Si ma cai"
  },
  {
    school_name: "Trường THPT số 1 Bảo Thắng",
    department_edu: "Sở GD&ĐT Lào Cai",
    province: "Lào Cai",
    province_name: "Huyện Bảo Thắng",
    school_address: "TTr. Phố Lu -H Bảo Thắng"
  },
  {
    school_name: "Trường THPT số 2 Bảo Thắng",
    department_edu: "Sở GD&ĐT Lào Cai",
    province: "Lào Cai",
    province_name: "Huyện Bảo Thắng",
    school_address: "Xã Xuân Giao -H Bảo Thắng"
  },
  {
    school_name: "Trường THPT số 3 Bảo Thắng",
    department_edu: "Sở GD&ĐT Lào Cai",
    province: "Lào Cai",
    province_name: "Huyện Bảo Thắng",
    school_address: "TTr. Phong Hải -H Bảo Thắng"
  },
  {
    school_name: "Trường THPT số 1 Văn Bàn",
    department_edu: "Sở GD&ĐT Lào Cai",
    province: "Lào Cai",
    province_name: "Huyện Văn Bàn",
    school_address: "TTr. Khánh Yên -H Văn Bàn"
  },
  {
    school_name: "Trường THPT số 2 Văn Bàn",
    department_edu: "Sở GD&ĐT Lào Cai",
    province: "Lào Cai",
    province_name: "Huyện Văn Bàn",
    school_address: "Xã Võ Lao -H Văn Bàn"
  },
  {
    school_name: "Trường THPT số 3 Văn Bàn",
    department_edu: "Sở GD&ĐT Lào Cai",
    province: "Lào Cai",
    province_name: "Huyện Văn Bàn",
    school_address: "Xã Dương Quỳ -H Văn Bàn"
  },
  {
    school_name: "Trường THPT số 4 Văn Bàn",
    department_edu: "Sở GD&ĐT Lào Cai",
    province: "Lào Cai",
    province_name: "Huyện Văn Bàn",
    school_address: "Khánh Yên Hạ, H. Văn Bàn"
  },
  {
    school_name: "Trường THPT số 1 Tp Lào Cai",
    department_edu: "Sở GD&ĐT Lào Cai",
    province: "Lào Cai",
    province_name: "Thành phố Lào Cai",
    school_address: "Ph. Cốc Lếu -Tp Lào Cai"
  },
  {
    school_name: "Trường THPT số 2 Tp Lào Cai",
    department_edu: "Sở GD&ĐT Lào Cai",
    province: "Lào Cai",
    province_name: "Thành phố Lào Cai",
    school_address: "Ph. Bình Minh - T.p Lào Cai"
  },
  {
    school_name: "Trường THPT số 3 Tp Lào Cai",
    department_edu: "Sở GD&ĐT Lào Cai",
    province: "Lào Cai",
    province_name: "Thành phố Lào Cai",
    school_address: "Ph. Duyên Hải -Tp Lào Cai"
  },
  {
    school_name: "Trường THPT số 4 Tp Lào Cai",
    department_edu: "Sở GD&ĐT Lào Cai",
    province: "Lào Cai",
    province_name: "Thành phố Lào Cai",
    school_address: "Xã Cam Đường -Tp Lào Cai"
  },
  {
    school_name: "Trường THPT DTNT tỉnh",
    department_edu: "Sở GD&ĐT Lào Cai",
    province: "Lào Cai",
    province_name: "Thành phố Lào Cai",
    school_address: "Ph. Kim Tân -Tp Lào Cai"
  },
  {
    school_name: "Trường THPT Chuyên tỉnh Lào Cai",
    department_edu: "Sở GD&ĐT Lào Cai",
    province: "Lào Cai",
    province_name: "Thành phố Lào Cai",
    school_address: "Đường M9, Ph. Bắc Cường - T.p Lào Cai"
  },
  {
    school_name: "Trường THPT số 1 Bảo Yên",
    department_edu: "Sở GD&ĐT Lào Cai",
    province: "Lào Cai",
    province_name: "Huyện Bảo Yên",
    school_address: "TTr. Phố Ràng -H Bảo Yên"
  },
  {
    school_name: "Trường THPT số 2 Bảo Yên",
    department_edu: "Sở GD&ĐT Lào Cai",
    province: "Lào Cai",
    province_name: "Huyện Bảo Yên",
    school_address: "Xã Bảo Hà -H Bảo Yên"
  },
  {
    school_name: "Trường THPT số 3 Bảo Yên",
    department_edu: "Sở GD&ĐT Lào Cai",
    province: "Lào Cai",
    province_name: "Huyện Bảo Yên",
    school_address: "Xã Nghĩa Đô -H Bảo Yên"
  },
  {
    school_name: "Trường THPT số 1 Mường Khương",
    department_edu: "Sở GD&ĐT Lào Cai",
    province: "Lào Cai",
    province_name: "Huyện Mường Khương",
    school_address: "TTr. Mường Khương -H Mường Khương"
  },
  {
    school_name: "Trường THPT số 2 Mường Khương",
    department_edu: "Sở GD&ĐT Lào Cai",
    province: "Lào Cai",
    province_name: "Huyện Mường Khương",
    school_address: "Xã Bản Lầu -H Mường Khương"
  },
  {
    school_name: "Trường THPT số 3 Mường Khương",
    department_edu: "Sở GD&ĐT Lào Cai",
    province: "Lào Cai",
    province_name: "Huyện Mường Khương",
    school_address: "xã Cao Sơn, H Mường Khương"
  },

  {
    school_name: "Trường THPT Nguyễn Trãi",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Thành phố Hải Dương",
    school_address: "P.Tân Bình,TP.Hải Dương"
  },
  {
    school_name: "Trường THPT Hồng Quang",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Thành phố Hải Dương",
    school_address: "P. Trần Phú, TP. Hải Dương"
  },
  {
    school_name: "Trường THPT Nguyễn Du",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Thành phố Hải Dương",
    school_address: "P.Tân Bình,TP.Hải Dương"
  },
  {
    school_name: "Trường THPT Hoàng Văn Thụ",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Thành phố Hải Dương",
    school_address: "P. Ngọc Châu, TP. Hải Dương"
  },
  {
    school_name: "Trường THPT Nguyễn Bỉnh Khiêm",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Thành phố Hải Dương",
    school_address: "P. Quang Trung, TP. Hải Dương"
  },
  {
    school_name: "Trường THPT Thành Đông",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Thành phố Hải Dương",
    school_address: "P. Lê Thanh Nghị, TP. Hải Dương"
  },
  {
    school_name: "Trường THPT ái Quốc",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Thành phố Hải Dương",
    school_address: "Xã ái Quốc, TP. Hải Dương"
  },
  {
    school_name: "Trường THPT Lương Thế Vinh",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Thành phố Hải Dương",
    school_address: "Xã Thạch Khôi, TP.Hải Dương"
  },
  {
    school_name: "Trường THPT Marie Curie",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Thành phố Hải Dương",
    school_address: "Phường Hải Tân, TP.Hải Dương"
  },
  {
    school_name: "Trường THPT Chí Linh",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Thị xã Chí Linh",
    school_address: "Phường Sao Đỏ, TX. Chí Linh"
  },
  {
    school_name: "Trường THPT Phả Lại",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Thị xã Chí Linh",
    school_address: "Phường Phả Lại, TX.Chí Linh"
  },
  {
    school_name: "Trường THPT Trần Phú",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Thị xã Chí Linh",
    school_address: "Phường Sao Đỏ, TX. Chí Linh"
  },
  {
    school_name: "Trường THPT Bến Tắm",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Thị xã Chí Linh",
    school_address: "Phường Bến Tắm, TX. Chí Linh"
  },
  {
    school_name: "Trường THPT Nam Sách",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Nam Sách",
    school_address: "TT Nam Sách, H. Nam Sách"
  },
  {
    school_name: "Trường THPT Mạc Đĩnh Chi",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Nam Sách",
    school_address: "Xã Thanh Quang, H. Nam Sách"
  },
  {
    school_name: "Trường THPT Nam Sách II",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Nam Sách",
    school_address: "Xã An Lâm, H. Nam Sách"
  },
  {
    school_name: "Trường THPT Phan Bội Châu",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Nam Sách",
    school_address: "Thị trấn Nam Sách, H. Nam Sách"
  },
  {
    school_name: "Trường THPT Kinh Môn",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Kinh Môn",
    school_address: "TT Kinh Môn, H. Kinh Môn"
  },
  {
    school_name: "Trường THPT Nhị Chiểu",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Kinh Môn",
    school_address: "TT Phú Thứ, H. Kinh Môn"
  },
  {
    school_name: "Trường THPT Phúc Thành",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Kinh Môn",
    school_address: "Xã Phúc Thành, H. Kinh Môn"
  },
  {
    school_name: "Trường THPT Kinh Môn II",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Kinh Môn",
    school_address: "Xã Hiệp Sơn, H. Kinh Môn"
  },
  {
    school_name: "Trường THPT Trần Quang Khải",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Kinh Môn",
    school_address: "Phú Thứ, H. Kinh Môn"
  },
  {
    school_name: "Trường THPT Quang Thành",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Kinh Môn",
    school_address: "Xã Phúc Thành, H. Kinh Môn"
  },
  {
    school_name: "Trường THPT Gia Lộc",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Gia Lộc",
    school_address: "TT Gia Lộc, H. Gia Lộc"
  },
  {
    school_name: "Trường THPT Đoàn Thượng",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Gia Lộc",
    school_address: "Xã Đoàn Thượng, H. Gia Lộc"
  },
  {
    school_name: "Trường THPT Gia Lộc II",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Gia Lộc",
    school_address: "TT Gia Lộc, H. Gia Lộc"
  },
  {
    school_name: "Trường THPT Tứ Kỳ",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Tứ Kỳ",
    school_address: "TT Tứ Kỳ, H. Tứ Kỳ"
  },
  {
    school_name: "Trường THPT Cầu Xe",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Tứ Kỳ",
    school_address: "Xã Cộng Lạc, H. Tứ Kỳ"
  },
  {
    school_name: "Trường THPT Hưng Đạo",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Tứ Kỳ",
    school_address: "Xã Hưng Đạo, H. Tứ Kỳ"
  },
  {
    school_name: "Trường THPT Tứ Kỳ II",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Tứ Kỳ",
    school_address: "Thị trấn Tứ Kỳ-H. Tứ Kỳ"
  },
  {
    school_name: "Trường THPT Thanh Miện",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Thanh Miện",
    school_address: "TT Thanh Miện, H. Thanh Miện"
  },
  {
    school_name: "Trường THPT Thanh Miện II",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Thanh Miện",
    school_address: "Xã Hồng Quang, H. Thanh Miện"
  },
  {
    school_name: "Trường THPT Thanh Miện III",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Thanh Miện",
    school_address: "Xã Ngũ Hùng, H. Thanh Miện"
  },
  {
    school_name: "Trường THPT Lê Quý Đôn",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Thanh Miện",
    school_address: "Đoàn Tùng, Thanh Miện"
  },
  {
    school_name: "Trường THPT Ninh Giang",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Ninh Giang",
    school_address: "TT Ninh Giang, H. Ninh Giang"
  },
  {
    school_name: "Trường THPT Quang Trung",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Ninh Giang",
    school_address: "Xã Văn Hội, H. Ninh Giang"
  },
  {
    school_name: "Trường THPT Khúc Thừa Dụ",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Ninh Giang",
    school_address: "Xã Tân Hương, H. Ninh Giang"
  },
  {
    school_name: "Trường THPT Ninh Giang II",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Ninh Giang",
    school_address: "TT Ninh Giang, H. Ninh Giang"
  },
  {
    school_name: "Trường THPT Hồng Đức",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Ninh Giang",
    school_address: "Xã Hồng Đức, H. Ninh Giang"
  },
  {
    school_name: "Trường THPT Cẩm Giàng",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Cẩm Giàng",
    school_address: "Xã Tân Trường, H. Cẩm Giàng"
  },
  {
    school_name: "Trường THPT Tuệ Tĩnh",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Cẩm Giàng",
    school_address: "Xã Cẩm Vũ, H. Cẩm Giàng"
  },
  {
    school_name: "Trường THPT Cẩm Giàng II",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Cẩm Giàng",
    school_address: "Xã Tân Trường, H. Cẩm Giàng"
  },
  {
    school_name: "Trường THPT Thanh Hà",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Thanh Hà",
    school_address: "TT Thanh Hà, H. Thanh Hà"
  },
  {
    school_name: "Trường THPT Hà Đông",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Thanh Hà",
    school_address: "Xã Thanh Cường, H. Thanh Hà"
  },
  {
    school_name: "Trường THPT Hà Bắc",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Thanh Hà",
    school_address: "Xã Cẩm Chế, H. Thanh Hà"
  },
  {
    school_name: "Trường THPT Thanh Bình",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Thanh Hà",
    school_address: "TT Thanh Hà, H. Thanh Hà"
  },
  {
    school_name: "Trường THPT Kim Thành",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Kim Thành",
    school_address: "TT Phú Thái, H. Kim Thành"
  },
  {
    school_name: "Trường THPT Đồng Gia",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Kim Thành",
    school_address: "Xã Đồng Gia, H. Kim Thành"
  },
  {
    school_name: "Trường THPT Kim Thành II",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Kim Thành",
    school_address: "Xã Kim Anh, H. Kim Thành"
  },
  {
    school_name: "Trường THPT Phú Thái",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Kim Thành",
    school_address: "Phúc Thành-H. Kim Thành"
  },
  {
    school_name: "Trường THPT Bình Giang",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Bình Giang",
    school_address: "Xã Thái Học, H. Bình Giang"
  },
  {
    school_name: "Trường THPT Kẻ Sặt",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Bình Giang",
    school_address: "Tráng Liệt, H. Bình Giang"
  },
  {
    school_name: "Trường THPT Đường An",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Bình Giang",
    school_address: "Xã Bình Minh, H. Bình Giang"
  },
  {
    school_name: "Trường THPT Vũ Ngọc Phan",
    department_edu: "Sở GD&ĐT Hải Dương",
    province: "Hải Dương",
    province_name: "Huyện Bình Giang",
    school_address: "TT Kẻ Sặt, H.Bình Giang"
  },

  {
    school_name: "Trường THPT chuyên Lê Hồng Phong",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Thành phố Nam Định",
    school_address: "Đường Vỵ Xuyên, Tp NĐ"
  },
  {
    school_name: "Trường THPT Trần Hưng Đạo",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Thành phố Nam Định",
    school_address: "75\/203 đường Trần Thái Tông,TP Nam Định"
  },
  {
    school_name: "Trường THPT Nguyễn Khuyến",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Thành phố Nam Định",
    school_address: "Nguyễn Du, Tp NĐ"
  },
  {
    school_name: "Trường THPT Nguyễn Huệ",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Thành phố Nam Định",
    school_address: "Đường Nguyễn Văn Trỗi, Tp NĐ"
  },
  {
    school_name: "Trường THPT Nguyễn Công Trứ",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Thành phố Nam Định",
    school_address: "Đường Bến Ngự, Tp NĐ"
  },
  {
    school_name: "Trường THPT Trần Quang Khải",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Thành phố Nam Định",
    school_address: "176 Phan Đình Phùng, tp NĐ"
  },
  {
    school_name: "Trường THPT DL Trần Nhật Duật",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Thành phố Nam Định",
    school_address: "Ngõ 253 đường Hưng Yên, Tp Nam Định"
  },
  {
    school_name: "Trường THPT Hùng Vương",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Vụ Bản",
    school_address: "Xã Đại An, H. Vụ Bản, NĐ"
  },
  {
    school_name: "Trường THPT Mỹ Lộc",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Mỹ Lộc",
    school_address: "Km5, QL 21 Mỹ Hưng Mỹ Lộc Nam Định"
  },
  {
    school_name: "Trường THPT Trần Văn Lan",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Mỹ Lộc",
    school_address: "Đệ Nhất, xã Mỹ Trung, H. Mỹ Lộc"
  },
  {
    school_name: "Trường THPT Xuân Trường A",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Xuân Trường",
    school_address: "Xã Xuân Hồng, H. Xuân Trường"
  },
  {
    school_name: "Trường THPT Xuân Trường B",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Xuân Trường",
    school_address: "TT Xuân Trường, H. Xuân Trường"
  },
  {
    school_name: "Trường THPT Xuân Trường C",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Xuân Trường",
    school_address: "Xã Xuân Đài, H. Xuân Trường"
  },
  {
    school_name: "Trường THPT Cao Phong",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Xuân Trường",
    school_address: "Xã Xuân Thượng, H.Xuân Trường"
  },
  {
    school_name: "Trường THPT Nguyễn Trường Thuý",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Xuân Trường",
    school_address: "Xã Xuân Vinh, H. Xuân Trường"
  },
  {
    school_name: "Trường THPT Giao Thủy",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Giao Thủy",
    school_address: "TT. Ngô Đồng, H. Giao Thuỷ"
  },
  {
    school_name: "Trường THPT Giao Thuỷ B",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Giao Thủy",
    school_address: "Xã Giao Yến, H. Giao Thuỷ"
  },
  {
    school_name: "Trường THPT Giao Thuỷ C",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Giao Thủy",
    school_address: "Xã Hồng Thuận, H. Giao Thuỷ"
  },
  {
    school_name: "Trường THPT Thiên Trường",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Giao Thủy",
    school_address: "Xã Hoành Sơn, H. Giao Thuỷ"
  },
  {
    school_name: "Trường THPT Quất Lâm",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Giao Thủy",
    school_address: "TTr. Quất Lâm, H. Giao Thuỷ"
  },
  {
    school_name: "Trường THPT Tống Văn Trân",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Ý Yên",
    school_address: "TT. Lâm, H. Ý Yên"
  },
  {
    school_name: "Trường THPT Phạm Văn Nghị",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Ý Yên",
    school_address: "Xã Yên Cường, H. Ý Yên"
  },
  {
    school_name: "Trường THPT Mỹ Tho",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Ý Yên",
    school_address: "Xã Yên Chính, H. Ý Yên"
  },
  {
    school_name: "Trường THPT Ý Yên",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Ý Yên",
    school_address: "Xã Yên Xá, H. Ý Yên"
  },
  {
    school_name: "Trường THPT Đại An",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Ý Yên",
    school_address: "Xã Yên Đồng, H. Ý Yên"
  },
  {
    school_name: "Trường THPT Đỗ Huy Liêu",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Ý Yên",
    school_address: "Xã Yên Thắng, H. Ý Yên"
  },
  {
    school_name: "Trường THPT Lý Nhân Tông",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Ý Yên",
    school_address: "Xã Yên Lợi, H. Ý Yên"
  },
  {
    school_name: "Trường THPT Hoàng Văn Thụ",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Vụ Bản",
    school_address: "Xã Trung Thành, H. Vụ Bản"
  },
  {
    school_name: "Trường THPT Lương Thế Vinh",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Vụ Bản",
    school_address: "TTr. Gôi, H. Vụ Bản"
  },
  {
    school_name: "Trường THPT Nguyễn Bính",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Vụ Bản",
    school_address: "Xã Hiển Khánh, H.Vụ Bản"
  },
  {
    school_name: "Trường THPT Nguyễn Đức Thuận",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Vụ Bản",
    school_address: "Xã Thành Lợi, H. Vụ Bản"
  },
  {
    school_name: "Trường THPT Nam Trực",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Nam Trực",
    school_address: "TTr. Nam Giang, H. Nam Trực"
  },
  {
    school_name: "Trường THPT Lý Tự Trọng",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Nam Trực",
    school_address: "Xã Nam Thanh, H. Nam Trực"
  },
  {
    school_name: "Trường THPT Nguyễn Du",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Nam Trực",
    school_address: "Xã Nam Tiến, H. Nam Trực"
  },
  {
    school_name: "Trường THPT Phan Bội Châu",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Nam Trực",
    school_address: "Xã Hồng Quang, H. Nam Trực"
  },
  {
    school_name: "Trường THPT Quang Trung",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Nam Trực",
    school_address: "Xã Nam Hồng, H. Nam Trực"
  },
  {
    school_name: "Trường THPT Trần Văn Bảo",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Nam Trực",
    school_address: "Xã Điền Xá, H. Nam Trực"
  },
  {
    school_name: "Trường THPT Trực Ninh",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Trực Ninh",
    school_address: "Xã Trực Cát, H. Trực Ninh"
  },
  {
    school_name: "Trường THPT Nguyễn Trãi",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Trực Ninh",
    school_address: "Xã Trực Hưng, H. Trực Ninh"
  },
  {
    school_name: "Trường THPT Trực Ninh B",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Trực Ninh",
    school_address: "Xã Trực Thái, H. Trực Ninh"
  },
  {
    school_name: "Trường THPT Lê Quý Đôn",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Trực Ninh",
    school_address: "TTr. Cổ Lễ, H. Trực Ninh"
  },
  {
    school_name: "Trường THPT Đoàn Kết",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Trực Ninh",
    school_address: "TTr. Cổ Lễ, H. Trực Ninh"
  },
  {
    school_name: "Trường THPT A Nghĩa Hưng",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Nghĩa Hưng",
    school_address: "TTr. Liễu Đề, H. Nghĩa Hưng"
  },
  {
    school_name: "Trường THPT B Nghĩa Hưng",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Nghĩa Hưng",
    school_address: "Xã Nghĩa Tân, H. Nghĩa Hưng"
  },
  {
    school_name: "Trường THPT C Nghĩa Hưng",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Nghĩa Hưng",
    school_address: "TTr. Rạng Đông, H. Nghĩa Hưng"
  },
  {
    school_name: "Trường THPT Nghĩa Hưng",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Nghĩa Hưng",
    school_address: "TTr. Liễu Đề, H. Nghĩa Hưng"
  },
  {
    school_name: "Trường THPT Trần Nhân Tông",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Nghĩa Hưng",
    school_address: "Xã Nghĩa Phong, H. Nghĩa Hưng"
  },
  {
    school_name: "Trường THPT Nghĩa Minh",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Nghĩa Hưng",
    school_address: "Xã Nghĩa Minh, Nghĩa Hưng"
  },
  {
    school_name: "Trường THPT A Hải Hậu",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Hải Hậu",
    school_address: "TTr. Yên Định, H. Hải Hậu"
  },
  {
    school_name: "Trường THPT B Hải Hậu",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Hải Hậu",
    school_address: "Xã Hải Phú, H. Hải Hậu"
  },
  {
    school_name: "Trường THPT C Hải Hậu",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Hải Hậu",
    school_address: "TTr. Cồn, H. Hải Hậu"
  },
  {
    school_name: "Trường THPT Tô Hiến Thành",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Hải Hậu",
    school_address: "TTr. Yên Định, H. Hải Hậu"
  },
  {
    school_name: "Trường THPT Thịnh Long",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Hải Hậu",
    school_address: "TTr. Thịnh Long, H. Hải Hậu"
  },
  {
    school_name: "Trường THPT Trần Quốc Tuấn",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Hải Hậu",
    school_address: "Xã Hải Hà, H. Hải Hậu"
  },
  {
    school_name: "Trường THPT An Phúc",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Hải Hậu",
    school_address: "Xã Hải Phong, H. Hải Hậu"
  },
  {
    school_name: "Trường THPT Vũ Văn Hiếu",
    department_edu: "Sở GD&ĐT Nam Định",
    province: "Nam Định",
    province_name: "Huyện Hải Hậu",
    school_address: "Xã Hải Anh, Hải Hậu"
  },

  {
    school_name: "Trường THPT Phan Đình Phùng",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Thành phố Hà Tĩnh",
    school_address: "Ph. Bắc Hà -TP Hà Tĩnh"
  },
  {
    school_name: "Trường THPT ISCHOOL Hà Tĩnh",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Thành phố Hà Tĩnh",
    school_address: "Ph. Thạch Quý – TP Hà Tĩnh"
  },
  {
    school_name: "Trường THPT Chuyên Hà Tĩnh",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Thành phố Hà Tĩnh",
    school_address: "Đường Hà Hoàng, X Thạch Trung -TP Hà Tĩnh"
  },
  {
    school_name: "Trường THPT Thành Sen",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Thành phố Hà Tĩnh",
    school_address: "Xã Thạch Trung, TP. Hà Tĩnh"
  },
  {
    school_name: "Trường THPT Hồng Lĩnh",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Thị xã Hồng Lĩnh",
    school_address: "Ph. Bắc Hồng -Thị xã Hồng Lĩnh"
  },
  {
    school_name: "Trường THPT Hồng Lam",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Thị xã Hồng Lĩnh",
    school_address: "Ph. Bắc Hồng -Thị xã Hồng Lĩnh"
  },
  {
    school_name: "Trường THPTDL Nguyễn Khắc Viện",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Hương Sơn",
    school_address: "Xã Sơn Bằng -H. Hương Sơn"
  },
  {
    school_name: "Trường THPT Hương Sơn",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Hương Sơn",
    school_address: "TTr. Phố Châu -H.Hương Sơn"
  },
  {
    school_name: "Trường THPT Lê Hữu Trác",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Hương Sơn",
    school_address: "Xã Sơn Châu -Huỵên Hương Sơn"
  },
  {
    school_name: "Trường THPT Lý Chính Thắng",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Hương Sơn",
    school_address: "Xã Sơn Hòa -H. Hương Sơn"
  },
  {
    school_name: "Trường THPT Cao Thắng",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Hương Sơn",
    school_address: "Xã Sơn Tây -H. Hương Sơn"
  },
  {
    school_name: "Trường THPT Lê Hồng Phong",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Đức Thọ",
    school_address: "Xã Bùi Xá -H. Đức Thọ"
  },
  {
    school_name: "Trường THPT Nguyễn Thị Minh Khai",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Đức Thọ",
    school_address: "TTr. Đức Thọ -H. Đức Thọ"
  },
  {
    school_name: "Trường THPT Trần Phú",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Đức Thọ",
    school_address: "Xã Đức Thủy -H. Đức Thọ"
  },
  {
    school_name: "Trường THPT Đức Thọ",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Đức Thọ",
    school_address: "Xã Đức Lạng -H. Đức Thọ"
  },
  {
    school_name: "Trường THPT Nguyễn Du",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Nghi Xuân",
    school_address: "Xã Tiên Điền -H. Nghi Xuân"
  },
  {
    school_name: "Trường THPT Nguyễn Công Trứ",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Nghi Xuân",
    school_address: "TTr. Xuân An -H. Nghi Xuân"
  },
  {
    school_name: "Trường THPT Nghi Xuân",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Nghi Xuân",
    school_address: "Xã Cổ Đạm -H. Nghi Xuân"
  },
  {
    school_name: "Trường THPT Can Lộc",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Can Lộc",
    school_address: "Xã Trường Lộc -H. Can Lộc"
  },
  {
    school_name: "Trường THPT Đồng Lộc",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Can Lộc",
    school_address: "Xã Đồng Lộc -H. Can Lộc"
  },
  {
    school_name: "Trường THPT DL Can Lộc",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Can Lộc",
    school_address: "TTr. Can Lộc -H. Can Lộc"
  },
  {
    school_name: "Trường THPT Hương Khê",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Hương Khê",
    school_address: "TTr. Hương Khê -H.Hương Khê"
  },
  {
    school_name: "Trường THPT Hàm Nghi",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Hương Khê",
    school_address: "Xã Phúc Đồng -H. Hương Khê"
  },
  {
    school_name: "Trường THPT Phúc Trạch",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Hương Khê",
    school_address: "Xã Phúc Trạch -H. Hương Khê"
  },
  {
    school_name: "Trường THPT Gia Phố",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Hương Khê",
    school_address: "Xóm 8, X.Gia Phố, H. Hương Khê, Tỉnh Hà Tĩnh"
  },
  {
    school_name: "Trường THPT Lý Tự Trọng",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Thạch Hà",
    school_address: "TTr. Thạch Hà -H. Thạch Hà"
  },
  {
    school_name: "Trường THPT Nguyễn Trung Thiên",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Thạch Hà",
    school_address: "Xã Thạch Khê -H. Thạch Hà"
  },
  {
    school_name: "Trường THPT Lê Quý Đôn",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Thạch Hà",
    school_address: "Xã Thạch Đài -H. Thạch Hà"
  },
  {
    school_name: "Trường THPT Mai Kính",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Thạch Hà",
    school_address: "Xã Việt Xuyên-H. Thạch Hà"
  },
  {
    school_name: "Trường THPT Cẩm Xuyên",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Cẩm Xuyên",
    school_address: "Thôn 5-Cẩm Thăng- H.Cẩm Xuyên"
  },
  {
    school_name: "Trường THPT Cẩm Bình",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Cẩm Xuyên",
    school_address: "Xã Cẩm Bình -H. Cẩm Xuyên"
  },
  {
    school_name: "Trường THPT Hà Huy Tập",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Cẩm Xuyên",
    school_address: "Xã Cẩm Sơn -H. Cẩm Xuyên"
  },
  {
    school_name: "Trường THPT Phan Đình Giót",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Cẩm Xuyên",
    school_address: "TTr. Cẩm Xuyên - H.Cẩm Xuyên"
  },
  {
    school_name: "Trường THPT Nguyễn Đình Liễn",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Cẩm Xuyên",
    school_address: "Xã Cẩm Dương, H. Cẩm Xuyên, Tỉnh Hà Tĩnh"
  },
  {
    school_name: "Trường THPT Kỳ Anh",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Kỳ Anh",
    school_address: "TTr. Kỳ Anh -H. Kỳ Anh"
  },
  {
    school_name: "Trường THPT Nguyễn Huệ",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Kỳ Anh",
    school_address: "Xã Kỳ Phong -H. Kỳ Anh"
  },
  {
    school_name: "Trường THPT Kỳ Lâm",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Kỳ Anh",
    school_address: "Xã Kỳ Lâm -H. Kỳ Anh"
  },
  {
    school_name: "Trường THPT Nguyễn Thị Bích Châu",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Kỳ Anh",
    school_address: "Xã Kỳ Thư-H. Kỳ Anh"
  },
  {
    school_name: "Trường THPT Lê Quảng Chí",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Kỳ Anh",
    school_address: "Xã Kỳ Long, H. Kỳ Anh, Tỉnh Hà Tĩnh"
  },
  {
    school_name: "Trường THPT Vũ Quang",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Vũ Quang",
    school_address: "TTr. Vũ Quang -H. Vũ Quang"
  },
  {
    school_name: "Trường THPT Cù Huy Cận",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Vũ Quang",
    school_address: "Xã Đức Lĩnh – H. Vũ Quang"
  },
  {
    school_name: "Trường THPT Nguyễn Văn Trỗi",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Lộc Hà",
    school_address: "Xã Phù Lưu -H. Lộc Hà"
  },
  {
    school_name: "Trường THPT Mai Thúc Loan",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Lộc Hà",
    school_address: "Xã Thạch Châu -H. Lộc Hà"
  },
  {
    school_name: "Trường THPT Nguyễn Đổng Chi",
    department_edu: "Sở GD&ĐT Hà Tĩnh",
    province: "Hà Tĩnh",
    province_name: "Huyện Lộc Hà",
    school_address: "Xã ích Hậu -H. Lộc Hà"
  },

  {
    school_name: "Trường THPT Duy Tân",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Thành phố Tam Kỳ",
    school_address: "Th. Phú Thạnh, X.Tam Phú, tp Tam Kỳ, Quảng Nam"
  },
  {
    school_name: "Trường THPT Phan Bội Châu",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Thành phố Tam Kỳ",
    school_address: "Đường Phan Châu Trinh, Tam Kỳ, Q. Nam"
  },
  {
    school_name: "Trường THPT Trần Cao Vân",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Thành phố Tam Kỳ",
    school_address: "Ph. An Mỹ, TP. Tam Kỳ, Quảng Nam"
  },
  {
    school_name: "Trường THPT Lê Quý Đôn",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Thành phố Tam Kỳ",
    school_address: "Đường Trần Văn Dư, Tam Kỳ, Quảng Nam"
  },
  {
    school_name: "Trường THPT DL Hà Huy Tập",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Thành phố Tam Kỳ",
    school_address: "Đường Lý Thường Kiệt, TP Tam Kỳ, Quảng Nam"
  },
  {
    school_name: "Trường THPT Chuyên Nguyễn Bỉnh Khiêm",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Thành phố Tam Kỳ",
    school_address: "Đường Trần Hưng Đạo, TP Tam Kỳ, Quảng Nam"
  },
  {
    school_name: "Trường THPT Trần Quý Cáp",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Thành phố Hội An",
    school_address: "Thành phố Hội An, Quảng Nam"
  },
  {
    school_name: "Trường THPT Chuyên Lê Thánh Tông",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Thành phố Hội An",
    school_address: "Thành phố Hội An, Quảng Nam"
  },
  {
    school_name: "Trường THPT NguyễnTrãi",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Thành phố Hội An",
    school_address: "Thành phố Hội An, Quảng Nam"
  },
  {
    school_name: "Trường THPT Trần Hưng Đạo",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Thành phố Hội An",
    school_address: "170 Cửa Đại, Tp Hội An, Quảng Nam"
  },
  {
    school_name: "Trường THPT Sào Nam",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Duy Xuyên",
    school_address: "H. Duy Xuyên, Quảng Nam"
  },
  {
    school_name: "Trường THPT Lê Hồng Phong",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Duy Xuyên",
    school_address: "H. Duy Xuyên, Quảng Nam"
  },
  {
    school_name: "Trường THPT Nguyễn Hiền",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Duy Xuyên",
    school_address: "Xã Duy Sơn, H. Duy Xuyên, Quảng Nam"
  },
  {
    school_name: "Trường THPT Nguyễn Duy Hiệu",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Điện Bàn",
    school_address: "H. Điện Bàn, Quảng Nam"
  },
  {
    school_name: "Trường THPT Hoàng Diệu",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Điện Bàn",
    school_address: "H. Điện Bàn, Quảng Nam"
  },
  {
    school_name: "Trường THPT Phạm Phú Thứ",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Điện Bàn",
    school_address: "H. Điện Bàn, Quảng Nam"
  },
  {
    school_name: "Trường THPT Lương Thế Vinh",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Điện Bàn",
    school_address: "H. Điện Bàn, Quảng Nam"
  },
  {
    school_name: "Trường THPT Nguyễn Khuyến",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Điện Bàn",
    school_address: "H. Điện Bàn, Quảng Nam"
  },
  {
    school_name: "Trường THPT Huỳnh Ngọc Huệ",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Đại Lộc",
    school_address: "H. Đại Lộc, Quảng Nam"
  },
  {
    school_name: "Trường THPT Chu Văn An",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Đại Lộc",
    school_address: "Xã Đại Đồng, H. Đại Lộc, Quảng Nam"
  },
  {
    school_name: "Trường THPT Đỗ Đăng Tuyển",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Đại Lộc",
    school_address: "H. Đại Lộc, Quảng Nam"
  },
  {
    school_name: "Trường THPT Lương Thúc Kỳ",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Đại Lộc",
    school_address: "H. Đại Lộc, Quảng Nam"
  },
  {
    school_name: "Trường THPT Quế Sơn",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Quế Sơn",
    school_address: "H. Quế Sơn, Quảng Nam"
  },
  {
    school_name: "Trường THPT Nguyễn Văn Cừ",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Quế Sơn",
    school_address: "H. Quế Sơn, Quảng Nam"
  },
  {
    school_name: "Trường THPT Trần Đại Nghĩa",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Quế Sơn",
    school_address: "H. Quế Sơn, Quảng Nam"
  },
  {
    school_name: "Trường THPT DL Phạm Văn Đồng",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Quế Sơn",
    school_address: "H. Quế Sơn, Quảng Nam"
  },
  {
    school_name: "Trường THPT Hiệp Đức",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Hiệp Đức",
    school_address: "H. Hiệp Đức, Quảng Nam"
  },
  {
    school_name: "Trường THPT Trần Phú",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Hiệp Đức",
    school_address: "Xã Bình Lâm, H. Hiệp Đức, Quảng Nam"
  },
  {
    school_name: "Trường THPT Hùng Vương",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Thăng Bình",
    school_address: "Xã Bình An, H. Thăng Bình, Quảng Nam"
  },
  {
    school_name: "Trường THPT Tiểu La",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Thăng Bình",
    school_address: "H. Thăng Bình, Quảng Nam"
  },
  {
    school_name: "Trường THPT Nguyễn Thái Bình",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Thăng Bình",
    school_address: "Xã Bình Đào, H. Thăng Bình, Quảng Nam"
  },
  {
    school_name: "Trường THPT Thái Phiên",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Thăng Bình",
    school_address: "H. Thăng Bình, Quảng Nam"
  },
  {
    school_name: "Trường THPT Lý Tự Trọng",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Thăng Bình",
    school_address: "H. Thăng Bình, Quảng Nam"
  },
  {
    school_name: "Trường THPT Núi Thành",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Núi Thành",
    school_address: "H. Núi Thành, Quảng Nam"
  },
  {
    school_name: "Trường THPT Cao Bá Quát",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Núi Thành",
    school_address: "Xã Tam Anh Bắc, H. Núi Thành, Quảng Nam"
  },
  {
    school_name: "Trường THPT Nguyễn Huệ",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Núi Thành",
    school_address: "H. Núi Thành, Quảng Nam"
  },
  {
    school_name: "Trường THPT Huỳnh Thúc Kháng",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Tiên Phước",
    school_address: "H. Tiên Phước, Quảng Nam"
  },
  {
    school_name: "Trường THPT Phan Châu Trinh",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Tiên Phước",
    school_address: "H. Tiên Phước, Quảng Nam"
  },
  {
    school_name: "Trường THPT Bắc Trà My",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Bắc Hà My",
    school_address: "H. Bắc Trà My, Quảng Nam"
  },
  {
    school_name: "Trường THPT Quang Trung",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Đông Giang",
    school_address: "H. Đông Giang, Quảng Nam"
  },
  {
    school_name: "Trường THPT Âu Cơ",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Đông Giang",
    school_address: "Xã Ba, H. Đông Giang, Quảng Nam"
  },
  {
    school_name: "Trường THPT Nam Giang",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Nam Giang",
    school_address: "H. Nam Giang, Quảng Nam"
  },
  {
    school_name: "Trường THPT Nguyễn Văn Trỗi",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Nam Giang",
    school_address: "Xã La Dêê, H. Nam Giang, Quảng Nam"
  },
  {
    school_name: "Trường THPT Khâm Đức",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Phước Sơn",
    school_address: "H. Phước Sơn, Quảng Nam"
  },
  {
    school_name: "Trường THPT Nam Trà My",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Nam Trà My",
    school_address: "H. Nam Trà My, Quảng Nam"
  },
  {
    school_name: "Trường THPT Tây Giang",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Tây Giang",
    school_address: "H. Tây Giang, Quảng Nam"
  },
  {
    school_name: "Trường THPT Trần Văn Dư",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Phú Ninh",
    school_address: "H. Phú Ninh, Quảng Nam"
  },
  {
    school_name: "Trường THPT Nguyễn Dục",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Phú Ninh",
    school_address: "Xã Tam Dân, H. Phú Ninh, Quảng Nam"
  },
  {
    school_name: "Trường THPT Nông Sơn",
    department_edu: "Sở GD&ĐT Quảng Nam",
    province: "Quảng Nam",
    province_name: "Huyện Nông Sơn",
    school_address: "Xã Quế Trung, H. Nông Sơn, Quảng Nam"
  },

  {
    school_name: "Trường THPT Pleiku",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "Thành phố Pleiku",
    school_address: "90 Tô Vĩnh Diện,Ph. Hoa Lư, Thành phố Pleiku , Gia Lai"
  },
  {
    school_name: "Trường THPT Phan Bội Châu",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "Thành phố Pleiku",
    school_address: "Ph. Ia Kring, Thành phố Pleiku, Gia Lai"
  },
  {
    school_name: "Trường THPT Lê Lợi",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "Thành phố Pleiku",
    school_address: "Ph. Hội Thương, Thành phố Pleiku, Gia Lai"
  },
  {
    school_name: "Trường THPT Chuyên Hùng Vương",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "Thành phố Pleiku",
    school_address: "48 Hùng Vương, Thành phố Pleiku, Gia Lai"
  },
  {
    school_name: "Trường THPT Hoàng Hoa Thám",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "Thành phố Pleiku",
    school_address: "Ph. Yên Thế, Thành phố Pleiku, Gia Lai"
  },
  {
    school_name: "Trường THPT Nguyễn Chí Thanh",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "Thành phố Pleiku",
    school_address: "138-Nguyễn Chí Thanh. P.Chi Lăng, TP Pleiku, Gia Lai"
  },
  {
    school_name: "Trường THPT Mạc Đĩnh Chi",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "Huyện Chư Păh",
    school_address: "21 Quang Trung, TTr. Phú Hòa, H. Chư Păh, Gia Lai"
  },
  {
    school_name: "Trường THPT Ia Ly",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "Huyện Chư Păh",
    school_address: "TTr. Ia Ly, H. Chư Păh, Gia Lai"
  },
  {
    school_name: "Trường THPT Phạm Hồng Thái",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "Huyện Chư Păh",
    school_address: "Xã Ia Khương, H. Chư Păh, Gia Lai"
  },
  {
    school_name: "Trường THPT Trần Hưng Đạo",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "Huyện Mang Yang",
    school_address: "Đường Trần Phú, thị trấn Kon Dơng, H. Mang Yang, Gia Lai"
  },
  {
    school_name: "Trường THPT Lương Thế Vinh",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "Huyện KBan",
    school_address: "TTr. KBang, H. KBang , Gia Lai"
  },
  {
    school_name: "Trường THPT Anh hùng Núp",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "Huyện Kban",
    school_address: "Xã Kông Lơng Khơng, KBang, Gia Lai"
  },
  {
    school_name: "Trường THPT Quang Trung",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "thị xã An Khê",
    school_address: "27 Chu Văn An, Ph. An Phú, thị xã An Khê, Gia Lai"
  },
  {
    school_name: "Trường THPT Nguyễn Khuyến",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "thị xã An Khê",
    school_address: "194 Quang Trung, Ph. An Phú, thị xã An Khê, Gia Lai"
  },
  {
    school_name: "Trường THPT Nguyễn Trãi",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "thị xã An Khê",
    school_address: "Đường Lê Thị Hồng Gấm, Ph. An Bình, thị xã An Khê, Gia Lai"
  },
  {
    school_name: "Trường THPT Hà Huy Tập",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "Huyện Kông Chro",
    school_address: "TTr. Kông Chro, H. Kông Chro, Gia Lai"
  },
  {
    school_name: "Trường THPT Lê Hoàn",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "Huyện Đức Cơ",
    school_address: "TTr. Chư Ty, H. Đức Cơ, Gia Lai"
  },
  {
    school_name: "Trường THPT Nguyễn Trường Tộ",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "Huyện Đức Cơ",
    school_address: "Xã Ia Nan, H. Đức Cơ, Gia Lai"
  },
  {
    school_name: "Trường THPT Tôn Đức Thắng",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "Huyện Đức Cơ",
    school_address: "Xã Ia Din, H. Đức Cơ, Gia Lai"
  },
  {
    school_name: "Trường THPT Lê Quý Đôn",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "Huyện Chư Prông",
    school_address: "TTr. Chư Prông, H. Chư Prông , Gia Lai"
  },
  {
    school_name: "Trường THPT Trần Phú",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "Huyện Chư Prông",
    school_address: "Xã Thăng Hưng, H. Chư Prông, Gia Lai."
  },
  {
    school_name: "Trường THPT Pleime",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "Huyện Chư Prông",
    school_address: "Xã Ia Ga, H. Chư Prông, Gia Lai"
  },
  {
    school_name: "Trường THPT Nguyễn Bỉnh Khiêm",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "Huyện Chư Sê",
    school_address: "06 Phan Đình Phùng,TTr. Chư Sê, H. Chư Sê, Gia Lai"
  },
  {
    school_name: "Trường THPT Trường Chinh",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "Huyện Chư Sê",
    school_address: "Thôn Thanh Bình, TTr. Chư Sê, Gia Lai"
  },
  {
    school_name: "Trường THPT Nguyễn Văn Cừ",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "Huyện Chư Sê",
    school_address: "Xã Bờ Ngoong, H. Chư Sê, Gia Lai"
  },
  {
    school_name: "Trường THPT Lê Thánh Tông",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "thị xã Ayun Pa",
    school_address: "70 Nguyễn Huệ, thị xã Ayun Pa, Gia Lai"
  },
  {
    school_name: "Trường THPT Lý Thường Kiệt",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "thị xã Ayun Pa",
    school_address: "48 Nguyễn Viết Xuân, phường Hòa Bình, thị xã Ayun Pa, Gia Lai"
  },
  {
    school_name: "Trường THPT Chu Văn An",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "Huyện Krông Pa",
    school_address: "TTr. Phú Túc, H. Krông Pa, Gia Lai"
  },
  {
    school_name: "Trường THPT Nguyễn Du",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "Huyện Krông Pa",
    school_address: "Xã Ia Sươm, H. Krông Pa, Gia Lai"
  },
  {
    school_name: "Trường THPT Đinh Tiên Hoàng",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "Huyện Krông Pa",
    school_address: "Xã Ia Dreh, H. Krông Pa, Gia Lai"
  },
  {
    school_name: "Trường THPT Huỳnh Thúc Kháng",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "Huyện Ia Grai",
    school_address: "TTr. Ia Kha, H. Ia Grai, Gia Lai"
  },
  {
    school_name: "Trường THPT Phạm Văn Đồng",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "Huyện Ia Grai",
    school_address: "Xã Ia Sao, H. Ia Grai, Gia Lai"
  },
  {
    school_name: "Trường THPT Nguyễn Huệ",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "Huyện Đak Đoa",
    school_address: "154 Nguyễn Huệ, TTr. Đak Đoa, H. Đak Đoa, Gia Lai"
  },
  {
    school_name: "Trường THPT Lê Hồng Phong",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "Huyện Đak Đoa",
    school_address: "Xã Nam Yang, H. Đak Đoa, Gia Lai"
  },
  {
    school_name: "Trường THPT Nguyễn Thị Minh Khai",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "Huyện Đak Đoa",
    school_address: "Xã A Dơk, H. Đak Đoa, Gia Lai"
  },
  {
    school_name: "Trường THPT Nguyễn Tất Thành",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "Huyện Ia Pa",
    school_address: "Xã Ia Mrơn, H. Ia Pa, Gia Lai."
  },
  {
    school_name: "Trường THPT Phan Chu Trinh",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "Huyện Ia Pa",
    school_address: "Xã Ia Tul, H. Ia Pa, Gia Lai"
  },
  {
    school_name: "Trường THPT Y Đôn",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "Huyện Đak Pơ",
    school_address: "TTr. Đak Pơ, H. Đak Pơ, Gia Lai"
  },
  {
    school_name: "Trường THPT Trần Quốc Tuấn",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "Huyện Phú Thiện",
    school_address: "TTr. Phú Thiện, H. Phú Thiện, Gia Lai"
  },
  {
    school_name: "Trường THPT Võ Văn Kiệt",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "Huyện Phú Thiện",
    school_address: "Xã Ia Piar, H. Phú Thiện, Gia Lai."
  },
  {
    school_name: "Trường THPT Nguyễn Thái Học",
    department_edu: "Sở GD&ĐT Gia Lai",
    province: "Gia Lai",
    province_name: "Huyện Chư Pưh",
    school_address: "TTr. Nhơn Hòa, H. Chư Pưh, Gia Lai."
  },
  {
    school_name: "Trường THPT Vùng Cao Việt Bắc ",
    department_edu: "Không thuộc sở giáo dục nào",
    province: "Thái Nguyên",
    province_name: "Thành phố Thái Nguyên",
    school_address: "Đường Z 115, Quyết Thắng, Thành phố Thái Nguyên, Thái Nguyên"
  },
  {
    school_name:'Trường THPT Thạch Bàn',
    department_edu: "Sở GD&ĐT Hà Nội",
    province: "Hà Nội",
    province_name: "Thành phố Hà Nội",
    school_address: "Tổ 12, Thạch Bàn, Long Biên, Hà Nội"
  }
]
