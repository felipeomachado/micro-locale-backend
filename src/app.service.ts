import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLocaleDto } from './dtos/create-locale.dto';
import { UpdateLocaleDto } from './dtos/update-locale.dto';
import { Locale } from './interfaces/locale.interface';

@Injectable()
export class AppService {

  constructor(@InjectModel('Locale') private readonly localeModel: Model<Locale>) {}

  private readonly logger = new Logger(AppService.name);
  
  async createLocale(createLocaleDto: CreateLocaleDto) : Promise<Locale> {
    try {
      if(await this.localeModel.findOne({cityId: createLocaleDto.cityId})) {
        throw new RpcException('Locale already registered');
      }

      const locale = await new this.localeModel(createLocaleDto).save();
      
      if(!locale) {
        this.logger.error(`Problem to create a Locale}`);
        throw new RpcException('Problem to create a Locale');
      }

      return locale;
    }catch(exception) {
      this.logger.error(`error: ${JSON.stringify(exception.message)}`);
      throw new RpcException(exception.message);
    }
  }

  async findLocaleByIdOrThrow(_id: string) : Promise<Locale> {
    try {
      const locale = this.localeModel.findById(_id);

      if(!locale) {
        throw new RpcException('Locale not found');
      }
      return locale;
    }catch(exception) {
      this.logger.error(`error: ${JSON.stringify(exception.message)}`);
      throw new RpcException(exception.message);
    }
  }

  async findLocaleByCityId(cityId: number) : Promise<Locale> {
    try {
      return this.localeModel.findOne({cityId});
    }catch(exception) {
      this.logger.error(`error: ${JSON.stringify(exception.message)}`);
      throw new RpcException(exception.message);
    }
  }

  async findAllLocales() : Promise<Array<Locale>> {
    try {
      return await this.localeModel.find();
    }catch(exception) {
      this.logger.error(`error: ${JSON.stringify(exception.message)}`);
      throw new RpcException(exception.message);
    }
  }

  async updateLocale(_id: string, updateLocaleDto: UpdateLocaleDto): Promise<void> {
    try {
      const localeById = await this.findLocaleByIdOrThrow(_id);
      const localeByCityId = await this.findLocaleByCityId(updateLocaleDto.cityId);

      if(localeByCityId && (localeByCityId._id.toString() != localeById._id.toString())) {
        throw new RpcException('This cityId is already being used by another locale');
      }

      await this.localeModel.findByIdAndUpdate(_id, updateLocaleDto);
    }catch(exception) {
      this.logger.error(`error: ${JSON.stringify(exception.message)}`);
      throw new RpcException(exception.message);
    }
  }

}
