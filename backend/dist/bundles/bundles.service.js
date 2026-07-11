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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BundlesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const nanoid_1 = require("nanoid");
const crypto = __importStar(require("crypto"));
let BundlesService = class BundlesService {
    constructor(prisma) {
        this.prisma = prisma;
        this.nanoid = (0, nanoid_1.customAlphabet)('346789ABCDEFGHJKLMNPQRTUVWXYabcdefghijkmnopqrstuvwxyz', 5);
    }
    async create(dto, userId) {
        const shortId = this.nanoid();
        let hashedPassword = null;
        if (dto.password && dto.password.trim() !== '') {
            hashedPassword = crypto.createHash('sha256').update(dto.password.trim()).digest('hex');
        }
        let expiresAt = null;
        if (dto.expiresIn === '1h') {
            expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        }
        else if (dto.expiresIn === '24h') {
            expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        }
        else if (dto.expiresIn === '7d') {
            expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        }
        return this.prisma.bundle.create({
            data: {
                shortId,
                name: dto.name,
                description: dto.description || null,
                category: dto.category || null,
                icon: dto.icon || 'Folder',
                password: hashedPassword,
                expiresAt,
                userId: userId || null,
                links: {
                    create: (dto.links || []).map((link, index) => ({
                        url: link.url,
                        title: link.title || null,
                        description: link.description || null,
                        favicon: link.favicon || null,
                        note: link.note || null,
                        isWatched: link.isWatched || false,
                        order: index,
                    })),
                },
            },
            include: { links: true },
        });
    }
    async getUserBundles(userId) {
        const bundles = await this.prisma.bundle.findMany({
            where: { userId },
            include: { links: { orderBy: { order: 'asc' } } },
            orderBy: { createdAt: 'desc' },
        });
        return bundles.map(bundle => {
            const { password, ...rest } = bundle;
            return rest;
        });
    }
    async delete(shortId, userId) {
        const bundle = await this.prisma.bundle.findUnique({
            where: { shortId },
        });
        if (!bundle) {
            throw new common_1.HttpException({ error: 'Bundle not found' }, common_1.HttpStatus.NOT_FOUND);
        }
        if (bundle.userId !== userId) {
            throw new common_1.HttpException({ error: 'Unauthorized: You do not own this bundle' }, common_1.HttpStatus.FORBIDDEN);
        }
        try {
            await this.prisma.bundle.delete({
                where: { shortId },
            });
            return { success: true };
        }
        catch (error) {
            throw new common_1.HttpException({ error: 'Failed to delete bundle' }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateLinks(shortId, userId, links) {
        const bundle = await this.prisma.bundle.findUnique({
            where: { shortId },
        });
        if (!bundle) {
            throw new common_1.HttpException({ error: 'Bundle not found' }, common_1.HttpStatus.NOT_FOUND);
        }
        if (bundle.userId !== userId) {
            throw new common_1.HttpException({ error: 'Unauthorized: You do not own this bundle' }, common_1.HttpStatus.FORBIDDEN);
        }
        await this.prisma.link.deleteMany({
            where: { bundleId: bundle.id },
        });
        return this.prisma.bundle.update({
            where: { shortId },
            data: {
                links: {
                    create: links.map((link, index) => ({
                        url: link.url,
                        title: link.title || null,
                        description: link.description || null,
                        favicon: link.favicon || null,
                        note: link.note || null,
                        isWatched: link.isWatched || false,
                        order: index,
                    })),
                },
            },
            include: { links: true },
        });
    }
    async update(shortId, userId, data) {
        const bundle = await this.prisma.bundle.findUnique({
            where: { shortId },
        });
        if (!bundle) {
            throw new common_1.HttpException({ error: 'Bundle not found' }, common_1.HttpStatus.NOT_FOUND);
        }
        if (bundle.userId !== userId) {
            throw new common_1.HttpException({ error: 'Unauthorized: You do not own this bundle' }, common_1.HttpStatus.FORBIDDEN);
        }
        return this.prisma.bundle.update({
            where: { shortId },
            data: {
                isFavorite: data.isFavorite,
            },
        });
    }
    async findOne(shortId, clientPasswordHash) {
        const bundle = await this.prisma.bundle.findUnique({
            where: { shortId },
            include: {
                links: {
                    orderBy: { order: 'asc' },
                },
            },
        });
        if (!bundle) {
            throw new common_1.HttpException({ error: 'Bundle not found' }, common_1.HttpStatus.NOT_FOUND);
        }
        await this.prisma.bundle.update({
            where: { shortId },
            data: { views: { increment: 1 } },
        });
        bundle.views += 1;
        if (bundle.password) {
            const hasAccess = clientPasswordHash && clientPasswordHash === bundle.password;
            if (!hasAccess) {
                return {
                    ...bundle,
                    password: 'protected',
                    links: [],
                };
            }
            return {
                ...bundle,
                password: clientPasswordHash,
            };
        }
        return {
            ...bundle,
            password: undefined,
        };
    }
    async verifyPassword(shortId, password) {
        const bundle = await this.prisma.bundle.findUnique({
            where: { shortId },
        });
        if (!bundle) {
            throw new common_1.HttpException({ error: 'Bundle not found' }, common_1.HttpStatus.NOT_FOUND);
        }
        if (!bundle.password) {
            throw new common_1.HttpException({ error: 'No password set on this bundle' }, common_1.HttpStatus.BAD_REQUEST);
        }
        if (!password) {
            throw new common_1.HttpException({ error: 'Password is required' }, common_1.HttpStatus.BAD_REQUEST);
        }
        const hashedPassword = crypto.createHash('sha256').update(password.trim()).digest('hex');
        if (bundle.password !== hashedPassword) {
            throw new common_1.HttpException({ error: 'Incorrect password' }, common_1.HttpStatus.FORBIDDEN);
        }
        return { success: true };
    }
};
exports.BundlesService = BundlesService;
exports.BundlesService = BundlesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BundlesService);
