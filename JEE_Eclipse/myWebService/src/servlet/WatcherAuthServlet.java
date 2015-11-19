package servlet;

import model.UserModel;

import java.io.IOException;
import java.io.PrintWriter;

import javax.ejb.EJB;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import ejb_interfaces.MessageReceiverSyncLocal;
import ejb_interfaces.MessageSenderLocal;

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
    /**
     * @see HttpServlet#HttpServlet()
     */
    public WatcherAuthServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		System.out.println("aaa!!!aaaa!!!");
		response.sendRedirect("./index.html");
		sender.sendMessage("Test JMS izi");
		System.out.println(receiver.receiveMessage());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("REQ: " + request.getInputStream());
        String jsonString = IOUtils.toString(request.getInputStream());
        System.out.println("json String:" + jsonString);
		JSONObject jsonObj;
		//try {
		jsonObj = (JSONObject)JSONValue.parse(jsonString);
		
		String login = (String) jsonObj.get("login");
		String pwd = (String) jsonObj.get("pwd");
        System.out.println("json data - login: " + login +" pwd: " + pwd);

        JSONObject jsonToSend = new JSONObject();
        response.setHeader("Access-Control-Allow-Origin", "*");
        UserModel user;
        Boolean validAuth = false;
        if(jdoe.getLogin().equals(login) && jdoe.getPwd().equals(pwd)){
        	user = jdoe;
        	System.out.println(user);
        	validAuth = true;
        	jsonToSend.put("login", user.getLogin());
        	jsonToSend.put("validAuth", validAuth);
        	jsonToSend.put("role", user.getRole());
        }
        else {
        	System.out.println("No user matched");
        	jsonToSend.put("login", "");
        	jsonToSend.put("role", "");
        	jsonToSend.put("validAuth",validAuth);
        }

        System.out.println("json To Send: " + jsonToSend);
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        out.println(jsonToSend.toString());
        out.close();
		//}
		/* catch (ParseException e) {
			System.out.println("Error try catch");
			e.printStackTrace();
		}*/
	}

}
