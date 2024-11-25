package com.web.spring.KakaoPayment;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import com.web.spring.entity.PointOrder;
import com.web.spring.repository.PointOrderRepository;

@Slf4j
@Service
@RequiredArgsConstructor
public class KakaoPayService {
   
	
	private final PointOrderRepository ordRepository;
	
	//@Value("${spring.security.oauth2.client.registration.kakao.adminKey}")
    private String secretKey = "DEV225BD49217D0AFE5079A5537363E719E8FC7C";

    // 결제 준비 메서드
    public ReadyResponseDto payReady(PointOrder ord) {

    	Map<String, String> parameters = new HashMap<>();
    	
        parameters.put("cid", "TC0ONETIME");                                            //가맹점 코드, 10자
        parameters.put("partner_order_id", Long.toString(ord.getOrderNum()));              //가맹점 주문번호, 최대 100자
        parameters.put("partner_user_id", "donnyMoney");                                    //가맹점 회원 id, 최대 100자
        parameters.put("item_name", "용돈");            //상품명
        parameters.put("quantity", "1");                //상품 수량
        parameters.put("total_amount", String.valueOf(ord.getAmount()));          //상품 총액
        parameters.put("tax_free_amount", "0");                                         //상품 총액

        parameters.put("approval_url", "http://54.180.195.153/api/order/pay/completed/"+ ord.getOrderNum());    // 결제 승인 시 넘어갈 redirect url,
        parameters.put("cancel_url", "http://54.180.195.153/api/order/pay/cancel/"+ ord.getOrderNum());         // 결제 취소 시 넘어갈 redirect url,
        parameters.put("fail_url", "http://54.180.195.153/api/order/pay/fail/"+ ord.getOrderNum());             // 결제 실패 시 넘어갈 redirect url,

        //Header + Body 합치기
        HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(parameters, this.getHeaders());

        // 외부 url 요청 통로 열기
        RestTemplate template = new RestTemplate();
        //template.setRequestFactory(new HttpComponentsClientHttpRequestFactory()); //에러 메시지 확인

        String url = "https://open-api.kakaopay.com/online/v1/payment/ready";
        
        ResponseEntity<ReadyResponseDto> readyResponseDto = template.postForEntity(url, requestEntity, ReadyResponseDto.class);
        ord.setTid(readyResponseDto.getBody().getTid());
        ordRepository.save(ord);

        log.info("결제준비 응답객체: " + readyResponseDto);

        return readyResponseDto.getBody();
        
        
        //ReadyResponseDto readyResponseDto = template.postForObject(url, requestEntity, ReadyResponseDto.class);
//        ord.setTid(readyResponseDto.getTid());
//        ordRepository.save(ord);
//
//        log.info("결제준비 응답객체: " + readyResponseDto);
//
//        return readyResponseDto;
    }

    // 결제 승인요청 메서드
    public void payApprove(Long ordId, String pgToken) {

    	PointOrder findOrd = ordRepository.findById(ordId).orElseThrow();
        log.info("partner_order_id:"+ ordId);
        log.info("tid:"+ findOrd.getTid());

        // request
        Map<String, String> parameters = new HashMap<>();
        parameters.put("cid", "TC0ONETIME");                        //가맹점 코드
        parameters.put("tid", findOrd.getTid());                    //결제 고유번호, 결제 준비 API 응답에 포함
        parameters.put("partner_order_id", Long.toString(ordId));   //가맹점 주문번호, 결제 준비 API 요청과 일치해야 함
        parameters.put("partner_user_id", "donnyMoney");                //가맹점 회원 id, 결제 준비 API 요청과 일치해야 함
        parameters.put("pg_token", pgToken);                        //결제승인 요청을 인증하는 토큰

        HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(parameters, this.getHeaders());

        // 외부 url 통신
        RestTemplate template = new RestTemplate();

        String url = "https://open-api.kakaopay.com/online/v1/payment/approve";

        ApproveResponseDto approveResponse = template.postForObject(url, requestEntity, ApproveResponseDto.class);
        log.info("결재승인 응답객체: " + approveResponse);

        //order 상태 PAY_COMPLETE 로 변경
         findOrd.setOrdStatus("PAY_COMPLETE");
         ordRepository.save(findOrd);

        return;
    }

    /* 결제 취소 혹은 삭제 */
    public void cancelOrFailPayment(Long ordId) {

        //결제 취소, 결제 실패로 인한 잔여 재고 수정
    	
    	System.out.println("결제가 취소 됐습니당");
//    	PointOrder findOrd = ordService.findVerifiedOrd(ordId);
//        Board findBoard = findOrd.getProduct().getBoard();
//
//        findBoard.getProduct().setLeftStock(findBoard.getProduct().getLeftStock() + findOrd.getQuantity());
//        boardRepository.save(findBoard);
//        ordService.deleteOrd(ordId);
    }

    // 서버로 요청할 Header
    private HttpHeaders getHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "SECRET_KEY " + secretKey);
        headers.set("Content-type", "application/json");

        return headers;
    }
}
