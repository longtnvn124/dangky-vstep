import {Injectable} from '@angular/core';
import { saveAs } from 'file-saver';
import {ThptHoiDongPhongThi} from "@shared/models/thpt-model";
import {asBlob} from "@shared/vendor/html-docx";


import {DmPhongThi} from "@shared/services/danh-muc-phong-thi.service";
import {NotificationService} from "@core/services/notification.service";



@Injectable({
  providedIn: 'root'
})
export class HtmlToPdfService {

  constructor(
    private notificationService:NotificationService

  ) {
  }

  async exportHtmlToWord(item:ThptHoiDongPhongThi[], fileName: string){
    let htmlContent =  `<!DOCTYPE html>
        <html lang="en">
            <head>
              <meta charset="UTF-8">
              <title>Document</title>


            </head>
            <body>
                <table style="width:100%;">
                    <tr>
                        <td>
                            <div style="width:100%; display: block; text-align: center;">
                                <p style="margin: 0;">ĐẠI HỌC THÁI NGUYÊN</p>
                                <p style="margin: 0;"><strong>HỘI ĐỒNG THI ĐGĐV ĐẠI HỌC</strong></p>
                                <p style="margin: 0;"><strong>TRÊN MÁY TÍNH NĂM …</strong></p>
                            </div>
                        </td>
                        <td>
                            <div style="width:100%; display: block; text-align: center;">
                                <p style="margin:0"><strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong></p>
                                <p style="margin:0"><strong>Độc lập - Tự do - Hạnh phúc</strong></p>
                            </div>
                        </td>
                    </tr>
                </table>
            `;
    item.forEach(phongthi=>{

      htmlContent += `
        <table style="width:100%;padding: 40px 0;">
            <tr>
                <td>
                    <div style="display: flex; flex-direction: column; justify-content: center">
                        <p style="margin:0"><strong>CA THI: </strong> <span>${phongthi['__ten_cathi']}</span></p>
                        <p style="margin:0"><strong>NGÀY THI: </strong> <span>${phongthi['__ngaythi']}</span></p>
                        <p style="margin:0"><strong>PHÒNG THI: </strong> <span>${phongthi.ten_phongthi}</span></p>
                    </div>
                </td>
                <td>
                    <div style="display: block; text-align: center">
                        <p style="margin:0;font-size: 16px;"><strong>DANH SÁCH ẢNH THÍ SINH</strong></p>
                        <p style="margin:0;font-size: 16px;;"><strong>KỲ THI NGÀY …</strong></p>
                    </div>
                </td>
            </tr>
        </table>
      `;

      htmlContent += `
        <table style="width: 100%;border-collapse: collapse;padding:20px;">

            `;

      const thisinhs = phongthi['__thisinh_in_phong']
      thisinhs.forEach((item ,index)=>{
        const sbd= phongthi['hoidong'].tiento_sobaodanh + this.covertId(item.id) ;
        // const imgObject =  item['__img_object'];
        const hoten = item['hoten'];
        const cccd = item['cccd_so'];
        if(index % 3 == 0){
          htmlContent += `<tr>`;
        }
        htmlContent += `<td style="border: 1px solid #393939;padding: 8px;">
                <div style="display: block;width: 100%; text-align: center;">
                    <div style="width:100%">
                    <img width="150" height="225" src="${item['_avatarSrc']}">
                    </div>
                    <p style="margin:0;font-size:13px;">${sbd}</p>
                    <p style="margin:0;font-size:13px;">${hoten}</p>
                    <p style="margin:0;font-size:13px;">${cccd}</p>
                </div>
            </td>`;
        if((index + 1) % 3 == 0 ){
          htmlContent += `</tr>`;
        }
      })

      htmlContent += `</table>`;
    })

    htmlContent +=`</body></html>`;
    try {
    			const fileBuffer = await asBlob(htmlContent , {
    				orientation : 'portrait' ,
    				margins     : {
    					top    : 1000 ,
    					right  : 1000 ,
    					bottom : 1000 ,
    					left   : 1000 ,
    					header : 440 ,
    					footer : 0 ,
    					gutter : 0
    				}
    			} );
    			saveAs( fileBuffer , fileName + '.docx' );

    		} catch ( e ) {
    			console.log( e );
    		}
  }


