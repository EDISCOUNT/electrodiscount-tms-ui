import moment from 'moment';
import { format } from 'date-fns';

export function formatDateNamed(date: Date | string): string {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }

    const _date = moment(date);
    const now = moment();
    const yesterday = moment().subtract(1, 'day');
    const tomorrow = moment().add(1, 'day');

    if (_date.isSame(now, 'day')) {
        return 'Today';
    } else if (_date.isSame(yesterday, 'day')) {
        return 'Yesterday';
    } else if (_date.isSame(tomorrow, 'day')) {
        return 'Tomorrow';
    } else if (_date.isoWeekday() === 5) {
        return 'This Friday';
    } else if (_date.isoWeekday() === 7) {
        return 'This Sunday';
    } else if (_date.isAfter(now)) {
        return `Next ${_date.format('dddd')}`;
    } else if (_date.isBefore(now)) {
        return `Last ${_date.format('dddd')}`;
    } else {
        return formatCustomDate(_date);
    }
}

function formatCustomDate(date: moment.Moment): string {
    return date.format('Do MMM YYYY');
}


export function formatDateString(date: Date, {format: _format = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"} = {}): string {
    // const formatter = new Intl.DateTimeFormat('en-US', {
    //     year: 'numeric',
    //     month: '2-digit',
    //     day: '2-digit',
    //     hour: 'numeric',
    //     minute: 'numeric',
    //     second: format.includes(':ss') ? 'numeric' : undefined,
    //     fractionalSecondDigits: format.includes(':SSS') ? 3 : undefined,
    // });

    // return formatter.format(date);
    return format(date, _format);
}