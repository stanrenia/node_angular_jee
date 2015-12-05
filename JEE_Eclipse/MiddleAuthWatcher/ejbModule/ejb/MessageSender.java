package ejb;

import javax.annotation.Resource;
import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.jms.JMSContext;
import javax.jms.JMSRuntimeException;
import javax.jms.Topic;

import common.UserModel;

import ejb_interfaces.MessageSenderLocal;

/**
 * Session Bean implementation class MessageSender
 */
@Stateless
public class MessageSender implements MessageSenderLocal{

	@Inject JMSContext context;
	@Resource(mappedName = "java:/jms/watcherAuthJMS") Topic topic;

	@Override
	public void sendMessage(String message) {
		try{
		      context.createProducer().send(topic, message);
		   } 
		catch (JMSRuntimeException ex) {
		      // handle exception (details omitted)
			System.out.println("Error on JMS sendMessage()");
		   }
	}
	
	@Override
	public void sendMessage(UserModel user) {
		try{
		      context.createProducer().send(topic, user);
		   } 
		catch (JMSRuntimeException ex) {
		      // handle exception (details omitted)
			System.out.println("Error on JMS sendMessage()");
		   }
	}
}