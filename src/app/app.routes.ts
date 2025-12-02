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
            { path: '**', component: WorkingOnComponent }
        ]
    }
];
