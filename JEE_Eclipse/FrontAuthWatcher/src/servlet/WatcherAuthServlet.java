package servlet;

import common.UserModel;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Enumeration;

import javax.ejb.EJB;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

import ejb.UserDAOLocal;
import ejb_interfaces.MessageReceiverSyncLocal;
import ejb_interfaces.MessageSenderLocal;
import entity.UserModelEntity;

/**
 * Servlet implementation class WatcherAuthServlet
 */
@WebServlet("/WatcherAuth")
public class WatcherAuthServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
    private UserModel jdoe = new UserModel("jdoe", "jdoepwd", "john", "doe", "admin");  
    
	@EJB
	MessageSenderLocal sender;
	
	@EJB
	MessageReceiverSyncLocal receiver;
	
    public WatcherAuthServlet() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.sendRedirect("index.html");
		
		// Working example:
//		UserModel user = new UserModel("popo", "aaa", "dou", "bou", "watcher");
//		sender.sendMessage(user);
//		UserModel userR = receiver.receiveMessage();
//		System.out.println("Servlet Receiving msg: " + userR);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String jsonString = IOUtils.toString(request.getInputStream());
		System.out.println("(Servlet) Request string " + jsonString);
        JSONObject jsonToSend = new JSONObject();
        UserModel user = getUserFromRequest(jsonString);
        if (user != null){
            System.out.println("(Servlet) User from request: " + user.toString());
        	sender.sendMessage(user);
    		UserModel userR = receiver.receiveMessage();
    		System.out.println("(Servlet) Receiving msg: " + userR);
    		if(userR != null){
    			jsonToSend.put("login", userR.getLogin());
    			jsonToSend.put("validAuth", true);
            	jsonToSend.put("role", userR.getRole());
    		}
    		else{
    			jsonToSend = makeDefaultResponse();
    		}
        }
        else{
			jsonToSend = makeDefaultResponse();
        }
        
        System.out.println("(Servlet) JSON To Send: " + jsonToSend);
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        out.println(jsonToSend.toString());
        out.close();
	}

	private UserModel getUserFromRequest(String req){
		UserModel user = new UserModel("", "", "", "", "");
		if(req.contains("&")){
			String[] paramsplit = req.split("&");
			for(String params : paramsplit){
				String[] param = params.split("=");

				if("login".equals(param[0])){
					user.setLogin(param[1]);
				}
				else if("pwd".equals(param[0])){
					user.setPwd(param[1]);
				}
			}
		}
		if("".equals(user.getLogin()) || "".equals(user.getPwd())){
			return null;
		}
		return user;
	}
	
	private JSONObject makeDefaultResponse(){
        JSONObject jsonToSend = new JSONObject();
        jsonToSend.put("login", "");
		jsonToSend.put("validAuth", false);
    	jsonToSend.put("role", "");
    	return jsonToSend;
	}
	
}
