"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.RolePermissionsSeed16231027655008 = void 0;
var methods_1 = require("../src/utils/methods");
var constants_1 = require("../src/constants");
var RolePermissionsSeed16231027655008 = /** @class */ (function () {
    function RolePermissionsSeed16231027655008() {
    }
    RolePermissionsSeed16231027655008.prototype.up = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            var permissions, _i, permissions_1, i, currentPermissionId, roles, currentRoleIdPlayer, currentRoleIdManager, currentRoleIdAdmin, _a, roles_1, k;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        permissions = methods_1.getListPermissions(constants_1.PermissionsList);
                        _i = 0, permissions_1 = permissions;
                        _b.label = 1;
                    case 1:
                        if (!(_i < permissions_1.length)) return [3 /*break*/, 14];
                        i = permissions_1[_i];
                        return [4 /*yield*/, queryRunner.query("\n                SELECT id\n                FROM permissions\n                WHERE name='" + i.name + "'\n            ")];
                    case 2:
                        currentPermissionId = (_b.sent())[0].id;
                        roles = constants_1.PermissionsList[i.name];
                        return [4 /*yield*/, queryRunner.query("SELECT id FROM roles where name='PLAYER'")];
                    case 3:
                        currentRoleIdPlayer = (_b.sent())[0].id;
                        return [4 /*yield*/, queryRunner.query("SELECT id FROM roles where name='MANAGER'")];
                    case 4:
                        currentRoleIdManager = (_b.sent())[0].id;
                        return [4 /*yield*/, queryRunner.query("SELECT id FROM roles where name='ADMIN'")];
                    case 5:
                        currentRoleIdAdmin = (_b.sent())[0].id;
                        _a = 0, roles_1 = roles;
                        _b.label = 6;
                    case 6:
                        if (!(_a < roles_1.length)) return [3 /*break*/, 13];
                        k = roles_1[_a];
                        if (!(k === 'ADMIN')) return [3 /*break*/, 8];
                        return [4 /*yield*/, queryRunner.query("\n                        INSERT INTO roles_permission (role_id, permission_id)\n                        VALUES (" + currentRoleIdAdmin + ", " + currentPermissionId + ")\n                    ")];
                    case 7:
                        _b.sent();
                        return [3 /*break*/, 12];
                    case 8:
                        if (!(k === 'MANAGER')) return [3 /*break*/, 10];
                        return [4 /*yield*/, queryRunner.query("\n                        INSERT INTO roles_permission (role_id, permission_id)\n                        VALUES (" + currentRoleIdManager + ", " + currentPermissionId + ")\n                    ")];
                    case 9:
                        _b.sent();
                        return [3 /*break*/, 12];
                    case 10: return [4 /*yield*/, queryRunner.query("\n                        INSERT INTO roles_permission (role_id, permission_id)\n                        VALUES (" + currentRoleIdPlayer + ", " + currentPermissionId + ")\n                    ")];
                    case 11:
                        _b.sent();
                        _b.label = 12;
                    case 12:
                        _a++;
                        return [3 /*break*/, 6];
                    case 13:
                        _i++;
                        return [3 /*break*/, 1];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    RolePermissionsSeed16231027655008.prototype.down = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    return RolePermissionsSeed16231027655008;
}());
exports.RolePermissionsSeed16231027655008 = RolePermissionsSeed16231027655008;
