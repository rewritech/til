package toby_oop.user.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;


public class SimpleConnectionMaker {
    public Connection makeNewConnection() throws ClassNotFoundException, SQLException {
        Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
        Connection c = DriverManager.getConnection(
            "jdbc:sqlserver://localhost:1433;database=toby;", "sa", "1234"
        );

        return c;
    }
}