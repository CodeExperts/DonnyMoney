package com.web.spring.controller;


import java.io.IOException;
import java.util.HashMap;
import java.util.List;


import com.web.spring.entity.Child;
import com.web.spring.entity.Member;
import com.web.spring.entity.Parent;
import com.web.spring.entity.Payment;
import com.web.spring.entity.Quiz;
import com.web.spring.repository.ChildRepository;
import com.web.spring.repository.ParentRepository;
import com.web.spring.security.CustomMemberDetails;
import com.web.spring.entity.Wish;
import com.web.spring.jwt.LoginFilter;

import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.web.spring.dto.child.wish.WishRequestDto;
import com.web.spring.dto.child.wish.WishResponseDto;
import com.web.spring.dto.parent.ParentResponeseDto;
import com.web.spring.dto.SignInResponseDto;
import com.web.spring.dto.SignUpRequestDto;
import com.web.spring.dto.child.FindMyParentDto;
import com.web.spring.dto.child.plan.PlanRequestDto;
import com.web.spring.dto.child.plan.PlanResponseDto;
import com.web.spring.dto.child.point.PointRequestDto;
import com.web.spring.dto.child.quiz.QuizResponseDto;

import com.web.spring.service.ChildService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/children")
@Slf4j
public class ChildController<WishService> { 

	private final ChildService childService;
	//private final WishService wishService;

	//p_num 과 p_name 을 찾는 

/* Child : 회원가입  --------------------------------------------------------------*/
	@PostMapping("/signup")
	public ResponseEntity<?> singUp(@RequestBody SignUpRequestDto sinUpRequestDto ){
		
		SignInResponseDto response = childService.singUp(sinUpRequestDto);

				
		return ResponseEntity.status(HttpStatus.CREATED)
				 			 .body(response);
	}

	@GetMapping("/signup/{id}")
	public String duplicationCheck(@PathVariable String id){
		return childService.duplicateCheck(id);
	}

	@PostMapping("/signup/findMyParent")
	public ParentResponeseDto findMyParent(@RequestBody FindMyParentDto findMyParentDto) {
		
		return childService.findMyParent(findMyParentDto.getName(),findMyParentDto.getPhone());
		
	}


/* Plan : 소비 계획 세우기 --------------------------------------------------------------*/
	@PostMapping("/plans")
	public ResponseEntity<PlanResponseDto> createPlan( @RequestBody PlanRequestDto planRequestDto,@RequestParam  String year,
			@RequestParam  String month) throws NumberFormatException, Exception{
		
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		CustomMemberDetails customMemberDetails = (CustomMemberDetails) authentication.getPrincipal();
		Member m = customMemberDetails.getMember();
//		System.out.println("### getPrincipal : "+ authentication.getPrincipal().toString());
//		System.out.println("### getCredentials : "+ authentication.getCredentials()); //password
//		System.out.println("### getDetails : "+ authentication.getDetails());
//		System.out.println("### getName : "+ authentication.getName()); //userId
//		System.out.println("### getClass : "+ authentication.getClass());
//		
		
//		log.info("customMemberDetails =  {} ,{} ,{}, {} ", m.getId(), m.getName(), m.getRole(), m.getMemberNo());
		PlanResponseDto response = null;
		
		//System.out.println(planRequestDto);
		PlanResponseDto curPlan = childService.showPlan(m.getMemberNum(), 	Integer.parseInt(year), Integer.parseInt(month));
		System.out.println(curPlan);
		if (curPlan == null) {
			response = childService.createPlan( m.getMemberNum(), planRequestDto);
		}else {
		 response = childService.updatePlan(m.getMemberNum(), 	Integer.parseInt(year), Integer.parseInt(month), planRequestDto);
		}
		return ResponseEntity.status(HttpStatus.CREATED)
							 .body(response);
	}
	


	@GetMapping("/show/plans")
	public ResponseEntity<PlanResponseDto> showPlan(	@RequestParam  String year,
														@RequestParam  String month) throws Exception{
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		CustomMemberDetails customMemberDetails = (CustomMemberDetails) authentication.getPrincipal();
		Member m = customMemberDetails.getMember();
		
		
		PlanResponseDto response = childService.showPlan(m.getMemberNum(), 	Integer.parseInt(year), Integer.parseInt(month));


		System.out.println(response);
		
		return ResponseEntity.status(HttpStatus.OK).body(response);
	}
	
//	@PutMapping("/plans/{planNum}")
//	public ResponseEntity<PlanResponseDto>updatePlan (@PathVariable String planNum,
//										@RequestBody PlanRequestDto planRequestDto) throws Exception{
//
//		PlanResponseDto plan = childService.updatePlan(Long.parseLong(planNum), planRequestDto);
//		
//		return ResponseEntity.status(HttpStatus.OK).body(plan);	
//	}

	
/* MGMT  --------------------------------------------------------------*/

