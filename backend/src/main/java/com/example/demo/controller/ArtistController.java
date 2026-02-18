package com.example.demo.controller;

import com.example.demo.dto.ArtistProfileRequest;
import com.example.demo.dto.ArtistStatsResponse;
import com.example.demo.service.ArtistService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/artists")
public class ArtistController {

    private final ArtistService artistService;

    public ArtistController(ArtistService artistService) {
        this.artistService = artistService;
    }

    // POST: http://localhost:8080/api/artists/profile
    @PostMapping("/profile")
    public ResponseEntity<String> updateProfile(Authentication authentication, @RequestBody ArtistProfileRequest request) {
        // Automatically fetches the logged-in user's email from the JWT
        String message = artistService.setupOrUpdateArtistProfile(authentication.getName(), request);
        return ResponseEntity.ok("{\"message\": \"" + message + "\"}");
    }

    // GET: http://localhost:8080/api/artists/stats
    @GetMapping("/stats")
    public ResponseEntity<ArtistStatsResponse> getAnalytics(Authentication authentication) {
        return ResponseEntity.ok(artistService.getArtistAnalytics(authentication.getName()));
    }
}