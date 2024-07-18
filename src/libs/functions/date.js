'use client'

import moment from "moment-timezone";



export const date_getDay = (date) => {
    let delimiter = null;
    let day;

    if (date) {
        if (date.includes('-')) {
            delimiter = '-';
        } else if (date.includes('/')) {
            delimiter = '/';
        }

        if (delimiter) {
            // Regex to match yyyy-mm-dd or yyyy/mm/dd
            const datePattern = new RegExp(`^(\\d{4})${delimiter}(\\d{2})${delimiter}(\\d{2})$`);
            const match = date.match(datePattern);

            if (match) {
                day = match[3];
            } else {
                return 'Invalid date format';
            }
        } else {
            return 'Invalid date format';
        }
    } else {
        const currentDate = new Date();
        day = String(currentDate.getDate()).padStart(2, '0');
    }

    return day;
}

export const date_getMonth = (format = 'number', date) => {
    let delimiter = null;
    let month;

    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    if (date) {
        if (date.includes('-')) {
            delimiter = '-';
        } else if (date.includes('/')) {
            delimiter = '/';
        }

        if (delimiter) {
            // Regex to match yyyy-mm-dd or yyyy/mm/dd
            const datePattern = new RegExp(`^(\\d{4})${delimiter}(\\d{2})${delimiter}(\\d{2})$`);
            const match = date.match(datePattern);

            if (match) {
                month = parseInt(match[2]);
            } else {
                return 'Invalid date format';
            }
        } else {
            return 'Invalid date format';
        }
    } else {
        const currentDate = new Date();
        month = currentDate.getMonth() + 1; // Months are zero-indexed in JS
    }

    if (format === 'string') {
        return monthNames[month - 1];
    } else {
        return String(month).padStart(2, '0'); // Return month as a zero-padded number
    }
}

export const date_getYear = (date = null) => {
    let delimiter = null;
    let year;

    if (date) {
        if (date.includes('-')) {
            delimiter = '-';
        } else if (date.includes('/')) {
            delimiter = '/';
        }

        if (delimiter) {
            // Regex to match yyyy-mm-dd or yyyy/mm/dd
            const datePattern = new RegExp(`^(\\d{4})${delimiter}(\\d{2})${delimiter}(\\d{2})$`);
            const match = date.match(datePattern);

            if (match) {
                year = match[1];
            } else {
                return 'Invalid date format';
            }
        } else {
            return 'Invalid date format';
        }
    } else {
        const currentDate = new Date();
        console.log(currentDate)
        year = String(currentDate.getFullYear());
    }

    return year;
}


export const date_getTime = (type) => {
    const currentDate = new Date();
    const options = {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };

    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(currentDate);

    let time;
    if (type === 'hour') {
        time = parts.find(part => part.type === 'hour').value;
    } else if (type === 'minutes') {
        time = parts.find(part => part.type === 'minute').value;
    } else {
        const hour = parts.find(part => part.type === 'hour').value;
        const minute = parts.find(part => part.type === 'minute').value;
        time = `${hour}:${minute}`;
    }

    return time;
}

export const date_toFormat = (date) => {
    const [year, day, month] = date.split('-')

    return `${day}/${month}/${year}`
}

export const date_toInputHtml = (date) => {
    const [day, month, year] = date.split('/')

    return `${year}-${day}-${month}`
}

export const date_getMonthRange = (inputDate) => {
    // Use the current date if no input date is provided
    const currentDate = inputDate ? moment.tz(inputDate, 'Asia/Jakarta') : moment().tz('Asia/Jakarta');

    // Start date: the 1st day of the month of the currentDate in WIB
    const startDate = currentDate.clone().startOf('month');

    // End date: the last day of the month of the currentDate in WIB
    const endDate = currentDate.clone().endOf('month');

    // Convert dates to yyyy-mm-dd format
    const formatDate = (date) => date.format('YYYY-MM-DD');

    // Get the current date in WIB
    const today = moment().tz('Asia/Jakarta');

    // Start date and end date of the current month in WIB
    const currentMonthStart = today.clone().startOf('month');
    const currentMonthEnd = today.clone().endOf('month');

    // Check if the inputDate is within the current month
    const isCurrentMonth = currentDate.isBetween(currentMonthStart, currentMonthEnd, null, '[]');

    return {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        isCurrentMonth
    };
}
