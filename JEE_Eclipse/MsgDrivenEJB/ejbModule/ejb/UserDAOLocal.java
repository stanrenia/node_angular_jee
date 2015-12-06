package ejb;

import javax.ejb.Local;

import entity.UserModelEntity;


@Local
public interface UserDAOLocal {
	public UserModelEntity create(UserModelEntity user);
	public UserModelEntity getUser(UserModelEntity user);
	public UserModelEntity checkUser(UserModelEntity user);
}