  async exportHtmlToWordV2(item:DmPhongThi[], fileName: string){

    this.notificationService.isProcessing(true);
    let htmlContent =  `<!DOCTYPE html>
        <html lang="en">
            <head>
              <meta charset="UTF-8">
              <title>Document</title>


            </head>
            <body>
                <table style="width:100%;">
                    <tr>
                        <td>
                            <div style="width:100%; display: block; text-align: center;">
                                <p style="margin: 0;">ĐẠI HỌC THÁI NGUYÊN</p>
                                <p style="margin: 0;"><strong>HỘI ĐỒNG THI ĐGĐV ĐẠI HỌC</strong></p>
                                <p style="margin: 0;"><strong>TRÊN MÁY TÍNH NĂM …</strong></p>
                            </div>
                        </td>
                        <td>
                            <div style="width:100%; display: block; text-align: center;">
                                <p style="margin:0"><strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong></p>
                                <p style="margin:0"><strong>Độc lập - Tự do - Hạnh phúc</strong></p>
                            </div>
                        </td>
                    </tr>
                </table>
            `;
    item.forEach(phongthi=>{

      htmlContent += `

        <table style="width:100%;padding: 40px 0;">
            <tr>
                <td>
                    <div style="display: flex; flex-direction: column; justify-content: center">
                        <p style="margin:0"><strong>CA THI: ...</span></p>
                        <p style="margin:0"><strong>NGÀY THI: </strong> <span>02/06/2024</span></p>
                        <p style="margin:0"><strong>PHÒNG THI: </strong> <span>${phongthi['phongso']}</span></p>
                    </div>
                </td>
                <td>
                    <div style="display: block; text-align: center">
                        <p style="margin:0;font-size: 16px;"><strong>DANH SÁCH ẢNH THÍ SINH</strong></p>
                        <p style="margin:0;font-size: 16px;;"><strong>KỲ THI NGÀY …</strong></p>
                    </div>
                </td>
            </tr>
        </table>
      `;

      htmlContent += `
        <table style="width: 100%;border-collapse: collapse;padding:20px;">

            `;

      const thisinhs = phongthi['thisinhs']

      thisinhs.forEach((item ,index)=>{
        const sbd= item['sobaodanh'] ;
        // const imgObject =  item['__img_object'];
        const thisinh_id = item['thisinh']['id']
        const hoten = item['thisinh']['hoten'];
        const cccd = item['thisinh']['cccd_so'];
        if(index % 3 == 0){
          htmlContent += `<tr>`;
        }
        htmlContent += `<td style="border: 1px solid #393939;padding: 8px;">
                <div style="display: block;width: 100%; text-align: center;">
                    <div style="width:100%">
                    <img width="150" height="225" src="${item['_avatarSrc']}">
                    </div>
                    <p style="margin:0;font-size:13px;">${sbd}</p>
                    <p style="margin:0;font-size:13px;">${hoten}</p>
                    <p style="margin:0;font-size:13px;">${cccd}</p>
                </div>
            </td>`;
        if((index + 1) % 3 == 0 ){
          htmlContent += `</tr>`;
        }
      })

      htmlContent += `</table>
      <p style="page-break-inside: auto;"></p>
    `;
    })

    htmlContent +=`</body></html>`;
    try {
      const fileBuffer = await asBlob(htmlContent , {
        orientation : 'portrait' ,
        margins     : {
          top    : 1000 ,
          right  : 1000 ,
          bottom : 1000 ,
          left   : 1000 ,
          header : 440 ,
          footer : 0 ,
          gutter : 0
        }
      } );
      await saveAs( fileBuffer , fileName + '.docx' );

    } catch ( e ) {
      console.log( e );
    }
  }
  covertId(iput:number){
    return iput<10? '000'+iput: (iput>=10 && iput<100 ? '00'+ iput : (iput>=100 && iput<1000 ? '0' +iput :iput));
  }
  covertNumber(iput:number){
    return iput<10? '0'+iput: iput.toString();
  }


