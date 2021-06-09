export class CreateUserDto {
    private Email: string;
    private Password: string;
    private Password_salt: string;
    private Role_id: number;

    set email(email: string) {
        this.Email = email;
    }
    set password(password: string) {
        this.Password = password;
    }
    set password_salt(passwordSalt: string) {
        this.Password_salt = passwordSalt;
    }
    set role_id(roleId: number) {
        this.Role_id = roleId;
    }

    get email() {
        return this.Email;
    }
    get password() {
        return this.Password;
    }
    get password_salt() {
        return this.Password_salt;
    }
    get role_id() {
        return this.Role_id;
    }
    constructor() {}
}