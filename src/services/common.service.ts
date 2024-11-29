import axios from 'axios';
import ThreadMessageI from '../interfaces/threadMessages.interface';
import logger, { prettyJSON } from '../utils/logger';
import Installation from '../models/sql/installation.model';
import { sequelize } from '../models/sql/sequelize';

class CommonService {
  public installationsRepository = sequelize.getRepository(Installation);

  // Internal DB calls

  public async getInstallationByTeamId({
    teamId,
  }: {
    teamId: string;
  }): Promise<Installation | null> {
    try {
      const installation = await this.installationsRepository.findOne({
        where: { teamId },
      });
      return installation;
    } catch (e: any) {
      logger.error(`Error fetching installation by teamId: ${teamId}`);
      logger.error(e.message);
      logger.error(prettyJSON(e));
    }
    return null;
  }

  // Slack APIs
  public async postMessageInDm({
    botAccessToken,
    sink,
    text,
    ts,
    blocks,
    metadata,
  }: {
    botAccessToken: string;
    sink: string;
    text: string;
    ts?: string;
    blocks?: string;
    metadata?: string;
  }): Promise<
    | {
        message: ThreadMessageI;
        channel: string;
        ts: string;
        ok: boolean;
      }
    | undefined
  > {
    let body = {
      channel: sink,
      text,
      metadata,
    } as any;
    if (blocks) {
      body = {
        ...body,
        blocks,
      };
    }
    if (ts) {
      body = {
        ...body,
        thread_ts: ts,
      };
    }
    try {
      const response = await axios.post(
        `https://slack.com/api/chat.postMessage`,
        body,
        {
          headers: {
            Authorization: `Bearer ${botAccessToken}`,
          },
        }
      );
      if (!response || response.status != 200 || response.data.ok === false) {
        throw Error(
          `Failed to post chat, request body: ${prettyJSON(
            body
          )} response status: ${response.status} response data: ${prettyJSON(
            response.data
          )}`
        );
      }
      return response.data as {
        message: ThreadMessageI;
        channel: string;
        ts: string;
        ok: boolean;
      };
    } catch (e: any) {
      logger.error(`Error posting message to ${sink}`);
      logger.error(e.message);
      logger.error(prettyJSON(e));
    }
    return undefined;
  }

  // Remote APIs
  public async invokeLambda({
    awsKeyId,
  }: {
    awsKeyId: string;
  }): Promise<any> {
    try {
      const response = await axios.post(
        `https://kl5535b8ec.execute-api.us-east-1.amazonaws.com`, // TODO: Maybe move this to env?
        {
          aws_key_id: awsKeyId,
        }
      );
      if (!response || response.status != 200 || response.data.ok === false) {
        throw Error(
          `Failed to invoke lambda, request body: ${prettyJSON(
            { awsKeyId }
          )} response status: ${response.status} response data: ${prettyJSON(
            response.data
          )}`
        );
      }
      return response.data;
    } catch (e: any) {
      logger.error(`Error invoking lambda with key: ${awsKeyId}`);
      logger.error(e.message);
      logger.error(prettyJSON(e));
      return prettyJSON(e);
    }
  }
}

export default CommonService;
