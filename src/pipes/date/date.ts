import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the DatePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'datePipe',
})
export class DatePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: number, ...args) {
    const nowdate = new Date();
    let now = nowdate.getTime();


    let date = new Date(value);

    let month = date.getMonth();
    let day = date.getDay();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();


    console.log(now)
    
    if(value > 0){
     let devalue = now  - value ;

     if(devalue > 0 && devalue < 30 * 1000){
       return "刚刚";
     }else if(devalue >=  30 * 1000 && devalue < 3 * 60 * 1000){
      return "3分钟前"
     }else if(devalue >=  3 * 60 * 1000 && devalue < 60 * 60 * 1000){
      return  hour + ":" + minute + ":" + second;
     }else if(devalue >=  3 * 60 * 1000 && devalue < 24 * 60 * 60 * 1000){
      return "昨天"
     }else if(devalue >=  24 * 60 * 60 * 1000 && devalue < 365 * 24 * 60 * 60 * 1000){
      return month + "月" + day + "日";
     }else  {
      return "很久以前"
     }
    }
  }
}
