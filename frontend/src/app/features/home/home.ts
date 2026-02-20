import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../../core/services/auth'; 
import { Song } from '../../core/services/song/song'; 
import { environment } from '../../../environments/environment'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private authService = inject(AuthService);
  private songService = inject(Song);
  private router = inject(Router);

  userName: string = '';
  userRole: string = '';
  songs: any[] = []; 
  
  // --- NEW: Audio Player Variables ---
  currentSong: any = null;

  ngOnInit() {
    const storedName = this.authService.getUserName();
    this.userName = (storedName && storedName !== 'null') ? storedName : 'User';
    this.userRole = this.authService.getRole() || 'USER';
    this.fetchSongs();
  }

  fetchSongs() {
    this.songService.getAllSongs().subscribe({
      next: (data) => {
        this.songs = data;
        console.log('Successfully loaded songs:', this.songs);
      },
      error: (err) => console.error('Failed to load songs:', err)
    });
  }

  // --- NEW: Set the clicked song as the active song ---
  playSong(song: any) {
    console.log('Playing:', song.title);
    this.currentSong = song;
  }

  // --- NEW: Generate the URL for the audio tag ---
  getAudioUrl(fileName: string): string {
    // We will build this endpoint in Spring Boot next if it doesn't exist yet!
    return `${environment.apiUrl}/songs/play/${fileName}`;
  }

  onLogout() {
    this.authService.logout();       
    this.router.navigate(['/login']); 
  }
}