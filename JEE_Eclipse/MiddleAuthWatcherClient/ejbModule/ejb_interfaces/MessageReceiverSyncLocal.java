package ejb_interfaces;

import javax.ejb.Local;

@Local
public interface MessageReceiverSyncLocal {
	public String receiveMessage();
}
