import {Component, Input, OnInit} from '@angular/core';
import {HskUnzipFileService, UnzipCCCDToZip, UnzippedFile} from "@shared/services/hsk-unzip-file.service";
import {ThiSinhInfo} from "@shared/models/thi-sinh";
import {FileService} from "@core/services/file.service";
import {MediaService} from "@shared/services/media.service";
import {UserService} from "@core/services/user.service";
import {AuthService} from "@core/services/auth.service";
import {ThisinhInfoService} from "@shared/services/thisinh-info.service";
import {NotificationService} from "@core/services/notification.service";
import {forkJoin, Observable, of, switchMap} from "rxjs";
import {BUTTON_NO, BUTTON_YES} from "@core/models/buttons";
import {OvicFile} from "@core/models/file";

@Component({
  selector: 'app-add-img-cccd-by-zip',
  templateUrl: './add-img-cccd-by-zip.component.html',
  styleUrls: ['./add-img-cccd-by-zip.component.css']
})
export class AddImgCccdByZipComponent implements OnInit {

  @Input() set resetSite(item: boolean) {
    this.loadInit()
    this.btnReturn();
  }

  accept: string = '.zip,.rar';
  multiple: boolean = false;

  fileListImport: UnzipCCCDToZip[];

  fileSelect: File;

  ngSite: 1 | 0 = 0;
  isLoading: boolean = false;

  infoFindByFile: ThiSinhInfo[];
  viewInfoFind: boolean = false;

  constructor(
    private hskUnzipFileService: HskUnzipFileService,
    private fileService: FileService,
    private mediaService: MediaService,
    private userService: UserService,
    private auth: AuthService,
    private thisinhInfoService: ThisinhInfoService,
    private notifi: NotificationService,
  ) {
  }

  ngOnInit(): void {
  }

  loadInit() {

  }

  async onSelectFiles(event: Event, inputElement?: HTMLInputElement) {
    this.fileListImport = []
    this.fileSelect = event.target['files']['0'];
    const data = await this.hskUnzipFileService.unZipFileByFoder(event.target['files'][0]);
    this.fileListImport = data.map(m => {
      return m
    })
    if (this.fileListImport.length > 0) {
      this.ngSite = 1;
    }
    if (inputElement) {
      inputElement.remove();
    }
  }


