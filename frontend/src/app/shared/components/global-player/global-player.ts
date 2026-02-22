import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../../core/services/audio/audio';

@Component({
  selector: 'app-global-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './global-player.html',
  styleUrl: './global-player.css'
})
export class GlobalPlayer {
  // Inject the service as public so the HTML template can use it directly
  public audioService = inject(AudioService);
}