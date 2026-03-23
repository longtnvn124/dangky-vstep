import { Injectable } from '@angular/core';
import {asBlob} from "@shared/vendor/html-docx";
import { saveAs } from 'file-saver';
@Injectable({
  providedIn: 'root'
})
export class ExWordVstepService {

  constructor() { }

  replacePhonngso(num:number){
    return  num.toString().padStart(2, '0')
  }

  convertDateTimeByPhong(text1:string){
    const textiDate =new Date(text1);

    return textiDate.getDate() + '/'+ (textiDate.getMonth() + 1) + '/' + textiDate.getFullYear();
  }

  // -------------------biển phòng thi--------------
  async bienphongthi(phongthis: any[], fileName: string) {
    let htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Document</title>
    <style>
      * {
              font-family: 'ui-serif'  !important;
      }
      .page {
        width: 100%;
        height: 100%;
        padding: 20px 40px 40px;
        box-sizing: border-box;
        border: 5px double #4472C4;
        /*margin: auto;*/
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        page-break-after: always;
      }
      .title {
        font-size: 70px;
        color: #4472C4;;
        font-weight: bold;
        /*background-color: yellow;*/
        padding: 5px 10px;
        margin-bottom: 10px;
      }
      .subtitle {
        font-size:180px;
        font-weight: bold;
        color: #C00000;;

        /*background-color: yellow;*/
        padding: 2px 10px;
        margin-bottom: 100px;
        text-decoration: underline;
      }
      .info {
        font-size: 30px;
        font-weight: bold;
        margin-bottom: 30px;

      }
      .time {
        color: black;
        font-size: 25px;

        /*background-color: yellow;*/
        font-weight: bold;
        padding: 0 6px;
      }
      .dotthi {
        text-align: center;
        font-style: italic;
        color: #4472C4;
        font-size: 25px;
        font-weight: bold;
        /*margin-top: 30px;*/
      }
    </style>
  </head>
  <body>
  `;

    for (let item of phongthis) {
      htmlContent += `
    <div class="page">
      <div style="text-align: center;">
        <p style=" color: #4472C4;,font-size:22px;font-weight: bold;margin-top:0;">ĐẠI HỌC THÁI NGUYÊN</p>
        <p style=" color: #4472C4;,font-size:25px;font-weight: bold;margin-bottom: 50px;">HỘI ĐỒNG THI ĐÁNH GIÁ NĂNG LỰC NGOẠI NGỮ</p>
         <p class="title">PHÒNG THI SỐ</p>
        <p class="subtitle" style="margin-bottom: 70px;">${this.replacePhonngso(item.phongthi)}</p>
        <p style="margin:0 auto;border:1px solid #000;width:300px;"></p>
        <p class="dotthi">Điểm thi: ${item['_diemthi']['title']} </p>
      </div>
    </div>
<!--    <span style="page-break-after: always;"><br></span>-->
    `;
    }

    htmlContent += `</body></html>`;
    try {
      const fileBuffer = await asBlob(htmlContent , {
        orientation : 'landscape' ,
        size: 'A4',
        margins     : {
          top    : 1300 ,
          right  : 1500 ,
          bottom : 1000 ,
          left   : 1500 ,
          header : 0 ,
          footer : 0 ,
          gutter : 0
        },
      } );
      saveAs( fileBuffer , fileName + '.docx' );

    } catch ( e ) {
      console.log( e );
    }
  }

  async  tuidungHosophongthi(phongthis:any[],fileName:string) {
    let htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Document</title>
    <style>
      * {
              font-family: "Times New Roman"  !important;
      }
      .table-border{}
      .table-border{width:100%;border-collapse: collapse;border:1px solid #000;}
      .table-border tr,.table-border td,.table-border th{font-size: 14px; border:1px solid #000;}
    </style>
  </head>
  <body>
  `;

    for (let item of phongthis) {
      htmlContent += `

    <table style="border:3px solid black; width:100%; height:100%; border-collapse:collapse; page-break-after: always;">
    <tr>
    <td style="padding: 20px 40px 40px; text-align: center; vertical-align: middle;">
        <p style="font-size:18px; text-align:center;margin-bottom:0;padding-bottom: 0">ĐẠI HỌC THÁI NGUYÊN</p>
        <p style="font-size:18px; text-align:center;margin:0;"><strong>HỘI ĐỒNG THI ĐÁNH GIÁ NLNN</strong></p>
        <p style="margin:50px">
            <br>

        </p>



        <p style="font-size:36px; text-align:center;margin:0 40px;"><strong>TÚI ĐỰNG </strong></p>
        <p style="font-size:36px; text-align:center;margin:0 40px;"><strong>HỒ SƠ PHÒNG THI</strong></p>
        <p style="font-size:24px; text-align:center;margin:0 40px;"><strong>PHÒNG THI SỐ: ${this.replacePhonngso(item['phongthi'])}</strong></p>

        <br>
        <p style="font-size:18px; text-align:center;margin:40px 0;"><strong>NGÀY THI:</strong> ${this.convertDateTimeByPhong(item['ngaythi'])}
        ; <strong>CA THI:</strong> ${item['thoigian_duthi']}; <strong>NGÔN NGỮ:</strong> Tiếng anh</p>

        <p><br></p>

        <p style="text-align: left;font-size: 17px;margin:6px 0;"><strong>- TỔNG SỐ THÍ SINH(THEO DANH SÁCH): ${item['_listThisinh'].length}</strong> </p>
        <p style="text-align: left;font-size: 17px;margin:6px 0;"><strong>- TỔNG SỐ THÍ SINH DỰ THI:</strong>.............................</p>
        <p style="text-align: left;font-size: 17px;margin:6px 0;"><strong>- TỔNG SỐ THÍ SINH VẮNG:</strong>..................................</p>


         <p><br></p>
         <p style="text-align: left;"><strong><u>Túi đựng hồ sơ phòng thi gồm:</u></strong></p>

         <p style="text-align: left;margin:6px 0;"><strong>1. </strong><span>Danh sách thís sinh nộp bài</span> </p>
         <p style="text-align: left;margin:6px 0;"><strong>2. </strong><span>Giấy cam đoan nến có </span> </p>
         <p style="text-align: left;margin:6px 0;"><strong>3. </strong><span>Danh sách xác nhận thông tin cá nhân</span> </p>
         <p style="text-align: left;margin:6px 0;"><strong>4. </strong><span>BB Mở niêm phong phòng thi</span> </p>
         <p style="text-align: left;margin:6px 0;"><strong>5. </strong><span>BB mở túi đựng phiếu tài khoản</span> </p>
         <p style="text-align: left;margin:6px 0;"><strong>6. </strong><span>Các biên bản khác lập tại phòng thi (nếu có)</span> </p>
         <p style="margin:20px">
            <br>
         </p>
         <p style="margin:20px">
            <br>
         </p>
         <p style="margin:20px">
            <br>
         </p>
         <p style="margin:10px">
            <br>
         </p>

         <p><strong>Điểm dự thi: </strong> ${item['_diemthi']['title']}</p>

       </td>

       </tr>
    </table>



<!--    <p style="page-break-after: always"><br/></p>-->

    `;
    }

    htmlContent += `</body></html>`;
    try {
      const fileBuffer = await asBlob(htmlContent , {
        orientation : 'portrait' ,
        size: 'A4Doc',
        margins     : {
          top    : 1000 ,
          right  : 1500 ,
          bottom : 1000 ,
          left   : 1500 ,
          header : 0 ,
          footer : 0 ,
          gutter : 0
        },
      } );
      saveAs( fileBuffer , fileName + '.docx' );

    } catch ( e ) {
      console.log( e );
    }
  }

