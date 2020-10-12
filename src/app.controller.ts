import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { AppService } from './app.service';
import { CreateLocaleDto } from './dtos/create-locale.dto';
import { Locale } from './interfaces/locale.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private logger = new Logger(AppController.name);

  @EventPattern('create-locale')
  async createCompany(@Payload() locale: Locale, @Ctx() rmqContext: RmqContext) {
    const channel = rmqContext.getChannelRef();
    const originalMessage = rmqContext.getMessage();
    
    try {
      await this.appService.createLocale(locale);
      await channel.ack(originalMessage);
    }catch(error) {
      if(error.message === 'Locale already registered') {
        await channel.ack(originalMessage);
      }else {
        this.logger.error(`error create-locale: ${JSON.stringify(error.message)}`);
      }
    }
  }

  @MessagePattern('find-all-locales')
  async findCompanyById(@Ctx() rmqContext: RmqContext) {
    const channel = rmqContext.getChannelRef();
    const originalMessage = rmqContext.getMessage();
    
    try {
      return await this.appService.findAllLocales();
    }catch(error) {
      this.logger.error(`error find-all-locales: ${JSON.stringify(error.message)}`);
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @MessagePattern('find-locale-by-id')
  async findAllCompanies(@Payload() _id: string, @Ctx() rmqContext: RmqContext) {
    const channel = rmqContext.getChannelRef();
    const originalMessage = rmqContext.getMessage();
    
    try {
      return await this.appService.findLocaleByIdOrThrow(_id);
    }catch(error) {
      this.logger.error(`error find-locale-by-id: ${JSON.stringify(error.message)}`);
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @EventPattern('update-locale')
  async updateCompany(@Payload() data: any, @Ctx() rmqContext: RmqContext) {
    const channel = rmqContext.getChannelRef();
    const originalMessage = rmqContext.getMessage();

    try {
      await this.appService.updateLocale(data.id, data.locale);
      await channel.ack(originalMessage);
    }catch(error) {
      if(error.message === 'This cityId is already being used by another locale') {
        await channel.ack(originalMessage);
      }else {
        this.logger.error(`error update-locale: ${JSON.stringify(error.message)}`);
      }
    }
  }
}
