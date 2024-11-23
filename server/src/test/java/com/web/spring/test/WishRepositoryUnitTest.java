package com.web.spring.test;

import org.junit.jupiter.api.Test;  

import java.util.List;
import java.util.NoSuchElementException;

import org.junit.jupiter.api.Assertions;  
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.web.spring.entity.Child;
import com.web.spring.entity.IsFinish;
import com.web.spring.entity.Wish;
import com.web.spring.exception.ExceededAmountException;
import com.web.spring.repository.ChildRepository;
import com.web.spring.repository.ParentRepository;
import com.web.spring.repository.WishRepository;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.extension.ExtendWith; 

@SpringBootTest
@Transactional
public class WishRepositoryUnitTest {

    @Autowired
    private ChildRepository childRepository;
    
    @Autowired
    private WishRepository wishRepository;

    @Test
    @DisplayName("위시 생성")
    public void wishCreate() {
        Wish wish = Wish.builder()
                        .img("https://th.bing.com/th/id/OIP.0DsCSYnv9-zstm2UQxwj5wHaHa?w=171&h=180&c=7&r=0&o=5&dpr=2&pid=1.7")
                        .name("iphone16pro")
                        .price(1500000)
                        .isFinish(IsFinish.INCOMPLETE)
                        .build();

        Wish rwish = wishRepository.save(wish);   

        Assertions.assertEquals(wish, rwish); 
        System.out.println("Test executed");
    }
    
     @Test
     @DisplayName("Active 위시 조회")
     public void showActiveWishList() {

    	 List<Wish> wishList = childRepository.showFinishedWishList(1L);
    	 wishList.forEach(c->System.out.println("showActiveWish :: "+c));
    	 
     }
     
//    @Test
//    @DisplayName("위시 돈 모으기")
// 	public void savingWish() {
// 		
// 		// 인자값 미리 파싱
// 		Long parseWishNum = 1L;
// 		int parseSavingAmt = 1000;
// 		int savingResult = 0;
// 		
// 		//토큰에 있는 아이디
// 		Child child = childRepository.findById(1L)
//					 .orElseThrow( () -> new NoSuchElementException("Child with cNum not found"));
//
// 		// children 변경전 포인트
// 		System.out.println("beforeSaving_ChildPoint :: "+child.getPoint());
// 		
// 		//해당하는 위시 가져오기
// 		Wish wish = wishRepository.findById(2L)
// 				  .orElseThrow(() -> new NoSuchElementException("Wish with wishNum " + 1L + " not found"));
// 		int totalSaving = wish.getSavingAmt() + parseSavingAmt;
// 		int wishPrice = wish.getPrice();
// 		
// 		// wish 가격과 totalSaving 이 같다면 -> isFinish == True
// 		if(wishPrice == totalSaving) {
// 			// 변경 완료 여부 확인
// 			savingResult = wishRepository.savingWish(parseWishNum, totalSaving);
// 			wishRepository.isFinish(parseWishNum, IsFinish.COMPLETE);
// 		}else if (wishPrice >= totalSaving) {
// 			// 변경 완료 여부 확인
// 			savingResult = wishRepository.savingWish(parseWishNum, totalSaving);
// 		}else {
// 			throw new ExceededAmountException("모으려는 금액이 price 보다 많습니다.");
// 		}
//
// 		
// 		System.out.println("afterSavingWish :: complete ->"+ savingResult );
// 		Wish rwish = wishRepository.findById(parseWishNum)
// 												.orElseThrow(()-> new NoSuchElementException("Wish with wishNum " + 1L + " not found"));
// 		rwish.setSavingAmt(totalSaving);
// 		System.out.println(rwish);
// 	
// 	}

     
    @Test
 	@DisplayName("위시 삭제하기")
 	public void deleteWish() {
 		
 			Child child = childRepository.findById(1L)
					 .orElseThrow( () -> new NoSuchElementException("Child with cNum not found"));

 			//해당하는 위시 가져오기
 			Wish wish =  wishRepository.findById(1L)
 					  .orElseThrow(() -> new NoSuchElementException("Wish with wishNum " + 1L + " not found"));

 			int curPoint = child.getPoint();
 			System.out.println("beforeDeleteWish_Child :: "+curPoint);
 			
 			// 현재까지 모은 금액
 			int curSaving = wish.getSavingAmt();
 			
 			// 변경된 포인트
 			child.setPoint(curPoint + curSaving);
 		
 			wishRepository.deleteById(1L);
 			childRepository.showActiveWishList(child.getChildNum())
 							.forEach( (w) -> System.out.println(w));
 			
 			
 	}
 	
 	

}
