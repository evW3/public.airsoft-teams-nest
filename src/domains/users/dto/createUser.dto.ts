export class CreateUserDto {
    private email: string;
    private password: string;
    private password_salt: string;
    private role_id: number;

    set Email(email: string) {
        this.email = email;
    }
    set Password(password: string) {
        this.password = password;
    }
    set Password_salt(passwordSalt: string) {
        this.password_salt = passwordSalt;
    }
    set Role_id(roleId: number) {
        this.role_id = roleId;
    }

    get Email() {
        return this.email;
    }
    get Password() {
        return this.password;
    }
    get Password_salt() {
        return this.password_salt;
    }
    get Role_id() {
        return this.role_id;
    }
    constructor() {}
}