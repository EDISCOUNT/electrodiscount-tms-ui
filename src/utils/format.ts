
// const oCcy = new Intl.NumberFormat("en-US", { currency: 'USD', style: 'currency' });

const formatters: { [i: string]: Intl.NumberFormat } = {};

function getFormatter(currency = 'USD') {
    return formatters[currency] ??= new Intl.NumberFormat("en-US", { currency, style: 'currency' });
}

// @param value - the currency value in the cents
export function formatMoney(value: number, { currency = 'USD' }: { currency?: string } = {}): string {
    const realValue = value / 100;
    const oCcy = getFormatter(currency);
    return `${oCcy.format(realValue)}`;
}

export function formatDistance(distanceMeters: number): string {
    const metersInMile = 1609.34;
    const threshhold = metersInMile / 4;
    if (distanceMeters >= threshhold) {
        // If distance is greater than or equal to 1 mile in meters
        const distanceMiles = distanceMeters * 0.000621371; // Conversion factor
        return `${distanceMiles.toFixed(2)} mi`;
    } else {
        const distanceFeet = distanceMeters * 3.28084; // Conversion factor
        return `${distanceFeet.toFixed(0)} ft`;
    }
}


const _options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    weekday: 'short',
    hour: 'numeric',
    // minute: 'numeric',
    // second: 'numeric',
    // timeZoneName: 'short',
};

export function formatDate(date: Date | string, locale: string = 'en-US', options = _options): string {
    if (typeof (date) == 'string') {
        date = new Date(date);
    }
    return new Intl.DateTimeFormat(locale, options).format(date);
}


export function formatDateTime(date: Date | string, locale: string = 'en-US', options = _options): string {
    return formatDate(date, locale, options);
}


export function formatDuration(seconds: number): string {
    if (seconds < 0) {
        throw new Error("Duration must be a non-negative number of seconds.");
    }

    if (seconds === 0) {
        return "0 seconds";
    }

    // const timeUnits: [number, string][] = [
    //     [Math.floor(seconds / 31536000), "year"],
    //     [Math.floor(seconds / 2592000) % 12, "month"],
    //     [Math.floor(seconds / 86400) % 30, "day"],
    //     [Math.floor(seconds / 3600) % 24, "hour"],
    //     [Math.floor(seconds / 60) % 60, "minute"],
    //     [seconds % 60, "second"],
    // ];

    const timeUnits: [number, string][] = [
        [Math.floor(seconds / 31536000), "y"],
        [Math.floor(seconds / 2592000) % 12, "mon"],
        [Math.floor(seconds / 86400) % 30, "d"],
        [Math.floor(seconds / 3600) % 24, "h"],
        [Math.floor(seconds / 60) % 60, "m"],
        // [seconds % 60, "s"],
    ];

    const formattedParts: string[] = [];

    for (const [value, unit] of timeUnits) {
        if (value > 0) {
            formattedParts.push(`${value}${unit}${value > 1 ? "" : ""}`);
        }
    }

    return formattedParts.join(", ");
}