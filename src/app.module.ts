import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ChngerequestModule } from './chngerequest/chngerequest.module';
import { CR } from './chngerequest/chngerequest.entity';
import { CRPrototype } from './cr-prototype/cr-prototype.entity'

import { AdminModule } from './admin/admin.module';
import { CrPrototypeModule } from './cr-prototype/cr-prototype.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'crms',
      entities: [User, CR, CRPrototype],
      synchronize: true,
      }),
      UserModule,
      JwtModule.register({
        secret: 'pass@123', 
        signOptions: { expiresIn: '1h' },
      }),
      UserModule,
      ChngerequestModule,
      AdminModule,
      CrPrototypeModule,
  ],
})
export class AppModule {}