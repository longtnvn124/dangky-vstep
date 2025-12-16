import { Injectable } from '@angular/core';
import jsPDF from "jspdf";
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
@Injectable({
  providedIn: 'root'
})
export class ExportToPdfService {

  constructor() { }

  textToPDF(){
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.fonts = {
      TimesNewRoman: {
        normal: 'assets/fonts/time-new-roman/times.ttf',
        bold: 'assets/fonts/time-new-roman/timesb.ttf',
        italics: 'assets/fonts/time-new-roman/timesi.ttf',
        bolditalics: 'assets/fonts/time-new-roman/timesbi.ttf'
      }
    };

    const documentDefinition = {
      content: [
        { text: 'This is Times New Roman text Trần Minh Long' }
      ]
    };
    pdfMake.createPdf(documentDefinition).download('example.pdf');
  }
}
