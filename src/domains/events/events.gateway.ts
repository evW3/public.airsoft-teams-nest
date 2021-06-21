import {
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
} from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { TokenService } from '../auth/token.service';
import { UsersService } from '../users/users.service';

@WebSocketGateway()
@Injectable()
export class EventsGateway implements OnGatewayConnection {
    constructor(private readonly tokenService: TokenService,
                private readonly usersService: UsersService) {}

    private clients: any = {
        ADMIN: {} ,
        MANAGER: {},
        PLAYER: {}
    };

    @SubscribeMessage('messageToServer')
    async message(client: any, ...args: any[]): Promise<void> {
        client.emit('message', args[0]);
    }

    async handleConnection(client: any, ...args: any[]): Promise<any> {
        const token = client.handshake.query.token;
        if(token) {
            const params = this.tokenService.decryptToken(token);
            const id: number = params.id;
            const role = await this.usersService.getUserRole(params.id);
            this.clients[role][id] = client;
        }
    }

    sendToRoles(text: string, ...roles: string[]) {
        for(let role of roles) {
            Object.values(this.clients[role]).forEach((client: any) => client.emit('message', text));
        }
    }

}