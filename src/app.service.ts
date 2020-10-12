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
    
    const locale = await new this.localeModel(createLocaleDto).save();
    
    if(!locale) {
      throw new RpcException('Problem to create a Locale');
    }
    return locale;
  }

  async findLocaleByIdOrThrow(_id: string) : Promise<Locale> {
    return this.localeModel.findById(_id);
  }

  async findLocaleByCityId(cityId: number) : Promise<Locale> {
    return this.localeModel.findOne({ cityId });
  }

  async findAllLocales() : Promise<Array<Locale>> {
    return await this.localeModel.find();
  }

  async updateLocale(_id: string, updateLocaleDto: UpdateLocaleDto): Promise<void> {
    await this.localeModel.findByIdAndUpdate(_id, updateLocaleDto);
  }

}
