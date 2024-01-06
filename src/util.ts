import moment from "moment";

/**
 * 
 * @param {Array<{completed}>} array 
 * @returns 
 */
export const findItemWithLatestCompletedDate = (array: any) => {
    let latestItem: any = null;
    let latestDate: any = null;

    array.forEach((item: any) => {
        const currentDate = moment(item.completed, 'DD/MM/YYYY HH:mm:ss').toDate();

        if (!latestDate || currentDate > latestDate) {
            latestDate = currentDate;
            latestItem = item;
        }
    });

    return latestItem;
}

/**
 * 
 * @param {Array<{completed}>} array 
 * @returns 
 */
export const findItemWithOldestCompletedDate = (array: any) => {
    let oldestItem: any = null;
    let oldestDate: any = null;

    array.forEach((item: any) => {
        const currentDate = moment(item.completed, 'DD/MM/YYYY HH:mm:ss').toDate();

        if (!oldestDate || currentDate < oldestDate) {
            oldestDate = currentDate;
            oldestItem = item;
        }
    });

    return oldestItem;
}

/**
 * 
 * @param {string|Date} inputDate 
 * @returns 
 */
export const dateFormatDisplay = (inputDate: string | Date) => {
    // const inputDate = '16/12/2019 10:46:00';
    return moment(inputDate, 'DD/MM/YYYY HH:mm:ss').format('Do MMMM YYYY HH:mm:ss');
}