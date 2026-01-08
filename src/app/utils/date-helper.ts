
export function getFirstDayOfWeek(): Date {
    const today = new Date(Date.now());
    const day = today.getDay();

    const diff = day === 0 ? -6 : 1 - day;

    let firstDay = new Date(today);

    firstDay.setDate(today.getDate() + diff);

    firstDay.setHours(0, 0, 0, 0);

    return firstDay;
}

export function getFirstDayOfMonth(): Date {
    const today = new Date(Date.now());
    return new Date(today.getFullYear(), today.getMonth(), 1);
}