package ejb;

import ejbinterface.MessageReceiverLocal;
import javax.ejb.Stateless;

/**
 * Session Bean implementation class MessageReceiver
 */
@Stateless
public class MessageReceiver implements MessageReceiverLocal {

    /**
     * Default constructor. 
     */
    public MessageReceiver() {
        // TODO Auto-generated constructor stub
    }

}
