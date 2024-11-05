package com.web.spring.controller;

import java.time.LocalDate;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.web.spring.dto.child.ChildRequestDto;
import com.web.spring.dto.child.ChlidResponseDto;
import com.web.spring.dto.child.plan.PlanRequestDto;
import com.web.spring.dto.child.plan.PlanResponseDto;
import com.web.spring.service.ChildService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ChildController {

	private final ChildService childService;
	
	
/* Child : 회원가입 */
	@PostMapping("/children")
	public ResponseEntity<?> singUp(@RequestBody ChildRequestDto childRequestDto){
		
		ChlidResponseDto response = childService.singUp(childRequestDto);
		return ResponseEntity.status(HttpStatus.CREATED)
				 			 .body(response);
	}
	
	
/* Plan : 소비 계획 세우기 */
	@PostMapping("/plans")
	public ResponseEntity<?> createPlan( @RequestBody PlanRequestDto planRequestDto) throws Exception{
		
		System.out.println(planRequestDto);
		
		PlanResponseDto response = childService.createPlan(planRequestDto);
		
		return ResponseEntity.status(HttpStatus.CREATED)
							 .body(response);
	}
	

	@GetMapping("/plans")
	public ResponseEntity<?> showPlan(	@RequestParam  String year,
										@RequestParam  String month) throws Exception{
	
		PlanResponseDto response = childService.showPlan(year, month);
		System.out.println(response);
		
		return ResponseEntity.status(HttpStatus.OK).body(response);
	}
	
	
	@PutMapping("/plans/{planNum}")
	public ResponseEntity<?>updatePlan (@PathVariable String planNum, 
										@RequestBody PlanRequestDto planRequestDto) throws Exception{
		
		PlanResponseDto plan = childService.updatePlan(Long.parseLong(planNum), planRequestDto);
		
		return ResponseEntity.status(HttpStatus.OK).body(plan);	
	}
	
	
}