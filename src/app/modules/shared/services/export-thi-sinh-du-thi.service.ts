import { Injectable } from '@angular/core';
import {Workbook} from "exceljs";
import * as fs from 'file-saver';
import {asBlob} from "@shared/vendor/html-docx";
// const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
// const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class ExportThiSinhDuThiService {

  constructor() { }

  exportToLong(object:any, title:string) {

    const wb = new Workbook();
    const worksheet = wb.addWorksheet('Danh sách thí sinh', { pageSetup: { paperSize: 9, orientation: 'portrait' } });

    const text_header = 'TRẠNG THÁI ĐĂNG KÝ THI TNU ('+ title +')';
    worksheet.addRow([text_header]);
    worksheet.addRow([""]);
    const header =
      [
        [
          "STT",
          "ID",
          "MADK",
          "Trạng thái",
          "Họ và tên",
          "Ngày sinh",
          "Giới tính",
          "CCCD/CMND",
          "Email",
          "Điện thoại",
          "Môn đăng ký thi"
        ],
        [
          "",
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          "Toán",
          "Vật lí",
          "Hoá học",
          "Sinh học",
          "Lịch sử",
          "Địa lí",
          "Tiếng Anh"
        ]
      ]

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

    worksheet.mergeCells('A1:Q1');
    this.setCellProperties(worksheet.getCell('A1'), 14, { bold: true });
    worksheet.mergeCells('A3:A4');
    this.setCellProperties(worksheet.getCell('A3'), 14, { bold: true });
    worksheet.mergeCells('B3:B4');
    this.setCellProperties(worksheet.getCell('A3'), 14, { bold: true });
    worksheet.mergeCells('C3:C4');
    this.setCellProperties(worksheet.getCell('A3'), 14, { bold: true });
    worksheet.mergeCells('D3:D4');
    this.setCellProperties(worksheet.getCell('A3'), 14, { bold: true });
    worksheet.mergeCells('E3:E4');
    this.setCellProperties(worksheet.getCell('A3'), 14, { bold: true });
    worksheet.mergeCells('F3:F4');
    this.setCellProperties(worksheet.getCell('A3'), 14, { bold: true });
    worksheet.mergeCells('G3:G4');
    this.setCellProperties(worksheet.getCell('A3'), 14, { bold: true });
    worksheet.mergeCells('H3:H4');
    this.setCellProperties(worksheet.getCell('A3'), 14, { bold: true });
    worksheet.mergeCells('I3:I4');
    this.setCellProperties(worksheet.getCell('A3'), 14, { bold: true });
    worksheet.mergeCells('J3:J4');
    this.setCellProperties(worksheet.getCell('A3'), 14, { bold: true });

    worksheet.mergeCells('K3:Q3');
    this.setCellProperties(worksheet.getCell('K3'), 14, { bold: true });


    const objectColWidth = {
      1: 6,
      2: 6,
      3: 12,
      4: 25,
      5: 25,
      6: 13,
      7: 13,
      8: 18,
      9: 34,
      10: 13,
      11: 12,
      12: 12,
      13: 12,
      14: 12,
      15: 12,
      16: 12,
      17: 12,

    };

    this.setColWidth(worksheet, objectColWidth);

    // Get all columns from JSON
    let columnsArray: any[];
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        columnsArray = Object.keys(object[key]);
      }
    }
    //Add Data and Conditinal Formatting

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
      //set with column to fit
      // worksheet.columns.forEach((column, columnIndex) => {
      //   let maxLength = 0;
      //   column.eachCell({ includeEmpty: true }, (cell) => {
      //     const cellLength = cell.value ? cell.value.toString().length : 0;
      //     maxLength = cellLength;
      //   });
      //   worksheet.getColumn(columnIndex + 2).width = maxLength + 2;
      // });
    });


    wb.xlsx.writeBuffer().then(buffer => {
      const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(data, 'VSAT-TNU('+ title +').xlsx' );
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


  exportToLongHsk(object:any, title:string) {

    const wb = new Workbook();
    const worksheet = wb.addWorksheet('Danh sách thí sinh', { pageSetup: { paperSize: 9, orientation: 'portrait' } });

    const text_header = 'TRẠNG THÁI ĐĂNG KÝ THI HSK ('+ title +')';
    worksheet.addRow([text_header]);
    worksheet.addRow([""]);
    const header =
      [
        [
          "STT",
          "MADK",
          "Trạng thái",
          "Họ và tên",
          "Ngày sinh",
          "Giới tính",
          "CCCD/CMND",
          "Email",
          "Điện thoại",
          "Cấp Hsk đăng ký",
          "Ghi chú",
          "Thời gian thanh toán"
        ],
        // [
        //   "",
        //   null,
        //   null,
        //   null,
        //   null,
        //   null,
        //   null,
        //   null,
        //   null,
        //   null,
        //   "Toán",
        //   "Vật lí",
        //   "Hoá học",
        //   "Sinh học",
        //   "Lịch sử",
        //   "Địa lí",
        //   "Tiếng Anh"
        // ]
      ]

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
    // worksheet.mergeCells('K3:Q3');
    // this.setCellProperties(worksheet.getCell('K3'), 14, { bold: true });


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
    //Add Data and Conditinal Formatting

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
      //set with column to fit
      // worksheet.columns.forEach((column, columnIndex) => {
      //   let maxLength = 0;
      //   column.eachCell({ includeEmpty: true }, (cell) => {
      //     const cellLength = cell.value ? cell.value.toString().length : 0;
      //     maxLength = cellLength;
      //   });
      //   worksheet.getColumn(columnIndex + 2).width = maxLength + 2;
      // });
    });


    wb.xlsx.writeBuffer().then(buffer => {
      const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(data, 'HSK-TNU('+ title +').xlsx' );
    });


  }

  exportToLongHskThongke(object:any, title:string) {

    const wb = new Workbook();
    const worksheet = wb.addWorksheet('Danh sách thí sinh', { pageSetup: { paperSize: 9, orientation: 'portrait' } });

    const text_header = 'TRẠNG THÁI ĐĂNG KÝ THI HSK ('+ title +')';
    worksheet.addRow([text_header]);
    worksheet.addRow([""]);
    const header =
      [
        [
          "STT",
          "Trạng thái",
          "Họ và tên",
          "Ngày sinh",
          "Giới tính",
          "CCCD/CMND",
          "Email",
          "Điện thoại",
          "Lệ phí thi",
          "Cấp Hsk đăng ký",
          "Cập nhật thông tin",
          "Cập nhật ảnh chân dung",
          "Cập nhật ảnh CCCD (hộ chiếu)",
          "Ghi chú"
        ],
        // [
        //   "",
        //   null,
        //   null,
        //   null,
        //   null,
        //   null,
        //   null,
        //   null,
        //   null,
        //   null,
        //   "Toán",
        //   "Vật lí",
        //   "Hoá học",
        //   "Sinh học",
        //   "Lịch sử",
        //   "Địa lí",
        //   "Tiếng Anh"
        // ]
      ]

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

    worksheet.mergeCells('A1:N1');
    this.setCellProperties(worksheet.getCell('A1'), 14, { bold: true });
    // worksheet.mergeCells('A3:A4');
    // this.setCellProperties(worksheet.getCell('A3'), 14, { bold: true });
    // worksheet.mergeCells('B3:B4');
    // this.setCellProperties(worksheet.getCell('A3'), 14, { bold: true });
    // worksheet.mergeCells('C3:C4');
    // this.setCellProperties(worksheet.getCell('A3'), 14, { bold: true });
    // worksheet.mergeCells('D3:D4');
    // this.setCellProperties(worksheet.getCell('A3'), 14, { bold: true });
    // worksheet.mergeCells('E3:E4');
    // this.setCellProperties(worksheet.getCell('A3'), 14, { bold: true });
    // worksheet.mergeCells('F3:F4');
    // this.setCellProperties(worksheet.getCell('A3'), 14, { bold: true });
    // worksheet.mergeCells('G3:G4');
    // this.setCellProperties(worksheet.getCell('A3'), 14, { bold: true });
    // worksheet.mergeCells('H3:H4');
    // this.setCellProperties(worksheet.getCell('A3'), 14, { bold: true });
    // worksheet.mergeCells('I3:I4');
    // this.setCellProperties(worksheet.getCell('A3'), 14, { bold: true });
    // worksheet.mergeCells('J3:J4');
    // this.setCellProperties(worksheet.getCell('A3'), 14, { bold: true });
    // worksheet.mergeCells('K3:K4');
    // this.setCellProperties(worksheet.getCell('A3'), 14, { bold: true });
    // worksheet.mergeCells('K3:Q3');
    // this.setCellProperties(worksheet.getCell('K3'), 14, { bold: true });


    const objectColWidth = {
      1: 6,
      2: 12,
      3: 24,
      4: 25,
      5: 13,
      6: 13,
      7: 19,
      8: 15,
      9: 18,
      10: 30,
      11: 20,
      12: 20,
      13: 20,
      14: 20,

    };

    this.setColWidth(worksheet, objectColWidth);

    // Get all columns from JSON
    let columnsArray: any[];
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        columnsArray = Object.keys(object[key]);
      }
    }
    //Add Data and Conditinal Formatting

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
      //set with column to fit
      // worksheet.columns.forEach((column, columnIndex) => {
      //   let maxLength = 0;
      //   column.eachCell({ includeEmpty: true }, (cell) => {
      //     const cellLength = cell.value ? cell.value.toString().length : 0;
      //     maxLength = cellLength;
      //   });
      //   worksheet.getColumn(columnIndex + 2).width = maxLength + 2;
      // });
    });


    wb.xlsx.writeBuffer().then(buffer => {
      const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(data, 'Thống kê HSK-TNU('+ title +').xlsx' );
    });


  }

  exportToLongHskDotacSelectcapdo(object:any, title:string) {

    const wb = new Workbook();
    const worksheet = wb.addWorksheet('Danh sách thí sinh', { pageSetup: { paperSize: 9, orientation: 'portrait' } });

    const text_header = title;
    worksheet.addRow([text_header]);
    worksheet.addRow([""]);
    const header =
      [
        [
          "STT",
          "Họ và tên",
          "Ngày sinh",
          "Giới tính",
          "CCCD/CMND",
          "Email",
          "Điện thoại",
          "Cấp Hsk đăng ký",
          "Lệ phí thi",
        ],

      ]

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

    worksheet.mergeCells('A1:I1');
    this.setCellProperties(worksheet.getCell('A1'), 14, { bold: true });

    const objectColWidth = {
      1: 6,
      2: 12,
      3: 24,
      4: 25,
      5: 13,
      6: 13,
      7: 19,
      8: 15,
      9: 18,
    };

    this.setColWidth(worksheet, objectColWidth);

    // Get all columns from JSON
    let columnsArray: any[];
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        columnsArray = Object.keys(object[key]);
      }
    }
    //Add Data and Conditinal Formatting

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
      //set with column to fit
      // worksheet.columns.forEach((column, columnIndex) => {
      //   let maxLength = 0;
      //   column.eachCell({ includeEmpty: true }, (cell) => {
      //     const cellLength = cell.value ? cell.value.toString().length : 0;
      //     maxLength = cellLength;
      //   });
      //   worksheet.getColumn(columnIndex + 2).width = maxLength + 2;
      // });
    });


    wb.xlsx.writeBuffer().then(buffer => {
      const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(data, 'Thống kê HSK-TNU (' + title + ')' +'.xlsx' );
    });


  }

  exportToPhieuDiem(object:any, title:string) {


      const wb = new Workbook();
      const worksheet = wb.addWorksheet('Danh sách thí sinh', { pageSetup: { paperSize: 9, orientation: 'portrait' } });

      const text_header = ' ('+ title +')';
      worksheet.addRow([text_header]);
      worksheet.addRow([""]);
      const header =
        [
          [
            "STT",
            "Trạng thái",
            "Họ và tên",
            "Ngày sinh",
            "CCCD/CMND",
            "Email",
            "Điện thoại",
            "Họ tên người nhận",
            "Thí sinh họ tên",
            "Người nhận điện thoại",
            "Người nhận địa chỉ",
            "Số báo danh",
            "Cấp hsk",
            "Yêu cầu chuyển phát",
            "Số lượng bản sao",
            "Ngày duyệt thanh toán",
            "Vận đơn"
          ],
          // [
          //   "",
          //   null,
          //   null,
          //   null,
          //   null,
          //   null,
          //   null,
          //   null,
          //   null,
          //   null,
          //   "Toán",
          //   "Vật lí",
          //   "Hoá học",
          //   "Sinh học",
          //   "Lịch sử",
          //   "Địa lí",
          //   "Tiếng Anh"
          // ]
        ]

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

      worksheet.mergeCells('A1:Q1');
      this.setCellProperties(worksheet.getCell('A1'), 14, { bold: true });
      // worksheet.mergeCells('A3:A4');
      // this.setCellProperties(worksheet.getCell('A3'), 14, { bold: true });
      // worksheet.mergeCells('B3:B4');
      // this.setCellProperties(worksheet.getCell('A3'), 14, { bold: true });
      // worksheet.mergeCells('C3:C4');
      // this.setCellProperties(worksheet.getCell('A3'), 14, { bold: true });
      // worksheet.mergeCells('D3:D4');
      // this.setCellProperties(worksheet.getCell('A3'), 14, { bold: true });
      // worksheet.mergeCells('E3:E4');
      // this.setCellProperties(worksheet.getCell('A3'), 14, { bold: true });
      // worksheet.mergeCells('F3:F4');
      // this.setCellProperties(worksheet.getCell('A3'), 14, { bold: true });
      // worksheet.mergeCells('G3:G4');
      // this.setCellProperties(worksheet.getCell('A3'), 14, { bold: true });
      // worksheet.mergeCells('H3:H4');
      // this.setCellProperties(worksheet.getCell('A3'), 14, { bold: true });
      // worksheet.mergeCells('I3:I4');
      // this.setCellProperties(worksheet.getCell('A3'), 14, { bold: true });
      // worksheet.mergeCells('J3:J4');
      // this.setCellProperties(worksheet.getCell('A3'), 14, { bold: true });
      // worksheet.mergeCells('K3:K4');
      // this.setCellProperties(worksheet.getCell('A3'), 14, { bold: true });
      // worksheet.mergeCells('K3:Q3');
      // this.setCellProperties(worksheet.getCell('K3'), 14, { bold: true });


      const objectColWidth = {
        1: 6,
        2: 12,
        3: 24,
        4: 20,
        5: 13,
        6: 13,
        7: 19,
        8: 15,
        9: 18,
        10: 15,
        11: 15,
        12: 15,
        13: 15,
        14: 20,
        15: 20,
        16: 12,
        17: 12,

      };

      this.setColWidth(worksheet, objectColWidth);

      // Get all columns from JSON
    let numericKeys: string[] = [];
    let normalKeys: string[] = [];

    for (const item of object) {
      Object.keys(item).forEach(key => {
        if (/^\d+$/.test(key)) numericKeys.push(key);
        else normalKeys.push(key);
      });
    }
    const columnsArray = Array.from(new Set([...normalKeys, ...numericKeys]));

    //Add Data and Conditinal Formatting

    object.forEach((element: any) => {
      // const eachRow = [];
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
        cell.alignment = { horizontal:"center", wrapText:true,vertical: 'middle'};
        if(index === 3 ){
          cell.alignment = { horizontal:"left",vertical: 'middle'};

        }
      });

    });


      wb.xlsx.writeBuffer().then(buffer => {
        const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(data, 'Danh sách phiếu chuyển phát ('+ title +').xlsx' );
      });



  }

  async exportDataToWord(arr:any[], fileName: string) {
    try {
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
      <table class="table-border" style="width: 100%;">
        <tr>
            <th style="text-align: center;width:50px;"> <p>STT</p></th>
            <th style="text-align: center;"> <p>Nội dung</p></th>
            <th style="text-align: center;width:80px;"> <p>Cấp thi</p></th>
            <th style="text-align: center;width:80px;"> <p>Số báo danh</p></th>
            <th style="text-align: center;width:80px;"> <p>Trạng thái </p></th>
        </tr>
    `;
      arr.forEach(e=>{
        html += `

        <tr >
            <td style="text-align: center"><p>${e['__index']}</p></td>
            <td style="text-align: left">
                <p style="margin:6px;">${e['nguoinhan_hoten']}</p>
                <p style="margin:6px;">SĐT: ${e['nguoinhan_phone']}</p>
                <p style="margin:6px;">ĐC: ${e['nguoinhan_diachi']}</p>
                <p style="margin:6px;">(Họ tên thí sinh: ${e['thisinh_hoten']})</p>
            </td>
            <td style="text-align: center">
                <p style="margin:6px;">${e['__caphsk']}</p>
            </td>
            <td style="text-align: center">
                <p style="margin:6px;">${e['__sobaodanh']}</p>
            </td>
            <td style="text-align: center">
                <p style="margin:6px;">${e['__trangthai_thanhtoan']}</p>
            </td>
        </tr>

      `;

      })

      html += `

      </table>
        </body></html>`;


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
      fs.saveAs( fileBuffer , fileName + '.docx' );

    } catch ( e ) {
      console.log( e );
    }
  }
  async exportDataToWordToExcel(object:any[], title: string) {

    const wb = new Workbook();
    const worksheet = wb.addWorksheet('Danh sách thí sinh', { pageSetup: { paperSize: 9, orientation: 'portrait' } });

    const text_header = ' ('+ title +')';
    worksheet.addRow([text_header]);
    worksheet.addRow([""]);
    const header =
      [
        [
          "STT",
          "Nội dung",
          "Cấp hsk",
          "Số báo danh",
          "Trạng thái",
          "Yêu cầu chuyển phát",
          "Vận đơn",
        ],
      ]

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

    worksheet.mergeCells('A1:F1');
    this.setCellProperties(worksheet.getCell('A1'), 14, { bold: true });

    const objectColWidth = {
      1: 6,
      2: 20,
      3: 20,
      4: 20,
      5: 13,

    };

    this.setColWidth(worksheet, objectColWidth);

    // Get all columns from JSON
    let numericKeys: string[] = [];
    let normalKeys: string[] = [];

    for (const item of object) {
      Object.keys(item).forEach(key => {
        if (/^\d+$/.test(key)) numericKeys.push(key);
        else normalKeys.push(key);
      });
    }
    const columnsArray = Array.from(new Set([...normalKeys, ...numericKeys]));

    //Add Data and Conditinal Formatting

    object.forEach((element: any) => {
      // const eachRow = [];
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
        cell.alignment = { horizontal:"center", wrapText:true,vertical: 'middle'};
        if(index === 2 ){
          cell.alignment = { horizontal:"left",vertical: 'middle' ,wrapText:true,};

        }
      });

    });


    wb.xlsx.writeBuffer().then(buffer => {
      const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(data, 'Danh sách phiếu chuyển phát ('+ title +').xlsx' );
    });
  }



}
