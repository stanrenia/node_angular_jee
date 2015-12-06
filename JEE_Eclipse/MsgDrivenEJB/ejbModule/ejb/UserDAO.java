package ejb;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import entity.UserModelEntity;

/**
 * Session Bean implementation class UserDAO
 */
@Stateless
public class UserDAO implements UserDAOLocal {

	@PersistenceContext
	private EntityManager em;
	
    public UserDAO() {
        // TODO Auto-generated constructor stub
    }

	@Override
	public UserModelEntity create(UserModelEntity user) {
//		em.persist(user);
//		return user;
		if(em.find(UserModelEntity.class, user.getLogin()) == null){
			em.persist(user);
		return user;
		}
		System.out.println("User " + user.getLogin() + " already exist");
		return null;
	}

	@Override
	public UserModelEntity getUser(UserModelEntity user) {
		return em.find(UserModelEntity.class, user.getLogin());
	}
	
	public UserModelEntity checkUser(UserModelEntity user){
		UserModelEntity dbUser = this.getUser(user);
		if(dbUser != null){
			if(dbUser.getPwd().equals(user.getPwd())){
				return dbUser;
			}
			else{
				System.out.println("Password is incorrect");
				return null;
			}
		}
		System.out.println("User " + user.getLogin() + " does not exist");
		return null;
	}
}
