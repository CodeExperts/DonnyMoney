package com.web.spring.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.web.spring.dto.notification.NotificationRequestDto;
import com.web.spring.dto.notification.NotificationResponseDto;
import com.web.spring.entity.Notification;
import com.web.spring.service.NotificationService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/notification")
public class NotificationController {
	
	//Parent나 Child가 알림을 보내거나 알림 목록을 조회하는 엔드포인트
	private final NotificationService notificationService;

	// 알림 생성 및 전송 (parent ->  child)
	@Transactional
	@PostMapping("/sendToChild")
	public ResponseEntity<NotificationResponseDto> sendNotificationToChild(@RequestBody NotificationRequestDto notiRequestDto){ 
		
		// service를 통해 알림 생성 및 전송
		NotificationResponseDto notificationResponseDto = notificationService.sendEvent(
        		notiRequestDto
        );
		return ResponseEntity.ok().body(notificationResponseDto);
	}
	
	// 알림 생성 및 전송 (child -> parent)
	@Transactional
	@PostMapping("/sendToParent")
	public ResponseEntity<NotificationResponseDto> sendNotificationToParent(@RequestBody NotificationRequestDto notiRequestDto) {		
	    NotificationResponseDto notificationResponseDto = notificationService.sendEvent(
	            notiRequestDto
	    );
	    return ResponseEntity.ok().body(notificationResponseDto);
	}
	
	// SSE 구독 설정
	// 해당 아이디에 대한 SSEEmitter를 생성하고 반환한다(서버에서 데이터를 받게 된다)
	@GetMapping(value = "/subscribe/{id}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	public SseEmitter subscribe(@PathVariable Long id, HttpServletResponse response) {
		System.out.println("Emitter created and returned for ID: " + id);
		
		return notificationService.subscribe(id, response);
	}
	
	// 해당 ID에 대한 데이터를 클라이언트에게 전송한다
	@Transactional
	@PostMapping("/send-data/{id}")
	public void sendData(@PathVariable Long id, @RequestBody NotificationRequestDto notiRequestDto) {
		notificationService.notify(id, notiRequestDto);
	}
	

	// 알림목록 조회 (getNotificationList)
//	 해당 child의 알림 목록을 조회함
    @GetMapping("/child/{childNum}")
    public List<NotificationResponseDto> getNotificationsForChild(@PathVariable Long childNum) {
        System.out.println("childNum : " + childNum);
    	List<Notification> notifications = notificationService.getNotificationsForChild(childNum);
        
    	return notifications.stream()
    			.map(notification -> notification.toNotification(notification))
    			.toList();
    }

    // 해당 parent의 알림 목록을 조회함
    @GetMapping("/parent/{parentNum}")
    public List<NotificationResponseDto> getNotificationsForParent(@PathVariable Long parentNum) {
        System.out.println("parentId : " + parentNum);
    	List<Notification> notifications = notificationService.getNotificationsForParent(parentNum);
        
    	return notifications.stream()
    			.map(notification -> notification.toNotification(notification))
    			.toList();
    }
    
    // parent_num 반환
    @GetMapping("/findParentNo/{childNum}")
    public Long findParentNo(@PathVariable Long childNum){
    	return notificationService.findParentNoByChildId(childNum);
    	
    }
    
    // 알림 읽음 업데이트
    @Transactional
    @PatchMapping("/{notiNum}/read")
    public ResponseEntity<?> updateRead(@PathVariable Long notiNum){
    	notificationService.updateReadStatus(notiNum);
    	return ResponseEntity.ok().build();
    }
    
}
