import { Injectable } from '@angular/core';
import * as fs from 'file-saver';
import { Workbook } from 'exceljs';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


@Injectable({
  providedIn: 'root'
})
export class ExportExcelHskService {

  arrSheetName1To6 :{name:string,value:number}[]=[
    {name:'HSK一级', value:1},
    {name:'HSK二级', value:2},
    {name:'HSK三级', value:3},
    {name:'HSK四级', value:4},
    {name:'HSK五级', value:5},
    {name:'HSK六级', value:6},
  ]

  headerQuoctich =['国籍代码',	'国籍英文名',	'国籍中文名']
  headerNgonNgu =['母语代码',	'语言英文名',	'语言中文名']

  constructor() { }

  exportExcel(data:any[],ngonngume:any[],quoctich:any[],headersArray:string[],fileName:string){
    const header = headersArray;
    let workbook = new Workbook();
    workbook.created = new Date();
    workbook.modified = new Date();

    if(data.length>0){
      data.forEach((m,index)=>{
        const sheetName = this.arrSheetName1To6.find(f=>f.value === index+1).name;
        this.excelItemChild(m,header,sheetName,workbook);
      })
    }

    this.excelItemChild([],header,'HSK（七—九级）',workbook);
    this.excelItemChild(quoctich,this.headerQuoctich,'国籍代码表',workbook,'them');
    this.excelItemChild(ngonngume,this.headerNgonNgu,'母语代码表',workbook,'them');
    this.excelItemHuongDanSuDung([],[],'使用说明',workbook);




    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], { type: EXCEL_TYPE });
      fs.saveAs(blob, fileName + EXCEL_EXTENSION);
    })

  }


  excelItemChild(data: any[], header: string[], sheetName: string, workbook: Workbook,implement?:string): Workbook {
    const worksheet = workbook.addWorksheet(sheetName);
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
      // worksheet.getColumn(index).width = header[index - 1].length < 20 ? 20 : header[index - 1].length;
      worksheet.getColumn(1).width = 20;
      worksheet.getColumn(1).alignment = { horizontal: 'center' };
    });

    const objectColWidth = {
      1: 20,
      2: 20,
      3: 20,
      4: 20,
      5: 20,
      6: 20,
      7: 20,
      8: 20,
      9: 20,
      10: 20,
      11: 24,
      12: 20,
      13: 20,
      14: 20,
      15: 20,
      16: 20,
      17: 20,
    };
    this.setColWidth(worksheet, objectColWidth);

    // Chuẩn bị cột dữ liệu
    let columnsArray: any[] = [];
    if (data.length > 0) {
      columnsArray = Object.keys(data[0]);

      // Thêm dữ liệu vào các dòng
      data.forEach((element: any) => {
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
          });

      });
    }

    // Căn chỉnh độ rộng cột
    columnsArray.forEach((column, index) => {
      worksheet.getColumn(index + 1).width = Math.max(column.length, 20);
    });

    // worksheet.getColumn(1).width = 7;
    worksheet.getColumn(1).alignment = { horizontal: 'left' };
    worksheet.getColumn(11).alignment = { horizontal: 'left' };
    worksheet.getColumn(19).alignment = { horizontal: 'left' };

    if(implement === 'them'){
      worksheet.getColumn(2).alignment = { horizontal: 'left' };
      worksheet.getColumn(3).alignment = { horizontal: 'left' };

    }

    return workbook;
  }
  excelItemHuongDanSuDung(data: any[], header: string[], sheetName: string, workbook: Workbook,implement?:string): Workbook {

    const worksheet = workbook.addWorksheet(sheetName);

    const maxRows = 30; // Số hàng tối đa bạn muốn định nghĩa
    const maxCols = 30;  // Số cột tối đa bạn muốn định nghĩa

    // Khởi tạo tất cả các ô trong lưới
    for (let i = 1; i <= maxRows; i++) {
      for (let j = 1; j <= maxCols; j++) {
        const cell = worksheet.getCell(i, j); // Lấy từng ô
        cell.value = ''; // Đảm bảo ô tồn tại
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '808080' }, // Màu xám nhạt
        };
      }
    }

    // Loại bỏ nội dung trong các ô từ A1 đến A14
    for (let i = 1; i <= 14; i++) {
      worksheet.getCell(`A${i}`).value = null; // Xóa giá trị
      worksheet.getCell(`A${i}`).fill = null;  // Xóa màu nền nếu có
      worksheet.getCell(`A${i}`).border = null; // Xóa viền nếu có
    }


    worksheet.getCell('A1').value = {
      richText: [
        { text: '报名模板文件使用说明：', font: { color: { argb: '000000' },size:14,bold:true } }, // Màu đen
        { text: '重要！', font: { color: { argb: 'FF0000' },size:14,bold:true } }, // Màu đỏ
      ],
    };
    worksheet.getCell('A1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '8DB3E2' }, // Màu vàng nhạt

    };

    worksheet.getCell('A1').border = {
      right: { style: 'thin',color: { argb: '333333' } },
      left: { style: 'thin',color: { argb: '333333' } },
      bottom: { style: 'thin',color: { argb: '333333' } },
      top: { style: 'thin',color: { argb: '333333' } }
    };

    worksheet.getCell('A2').value = {
      richText:[
        {text:'1、打开本表格文件时，Excel可能提示您禁止使用宏的安全警告，', font: { color: { argb: '000000' } }},
        { text: '请设置为启用宏', font: { color: { argb: 'FF0000' } } }, // Màu đỏ
        {text:'，表格的控件需要使用宏，请放心使用', font: { color: { argb: '000000' } }},

      ]
    }
    worksheet.getCell('A2').border = {
      right: { style: 'thin',color: { argb: '333333' } }
    };
    worksheet.getCell('A3').value = {
      richText:[
        {text:'2、表格内的所有考生必须是，', font: { color: { argb: '000000' } }},
        { text: '同一个考点', font: { color: { argb: 'FF0000' } } }, // Màu đỏ
        {text:'、参加', font: { color: { argb: '000000' } }},
        { text: '同一次考试', font: { color: { argb: 'FF0000' } } }, // Màu đỏ
        {text:'的，不同考点或者不同批次考试的考生不能填写在同一个表格文件里上传', font: { color: { argb: '000000' } }},

      ]
    }
    worksheet.getCell('A3').border = {
      right: { style: 'thin',color: { argb: '333333' } }
    };
    worksheet.getCell('A4').value = {
      richText:[
        {text:'3、', font: { color: { argb: '000000' } }},
        { text: '请勿自行修改本表格文件的格式，包括表头（header）、页名（sheet name）等', font: { color: { argb: 'FF0000' } } }, // Màu đỏ

      ]
    }
    worksheet.getCell('A4').border = {
      right: { style: 'thin',color: { argb: '333333' } }
    };
    worksheet.getCell('A5').value = {
      richText:[
        {text:'4、报考各等级的考生信息要填写到对应的页内（sheet）', font: { color: { argb: '000000' } }},
      ]
    }
    worksheet.getCell('A5').border = {
      right: { style: 'thin',color: { argb: '333333' } }
    };
    worksheet.getCell('A6').value = {
      richText:[
        {text:'5、表头上', font: { color: { argb: '000000' } }},
        { text: '带*号的栏目为必填项', font: { color: { argb: 'FF0000' } } }, // Màu đỏ
        {text:'，否则会被报名系统视为无效数据', font: { color: { argb: '000000' } }},

      ]
    }
    worksheet.getCell('A6').border = {
      right: { style: 'thin',color: { argb: '333333' } }
    };
    worksheet.getCell('A7').value = {
      richText:[
        {text:'6、“国籍代码”和“母语代码”只能填写代码，不能填写文字，如果有不确定的代码，请查阅代码表页', font: { color: { argb: '000000' } }},
      ]
    }
    worksheet.getCell('A7').border = {
      right: { style: 'thin',color: { argb: '333333' } }
    };
    worksheet.getCell('A8').value = {
      richText:[
        {text:'7、使用本模板表格一次上传的考生最好不超过1000人，对于报考人数较多的考点，可以分次上传\n', font: { color: { argb: '000000' } }},
      ]
    }
    worksheet.getCell('A8').border = {
      right: { style: 'thin',color: { argb: '333333' } },
      bottom: { style: 'thin',color: { argb: '333333' } }
    };

    worksheet.getCell('A11').value={
      richText:[
        {text:'使用小技巧：', font: { color: { argb: '000000' },size:14,bold:true }}
      ]
    }
    worksheet.getCell('A11').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '8DB3E2' }, // Màu vàng nhạt
    };

    worksheet.getCell('A11').border = {
      left: { style: 'thin',color: { argb: '333333' } },
      right: { style: 'thin',color: { argb: '333333' } },
      bottom: { style: 'thin',color: { argb: '333333' } },
      top: { style: 'thin',color: { argb: '333333' } }
    };
    worksheet.getCell('A12').value={
      richText:[
        {text:'1、保存好本模板文件，方便随时使用：', font: { color: { argb: '000000' } }}
      ]
    }
    worksheet.getCell('A12').border = {
      right: { style: 'thin',color: { argb: '333333' } }
    };
    worksheet.getCell('A13').value={
      richText:[
        {text:'2、输入了考生信息后，把文件“另存为”（Save as）一个自己可以识别名称的文件后，再进行上传', font: { color: { argb: '000000' } }}
      ]
    }
    worksheet.getCell('A13').border = {
      right: { style: 'thin',color: { argb: '333333' } }
    };
    worksheet.getCell('A14').value={
      richText:[
        {text:'3、如果很多的考生在某项信息上是一致的，可以选中相同内容的单元格的最上边一个，将鼠标移动到该单元格右下角后鼠标图标将变成一个小十字形，此时按下Ctrl键，同时按下鼠标左键不放，向下拖动鼠标直到覆盖全部相同内容单元格，即可复制。', font: { color: { argb: '000000' }}}
      ]
    }
    worksheet.getCell('A14').border = {
      bottom: { style: 'thin',color: { argb: '333333' } },
      right: { style: 'thin',color: { argb: '333333' } }
    };


    worksheet.getColumn(1).width = 100;
    worksheet.getColumn(1).alignment = { horizontal: 'left', wrapText: true, };
    worksheet.getColumn(1).font = { name: 'Simsun' };

    return workbook;

  }

  setColWidth(ws, cols: {}) {
    Object.keys(cols).forEach((f, key) => {
      ws.getColumn(Number(f)).width = cols[f];
    })
  }

  //=========================================================
  exportExHuyOrder(object:any, title:string,sheetName:string, headers:string[]) {

    const wb = new Workbook();
    const worksheet = wb.addWorksheet(sheetName, { pageSetup: { paperSize: 9, orientation: 'portrait' } });

    // const text_header = 'TRẠNG THÁI ĐĂNG KÝ THI HSK ('+ title +')';
    // worksheet.addRow([text_header]);
    // worksheet.addRow([""]);
    const header = [headers]

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
          fgColor: { argb: 'EBABAB' },
          bgColor: { argb: 'EBABAB' },
        };
        cell.font = { name: 'Times New Roman', family: 1, size: 11, bold: true };
        cell.alignment = { vertical: 'middle', horizontal: 'center', shrinkToFit: true, wrapText: true };
        cell.border = {
          top: { style: 'thin', color: { argb: '333333' } },
          left: { style: 'thin', color: { argb: '333333' } },
          bottom: { style: 'thin', color: { argb: '333333' } },
          right: { style: 'thin', color: { argb: '333333' } }
        };
      });
    })

    // worksheet.mergeCells('A1:K1');
    // this.setCellProperties(worksheet.getCell('A1'), 14, { bold: true });
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
      2: 33,
      3: 24,
      4: 19,
      5: 29,
      6: 23,
      7: 26,
      8: 20,
      9: 20,

    };

    this.setColWidthV2(worksheet, objectColWidth);

    // Get all columns from JSON
    let columnsArray: any[];
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        columnsArray = Object.keys(object[key]);
      }
    }
    //Add Data and Conditinal Formatting
    const indexCenter = [0,4,5,6];
    object.forEach((element: any) => {
      const eachRow = [];
      columnsArray.forEach((column,index) => {
        eachRow.push(element[column]);

      });

      if (element.isDeleted === 'Y') {
        const deleteRow = worksheet.addRow(eachRow);
        deleteRow.eachCell((cell,index) => {
          cell.font = { name: 'Times New Roman', family: 4, size: 11, bold: false, strike: true };
          cell.border = {
            top: { style: 'thin', color: { argb: '333333' } },
            left: { style: 'thin', color: { argb: '333333' } },
            bottom: { style: 'thin', color: { argb: '333333' } },
            right: { style: 'thin', color: { argb: '333333' } }
          };
          if(indexCenter.includes(index) ){
            cell.alignment = { vertical: 'middle', horizontal: 'center', shrinkToFit: true,};
          }
        })
      } else {
        const rowAdd =  worksheet.addRow(eachRow);
        rowAdd.eachCell((cell,index) => {
          cell.font = { name: 'Times New Roman', family: 4, size: 11, bold: false };
          cell.border = {
            top: { style: 'thin', color: { argb: '333333' } },
            left: { style: 'thin', color: { argb: '333333' } },
            bottom: { style: 'thin', color: { argb: '333333' } },
            right: { style: 'thin', color: { argb: '333333' } }
          };
          if(indexCenter.includes(index) ){
            cell.alignment = { vertical: 'middle', horizontal: 'center', shrinkToFit: true,};
          }
        })
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

  setColWidthV2(ws, cols: {}) {
    Object.keys(cols).forEach((f, key) => {
      ws.getColumn(Number(f)).width = cols[f];
    })
  }
  setCellProperties(cell, sizeNumber, options) {
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.font = { name: 'Times New Roman', size: sizeNumber, ...options };
  }
}
