export interface DashboardDTO {
    isAdmin: boolean;
    todaySales: number;
    todayPurchases: number;
    daysOfWork?: number;
    monthClients?: number;
    weekPurchases: number[];
    weekSales: number[];
}