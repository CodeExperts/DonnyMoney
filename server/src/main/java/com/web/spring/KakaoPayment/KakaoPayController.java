package com.web.spring.KakaoPayment;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.web.spring.entity.PointOrder;
import com.web.spring.repository.PointOrderRepository;

import jakarta.servlet.http.HttpServletResponse;


@Slf4j
@Controller
@AllArgsConstructor
@Validated
@RequestMapping("/api")
public class KakaoPayController {
    private final KakaoPayService kakaoPayService;
    private final PointOrderRepository pointOrderRepository;

    //결제 요청
    @GetMapping("/order/pay/{ord_id}")
    public @ResponseBody ResponseEntity payReady(@PathVariable("ord_id") long ordId ) {

        PointOrder findOrd = pointOrderRepository.findById(ordId).orElseThrow();
        
        System.out.println(findOrd);

        // 카카오 결제 준비하기 -> 결제요청 service 실행
        ReadyResponseDto response = kakaoPayService.payReady(findOrd);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    //결제 승인 요청
    @GetMapping("/order/pay/completed/{ord_id}")
    public void  payCompleted( @RequestParam("pg_token") String pgToken,
                                @PathVariable("ord_id") long ordId, 
                                HttpServletResponse response) throws IOException {

        log.info("!결제승인 요청 시작!") ;
        log.info("결제승인 요청을 인증하는 토큰: " + pgToken);

        // 카카오 결재 요청하기
        kakaoPayService.payApprove(ordId, pgToken);
        log.info("결제 완료");

        //redirectAttributes.addAttribute("ordId", ordId);

        response.sendRedirect("http://54.180.195.153:3000/agreement");
    }

    // 결제 취소시 실행 url
    @GetMapping("/order/pay/cancel/{ord_id}")
    public String payCancel(@PathVariable("ord_id") long ordId) {
        kakaoPayService.cancelOrFailPayment(ordId);
        log.info("결제 취소");

        return "redirect:http://54.180.195.153:3000/order/pay/cancel";
    }

    // 결제 실패시 실행 url
    @GetMapping("/order/pay/fail/{ord_id}")
    public String payFail(@PathVariable("ord_id") long ordId) {
        kakaoPayService.cancelOrFailPayment(ordId);
        log.info("결제 실패");

        return "redirect:http://54.180.195.153:3000/order/pay/fail";
    }
}
