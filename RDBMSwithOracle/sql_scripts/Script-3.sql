--TEST
DECLARE
	v_list VARCHAR2(100) := 'A,B,C,D,E';
	v_cursor sys_refcursor;
	v_id Book.id%TYPE;
	v_title Book.title%TYPE;
	v_author Book.author%TYPE;
BEGIN
	 fetch_all_records(v_cursor);
	
	LOOP
		FETCH v_cursor INTO v_id, v_title, v_author;
	EXIT WHEN v_cursor%notfound;
	dbms_output.put_line(v_id || '-' || v_title || '-'|| v_author);
	END LOOP;
	CLOSE v_cursor;
END;
/