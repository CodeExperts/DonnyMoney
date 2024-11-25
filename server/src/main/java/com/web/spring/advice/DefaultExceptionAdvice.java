//package com.web.spring.advice;
//
//
//import org.springframework.http.ProblemDetail;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//import org.springframework.web.bind.annotation.RestControllerAdvice;
//
//import com.web.spring.exception.DMLException;
//import com.web.spring.exception.NoSearchException;
//import com.web.spring.exception.NotEnoughPointsException;
//
////모든 예외를 전역적으로 처리하는 어드바이스
//@RestControllerAdvice
//public class DefaultExceptionAdvice {
//	
//	@ExceptionHandler(DMLException.class)
//	public ProblemDetail dMLExceptionHandle(DMLException e) {
//		ProblemDetail problemDetail = ProblemDetail.forStatus(e.getHttpStatus().value());
//		problemDetail.setTitle("DML Error");
//		problemDetail.setDetail(e.getMessage());
//		return problemDetail;
//		
//	}
//	
//	@ExceptionHandler(Exception.class)
//	public ProblemDetail exceptionHandle(Exception e) {
//		ProblemDetail problemDetail = ProblemDetail.forStatus(500);
//		problemDetail.setTitle("DB Error");
//		problemDetail.setDetail("Server 작업중 문제가 발생하였습니다."+ e.getMessage());
//		return problemDetail;		
//	}
//	
//	@ExceptionHandler(NoSearchException.class)
//	public ProblemDetail NoSearchExceptionHandle(NoSearchException e ) {
//		ProblemDetail problemDetail = ProblemDetail.forStatus(e.getHttpStatus().value());
//		problemDetail.setTitle("NoSerach Error");
//		problemDetail.setDetail("데이터를 찾을 수 없습니다."+ e.getMessage());
//		return problemDetail;
//	}
//	
//	@ExceptionHandler(NotEnoughPointsException.class)
//	public ProblemDetail NotEnoughPointsException(NotEnoughPointsException e ) {
//		ProblemDetail problemDetail = ProblemDetail.forStatus(500);
//		problemDetail.setTitle("NotEnoughPoints ");
//		problemDetail.setDetail("잔액이 부족합니다.");
//		return problemDetail;
//	}
//
//}
//
//
