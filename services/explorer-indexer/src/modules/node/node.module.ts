import { Injectable, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NodeEntity } from './node.entity';
import { WebSocketModule } from 'nestjs-websocket';
import NodeSyncerService from './nodeSyncer.service';
import { DagModule } from '../dag';
import { PbftModule } from '../pbft';
import { TransactionModule } from '../transaction';
import { HttpModule } from '@nestjs/axios';
import HistoricalSyncService from './historicalSyncer.service';
import RPCConnectorService from './rpcConnector.service';
import general from 'src/config/general';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forFeature(general),
    TypeOrmModule.forFeature([NodeEntity]),
    WebSocketModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          url: config.get<string>('general.connectionURL'),
          port: config.get<number>('general.port'),
          followRedirects: false,
          handshakeTimeout: 10000,
        };
      },
    }),
    DagModule,
    PbftModule,
    TransactionModule,
  ],
  providers: [NodeSyncerService, RPCConnectorService, HistoricalSyncService],
  controllers: [],
  exports: [NodeSyncerService, RPCConnectorService, HistoricalSyncService],
})
export class NodeModule {}
