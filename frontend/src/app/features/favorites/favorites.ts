import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { Song } from '../../core/services/song/song'; 
import { AudioService } from '../../core/services/audio/audio'; //  NEW: Global Player
import { History } from '../../core/services/history/history'; //  NEW: History tracking
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './favorites.html',  
  styleUrl: './favorites.css'      
})
export class Favorites implements OnInit {
  private songService = inject(Song);
  private router = inject(Router);
  
  //  Injecting Global Services
  private audioService = inject(AudioService);
  private historyService = inject(History);

  favoriteSongs: any[] = []; 

  ngOnInit() {
    this.fetchFavorites();
  }

  fetchFavorites() {
    this.songService.getLikedSongs().subscribe({
      next: (data: any[]) => this.favoriteSongs = data,
      error: (err: any) => console.error('Failed to load favorites:', err)
    });
  }

  // If they click the heart on this page, it "unlikes" it and removes it from the screen
  unlikeSong(event: Event, songId: number) {
    event.stopPropagation(); 
    this.songService.toggleLike(songId).subscribe({
      next: () => {
        // Filter out the song they just unliked so it disappears instantly
        this.favoriteSongs = this.favoriteSongs.filter((song: any) => song.songId !== songId);
      },
      error: (err: any) => console.error('Failed to unlike song:', err)
    });
  }

  //  UPDATED: Sends the clicked song and the whole Favorites queue to the Global Player
  playSong(song: any) {
    // 1. Map the favorites list into a queue format your player understands
    const mappedQueue = this.favoriteSongs.map((s: any) => ({
      songId: s.songId,
      title: s.title || s.songTitle,
      artistName: s.artistName || 'Unknown Artist',
      audioFileUrl: s.audioFileUrl || null,
      coverImageUrl: s.coverImageUrl || null 
    }));

    // 2. Find the exact song they clicked
    const songToPlay = mappedQueue.find((s: any) => s.songId === song.songId);

    if (songToPlay) {
      // 3. Send to Global Player!
      this.audioService.playSong(songToPlay, mappedQueue);

      // 4. Update the play count
      this.songService.incrementPlayCount(song.songId).subscribe({
        next: () => song.playCount = (song.playCount || 0) + 1,
        error: (err: any) => console.error('Failed to update play count:', err)
      });

      // 5. Add to Recently Played History
      this.historyService.logPlay(song.songId).subscribe({
        error: (err: any) => console.error('Failed to log history:', err)
      });
    }
  }

  //  NEW: Convenience method to play the whole favorites list from track 1
  playAllFavorites() {
    if (this.favoriteSongs.length > 0) {
      this.playSong(this.favoriteSongs[0]);
    }
  }

  getCoverImageUrl(fileName: string | null): string {
    if (!fileName) return 'assets/default-cover.jpg'; 
    return `${environment.apiUrl}/songs/image/${fileName}`;
  }
}