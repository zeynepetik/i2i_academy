CREATE OR REPLACE FUNCTION book_to_xml(book_itself IN varchar2)
RETURN varchar2
IS 
	v_result varchar(4000):='<books>';
	v_book_token varchar2(4000);
	v_title varchar2(127);
	v_id NUMBER:=1;
	v_author varchar2(127);
	v_book_count NUMBER;
BEGIN
	--number of books
	v_book_count:=regexp_count(book_itself, '\|')+1;
	FOR b IN 1..v_book_count LOOP
		v_book_token:=regexp_substr(book_itself, '[^|]+', 1,b);
		
		v_title:=regexp_substr(v_book_token,'[^;]+',1,1);
		v_author:=regexp_substr(v_book_token, '[^;]+',1,2);
		
		--build the xml structure
		v_result:=v_result || '<book>' || 
				'<id>' || v_id || '</id>'||
				'<title>' || v_title || '</title>'||
				'<author>' || v_author || '</author>'||
				'</book>';
		v_id:=v_id+1; --increase id number
	END LOOP;
		v_result:=v_result || '</books>';
		RETURN v_result;
	
END;
/

