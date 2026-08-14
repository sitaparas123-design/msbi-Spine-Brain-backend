"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wordpressService = exports.WordPressService = void 0;
const axios_1 = __importDefault(require("axios"));
const WP_BASE_URL = 'https://midwestspine.net/wp-json/wp/v2';
class WordPressService {
    /**
     * Health check to verify if the WordPress REST API is accessible.
     */
    async healthCheck() {
        try {
            const response = await axios_1.default.get(`${WP_BASE_URL}/types`, { timeout: 10000 });
            return response.status === 200;
        }
        catch (error) {
            console.error('WordPress health check failed:', error);
            return false;
        }
    }
    parseParams(params) {
        const safeParams = {};
        const allowed = ['page', 'per_page', 'search', 'order', 'orderby', '_embed'];
        for (const key of allowed) {
            if (params[key] !== undefined) {
                safeParams[key] = params[key];
            }
        }
        if (!safeParams.per_page || safeParams.per_page > 100) {
            safeParams.per_page = 20; // Default limit
        }
        if (!safeParams.page) {
            safeParams.page = 1;
        }
        return safeParams;
    }
    parsePagination(headers, params) {
        return {
            page: Number(params.page) || 1,
            perPage: Number(params.per_page) || 20,
            total: Number(headers['x-wp-total']) || 0,
            totalPages: Number(headers['x-wp-totalpages']) || 0
        };
    }
    normalizePostLike(item) {
        return {
            id: item.id,
            date: item.date,
            modified: item.modified,
            slug: item.slug,
            status: item.status,
            link: item.link,
            title: item.title?.rendered || '',
            excerpt: item.excerpt?.rendered || '',
            content: item.content?.rendered || '',
            featuredMedia: item.featured_media || null,
            author: item.author || null,
            categories: item.categories || [],
            tags: item.tags || [],
            type: item.type || ''
        };
    }
    normalizeMedia(item) {
        return {
            id: item.id,
            date: item.date,
            slug: item.slug,
            link: item.link,
            mediaType: item.media_type,
            mimeType: item.mime_type,
            sourceUrl: item.source_url,
            altText: item.alt_text || '',
            caption: item.caption?.rendered || '',
            title: item.title?.rendered || ''
        };
    }
    async fetchPaginated(endpoint, params, normalizer) {
        try {
            const safeParams = this.parseParams(params);
            const response = await axios_1.default.get(`${WP_BASE_URL}/${endpoint}`, { params: safeParams, timeout: 15000 });
            const data = (response.data || []).map(normalizer);
            return {
                data,
                pagination: this.parsePagination(response.headers, safeParams)
            };
        }
        catch (error) {
            console.error(`WordPress ${endpoint} error:`, error.message);
            throw new Error(`Failed to fetch ${endpoint} from WordPress`);
        }
    }
    async getPosts(params = {}) {
        return this.fetchPaginated('posts', params, this.normalizePostLike);
    }
    async getPages(params = {}) {
        return this.fetchPaginated('pages', params, this.normalizePostLike);
    }
    async getConditionTreatments(params = {}) {
        return this.fetchPaginated('condition_treatments', params, this.normalizePostLike);
    }
    async getMedia(params = {}) {
        return this.fetchPaginated('media', params, this.normalizeMedia);
    }
    async getCategories(params = {}) {
        return this.fetchPaginated('categories', params, (item) => ({
            id: item.id, count: item.count, description: item.description, link: item.link, name: item.name, slug: item.slug
        }));
    }
    async getTags(params = {}) {
        return this.fetchPaginated('tags', params, (item) => ({
            id: item.id, count: item.count, description: item.description, link: item.link, name: item.name, slug: item.slug
        }));
    }
    async getTypes() {
        try {
            const response = await axios_1.default.get(`${WP_BASE_URL}/types`, { timeout: 10000 });
            return response.data;
        }
        catch (e) {
            throw new Error('Failed to fetch WordPress types');
        }
    }
    async getTaxonomies() {
        try {
            const response = await axios_1.default.get(`${WP_BASE_URL}/taxonomies`, { timeout: 10000 });
            return response.data;
        }
        catch (e) {
            throw new Error('Failed to fetch WordPress taxonomies');
        }
    }
}
exports.WordPressService = WordPressService;
exports.wordpressService = new WordPressService();
