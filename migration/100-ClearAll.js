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
exports.ClearAll16231027656000 = void 0;
var _07_RolePermissions_1 = require("./07-RolePermissions");
var _05_Permissions_1 = require("./05-Permissions");
var _13_QueryParams_1 = require("./13-QueryParams");
var _9_Queries_1 = require("./9-Queries");
var _10_Comments_1 = require("./10-Comments");
var _11_BlockList_1 = require("./11-BlockList");
var _12_Devices_1 = require("./12-Devices");
var _14_VerificationCodes_1 = require("./14-VerificationCodes");
var _03_Users_1 = require("./03-Users");
var _01_Teams_1 = require("./01-Teams");
var _00_Roles_1 = require("./00-Roles");
var ClearAll16231027656000 = /** @class */ (function () {
    function ClearAll16231027656000() {
    }
    ClearAll16231027656000.prototype.up = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    ClearAll16231027656000.prototype.down = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            var rolePermission, permission, queryParams, queries, comments, blockList, devices, verificationCodes, users, teams, roles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rolePermission = new _07_RolePermissions_1.RolePermissions16231027655007();
                        permission = new _05_Permissions_1.Permissions1623102765505();
                        queryParams = new _13_QueryParams_1.QueryParams16231027655013();
                        queries = new _9_Queries_1.Queries16231027655009();
                        comments = new _10_Comments_1.Comments16231027655010();
                        blockList = new _11_BlockList_1.BlockList16231027655011();
                        devices = new _12_Devices_1.Devices16231027655012();
                        verificationCodes = new _14_VerificationCodes_1.VerificationCodes16231027655014();
                        users = new _03_Users_1.Users1623102765503();
                        teams = new _01_Teams_1.Teams1623102765501();
                        roles = new _00_Roles_1.Roles1623102765500();
                        return [4 /*yield*/, rolePermission.down(queryRunner)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, permission.down(queryRunner)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, queryParams.down(queryRunner)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, comments.down(queryRunner)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, queries.down(queryRunner)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, blockList.down(queryRunner)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, devices.down(queryRunner)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, verificationCodes.down(queryRunner)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, users.down(queryRunner)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, teams.down(queryRunner)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, roles.down(queryRunner)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.clearTable('migrations')];
                    case 12:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return ClearAll16231027656000;
}());
exports.ClearAll16231027656000 = ClearAll16231027656000;