  btnCheckInfo() {
    this.isLoading = true;
    const fileName = this.fileListImport.map(m => this.convertNameToFile(m.name_forder));
    this.userService.queryUserByListUserName(fileName, this.auth.user.id, 'id,username,display_name').pipe(
      switchMap(m => {
        const ids = m.map(m => m.id);
        return ids.length > 0 ? forkJoin([of(m), this.thisinhInfoService.getDataByUserIds(ids)]) : forkJoin([of(m), of([])])
      })
    ).subscribe({
      next: ([users, info]) => {
        this.infoFindByFile = info.length > 0 ? info.map(m => {
          const user = users.find(f => f.id === m.user_id);
          m['__username'] = user.username;
          m['__fileParams'] = this.fileListImport.find(f => this.convertNameToFile(f.name_forder) === user.username);
          return m;
        }) : [];
        this.viewInfoFind = true;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    })

  }

  convertNameToFile(name: string): string {
    return name.replace(/\D/g, "");
  }

  async updateImageforThisinhV2() {
    const btn = await this.notifi.confirm('Xác nhận cập nhật ảnh CCCD (hộ chiếu) cho thí sinh', 'Xác nhận', [BUTTON_NO, BUTTON_YES])
    if (btn.name === 'yes') {
      if (this.infoFindByFile.length > 0) {
        this.notifi.isProcessing(true);

        const step: number = 100 / this.fileListImport.length;
        this.notifi.loadingAnimationV2({process: {percent: 0}});
        this.loopFileIndata(this.infoFindByFile, step, 0).pipe().subscribe({
          next: (data) => {
            this.notifi.disableLoadingAnimationV2();
            this.notifi.isProcessing(false);
            this.notifi.toastSuccess('Cập nhận ảnh cho thí sinh thành công')
            this.btnReturn();
          },
          error: () => {
            this.notifi.disableLoadingAnimationV2();
            this.notifi.isProcessing(false);
            this.notifi.toastSuccess('Cập nhận ảnh cho thí sinh thất bại, vui lòng thực hiện lại')
            this.btnReturn();

          }
        })
        // this.fileService.uploadMultipleFilesByhsk(fileUpload, 1).pipe(switchMap(m => {
        //   return this.loopUpdateImgForItem(this.infoFindByFile, m, step, 0);
        // })).subscribe({
        //   next: (data) => {
        //     this.notifi.disableLoadingAnimationV2();
        //     this.notifi.isProcessing(false);
        //     this.notifi.toastSuccess('Cập nhận ảnh cho thí sinh thành công')
        //     this.btnReturn();
        //   }, error: (e) => {
        //     this.notifi.disableLoadingAnimationV2();
        //     this.notifi.isProcessing(false);
        //     this.notifi.toastSuccess('Cập nhận ảnh cho thí sinh thất bại, vui lòng thực hiện lại')
        //
        //   }
        // })
      } else {
        this.notifi.toastWarning('Chưa có dữ liệu thí sinh ');
      }
    }
  }


  // async updateImageforThisinh() {
  //   const btn = await this.notifi.confirm('Xác nhận cập nhật ảnh cho thí sinh', 'Xác nhận', [BUTTON_NO, BUTTON_YES])
  //   if (btn.name === 'yes') {
  //     const infoUserIds = this.infoFindByFile.map(m => m['__username']);
  //     const fileUpload = this.fileListImport.filter(f => infoUserIds.includes(f['__name_convertd'])).map(m => {
  //       return m
  //     });
  //     if (this.infoFindByFile.length > 0) {
  //       this.notifi.isProcessing(true);
  //
  //       const step: number = 100 / this.fileListImport.length;
  //       this.notifi.loadingAnimationV2({process: {percent: 0}});
  //       this.fileService.uploadMultipleFilesByhsk(fileUpload, 1).pipe(switchMap(m => {
  //         return this.loopUpdateImgForItem(this.infoFindByFile, m, step, 0);
  //       })).subscribe({
  //         next: (data) => {
  //           this.notifi.disableLoadingAnimationV2();
  //           this.notifi.isProcessing(false);
  //           this.notifi.toastSuccess('Cập nhận ảnh cho thí sinh thành công')
  //           this.btnReturn();
  //         }, error: (e) => {
  //           this.notifi.disableLoadingAnimationV2();
  //           this.notifi.isProcessing(false);
  //           this.notifi.toastSuccess('Cập nhận ảnh cho thí sinh thất bại, vui lòng thực hiện lại')
  //
  //         }
  //       })
  //     } else {
  //       this.notifi.toastWarning('Chưa có dữ liệu thí sinh ');
  //     }
  //
  //   }
  //
  //
  // }

  loopFileIndata(data: ThiSinhInfo[], step: number, percent: number): Observable<any> {
    const index = data.findIndex(i => !i['__isUpdate']);
    if (index !== -1) {
      const item = data[index];
      const newPercent: number = percent + step;
      item['__isUpdate'] = true;
      const fileUpload = [].concat(item['__fileParams']['cccd_mattruoc'].file, item['__fileParams']['cccd_matsau'].file);
      return this.fileService.uploadMultipleFilesByhsk(fileUpload, 1, data[index]['__username']).pipe(switchMap(m => {
          const contentUpate = {
            cccd_img_truoc: m.filter(f => this.convertNameToFile(f.title) === '1'),
            cccd_img_sau: m.filter(f => this.convertNameToFile(f.title) === '2'),
          }
          return this.thisinhInfoService.update(item.id, contentUpate)
        }),
        switchMap(m => {

          return this.loopFileIndata(data, step, newPercent);
        })
      )

    } else {
      return of(data);

    }
  }

  loopUpdateImgForItem(data: ThiSinhInfo[], dataFIle: OvicFile[], step: number, percent: number): Observable<any[]> {
    const index = data.findIndex(i => !i['__anh_chandung']);
    if (index !== -1) {
      const nameFile: string = data[index]['__username'];
      const fileupload = dataFIle.filter(f => this.convertNameToFile(f.title) === nameFile)
      data[index]['__anh_chandung'] = fileupload;
      const newPercent: number = percent + step;
      this.notifi.loadingAnimationV2({process: {percent: newPercent}});
      return this.thisinhInfoService.update(data[index].id, {anh_chandung: fileupload}).pipe(switchMap(() => {
        return this.loopUpdateImgForItem(data, dataFIle, step, newPercent)
      }));
    } else {
      return of(data, dataFIle);
    }
  }

  btnReturn() {
    this.ngSite = 0;
    this.viewInfoFind = false;
    this.infoFindByFile = [];
    this.fileListImport = [];
    this.fileSelect = null;

  }

  openFileChooser(): void {
    const inputFile: HTMLInputElement = Object.assign(document.createElement('input'), {
      type: "file",
      accept: "'.zip'",
      multiple: false
    });
    inputFile.onchange = (event: Event): void => void this.onSelectFiles(event, inputFile);
    inputFile.click();
  }

  dowloadFileMau() {
    const link = document.createElement('a');
    link.href = 'assets/files/hsk/file_mau_upload_cccd.zip';
    link.download = 'file_mau_upload_cccd.zip';
    link.click();
  }

}