	//이번달 소비리스트

	@GetMapping("/payments")
	public ResponseEntity<List<Payment>> showMonthList(	@RequestParam  String year,
														@RequestParam  String month){
	
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		CustomMemberDetails customMemberDetails = (CustomMemberDetails) authentication.getPrincipal();
		Member m = customMemberDetails.getMember();
		
		List<Payment> response = childService.showMonthList(m.getMemberNum(), Integer.parseInt(year), Integer.parseInt(month));

		System.out.println(response);

		return ResponseEntity.status(HttpStatus.OK).body(response);
	}

	//이번달 소비리스트

	@GetMapping("/payments/chart")
	public ResponseEntity<HashMap<String, Integer>> showMonthChart(@RequestParam  String year,
																	@RequestParam  String month){
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		CustomMemberDetails customMemberDetails = (CustomMemberDetails) authentication.getPrincipal();
		Member m = customMemberDetails.getMember();
		
		HashMap<String, Integer> response = childService.showMonthChart(m.getMemberNum(), Integer.parseInt(year), Integer.parseInt(month));
		System.out.println(response);

		return ResponseEntity.status(HttpStatus.OK).body(response);
	}

	/*이달의 계획 내역 도넛차트*/

	@GetMapping("/plan/chart")
	public ResponseEntity<HashMap<String, Integer>> monthPlan(@RequestParam String year,
									   							@RequestParam String month) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		CustomMemberDetails customMemberDetails = (CustomMemberDetails) authentication.getPrincipal();
		Member m = customMemberDetails.getMember();
		HashMap<String, Integer> response = childService.monthPlan(m.getMemberNum() ,Integer.parseInt(year), Integer.parseInt(month));

		return ResponseEntity.status(HttpStatus.OK).body(response);
	}
	
	
	//포인트 조회
	@GetMapping("/get/point")
	public ResponseEntity<Integer> showPoint(){

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		CustomMemberDetails customMemberDetails = (CustomMemberDetails) authentication.getPrincipal();
		Member m = customMemberDetails.getMember();
		int response = childService.showPoint(m.getMemberNum());

		return ResponseEntity.status(HttpStatus.OK)
							.body(response);
	}
	
	//포인트 업데이트
	@PutMapping("/update/point")
	public ResponseEntity<Integer> updatePoint(@RequestBody PointRequestDto request){
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		CustomMemberDetails customMemberDetails = (CustomMemberDetails) authentication.getPrincipal();
		Member m = customMemberDetails.getMember();
		int response = childService.updatePoint(m.getMemberNum(), request.getPoint());
		return ResponseEntity.status(HttpStatus.OK).body(response);

	}
	
