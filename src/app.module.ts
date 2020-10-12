import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LocaleSchema } from './interfaces/locale.schema';


@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:6t9VwUwqD89nriW@clusterreclameaqui.krwdl.mongodb.net/localeBackend?retryWrites=true&w=majority',
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false }
    ),
      MongooseModule.forFeature([
        { name: 'Locale', schema: LocaleSchema}
      ])
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
