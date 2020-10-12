import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { AppService } from './app.service';
import { Locale } from './interfaces/locale.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private logger = new Logger(AppController.name);

  @EventPattern('create-locale')
  async createLocale(@Payload() locale: Locale, @Ctx() rmqContext: RmqContext) {
    const channel = rmqContext.getChannelRef();
    const originalMessage = rmqContext.getMessage();
    
    try {
      await this.appService.createLocale(locale);
      await channel.ack(originalMessage);
    }catch(exception) {
      this.logger.error(`error create-locale: ${JSON.stringify(exception.message)}`);
    }
  }

  @MessagePattern('find-all-locales')
  async findLocaleById(@Ctx() rmqContext: RmqContext) {
    const channel = rmqContext.getChannelRef();
    const originalMessage = rmqContext.getMessage();
    
    try {
      return await this.appService.findAllLocales();
    }catch(exception) {
      this.logger.error(`error find-all-locales: ${JSON.stringify(exception.message)}`);
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @MessagePattern('find-locale-by-id')
  async findAllLocales(@Payload() _id: string, @Ctx() rmqContext: RmqContext) {
    const channel = rmqContext.getChannelRef();
    const originalMessage = rmqContext.getMessage();
    
    try {
      return await this.appService.findLocaleByIdOrThrow(_id);
    }catch(exception) {
      this.logger.error(`error find-locale-by-id: ${JSON.stringify(exception.message)}`);
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @MessagePattern('find-locale-by-cityId')
  async findLocaleByCityId(@Payload() cityId: number, @Ctx() rmqContext: RmqContext) {
    const channel = rmqContext.getChannelRef();
    const originalMessage = rmqContext.getMessage();
    
    try {
      return await this.appService.findLocaleByCityId(cityId);
    }catch(exception) {
      this.logger.error(`error find-locale-by-cityId: ${JSON.stringify(exception.message)}`);
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @EventPattern('update-locale')
  async updateLocale(@Payload() data: any, @Ctx() rmqContext: RmqContext) {
    const channel = rmqContext.getChannelRef();
    const originalMessage = rmqContext.getMessage();

    try {
      await this.appService.updateLocale(data.id, data.locale);
      await channel.ack(originalMessage);
    }catch(exception) {
      this.logger.error(`error update-locale: ${JSON.stringify(exception.message)}`);
    }
  }
}
