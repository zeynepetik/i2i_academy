package com.zeynep;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;

import oracle.jdbc.OracleTypes;

public class DBMSwithOracle{
    private static final String DB_URL = "jdbc:oracle:thin:@localhost:1521/XEPDB1";
    private static final String DB_USER = "system";
    private static final String DB_PASSWORD = "1306";

    public static void main(String[] args) {

        String rawBooks = "Clean Code;Robert Martin|1984;George Orwell|Dune;Frank Herbert|Foundation;Isaac Asimov|The Hobbit;J.R.R. Tolkien";

        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {

            String generatedXml = callBookToXml(conn, rawBooks);
            System.out.println("Generated XML:");
            System.out.println(generatedXml);

            insertBooksFromXml(conn, generatedXml);
            System.out.println("\nBooks inserted successfully.\n");

            System.out.println("Books in database:");
            fetchAllBooks(conn);

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // Calls FUNCTION book_to_xml(book_itself IN VARCHAR2) RETURN VARCHAR2
    private static String callBookToXml(Connection conn, String rawBooks) throws SQLException {
        String sql = "{ ? = call book_to_xml(?) }";
        try (CallableStatement cs = conn.prepareCall(sql)) {
            cs.registerOutParameter(1, Types.VARCHAR);
            cs.setString(2, rawBooks);
            cs.execute();
            return cs.getString(1);
        }
    }

    // Calls PROCEDURE xml_to_book(xml_string IN VARCHAR2)
    private static void insertBooksFromXml(Connection conn, String xml) throws SQLException {
        String sql = "{ call xml_to_book(?) }";
        try (CallableStatement cs = conn.prepareCall(sql)) {
            cs.setString(1, xml);
            cs.execute();
        }
    }

    // Calls PROCEDURE fetch_all_records(p_cursor OUT SYS_REFCURSOR)
    private static void fetchAllBooks(Connection conn) throws SQLException {
        String sql = "{ call fetch_all_records(?) }";
        try (CallableStatement cs = conn.prepareCall(sql)) {
            cs.registerOutParameter(1, OracleTypes.CURSOR);
            cs.execute();

            try (ResultSet rs = (ResultSet) cs.getObject(1)) {
                while (rs.next()) {
                    int id = rs.getInt("id");
                    String title = rs.getString("title");
                    String author = rs.getString("author");
                    System.out.println(id + " - " + title + " - " + author);
                }
            }
        }
    }
}
