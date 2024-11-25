package com.web.spring.test;

import com.web.spring.dto.SignInResponseDto;
import com.web.spring.dto.SignUpRequestDto;
import com.web.spring.dto.child.plan.PlanRequestDto;
import com.web.spring.dto.child.plan.PlanResponseDto;
import com.web.spring.dto.child.wish.WishRequestDto;
import com.web.spring.dto.child.wish.WishResponseDto;
import com.web.spring.entity.Child;
import com.web.spring.entity.Plan;
import com.web.spring.entity.Wish;
import com.web.spring.service.ChildService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.mock.web.MockMultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ChildServiceCommandLineTest implements CommandLineRunner {

    private final ChildService childService;

    @Override
    public void run(String... args) throws Exception {
        testSignUp();
        testCreatePlan();
        testCreateWish();
        testSavingWish();
    }

    // 회원가입 테스트
    private void testSignUp() {
        try {
            SignUpRequestDto signUpRequestDto = new SignUpRequestDto();
            signUpRequestDto.setId("testChild");
            signUpRequestDto.setPwd("testPassword");
            signUpRequestDto.setParentNum(1L); // 부모 ID 설정
            // 필요한 필드 추가 설정
            SignInResponseDto response = childService.singUp(signUpRequestDto);
            System.out.println("회원가입 테스트 성공: " + response);
        } catch (Exception e) {
            System.err.println("회원가입 테스트 실패: " + e.getMessage());
        }
    }

    // 소비 계획 생성 테스트
    private void testCreatePlan() {
        try {
            Long childNum = 1L; // 테스트할 아이 ID
            PlanRequestDto planRequestDto = new PlanRequestDto();
            planRequestDto.setShopping(5000);
            planRequestDto.setFood(3000);
            planRequestDto.setSaving(2000);
            // 필요한 필드 추가 설정
            PlanResponseDto response = childService.createPlan(childNum, planRequestDto);
            System.out.println("소비 계획 생성 테스트 성공: " + response);
        } catch (Exception e) {
            System.err.println("소비 계획 생성 테스트 실패: " + e.getMessage());
        }
    }

    // 위시 생성 테스트
    private void testCreateWish() {
        try {
            Long childNum = 1L; // 테스트할 아이 ID
            WishRequestDto wishRequestDto = new WishRequestDto();
            wishRequestDto.setName("New Bike");
            wishRequestDto.setPrice(10000);

            // MockMultipartFile로 가짜 파일 생성
            MultipartFile wishFile = new MockMultipartFile(
                "wishImage",
                "bike.png",
                "image/png",
                "Mock Image Content".getBytes(StandardCharsets.UTF_8)
            );

            WishResponseDto response = childService.createWish(childNum, wishRequestDto, wishFile);
            System.out.println("위시 생성 테스트 성공: " + response);
        } catch (Exception e) {
            System.err.println("위시 생성 테스트 실패: " + e.getMessage());
        }
    }

    // 위시 돈 모으기 테스트
    private void testSavingWish() {
        try {
            Long childNum = 1L; // 테스트할 아이 ID
            Long wishNum = 1L; // 테스트할 위시 ID
            String savingAmt = "5000"; // 모을 금액

            WishResponseDto response = childService.savingWish(childNum, wishNum, savingAmt);
            System.out.println("위시 돈 모으기 테스트 성공: " + response);
        } catch (Exception e) {
            System.err.println("위시 돈 모으기 테스트 실패: " + e.getMessage());
        }
    }
}
