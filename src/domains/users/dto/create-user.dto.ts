export class CreateUserDto {
    readonly email: string;
    password: string;
    password_salt: string;
    roleId: number;
}