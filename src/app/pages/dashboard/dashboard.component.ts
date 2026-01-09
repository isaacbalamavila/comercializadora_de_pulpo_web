import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, OnInit, signal, ViewChild, effect } from '@angular/core';
import { PageTitleComponent } from '@base-ui/page-title/page-title.component';
import { UserInfoComponent } from '@base-ui/user-info/user-info.component';
import { AuthService } from '@services/auth.service';
import { capitalize } from '@utils/capitalize';
import { isAdminOrManager } from '@utils/userAuth';
import { GENERIC_GREETINGS, getRandomInt } from 'config/constansts';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '@services/dashboard.service';
import { DashboardDTO } from '@interfaces/Dashboard';
import { ErrorResponse } from '@interfaces/ErrorInterface';
import { PageErrorComponent } from '@error-handlers/page-error/page-error.component';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [UserInfoComponent, CommonModule, PageErrorComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  //* Injections
  _userService = inject(AuthService);
  _dashboardService = inject(DashboardService);

  //* Data
  _dashboard = signal<DashboardDTO | null>(null);

  //* UI Variables
  _pageTitle = signal<string>('Bienvenido ');
  _today = signal<Date>(new Date(Date.now()));
  _isAdminOrManager = signal<boolean>(false);
  _isLoading = signal<boolean>(true);
  _error = signal<ErrorResponse | null>(null);

  //* ViewChild
  @ViewChild('purchasesChart') purchasesChart!: ElementRef;
  @ViewChild('salesChart') salesChart!: ElementRef;

  //* Flag to track if view is initialized
  private viewInitialized = false;

  constructor() {
    // Effect to create charts when both data is loaded and view is initialized
    effect(() => {
      if (!this._isLoading() && this.viewInitialized && this._dashboard()) {
        // Small delay to ensure DOM is updated
        setTimeout(() => {
          this.createCharts();
        }, 0);
      }
    });
  }

  ngOnInit(): void {
    const userName = capitalize(this._userService.getUser()?.name ?? 'Usuario');
    const greetingIndex = getRandomInt(0, GENERIC_GREETINGS.length - 1);
    this._pageTitle.set(`${GENERIC_GREETINGS[greetingIndex]} ${userName}`);
    this._isAdminOrManager.set(isAdminOrManager());

    this._dashboardService.getDashboard().subscribe({
      next: (res) => this._dashboard.set(res),
      error: (err) => {
        this._error.set({ statusCode: err.status });
        this._isLoading.set(false);
      },
      complete: () => this._isLoading.set(false)
    });
  }

  ngAfterViewInit() {
    this.viewInitialized = true;
    
    // If data is already loaded, create charts
    if (!this._isLoading() && this._dashboard()) {
      setTimeout(() => {
        this.createCharts();
      }, 0);
    }
  }

  private createCharts(): void {
    // Check if elements exist before creating charts
    if (!this.purchasesChart || !this.salesChart || !this._dashboard()) {
      console.error('Chart elements not found');
      return;
    }

    // Purchases chart
    new Chart(this.purchasesChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        datasets: [{
          label: 'Compras',
          data: this._dashboard()!.weekPurchases,
          backgroundColor: '#151A30',
          borderWidth: 0,
          borderRadius: 2,
          hoverBackgroundColor: '#34AEF9'
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1 / 1.2,
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
        },
        plugins: {
          legend: {
            display: false,
          }
        }
      }
    });

    // Sales chart
    new Chart(this.salesChart.nativeElement, {
      type: 'line',
      data: {
        labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        datasets: [{
          label: 'Ventas',
          data: this._dashboard()!.weekSales,
          borderColor: '#151A30',
          backgroundColor: 'rgba(26, 21, 48, 0.2)',
          borderWidth: 3,
          tension: 0,
          fill: true,
          pointBackgroundColor: '#151A30',
          pointBorderColor: '#151A30',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverBackgroundColor: '#34AEF9',
          pointHoverBorderColor: '#34AEF9',
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 5 / 2,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          x: {
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
}