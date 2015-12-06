package entity;

import java.io.Serializable;
import java.lang.String;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Length;

/**
 * Entity implementation class for Entity: UserModelEntity
 *
 */
@Entity
@Table(name="users")
public class UserModelEntity implements Serializable {

//	private int id;
	
	@Id
	private String login;
	
	@NotNull
	private String pwd;
	private String prenom;
	private String nom;
	private String role;
	private static final long serialVersionUID = 1L;

	public UserModelEntity(){
		super();
	}   
//	public int getId() {
//		return this.id;
//	}
//
//	public void setId(int id) {
//		this.id = id;
//	}   
	public String getLogin() {
		return this.login;
	}

	public void setLogin(String login) {
		this.login = login;
	}   
	public String getPwd() {
		return this.pwd;
	}

	public void setPwd(String pwd) {
		this.pwd = pwd;
	}   
	public String getPrenom() {
		return this.prenom;
	}

	public void setPrenom(String prenom) {
		this.prenom = prenom;
	}   
	public String getNom() {
		return this.nom;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}   
	public String getRole() {
		return this.role;
	}

	public void setRole(String role) {
		this.role = role;
	}
	
	public void setUserData(String log, String pass, String p, String n, String role){
		this.login = log;
		this.pwd = pass;
		this.prenom = p;
		this.nom = n;
		this.role = role;
	}
   
	public String toString(){
		return "UserModelEntity [login=" + login + ", pwd=" + pwd + ", nom=" + nom
				+ ", prenom=" + prenom + ", role=" + role + "]";
	}
}
