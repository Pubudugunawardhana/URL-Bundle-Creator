"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BundlesController = void 0;
const common_1 = require("@nestjs/common");
const bundles_service_1 = require("./bundles.service");
const create_bundle_dto_1 = require("./dto/create-bundle.dto");
const next_auth_guard_1 = require("../auth/guards/next-auth.guard");
const cookie = __importStar(require("cookie"));
const jwt_1 = require("next-auth/jwt");
let BundlesController = class BundlesController {
    constructor(bundlesService) {
        this.bundlesService = bundlesService;
    }
    async createBundle(dto, req) {
        if (!dto.name || !dto.links || !Array.isArray(dto.links) || dto.links.length === 0) {
            throw new common_1.HttpException({ error: 'Bundle name and at least one link are required.' }, common_1.HttpStatus.BAD_REQUEST);
        }
        let userId = undefined;
        const cookieHeader = req.headers.cookie;
        if (cookieHeader) {
            const cookies = cookie.parse(cookieHeader);
            const possibleCookies = [
                'authjs.session-token',
                '__Secure-authjs.session-token',
                'next-auth.session-token',
                '__Secure-next-auth.session-token',
            ];
            let token = '';
            let salt = '';
            for (const name of possibleCookies) {
                if (cookies[name]) {
                    token = cookies[name];
                    salt = name;
                    break;
                }
                else if (cookies[`${name}.0`]) {
                    let chunkedToken = '';
                    let i = 0;
                    while (cookies[`${name}.${i}`]) {
                        chunkedToken += cookies[`${name}.${i}`];
                        i++;
                    }
                    token = chunkedToken;
                    salt = name;
                    break;
                }
            }
            if (token) {
                const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
                if (secret) {
                    try {
                        const decoded = await (0, jwt_1.decode)({ token, secret, salt });
                        if (decoded) {
                            userId = (decoded.id || decoded.sub);
                        }
                    }
                    catch (error) {
                    }
                }
            }
        }
        return this.bundlesService.create(dto, userId);
    }
    async getUserBundles(req) {
        const userId = req.user.id || req.user.sub;
        if (!userId) {
            throw new common_1.HttpException({ error: 'Unauthorized' }, common_1.HttpStatus.UNAUTHORIZED);
        }
        return this.bundlesService.getUserBundles(userId);
    }
    async deleteBundle(id, req) {
        const userId = req.user.id || req.user.sub;
        if (!userId) {
            throw new common_1.HttpException({ error: 'Unauthorized' }, common_1.HttpStatus.UNAUTHORIZED);
        }
        return this.bundlesService.delete(id, userId);
    }
    async getBundle(id, req) {
        let clientPasswordHash = undefined;
        const cookieHeader = req.headers.cookie;
        if (cookieHeader) {
            const cookies = cookie.parse(cookieHeader);
            clientPasswordHash = cookies[`bundle_pass_${id}`];
        }
        return this.bundlesService.findOne(id, clientPasswordHash);
    }
    async verifyPassword(id, body) {
        return this.bundlesService.verifyPassword(id, body.password);
    }
};
exports.BundlesController = BundlesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bundle_dto_1.CreateBundleDto, Object]),
    __metadata("design:returntype", Promise)
], BundlesController.prototype, "createBundle", null);
__decorate([
    (0, common_1.UseGuards)(next_auth_guard_1.NextAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BundlesController.prototype, "getUserBundles", null);
__decorate([
    (0, common_1.UseGuards)(next_auth_guard_1.NextAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BundlesController.prototype, "deleteBundle", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BundlesController.prototype, "getBundle", null);
__decorate([
    (0, common_1.Post)(':id/verify-password'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BundlesController.prototype, "verifyPassword", null);
exports.BundlesController = BundlesController = __decorate([
    (0, common_1.Controller)('bundles'),
    __metadata("design:paramtypes", [bundles_service_1.BundlesService])
], BundlesController);
