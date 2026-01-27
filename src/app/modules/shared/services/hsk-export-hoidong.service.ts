import { Injectable } from '@angular/core';
import {asBlob} from "@shared/vendor/html-docx";
import { saveAs } from 'file-saver';
import {HskHoidongthi} from "@shared/services/hsk-hoidongthi.service";
import {Workbook} from "exceljs";

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class HskExportHoidongService {

  constructor() { }

  // mẫu M01: word
  async m01(phongthis: any[],hoidongthi:HskHoidongthi, fileName: string) {
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
      .page {
        width: 100%;
        height: 100%;
        padding: 40px;
        box-sizing: border-box;
        border: 5px double black;
        /*margin: auto;*/
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        page-break-after: always;
      }
      .title {
        font-size: 85px;
        color: red;
        font-weight: bold;
        /*background-color: yellow;*/
        padding: 5px 10px;
        margin-bottom: 10px;
      }
      .subtitle {
        font-size: 60px;
        font-weight: bold;
        /*background-color: yellow;*/
        padding: 2px 10px;
        margin-bottom: 30px;
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
        text-align: right;
        font-style: italic;
        color: orange;
        font-size: 25px;
        font-weight: bold;
        /*margin-top: 30px;*/
      }
    </style>
  </head>
  <body>
  `;

    for (let item of phongthis) {
      const time_use = item['objectCaphsk'] ? (item['objectCaphsk'].time_start + ' - ' + item['objectCaphsk'].time_end): '';
          const caphskView:string = item['objectCaphsk'] ? item['objectCaphsk']['tiengviet'] :'';
      htmlContent += `
    <div class="page">
      <div style="text-align: center;">
        <p style="font-size:20px;font-weight: bold;">ĐẠI HỌC THÁI NGUYÊN</p>
        <p style="font-size:20px;font-weight: bold;margin-bottom: 100px;">TRUNG TÂM KHẢO THÍ VÀ QUẢN LÝ CHẤT LƯỢNG GIÁO DỤC</p>
        <p class="title">PHÒNG THI ${item.phongthi}</p>
        <p class="subtitle" style="margin-bottom: 70px;">(${caphskView})</p>
        <p class="info">Thời gian: <span class="time">${time_use || "..."}</span></p>
        <p class="dotthi">Đợt thi ngày ${this.replaceDate(new Date(hoidongthi.ngaythi))} </p>
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

  replaceDate(text:Date){
    // console.log(text);
    return text.getDate() + '.' + (text.getMonth() + 1) + '.' + text.getFullYear();
  }

  //mẫu M02 excel

  m02(data:any[],headersArray:string[],fileName:string){
    const header = headersArray;
    let workbook = new Workbook();
    workbook.created = new Date();
    workbook.modified = new Date();

    if(data.length>0){
      data.forEach((m,index)=>{
        const sheetName = m['_objectCaphsk'] ? m['_objectCaphsk']['tiengviet'] + ' - ' + m['phongthi']: m['caphsk']+ ' - ' + m['phongthi'] ;
        this.excelItemChild(m,header,sheetName,workbook);
      })
    }

    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], { type: EXCEL_TYPE });
      saveAs.saveAs(blob, fileName + EXCEL_EXTENSION);
    })
  }
  excelItemChild(item, header: string[], sheetName: string, workbook: Workbook,implement?:string): Workbook {
    const worksheet = workbook.addWorksheet(sheetName);
    const ngaythi = this.replaceDate(new Date(item['__hoidong']['ngaythi']));

    worksheet.addRow('');
    worksheet.mergeCells('A1:C1');
    worksheet.getCell('A1').value ='ĐẠI HỌC THÁI NGUYÊN';
    worksheet.getCell('A1').alignment= {horizontal:'center',vertical: 'middle'};
    worksheet.getCell('A1').font= {name: 'Times New Roman', size: 14, bold:true};

    worksheet.addRow('');
    worksheet.mergeCells('A2:C2');
    worksheet.getCell('A2').value ='HỘI ĐỒNG THI TIẾNG TRUNG HSK';
    this.setCellProperties(worksheet.getCell('A2'), 14, { bold: true, underline: true });

    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.mergeCells('A4:H4');
    worksheet.getCell('A4').value = 'DANH SÁCH THI ĐÁNH GIÁ NĂNG LỰC TIẾNG TRUNG';
    worksheet.getCell('A4').alignment = { horizontal: 'center' };
    worksheet.getCell('A4').font = { size: 13, bold: true, name: 'Times New Roman' };

    worksheet.addRow('');
    worksheet.mergeCells('A5:H5');
    worksheet.getCell('A5').value = {
      richText: [
        {
          text: 'HỘI ĐỒNG THI ',
          font: { bold: true, color: { argb: 'FF000000' },name: 'Times New Roman' } // đậm, màu đen
        },
        {
          text: 'NGÀY ' + ngaythi ,
          font: { bold: true, color: { argb: 'FFFF0000' }, underline: true,name: 'Times New Roman' } // đỏ, đậm, gạch chân
        },
        {
          text: ' - TRÌNH ĐỘ ' + sheetName ,
          font: { bold: true, color: { argb: 'FF000000' },name: 'Times New Roman' } // đậm, màu đen
        }
      ]
    };
    worksheet.getCell('A5').alignment = { horizontal:'center'};
    worksheet.getCell('A5').font = { size: 14, bold: false, name: 'Times New Roman' };

    worksheet.addRow('');

    const headerRow = worksheet.addRow(header);
    // Cell Style : Fill and Border
    headerRow.eachCell((cell, index) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF99' },
        bgColor: { argb: '000000' },
      };
      cell.border = {
        top: { style: 'thin',color: { argb: '333333' } },
        left: { style: 'thin',color: { argb: '333333' } },
        bottom: { style: 'thin',color: { argb: '333333' } },
        right: { style: 'thin',color: { argb: '333333' } }
      };
      cell.font = { size: 13, bold: true, name: 'Times New Roman' };
      cell.alignment = { horizontal: 'center' };
    });

    const objectColWidth = {
      1: 6,
      2: 25,
      3: 25,
      4: 11,
      5: 17,
      6: 21,
      7: 11,
      8: 12,
      9: 20,

    };
    this.setColWidth(worksheet, objectColWidth);

    // Chuẩn bị cột dữ liệu
    let columnsArray: any[] = [];
    if (item['__dataChild'].length > 0) {
      columnsArray = Object.keys(item['__dataChild'][0]);

      // Thêm dữ liệu vào các dòng
      item['__dataChild'].forEach((element: any) => {
        const eachRow = columnsArray.map(column => element[column] || '');
        const row = worksheet.addRow(eachRow);


        row.eachCell((cell,index) => {
          cell.font = { name: 'Calibri', family: 4, size: 11, bold: false, };
          cell.border = {
            top: { style: 'thin', color: { argb: '333333' } },
            left: { style: 'thin', color: { argb: '333333' } },
            bottom: { style: 'thin', color: { argb: '333333' } },
            right: { style: 'thin', color: { argb: '333333' } }
          };
          cell.alignment = { horizontal:"center"};
          if(index === 3 ){
            cell.alignment = { horizontal:"left" , vertical: 'middle'};

          }
        });

      });
    }
    return workbook;
  }

  setColWidth(ws, cols: {}) {
    Object.keys(cols).forEach((f, key) => {
      ws.getColumn(Number(f)).width = cols[f];
    })
  }
  setCellProperties(cell, sizeNumber, options) {
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.font = { name: 'Times New Roman', size: sizeNumber, ...options };
  }


  //------------M11------------------
  async m11(html:string, fileName: string) {
    try {
      const fileBuffer = await asBlob(html , {
        orientation : 'landscape' ,
        size: 'A4',
        margins     : {
          top    : 350 ,
          right  : 350 ,
          bottom : 500 ,
          left   : 350 ,
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

  // 1 số mẫu html to word file thường không định dạng
  // M16, M23,M24,M25,M26....
  async m16(html:string, fileName: string) {
    try {
      const fileBuffer = await asBlob(html , {
        orientation : "portrait" ,//portrait,landscape
        // size: 'A4',
        margins     : {
          top    : 1000,
          right  : 1000 ,
          bottom : 1000 ,
          left   : 1200 ,
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


  //-------------m19------------
  //excel
  m19(header:any[],cathi:any[],time:string,fileName){

    let workbook = new Workbook();
    workbook.created = new Date();
    workbook.modified = new Date();

    if(cathi.length>0){
      cathi.forEach((m,index)=>{
        const sheetName = m['nameSheet'] ;
        // console.log(m);
        this.excelItemChildM19(m,header,time,workbook);
      })
    }

    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], { type: EXCEL_TYPE });
      saveAs.saveAs(blob, fileName + EXCEL_EXTENSION);
    })
  }

  excelItemChildM19(item:any,header:any[],time:string,workbook: Workbook){

    const worksheetchild = workbook.addWorksheet(item['nameSheet']);
    // const ngaythi = this.replaceDate(new Date(item['__hoidong']['ngaythi']));

    //--------------------------Row1------------------------------
    worksheetchild.addRow('');
    worksheetchild.mergeCells('A1:D1');
    worksheetchild.getCell('A1').value ='ĐẠI HỌC THÁI NGUYÊN';
    worksheetchild.getCell('A1').alignment= {horizontal:'center',vertical: 'middle'};
    worksheetchild.getCell('A1').font= {name: 'Times New Roman', size: 13, bold:true};

    worksheetchild.mergeCells('G1:J1');
    worksheetchild.getCell('G1').value ='CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM';
    worksheetchild.getCell('G1').alignment= {horizontal:'center',vertical: 'middle'};
    worksheetchild.getCell('G1').font= {name: 'Times New Roman', size: 13, bold:true};
    //--------------------------Row1------------------------------

    worksheetchild.addRow('');
    worksheetchild.mergeCells('A2:D2');
    worksheetchild.getCell('A2').value ='HỘI ĐỒNG THI ĐGNL TIẾNG TRUNG HSK';
    worksheetchild.getCell('A2').font = { size: 13, bold: true, name: 'Times New Roman',underline:true };
    worksheetchild.getCell('A2').alignment= {horizontal:'center',vertical: 'middle',};


    worksheetchild.addRow('');
    worksheetchild.mergeCells('G2:J2');
    worksheetchild.getCell('G2').value ='Độc lập - Tự do - Hạnh phúc';
    worksheetchild.getCell('G2').font = { size: 13, bold: true, name: 'Times New Roman' ,underline:true };
    worksheetchild.getCell('G2').alignment = { horizontal: 'center',vertical: 'middle', };


    worksheetchild.addRow('');
    worksheetchild.addRow('');
    worksheetchild.mergeCells('A4:M4');
    worksheetchild.getCell('A4').value = 'BIÊN BẢN PHÂN CÔNG CÁN BỘ COI THI';
    worksheetchild.getCell('A4').alignment = { horizontal: 'center' };
    worksheetchild.getCell('A4').font = { size: 13, bold: true, name: 'Times New Roman' };

    worksheetchild.addRow('');
    worksheetchild.getCell('A5').value = '1. Điểm thi: Trung tâm khảo thí - Đại học Thái Nguyên';
    worksheetchild.getCell('A5').alignment = { horizontal: 'center' };
    worksheetchild.getCell('A5').font = { size: 12, bold: true, name: 'Times New Roman' };

    worksheetchild.addRow('');
    worksheetchild.getCell('A6').value = `2 Ngày thi: ${this.replaceDate(new Date(time))}`;
    worksheetchild.getCell('A6').alignment = { horizontal: 'left' };
    worksheetchild.getCell('A6').font = { size: 12, bold: false, name: 'Times New Roman' };

    worksheetchild.getCell('J6').value = `3 Ca thi: ${item['name']}`;
    worksheetchild.getCell('J6').alignment = { horizontal: 'left' };
    worksheetchild.getCell('J6').font = { size: 12, bold: false, name: 'Times New Roman' };

    worksheetchild.addRow('');
    worksheetchild.getCell('A7').value = `3. Kết quả bốc thăm phân công CBCT:`;
    worksheetchild.getCell('A7').alignment = { horizontal: 'left' };
    worksheetchild.getCell('A7').font = { size: 12, bold: false, name: 'Times New Roman' };

    const headerRow = worksheetchild.addRow(header);
    // Cell Style : Fill and Border
    headerRow.eachCell((cell, index) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF99' },
        bgColor: { argb: '000000' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.font = { size: 13, bold: true, name: 'Times New Roman' };
      cell.alignment = { horizontal: 'center',wrapText: true ,vertical: 'middle' };
    });

    const objectColWidth = {
      1: 6,
      2: 16,
      3: 10,
      4: 20,
      5: 17,
      6: 16,
      7: 10,
      8: 20,
      9: 17,
      10: 16,
      11: 10,
      12: 20,
      13: 17,

    };
    this.setColWidth(worksheetchild, objectColWidth);
    if (item['child'].length > 0) {
      const numberOfColumns = 13;
      item['child'].forEach((element: string) => {
        // Thêm dòng tiêu đề
        const startRow = worksheetchild.lastRow.number + 1;
        const titleRow = worksheetchild.addRow([element, ...Array(numberOfColumns - 1).fill('')]);
        worksheetchild.mergeCells(startRow, 1, startRow, numberOfColumns);
        titleRow.eachCell({ includeEmpty: true }, (cell) => {
          cell.font = { name: 'Calibri', family: 4, size: 11, bold: true }; // Tiêu đề bold
          cell.border = {
            top: { style: 'thin', color: { argb: '333333' } },
            left: { style: 'thin', color: { argb: '333333' } },
            bottom: { style: 'thin', color: { argb: '333333' } },
            right: { style: 'thin', color: { argb: '333333' } }
          };
          cell.alignment = { horizontal: "left", vertical: "middle" }; // <<< Căn trái ở đây nè
        });

        for (let i = 1; i <= 5; i++) {
          const row = worksheetchild.addRow([i, ...Array(numberOfColumns - 1).fill('')]);
          row.eachCell({ includeEmpty: true }, (cell) => {
            cell.font = { name: 'Calibri', family: 4, size: 11, bold: false };
            cell.border = {
              top: { style: 'thin', color: { argb: '333333' } },
              left: { style: 'thin', color: { argb: '333333' } },
              bottom: { style: 'thin', color: { argb: '333333' } },
              right: { style: 'thin', color: { argb: '333333' } }
            };
            cell.alignment = { horizontal: "center", vertical: "middle" }; // Các dòng con vẫn căn giữa
          });
        }
      });
    }

    worksheetchild.mergeCells('A26:C26');
    worksheetchild.getCell('A26').value = `THƯ KÝ`;
    worksheetchild.getCell('A26').alignment = { horizontal: 'center',vertical: "middle" };
    worksheetchild.getCell('A26').font = { size: 12, bold: true, name: 'Times New Roman' };
    worksheetchild.mergeCells('G26:K26');
    worksheetchild.getCell('G26').value = `TRƯỞNG BAN COI THI`;
    worksheetchild.getCell('G26').alignment = {horizontal: 'center',vertical: "middle" };
    worksheetchild.getCell('G26').font = { size: 12, bold: true, name: 'Times New Roman' };
    return workbook;
  }

  //------------------------------M14 -----------------------------------


  async m14(phongthis: any[],hoidongthi:any, fileName: string) {
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
    <td style="padding: 40px; text-align: center; vertical-align<p>: middle;">
                <p style="font-size:17px; text-align:center;margin:8px;"><strong>BỘ GIÁO DỤC VÀ ĐÀO TẠO</strong></p>
        <p style="font-size:17px; text-align:center;"><strong><u>ĐẠI HỌC THÁI NGUYÊN</u></strong></p>
        <br>
        <p style="font-size:22px; text-align:center;margin:40px 0;"><strong>HỘI ĐỒNG THI ĐÁNH GIÁ NĂNG LỰC TIẾNG TRUNG HSK</strong></p>
        <br>
        <p style="font-size: 38px;text-align:center;"><strong>TÚI PHỤ</strong></p>
        <p style="font-size: 26px;text-align:center;"><strong>PHÒNG THI SỐ : ${item.phongthi}</strong></p>
        <p style="font-size: 17px;text-align:center;text-transform: uppercase"><strong>ngày thi: ${hoidongthi['__ngaythi']}; Ca thi: ${item['_objectCaphsk']['cathi']}; Cấp độ thi: ${item['_capHsk']}</strong></p>

        <p style="font-size: 17px;text-align:center;"><strong><i>Danh mục tài liệu gồm có:</i></strong></p>

        <table class="table-border" style="width:100%;">
            <tr>
                <th style="margin:6px 0;background:#ededed;"><p style="font-size: 17px;text-align: center;width:10%;">STT</p></th>
                <th style="margin:6px 0;background:#ededed;"><p style="font-size: 17px;width:40%;">Tên tài liệu</p></th>
                <th style="margin:6px 0;background:#ededed;"><p style="font-size: 17px;text-align: center;width:10%;">STT</p></th>
                <th style="margin:6px 0;background:#ededed;"><p style="font-size: 17px;width:40%;">Tên tài liệu</p></th>
            </tr>
            <tr>
                <td><p style="margin:6px 0;font-size: 17px; text-align: center;">1</p></td>
                <td><p style="margin:6px 0;font-size: 17px; ">Danh sách thí sinh dự thi</p></td>
                <td><p style="margin:6px 0;font-size: 17px; text-align: center;">10</p></td>
                <td><p style="margin:6px 0;font-size: 17px; ">Sơ đồ chỗ ngồi thí sinh</p></td>
            </tr>
            <tr>
                <td><p style="margin:6px 0;font-size: 17px;text-align: center;">2</p></td>
                <td><p style="margin:6px 0;font-size: 17px;">Danh sách thí sinh ký nộp bài</p></td>
                <td><p style="margin:6px 0;font-size: 17px;text-align: center;">11</p></td>
                <td><p style="margin:6px 0;font-size: 17px;">Biên bản chỉnh sửa sai sót</p></td>
            </tr>
            <tr>
                <td><p style="margin:6px 0;font-size: 17px;text-align: center;">3</p></td>
                <td><p style="margin:6px 0;font-size: 17px;">Sổ cấp chứng chỉ</p></td>
                <td><p style="margin:6px 0;font-size: 17px;text-align: center;">12</p></td>
                <td><p style="margin:6px 0;font-size: 17px;">Biên bản thí sinh ra ngoài phòng thi</p></td>
            </tr>
            <tr>
                <td><p style="margin:6px 0;font-size: 17px;text-align: center;">4</p></td>
                <td><p style="margin:6px 0;font-size: 17px;">Album ảnh/thẻ dự thi</p></td>
                <td><p style="margin:6px 0;font-size: 17px;text-align: center;">13</p></td>
                <td><p style="margin:6px 0;font-size: 17px;">Biên bản bù giờ</p></td>
            </tr>
            <tr>
                <td><p style="margin:6px 0;font-size: 17px; text-align: center;">5</p></td>
                <td><p style="margin:6px 0;font-size: 17px; ">Sticker đánh số báo danh</p></td>
                <td><p style="margin:6px 0;font-size: 17px; text-align: center;">14</p></td>
                <td><p style="margin:6px 0;font-size: 17px; ">Giấy cam đoan (quên giấy tờ)</p></td>
            </tr>
            <tr>
                <td><p style="margin:6px 0;font-size: 17px;text-align: center;">6</p></td>
                <td><p style="margin:6px 0;font-size: 17px;">Kế hoạch tổ chức thi</p></td>
                <td><p style="margin:6px 0;font-size: 17px;text-align: center;">15</p></td>
                <td><p style="margin:6px 0;font-size: 17px;">Biên bản xử lý vi phạm</p></td>
            </tr>
            <tr>
                <td><p style="margin:6px 0;font-size: 17px;text-align: center;">7</p></td>
                <td><p style="margin:6px 0;font-size: 17px;">Biên bản mở niêm phong phòng thi</p></td>
                <td><p style="margin:6px 0;font-size: 17px;text-align: center;">16</p></td>
                <td><p style="margin:6px 0;font-size: 17px;">Hướng dẫn làm bài thi của thí sinh</p></td>
            </tr>
            <tr>
                <td><p style="margin:6px 0;font-size: 17px;text-align: center;">8</p></td>
                <td><p style="margin:6px 0;font-size: 17px;">BB mở niêm phong phiếu tài khoản</p></td>
                <td><p style="margin:6px 0;font-size: 17px;text-align: center;">17</p></td>
                <td><p style="margin:6px 0;font-size: 17px;">HD quy trình coi thi cho giáo viên</p></td>
            </tr>
            <tr>
                <td><p style="margin:6px 0;font-size: 17px;text-align: center;">9</p></td>
                <td><p style="margin:6px 0;font-size: 17px;">Báo cáo tình hình thí sinh</p></td>
                <td><p style="margin:6px 0;font-size: 17px;text-align: center;">18</p></td>
                <td><p style="margin:6px 0;font-size: 17px;">Bút bi</p></td>
            </tr>
        </table>
        <p style="margin:6px;">&nbsp;</p>
        <p style="margin:6px;">&nbsp;</p>
        <p style="margin:6px;">&nbsp;</p>
        <p style="margin:6px;">&nbsp;</p>
        <p style="margin:6px;">&nbsp;</p>
     <p style="text-align: center;font-size:17px"><strong><i>Địa điểm thi: Trung tâm Khảo thí và QLCLGD - ĐHTN</i></strong></p>

            </td>
    </tr>
    </table>
    <div style="page-break-after: always"><br/></div>

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
  exportM12(json:any[],phongthi:any,hoidong:HskHoidongthi,fileName:string){

    const header = ['TT','Số báo danh','Họ và tên','Giới tính','Ngày sinh','Số CCCD/Hộ chiếu','Phòng thi','Ký nộp'];
    const workbook = new Workbook();
    workbook.created = new Date();
    workbook.modified = new Date();
    const worksheet = workbook.addWorksheet(phongthi.phongthi );
    //--------------------------Row1------------------------------
    worksheet.addRow('');
    worksheet.mergeCells('A1:C1');
    worksheet.getCell('A1').value ='ĐẠI HỌC THÁI NGUYÊN';
    worksheet.getCell('A1').alignment= {horizontal:'center',vertical: 'middle'};
    worksheet.getCell('A1').font= {name: 'Times New Roman', size: 13, bold:true};
    //--------------------------Row1------------------------------
    worksheet.addRow('');
    worksheet.mergeCells('A2:C2');
    worksheet.getCell('A2').value ='HỘI ĐỒNG THI ĐGNL TIẾNG TRUNG HSK';
    worksheet.getCell('A2').font = { size: 13, bold: true, name: 'Times New Roman',underline:true };
    worksheet.getCell('A2').alignment= {horizontal:'center',vertical: 'middle',};
    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.mergeCells('A4:H4');
    worksheet.getCell('A4').value = 'DANH SÁCH THI ĐÁNH GIÁ NĂNG LỰC TIẾNG TRUNG HSK';
    worksheet.getCell('A4').alignment = { horizontal: 'center' };
    worksheet.getCell('A4').font = { size: 14, bold: true, name: 'Times New Roman' };
    worksheet.addRow('');
    worksheet.mergeCells('A5:H5');
    worksheet.getCell('A5').value = `HỘI ĐỒNG THI NGÀY ${hoidong['__ngaythi']} - TRÌNH ĐỘ ${phongthi['_capHsk']}`;
    worksheet.getCell('A5').alignment = { horizontal: 'center' };
    worksheet.getCell('A5').font = { size: 14, bold: true, name: 'Times New Roman' };
    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.getCell('A7').value = `PHÒNG THI: ${phongthi.phongthi}`;
    worksheet.getCell('A7').alignment = { horizontal: 'left' };
    worksheet.getCell('A7').font = { size: 13, bold: true, name: 'Times New Roman' };
    // worksheet.addRow('');
    const headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, index) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'CCCCCC' },
        bgColor: { argb: '000000' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.font = { size: 13, bold: true, name: 'Times New Roman', };
      cell.alignment = { horizontal: 'center', wrapText: true ,vertical: 'middle'};
    });

    const objectColWidth = {
      1: 6,
      2: 20,
      3: 26,
      4: 11,
      5: 12,
      6: 16,
      7: 13,
      8: 15,
    };

    this.setColWidth(worksheet, objectColWidth);
    let columnsArray: any[];
    for (const key in json) {
      if (json.hasOwnProperty(key)) {
        columnsArray = Object.keys(json[key]);
      }
    }

    json.forEach((element: any) => {
      const eachRow = [];
      columnsArray.forEach((column) => {
        eachRow.push(element[column]);
      });
      if (element.isDeleted === 'Y') {
        const deleteRow = worksheet.addRow(eachRow);
        deleteRow.eachCell((cell) => {
          cell.font = { name: 'Times New Roman', family: 4, size: 11, bold: false, strike: true };
        })
      } else {
        const row = worksheet.addRow(eachRow);
        row.eachCell((cell) => {
          cell.font = { name: 'Calibri', family: 4, size: 11, bold: false, };
          cell.border = {
            top: { style: 'thin', color: { argb: '333333' } },
            left: { style: 'thin', color: { argb: '333333' } },
            bottom: { style: 'thin', color: { argb: '333333' } },
            right: { style: 'thin', color: { argb: '333333' } }
          };
          cell.alignment = { horizontal:"center"};
        });
      }
      //set with column to fit
      worksheet.columns.forEach((column, columnIndex) => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
          const cellLength = cell.value ? cell.value.toString().length : 0;
          maxLength = cellLength;
        });
        worksheet.getColumn(columnIndex + 1).alignment = {horizontal: 'center', wrapText: true ,vertical: 'middle'};
        worksheet.getColumn(3).alignment = {horizontal: 'left', wrapText: true ,vertical: 'middle'};
      });

    });

    worksheet.getCell('A1').alignment = {horizontal: 'center', wrapText: false ,vertical: 'middle'};
    worksheet.getCell('A2').alignment = {horizontal: 'center', wrapText: false ,vertical: 'middle'};
    worksheet.getCell('A4').alignment = {horizontal: 'center', wrapText: false ,vertical: 'middle'};
    worksheet.getCell('A5').alignment = {horizontal: 'center', wrapText: false ,vertical: 'middle'};
    worksheet.getCell('A7').alignment = {horizontal: 'center', wrapText: false ,vertical: 'middle'};

    const numOfEnd = 7 + json.length +1;
    worksheet.addRow('');
    worksheet.mergeCells(`A${numOfEnd}:H${numOfEnd}`);
    worksheet.getCell(`A${numOfEnd}`).value = 'Số thí sinh theo danh sách: ........ , Có mặt: ........ thí sinh, đình chỉ: ........ thí sinh.';
    worksheet.getCell(`A${numOfEnd}`).alignment = {horizontal: 'left', wrapText: false ,vertical: 'middle'};
    worksheet.getCell(`A${numOfEnd}`).font = {size: 13,  italic: true, name: 'Times New Roman' };
    worksheet.getCell(`A${numOfEnd}`).border = null;

    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.mergeCells(`A${numOfEnd+2}:B${numOfEnd+2}`);
    worksheet.getCell(`A${numOfEnd+2}`).value = 'CÁN BỘ COI THI 01';
    worksheet.getCell(`A${numOfEnd+2}`).alignment = {horizontal: 'center', wrapText: false ,vertical: 'middle'};
    worksheet.getCell(`A${numOfEnd+2}`).font = {size: 12,  italic: false,bold:true, name: 'Times New Roman' };

    worksheet.mergeCells(`F${numOfEnd+2}:H${numOfEnd+2}`);
    worksheet.getCell(`F${numOfEnd+2}`).value = 'CÁN BỘ COI THI 02';
    worksheet.getCell(`F${numOfEnd+2}`).alignment = {horizontal: 'center', wrapText: false ,vertical: 'middle'};
    worksheet.getCell(`F${numOfEnd+2}`).font = {size: 12,  italic: false,bold:true, name: 'Times New Roman' };

    worksheet.addRow('');
    worksheet.mergeCells(`A${numOfEnd+3}:B${numOfEnd+3}`);
    worksheet.getCell(`A${numOfEnd+3}`).value = '(Ký, ghi rõ họ và tên)';
    worksheet.getCell(`A${numOfEnd+3}`).alignment = {horizontal: 'center', wrapText: false ,vertical: 'middle'};
    worksheet.getCell(`A${numOfEnd+3}`).font = {size: 12,  italic: true, name: 'Times New Roman' };

    worksheet.mergeCells(`F${numOfEnd+3}:H${numOfEnd+3}`);
    worksheet.getCell(`F${numOfEnd+3}`).value = '(Ký, ghi rõ họ và tên)';
    worksheet.getCell(`F${numOfEnd+3}`).alignment = {horizontal: 'center', wrapText: false ,vertical: 'middle'};
    worksheet.getCell(`F${numOfEnd+3}`).font = {size: 12,  italic: true, name: 'Times New Roman' };



    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], { type: EXCEL_TYPE });
      saveAs.saveAs(blob, fileName + EXCEL_EXTENSION);
    })
  }

  exportM12V2(json:any[],hoidong:HskHoidongthi,header:any[],fileName:string){
    const headerAr = header;
    let workbook = new Workbook();
    workbook.created = new Date();
    workbook.modified = new Date();

    if(json.length>0){
      json.forEach((m,index)=>{
        // console.log(m)
        const sheetName = m['phongThi'] ;
        this.excelItemChildM12(m,headerAr,sheetName,workbook,hoidong);
      })
    }

    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], { type: EXCEL_TYPE });
      saveAs.saveAs(blob, fileName + EXCEL_EXTENSION);
    })
  }

  excelItemChildM12(item:any,header:any[],sheetName:string,workbook: Workbook, hoidong:any){
    const worksheet = workbook.addWorksheet(sheetName);
    // const ngaythi = this.replaceDate(new Date(item['__hoidong']['ngaythi']));

    //--------------------------Row1------------------------------
    worksheet.addRow('');
    worksheet.mergeCells('A1:C1');
    worksheet.getCell('A1').value ='ĐẠI HỌC THÁI NGUYÊN';
    worksheet.getCell('A1').alignment= {horizontal:'center',vertical: 'middle'};
    worksheet.getCell('A1').font= {name: 'Times New Roman', size: 13, bold:true};
    //--------------------------Row1------------------------------
    worksheet.addRow('');
    worksheet.mergeCells('A2:C2');
    worksheet.getCell('A2').value ='HỘI ĐỒNG THI ĐGNL TIẾNG TRUNG HSK';
    worksheet.getCell('A2').font = { size: 13, bold: true, name: 'Times New Roman',underline:true };
    worksheet.getCell('A2').alignment= {horizontal:'center',vertical: 'middle',};
    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.mergeCells('A4:H4');
    worksheet.getCell('A4').value = 'DANH SÁCH THI ĐÁNH GIÁ NĂNG LỰC TIẾNG TRUNG HSK';
    worksheet.getCell('A4').alignment = { horizontal: 'center' };
    worksheet.getCell('A4').font = { size: 14, bold: true, name: 'Times New Roman' };
    worksheet.addRow('');
    worksheet.mergeCells('A5:H5');
    worksheet.getCell('A5').value = `HỘI ĐỒNG THI NGÀY ${hoidong['__ngaythi']} - TRÌNH ĐỘ ${item['objectCaphsk']['_capHsk']}`;
    worksheet.getCell('A5').alignment = { horizontal: 'center' };
    worksheet.getCell('A5').font = { size: 14, bold: true, name: 'Times New Roman' };
    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.getCell('A7').value = `PHÒNG THI: ${item['phongThi']}`;
    worksheet.getCell('A7').alignment = { horizontal: 'left' };
    worksheet.getCell('A7').font = { size: 13, bold: true, name: 'Times New Roman' };

    const headerRow = worksheet.addRow(header);
    // Cell Style : Fill and Border
    headerRow.eachCell((cell, index) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF99' },
        bgColor: { argb: '000000' },
      };
      cell.border = {
        top: { style: 'thin',color: { argb: '333333' } },
        left: { style: 'thin',color: { argb: '333333' } },
        bottom: { style: 'thin',color: { argb: '333333' } },
        right: { style: 'thin',color: { argb: '333333' } }
      };
      cell.font = { size: 13, bold: true, name: 'Times New Roman' };
      cell.alignment = { horizontal: 'center' };
    });

    const objectColWidth = {
      1: 6,
      2: 25,
      3: 25,
      4: 11,
      5: 17,
      6: 21,
      7: 11,
      8: 12,
      9: 20,

    };
    this.setColWidth(worksheet, objectColWidth);

    // Chuẩn bị cột dữ liệu
    let columnsArray: any[] = [];
    if (item['__dataChild'].length > 0) {
      columnsArray = Object.keys(item['__dataChild'][0]);

      // Thêm dữ liệu vào các dòng
      item['__dataChild'].forEach((element: any) => {
        const eachRow = columnsArray.map(column => element[column] || '');
        const row = worksheet.addRow(eachRow);


        row.eachCell((cell,index) => {
          cell.font = { name: 'Calibri', family: 4, size: 11, bold: false, };
          cell.border = {
            top: { style: 'thin', color: { argb: '333333' } },
            left: { style: 'thin', color: { argb: '333333' } },
            bottom: { style: 'thin', color: { argb: '333333' } },
            right: { style: 'thin', color: { argb: '333333' } }
          };
          cell.alignment = { horizontal:"center"};
          if(index === 3 ){
            cell.alignment = { horizontal:"left"};

          }
        });

      });
      worksheet.addRow('');

      const numOfEnd = 7 + item['__dataChild'].length +2;
      worksheet.addRow('');
      worksheet.mergeCells(`A${numOfEnd+1}:H${numOfEnd+1}`);
      worksheet.getCell(`A${numOfEnd +1}`).value = 'Số thí sinh theo danh sách: ........ , Có mặt: ........ thí sinh, đình chỉ: ........ thí sinh.';
      worksheet.getCell(`A${numOfEnd +1}`).alignment = {horizontal: 'left', wrapText: false ,vertical: 'middle'};
      worksheet.getCell(`A${numOfEnd +1}`).font = {size: 13,  italic: true, name: 'Times New Roman' };
      worksheet.getCell(`A${numOfEnd +1}`).border = null;

      worksheet.addRow('');
      worksheet.addRow('');
      worksheet.mergeCells(`A${numOfEnd+2}:B${numOfEnd+2}`);
      worksheet.getCell(`A${numOfEnd+2}`).value = 'CÁN BỘ COI THI 01';
      worksheet.getCell(`A${numOfEnd+2}`).alignment = {horizontal: 'center', wrapText: false ,vertical: 'middle'};
      worksheet.getCell(`A${numOfEnd+2}`).font = {size: 12,  italic: false,bold:true, name: 'Times New Roman' };

      worksheet.mergeCells(`F${numOfEnd+2}:H${numOfEnd+2}`);
      worksheet.getCell(`F${numOfEnd+2}`).value = 'CÁN BỘ COI THI 02';
      worksheet.getCell(`F${numOfEnd+2}`).alignment = {horizontal: 'center', wrapText: false ,vertical: 'middle'};
      worksheet.getCell(`F${numOfEnd+2}`).font = {size: 12,  italic: false,bold:true, name: 'Times New Roman' };

      worksheet.addRow('');
      worksheet.mergeCells(`A${numOfEnd+3}:B${numOfEnd+3}`);
      worksheet.getCell(`A${numOfEnd+3}`).value = '(Ký, ghi rõ họ và tên)';
      worksheet.getCell(`A${numOfEnd+3}`).alignment = {horizontal: 'center', wrapText: false ,vertical: 'middle'};
      worksheet.getCell(`A${numOfEnd+3}`).font = {size: 12,  italic: true, name: 'Times New Roman' };

      worksheet.mergeCells(`F${numOfEnd+3}:H${numOfEnd+3}`);
      worksheet.getCell(`F${numOfEnd+3}`).value = '(Ký, ghi rõ họ và tên)';
      worksheet.getCell(`F${numOfEnd+3}`).alignment = {horizontal: 'center', wrapText: false ,vertical: 'middle'};
      worksheet.getCell(`F${numOfEnd+3}`).font = {size: 12,  italic: true, name: 'Times New Roman' };

    }

    return workbook;
  }

  exportM13(json:any[],phongthi:any,hoidong:HskHoidongthi,fileName:string){

    const header = ['TT','Số báo danh','Họ và tên','Giới tính','Ngày sinh','Số CCCD/Hộ chiếu','Phòng thi',' Chứng chỉ','Ký nhận'];
    const workbook = new Workbook();
    workbook.created = new Date();
    workbook.modified = new Date();
    const worksheet = workbook.addWorksheet(phongthi.phongthi );
    //--------------------------Row1------------------------------
    worksheet.addRow('');
    worksheet.mergeCells('A1:C1');
    worksheet.getCell('A1').value ='ĐẠI HỌC THÁI NGUYÊN';
    worksheet.getCell('A1').alignment= {horizontal:'center',vertical: 'middle'};
    worksheet.getCell('A1').font= {name: 'Times New Roman', size: 13, bold:true};
    //--------------------------Row1------------------------------
    worksheet.addRow('');
    worksheet.mergeCells('A2:C2');
    worksheet.getCell('A2').value ='HỘI ĐỒNG THI ĐGNL TIẾNG TRUNG HSK';
    worksheet.getCell('A2').font = { size: 13, bold: true, name: 'Times New Roman',underline:true };
    worksheet.getCell('A2').alignment= {horizontal:'center',vertical: 'middle',};
    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.mergeCells('A4:I4');
    worksheet.getCell('A4').value = 'DANH SÁCH THI ĐÁNH GIÁ NĂNG LỰC TIẾNG TRUNG HSK';
    worksheet.getCell('A4').alignment = { horizontal: 'center' };
    worksheet.getCell('A4').font = { size: 14, bold: true, name: 'Times New Roman' };
    worksheet.addRow('');
    worksheet.mergeCells('A5:I5');
    worksheet.getCell('A5').value = `HỘI ĐỒNG THI NGÀY ${hoidong['__ngaythi']} - TRÌNH ĐỘ ${phongthi['_capHsk']}`;
    worksheet.getCell('A5').alignment = { horizontal: 'center' };
    worksheet.getCell('A5').font = { size: 14, bold: true, name: 'Times New Roman' };
    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.getCell('A7').value = `PHÒNG THI: ${phongthi.phongthi}`;
    worksheet.getCell('A7').alignment = { horizontal: 'left' };
    worksheet.getCell('A7').font = { size: 13, bold: true, name: 'Times New Roman' };
    // worksheet.addRow('');
    const headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, index) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'CCCCCC' },
        bgColor: { argb: '000000' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.font = { size: 13, bold: true, name: 'Times New Roman', };
      cell.alignment = { horizontal: 'center', wrapText: true ,vertical: 'middle'};
    });

    const objectColWidth = {
      1: 6,
      2: 20,
      3: 26,
      4: 11,
      5: 12,
      6: 16,
      7: 13,
      8: 15,
      9: 12,
    };

    this.setColWidth(worksheet, objectColWidth);
    let columnsArray: any[];
    for (const key in json) {
      if (json.hasOwnProperty(key)) {
        columnsArray = Object.keys(json[key]);
      }
    }

    json.forEach((element: any) => {
      const eachRow = [];
      columnsArray.forEach((column) => {
        eachRow.push(element[column]);
      });
      if (element.isDeleted === 'Y') {
        const deleteRow = worksheet.addRow(eachRow);
        deleteRow.eachCell((cell) => {
          cell.font = { name: 'Times New Roman', family: 4, size: 11, bold: false, strike: true };
        })
      } else {
        const row = worksheet.addRow(eachRow);
        row.eachCell((cell) => {
          cell.font = { name: 'Calibri', family: 4, size: 11, bold: false, };
          cell.border = {
            top: { style: 'thin', color: { argb: '333333' } },
            left: { style: 'thin', color: { argb: '333333' } },
            bottom: { style: 'thin', color: { argb: '333333' } },
            right: { style: 'thin', color: { argb: '333333' } }
          };
          cell.alignment = { horizontal:"center"};
        });
      }
      //set with column to fit
      worksheet.columns.forEach((column, columnIndex) => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
          const cellLength = cell.value ? cell.value.toString().length : 0;
          maxLength = cellLength;
        });
        worksheet.getColumn(columnIndex + 1).alignment = {horizontal: 'center', wrapText: true ,vertical: 'middle'};
        worksheet.getColumn(3).alignment = {horizontal: 'left', wrapText: true ,vertical: 'middle'};
      });

    });

    worksheet.getCell('A1').alignment = {horizontal: 'center', wrapText: false ,vertical: 'middle'};
    worksheet.getCell('A2').alignment = {horizontal: 'center', wrapText: false ,vertical: 'middle'};
    worksheet.getCell('A4').alignment = {horizontal: 'center', wrapText: false ,vertical: 'middle'};
    worksheet.getCell('A5').alignment = {horizontal: 'center', wrapText: false ,vertical: 'middle'};
    worksheet.getCell('A7').alignment = {horizontal: 'left', wrapText: false ,vertical: 'middle'};

    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], { type: EXCEL_TYPE });
      saveAs.saveAs(blob, fileName + EXCEL_EXTENSION);
    })
  }

  exportM13V2(json:any[],hoidong:HskHoidongthi,header:any[],fileName:string){
    const headerAr = header;
    let workbook = new Workbook();
    workbook.created = new Date();
    workbook.modified = new Date();

    if(json.length>0){
    json.forEach((m,index)=>{
    // console.log(m)
    const sheetName = m['phongThi'] ;
    this.excelItemChildM13(m,headerAr,sheetName,workbook,hoidong);
    })
    }

    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], { type: EXCEL_TYPE });
      saveAs.saveAs(blob, fileName + EXCEL_EXTENSION);
    })
  }

  excelItemChildM13(item:any,header:any[],sheetName:string,workbook: Workbook, hoidong:any){
    const worksheet = workbook.addWorksheet(sheetName);
    // const ngaythi = this.replaceDate(new Date(item['__hoidong']['ngaythi']));

    //--------------------------Row1------------------------------
    worksheet.addRow('');
    worksheet.mergeCells('A1:C1');
    worksheet.getCell('A1').value ='ĐẠI HỌC THÁI NGUYÊN';
    worksheet.getCell('A1').alignment= {horizontal:'center',vertical: 'middle'};
    worksheet.getCell('A1').font= {name: 'Times New Roman', size: 13, bold:true};
    //--------------------------Row1------------------------------
    worksheet.addRow('');
    worksheet.mergeCells('A2:C2');
    worksheet.getCell('A2').value ='HỘI ĐỒNG THI ĐGNL TIẾNG TRUNG HSK';
    worksheet.getCell('A2').font = { size: 13, bold: true, name: 'Times New Roman',underline:true };
    worksheet.getCell('A2').alignment= {horizontal:'center',vertical: 'middle',};
    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.mergeCells('A4:H4');
    worksheet.getCell('A4').value = 'DANH SÁCH THI ĐÁNH GIÁ NĂNG LỰC TIẾNG TRUNG HSK';
    worksheet.getCell('A4').alignment = { horizontal: 'center' };
    worksheet.getCell('A4').font = { size: 14, bold: true, name: 'Times New Roman' };
    worksheet.addRow('');
    worksheet.mergeCells('A5:H5');
    worksheet.getCell('A5').value = `HỘI ĐỒNG THI NGÀY ${hoidong['__ngaythi']} - TRÌNH ĐỘ ${item['objectCaphsk']['_capHsk']}`;
    worksheet.getCell('A5').alignment = { horizontal: 'center' };
    worksheet.getCell('A5').font = { size: 14, bold: true, name: 'Times New Roman' };
    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.getCell('A7').value = `PHÒNG THI: ${item['phongThi']}`;
    worksheet.getCell('A7').alignment = { horizontal: 'left' };
    worksheet.getCell('A7').font = { size: 13, bold: true, name: 'Times New Roman' };

    const headerRow = worksheet.addRow(header);
    // Cell Style : Fill and Border
    headerRow.eachCell((cell, index) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF99' },
        bgColor: { argb: '000000' },
      };
      cell.border = {
        top: { style: 'thin',color: { argb: '333333' } },
        left: { style: 'thin',color: { argb: '333333' } },
        bottom: { style: 'thin',color: { argb: '333333' } },
        right: { style: 'thin',color: { argb: '333333' } }
      };
      cell.font = { size: 13, bold: true, name: 'Times New Roman' };
      cell.alignment = { horizontal: 'center' };
    });

    const objectColWidth = {
      1: 6,
      2: 20,
      3: 25,
      4: 11,
      5: 17,
      6: 18,
      7: 11,
      8: 12,
      9: 12,


    };
    this.setColWidth(worksheet, objectColWidth);

    // Chuẩn bị cột dữ liệu
    let columnsArray: any[] = [];
    if (item['__dataChild'].length > 0) {
      columnsArray = Object.keys(item['__dataChild'][0]);

      // Thêm dữ liệu vào các dòng
      item['__dataChild'].forEach((element: any) => {
        const eachRow = columnsArray.map(column => element[column] || '');
        const row = worksheet.addRow(eachRow);


        row.eachCell((cell,index) => {
          cell.font = { name: 'Calibri', family: 4, size: 11, bold: false, };
          cell.border = {
            top: { style: 'thin', color: { argb: '333333' } },
            left: { style: 'thin', color: { argb: '333333' } },
            bottom: { style: 'thin', color: { argb: '333333' } },
            right: { style: 'thin', color: { argb: '333333' } }
          };
          cell.alignment = { horizontal:"center"};
          if(index === 3 ){
            cell.alignment = { horizontal:"left"};

          }
        });

      });

    }

    return workbook;
  }


  //------------------------------túi phụ -----------------------------------
  async m21(arr:any[],hoidong:HskHoidongthi, fileName: string) {
    let html =`
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Document</title>
        <style>
          * {font-family: "Times New Roman"  !important;}

          .table-border{
             width:100%;border-collapse: collapse;border:1px solid #000;
          }


          .table-border tr,.table-border td,.table-border th{font-size: 14px; border:1px solid #000;}

          .text-font-13{font-size:17px;text-align: justify;}
        </style>
      </head>
      <body>
    `;
    arr.forEach(e=>{
      html += `
        <table style="width: 100%;">
        <tr >
            <td style="text-align: center">
                <p style="margin:0; font-size:18px;">ĐẠI HỌC THÁI NGUYÊN</p>
                <p style="margin:0; font-size:18px;font-weight: bold;">HỘI ĐỒNG THI ĐÁNH GIÁ</p>
                <p style="margin:0; font-size:18px;font-weight: bold;"><u>NĂNG LỰC TIẾNG TRUNG HSK</u></p>
            </td>
            <td style="text-align: center">
                <p style="margin:0; font-size:18px;">CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                <p style="margin:0; font-size:18px;font-weight: bold;"><u>Độc lập - Tự do - Hạnh phúc </u></p>
            </td>
        </tr>

      </table>
       <br>
       <p style="text-align:center;font-size: 20px;margin:6px 0;font-weight: bold;">BIÊN BẢN BÀN GIAO DANH SÁCH KÝ NỘP BÀI THI VÀ PHIẾU TÀI KHOẢN SAU KHI THI</p>
       <p style="text-align:center;font-size: 17px;margin:6px 0;font-weight: bold;">Địa điểm thi: Nhà T1-Trung tâm Khảo thí và quản lý chất lượng giáo dục - Đại học Thái Nguyên.</p>
       <p style="text-align:center;font-size: 17px;margin:6px 0">Đợt thi: ${hoidong['__ngaythi']}, Ca thi: ${e['name']} </p>
       <p style="text-align:justify;text-indent: 40px;font-size: 17px;margin:6px 0">Cán bộ coi thi và Kỹ thuật viên tiến hành bàn giao phiếu thu bài, túi đựng phiếu tài khoản dùng cho đợt thi đánh giá năng lực tiếng Trung HSK, ca thi ......................... </p>

       <table class="table-border">
        <tr>
            <th rowspan="2" style="text-align: center"><p style="font-size: 17px;margin:6px 0"">Phòng thi</p> </th>
            <th rowspan="2" style="text-align: center"><p style="font-size: 17px;margin:6px 0"">Cấp độ</p> </th>
            <th  colspan="3" style="text-align: center"><p style="font-size: 17px;margin:6px 0">Số thí sinh dự thi</p></th>
            <th  colspan="2" style="text-align: center"><p style="font-size: 17px;margin:6px 0"> Số phiếu tài khoản</p></th>
            <th rowspan="2" style="text-align: center"><p style="font-size: 17px;margin:6px 0"">Họ và tên cán bộ bàn giao</p> </th>
            <th rowspan="2" style="text-align: center"><p style="font-size: 17px;margin:6px 0"">Ký tên</p> </th>
        </tr>
        <tr>
            <th style="text-align: center"><p style="font-size: 17px;margin:6px 0">Theo danh sách </p> </th>
            <th style="text-align: center"><p style="font-size: 17px;margin:6px 0">Có mặt </p> </th>
            <th style="text-align: center"><p style="font-size: 17px;margin:6px 0">Vắng mặt </p> </th>
            <th style="text-align: center"><p style="font-size: 17px;margin:6px 0">Đã sử dụng </p> </th>
            <th style="text-align: center"><p style="font-size: 17px;margin:6px 0">Chưa sử dụng </p> </th>

        </tr>

      `;
      const dataChild = e['_arr']

      dataChild.forEach(a=>{
        html += `
          <tr>
            <th style="text-align: center"><p style="font-size: 17px;margin:6px 0"">${a['phongthi']}</p></th>
            <th style="text-align: center"><p style="font-size: 17px;margin:6px 0"">${a['_capHsk']}</p></th>
            <th style="text-align: center"><p style="font-size: 17px;margin:6px 0"">${a['soluong']}</p></th>
            <th style="text-align: center"><p style="font-size: 17px;margin:6px 0""></p> </th>
            <th style="text-align: center"><p style="font-size: 17px;margin:6px 0""></p> </th>
            <th style="text-align: center"><p style="font-size: 17px;margin:6px 0""></p> </th>
            <th style="text-align: center"><p style="font-size: 17px;margin:6px 0""></p> </th>
            <th style="text-align: center"><p style="font-size: 17px;margin:6px 0""></p> </th>
            <th style="text-align: center"><p style="font-size: 17px;margin:6px 0""></p> </th>

        </tr>
        `;
      })
      html += `       </table>
        <table style="width:100%;">
            <tr>
                <th style="text-align: center;"><p style="font-size: 17px;">TRƯỞNG BAN COI THI</p></th>
                <th style="text-align: center;"><p style="font-size: 17px;">CÁN BỘ NHẬN GIAO BÀI THI</p></th>
            </tr>
        </table>

        <div style="page-break-after: always"><br></div>

        `;

    })

    html += `</body></html>`;

    try {
      const fileBuffer = await asBlob(html , {
        orientation : "portrait" ,//portrait,landscape
        size: 'A4Ngang',
        margins     : {
          top    : 1000,
          right  : 1000 ,
          bottom : 1000 ,
          left   : 1000 ,
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
