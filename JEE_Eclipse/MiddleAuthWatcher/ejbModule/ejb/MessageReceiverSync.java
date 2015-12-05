package ejb;

import javax.annotation.Resource;
import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.jms.JMSConsumer;
import javax.jms.JMSContext;
import javax.jms.JMSException;
import javax.jms.JMSRuntimeException;
import javax.jms.Message;
import javax.jms.ObjectMessage;
import javax.jms.Queue;
import javax.jms.TextMessage;

import common.UserModel;

import ejb_interfaces.MessageReceiverSyncLocal;

/**
 * Session Bean implementation class MessageReceiverSync
 */
@Stateless
public class MessageReceiverSync implements MessageReceiverSyncLocal{

    /**
     * Default constructor. 
     */
	@Inject JMSContext context;
	@Resource(mappedName = "java:/jms/queue/watcherqueue") Queue queue;
	
	@Override
	public UserModel receiveMessage() {
	   UserModel userReceive = null;
	   try{
	      JMSConsumer consumer = context.createConsumer(queue);
	      Message m = consumer.receive(1000); 
	      if (m != null) { 
	          if (m instanceof TextMessage) { 
	              System.out.println(
	                      "(MessageReceive) Reading message: " + m.getBody(String.class));
	          } 
	          else if(m instanceof ObjectMessage){ 
	            ObjectMessage msg = (ObjectMessage) m;
	            if( msg.getObject() instanceof UserModel){
					userReceive = (UserModel)msg.getObject();
					System.out.println("(MessageReceive) User Details: " + userReceive.toString());
				}
	            else{
					System.out.println("(MessageReceive) Object Message is not a UserModel class");
	            }
			} else {
				System.out.println("(MessageReceive) Not valid message for this Queue MDB");
			}
          }
	      else{
				System.out.println("(MessageReceive) m is null");
	      }
	   } 
	   catch (JMSRuntimeException | JMSException ex) {
	      // handle exception (details omitted)
	   }
	   return userReceive;
	}

}