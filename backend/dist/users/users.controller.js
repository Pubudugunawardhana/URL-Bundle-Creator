"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const next_auth_guard_1 = require("../auth/guards/next-auth.guard");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async updateProfile(body, req) {
        const userId = req.user.id || req.user.sub;
        if (!userId) {
            throw new common_1.HttpException({ message: 'Unauthorized' }, common_1.HttpStatus.UNAUTHORIZED);
        }
        if (!body.name) {
            throw new common_1.HttpException({ message: 'Name is required' }, common_1.HttpStatus.BAD_REQUEST);
        }
        return this.usersService.updateProfile(userId, body.name);
    }
    async updatePassword(body, req) {
        const userId = req.user.id || req.user.sub;
        if (!userId) {
            throw new common_1.HttpException({ message: 'Unauthorized' }, common_1.HttpStatus.UNAUTHORIZED);
        }
        if (!body.currentPassword || !body.newPassword) {
            throw new common_1.HttpException({ message: 'Current and new password are required' }, common_1.HttpStatus.BAD_REQUEST);
        }
        return this.usersService.updatePassword(userId, body.currentPassword, body.newPassword);
    }
    async deleteProfile(req) {
        const userId = req.user.id || req.user.sub;
        if (!userId) {
            throw new common_1.HttpException({ message: 'Unauthorized' }, common_1.HttpStatus.UNAUTHORIZED);
        }
        return this.usersService.deleteProfile(userId);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Put)('profile'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Put)('password'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Delete)('profile'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteProfile", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(next_auth_guard_1.NextAuthGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
