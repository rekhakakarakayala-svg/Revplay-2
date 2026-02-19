package com.example.demo.service;

import com.example.demo.dto.UserProfileDTO;
import com.example.demo.dto.UserStatsDTO;
import com.example.demo.entity.User;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.FavoriteRepository;
import com.example.demo.repository.PlaylistRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PlaylistRepository playlistRepository;
    private final FavoriteRepository favoriteRepository;

    // Notice we injected the two new repositories here!
    public UserService(UserRepository userRepository, PlaylistRepository playlistRepository, FavoriteRepository favoriteRepository) {
        this.userRepository = userRepository;
        this.playlistRepository = playlistRepository;
        this.favoriteRepository = favoriteRepository;
    }

    public UserProfileDTO getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found."));

        UserProfileDTO dto = new UserProfileDTO();
        dto.setUserId(user.getUserId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setProfilePictureUrl(user.getProfilePictureUrl());
        dto.setBio(user.getBio());
        dto.setCreatedAt(user.getCreatedAt());

        return dto;
    }

    // NEW: Calculate User Statistics
    public UserStatsDTO getUserStats(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        long playlistCount = playlistRepository.countByUser(user);
        long favoritesCount = favoriteRepository.countByUser(user);

        UserStatsDTO stats = new UserStatsDTO();
        stats.setTotalPlaylists(playlistCount);
        stats.setFavoriteSongsCount(favoritesCount);

        // Temporarily set to 0. We will connect this to real data when we build the History module!
        stats.setTotalListeningTimeMinutes(0L);

        return stats;
    }
}