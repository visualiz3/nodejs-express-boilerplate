import 'reflect-metadata'; // for use @Decorators for typedi
import config from './config';
import express from 'express';
import Logger from './loaders/logger';
import http from 'http';
import MailerService from './services/mailer';
import Container from 'typedi';

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  /**
   * A little hack here
   * Import/Export can only be used in 'top-level code'
   * Well, at least in node 10 without babel and at the time of writing
   * So we are using good old require.
   **/
  try {
    await require('./loaders').default({ expressApp: app, httpServer });

    app
      .listen(config.port, () => {
        Logger.info(`
      ################################################
      🛡️  API Backend listening on port: ${config.port} 🛡️
      🛡️  Socket Backend listening on port: ${config.socketPort} 🛡️
      ################################################
    `);
      })
      .on('error', err => {
        Logger.error(err);
        process.exit(1);
      });
  } catch (err) {
    Logger.error(`Opps! Unable to start server ${err}`);
    // TODO : Only send mails when in production
    const mailService = new MailerService(Container.get('emailClient'));
    mailService.SendUnableStartServer('dferictan@gmail.com', err);
  }
}

startServer();
