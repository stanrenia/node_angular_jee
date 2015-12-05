package ejb;

import javax.annotation.Resource;
import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.jms.JMSConsumer;
import javax.jms.JMSContext;
import javax.jms.JMSRuntimeException;
import javax.jms.Queue;

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
	public String receiveMessage() {
		// TODO Auto-generated method stub
		String body = null;
		   try{
		      JMSConsumer consumer = context.createConsumer(queue);
		      body = consumer.receiveBody(String.class);
		   } 
		   catch (JMSRuntimeException ex) {
		      // handle exception (details omitted)
		   }
		   return body;
	}

}