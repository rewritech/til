package toby_oop.user.dao;

public class DaoFactory {
    public UserDao userDao() {
        // ConnectionMaker connectionMaker = new OracleConnectionMaker();
        // ConnectionMaker connectionMaker = new MySQLConnectionMaker();
        ConnectionMaker connectionMaker = new MSConnectionMaker();
        UserDao userDao = new UserDao(connectionMaker);

        return userDao;
    }
}