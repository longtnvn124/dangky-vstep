import {Injectable} from '@angular/core';
import {asBlob} from "@shared/vendor/html-docx";
import {saveAs} from 'file-saver';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {NotificationService} from "@core/services/notification.service";

@Injectable({
  providedIn: 'root'
})
export class ExWordVstepService {

  constructor(
    private notifi: NotificationService
  ) {
  }

  replacePhonngso(num: number) {
    return num.toString().padStart(2, '0')
  }

  convertDateTimeByPhong(text1: string) {
    const textiDate = new Date(text1);

    return textiDate.getDate() + '/' + (textiDate.getMonth() + 1) + '/' + textiDate.getFullYear();
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
      const fileBuffer = await asBlob(htmlContent, {
        orientation: 'landscape',
        size: 'A4',
        margins: {
          top: 1300,
          right: 1500,
          bottom: 1000,
          left: 1500,
          header: 0,
          footer: 0,
          gutter: 0
        },
      });
      saveAs(fileBuffer, fileName + '.docx');

    } catch (e) {
      console.log(e);
    }
  }

  async tuidungHosophongthi(phongthis: any[], fileName: string, ngonnguName: string) {
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
        ; <strong>CA THI:</strong> ${item['thoigian_duthi']}; <strong>NGÔN NGỮ:</strong> ${ngonnguName ? ngonnguName : 'Tiếng anh'}</p>

        <p><br></p>

        <p style="text-align: left;font-size: 17px;margin:6px 0;"><strong>- TỔNG SỐ THÍ SINH(THEO DANH SÁCH): ${item['_listThisinh'].length}</strong> </p>
        <p style="text-align: left;font-size: 17px;margin:6px 0;"><strong>- TỔNG SỐ THÍ SINH DỰ THI:</strong>.............................</p>
        <p style="text-align: left;font-size: 17px;margin:6px 0;"><strong>- TỔNG SỐ THÍ SINH VẮNG:</strong>................................</p>


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
      const fileBuffer = await asBlob(htmlContent, {
        orientation: 'portrait',
        size: 'A4Doc',
        margins: {
          top: 1000,
          right: 1500,
          bottom: 1000,
          left: 1500,
          header: 0,
          footer: 0,
          gutter: 0
        },
      });
      saveAs(fileBuffer, fileName + '.docx');

    } catch (e) {
      console.log(e);
    }
  }

  async tuidungPhieutaikhoan(phongthis: any[], fileName: string, ngonnguName: string) {
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
        ; <strong>CA THI:</strong> ${item['thoigian_duthi']}; <strong>NGÔN NGỮ:</strong> ${ngonnguName ? ngonnguName : 'Tiếng anh'}</p>

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
    `;
    }

    htmlContent += `</body></html>`;
    try {
      const fileBuffer = await asBlob(htmlContent, {
        orientation: 'portrait',
        size: 'A4Doc',
        margins: {
          top: 1000,
          right: 1500,
          bottom: 1000,
          left: 1500,
          header: 0,
          footer: 0,
          gutter: 0
        },
      });
      saveAs(fileBuffer, fileName + '.docx');

    } catch (e) {
      console.log(e);
    }
  }


  async hosoLuutruThisinh(data:any[], fileName:string) {

    let htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
            <head>
             <meta charset="UTF-8">
             <title>Document</title>
            <style>
                *{font-family:"roboto" !important;font-size:15px;font-weight: 400;}
                .table-border{border-collapse: collapse;border:1px solid #000;}
                .table-border tr,.table-border td,.table-border th{font-size:14px;border:1px solid #000;padding:4px;}
                .anh-the{padding:10px;border:1px solid #0f1419;background:#fff;min-width:160px;display:flex;justify-content:center;flex-direction:column;}
                .anh-the img{height:100%;width:unset;}
                .table-flex{display:flex;flex-direction:column;width:100%;border-top:1px solid #dee2e6;border-left:1px solid #dee2e6;}
                .table-flex-row{display:flex;width:100%;}
                .table-flex-cell{flex:1 1 auto;padding:6px 8px;border-bottom:1px solid #dee2e6;border-right:1px solid #dee2e6;}
                .table-flex-cell.colspan-2{flex:2 1 66.666%;}
                .table-flex-cell.colspan-3{flex:3 1 100%;}
                .pdf-page{width:210mm;min-height:297mm;background:#fff;box-sizing:border-box;padding:20px 40px;}
                .page-break{page-break-before:always;}
                .row{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;margin-right:-15px;margin-left:-15px};
                .row-cols-2>*{-ms-flex:0 0 50%;flex:0 0 50%;max-width:50%}
                .col-6{position:relative;width:100%;padding-right:15px;padding-left:15px}
                .--font-times-new-roman {font-family: TimesNewRoman, "Times New Roman", Times, Baskerville, Georgia, serif;}
            </style>
        </head>
        <body>
            <div id="pdf-content">
`;



    for(const item of data){
      htmlContent += `
        <div class="pdf-page" style="page-break-after:always;">
            <table style="width:100%;">
                <tr>
                    <td style="width:40%">

                        <div class="--font-times-new-roman" style="font-size:18px; display: flex;justify-content:center;align-items: center;flex-direction: column">
                            <div>ĐẠI HỌC THÁI NGUYÊN</div>
                            <div style="font-weight: 500"><u>HỘI ĐỒNG THI ĐÁNH GIÁ NLNN</u></div>
                        </div>
                    </td>
                    <td style="width:60%">
                        <div class="--font-times-new-roman" style="font-size:18px; display: flex;justify-content:center;align-items: center;flex-direction: column">
                            <div><strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong></div>
                            <div style="font-weight: 500;text-decoration: underline">Độc lập – Tự do – Hạnh phúc</div>
                        </div>

                    </td>
                </tr>
            </table>


            <div style="text-align:center;font-size:28px;margin-top;10px;">
                <strong>PHIẾU ĐĂNG KÝ DỰ THI</strong>
            </div>
            <div style="text-align:center;font-size:28px;">
                <strong>ĐÁNH GIÁ NĂNG LỰC NGOẠI NGỮ CỦA ĐẠI HỌC THÁI NGUYÊN</strong>
            </div>

            <div class="row row-cols-2">
                <div class="col-6" style="display: flex;justify-content: center;">
                    <div class="anh-the " style="display: flex;justify-content: center;height: 200px;" >
                        <img src="${item.anh_chandung || ''}">
                    </div>
                </div>
                <div class="col-6" >
                    <div class="anh-the " style="display: flex;justify-content: center; height:200px;" >
                         ${item.doituong_anhthe ? `<img src="${item.doituong_anhthe}">`: `<div style="text-align:center">Ảnh thẻ sinh viên<br>(Nếu có)</div>`}
                    </div>
                </div>
            </div>



            <div class="table-flex mt-2">
                <div class="table-flex-row"style="background:#C1E4F5">
                    <div class="table-flex-cell colspan-3">
                        <strong>PHẦN I - THÔNG TIN CÁ NHÂN</strong></div>
                    </div>
                <div class="table-flex-row">
                    <div class="table-flex-cell colspan-2">1. Họ và tên: ${item.hoten || ''}</div>
                    <div class="table-flex-cell colspan-2">2. Giới tính: ${item.gioitinh=='name'?'☑ Nam':'☐ Nam'}&nbsp; ${item.gioitinh!='name'?'☑ Nữ':'☐ Nữ'}</div>
                </div>

                <div class="table-flex-row">
                    <div class="table-flex-cell colspan-2" >3. Ngày sinh: ${item.ngaysinh || ''}</div>
                    <div class="table-flex-cell colspan-2">4. Nơi sinh: ${item.noisinh || ''}</div>
                </div>
                <div class="table-flex-row">
                    <div class="table-flex-cell">5. CCCD: ${item.cccd_so || ''}</div>
                    <div class="table-flex-cell">6. Ngày cấp: ${item.cccd_ngaycap || ''}</div>
                    <div class="table-flex-cell">7. Nơi cấp: ${item.cccd_noicap || ''}</div>
                </div>

                <div class="table-flex-row">
                    <div class="table-flex-cell colspan-2">8. Điện thoại: ${item.phone || ''}</div>
                    <div class="table-flex-cell colspan-2">9. Email: ${item.email || ''}</div>
                </div>
                <div class="table-flex-row">
                    <div class="table-flex-cell colspan-3">10. Địa chỉ: ${item.thuongtru || ''}</div>
                </div>
                <div class="table-flex-row">
                    <div class="table-flex-cell colspan-3">11. đối tượng dự thi:</div>
                </div>
                <div class="table-flex-row">
                    <div class="table-flex-cell ">${item.doituong == 'dhtn' ? '☑' : '☐' } Người học của Đại học Thái Nguyên</div>
                    <div class="table-flex-cell ">${item.doituong == 'doitac' ? '☑' : '☐' } Người học của đơn vị đối tác</div>
                    <div class="table-flex-cell ">${item.doituong == 'tudo' ? '☑' : '☐' } Thí sinh tư dọ</div>
                </div>

                <div class="table-flex-row" style="background:#C1E4F5">
                    <div class="table-flex-cell colspan-3">
                        <strong>PHẦN II - THÔNG TIN ĐĂNG KÝ THI</strong></div>
                    </div>

                <div class="table-flex-row">
                    <div class="table-flex-cell">1. Đợt thi: ${item.dothi || ''}</div>
                </div>

                <div class="table-flex-row">
                    <div class="table-flex-cell">2. Ngôn ngữ thi: ${item.ngonngu || ''}</div>
                </div>

                <div class="table-flex-row">
                    <div class="table-flex-cell">3. Cấp độ thi:</div>
                </div>
                <div class="table-flex-row" style="flex-wrap: wrap;">





`;

      item.capthi.forEach(e=>{

        htmlContent += `
                <div class="table-flex-cell" style="width: 33.33%;height: 36.8px;" >

                  ${!e.label ? ' ' :  (e.check ?  `☑ ` : `☐`) + ' ' + e.label}
                </div>
        `;
      })

      htmlContent += `

        </div>
        <div class="table-flex-row" style="background:#C1E4F5">
            <div class="table-flex-cell colspan-3"><strong>PHẦN III - CAM KẾT CỦA THÍ SINH</strong></div>
        </div>
        <div class="table-flex-row">
            <div class="table-flex-cell colspan-3">☑ Thí sinh cam kết chịu trách nhiệm về những thông tin
                cung cấp ở phía trên, nếu sai sót thí sinh có thể bị hủy tư cách dự thi và kết quả thi
              </div>
        </div>
        <div class="table-flex-row">
            <div class="table-flex-cell colspan-3">☑ Thí sinh cam kết chấp hành đúng và đầy đủ Quy chế thi
                và Quy định của Hội đồng thi đánh giá năng lực ngoại ngữ tại Đại học Thái Nguyên.</div>
        </div>
    </div>
    </div>

    <div class="pdf-page page-break">
    <div style="display:flex;gap:20px;min-height:200px;">
        <div class="anh-the" style="width:50%">
            <div style="text-align:center">CCCD mặt trước</div>
            <img src="${item.cccd_mattruoc || ''}">
            </div>

        <div class="anh-the" style="width:50%">
            <div style="text-align:center">CCCD mặt sau</div>
            <img src="${item.cccd_matsau || ''}">
        </div>
    </div>
    </div>
        `;
    }



    htmlContent += `
        </div>
        </body>
    </html>
    `;






// ===============================
// TẠO PDF
// ===============================

    let percent = 0;
    const step: number = 100 / data.length;
    this.notifi.loadingAnimationV2({process:{percent:percent}});

    const container = document.createElement('div');


    container.innerHTML = htmlContent;
    container.style.position='fixed';
    container.style.left='-99999px';
    container.style.top='0';
    container.style.width='210mm';
    document.body.appendChild(container);

    const pdf = new jsPDF({
      orientation:'portrait',
      unit:'mm',
      format:'a4'
    });

    const pages =
      container.querySelectorAll('.pdf-page');

    for(let i=0;i<pages.length;i++){

      const element = pages[i] as HTMLElement;
      if(!element){
        continue;
      }

      const canvas =
        await html2canvas(element,{

          scale:3,
          useCORS:true,
          allowTaint:false,
          backgroundColor:'#ffffff',
          logging:false
        });

      const imgData =
        canvas.toDataURL(
          'image/jpeg',
          1
        );

      const pdfWidth = 210;

      const pdfHeight =
        canvas.height *
        pdfWidth /
        canvas.width;


      if(i>0){
        pdf.addPage();
      }

      pdf.addImage(
        imgData,
        'JPEG',
        0,
        0,
        pdfWidth,
        pdfHeight
      );

      percent = percent + step;
      this.notifi.loadingAnimationV2({process :{ percent :percent}})
    }


    pdf.save(fileName+'.pdf');

    this.notifi.disableLoadingAnimationV2();

    document.body.removeChild(container);


  }
}
