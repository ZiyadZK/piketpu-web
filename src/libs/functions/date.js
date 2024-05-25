'use client'

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
            // Regex to match dd-mm-yyyy or mm-dd-yyyy
            const datePattern = new RegExp(`^(\\d{2})${delimiter}(\\d{2})${delimiter}(\\d{4})$`);
            const match = date.match(datePattern);

            if (match) {
                const [ , part1, part2, year ] = match;
                // Check if part1 and part2 are likely to be day or month
                if (parseInt(part1) > 12) {
                    day = part1;
                } else {
                    day = part2;
                }
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

export const date_getMonth = (date) => {
    let delimiter = null;
    let month;

    if (date) {
        if (date.includes('-')) {
            delimiter = '-';
        } else if (date.includes('/')) {
            delimiter = '/';
        }

        if (delimiter) {
            // Regex to match dd-mm-yyyy or mm-dd-yyyy
            const datePattern = new RegExp(`^(\\d{2})${delimiter}(\\d{2})${delimiter}(\\d{4})$`);
            const match = date.match(datePattern);

            if (match) {
                const [ , part1, part2, year ] = match;
                // Check if part1 and part2 are likely to be day or month
                if (parseInt(part1) > 12) {
                    month = part2;
                } else {
                    month = part1;
                }
            } else {
                return 'Invalid date format';
            }
        } else {
            return 'Invalid date format';
        }
    } else {
        const currentDate = new Date();
        month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed in JS
    }

    return month;
}

export const date_getYear = (date) => {
    let delimiter = null;
    let year;

    if (date) {
        if (date.includes('-')) {
            delimiter = '-';
        } else if (date.includes('/')) {
            delimiter = '/';
        }

        if (delimiter) {
            // Regex to match dd-mm-yyyy or mm-dd-yyyy
            const datePattern = new RegExp(`^(\\d{2})${delimiter}(\\d{2})${delimiter}(\\d{4})$`);
            const match = date.match(datePattern);

            if (match) {
                year = match[3];
            } else {
                return 'Invalid date format';
            }
        } else {
            return 'Invalid date format';
        }
    } else {
        const currentDate = new Date();
        year = String(currentDate.getFullYear());
    }

    return year;
}

export const date_getTime = (type) => {
    const currentDate = new Date();
    let time;

    if (type === 'hour') {
        time = String(currentDate.getHours()).padStart(2, '0'); // Ensures 2-digit format
    } else if (type === 'minutes') {
        time = String(currentDate.getMinutes()).padStart(2, '0'); // Ensures 2-digit format
    } else {
        return 'Invalid type. Use "hour" or "minutes".';
    }

    return time;
}

export const date_toFormat = (date) => {
    const [year, month, day] = date.split('-')

    return `${day}/${month}/${year}`
}

export const date_toInputHtml = (date) => {
    const [day, month, year] = date.split('/')

    return `${year}-${month}-${day}`
}

