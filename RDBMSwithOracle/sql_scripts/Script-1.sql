CREATE OR REPLACE PROCEDURE xml_to_book(xml_string IN varchar2)
IS
BEGIN
	INSERT INTO Book(id, title,author)
	SELECT id, title, author
	FROM xmltable('/books/book' 
		passing xmltype(xml_string)
		COLUMNS	
			id NUMBER PATH 'id',
			title varchar2(127) PATH 'title',
			author varchar2(127) PATH 'author'
	);
COMMIT;
END;
/
