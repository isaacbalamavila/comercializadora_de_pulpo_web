import { Component, inject, OnInit, signal } from '@angular/core';
import { UserInfo } from '@interfaces/UserInfo';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'user-info',
  imports: [],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent implements OnInit {
  //* Injections
  _userService = inject(AuthService);

  //* Data
  _user = signal<UserInfo | null>(null);

  ngOnInit(): void {
    this._user.set(this._userService.getUser());
  }
}
