import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { authGuard } from './core/guards/auth.guard';
import { authLoginGuard } from './core/guards/auth-login.guard';
import { AccountSettingsComponent } from './pages/account-settings/account-settings.component';
import { WorkingOnComponent } from './pages/working-on/working-on.component';
import { SuppliersComponent } from './pages/suppliers/suppliers.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductsCatalogComponent } from './pages/products-catalog/products-catalog.component';
import { productsAccessGuard } from '@guards/products-access.guard';
import { productsCatalogAccessGuard } from '@guards/products-catalog-access.guard';
import { PurchasesComponent } from './pages/purchases/purchases.component';
import { PurchaseComponent } from './pages/purchase/purchase.component';
import { purchasesGuard as purchasesAccessGuard } from '@guards/purchases.guard';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { SuppliesInventoryComponent } from './pages/supplies-inventory/supplies-inventory.component';
import { ProcessComponent } from './pages/process/process.component';
import { CreateProcessComponent } from './pages/create-process/create-process.component';
import { ProcessRouterComponent } from './pages/process-router/process-router.component';
import { ProductBatchInventoryComponent } from './pages/product-batch-inventory/product-batch-inventory.component';
import { ProductInventoryComponent } from './pages/product-inventory/product-inventory.component';
import { inventoryGuard } from '@guards/inventory.guard';
import { SalesComponent } from './pages/sales/sales.component';
import { SaleDetailsComponent } from './pages/sale-details/sale-details.component';
import { SaleComponent } from './pages/sale/sale.component';


export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, canActivate: [authLoginGuard] },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    {
        path: 'home', component: HomeComponent, canActivate: [authGuard], children: [
            { path: '', component: DashboardComponent },
            { path: 'employees', component: EmployeesComponent },
            { path: 'settings', component: AccountSettingsComponent },
            { path: 'suppliers', component: SuppliersComponent },
            { path: 'clients', component: ClientsComponent },
            { path: 'products', component: ProductsComponent, canActivate: [productsAccessGuard] },
            { path: 'products-catalog', component: ProductsCatalogComponent, canActivate: [productsCatalogAccessGuard] },
            {
                path: 'purchases', canActivate: [purchasesAccessGuard],
                children: [
                    { path: '', component: PurchasesComponent },
                    { path: 'make-purchase', component: PurchaseComponent }
                ]
            },
            { path: 'purchase', component: PurchaseComponent },
            {
                path: 'inventory', component: InventoryComponent, children: [
                    { path: '', component: ProductInventoryComponent },
                    { path: 'supplies', component: SuppliesInventoryComponent, canActivate: [inventoryGuard] },
                    { path: 'products', component: ProductBatchInventoryComponent, canActivate: [inventoryGuard] }
                ]
            },
            {
                path: 'freezing-proccess', component: ProcessRouterComponent, children: [
                    { path: '', component: ProcessComponent },
                    { path: 'create-process', component: CreateProcessComponent },

                ]
            },
            {
                path: 'sales', children: [
                    { path: '', component: SalesComponent },
                    { path: 'make-sale', component: SaleComponent },
                    { path: ':id', component: SaleDetailsComponent },
                ]
            },
            { path: 'sale', component: SaleComponent },
            { path: '**', component: WorkingOnComponent },
        ]
    }
];
