import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'numberToVndCurrencuy'
})
export class NumberToVndCurrencuyPipe implements PipeTransform {

  transform(value: number): string {
    const number = value ? parseInt(String(value)) : 0
    const _la: string = number.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'});
    return _la;
  }

}
