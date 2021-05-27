package com.cloudok.uc.po;

import com.cloudok.core.po.PO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessagePO extends PO {

	private static final long serialVersionUID = 490715433984896700L;

	
	private String type;
	
	
	private String content;
	
	
	private Long threadId;
	
	private Long memberId;
	
}
