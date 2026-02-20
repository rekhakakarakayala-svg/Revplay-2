import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Song } from '../../../core/services/song/song';  // 👈 Updated path and class name!

@Component({
  selector: 'app-upload-song',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './upload-song.html',
  styleUrl: './upload-song.css'
})
export class UploadSong {
  // Injecting the 'Song' class you generated
  private songService = inject(Song); 
  private router = inject(Router);

  selectedFile: File | null = null;
  isUploading: boolean = false;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onUpload(event: Event) {
    event.preventDefault();
    if (!this.selectedFile) {
      alert('Please select an audio file first!');
      return;
    }

    this.isUploading = true;
    const form = event.target as HTMLFormElement;
    
    // Package the form data perfectly for Spring Boot
    const formData = new FormData();
    formData.append('title', (form.elements.namedItem('title') as HTMLInputElement).value);
    formData.append('genre', (form.elements.namedItem('genre') as HTMLSelectElement).value);
    formData.append('file', this.selectedFile); // 👈 Must be 'file' to match Spring Boot

    console.log('Sending song to Java...');
    
    // Send it using our new service!
    this.songService.uploadSong(formData).subscribe({
      next: (response) => {
        console.log('Upload Success:', response);
        alert('Song uploaded successfully!');
        this.isUploading = false;
        this.router.navigate(['/home']); // Send them back to the dashboard
      },
      error: (err) => {
        console.error('Upload Error:', err);
        alert(err.error?.message || 'Upload failed. Check the console.');
        this.isUploading = false;
      }
    });
  }
}