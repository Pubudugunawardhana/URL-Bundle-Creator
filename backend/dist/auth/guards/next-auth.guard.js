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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NextAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const cookie = __importStar(require("cookie"));
let NextAuthGuard = class NextAuthGuard {
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const cookieHeader = request.headers.cookie;
        if (!cookieHeader) {
            throw new common_1.UnauthorizedException('No cookies found');
        }
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
        if (!token) {
            throw new common_1.UnauthorizedException('No session token found');
        }
        const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
        if (!secret) {
            throw new common_1.UnauthorizedException('Auth secret not configured');
        }
        try {
            require.resolve('next-auth/jwt');
            const dynamicImport = new Function('specifier', 'return import(specifier)');
            const { decode } = await dynamicImport('next-auth/jwt');
            const decoded = await decode({
                token,
                secret,
                salt,
            });
            if (!decoded) {
                throw new common_1.UnauthorizedException('Invalid session');
            }
            request.user = decoded;
            return true;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Session decryption failed');
        }
    }
};
exports.NextAuthGuard = NextAuthGuard;
exports.NextAuthGuard = NextAuthGuard = __decorate([
    (0, common_1.Injectable)()
], NextAuthGuard);
