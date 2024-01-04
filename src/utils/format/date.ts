import moment from 'moment';

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
