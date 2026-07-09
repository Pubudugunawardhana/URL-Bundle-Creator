import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class MetadataService {
  async getMetadata(url: string) {
    if (!url) {
      throw new HttpException({ error: 'URL parameter is required' }, HttpStatus.BAD_REQUEST);
    }

    let targetUrl = url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'http://' + targetUrl;
    }

    try {
      const response = await axios.get(targetUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        timeout: 8000,
      });

      const html = response.data;
      if (typeof html !== 'string') {
        throw new Error('Response body is not a string');
      }

      const $ = cheerio.load(html);

      const title =
        $('meta[property="og:title"]').attr('content') ||
        $('title').text() ||
        '';

      const description =
        $('meta[property="og:description"]').attr('content') ||
        $('meta[name="description"]').attr('content') ||
        '';

      let favicon =
        $('link[rel="icon"]').attr('href') ||
        $('link[rel="shortcut icon"]').attr('href') ||
        '';

      const parsedUrl = new URL(targetUrl);
      if (favicon) {
        if (!favicon.startsWith('http') && !favicon.startsWith('//')) {
          favicon = new URL(favicon, parsedUrl.origin).href;
        } else if (favicon.startsWith('//')) {
          favicon = parsedUrl.protocol + favicon;
        }
      } else {
        favicon = `${parsedUrl.origin}/favicon.ico`;
      }

      return {
        title: title.trim(),
        description: description.trim(),
        favicon,
      };
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        throw new HttpException(
          { error: `Failed to fetch URL: ${error.response.statusText || error.response.status}` },
          error.response.status >= 400 && error.response.status < 500
            ? error.response.status
            : HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        { error: 'Failed to process the URL.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
