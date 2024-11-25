package com.web.spring.service;

import java.io.File;
import java.io.IOException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.AmazonClientException;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@Service
@RequiredArgsConstructor
public class S3Service {

	private final AmazonS3Client amazonS3Client;
	
	//버킷 이름 동적 할당
	@Value("${cloud.aws.s3.bucket}")
	private String bucket;
	
	//버킷 주소 동적 할당
	@Value("${cloud.aws.s3.bucket.url}")
	private String defaultUrl;
	
	//버킷 주소 동적 할당
	@Value("${cloud.aws.region.static}")
	private String region;
	
	@Value("${cloud.aws.s3.folder}")
	private String folderPath;

	// MultipartFile : 파일의 이름과 실제 데이터, 파일 크기 등을 구할 수 있는 인터페이스
	public String upload(MultipartFile uploadFile) throws IOException{	

		String origName = uploadFile.getOriginalFilename();
		String encodedName = URLEncoder.encode(origName, "UTF-8").replace("+", "%20");
		String getUUID = UUID.randomUUID().toString().replace("-", "");
		
		// 파일 이름 중복 방지
		String addUUIDName = getUUID + encodedName; 
		
	    // 최종 파일 경로 (폴더 포함)
	    String s3Key = folderPath + addUUIDName;
		
		// MultipartFile 전달받아 임시파일을 만들고 File로 convert 후 S3에 업로드
		File file = File.createTempFile("temp_", "_" + encodedName);
		uploadFile.transferTo(file);
		
		//필요하면 사용하기
//		ObjectMetadata metadata = new ObjectMetadata();
//		metadata.setContentLength(uploadFile.getSize());
//		metadata.setContentType(uploadFile.getContentType());
		
		try {
			// S3에 파일 업로드
			amazonS3Client.putObject(bucket, s3Key, file);
			// 업로드된 파일 URL 생성
			String fileUrl = amazonS3Client.getResourceUrl(bucket, s3Key);
			return fileUrl;
		} catch (AmazonClientException e) {
			log.error("File upload Failed",e);
			throw new IOException("File upload Failed",e);
		}finally {
			// 임시 파일 삭제하기
			if(file.exists()) file.delete();
		}
	}
	
	
	// MultipartFile : 파일의 이름과 실제 데이터, 파일 크기 등을 구할 수 있는 인터페이스
	// MultipartFile 전달받아 File로 convert 후 S3에 업로드
	public String delete(String fileName) throws IOException{	
		
		String oldChar = "https://s3.ap-northeast-2.amazonaws.com/donnymoney/"+ folderPath;
		String s3FileName = URLDecoder.decode(fileName.replace(oldChar, ""),"UTF-8");
		
		log.info("DeleteFileName:: "+ s3FileName);
		amazonS3Client.deleteObject(bucket, folderPath+s3FileName);
		
		// 이미지 삭제여부 확인 
	    if (!amazonS3Client.doesObjectExist(bucket, folderPath+fileName)) {
	        return "Delete :: Success";
	    } else {
	        return "Delete :: Failed";
	    }
	}
}
