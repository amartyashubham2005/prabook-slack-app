import express from 'express';

import axios from 'axios';
import Controller from '../interfaces/controller.interface';
import logger, { prettyJSON } from '../utils/logger';
import EnvService from '../services/env.service';
import { sequelize } from '../models/sql/sequelize';
import Installation from '../models/sql/installation.model';
import CommonService from '../services/common.service';

class OauthController implements Controller {
  public router = express.Router();
  public installationsRepository = sequelize.getRepository(Installation);
  public commonService = new CommonService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`/oauth/access-token`, this.getAccessToken);
  }

  private getAccessToken = async (
    request: express.Request,
    response: express.Response
  ) => {
    const { code } = request.query;
    const oauthResponse = await axios.get(
      `https://slack.com/api/oauth.v2.access?client_id=${EnvService.env().CLIENT_ID}&client_secret=${EnvService.env().CLIENT_SECRET}&code=${code}`
    );
    if (!oauthResponse.data.ok) {
      response.send(oauthResponse.data);
      return;
    }
    logger.info(`oauthResponse.data: ${prettyJSON(oauthResponse.data)}`);

    try {
      // TODO: Save the installation details
      const existingInstallation = await this.commonService.getInstallationByTeamId({
        teamId: oauthResponse.data.team.id,
      });
      if (existingInstallation) {
        const updatedInstalltion = await this.installationsRepository.update(
          {
            appId: oauthResponse.data.app_id,
            authedUserId: oauthResponse.data.authed_user.id,
            scope: oauthResponse.data.scope,
            tokenType: oauthResponse.data.token_type,
            botAccessToken: oauthResponse.data.access_token,
            botUserId: oauthResponse.data.bot_user_id,
            teamName: oauthResponse.data.team.name,
          },
          {
            where: { id: existingInstallation.id },
          }
        );
        response.send(
          `Installation updated! Here are the details: ${prettyJSON(
            updatedInstalltion
          )}`
        );
        return;
      }
      const installationCreated = await this.installationsRepository.create({
        appId: oauthResponse.data.app_id,
        authedUserId: oauthResponse.data.authed_user.id,
        scope: oauthResponse.data.scope,
        tokenType: oauthResponse.data.token_type,
        botAccessToken: oauthResponse.data.access_token,
        botUserId: oauthResponse.data.bot_user_id,
        teamId: oauthResponse.data.team.id,
        teamName: oauthResponse.data.team.name,
      });

      response.send(
        `Installation created! Here are the details: ${prettyJSON(
          installationCreated
        )}`
      );
    } catch (error) {
      response.send(`Error while creating installation: ${error}`);
    }
  };
}

export default OauthController;
