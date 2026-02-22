import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../auth/auth'; 

//  NEW: A smart state object that remembers both the song AND whether it should autoplay!
export interface PlayerState {
  song: any;
  autoplay: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private authService = inject(AuthService); 
  
  //  FIX: Updated the BehaviorSubject to hold our new PlayerState
  private playerStateSubject = new BehaviorSubject<PlayerState | null>(null);
  playerState$ = this.playerStateSubject.asObservable();

  //  FIX: Safely extracts the user's actual email/ID directly from their secure JWT token!
  private getUniqueUserId(): string {
    const token = this.authService.getToken();
    if (!token) return 'unknown_user';
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      const parsed = JSON.parse(decoded);
      return parsed.sub || parsed.email || 'unknown_user'; 
    } catch (e) {
      return 'unknown_user';
    }
  }

  playSong(song: any) {
    //  When a user clicks a song, we tell it to Autoplay!
    this.playerStateSubject.next({ song, autoplay: true });

    const userId = this.getUniqueUserId();
    if (userId !== 'unknown_user') {
      localStorage.setItem(`savedSong_${userId}`, JSON.stringify(song));
    }
  }

  restoreUserSong() {
    if (!this.playerStateSubject.getValue()) {
      const userId = this.getUniqueUserId();
      const savedSong = localStorage.getItem(`savedSong_${userId}`);
      
      if (savedSong) {
        try {
          //  When restoring from memory on login, Autoplay is strictly FALSE!
          this.playerStateSubject.next({ song: JSON.parse(savedSong), autoplay: false });
        } catch (error) {
          console.error('Failed to parse saved song', error);
        }
      }
    }
  }

  clearSong() {
    this.playerStateSubject.next(null);
  }

  getAudioUrl(fileName: string): string {
    if (!fileName) return '';
    return `${environment.apiUrl}/songs/play/${fileName}`;
  }

  getCoverImageUrl(fileName: string | null): string {
    if (!fileName) return 'assets/default-cover.jpg';
    return `${environment.apiUrl}/songs/image/${fileName}`;
  }
}