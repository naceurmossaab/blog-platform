import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthUser } from '../../models/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    MatToolbarModule,
    MatButtonModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  authUser?: AuthUser;

  constructor(public authService: AuthService) {
    if (!this.authUser)
      this.authService.authUser$.subscribe(user => {
        this.authUser = user
      });
  }

  ngOnInit(): void {
    this.authService.isUserLoggedIn();
  }

  logout() {
    this.authService.logout();
  }
}
