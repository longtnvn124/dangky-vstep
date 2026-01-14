import { Injectable } from '@angular/core';
import {Workbook} from "exceljs";
import * as fs from 'file-saver';
import {asBlob} from "@shared/vendor/html-docx";
@Injectable({
  providedIn: 'root'
})
export class ExpThisinhDuthiService {

  export(object:any, title:string, fileName:string,header:any, headerName:string ) {

    const wb = new Workbook();
    const worksheet = wb.addWorksheet('Danh sách thí sinh', { pageSetup: { paperSize: 9, orientation: 'portrait' } });

    const text_header = headerName +  '('+ title +')';
    worksheet.addRow([text_header]);
    worksheet.addRow([""]);
    // const header =header
    //   [
    //     "STT",
    //     "MADK",
    //     "Trạng thái",
    //     "Họ và tên",
    //     "Ngày sinh",
    //     "Giới tính",
    //     "CCCD/CMND",
    //     "Email",
    //     "Điện thoại",
    //     "Cấp Hsk đăng ký",
    //     "Ghi chú",
    //     "Thời gian thanh toán"
    //   ]

    worksheet.pageSetup.margins = {
      left: 0, right: 0,
      top: 0.4, bottom: 0.4,
      header: 0.3, footer: 0.3
    };


    header.forEach((d, index) => {
      const row = worksheet.addRow(d);
      row.worksheet.pageSetup.showRowColHeaders = true;
      row.eachCell((cell, number) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' },
          bgColor: { argb: 'FFFFFF' },
        };
        cell.font = { name: 'Times New Roman', family: 1, size: 12, bold: true };
        cell.alignment = { vertical: 'middle', horizontal: 'center', shrinkToFit: true, wrapText: true };
        cell.border = {
          top: { style: 'thin', color: { argb: '333333' } },
          left: { style: 'thin', color: { argb: '333333' } },
          bottom: { style: 'thin', color: { argb: '333333' } },
          right: { style: 'thin', color: { argb: '333333' } }
        };
      });
    })

    worksheet.mergeCells('A1:L1');
    this.setCellProperties(worksheet.getCell('A1'), 14, { bold: true });
    worksheet.mergeCells('A3:A4');
    this.setCellProperties(worksheet.getCell('A3'), 14, { bold: true });
    worksheet.mergeCells('B3:B4');
    this.setCellProperties(worksheet.getCell('B3'), 14, { bold: true });
    worksheet.mergeCells('C3:C4');
    this.setCellProperties(worksheet.getCell('C3'), 14, { bold: true });
    worksheet.mergeCells('D3:D4');
    this.setCellProperties(worksheet.getCell('AD3'), 14, { bold: true });
    worksheet.mergeCells('E3:E4');
    this.setCellProperties(worksheet.getCell('E3'), 14, { bold: true });
    worksheet.mergeCells('F3:F4');
    this.setCellProperties(worksheet.getCell('F3'), 14, { bold: true });
    worksheet.mergeCells('G3:G4');
    this.setCellProperties(worksheet.getCell('G3'), 14, { bold: true });
    worksheet.mergeCells('H3:H4');
    this.setCellProperties(worksheet.getCell('H3'), 14, { bold: true });
    worksheet.mergeCells('I3:I4');
    this.setCellProperties(worksheet.getCell('I3'), 14, { bold: true });
    worksheet.mergeCells('J3:J4');
    this.setCellProperties(worksheet.getCell('J3'), 14, { bold: true });
    worksheet.mergeCells('K3:K4');
    this.setCellProperties(worksheet.getCell('K3'), 14, { bold: true });
    worksheet.mergeCells('L3:L4');
    this.setCellProperties(worksheet.getCell('L3'), 14, { bold: true });



    const objectColWidth = {
      1: 6,
      2: 12,
      3: 24,
      4: 25,
      5: 13,
      6: 13,
      7: 19,
      8: 37,
      9: 18,
      10: 30,
      11: 20,
      12: 26,
    };
    this.setColWidth(worksheet, objectColWidth);
    // Get all columns from JSON
    let columnsArray: any[];
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        columnsArray = Object.keys(object[key]);
      }
    }
    object.forEach((element: any) => {
      const eachRow = [];
      columnsArray.forEach((column) => {
        eachRow.push(element[column]);
      });
      if (element.isDeleted === 'Y') {
        const deleteRow = worksheet.addRow(eachRow);
        deleteRow.eachCell((cell) => {
          cell.font = { name: 'Times New Roman', family: 4, size: 11, bold: false, strike: true };
          cell.border = {
            top: { style: 'thin', color: { argb: '333333' } },
            left: { style: 'thin', color: { argb: '333333' } },
            bottom: { style: 'thin', color: { argb: '333333' } },
            right: { style: 'thin', color: { argb: '333333' } }
          };
        })
      } else {
        worksheet.addRow(eachRow);
      }

    });


    wb.xlsx.writeBuffer().then(buffer => {
      const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(data, fileName + '('+ title +').xlsx' );
    });


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

}
