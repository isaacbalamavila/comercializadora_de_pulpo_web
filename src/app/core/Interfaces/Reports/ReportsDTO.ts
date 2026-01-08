interface BaseReportResponse {
    generationDate: string;
    startDate: string;
    endDate: string;
}

// Sales
export interface SalesReport extends BaseReportResponse {
    sales: SaleReportItem[]
}

interface SaleReportItem {
    client: string;
    employee: string;
    paymentMethod: string;
    date: string;
    total: number;
}

// Purchases
export interface PurchasesReport extends BaseReportResponse {
    purchases: PurchaseReportItem[];
}

interface PurchaseReportItem {
    sku: string;
    supplier: string;
    rawMaterial: string;
    date: string;
    totalKg: number;
    priceKg: number;
    totalPrice: number;
}

// Clients
export interface ClientsReport extends BaseReportResponse {
    clients: ClientReportItem[];
}

interface ClientReportItem {
    name: string;
    email: string;
    phone: string;
    rfc: string | null;
    createdAt: string;
}


// Products
export interface ProductsReport extends BaseReportResponse {
    products: ProductReportItem[];
}

interface ProductReportItem {
    sku: string;
    name: string;
    content: number;
    unit: string;
    quantity: number;
}

// Supplies
export interface SuppliesReport extends BaseReportResponse {
    supplies: SupplyReportItem[];
}

interface SupplyReportItem {
    sku: string;
    rawMaterial: string;
    originalWeightKg: number;
    remainWeightKg: number;
    purchaseDate: string;
    expirationDate: string;
}