  async exportTuiDungPhieuByHTMLtoWord(phongthis:any[],fileName:string){
    let htmlContent =  `<!DOCTYPE html>
        <html lang="en">
            <head>
              <meta charset="UTF-8">
              <title>Document</title>
              <style>
              *{
              font-family: "Times New Roman";
              }
              .table-view,
              .table-view td{
                border: 1px solid black;
                border-collapse: collapse;
              }

              </style>
            </head>
            <body>
                `;

    phongthis.forEach(phongthi=>{
      const cathis = phongthi['cathis'];
      cathis.forEach(cathi=>{
        htmlContent += `

        <div style="width:100%; height: 900px;padding:5px;position: relative;">
            <p style="top:10px;left: 10px; width: 100%;height: 900px;position: absolute; margin: -10px;border:1px solid #000000;box-sizing: border-box;">

            </p>

            <div style="width:100%;text-align: center;display: block">
                  <p style="margin: 0;font-size:20px">ĐẠI HỌC THÁI NGUYÊN</p>
                  <p style="margin: 0;font-size:20px"><strong><u>HỘI ĐỒNG THI V-SAT</u></strong></p>
                  <p style="width:300px;height:2px;background:#000000"></p>
            </div>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <p style="font-size:40px;text-align: center"><strong>TÚI ĐỰNG PHIẾU TÀI KHOẢN</strong></p>
            <br>
            <p style="font-size:25px;text-indent:20px"><strong>Ngày thi: ${phongthi['hoidong']['__ngaythi']}</strong></p>
            <p style="font-size:25px;text-indent:20px"> <strong>Địa điểm thi: Trung tâm Khảo thí và Quản lý chất lượng Giáo dục, Đại học Thái Nguyên</strong></p>

            <table style="width: 100%">
                <tr >
                    <td style="font-size:25px;padding-left:20px">
                        <p style="margin:0"><strong>PHÒNG THI SỐ: ${phongthi['phongthi']}</strong></p>
                    </td>
                    <td style="font-size:25px;">
                        <p style="margin:0"><strong>CA THI SỐ: ${cathi['id']}</strong></p>
                    </td>
                </tr>
            </table>
            <br>

            <table class="table-view" style="width:100%;font-size: 18px;">
                <tr>
                    <td style="text-align:center;width:150px" rowspan="2"><p style="margin: 0"><strong>Môn thi </strong></p></td>
                    <td style="text-align:center;width:calc(100% / 7)" rowspan="2">
                        <div>
                            <p style="margin: 0"><strong>Số PTK</strong></p>
                            <p style="margin: 0"><strong>chính thức </strong></p>
                        </div>
                    </td>
                    <td style="text-align:center;width:calc(100% / 7)" rowspan="2">
                        <div style="text-align:center;">
                            <p style="margin: 0"><strong>Số PTK</strong></p>
                            <p style="margin: 0"><strong>dự phòng </strong></p>
                        </div>
                    </td>
                    <td style="text-align:center;width:calc(2 * 100% / 7)" rowspan="1" colspan="2">
                        <div style="text-align:center">
                            <p style="margin: 0"><strong>Số PTK</strong></p>
                            <p style="margin: 0"><strong>đã sử dụng</strong></p>
                        </div></td>
                    <td style="text-align:center;width:calc(2 * 100% / 7)" rowspan="1" colspan="2">
                        <div style="text-align:center">
                        <p style="margin: 0"><strong>Số PTK</strong></p>
                        <p style="margin: 0"><strong>chưa sử dụng</strong></p>
                        </div></td>
                </tr>
                <tr>
                    <td style="text-align:center;" rowspan="1" colspan="1">
                        <div>
                            <p style="margin: 0"><strong>Chính</strong></p>
                            <p style="margin: 0"><strong>thức</strong></p>
                        </div></td>
                    <td style="text-align:center;" rowspan="1" colspan="1">
                        <div>
                            <p style="margin: 0"><strong>Dự</strong></p>
                            <p style="margin: 0"><strong>phòng</strong></p>
                        </div></td>
                    <td style="text-align:center;" rowspan="1" colspan="1">
                        <div>
                            <p style="margin: 0"><strong>Chính</strong></p>
                            <p style="margin: 0"><strong>thức</strong></p>
                        </div></td>
                    <td style="text-align:center;" rowspan="1" colspan="1">
                        <div>
                            <p style="margin: 0"><strong>Dự</strong></p>
                            <p style="margin: 0"><strong>phòng</strong></p>
                        </div></td>
                </tr>

            `;
        let total_cathi = 0;
        let total_phieuthi_inca = 0;
        if(cathi['_total_ca_th']>0){
          total_cathi =total_cathi +1;
          total_phieuthi_inca =  total_phieuthi_inca +cathi['_total_ca_th'];
          htmlContent +=`
            <tr>
             <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0">Toán</p></td>
             <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0">${this.covertNumber(cathi['_total_ca_th'])}</p></td>
             <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0">05</p></td>
             <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0"></p></td>
             <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0"></p></td>
             <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0"></p></td>
             <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0"></p></td>
            </tr>
          `;
        }
        if(cathi['_total_ca_vl']>0){
          total_cathi =total_cathi +1;
          total_phieuthi_inca =  total_phieuthi_inca +cathi['_total_ca_vl'];

          htmlContent +=`
            <tr><td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0">Vật lí</p></td>
             <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0">${this.covertNumber(cathi['_total_ca_vl'])}</p></td>
             <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0">05</p></td>
             <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0"></p></td>
             <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0"></p></td>
             <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0"></p></td>
             <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0"></p></td>

             </tr>
          `;
        }
        if(cathi['_total_ca_hh']>0){
          total_cathi =total_cathi +1;
          total_phieuthi_inca =  total_phieuthi_inca +cathi['_total_ca_hh'];

          htmlContent +=`
            <tr>
              <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0">Hóa học</p><p style="margin: 0"></td>
              <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0">${this.covertNumber(cathi['_total_ca_hh'])}</p></td>
              <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0">05</p></td>
              <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0"></p></td>
              <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0"></p></td>
              <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0"></p></td>
              <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0"></p></td>
            </tr>
          `;
        }
        if(cathi['_total_ca_sh']>0){
          total_cathi =total_cathi + 1;
          total_phieuthi_inca =  total_phieuthi_inca +cathi['_total_ca_sh'];

          htmlContent +=`
             <tr>
                <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0">Sinh học</p></td>
                <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0">${this.covertNumber(cathi['_total_ca_sh'])}</p></td>
                <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0">05</p></td>
                <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0"></p></td>
                <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0"></p></td>
                <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0"></p></td>
                <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0"></p></td>
             </tr>
          `;
        }
        if(cathi['_total_ca_ls']>0) {

          total_cathi = total_cathi + 1;
          total_phieuthi_inca =  total_phieuthi_inca +cathi['_total_ca_ls'];

          htmlContent += `
            <tr>
             <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0">Lịch sử</p></td>
             <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0">${this.covertNumber(cathi['_total_ca_ls'])}</p></td>
             <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0">05</p></td>
             <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0"></p></td>
             <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0"></p></td>
             <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0"></p></td>
             <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0"></p></td>
            </tr>

          `;
        }
        if(cathi['_total_ca_dl']>0){
          total_cathi = total_cathi + 1;
          total_phieuthi_inca =  total_phieuthi_inca +cathi['_total_ca_dl'];
          htmlContent +=`
            <tr>
                <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0">Địa lí</p></td>
             <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0">${this.covertNumber(cathi['_total_ca_dl'])}</p></td>
             <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0">05</p></td>
             <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0"></p></td>
             <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0"></p></td>
             <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0"></p></td>
             <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0"></p></td>
            </tr>
          `;
        }
        if(cathi['_total_ca_ta']>0){
          total_cathi = total_cathi + 1;
          total_phieuthi_inca =  total_phieuthi_inca +cathi['_total_ca_ta'];

          htmlContent +=`
            <tr>
                <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0">Tiếng Anh</p></td>
                <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0">${this.covertNumber(cathi['_total_ca_ta'])}</p></td>
                <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0">05</p></td>
                <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0"></p></td>
                <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0"></p></td>
                <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0"></p></td>
                <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0"></p></td>
            </tr>
          `;
        }

        htmlContent +=`
         <tr>
            <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0"><strong>Tổng cộng</strong></p> </td>
            <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0"><strong> ${this.covertNumber(total_phieuthi_inca)}</strong></p></td>
            <td style="text-align:center;" rowspan="1" colspan="1"><p style="margin: 0"><strong>${this.covertNumber(total_cathi *5)}</strong></p></td>
            <td style="text-align:center;" rowspan="1" colspan="1"><p></p></td>
            <td style="text-align:center;" rowspan="1" colspan="1"><p></p></td>
            <td style="text-align:center;" rowspan="1" colspan="1"><p></p></td>
            <td style="text-align:center;" rowspan="1" colspan="1"><p></p></td>

         </tr>
         </table>
         <br>
         <p style="margin: 0; font-size:18px;" ><i>Lưu ý: CBCT thu lại phiếu tài khoản của thí sinh sau khi thi xong</i></p>
         <br>
         <br>
         <table style="width:100%;">
            <tr>
                <td style="text-align: center">
                    <div >
                        <p style="margin: 0;font-size:18px;"><strong><i>Cán bộ coi thi 1</i></strong></p>
                        <p style="margin: 0;font-size:18px;"><i>(Ký và ghi rõ họ tên)</i></p>
                    </div>
                </td>
                <td style="text-align: center">
                    <div >
                        <p style="margin: 0;font-size:18px;"><strong><i>Cán bộ coi thi 2</i></strong></p>
                        <p style="margin: 0;font-size:18px;"><i>(Ký và ghi rõ họ tên)</i></p>
                    </div>
                </td>
            </tr>

         </table>


        </div>

        <div style="page-break-before:always;"><br></div>

        `;





      })

    })

    htmlContent +=`</body></html>`;

    try {
      const fileBuffer = await asBlob(htmlContent , {
        orientation : 'portrait' ,
        margins     : {
          top    : 1000 ,
          right  : 1000 ,
          bottom : 1000 ,
          left   : 1000 ,
          header : 0 ,
          footer : 0 ,
          gutter : 0
        }
      } );
      saveAs( fileBuffer , fileName + '.docx' );

    } catch ( e ) {
      console.log( e );
    }
  }
}
