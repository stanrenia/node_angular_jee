package common;

import java.io.Serializable;

public class UserModel implements Serializable {

	private String login;
	private String pwd;
	private String nom;
	private String prenom;
	private String role;
	
	public UserModel(String login, String pwd, String nom, String prenom,
			String role) {
		super();
		this.login = login;
		this.pwd = pwd;
		this.nom = nom;
		this.prenom = prenom;
		this.role = role;
	}
	
	public String getLogin() {
		return login;
	}
	public void setLogin(String login) {
		this.login = login;
	}
	public String getPwd() {
		return pwd;
	}
	public void setPwd(String pwd) {
		this.pwd = pwd;
	}
	public String getNom() {
		return nom;
	}
	public void setNom(String nom) {
		this.nom = nom;
	}
	public String getPrenom() {
		return prenom;
	}
	public void setPrenom(String prenom) {
		this.prenom = prenom;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	
	@Override
	public String toString() {
		return "UserModel [login=" + login + ", pwd=" + pwd + ", nom=" + nom
				+ ", prenom=" + prenom + ", role=" + role + "]";
	}
}
