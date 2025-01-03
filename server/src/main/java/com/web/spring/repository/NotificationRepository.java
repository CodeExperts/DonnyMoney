package com.web.spring.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.web.spring.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {	
	// Child의 알림 조회
	@Query(value = "SELECT n FROM Notification n WHERE n.child.childNum = :childNum AND n.senderType = :senderType ORDER BY notiNum DESC")
	List<Notification> getNotificationsForChild(@Param("childNum")Long id, @Param("senderType") String senderType);

	// Parent의 알림 조회
	@Query(value = "SELECT n FROM Notification n WHERE n.parent.parentNum = :parentNum And n.senderType = :senderType ORDER BY notiNum desc")
	List<Notification> getNotificationsForParent(@Param("parentNum")Long id, @Param("senderType")String senderType);
	
	// parent_num 조회
	@Query(value = "SELECT c.parent.parentNum FROM Child c WHERE c.childNum = :childNum")
	Long getParentNum(@Param("childNum")Long id);
	
	// 알림 읽음 업데이트
	@Modifying
	@Query(value = "UPDATE Notification n SET n.isRead = true WHERE n.notiNum = :notiNum")
	void updateRead(@Param("notiNum")Long notiNum);
}
