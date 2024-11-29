import express from 'express';

import Controller from '../interfaces/controller.interface';
import EventPayloadI from '../interfaces/eventPayload.interface';
import CommonService from '../services/common.service';
import logger, { prettyJSON } from '../utils/logger';
import slackAuthMiddleware from '../middleware/slackAuth.middleware';

class EventController implements Controller {
  public router = express.Router();
  public commonService = new CommonService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`/event`, slackAuthMiddleware, this.processEvent);
  }

  private processEvent = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      if (request.body.type === 'url_verification') {
        response.send(request.body.challenge);
        return;
      }
      response.send();
    } catch (error) {
      logger.error(`Error processing event: ${error}`);
      response.send();
    }
    try {
      const payload = request.body as EventPayloadI;
      const { type, channel_type, thread_ts } = payload.event;
      if (type === 'message') {
        logger.info(`Received event payload: ${prettyJSON(payload)}`);
        // Only reply to messages from users which are not bots. Just echo the message back
        if (payload.event.bot_id) {
          return;
        }
        // Only respond to DMs to this bot
        if (channel_type !== 'im') {
          return;
        }
        const { user, text } = payload.event;
        const reply = await this.commonService.invokeLambda({
          awsKeyId: text,
        });
        const threadId = thread_ts;

        // Get the bot access token.
        const installation = await this.commonService.getInstallationByTeamId({
          teamId: payload.team_id,
        });

        if (!installation) {
          logger.error(
            `Installation not found for teamId: ${payload.team_id}. Cannot send message.`
          );
          return;
        }
  
        await this.commonService.postMessageInDm({
          botAccessToken: installation.botAccessToken,
          sink: user,
          text: (reply),
          ts: threadId,
        });
      }
    } catch (error) {
      logger.error(`Error processing event: ${error}`);
    }
  };
}

export default EventController;
