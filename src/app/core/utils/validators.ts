import { AbstractControl , ValidationErrors } from '@angular/forms';
import * as moment from 'moment/moment';

// export const PHONE_REGEX : RegExp        = /^(([+]{0,1}\d{2})|\d{2}?)[\-\s\d]{2,15}$/gmi;
export const PHONE_REGEX : RegExp        = /^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
export const USERNAME_REGEX : RegExp        = /^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;

// export const EMAIL_REGEX : RegExp        = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
export const EMAIL_REGEX : RegExp        = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
export const DDMMYYYYDateFormatValidator = ( control : AbstractControl ) : ValidationErrors | null => ( !control.value || moment( control.value , 'DD/MM/YYYY' , true ).isValid() ) ? null : { theDateDoesNotExist : true };
export const PhoneNumberValidator        = ( control : AbstractControl ) : ValidationErrors | null => control.value ? PHONE_REGEX.test( control.value ) ? null : { invalidPhoneNumberStructure : true } : null;

export const EmailCheckValidator         = (control : AbstractControl)   : ValidationErrors | null => control.value ?EMAIL_REGEX.test(control.value) ? null : { invalidEmailCheckStructure : true } : null;

// export const PASS_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/;
export const PASS_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?!.*?[\s])(?=.*?[#?!@$%^&*-]).{8,30}$/;

export const PassCheckValidator = (control : AbstractControl) : ValidationErrors | null => control.value ? PASS_REGEX.test(control.value) ? null :  { invalidEmailCheckStructure : true } : null;


export const NumberLessThanTenValidator = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  if (value !== null && value !== undefined) {
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue) && parsedValue <= 10 && parsedValue >0) {
      return null; // Số hợp lệ
    } else {
      return { numberLessThanTen: true }; // Số không hợp lệ
    }
  } else {
    return null; // Giá trị rỗng, không kiểm tra
  }
};

export const EMAIL_REGEX_FOMAT :RegExp = /^[a-z0-9._%+-]+@gmail\.com$/;// dùng cho đuôi @gmail.com

export const EmailFomatCheckValidator = (control : AbstractControl)   : ValidationErrors | null => control.value ?EMAIL_REGEX_FOMAT.test(control.value) ? null : { invalidEmailCheckStructure : true } : null;
