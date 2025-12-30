import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {AbstractControl} from "@angular/forms";
import {OvicFile} from "@core/models/file";
import {FileService} from "@core/services/file.service";
import {NotificationService} from "@core/services/notification.service";
import {AvatarMakerSetting, MediaService} from "@shared/services/media.service";
import {map} from "rxjs/operators";
import {TYPE_FILE_IMAGE} from "@shared/utils/syscat";
import imageCompression from 'browser-image-compression';
@Component({
  selector: 'ovic-avata-type-thpt',
  templateUrl: './ovic-avata-type-thpt.component.html',
  styleUrls: ['./ovic-avata-type-thpt.component.css']
})
export class OvicAvataTypeThptComponent implements OnInit {
  @Input() site:boolean = false;
  @Input() disabled:boolean = false;
  @Input() formField: AbstractControl;
  @Input() multiple = true;
  @Input() accept = []; // only file extension eg. .jpg, .png, .jpeg, .gif, .pdf
  @Input() aspectRatio:number;// 3 / 2, 2 / 3
  @Input() textView:string='Upload file';
  @Input() height:string;//300px;
  @Input() file_size:number= null;//50kb
  @Input() file_name:string;
  @Input() footage:string ='horizontal';//horizontal :ngang,vertical:dài

  @Input() public:number = 1;
  characterAvatar: string = '';
  fileList:OvicFile[]=[];
  _accept = '';
  @Input()rotateShow : boolean =false;
  constructor(
    private fileService: FileService,
    private notificationService: NotificationService,
    private mediaService: MediaService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['accept']) {
      if (this.accept && this.accept.length) {
        this._accept = this.accept.join(',');
      }
    }
  }

  ngOnInit(): void {
    if (this.formField) {
      this.formField.valueChanges.pipe(map(t => (t && Array.isArray(t)) ? t : [])).subscribe((files: OvicFile[]) => {
        this.fileList = files.filter(Boolean).map(file => {
          file['link_img'] = file ? this.fileService.getPreviewLinkLocalFile(file): '';
          return file;
        });
        this.characterAvatar = this.fileList[0]? this.fileList[0]['link_img'] :'';
      });
      if (this.formField.value && Array.isArray(this.formField.value)) {
        this.fileList = this.formField.value.filter(Boolean).map(file => {
          file['link_img'] = file ? this.fileService.getPreviewLinkLocalFile(file): '';
          return file;
        });
        this.characterAvatar = this.fileList[0]? this.fileList[0]['link_img'] :'';
      }

    }
    if (this.accept && this.accept.length) {
      this._accept = this.accept.join(',');
    }
  }

  async makeCharacterAvatar(file: File, characterName: string): Promise<File> {
    try {
      const options: AvatarMakerSetting = {
        aspectRatio: this.aspectRatio ? this.aspectRatio : 2 / 3,
        resizeToWidth: 300,
        format: 'jpeg',
        cropperMinWidth: 10,
        dirRectImage: {
          enable: true,
          dataUrl: URL.createObjectURL(file)
        },
        rotateShow:this.rotateShow
      };
      const avatar = await this.mediaService.callAvatarMakerV2(options);
      if (avatar && !avatar.error && avatar.data) {
        const none = new Date().valueOf();
        const fileName = characterName+ '.jpg';
        return Promise.resolve(this.fileService.base64ToFile(avatar.data.base64, fileName));
      } else {
        return Promise.resolve(null);
      }
    } catch (e) {
      this.notificationService.isProcessing(false);
      // this.notificationService.toastError('Quá trình tạo avatar thất bại');
      return Promise.resolve(null);
    }
  }

  typeFileAdd = TYPE_FILE_IMAGE;
  async onInputAvatar(event, fileChooser: HTMLInputElement,index:number) {
    // console.log(fileChooser.files);
    if (fileChooser.files && fileChooser.files.length) {
      if (this.typeFileAdd.includes(fileChooser.files[0].type)){
        if(fileChooser.files[0].size >= 21*1024){
          const file = await this.makeCharacterAvatar(fileChooser.files[0],this.replaceFileName(this.file_name ? this.file_name :fileChooser.files[0].name ,fileChooser.files[0].type) );
          let fileUser:File  = file;
          if(this.file_size !== null){
            const fileConvert =await this.reSizeFileByCompression(file, this.file_size);
            fileUser = this.fileService.blobToFile(fileConvert,this.replaceFileName(this.file_name ? this.file_name :fileChooser.files[0].name ,fileChooser.files[0].type));
          }
          // console.log(fileUser)

          // upload file to server
          // console.log({...fileUser,name:fileChooser.files[0].name});
          this.fileService.uploadFile(fileUser, this.public).subscribe({
            next: fileUl => {
              // this.objectThumbnail = this.objectThumbnail.length>0 ? [].concat(fileUl);

              if (this.fileList[index]){
                this.fileList[index] = fileUl;
                this.formField.setValue(this.fileList)
              }else{
                this.fileList = this.fileList.concat(fileUl);
                this.formField.setValue(this.fileList)
              }
            }, error: () => {
              this.notificationService.toastError('Upload file không thành công');
            }
          })

        }else{
          this.notificationService.toastError('dung lượng file nhỏ, vui lòng tải file khác.');
        }


      }else{
        this.notificationService.toastWarning("Định dạng file không phù hợp");
      }
    }
  }

  replaceFileName(fileName:string , typeFile:string){
    const newName = fileName.split('.')[0];
    const newType =typeFile.split('/')[1];
    return fileName+'.'+(newType === 'jpeg'? 'jpg':newType);
  }

  async reSizeFileByCompression(file: File, file_size: number) {
    try {
      const minSize = 21 * 1024; // 25KB
      const maxSize = file_size * 1024; // file_size KB

      // Nếu file đã nằm trong khoảng [25KB, file_size KB], không cần nén
      if (file.size >= minSize && file.size <= maxSize) {
        return file;
      }

      const options = {
        maxSizeMB: file_size / 1024, // file_size KB -> MB
        maxWidthOrHeight: 1024,
        useWebWorker: true,
        initialQuality: 0.9,
      };

      let compressedFile = await imageCompression(file, options);

      // Nếu ảnh vẫn lớn hơn file_size KB, tiếp tục giảm chất lượng
      while (compressedFile.size > maxSize) {
        options.initialQuality = Math.max(0.1, options.initialQuality - 0.1); // Giảm dần chất lượng
        compressedFile = await imageCompression(file, options);

        // Nếu file bị nén quá nhỏ (dưới 25KB), dừng lại
        if (compressedFile.size < minSize || options.initialQuality <= 0.1) {
          break;
        }
      }

      // Trả về file nếu nằm trong khoảng yêu cầu, ngược lại trả về null
      return compressedFile.size >= minSize && compressedFile.size <= maxSize
        ? compressedFile
        : null;
    } catch (e) {
      console.error("Lỗi trong quá trình nén ảnh:", e);
      return null;
    }
  }

}
