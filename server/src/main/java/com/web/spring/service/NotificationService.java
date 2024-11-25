package com.web.spring.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.web.spring.dto.notification.NotificationRequestDto;
import com.web.spring.dto.notification.NotificationResponseDto;
import com.web.spring.entity.Child;
import com.web.spring.entity.Notification;
import com.web.spring.entity.Parent;
import com.web.spring.repository.ChildRepository;
import com.web.spring.repository.NotificationRepository;
import com.web.spring.repository.ParentRepository;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {
	// Notification 객체 생성, 저장, SSE로 전송하는 기능
	// 알림 메세지 조회
	private final ParentRepository parentRepository;
	private final ChildRepository childRepository;
	private final NotificationRepository notificationRepository;
	
	// 메시지
    private static final String PARENT_NOT_FOUND = "해당 parentNum의 Parent가 없습니다.";
    private static final String CHILD_NOT_FOUND = "해당 childNum의 Child가 없습니다.";
	
    //타임아웃 설정 (1시간)
	private static final Long DEFAULT_TIMEOUT = 60L * 1000 * 60;
	// Emitter를 관리하기 위한 Map
//	private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();
    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();
    
    // Scheduler를 전역 멤버 변수로 선언 및 초기화
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
	
	private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);
	
	// 클라이언트가 구독을 호출하는 메소드(클라이언트 controller에서 구독페이지 엔드포인트를 생성하는데 사용된다.)
    public SseEmitter subscribe(String uniqueId, final HttpServletResponse response) {
        // 역할과 ID를 조합하여 고유 ID 생성
//    	System.out.println("구독 요청: " + uniqueId);

        // 기존 Emitter가 있을 경우 삭제
        if (emitters.containsKey(uniqueId)) {
            emitters.remove(uniqueId);
        }
        // CORS 관련 헤더 설정
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        // SSE 관련 헤더 설정
        response.setContentType("text/event-stream; charset=UTF-8");
    	response.setCharacterEncoding("UTF-8");
        
        // Emitter를 생성하고 저장함
        SseEmitter emitter = createEmitter(uniqueId); // Emitter 생성 및 추가
        
        // Emitter를 Map에 저장
        emitters.put(uniqueId, emitter);
        
        // Keep-alive 설정
        scheduleKeepAlive(uniqueId);
        
        // 현재 등록된 Emitters 출력
        System.out.println("현재 등록된 Emitters: " + emitters.keySet());
        
        // 초기 더미 데이터를 전송하여 연결 상태 유지
        sendInitialDummyNotification(uniqueId);
        
    	
    	return emitter;
    }
    
    // Keep-alive 스케줄러 설정
    private void scheduleKeepAlive(String uniqueId) {
        scheduler.scheduleAtFixedRate(() -> {
            SseEmitter activeEmitter = emitters.get(uniqueId); // 현재 Emitter 가져오기
            if (activeEmitter != null) {
                try {
                    activeEmitter.send(SseEmitter.event().name("keep-alive").data("ping"));
                } catch (IOException e) {
                    System.out.println("[SSE] Keep-alive 실패, Emitter 제거: " + uniqueId);
                    emitters.remove(uniqueId); // 실패 시 Emitter 제거
                }
            }
        }, 0, 5, TimeUnit.SECONDS); // 5초 간격으로 Keep-alive 메시지 전송
    }
 // 초기 더미 데이터를 전송
    private void sendInitialDummyNotification(String uniqueId) {
        NotificationResponseDto dummyNotification = new NotificationResponseDto();
        dummyNotification.setNotiNum(-1L); // -1로 설정하여 더미임을 구분 가능
        dummyNotification.setMessage("연결확인용 더미 데이터");
        dummyNotification.setCategory("dummy");
        dummyNotification.setParentNum(-1L);
        dummyNotification.setChildNum(-1L);
        dummyNotification.setSenderType("dummy");

        // 초기 더미 데이터를 전송하여 연결 상태 유지
        sendSseNotification(uniqueId, dummyNotification);
    }
    
	
    // 수정: 고유 ID를 기반으로 관리하도록 변경
	// Service에 SSE Emitter를 생성하고 타임아웃을 설정 해 준다.
	private SseEmitter createEmitter(String uniqueId) {
		System.out.println("createEmitter uniqueId: " + uniqueId);
		
		// 기존 Emiiter가 존재하면 삭제(중복방지)
		if(emitters.containsKey(uniqueId)) {
			emitters.remove(uniqueId); 
		}
		
		// 새 Emitter 생성
		SseEmitter emitter = new SseEmitter(DEFAULT_TIMEOUT);
		emitters.put(uniqueId, emitter);
		
	    // Emitter 완료 시
	    emitter.onCompletion(() -> {
	        System.out.println("SSE Emitter 완료: " + uniqueId);
	        emitters.remove(uniqueId);
	    });

	    // 타임아웃 처리
	    emitter.onTimeout(() -> {
	        System.out.println("SSE Emitter 타임아웃: " + uniqueId);
	        emitters.remove(uniqueId);
	    });

	    // 에러 처리
	    emitter.onError((e) -> {
	        System.out.println("SSE Emitter 에러 발생: " + uniqueId + ", 에러: " + e.getMessage());
	        emitters.remove(uniqueId);
	    });
		
		return emitter;
	}
	
	// 수정: 알림 전송 로직에서 고유 ID를 기반으로 대상 Emitter를 가져오도록 변경
	// SSE를 통해 실제 실시간 알림을 전송하는 메서드  (https://velog.io/@black_han26/SSE-Server-Sent-Events)
	private void sendSseNotification(String uniqueId, NotificationResponseDto notificationResponseDto) {	    
	    SseEmitter emitter = emitters.get(uniqueId); // Emitter 가져오기
	    
	    System.out.println("[SSE] 고유 ID: " + uniqueId);
	    System.out.println("[SSE] Emitter 존재 여부: " + (emitter != null));
	    System.out.println("emitter 확인 : " + emitter);
	    
	    if (emitter == null) return; // Emitter 없으면 종료
	    
	    // Emitter가 존재하는 경우
	    try {
	        emitter.send(SseEmitter.event()
	                .id(String.valueOf(notificationResponseDto.getNotiNum()))
	                .data(new ObjectMapper().writeValueAsString(notificationResponseDto))
	                .reconnectTime(3000) // 클라이언트가 연결을 잃었을때 재연결 간격설정
	                );	        
	    } catch (IOException | IllegalStateException e) {
	    	emitter.completeWithError(e);
	        emitters.remove(uniqueId); // 오류 발생 시 Emitter 제거
	    }
	}
    // 알림 디비에 저장
	@Transactional
	public NotificationResponseDto sendEvent(NotificationRequestDto notiRequestDto) {
	    Parent parent = parentRepository.findById(notiRequestDto.getParentNum())
	            .orElseThrow(() -> new NoSuchElementException(PARENT_NOT_FOUND));
	    Child child = childRepository.findById(notiRequestDto.getChildNum())
	            .orElseThrow(() -> new NoSuchElementException(CHILD_NOT_FOUND));

	    // 알림 저장
	    Notification notification = new Notification(parent, child, notiRequestDto.getMessage(), notiRequestDto.getCategory(), notiRequestDto.getSenderType());
	    Notification saveNotification = notificationRepository.save(notification);
	    NotificationResponseDto notificationResponseDto = saveNotification.toNotification(saveNotification);

        // 수정: 발신자에 따라 고유 ID를 생성하여 알림 전송
        if ("parent".equalsIgnoreCase(notiRequestDto.getSenderType())) {
            String childUniqueId = "child-" + notiRequestDto.getChildNum();
            sendSseNotification(childUniqueId, notificationResponseDto); // 아이에게 알림 전송
        } else {
            String parentUniqueId = "parent-" + notiRequestDto.getParentNum();
            sendSseNotification(parentUniqueId, notificationResponseDto); // 부모에게 알림 전송
        }
	    return notificationResponseDto;
	}

	// 실제 알림 전송 메서드
	// 수정: 실제 알림 전송 메서드에서 고유 ID를 사용
	public void notify(String uniqueId, NotificationRequestDto notiRequestDto) {
		// 클라이언트에게 실제 알림데이터를 전송함
	    // NotificationRequestDto를 NotificationResponseDto로 변환
	    NotificationResponseDto notificationResponseDto = new NotificationResponseDto(
	        null,  // notiNum은 null로 시작, 서버에서 자동 생성됨
	        notiRequestDto.getParentNum(),
	        notiRequestDto.getChildNum(),
	        notiRequestDto.getMessage(),
	        notiRequestDto.getCategory(),
	        notiRequestDto.getSenderType(),
	        notiRequestDto.getIsRead()
	    );
		sendSseNotification(uniqueId, notificationResponseDto);
	}
    
    // 조회
    // 해당 child에 대한 모든 알림을 조회
    public List<Notification> getNotificationsForChild(Long childNum) {
    	
        return notificationRepository.getNotificationsForChild(childNum, "parent");
    }
    
    // 해당 parent에 대한 모든 알림을 조회
    public List<Notification> getNotificationsForParent(Long parentNum) {
        return notificationRepository.getNotificationsForParent(parentNum, "child");
    }
    
    // parent_num 반환
    public Long findParentNoByChildId (Long childNum) {
    	return notificationRepository.getParentNum(childNum);
    }

    // 알림 읽음 업데이트
    public void updateReadStatus(Long notiNum) {
    	notificationRepository.updateRead(notiNum);
    }
	
}
