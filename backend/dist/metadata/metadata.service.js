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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
let MetadataService = class MetadataService {
    async getMetadata(url) {
        if (!url) {
            throw new common_1.HttpException({ error: 'URL parameter is required' }, common_1.HttpStatus.BAD_REQUEST);
        }
        let targetUrl = url.trim();
        if (!/^https?:\/\//i.test(targetUrl)) {
            targetUrl = 'http://' + targetUrl;
        }
        try {
            const response = await axios_1.default.get(targetUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                },
                timeout: 8000,
            });
            const html = response.data;
            if (typeof html !== 'string') {
                throw new Error('Response body is not a string');
            }
            const $ = cheerio.load(html);
            const title = $('meta[property="og:title"]').attr('content') ||
                $('title').text() ||
                '';
            const description = $('meta[property="og:description"]').attr('content') ||
                $('meta[name="description"]').attr('content') ||
                '';
            let favicon = $('link[rel="icon"]').attr('href') ||
                $('link[rel="shortcut icon"]').attr('href') ||
                '';
            const parsedUrl = new URL(targetUrl);
            if (favicon) {
                if (!favicon.startsWith('http') && !favicon.startsWith('//')) {
                    favicon = new URL(favicon, parsedUrl.origin).href;
                }
                else if (favicon.startsWith('//')) {
                    favicon = parsedUrl.protocol + favicon;
                }
            }
            else {
                favicon = `${parsedUrl.origin}/favicon.ico`;
            }
            return {
                title: title.trim(),
                description: description.trim(),
                favicon,
            };
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response) {
                throw new common_1.HttpException({ error: `Failed to fetch URL: ${error.response.statusText || error.response.status}` }, error.response.status >= 400 && error.response.status < 500
                    ? error.response.status
                    : common_1.HttpStatus.BAD_REQUEST);
            }
            throw new common_1.HttpException({ error: 'Failed to process the URL.' }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.MetadataService = MetadataService;
exports.MetadataService = MetadataService = __decorate([
    (0, common_1.Injectable)()
], MetadataService);
