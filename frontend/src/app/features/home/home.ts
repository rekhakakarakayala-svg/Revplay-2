import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth'; 

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html', // (or .component.html)
  styleUrl: './home.css'      // (or .component.css)
})
export class Home {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Grab the name and role we saved in LocalStorage during login
  userName = this.authService.getUserName() || 'Music Lover';
  userRole = this.authService.getRole() || 'USER';

  onLogout() {
    this.authService.logout();       // Clears the token
    this.router.navigate(['/login']); // Sends them back to login
  }
}