import { Server } from 'socket.io';
import Logger from '../loaders/logger';
import amqplib from 'amqplib';
import { verifySocket } from './middlewares/auth';

export default async httpServer => {
  const io = new Server(httpServer, {
    cors: { origin: '*' },
  });

  // Our auth middleware
  io.use(verifySocket);

  io.on('connection', socket => {
    Logger.info(`A client connected! Info below :`);
    console.dir(socket);
    socket.emit('connected', 'Connected to test server');
    socket.on('test', msg => {
      console.log(msg);
    });
    socket.on('disconnect', reason => {
      Logger.debug(`A client disconnected due to : ${reason}`);
    });
  });

  // const exchange = 'notificationExchange';
  // const key = 'notification'; //gatewayId

  // const amqp = await amqplib.connect('amqp://api:HomeRevon123@128.199.177.166');
  // const channel = await amqp.createChannel();

  // await channel.assertExchange(exchange, 'direct', { durable: false });
  // const q = await channel.assertQueue('', { exclusive: false });

  // channel.bindQueue(q.queue, exchange, key);

  // channel.consume(
  //   q.queue,
  //   msg => {
  //     Logger.debug(`${msg.content.toString()}`);
  //   },
  //   { noAck: false },
  // );

  return io;
};
