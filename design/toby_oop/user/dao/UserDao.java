package toby_oop.user.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

// MS SQL 연동 sqljdbc42.jar
// https://xzio.tistory.com/73


import oop.src.user.domain.User;


public abstract class UserDao {
    public void add(User user) throws ClassNotFoundException, SQLException {
        Connection c = getConnection();

        PreparedStatement ps = c.prepareStatement(
            "insert into users(id, name, password) values (?,?,?)"
        );
        ps.setString(1, user.getId());
        ps.setString(2, user.getName());
        ps.setString(3, user.getPassword());

        ps.executeUpdate();

        ps.close();
        c.close();
    }


    public User get(String id) throws ClassNotFoundException, SQLException {
        Connection c = getConnection();

        PreparedStatement ps = c.prepareStatement(
            "select * from users where id = ?"
        );
        ps.setString(1, id);

        ResultSet rs = ps.executeQuery();
        rs.next();
        User user = new User();
        user.setId(rs.getString("id"));
        user.setName(rs.getString("name"));
        user.setPassword(rs.getString("password"));

        rs.close();
        ps.close();
        c.close();

        return user;
    }


    public abstract Connection getConnection() throws ClassNotFoundException, SQLException;
}

public abstract class MSUserDAO extends UserDao {
    public abstract Connection getConnection() throws ClassNotFoundException, SQLException;
        Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
        Connection c = DriverManager.getConnection(
            "jdbc:sqlserver://localhost:1433;database=toby;", "sa", "1234"
        );

        return c;
    }
}