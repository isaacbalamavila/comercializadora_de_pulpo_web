export interface DashboardDTO {
    isAdmin: boolean;
    todaySales: number;
    todayPurchases: number;
    daysOfWork?: number;
    currentProcesses ?: number;
    weekPurchases: number[];
    weekSales: number[];
}