/* WISH -------------------------------------------------------------------------*/
	//위시 등록하기
	@PostMapping(value = "/wishes", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
	public ResponseEntity<?> createWish(@RequestParam("wishRequestDtoJson") String wishRequestDtoJson, @RequestPart("wishFile") MultipartFile wishFile) throws IOException{
		
        // wishRequestDtoJson을 DTO로 변환
        ObjectMapper objectMapper = new ObjectMapper();
        WishRequestDto wishRequestDto = objectMapper.readValue(wishRequestDtoJson, WishRequestDto.class);
        
        // DTO 변환이 제대로 되었는지 확인
        if (wishRequestDto == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            					.body("Invalid wish request data.");
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		CustomMemberDetails customMemberDetails = (CustomMemberDetails) authentication.getPrincipal();
		Member m = customMemberDetails.getMember();
        // wish 를 생성
		WishResponseDto wish =  childService.createWish(m.getMemberNum(), wishRequestDto, wishFile);
		
		return ResponseEntity.status(HttpStatus.CREATED)
				 			 .body(wish);
	}	
	
	//위시 전체리스트 조회(Active)

	@GetMapping("/wishes/active")
	public ResponseEntity<List<Wish>> showActiveWishList(){
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		CustomMemberDetails customMemberDetails = (CustomMemberDetails) authentication.getPrincipal();
		Member m = customMemberDetails.getMember();
		List<Wish> wishList = childService.showActiveWishList(m.getMemberNum());

		
		return ResponseEntity.status(HttpStatus.OK)
				 			 .body(wishList);
	}
	
	//위시 전체리스트 조회(Finished)
	@GetMapping("/wishes/finished")
	public ResponseEntity<List<Wish>> showFinishedWishList(){
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		CustomMemberDetails customMemberDetails = (CustomMemberDetails) authentication.getPrincipal();
		Member m = customMemberDetails.getMember();
		List<Wish> wishList = childService.showFinishedWishList(m.getMemberNum());
		
		return ResponseEntity.status(HttpStatus.OK)
				 			 .body(wishList);
	}
	
	//위시 상세보기
	@GetMapping("/wishes/{wishNum}")
	public ResponseEntity<WishResponseDto> showWishDetail(@PathVariable String wishNum){
		WishResponseDto response = childService.showWishDetail(wishNum);
		
		return ResponseEntity.status(HttpStatus.OK)
	 			 .body(response);
	}	
	
	//위시 돈모으기 
	@PutMapping("/saving/wishes")
	public ResponseEntity<WishResponseDto> savingWish(@RequestParam String wishNum,
										@RequestParam String savingAmt){
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		CustomMemberDetails customMemberDetails = (CustomMemberDetails) authentication.getPrincipal();
		Member m = customMemberDetails.getMember();
		Long wishNo= Long.parseLong(wishNum);
		WishResponseDto wish =childService.savingWish(m.getMemberNum(), wishNo, savingAmt);
		
		return ResponseEntity.status(HttpStatus.OK)
				 			 .body(wish);
	}
	
	//위시 삭제하기
	@DeleteMapping("/wishes/{wishNum}")
	public ResponseEntity<List<Wish>> deleteWish(@PathVariable String wishNum) throws IOException{
		
		Long wishNo= Long.parseLong(wishNum);
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		CustomMemberDetails customMemberDetails = (CustomMemberDetails) authentication.getPrincipal();
		Member m = customMemberDetails.getMember();
		List<Wish> wishList = childService.deleteWish(m.getMemberNum(),wishNo);
		
		return ResponseEntity.status(HttpStatus.OK)
	 			 .body(wishList);
	}

	
/* Quiz : 퀴즈 ----------------------------------------------------------------------------*/	
	/*아이의 퀴즈 결과 보여주기	*/
	@GetMapping("/show/quiz")
	public ResponseEntity<HashMap<String, Integer>> showQuizResult(){
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		CustomMemberDetails customMemberDetails = (CustomMemberDetails) authentication.getPrincipal();
		Member m = customMemberDetails.getMember();
		HashMap<String, Integer> response = childService.showQuizResult(m.getMemberNum());

		return ResponseEntity.status(HttpStatus.OK)
				.body(response);
	}
	
	
	/*아이의 퀴즈 결과를 top3로 나눠서 보여주기*/
	@GetMapping("quiz/top3")
	public ResponseEntity<HashMap<String, Integer>> showQuizResultTop3(){
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		CustomMemberDetails customMemberDetails = (CustomMemberDetails) authentication.getPrincipal();
		Member m = customMemberDetails.getMember();
		HashMap<String, Integer> response = childService.showQuizResultTop3(m.getMemberNum());
		
		return ResponseEntity.status(HttpStatus.OK)
				.body(response);
	}
	
	
	//퀴즈 문제 내기 (각 카테고리 별 문제 1개씩 랜덤)
	@GetMapping("/quiz")
	public ResponseEntity<List<Quiz>> showQuiz() {
		List<Quiz> quizList = childService.showQuiz();
		quizList.stream().forEach(c->System.out.println(c));
	
		return ResponseEntity.status(HttpStatus.OK)
				.body(quizList);
	}
	
	//퀴즈 업데이트
	@PutMapping("/update/quiz")
	public ResponseEntity<?> updateScore(@RequestBody List<QuizResponseDto> quizResponse){
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		CustomMemberDetails customMemberDetails = (CustomMemberDetails) authentication.getPrincipal();
		Member m = customMemberDetails.getMember();
		
		// 헤당 childNum 에 퀴즈 업데이트
		childService.updateQuiz(m.getMemberNum(), quizResponse);
		
		return ResponseEntity.ok(HttpStatus.OK);
  }
	
	
}
