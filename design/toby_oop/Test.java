package toby_oop;

import java.sql.SQLException;

import oop.src.user.dao.UserDao;
import oop.src.user.domain.User;


public class Test {
    public static void main(String[] args) throws ClassNotFoundException, SQLException {
        UserDao dao = new UserDao();
    
        User user = new User();
        user.setId("Gim");
        user.setName("Gim HJ");
        user.setPassword("1234");

        dao.add(user);

        System.out.println(user.getId() + "등록 성공");
        String id = user.getId();
        System.out.println(id);

        User user2 = dao.get(user.getId());
        System.out.println(user2.getName());
        System.out.println(user2.getPassword());

        System.out.println(user2.getId() + "조회 성공");
    }

}