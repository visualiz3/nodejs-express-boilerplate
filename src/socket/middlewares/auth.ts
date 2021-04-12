import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import config from '../../config';

interface MySocket extends Socket {
  decoded: string;
}

export const verifyToken = token => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret, { algorithm: config.jwtAlgorithm });
    return decoded;
  } catch {
    return false;
  }
};

export const verifySocket = (socket: MySocket, next) => {
  if (socket.handshake.query && socket.handshake.query.token) {
    const decoded = verifyToken(socket.handshake.query.token);
    socket.decoded = decoded;
    next();
  } else {
    console.log('mampus kau');
    socket.disconnect();
  }
};
