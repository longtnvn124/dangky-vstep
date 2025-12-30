import { ElementRef, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  standalone: true,
  name: 'focusInput'
})
export class FocusInputPipe implements PipeTransform {

    constructor ( private sanitized: DomSanitizer ) {

    }

    transform ( elem: HTMLDivElement, id: number, idcheck: number ): void {
        if ( id === idcheck )
            return elem.focus();
        return null
    }
}
