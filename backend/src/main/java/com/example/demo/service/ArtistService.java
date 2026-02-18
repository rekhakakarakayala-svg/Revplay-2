package com.example.demo.service;

import com.example.demo.dto.ArtistProfileRequest;
import com.example.demo.dto.ArtistStatsResponse;
import com.example.demo.entity.Artist;
import com.example.demo.entity.Song;
import com.example.demo.entity.User;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.ArtistRepository;
import com.example.demo.repository.SongRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ArtistService {

    private final ArtistRepository artistRepository;
    private final UserRepository userRepository;
    private final SongRepository songRepository; // Auto-wired from Dev 1's work

    public ArtistService(ArtistRepository artistRepository, UserRepository userRepository, SongRepository songRepository) {
        this.artistRepository = artistRepository;
        this.userRepository = userRepository;
        this.songRepository = songRepository;
    }

    @Transactional
    public String setupOrUpdateArtistProfile(String email, ArtistProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // 1. Upgrade the User's role to ARTIST so Spring Security grants them new permissions
        if (!"ARTIST".equals(user.getRole())) {
            user.setRole("ARTIST");
            userRepository.save(user);
        }

        // 2. Find their existing profile, or create a new one if it doesn't exist yet
        Optional<Artist> existingArtist = artistRepository.findByUser(user);
        Artist artist = existingArtist.orElseGet(Artist::new);

        artist.setUser(user);
        artist.setBio(request.getBio());
        artist.setGenre(request.getGenre());
        artist.setSocialLinks(request.getSocialLinks());
        artist.setBannerImageUrl(request.getBannerImageUrl());

        artistRepository.save(artist);
        return "Artist profile successfully updated!";
    }

    public ArtistStatsResponse getArtistAnalytics(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Artist artist = artistRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Artist profile not found. Please set up your profile first."));

        // Fetch all songs created by this artist using Dev 1's repository
        List<Song> artistSongs = songRepository.findByArtist(artist);

        ArtistStatsResponse response = new ArtistStatsResponse();
        response.setArtistName(user.getName());
        response.setGenre(artist.getGenre());

        // Calculate the analytics!
        if (artistSongs != null && !artistSongs.isEmpty()) {
            response.setTotalSongsUploaded(artistSongs.size());

            // Sum up the play counts of every song the artist has published
            long totalPlays = artistSongs.stream()
                    .mapToLong(song -> song.getPlayCount() != null ? song.getPlayCount() : 0)
                    .sum();
            response.setTotalAllTimePlays(totalPlays);
        } else {
            // New artists start at zero
            response.setTotalSongsUploaded(0);
            response.setTotalAllTimePlays(0L);
        }

        return response;
    }
}