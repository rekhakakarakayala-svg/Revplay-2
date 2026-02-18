package com.example.demo.dto;

public class ArtistStatsResponse {
    private String artistName;
    private String genre;
    private int totalSongsUploaded;
    private long totalAllTimePlays;

    // --- Getters and Setters ---
    public String getArtistName() { return artistName; }
    public void setArtistName(String artistName) { this.artistName = artistName; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public int getTotalSongsUploaded() { return totalSongsUploaded; }
    public void setTotalSongsUploaded(int totalSongsUploaded) { this.totalSongsUploaded = totalSongsUploaded; }

    public long getTotalAllTimePlays() { return totalAllTimePlays; }
    public void setTotalAllTimePlays(long totalAllTimePlays) { this.totalAllTimePlays = totalAllTimePlays; }
}