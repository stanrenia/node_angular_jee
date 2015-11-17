package ejb;

import common.UserModel;

public interface MessageSenderLocal {
	public void sendMessage(String message);
	public void sendMessage(UserModel user);
}
