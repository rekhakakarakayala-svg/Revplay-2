import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  onLogin(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    
    // We extract the values using the 'name' attributes from your HTML
    const emailInput = form.elements.namedItem('email') as HTMLInputElement;
    const passwordInput = form.elements.namedItem('password') as HTMLInputElement;

    const credentials = {
      email: emailInput.value,
      password: passwordInput.value
    };

    console.log('Sending to Java:', credentials);

    this.authService.login(credentials).subscribe({
      next: (res) => {
        console.log('Java Response:', res);
        // If Java returns a map, we ensure the keys match (token/role)
        if (res && res.token) {
          console.log('Login successful, moving to home...');
          
          // 👈 We changed this line to point to '/home'
          this.router.navigate(['/home']); 
        }
      },
      error: (err) => {
        console.error('Login Failed:', err);
        alert(err.error || 'Login Failed: Check your credentials');
      }
    });
  }
}