import config from '../config';
import socket from '../socket';

const SocketServer = async ({ httpServer }) => {
  const socketIO = await socket(httpServer);

  socketIO.listen(config.socketPort);
};

export default SocketServer;
