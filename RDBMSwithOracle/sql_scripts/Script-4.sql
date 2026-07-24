CREATE OR REPLACE PACKAGE BODY SYSTEM.ORACLE_ODEV IS 
BEGIN 
	PROCEDURE fetch_all_records(p_cursor OUT sys_refcursor)
IS
BEGIN
	OPEN p_cursor FOR
		SELECT id, title, author FROM Book;
END fetch_all_records;
/
END ORACLE_ODEV;
