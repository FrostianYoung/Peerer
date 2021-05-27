package com.cloudok.uc.mapping;

import com.cloudok.core.mapping.Mapping;

public class MessageMapping extends Mapping{

	private static final long serialVersionUID = 0L;
	
	public static final Mapping TYPE=new Mapping("type", "t.type");
	
	public static final Mapping CONTENT=new Mapping("content", "t.content");
	
	public static final Mapping THREADID=new Mapping("threadId", "t.thread_id");
	
	public static final Mapping MEMBERID=new Mapping("memberId", "t.member_id");
	
}
