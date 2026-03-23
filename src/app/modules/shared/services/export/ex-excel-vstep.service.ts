import { Injectable } from '@angular/core';
import {Workbook} from "exceljs";
import * as fs from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class ExExcelVstepService {

  constructor(
  ) { }

  // setColWidth(ws, cols: {}) {
  //   Object.keys(cols).forEach((f, key) => {
  //     ws.getColumn(Number(f)).width = cols[f];
  //   })
  // }
  // setCellProperties(cell, sizeNumber, options) {
  //   cell.alignment = { horizontal: 'center', vertical: 'middle' };
  //   cell.font = { name: 'Times New Roman', size: sizeNumber, ...options };
  // }

  convertDateTimeByPhong(text1:string){
    const textiDate =new Date(text1);

    return textiDate.getDate() + '/'+ (textiDate.getMonth() + 1) + '/' + textiDate.getFullYear();
  }

  converNgaysinh(text1:string){

    return text1.replace(/\//g, '.');
  }

  converNgayKy(text1:string){
    const date  = new Date(text1);
    return 'Ngày ' + date.getDate() + ' tháng '+ (date.getMonth() + 1) + ' năm ' + date.getFullYear();
  }

  removeTinhThanh(text: string): string {
    return text.replace(/^(Tỉnh|Thành phố)\s+/i, '').trim();
  }

  //-----------------------------------Mẫu danh sách thí sinh theo phòng-----------------------
  exDsThisinhByPhongthi(arrPhong:any[],monName:string,hoidong:any,fileName:string,type:'landscape'|'portrait'){
    let workbook = new Workbook();
    workbook.created = new Date();
    workbook.modified = new Date();
    if(arrPhong.length>0){
      arrPhong.forEach((m,index)=>{
        const sheetName = (m['_diemthi'] ? m['_diemthi']['code']:'') + ' - Phòng ' + m['phongthi'];
        this.exItemForthisinhByPhongthi(m,hoidong,sheetName,workbook, monName,type);
      })
    }


    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], { type: EXCEL_TYPE });
      fs.saveAs(blob, fileName + ' - ' + hoidong['title'] + EXCEL_EXTENSION);
    })
  }

  private exItemForthisinhByPhongthi(m, hoidong,sheetName:string,workbook: Workbook,monName: string,type:'landscape'|'portrait'):Workbook {
    const worksheet = workbook.addWorksheet(sheetName);

    worksheet.pageSetup ={
      paperSize: 9,
      orientation: type,
      horizontalCentered: true,
      verticalCentered: false,
      fitToPage: true,
      margins:{
        left: 0.25, right: 0.25,
        top: 0.75, bottom: 0.75,
        header: 0.3, footer: 0.3
      }
    }

    worksheet.mergeCells('A1:C1');
    worksheet.getCell('A1').value = {
      richText: [{text: 'ĐẠI HỌC THÁI NGUYÊN', font: {name: 'Times New Roman', color: {argb: '000000'}, size: 13, bold: false}}]};
    worksheet.getCell('A1').alignment = {horizontal: 'center', vertical: 'middle'};

    worksheet.mergeCells('A2:C2');
    worksheet.getCell('A2').value = {
      richText: [{text: 'HỘI ĐỒNG THI ĐÁNH GIÁ NLNN', font: {name: 'Times New Roman', color: {argb: '000000'}, size: 13, bold: true}}]};
    worksheet.getCell('A2').alignment = {horizontal: 'center', vertical: 'middle'};

    worksheet.mergeCells('A4:F4');
    worksheet.getCell('A4').value = {
      richText: [{text: 'DANH SÁCH THÍ SINH DỰ THI ĐÁNH GIÁ NĂNG LỰC NGOẠI NGỮ', font: {name: 'Times New Roman', color: {argb: '000000'}, size: 13, bold: true}}]};
    worksheet.getCell('A4').alignment = {horizontal: 'center', vertical: 'middle'};

    worksheet.mergeCells('A5:F5');
    worksheet.getCell('A5').value = {
      richText: [{text: `HỘI ĐỒNG THI NGÀY ${this.convertDateTimeByPhong(m['ngaythi'])}`, font: {name: 'Times New Roman', color: {argb: '000000'}, size: 13, bold: true}}]};
    worksheet.getCell('A5').alignment = {horizontal: 'center', vertical: 'middle'};

    worksheet.mergeCells('A6:B6');
    worksheet.getCell('A6').value = {
      richText: [{text: `Phòng thi: ${m['phongthi']}`, font: {name: 'Times New Roman', color: {argb: '000000'}, size: 13, bold: true}}]};
    worksheet.getCell('A6').alignment = {horizontal: 'left', vertical: 'middle'};

    worksheet.mergeCells('C6:D6');
    worksheet.getCell('C6').value = {
      richText: [{text: `Ngôn ngữ: ${monName}`, font: {name: 'Times New Roman', color: {argb: '000000'}, size: 13, bold: true}}]};
    worksheet.getCell('C6').alignment = {horizontal: 'left', vertical: 'middle'};

    worksheet.mergeCells('E6:F6');
    worksheet.getCell('E6').value = {
      richText: [{text: `Ca thi : ${m['thoigian_duthi']}`, font: {name: 'Times New Roman', color: {argb: '000000'}, size: 13, bold: true}}]};
    worksheet.getCell('E6').alignment = {horizontal: 'left', vertical: 'middle'};

    // worksheet.addRow([]);

    const row4 = worksheet.getRow(4);
    row4.height = 30;

    const row5 = worksheet.getRow(5);
    row5.height = 25;

    const row6 = worksheet.getRow(5);
    row6.height = 20;

    const listHeader = ['STT','SBD','Họ và tên','Giới tính','Ngày sinh','Số CCCD/HC'];
    const headerRow = worksheet.addRow(listHeader);
    headerRow.height = 30;

    headerRow.eachCell(cell => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ffffff' }
      };

      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };

      cell.font = { size: 13, bold: true, name: 'Times New Roman' };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    const dsThisinh = m['_listThisinh'].map((m,index)=>{
      const thisinh = m['thisinh'];

      return {
        stt:index+1,
        sobaodanh:m['sobaodanh'],
        hoten:thisinh ? thisinh['hoten']:'',
        gioitinh:thisinh && thisinh['gioitinh'] ? (thisinh['gioitinh'] == 'nu' ? 'Nữ' : 'Nam') :'',
        ngaysinh:thisinh ? this.converNgaysinh(thisinh['ngaysinh']) :'',
        cccd_so:thisinh ? thisinh['cccd_so'] :'',

      }
    });


    dsThisinh.forEach(item => {
      const row = worksheet.addRow([
        item.stt,
        item.sobaodanh,
        item.hoten,
        item.gioitinh,
        item.ngaysinh,
        item.cccd_so
      ]);

      row.height = 20;

      row.eachCell((cell, index) => {

        cell.border = {
          top: {style: 'thin'},
          left: {style: 'thin'},
          bottom: {style: 'thin'},
          right: {style: 'thin'}
        };

        cell.font = {name: 'Times New Roman', size: 12};

        if (index === 3) {
          cell.alignment = {horizontal: 'left', vertical: 'middle'};
        } else {
          cell.alignment = {horizontal: 'center', vertical: 'middle'};
        }

      });

    });


    const row = worksheet.addRow([
      `Ấn định danh sách có ${dsThisinh.length} thí sinh./`
    ]);

    worksheet.mergeCells(`A${row.number}:F${row.number}`);

    row.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
    row.getCell(1).font = { name: 'Times New Roman', size: 12,italic:true };


    worksheet.columns = [
      { width: 8 },
      { width: 22 },
      { width: 25 },
      { width: 12 },
      { width: 15 },
      { width: 25 }
    ];

    return  workbook;
  }

  //------------------------------Mẫu danh sách ký nộp thí sinh---------------------------------
  exDsThisinhKynopbai(arrPhong:any[],monName:string,hoidong:any,fileName:string,type:'landscape'|'portrait'){
    // const header = headersArray;
    let workbook = new Workbook();
    workbook.created = new Date();
    workbook.modified = new Date();
    if(arrPhong.length>0){
      arrPhong.forEach((m,index)=>{
        const sheetName = (m['_diemthi'] ? m['_diemthi']['code']:'') + ' - Phòng ' + m['phongthi'];
        this.exItemForthisinhKynopbai(m,hoidong,sheetName,workbook, monName,type);
      })
    }


    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], { type: EXCEL_TYPE });
      fs.saveAs(blob, fileName + ' - ' + hoidong['title'] + EXCEL_EXTENSION);
    })
  }


  private exItemForthisinhKynopbai(m, hoidong,sheetName:string,workbook: Workbook,monName: string,type:'landscape'|'portrait'):Workbook {
    const worksheet = workbook.addWorksheet(sheetName);

    worksheet.pageSetup ={
      paperSize: 9,
      orientation: type,
      horizontalCentered: true,
      verticalCentered: false,
      fitToPage: true,
      margins:{
        left: 0.25, right: 0.25,
        top: 0.75, bottom: 0.75,
        header: 0.3, footer: 0.3
      }
    }

    worksheet.mergeCells('A1:C1');
    worksheet.getCell('A1').value = {
      richText: [{text: 'ĐẠI HỌC THÁI NGUYÊN', font: {name: 'Times New Roman', color: {argb: '000000'}, size: 13, bold: false}}]};
    worksheet.getCell('A1').alignment = {horizontal: 'center', vertical: 'middle'};

    worksheet.mergeCells('A2:C2');
    worksheet.getCell('A2').value = {
      richText: [{text: 'HỘI ĐỒNG THI ĐÁNH GIÁ NLNN', font: {name: 'Times New Roman', color: {argb: '000000'}, size: 13, bold: true}}]};
    worksheet.getCell('A2').alignment = {horizontal: 'center', vertical: 'middle'};

    worksheet.mergeCells('A4:F4');
    worksheet.getCell('A4').value = {
      richText: [{text: 'DANH SÁCH THÍ SINH DỰ THI ĐÁNH GIÁ NĂNG LỰC NGOẠI NGỮ', font: {name: 'Times New Roman', color: {argb: '000000'}, size: 13, bold: true}}]};
    worksheet.getCell('A4').alignment = {horizontal: 'center', vertical: 'middle'};

    worksheet.mergeCells('A5:F5');
    worksheet.getCell('A5').value = {
      richText: [{text: `HỘI ĐỒNG THI NGÀY ${this.convertDateTimeByPhong(m['ngaythi'])}`, font: {name: 'Times New Roman', color: {argb: '000000'}, size: 13, bold: true}}]};
    worksheet.getCell('A5').alignment = {horizontal: 'center', vertical: 'middle'};

    worksheet.mergeCells('A6:B6');
    worksheet.getCell('A6').value = {
      richText: [{text: `Phòng thi: ${m['phongthi']}`, font: {name: 'Times New Roman', color: {argb: '000000'}, size: 13, bold: true}}]};
    worksheet.getCell('A6').alignment = {horizontal: 'left', vertical: 'middle'};

    worksheet.mergeCells('C6:D6');
    worksheet.getCell('C6').value = {
      richText: [{text: `Ngôn ngữ: ${monName}`, font: {name: 'Times New Roman', color: {argb: '000000'}, size: 13, bold: true}}]};
    worksheet.getCell('C6').alignment = {horizontal: 'left', vertical: 'middle'};

    worksheet.mergeCells('E6:F6');
    worksheet.getCell('E6').value = {
      richText: [{text: `Ca thi : ${m['thoigian_duthi']}`, font: {name: 'Times New Roman', color: {argb: '000000'}, size: 13, bold: true}}]};
    worksheet.getCell('E6').alignment = {horizontal: 'left', vertical: 'middle'};

    // worksheet.addRow([]);

    const row4 = worksheet.getRow(4);
    row4.height = 30;

    const row5 = worksheet.getRow(5);
    row5.height = 25;

    const row6 = worksheet.getRow(5);
    row6.height = 20;

    const listHeader = ['STT','SBD','Họ và tên','Giới tính','Ngày sinh','Ký nộp bài'];
    const headerRow = worksheet.addRow(listHeader);
    headerRow.height = 30;

    headerRow.eachCell(cell => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ffffff' }
      };

      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };

      cell.font = { size: 13, bold: true, name: 'Times New Roman' };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };

    });

    const dsThisinh = m['_listThisinh'].map((m,index)=>{
      const thisinh = m['thisinh'];

      return {
        stt:index+1,
        sobaodanh:m['sobaodanh'],
        hoten:thisinh ? thisinh['hoten']:'',
        gioitinh:thisinh && thisinh['gioitinh'] ? (thisinh['gioitinh'] == 'nu' ? 'Nữ' : 'Nam') :'',
        ngaysinh:thisinh ? this.converNgaysinh(thisinh['ngaysinh']) :'',
        // cccd_so:thisinh ? thisinh['cccd_so'] :'',
        kynop:'',

      }
    });

    dsThisinh.forEach(item => {
      const row = worksheet.addRow([
        item.stt,
        item.sobaodanh,
        item.hoten,
        item.gioitinh,
        item.ngaysinh,
        item.kynop
      ]);

      row.height =20;

      row.eachCell((cell, index) => {

        cell.border = {
          top: {style: 'thin'},
          left: {style: 'thin'},
          bottom: {style: 'thin'},
          right: {style: 'thin'}
        };

        cell.font = {name: 'Times New Roman', size: 12};

        if (index === 3) {
          cell.alignment = {horizontal: 'left', vertical: 'middle'};
        } else {
          cell.alignment = {horizontal: 'center', vertical: 'middle'};
        }

      });

    });


    const row = worksheet.addRow([
      `Tổng số thí sinh thực thi: ${dsThisinh.length} thí sinh, đình chỉ:..... thí sinh.`
    ]);

    worksheet.mergeCells(`A${row.number}:F${row.number}`);

    row.getCell(1).alignment = { horizontal: 'left' , vertical: 'middle' };
    row.getCell(1).font = { name: 'Times New Roman', size: 12,italic: true };


    const rowNgayh = worksheet.addRow([]);

    worksheet.mergeCells(`D${rowNgayh.number}:F${rowNgayh.number}`);

    const cell = rowNgayh.getCell('D');
    cell.value = {
      richText: [
        {
          text: `${this.converNgayKy(m['ngaythi'])}`,
          font: {
            name: 'Times New Roman',
            size: 12,
            bold: true,
            color: { argb: 'FF000000' },
            italic: true
          }
        }
      ]
    };

    cell.alignment = { horizontal: 'center' , vertical: 'middle' };


    const rowCb = worksheet.addRow(['Cán bộ coi thi 1','','', 'Cán bộ coi thi 2']);

    ['A', 'D'].forEach(col => {
      const cell = rowCb.getCell(col);

      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.font = {
        name: 'Times New Roman',
        size: 12,
        bold: true,
        color: { argb: 'FF000000' }
      };
    });

    worksheet.mergeCells(`A${rowCb.number}:C${rowCb.number}`);
    worksheet.mergeCells(`D${rowCb.number}:F${rowCb.number}`);


    worksheet.columns = [
      { width: 8 },
      { width: 22 },
      { width: 25 },
      { width: 12 },
      { width: 15 },
      { width: 25 }
    ];

    return  workbook;
  }

  //-------------------------------Mẫu xác nhật thông tin cả nhân---------------------
  exDsThisinhKyXacnhan(arrPhong:any[],monName:string,hoidong:any,fileName:string, type:'landscape'|'portrait'){
    // const header = headersArray;
    let workbook = new Workbook();
    workbook.created = new Date();
    workbook.modified = new Date();

    if(arrPhong.length>0){
      arrPhong.forEach((m,index)=>{
        const sheetName = (m['_diemthi'] ? m['_diemthi']['code']:'') + ' - P ' + m['phongthi'];
        this.exItemDsThisinhXacnhan(m,hoidong,sheetName,workbook, monName, type);
      })
    }


    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], { type: EXCEL_TYPE });
      fs.saveAs(blob, fileName + ' - ' + hoidong['title'] + EXCEL_EXTENSION);
    })
  }

  private exItemDsThisinhXacnhan(m, hoidong, sheetName: string, workbook: Workbook, monName: string,type:'landscape'|'portrait'): Workbook {

    const worksheet = workbook.addWorksheet(sheetName);
    worksheet.pageSetup ={
      paperSize: 9,
      orientation: type,
      horizontalCentered: true,
      verticalCentered: false,
      fitToPage: true,
      margins:{
        left: 0.25, right: 0.25,
        top: 0.75, bottom: 0.75,
        header: 0.3, footer: 0.3
      }
    }
    // ===== HEADER TRÊN =====

    worksheet.mergeCells('A1:C1');
    worksheet.getCell('A1').value = 'ĐẠI HỌC THÁI NGUYÊN';
    worksheet.getCell('A1').font = { name: 'Times New Roman', size: 13 };
    worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.mergeCells('A2:C2');
    worksheet.getCell('A2').value = 'HỘI ĐỒNG THI ĐÁNH GIÁ NLNN';
    worksheet.getCell('A2').font = { name: 'Times New Roman', size: 13, bold: true };
    worksheet.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.mergeCells('A3:M3');
    worksheet.getCell('A3').value = 'DANH SÁCH THÍ SINH XÁC NHẬN THÔNG TIN CÁ NHÂN';
    worksheet.getCell('A3').font = { name: 'Times New Roman', size: 14, bold: true };
    worksheet.getCell('A3').alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.mergeCells('A4:M4');
    worksheet.getCell('A4').value = 'ĐĂNG KÝ THAM GIA ĐÁNH GIÁ NĂNG LỰC NGOẠI NGỮ';
    worksheet.getCell('A4').font = { name: 'Times New Roman', size: 13, bold: true };
    worksheet.getCell('A4').alignment = { horizontal: 'center', vertical: 'middle' };

    // ===== THÔNG TIN PHÒNG THI =====

    worksheet.mergeCells('A5:C5');
    worksheet.getCell('A5').value = `Ngày thi: ${this.convertDateTimeByPhong(m['ngaythi'])}`;
    worksheet.getCell('A5').font = { name: 'Times New Roman', size: 12 };

    worksheet.mergeCells('D5:E5');
    worksheet.getCell('D5').value = `Ca thi: ${m['thoigian_duthi']}`;
    worksheet.getCell('D5').font = { name: 'Times New Roman', size: 12 };

    worksheet.mergeCells('F5:G5');
    worksheet.getCell('F5').value = `Phòng thi: ${m['phongthi']}`;
    worksheet.getCell('F5').font = { name: 'Times New Roman', size: 12 };

    // ===== HEADER BẢNG =====

    const headerRow1 = [
      "STT", "SBD", "HỌ VÀ TÊN", "NGÀY SINH", "NƠI SINH", "GIỚI TÍNH",
      "DÂN TỘC", "SỐ CCCD",
      "YÊU CẦU ĐIỀU CHỈNH THÔNG TIN", "",
      "NỘI DUNG SAI SÓT", "THÔNG TIN ĐÚNG", "KÝ XÁC NHẬN"
    ];

    const headerRow2 = [
      "", "", "", "", "", "", "", "",
      "CÓ", "KHÔNG",
      "", "", ""
    ];

    const row1 = worksheet.addRow(headerRow1); // row 6
    const row2 = worksheet.addRow(headerRow2); // row 7

    [row1, row2].forEach(row => {
      row.eachCell(cell => {

        cell.font = {name: 'Times New Roman', size: 12, bold: true};
        cell.alignment = {horizontal: 'center', vertical: 'middle', wrapText: true};
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };

      });
    });

    // ===== MERGE HEADER =====

    for (let i = 1; i <= 8; i++) {
      worksheet.mergeCells(6, i, 7, i);
    }

    worksheet.mergeCells('I6:J6');
    worksheet.mergeCells('K6:K7');
    worksheet.mergeCells('L6:L7');
    worksheet.mergeCells('M6:M7');

    // ---------------------------------------
    const dsThisinh = m['_listThisinh'].map((m,index)=>{
      const thisinh = m['thisinh'];

      return {
        stt:index+1,
        sobaodanh:m['sobaodanh'],
        hoten:thisinh ? thisinh['hoten']:'',
        ngaysinh:thisinh ? this.converNgaysinh(thisinh['ngaysinh']) :'',
        noisinh: thisinh && thisinh['noisinh']?  this.removeTinhThanh(thisinh['noisinh']) : '',
        gioitinh:thisinh && thisinh['gioitinh'] ? (thisinh['gioitinh'] == 'nu' ? 'Nữ' : 'Nam') :'',
        dantoc: thisinh && thisinh['dantoc'] ? thisinh['dantoc'] : '',
        cccd_so:thisinh ? thisinh['cccd_so'] :'',
        // cccd_so:thisinh ? thisinh['cccd_so'] :'',
        co:'',
        khong:'',
        contentSai:'',
        contentDunf:'',
        kynop:'',

      }
    });
    dsThisinh.forEach(item => {
      const row = worksheet.addRow([

        item.stt,
        item.sobaodanh,
        item.hoten,
        item.ngaysinh,
        item.noisinh,
        item.gioitinh,
        item.dantoc,
        item.cccd_so,
        item.co,
        item.khong,
        item.contentSai,
        item.contentDunf,
        item.kynop,
      ]);

      row.height =20;

      row.eachCell((cell, index) => {

        cell.border = {
          top: {style: 'thin'},
          left: {style: 'thin'},
          bottom: {style: 'thin'},
          right: {style: 'thin'}
        };

        cell.font = {name: 'Times New Roman', size: 12};

        if (index === 3) {
          cell.alignment = {horizontal: 'left', vertical: 'middle'};
        } else {
          cell.alignment = {horizontal: 'center', vertical: 'middle'};
        }

      });

    });


    // --------------------------------bottom----------------------

    // Ấn định danh sách có: ............ thí sinh./. Thực có:.…….; Vắng……./.
    const row = worksheet.addRow([
      `Ấn định danh sách có: ${dsThisinh.length} thí sinh./. Thực có:.....; Vắng:......`
    ]);

    row.height= 18;

    worksheet.mergeCells(`A${row.number}:F${row.number}`);

    row.getCell(1).alignment = { horizontal: 'left' , vertical: 'middle' };
    row.getCell(1).font = { name: 'Times New Roman', size: 10,italic: true };


    const rowCb = worksheet.addRow([]);
    rowCb.height=18;
    ['A', 'D'].forEach(col => {
      const cell = rowCb.getCell(col);

      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.font = {
        name: 'Times New Roman',
        size: 10,
        bold: false,
        color: { argb: 'FF000000' }
      };
    });

     worksheet.mergeCells(`A${rowCb.number}:D${rowCb.number}`);
    const cbct1=worksheet.getCell(`A${rowCb.number}`);
    cbct1.value = {
      richText: [{text: 'Cán bộ coi thi 1', font: {name: 'Times New Roman', color: {argb: '000000'}, size: 10, bold: false}},
        {
          text:'(Ký và ghi rõ họ tên)',font:{name: 'Times New Roman', color: {argb: '000000'}, size: 10, bold: false,italic:true}
        }]};
    cbct1.alignment = {horizontal: 'center', vertical: 'middle'};



    worksheet.mergeCells(`E${rowCb.number}:M${rowCb.number}`);
    const cbct2=worksheet.getCell(`E${rowCb.number}`);
    cbct2.value = {
      richText: [{text: 'Cán bộ coi thi 2', font: {name: 'Times New Roman', color: {argb: '000000'}, size: 10, bold: false}},
        {
          text:'(Ký và ghi rõ họ tên)',font:{name: 'Times New Roman', color: {argb: '000000'}, size: 10, bold: false,italic:true}
        }]};
    cbct2.alignment = {horizontal: 'center', vertical: 'middle'};



    // ===== WIDTH HEIGHT COLUMNS =====

    worksheet.getRow(3).height = 25;
    worksheet.getRow(4).height = 20;
    worksheet.getRow(6).height = 43;

    worksheet.columns = [
      { width: 6 },
      { width: 21 },
      { width: 25 },
      { width: 13 },
      { width: 18 },
      { width: 10 },
      { width: 10 },
      { width: 18 },
      { width: 14 },
      { width: 14 },
      { width: 18 },
      { width: 18 },
      { width: 16 }
    ];

    return workbook;
  }


}
