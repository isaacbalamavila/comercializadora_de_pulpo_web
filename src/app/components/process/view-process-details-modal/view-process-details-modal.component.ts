import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { BaseModalComponent } from '@base-ui/base-modal/base-modal.component';
import { StatusLabelComponent } from '@base-ui/status-labels/status-labels.component';
import { PageErrorComponent } from '@error-handlers/page-error/page-error.component';
import { CopyButtonComponent } from '@helpers/copy-button/copy-button.component';
import { ErrorResponse } from '@interfaces/ErrorInterface';
import { ModalRespose } from '@interfaces/ModalResponse';
import { ProcessDetailsDTO, ProcessDTO } from '@interfaces/Process/ProcessInterface';
import { PageLoaderComponent } from '@loaders/page-loader/page-loader.component';
import { ModalService } from '@services/modal.service';
import { ProcessesService } from '@services/processes.service';

@Component({
  selector: 'app-view-process-details-modal',
  imports: [BaseModalComponent, PageLoaderComponent, PageErrorComponent, DatePipe, StatusLabelComponent, CopyButtonComponent,
    CommonModule
  ],
  templateUrl: './view-process-details-modal.component.html',
  styleUrl: './view-process-details-modal.component.css'
})
export class ViewProcessDetailsModal implements OnInit {

  //* Injections
  _modalService = inject(ModalService);
  _processService = inject(ProcessesService);

  //* Data
  originalProcess!: ProcessDTO;
  _process = signal<ProcessDetailsDTO | null>(null);

  //* UI Variables
  _isLoading = signal<boolean>(true);
  _error = signal<ErrorResponse | null>(null);
  _hasChanges = computed<boolean>(() => {
    const orignal = this.originalProcess;
    const current = this._process();
    return orignal.statusId !== current!.status.id
  });

  //* Component Init
  ngOnInit(): void {
    this._getProcessDetails();
  }

  //* Get Process Details
  _getProcessDetails(): void {
    this._isLoading.set(true);
    this._processService.getProcessDetails(this.originalProcess.id).subscribe({
      next: (res) => this._process.set(res),
      error: (error) => {
        this._error.set({ statusCode: error.statusCode });
        this._isLoading.set(false);
      },
      complete: () => this._isLoading.set(false)
    }
    );
  }

  //* Close
  _close(): void {
    this._modalService.close<ModalRespose<null>>({ hasChanges: this._hasChanges(), data: null });
  }
}
