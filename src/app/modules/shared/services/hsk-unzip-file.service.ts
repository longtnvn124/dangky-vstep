import { Injectable } from '@angular/core';
import * as JSZip from "jszip";
import {FileService} from "@core/services/file.service";
import {MediaService} from "@shared/services/media.service";

export interface UnzippedFile {
  file : File;
  content?: Blob;
  base64?: string;
}

export interface UnzipCCCDToZip{
  name_forder:string;
  cccd_mattruoc:UnzippedFile;
  cccd_matsau:UnzippedFile;

}

@Injectable({
  providedIn: 'root'
})
export class HskUnzipFileService {
  private imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']; // Chỉ lấy file ảnh
  private readonly validExtensions = ['jpg', 'jpeg', 'png']; // Chỉ lấy file ảnh

  constructor(

  ) {
  }

  private isImage(fileName: string): boolean {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension ? this.imageExtensions.includes(extension) : false;
  }

  private getFileName(path: string): string {
    return path.split('/').pop() || path; // Lấy tên file từ đường dẫn
  }

  private getMimeType = (filename: string): string => {
    const ext = filename.split(".").pop()?.toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      bmp: "image/bmp",
      svg: "image/svg+xml"
    };
    return mimeTypes[ext || ""] || "application/octet-stream";
  };

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  //-------- unzip file ảnh chân dung --------------------
  async unzipFile(zipFile: File): Promise<UnzippedFile[]> {


    const zip = new JSZip();
    const result: UnzippedFile[] = [];
    const zipContent = await zip.loadAsync(zipFile);
    for (const relativePath in zipContent.files) {
      const fileData = zipContent.files[relativePath];

      if (!fileData.dir) { // Bỏ qua thư mục
        const fileName = this.getFileName(relativePath);
        if (!this.isImage(fileName)) continue; // Chỉ lấy ảnh

        const blob = await fileData.async('blob'); // Lấy nội dung file
        const mimeType = this.getMimeType(fileName); // Xác định lại MIME type
        const fixedBlob = blob.slice(0, blob.size, mimeType); // Tạo blob mới với type đúng

        const base64 = await this.blobToBase64(fixedBlob); // Chuyển Blob sang Base64

        const file = new File([fixedBlob], fileName, {
          type: mimeType,
          lastModified: fileData.date?.getTime() || Date.now()
        });
        result.push({ file, content: fixedBlob, base64 });
      }
    }

    return result;

  }

  //-------- unzip file ảnh cccd by forder --------------------

  async unZipFileByFoder(zipFile: File):Promise<UnzipCCCDToZip[]>{
    const zip = new JSZip();
    const zipContent = await zip.loadAsync(zipFile);
    const folderMap: { [key: string]: UnzipCCCDToZip } = {};

    for (const relativePath in zipContent.files) {
      const fileData = zipContent.files[relativePath];

      if (!fileData.dir) { // Bỏ qua thư mục
        const { folderName, fileName } = this.extractFolderAndFile(relativePath);
        if (!folderName || !this.isValidImage(fileName)) continue; // Bỏ qua nếu không phải ảnh

        const blob = await fileData.async('blob'); // Lấy nội dung file
        const mimeType = this.getMimeType(fileName);
        const fixedBlob = blob.slice(0, blob.size, mimeType);
        const base64 = await this.blobToBase64(fixedBlob);

        const file = new File([fixedBlob], fileName, {
          type: mimeType,
          lastModified: fileData.date?.getTime() || Date.now()
        });

        // Nếu thư mục chưa tồn tại trong map, tạo mới
        if (!folderMap[folderName]) {
          folderMap[folderName] = {
            name_forder: folderName,
            cccd_mattruoc: null,
            cccd_matsau: null,
          };
        }

        // Xác định mặt trước (filename == "1") và mặt sau (filename == "2")
        const unzippedFile: UnzippedFile = { file, content: fixedBlob, base64 };
        if (this.convertNameToFile(unzippedFile.file.name) === "1") {
          folderMap[folderName].cccd_mattruoc = unzippedFile;
        } else if (this.convertNameToFile(unzippedFile.file.name) === "2") {
          folderMap[folderName].cccd_matsau = unzippedFile;
        }
      }
    }

    return Object.values(folderMap);
  }

  convertNameToFile(name: string): string {
    return name.replace(/\D/g, "");
  }
  private extractFolderAndFile(path: string): { folderName: string | null; fileName: string } {
    const parts = path.split('/');
    if (parts.length > 1) {
      return { folderName: parts[0], fileName: parts.pop() || '' };
    }
    return { folderName: null, fileName: path };
  }
  private isValidImage(fileName: string): boolean {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension ? this.imageExtensions.includes(extension) : false;
  }

}
