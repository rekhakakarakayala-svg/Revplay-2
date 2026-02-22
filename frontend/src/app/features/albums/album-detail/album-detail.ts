import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Album } from '../../../core/services/album/album';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-album-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './album-detail.html',
  styleUrl: './album-detail.css'
})
export class AlbumDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private albumService = inject(Album);
  private location = inject(Location);

  albumId: number = 0;
  album: any = null;
  albumSongs: any[] = [];
  isLoading: boolean = true;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.albumId = +params['id'];
      if (this.albumId) {
        this.loadAlbum();
      }
    });
  }

  loadAlbum() {
    this.isLoading = true;
    this.albumService.getAlbumById(this.albumId).subscribe({
      next: (data: any) => {
        this.album = data;
        this.albumSongs = data.songs || [];
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching album', err);
        this.isLoading = false;
      }
    });
  }

  getCoverImageUrl(fileName: string | null): string {
    if (!fileName) return '';
    return `${environment.apiUrl}/songs/image/${fileName}`;
  }

  onImageError(event: any) {
    event.target.style.display = 'none';
  }

  goBack() {
    this.location.back();
  }

  // 🎵 We will connect this to your global music player soon!
  playSong(song: any) {
    console.log('Playing song:', song);
    // TODO: Send to PlayerService
  }

  playFullAlbum() {
    if (this.albumSongs.length > 0) {
      this.playSong(this.albumSongs[0]); // Plays the first song for now
    }
  }
}