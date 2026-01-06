import { Component, OnInit, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { isAdminOrManager } from '@utils/userAuth';

@Component({
  selector: 'app-inventory',
  imports: [RouterModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent implements OnInit{
  _isAdmin = signal<boolean>(false);

  ngOnInit(): void {
     this._isAdmin.set(isAdminOrManager());
  }

}
