package com.web.spring.controller;

import com.web.spring.dto.SignInResponseDto;
import com.web.spring.dto.SignUpRequestDto;
import com.web.spring.dto.child.plan.PlanResponseDto;
import com.web.spring.dto.parent.ParentReportResponseDto;
import com.web.spring.dto.parent.PostPointOrderRequestDto;
import com.web.spring.dto.parent.PointOrderResponseDto;
import com.web.spring.dto.parent.ChildResponseDto;
import com.web.spring.dto.parent.ChildRequestDto;

import com.web.spring.entity.Child;
import com.web.spring.entity.PointOrder;
import com.web.spring.entity.Wish;
import com.web.spring.security.CustomMemberDetails;
import com.web.spring.service.ChildService;
import com.web.spring.service.ParentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/parents")
public class ParentController {

    private final ChildService childService;
    private final ParentService parentService;
    
    public Long getParentNumByToken() {
    	Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    	CustomMemberDetails customMemberDetails = (CustomMemberDetails) authentication.getPrincipal();
		
    	return customMemberDetails.getMember().getMemberNum();
    }
    
    /* 회원가입 */
	@PostMapping("/signup")
	public ResponseEntity<SignInResponseDto> singUp(@RequestBody SignUpRequestDto childRequestDto){
		
		SignInResponseDto response = parentService.singUp(childRequestDto);
				
		return ResponseEntity.status(HttpStatus.CREATED)
				 			 .body(response);
	}

	@GetMapping("/signup/{id}")
	public String duplicationCheck(@PathVariable String id){
		return parentService.duplicateCheck(id);
	}
	

	/* 부모의 모든 자식 가져오기 */
    @GetMapping("/findChildren")
    public ResponseEntity<List<ChildResponseDto>> getChildren(){
    	
		Long parentNum = getParentNumByToken();
    	
        List<ChildResponseDto> children = parentService.findParentChildren(parentNum);
        
        return ResponseEntity.status(HttpStatus.OK).body(children);
    }

    /* 월간 리포트 */
    @GetMapping("/reports")
    @CrossOrigin
    public ResponseEntity<ParentReportResponseDto> getChildReports(@RequestParam Long childNum,
    																@RequestParam int year,
    																@RequestParam int month){

    	Long parentNum = getParentNumByToken();
		
        Child child = parentService.findParentChild(parentNum, childNum);

        ParentReportResponseDto reponse = parentService.getChildReport(child, year, month);
        
        return ResponseEntity.status(HttpStatus.OK).body(reponse);
    }

    /* 용돈 계약서 */
    @GetMapping("/contracts")
    public ResponseEntity<PlanResponseDto> getContracts(@RequestParam Long childNum,
														@RequestParam int year,
														@RequestParam int month) throws Exception{ 


    	Long parentNum = getParentNumByToken();
		
        Child child = parentService.findParentChild(parentNum, childNum);


        PlanResponseDto  planResponseDto = childService.showPlan( child.getChildNum(), year, month);

        return ResponseEntity.status(HttpStatus.OK).body(planResponseDto);
    }


    /* 위시 리스트 */
    @PostMapping("/wishes")
    public ResponseEntity<List<Wish>> getWishes(@RequestBody Map<String, Long> data){
    	
    	Long parentNum = getParentNumByToken();
		
    	Long childNum = data.get("childNum");
        Child child = parentService.findParentChild(parentNum, childNum);

        List<Wish> wishes =childService.showActiveWishList(child.getChildNum());

        return ResponseEntity.status(HttpStatus.OK).body(wishes);
    }
    
    
    /* 포인트 결제*/
    @PostMapping("/orders")
    public ResponseEntity<PointOrderResponseDto> creatPointOrders(@RequestBody PostPointOrderRequestDto pointOrderRequestDto ){
    	
    	Long parentNum = getParentNumByToken();
    	
    	PointOrderResponseDto pointOrder = parentService.createPointOrders(parentNum, pointOrderRequestDto);
    	return ResponseEntity.status(HttpStatus.OK).body(pointOrder);
    	
    }
    
    
    /* 포인트 결제 내역 전체 보기*/
    @GetMapping("/orders")
    public ResponseEntity<List<PointOrder>> getPointOrders(@RequestParam Long childNum,
															@RequestParam int year,
															@RequestParam int month){
    	Long parentNum = getParentNumByToken();
    	
    	List<PointOrder> pointOrders = parentService.getPointOrders(parentNum, childNum, year, month);
    	
    	return ResponseEntity.status(HttpStatus.OK).body(pointOrders); 
    	
    }

}
