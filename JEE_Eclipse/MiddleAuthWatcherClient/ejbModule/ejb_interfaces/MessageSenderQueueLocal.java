package ejb_interfaces;

import common.UserModel;

public interface MessageSenderQueueLocal {
	public void sendMessage(String message);
	public void sendMessage(UserModel user);
}
