package toby_oop;

import java.sql.SQLException;

import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import toby_oop.user.dao.DaoFactory;
import toby_oop.user.dao.UserDao;
import toby_oop.user.domain.User;


public class Test {
    public static void main(String[] args) throws ClassNotFoundException, SQLException {
        ApplicationContext context = new AnnotationConfigApplicationContext(DaoFactory.class);
        UserDao dao = context.getBean("userDao", UserDao.class);

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