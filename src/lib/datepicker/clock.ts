import {
  Component,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';

export const CLOCK_HOURS = 24;
export const CLOCK_MINUTES = 60;
export const CLOCK_SECONDS = 60;
export const CLOCK_RADIUS = 120;
export const CLOCK_INNER_RADIUS = 66;
export const CLOCK_OUTER_RADIUS = 99;
export const CLOCK_TICK_RADIUS = 17;

@Component({
  moduleId: module.id,
  selector: 'md2-clock',
  templateUrl: 'clock.html',
  styleUrls: ['datepicker.css'],
  host: {
    'role': 'clock',
    '(mousedown)': '_handleMousedown($event)',
    '(touchstart)': '_handleMousedown($event)',
  },
  encapsulation: ViewEncapsulation.None
})
export class Md2Clock {

  private mouseMoveListener: any;
  private mouseUpListener: any;

  private _time: string;
  private _scrollTopX: number;
  private _scrollTopY: number;

  _view: string = 'hour';

  _hours: Array < Object > = [];
  _minutes: Array < Object > = [];
  _seconds: Array < Object > = [];

  _hour: number = 0;
  _minute: number = 0;
  _second: number = 0;

  constructor(private _element: ElementRef) {
    this.renderClock();
    this.mouseMoveListener = (event: any) => { this._handleMousemove(event); };
    this.mouseUpListener = (event: any) => { this._handleMouseup(event); };
  }

  @Output() timeChange: EventEmitter < string > = new EventEmitter < string > ();
  @Output() onHourChange: EventEmitter < number > = new EventEmitter < number > ();
  @Output() onMinuteChange: EventEmitter < number > = new EventEmitter < number > ();
  @Output() onSecondChange: EventEmitter < number > = new EventEmitter < number > ();

  @Input()
  get time() {
    return this._time;
  }
  set time(value: string) {
    if (this._time !== value) {
      this._time = value || '00:00:00';
      this._hour = parseInt(this._time.split(':')[0]);
      this._minute = parseInt(this._time.split(':')[1]);
      this._second = this._time.split(':')[2] ? parseInt(this._time.split(':')[2]) : 0;
    }
  }

  @Input()
  set view(value: string) {
    if (value === 'minute') {
      this._view = 'minute';
    } else if (value === 'second') {
      this._view = 'second';
    } else { this._view = 'hour'; }
  }

  get hand(): any {
    let deg = 0;
    let radius = CLOCK_OUTER_RADIUS;
    if (this._view === 'hour') {
      let inner = this._hour > 0 && this._hour < 13;
      radius = inner ? CLOCK_INNER_RADIUS : CLOCK_OUTER_RADIUS;
      deg = Math.round(this._hour * (360 / (CLOCK_HOURS / 2)));
    } else if(this._view === 'minute') {
      deg = Math.round(this._minute * (360 / CLOCK_MINUTES));
    }else{
      deg = Math.round(this._second * (360 / CLOCK_SECONDS));
    }

    return {
      'transform': `rotate(${deg}deg)`,
      'height': `${radius}px`,
      'margin-top': `${120 - radius}px`
    };
  }

  _handleMousedown(event: any) {
    this.setTime(event);
    if(event.touches) {
      this._scrollTopX = window.scrollX;
      this._scrollTopY = window.scrollY;
    }
    document.addEventListener('mousemove', this.mouseMoveListener);
    document.addEventListener('touchmove', this.mouseMoveListener);
    document.addEventListener('mouseup', this.mouseUpListener);
    document.addEventListener('touchend', this.mouseUpListener);
  }

  _handleMousemove(event: any) {
    !event.touches && event.preventDefault();
    this.setTime(event);
  }

  _handleMouseup(event: any) {
    document.removeEventListener('mousemove', this.mouseMoveListener);
    document.removeEventListener('touchmove', this.mouseMoveListener);
    document.removeEventListener('mouseup', this.mouseUpListener);
    document.removeEventListener('touchend', this.mouseUpListener);
    if(event.touches) {
      window.scrollTo(this._scrollTopX,this._scrollTopY);
    }
    if (this._view === 'hour') {
      this.onHourChange.emit(this._hour);
    } else if(this._view === 'minute') {
      this.onMinuteChange.emit(this._minute);
    } else {
      this.onSecondChange.emit(this._second);
    }
  }

  _handleKeydown(event: KeyboardEvent) {}

  /** Emits an event when the user selects a time. */
  _emitChangeEvent(): void {
    this.timeChange.emit(this.time);
  }

  /**
   * render Click
   */
  private renderClock() {
    this._hours.length = 0;

    for (let i = 0; i < CLOCK_HOURS; i++) {
      let radian = i / 6 * Math.PI;
      let inner = i > 0 && i < 13,
        radius = inner ? CLOCK_INNER_RADIUS : CLOCK_OUTER_RADIUS;
      this._hours.push({
        hour: i === 0 ? '00' : i,
        top: CLOCK_RADIUS - Math.cos(radian) * radius - CLOCK_TICK_RADIUS,
        left: CLOCK_RADIUS + Math.sin(radian) * radius - CLOCK_TICK_RADIUS
      });
    }

    for (let i = 0; i < CLOCK_MINUTES; i += 5) {
      let radian = i / 30 * Math.PI;
      this._minutes.push({
        minute: i === 0 ? '00' : i,
        top: CLOCK_RADIUS - Math.cos(radian) * CLOCK_OUTER_RADIUS - CLOCK_TICK_RADIUS,
        left: CLOCK_RADIUS + Math.sin(radian) * CLOCK_OUTER_RADIUS - CLOCK_TICK_RADIUS
      });
    }

    for (let i = 0; i < CLOCK_SECONDS; i += 5) {
      let radian = i / 30 * Math.PI;
      this._seconds.push({
        second: i === 0 ? '00' : i,
        top: CLOCK_RADIUS - Math.cos(radian) * CLOCK_OUTER_RADIUS - CLOCK_TICK_RADIUS,
        left: CLOCK_RADIUS + Math.sin(radian) * CLOCK_OUTER_RADIUS - CLOCK_TICK_RADIUS
      });
    }
  }

  /**
   * Set Time
   * @param event
   */
  private setTime(event: any) {
    let trigger = this._element.nativeElement;
    let triggerRect = trigger.getBoundingClientRect();
    let width = trigger.offsetWidth;
    let height = trigger.offsetHeight;
    let pageX = event.pageX !== undefined ? event.pageX : event.touches[0].pageX;
    let pageY = event.pageY !== undefined ? event.pageY : event.touches[0].pageY;
    let x = (width / 2) - (pageX - triggerRect.left - window.pageXOffset);
    let y = (height / 2) - (pageY - triggerRect.top - window.pageYOffset);
    let radian = Math.atan2(-x, y);
    let unit = Math.PI / (this._view === 'hour' ? 6 : 30);
    let z = Math.sqrt(x * x + y * y);
    let inner = this._view === 'hour' && z < (CLOCK_OUTER_RADIUS + CLOCK_INNER_RADIUS) / 2;
    let value = 0;

    if (radian < 0) { radian = Math.PI * 2 + radian; }
    value = Math.round(radian / unit);
    radian = value * unit;

    if (this._view === 'hour') {
      if (value === 12) { value = 0; }
      value = inner ? (value === 0 ? 12 : value) : value === 0 ? 0 : value + 12;
      this._hour = value;
    } else if(this._view === 'minute'){
      if (value === 60) { value = 0; }
      this._minute = value;
    }else{
      if (value === 60) { value = 0; }
      this._second = value;
    }
    this._time = this._hour + ':' + this._minute + ':' + this._second;
    this._emitChangeEvent();
  }

}
