package model;

import common.UserModel;

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
	
}
