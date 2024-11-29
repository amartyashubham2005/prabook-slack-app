import dotenv from 'dotenv';
dotenv.config();

import App from './app';
import EventController from './controllers/event.controller';
import InitService from './services/init.service';
import OauthController from './controllers/oauth.controller';

InitService.init().then(async () => {
  const app = new App([new EventController(), new OauthController()]);
  app.listen();
});
