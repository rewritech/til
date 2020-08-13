package toby_oop.user.dao;

public class DaoFactory {
    public UserDao userDao() {
        return new UserDao(connectionMaker());
    }


    // public AccounntDao accounntDao() {
    //     return new AccounntDao(connectionMaker());
    // }


    // public MessageDao messageDao() {
    //     return new MessageDao(connectionMaker());
    // }


    public ConnectionMaker connectionMaker() {
        // return new OracleConnectionMaker();
        // return new MySQLConnectionMaker();
        return new MSConnectionMaker();
    }
}