



package com.web.spring.entity;

import java.util.ArrayList;
import java.util.List;

import com.web.spring.global.audit.Auditable;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
public class Parent  extends Auditable{


    @Id
    @Column(name = "parent_num")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long parentNum;
    
    @Column(unique = true)
    private String id;
    private String pwd;
    private String name;
    private String birthdate;
    private String phone;
    private String email;
    private String address;
    private String role;
    

	@OneToMany(mappedBy = "parent", fetch = FetchType.LAZY , cascade = {CascadeType.PERSIST})
	private List<Child> children = new ArrayList<>();

	@OneToMany(fetch = FetchType.LAZY , cascade = {CascadeType.PERSIST, CascadeType.REMOVE})
	@JoinColumn(name = "parent_num")
	private List<PointOrder> orders = new ArrayList<>();

}