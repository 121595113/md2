import {
  Injectable,
} from '@angular/core';

/** Whether the browser supports the Intl API. */
const SUPPORTS_INTL_API = !!Intl;

/** Creates an array and fills it with values. */
function range < T > (length: number, valueFunction: (index: number) => T): T[] {
  return Array.apply(null, Array(length)).map((v: undefined, i: number) => valueFunction(i));
}

/** Date locale info. TODO(mmalerba): Integrate with i18n solution once we know what we're doing. */
@Injectable()
export class DateLocale {
  formatDate: (date: Date) => string;
  parseDate(value: any) {
    if (value instanceof Date) {
      return value;
    }
    let timestamp = typeof value == 'number' ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }
  dates = [null].concat(
    SUPPORTS_INTL_API ? this._createDatesArray('numeric') : range(31, i => String(i + 1)));
  private _createDatesArray(format: string) {
    let dtf = new Intl.DateTimeFormat(undefined, { day: format });
    return range(31, i => dtf.format(new Date(2017, 0, i + 1)));
  }
  getCalendarMonthHeaderLabel = this._createFormatFunction({ month: 'short', year: 'numeric' }) ||
    ((date: Date) => this.shortMonths[date.getMonth()] + ' ' + date.getFullYear());

  getCalendarYearHeaderLabel = this._createFormatFunction({ year: 'numeric' }) ||
    ((date: Date) => String(date.getFullYear()));

  private _createFormatFunction(options: Object): (date: Date) => string {
    if (SUPPORTS_INTL_API) {
      let dtf = new Intl.DateTimeFormat(undefined, options);
      return (date: Date) => dtf.format(date);
    }
    return null;
  }
  firstDayOfWeek = 0;

  months = [
    { full: 'January', short: '1月' },
    { full: 'February', short: '2月' },
    { full: 'March', short: '3月' },
    { full: 'April', short: '4月' },
    { full: 'May', short: '5月' },
    { full: 'June', short: '6月' },
    { full: 'July', short: '7月' },
    { full: 'August', short: '8月' },
    { full: 'September', short: '9月' },
    { full: 'October', short: '10月' },
    { full: 'November', short: '11月' },
    { full: 'December', short: '12月' },
  ];

  fullMonths = SUPPORTS_INTL_API ? this._createMonthsArray('long') : [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  shortMonths = SUPPORTS_INTL_API ? this._createMonthsArray('short') : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  narrowMonths = SUPPORTS_INTL_API ? this._createMonthsArray('narrow') : ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

  days = [
    { full: 'Sunday', short: '周日', xshort: '日' },
    { full: 'Monday', short: '周一', xshort: '一' },
    { full: 'Tuesday', short: '周二', xshort: '二' },
    { full: 'Wednesday', short: '周三', xshort: '三' },
    { full: 'Thursday', short: '周四', xshort: '四' },
    { full: 'Friday', short: '周五', xshort: '五' },
    { full: 'Saturday', short: '周六', xshort: '六' },
  ];

  fullDays = SUPPORTS_INTL_API ? this._createDaysArray('long') : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  shortDays = SUPPORTS_INTL_API ? this._createDaysArray('short') : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  narrowDays = SUPPORTS_INTL_API ? this._createDaysArray('narrow') : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  getDays() {
    return this.days.slice(this.firstDayOfWeek, this.days.length)
      .concat(this.days.slice(0, this.firstDayOfWeek));
  }

  getDayLabel(d: number) {
    return `${d}`; }

  getDateLabel(d: Date) {
    return `${this.months[d.getMonth()].short}${d.getDate()}日  ${this.days[d.getDay()].short}`;
  }

  getMonthLabel(m: number, y: number) {
    return `${y}/${this.months[m].short}`; }

  getYearLabel(y: number) {
    return `${y}`; }

  private _createMonthsArray(format: string) {
    let dtf = new Intl.DateTimeFormat(undefined, { month: format });
    return range(12, i => dtf.format(new Date(2017, i, 1)));
  }

  private _createDaysArray(format: string) {
    let dtf = new Intl.DateTimeFormat(undefined, { weekday: format });
    return range(7, i => dtf.format(new Date(2017, 0, i + 1)));
  }

}
