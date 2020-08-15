package toby_oop.user.dao;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DaoFactory {
    @Bean
    public UserDao userDao() {
        return new UserDao(connectionMaker());
    }


    // public AccounntDao accounntDao() {
    //     return new AccounntDao(connectionMaker());
    // }


    // public MessageDao messageDao() {
    //     return new MessageDao(connectionMaker());
    // }


    @Bean
    public ConnectionMaker connectionMaker() {
        // return new OracleConnectionMaker();
        // return new MySQLConnectionMaker();
        return new MSConnectionMaker();
    }
}