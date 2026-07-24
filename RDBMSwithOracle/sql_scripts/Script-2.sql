CREATE OR REPLACE PROCEDURE fetch_all_records(p_cursor OUT SYS_REFCURSOR)
IS
BEGIN
	OPEN p_cursor FOR
		SELECT id, title, author FROM Book;
END;
/



