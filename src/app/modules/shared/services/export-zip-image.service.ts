import { Injectable } from '@angular/core';
import * as fs from 'file-saver';
import * as JSZip from "jszip";
import {DmCapdo} from "@shared/models/danh-muc";
@Injectable({
  providedIn: 'root'
})
export class ExportZipImageService {

  constructor() { }

  async exportImageByZip(arr:DmCapdo[] ,file_name:string,keySearch:string){
    // var zip = new JSZip();
    // var img = zip.folder(file_name);
    // arr.forEach((e)=>{
    //   const file = e['anh_chandung'][0]['title'];
    //   img.file(file, e[keySearch], {base64: true});
    // })
    // zip.generateAsync({type:"blob"})
    //   .then(function(content) {
    //     fs(content,  file_name + ".zip");
    //   });


    const zip = new JSZip();
    const file = zip.folder(file_name);

    if (!file) {
      console.error("Không thể tạo thư mục trong file zip.");
      return;
    }


    for( const item of arr){
      const img = file.folder(item.title);
      const arrImg = item['_thisinh'];
      if(arrImg && arrImg.length > 0){
        for (const e of arrImg) {
          try {
            const fileName:string = e['_avatarName']; // Đảm bảo tên file không undefined
            const base64Data:string = e[keySearch];

            if (typeof base64Data === "string") {
              img.file(fileName, base64Data.replace('data:image/jpeg;base64,',''), { base64: true });
            } else {
              console.warn(`Dữ liệu không hợp lệ cho file: ${fileName}`);
            }
          } catch (error) {
            console.error("Lỗi khi xử lý một phần tử:", error);
          }
        }
      }
    }

    try {
      const content = await zip.generateAsync({ type: "blob" });
      fs(content, file_name + ".zip");
    } catch (error) {
      console.error("Lỗi khi tạo file zip:", error);
    }
  }

}
