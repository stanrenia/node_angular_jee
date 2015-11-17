package ejb;

import javax.annotation.Resource;
import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.jms.JMSContext;
import javax.jms.Topic;
import common.UserModel;

/**
 * Session Bean implementation class MessageSender
 */
@Stateless
@LocalBean
public class MessageSender implements MessageSenderLocal{

	@Inject JMSContext context;
	@Resource(mappedName = "java:/jms/watcherAuthJMS") Topic topic;
	
    public MessageSender() {
        // TODO Auto-generated constructor stub
    }

	@Override
	public void sendMessage(String message) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void sendMessage(UserModel user) {
		// TODO Auto-generated method stub
		
	}
}
