package ejb;

import javax.annotation.Resource;
import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.jms.JMSConsumer;
import javax.jms.JMSContext;
import javax.jms.JMSRuntimeException;
import javax.jms.Topic;

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
	@Resource(mappedName = "java:/jms/watcherAuthJMS") Topic topic;
	
	
    public MessageReceiverSync() {
    	context = context.createContext(JMSContext.SESSION_TRANSACTED);
        // TODO Auto-generated constructor stub
    }

	@Override
	public String receiveMessage() {
		// TODO Auto-generated method stub
		String body = null;
		   try{
		      JMSConsumer consumer = context.createConsumer(topic);
		      body = consumer.receiveBody(String.class);
		   } 
		   catch (JMSRuntimeException ex) {
		      // handle exception (details omitted)
		   }
		   return body;
	}

}