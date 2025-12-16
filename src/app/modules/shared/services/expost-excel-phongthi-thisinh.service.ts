import { Injectable } from '@angular/core';
import * as fs from 'file-saver';
import { Workbook } from 'exceljs';
import * as XLSX from 'xlsx';
import {itemExportExcel} from "@modules/admin/features/hoi-dong/hoi-dong-thi/hoi-dong-thi.component";

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';



export interface PhongthiExportExcel {
  phongso: string;
  dsThisinh:any[];
  ngaythi:string;
}


@Injectable({
  providedIn: 'root'
})
export class ExpostExcelPhongthiThisinhService {
  constructor() { }

  exportExcelOnlySheet1(json: any[], headersArray: any[], nameexcelFileName: string){
    const header = headersArray;
    const workbook = new Workbook();
    workbook.created = new Date();
    workbook.modified = new Date();

    const worksheet = workbook.addWorksheet("V-SAT-TNU_SBD" );


    // worksheet.addRow([]);
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
      cell.font = { size: 13, bold: true, name: 'Times New Roman' };
      cell.alignment = { horizontal: 'center' };


      worksheet.getColumn(index).width = header[index - 1].length < 20 ? 20 : header[index - 1].length;
      worksheet.getColumn(1).width = 7;
      worksheet.getColumn(1).alignment = { horizontal: 'center' };
    });

    const objectColWidth = {
      1: 6,
      2: 6,
      3: 12,
      4: 24,
      5: 12,
      6: 12,
      7: 16,
      8: 36,
      9: 12,

      10: 16,
      11: 16,
      12: 16,
      13: 16,
      14: 16,
      15: 16,
      16: 16,

      17: 16,
      18: 16,
      19: 77,
      20: 16,
      21: 24,

      22: 16,
      23: 16,
      24: 77,
      25: 16,
      26: 24,

      27: 16,
      28: 16,
      29: 77,
      30: 16,
      31: 24,

      32: 16,
      33: 16,
      34: 77,
      35: 16,
      36: 24,

      37: 16,
      38: 16,
      39: 77,
      40: 16,
      41: 24,

      42: 16,
      43: 16,
      44: 77,
      45: 16,
      46: 24,

      47: 16,
      48: 16,
      49: 77,
      50: 16,
      51: 24,
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
        worksheet.addRow(eachRow);
      }
      //set with column to fit
      worksheet.columns.forEach((column, columnIndex) => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
          const cellLength = cell.value ? cell.value.toString().length : 0;
          maxLength = cellLength;
        });
        // worksheet.getColumn(columnIndex + 1).width = maxLength + 2;
      });

    });


    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], { type: EXCEL_TYPE });
      fs.saveAs(blob, nameexcelFileName + EXCEL_EXTENSION);
    })

  }
  exportExcel(
    json: any[],
    headersArray: any[],// column name
    excelFileName: string,
    sheet2data : any[],
    sheet2Header:any[],

  ): void {

    const header = headersArray;
    const workbook = new Workbook();
    workbook.created = new Date();
    workbook.modified = new Date();

      const worksheet = workbook.addWorksheet("V-SAT-TNU_SBD" );


      // worksheet.addRow([]);
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
        cell.font = { size: 13, bold: true, name: 'Times New Roman' };
        cell.alignment = { horizontal: 'center' };


        worksheet.getColumn(index).width = header[index - 1].length < 20 ? 20 : header[index - 1].length;
        worksheet.getColumn(1).width = 7;
        worksheet.getColumn(1).alignment = { horizontal: 'center' };
      });

      const objectColWidth = {
        1: 6,
        2: 6,
        3: 12,
        4: 24,
        5: 12,
        6: 12,
        7: 16,
        8: 36,
        9: 12,

        10: 16,
        11: 16,
        12: 16,
        13: 16,
        14: 16,
        15: 16,
        16: 16,


        17: 16,
        18: 16,
        19: 77,
        20: 16,
        21: 24,

        22: 16,
        23: 16,
        24: 77,
        25: 16,
        26: 24,

        27: 16,
        28: 16,
        29: 77,
        30: 16,
        31: 24,

        32: 16,
        33: 16,
        34: 77,
        35: 16,
        36: 24,

        37: 16,
        38: 16,
        39: 77,
        40: 16,
        41: 24,

        42: 16,
        43: 16,
        44: 77,
        45: 16,
        46: 24,

        47: 16,
        48: 16,
        49: 77,
        50: 16,
        51: 24,
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
          worksheet.addRow(eachRow);
        }
        //set with column to fit
        worksheet.columns.forEach((column, columnIndex) => {
          let maxLength = 0;
          column.eachCell({ includeEmpty: true }, (cell) => {
            const cellLength = cell.value ? cell.value.toString().length : 0;
            maxLength = cellLength;
          });
          // worksheet.getColumn(columnIndex + 1).width = maxLength + 2;
        });

      });


    const worksheet2 = workbook.addWorksheet("V-SAT-TNU_ROOM" );
    const headerRow2 = worksheet2.addRow(sheet2Header);
    headerRow2.eachCell((cell, index) => {

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
      cell.font = { size: 13, bold: true, name: 'Times New Roman' };
      cell.alignment = { horizontal: 'center' };


      worksheet2.getColumn(index).width = sheet2Header[index - 1].length < 20 ? 20 : sheet2Header[index - 1].length;
      worksheet2.getColumn(1).width = 7;
      worksheet2.getColumn(1).alignment = { horizontal: 'center' };
    });

    const objectColWidth2 = {
      1: 14,
      2: 14,
      3: 16,
      4: 16,
      5: 16,
      6: 16,
      7: 16,
      8: 16,
      9: 16,
      10: 24,
      11: 85,


    };

    this.setColWidth(worksheet2, objectColWidth2);
    let columnsArray2: any[];
    for (const key in sheet2data) {
      if (sheet2data.hasOwnProperty(key)) {
        columnsArray = Object.keys(sheet2data[key]);
      }
    }

    sheet2data.forEach((element: any) => {
      const eachRow = [];
      columnsArray.forEach((column) => {
        eachRow.push(element[column]);

      });

      if (element.isDeleted === 'Y') {
        const deleteRow = worksheet2.addRow(eachRow);
        deleteRow.eachCell((cell) => {
          cell.font = { name: 'Times New Roman', family: 4, size: 11, bold: false, strike: true };

        })
      } else {
        worksheet2.addRow(eachRow);
      }
      //set with column to fit
      worksheet2.columns.forEach((column, columnIndex) => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
          const cellLength = cell.value ? cell.value.toString().length : 0;
          maxLength = cellLength;
          cell.font = {name: 'Times New Roman', family: 1, size: 14, bold: false};
          cell.border = {
            top: {style: 'thin', color: {argb: '333333'}},
            left: {style: 'thin', color: {argb: '333333'}},
            bottom: {style: 'thin', color: {argb: '333333'}},
            right: {style: 'thin', color: {argb: '333333'}}
          };

        });
        // worksheet2.getColumn(columnIndex + 1).width = maxLength + 2;
      });

    });
    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], { type: EXCEL_TYPE });
      fs.saveAs(blob, excelFileName + EXCEL_EXTENSION);
    })
  }
  private numToAlpha(num: number) {
    let alpha = '';
    for (; num >= 0; num = parseInt((num / 26).toString(), 10) - 1) {
      alpha = String.fromCharCode(num % 26 + 0x41) + alpha;
    }
    return alpha;
  }

  setColWidth(ws, cols: {}) {
    Object.keys(cols).forEach((f, key) => {
      ws.getColumn(Number(f)).width = cols[f];
    })
  }


  public exportExcelToHoidong(ten_hoidong:string, headerArray:string[], dataMap:itemExportExcel[]){
    const workbook = new Workbook();
    dataMap.forEach((item)=>{
      const sheetname = item.sheet_name;
      const worksheet = workbook.addWorksheet(sheetname, { pageSetup: { paperSize: 9, orientation: 'portrait' } });

      const header_Cathi = item.header_Cathi;
      const header_phongthi = "Phòng : " + item.header_phongthi;
      const header_ngaythi = 'Ngày thi: ' + item.header_ngaythi;
      const time_start = "Môn thi: " + item.monthi + ', Thời gian Bắt đầu thi: ' + item.time_start;

      worksheet.addRow([header_Cathi]);
      worksheet.mergeCells('A1:' + this.numToAlpha(headerArray.length - 1) + '1');
      worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
      worksheet.getCell('A1').font = { size: 24, bold: true, name: 'Times New Roman' };

      worksheet.addRow([header_phongthi]);
      worksheet.mergeCells('A2:' + this.numToAlpha(headerArray.length - 1) + '2');
      worksheet.getCell('A2').alignment = { horizontal: 'center' };
      worksheet.getCell('A2').font = { size: 14, bold: true, name: 'Times New Roman' };

      worksheet.addRow([header_ngaythi]);
      worksheet.mergeCells('A3:' + this.numToAlpha(headerArray.length - 1) + '3');
      worksheet.getCell('A3').alignment = { horizontal: 'center' };
      worksheet.getCell('A3').font = { size: 14, bold: true, name: 'Times New Roman' };

      worksheet.addRow([time_start]);
      worksheet.mergeCells('A4:' + this.numToAlpha(headerArray.length - 1) + '4');
      worksheet.getCell('A4').alignment = { horizontal: 'center' };
      worksheet.getCell('A4').font = { size: 14, bold: true, name: 'Times New Roman' };


      const row = worksheet.addRow(headerArray);
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

      const objectColWidth = {
        1: 6,
        2: 16,
        3: 30,
        4: 15,
        5: 9,
        6: 24,
        7: 24,
        8: 24,
      };
      this.setColWidth(worksheet, objectColWidth);

      // Get all columns from JSON
      let columnsArray: any[];
      for (const key in item.thisinh) {
        if (item.thisinh.hasOwnProperty(key)) {
          columnsArray = Object.keys(item.thisinh[key]);
        }
      }
      //Add Data and Conditinal Formatting
      item.thisinh.forEach((element: any) => {
        const eachRow = [];
        columnsArray.forEach((column) => {
          eachRow.push(element[column]);
        });
        const Row = worksheet.addRow(eachRow);
        Row.eachCell((cell, colNumber) => {
          cell.font = { name: 'Times New Roman', family: 1, size: 14, bold: false };
          cell.border = {
            top: { style: 'thin', color: { argb: '333333' } },
            left: { style: 'thin', color: { argb: '333333' } },
            bottom: { style: 'thin', color: { argb: '333333' } },
            right: { style: 'thin', color: { argb: '333333' } }
          };

          if (colNumber === 1) { // Assuming colNumber 1 is the first column
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
          } else if (colNumber === 2) { // Assuming colNumber 2 is the second column
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
          }else if (colNumber === 3) { // Assuming colNumber 2 is the second column
            cell.alignment = { vertical: 'middle', horizontal: 'left' };
          }else if (colNumber === 4) { // Assuming colNumber 2 is the second column
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
          }else if (colNumber === 5) { // Assuming colNumber 2 is the second column
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
          }else if (colNumber === 6) { // Assuming colNumber 2 is the second column
            cell.alignment = { vertical: 'middle', horizontal: 'left' };
          }else if (colNumber === 7) { // Assuming colNumber 2 is the second column
            cell.alignment = { vertical: 'middle', horizontal: 'right' };
          }else if (colNumber === 8) { // Assuming colNumber 2 is the second column
            cell.alignment = { vertical: 'middle', horizontal: 'right' };
          }
        })
      });

    })

    workbook.xlsx.writeBuffer().then(buffer => {
      const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(data, 'V-SAT-TNU ('+ ten_hoidong +').xlsx' );
    });
  }


  exportHoidongPhongthi(fileName:string,headerArray:string[],dataMap: PhongthiExportExcel[] ){
    const workbook = new Workbook();
    dataMap.forEach((item)=>{
      const sheetname ='Phòng ' + item['phongso'];
      const worksheet = workbook.addWorksheet(sheetname, { pageSetup: { paperSize: 9, orientation: 'portrait' } });

      // const header_Cathi = item.;
      // const header_phongthi = "Phòng : " + item.header_phongthi;
      // const header_ngaythi = 'Ngày thi: ' + item.header_ngaythi;
      // const time_start = "Môn thi: " + item.monthi + ', Thời gian Bắt đầu thi: ' + item.time_start;

      worksheet.addRow([]);
      // worksheet.mergeCells('A1:' + this.numToAlpha(headerArray.length - 1) + '1');
      worksheet.getCell('C1').alignment = { vertical: 'middle', horizontal: 'center' };
      worksheet.getCell('C1').value = 'BỘ GIÁO DỤC VÀ ĐÀO TẠO';
      worksheet.getCell('C1').font = {size: 13, bold: false, name: 'Times New Roman',underline: false};

      worksheet.addRow([]);
      worksheet.getCell('C2').alignment = { vertical: 'middle', horizontal: 'center', };
      worksheet.getCell('C2').value = 'ĐẠI HỌC THÁI NGUYÊN';
      worksheet.getCell('C2').font = {size: 13, bold: true, name: 'Times New Roman',underline: true};

      worksheet.addRow([]);
      worksheet.addRow([]);

      worksheet.getCell('E4').alignment = { vertical: 'middle', horizontal: 'center', };
      worksheet.getCell('E4').font = {size: 13, bold: true, name: 'Times New Roman',underline: false};
      worksheet.getCell('E4').value = 'DANH SÁCH PHÒNG THI ' + item.phongso;
      worksheet.addRow([]);
      worksheet.getCell('E5').alignment = { vertical: 'middle', horizontal: 'center', };
      worksheet.getCell('E5').font = {size: 13, bold: true, name: 'Times New Roman',underline: false, italic :true};
      worksheet.getCell('E5').value = 'Ngày thi ' + item.ngaythi;
      worksheet.addRow([]);


      const row = worksheet.addRow(headerArray);
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

      const objectColWidth = {
        1 : 6,
        2 : 15,
        3 : 30,
        4 : 13,
        5 : 8,
        6 : 17,
        7 : 8,
        8 : 8,
        9 : 8,
        10: 8,
        11: 8,
        12: 8,
        13: 8,
      };
      this.setColWidth(worksheet, objectColWidth);

      // Get all columns from JSON
      let columnsArray: any[];
      for (const key in item.dsThisinh) {
        if (item.dsThisinh.hasOwnProperty(key)) {
          columnsArray = Object.keys(item.dsThisinh[key]);
        }
      }
      //Add Data and Conditinal Formatting

      item.dsThisinh.forEach((element: any) => {
        const eachRow = [];
        columnsArray.forEach((column) => {
          eachRow.push(element[column]);
        });
        const Row = worksheet.addRow(eachRow);
        Row.eachCell((cell, colNumber) => {
          cell.font = { name: 'Times New Roman', family: 1, size: 13, bold: false };
          cell.border = {
            top: { style: 'thin', color: { argb: '333333' } },
            left: { style: 'thin', color: { argb: '333333' } },
            bottom: { style: 'thin', color: { argb: '333333' } },
            right: { style: 'thin', color: { argb: '333333' } }
          };

          if (colNumber === 1) { // Assuming colNumber 1 is the first column
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
          } else if (colNumber === 2) { // Assuming colNumber 2 is the second column
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
          }else if (colNumber === 3) { // Assuming colNumber 2 is the second column
            cell.alignment = { vertical: 'middle', horizontal: 'left' };
          }else if (colNumber === 4) { // Assuming colNumber 2 is the second column
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
          }else if (colNumber === 5) { // Assuming colNumber 2 is the second column
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
          }else if (colNumber === 6) { // Assuming colNumber 2 is the second column
            cell.alignment = { vertical: 'middle', horizontal: 'right' };
          }else if (colNumber === 7) { // Assuming colNumber 2 is the second column
            cell.alignment = { vertical: 'middle', horizontal: 'right' };
          }
        })
      });

      worksheet.addRow([]);

    })



    workbook.xlsx.writeBuffer().then(buffer => {
      const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(data, 'V-SAT-TNU ('+ fileName +').xlsx' );
    });
  }
}
