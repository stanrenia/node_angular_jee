package model;

import common.UserModel;
import entity.UserModelEntity;

public class DataContainer {
	
	private UserModel bob = new UserModel("jdoe", "pwd", "john", "doe", "admin");

	public Boolean checkUser(UserModel user) {
		Boolean isValid = false;
		if(bob.getLogin().equals(user.getLogin())){
			System.out.println("Same login");
			if(bob.getPwd().equals(user.getPwd())){
				System.out.println("Same Pwd!");
				isValid = true;
			}
			else{
				System.out.println("Wrong PWD");
			}
		}
		else{
			System.out.println("Wrong Login");
		}
		
		return isValid;
	}
	
	public UserModel EntityToModel(UserModelEntity userE){
		UserModel user = new UserModel(userE.getLogin(), userE.getPwd(), userE.getPrenom(), userE.getNom(), userE.getRole());
		return user;
	}
	
	public UserModelEntity ModelToEntity(UserModel user){
		UserModelEntity userE = new UserModelEntity();
		userE.setUserData(user.getLogin(), user.getPwd(), user.getPrenom(), user.getNom(), user.getRole());
		return userE;
	}
	
}
