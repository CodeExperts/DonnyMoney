package com.web.spring.controller;

import com.web.spring.dto.child.edu.YouTubeSearchResult;
import com.web.spring.service.ChildService;
import com.web.spring.service.EduYoutubeService;
import com.web.spring.service.S3Service;
import com.web.spring.service.WishService;

import lombok.RequiredArgsConstructor;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class EduYoutubeController {

    private final EduYoutubeService youtubeService;

    // YouTube 검색 API를 호출하는 엔드포인트
    @GetMapping("/edu")
    public ResponseEntity<?> searchVideoList() throws IOException {
    	List<YouTubeSearchResult> eduVideoList = youtubeService.searchVideoList();
    	
			return ResponseEntity.status(HttpStatus.OK)
		 			 .body(eduVideoList);
    }
    
    // 한개의 영상정보만 반환
    @GetMapping("/edu/{videoId}")
    public ResponseEntity<?> videoDetails(@PathVariable String videoId) throws IOException {
    	YouTubeSearchResult eduVideoList = youtubeService.videoDetails(videoId);
    	
			return ResponseEntity.status(HttpStatus.OK)
		 			 .body(eduVideoList);
    }
}