  async  tuidungPhieutaikhoan(phongthis:any[],fileName:string) {
    let htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Document</title>
    <style>
      * {
              font-family: "Times New Roman"  !important;
      }

      .table-border{border-collapse: collapse;border:1px solid #000;}
      .table-border tr,.table-border td,.table-border th{font-size: 14px; border:1px solid #000;padding:4px;}
    </style>
  </head>
  <body>
  `;

    for (let item of phongthis) {
      htmlContent += `

    <table style="border:3px solid black; width:100%; height:100%; border-collapse:collapse; page-break-after: always;">
    <tr>
    <td style="padding: 20px 40px 40px; text-align: center; vertical-align: middle;">
        <p style="font-size:18px; text-align:center;margin-bottom:0;padding-bottom: 0">ĐẠI HỌC THÁI NGUYÊN</p>
        <p style="font-size:18px; text-align:center;margin:0;"><strong>HỘI ĐỒNG THI ĐÁNH GIÁ NLNN</strong></p>
        <p style="margin:50px">
            <br>

        </p>



        <p style="font-size:36px; text-align:center;margin:40px 0; "><strong>TÚI ĐỰNG PHIẾU TÀI KHOẢN</strong></p>

        <p style="font-size:24px; text-align:center;margin:0 40px;"><strong>PHÒNG THI SỐ: ${this.replacePhonngso(item['phongthi'])}</strong></p>

        <br>
        <p style="font-size:18px; text-align:center;margin:10px 0 40px;"><strong>NGÀY THI:</strong> ${this.convertDateTimeByPhong(item['ngaythi'])}
        ; <strong>CA THI:</strong> ${item['thoigian_duthi']}; <strong>NGÔN NGỮ:</strong> Tiếng anh</p>

        <p><br></p>

        <table class="table-border" style="width:500px ;height:100%;">
            <tr style="width: 100%;" >
                <td style="width:60%;">
                    <p style="font-size: 17px;margin:4px;"><strong>1. Tổng số phiếu tài khoản dùng cho thí sinh</strong></p>
                </td>
                <td style="width:40%;">
                    <p style="font-size: 17px;margin:4px;"><strong>Chính thức :...................</strong></p>
                    <p style="font-size: 17px;margin:4px;"><strong>Dự phòng :......................</strong></p>

                </td>
            </tr>
            <tr>
                <td>
                    <p style="font-size: 17px;margin:4px;">Đã sử dụng</p>
                </td>
                <td>
                    <p style="font-size: 17px;margin:4px;"><strong>Chính thức :...................</strong></p>
                    <p style="font-size: 17px;margin:4px;"><strong>Dự phòng :......................</strong></p>

                </td>
            </tr>
            <tr>
                <td>
                    <p style="font-size: 17px;margin:4px;">Chưa sử dụng</p>
                </td>
                <td>
                    <p style="font-size: 17px;margin:4px;"><strong>Chính thức :...................</strong></p>
                    <p style="font-size: 17px;margin:4px;"><strong>Dự phòng :......................</strong></p>

                </td>
            </tr>
            <tr>
                <td>
                    <p style="font-size: 17px;margin:4px;"><strong>2. Tài khoản cán bộ coi thi</strong></p>
                </td>
                <td >
                    <p style="font-size: 17px;margin:4px;"><strong>01</strong></p>
                </td>
            </tr>

        </table>

         <p style="margin:20px;font-style:italic;font-size: 17px;">
            <span>Lưu ý: CBCT thu lại phiếu tài khoản của thí sinh sau khi thi xong.</span>
         </p>
         <p style="margin:30px">
            <br>
         </p>
         <p style="margin:30px">
            <br>
         </p>
         <p style="margin:30px">
            <br>
         </p>
        <p style="margin:40px">
            <br>
         </p>

         <p><strong>Điểm dự thi: </strong> ${item['_diemthi']['title']}</p>

       </td>

       </tr>
    </table>



<!--    <p style="page-break-after: always"><br/></p>-->

    `;
    }

    htmlContent += `</body></html>`;
    try {
      const fileBuffer = await asBlob(htmlContent , {
        orientation : 'portrait' ,
        size: 'A4Doc',
        margins     : {
          top    : 1000 ,
          right  : 1500 ,
          bottom : 1000 ,
          left   : 1500 ,
          header : 0 ,
          footer : 0 ,
          gutter : 0
        },
      } );
      saveAs( fileBuffer , fileName + '.docx' );

    } catch ( e ) {
      console.log( e );
    }
  }



}
