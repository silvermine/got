/// <reference types="node" />
import { Duplex, Readable } from 'stream';
import { URL, URLSearchParams } from 'url';
import { Socket } from 'net';
import { SecureContextOptions } from 'tls';
import http = require('http');
import { ClientRequest, RequestOptions, ServerResponse, request as httpRequest } from 'http';
import https = require('https');
import { Timings, IncomingMessageWithTimings } from '@szmarczak/http-timer';
import CacheableLookup from 'cacheable-lookup';
import CacheableRequest = require('cacheable-request');
import ResponseLike = require('responselike');
import { Delays, TimeoutError as TimedOutTimeoutError } from './utils/timed-out';
import { URLOptions } from './utils/options-to-url';
declare type HttpRequestFunction = typeof httpRequest;
declare type Error = NodeJS.ErrnoException;
declare const kRequest: unique symbol;
declare const kResponse: unique symbol;
declare const kResponseSize: unique symbol;
declare const kDownloadedSize: unique symbol;
declare const kBodySize: unique symbol;
declare const kUploadedSize: unique symbol;
declare const kServerResponsesPiped: unique symbol;
declare const kUnproxyEvents: unique symbol;
declare const kIsFromCache: unique symbol;
declare const kCancelTimeouts: unique symbol;
declare const kStartedReading: unique symbol;
declare const kStopReading: unique symbol;
declare const kTriggerRead: unique symbol;
declare const kBody: unique symbol;
declare const kJobs: unique symbol;
declare const kOriginalResponse: unique symbol;
export declare const kIsNormalizedAlready: unique symbol;
export interface Agents {
    http?: http.Agent;
    https?: https.Agent;
    http2?: unknown;
}
export declare const withoutBody: ReadonlySet<string>;
export interface ToughCookieJar {
    getCookieString(currentUrl: string, options: {
        [key: string]: unknown;
    }, cb: (err: Error | null, cookies: string) => void): void;
    getCookieString(url: string, callback: (error: Error | null, cookieHeader: string) => void): void;
    setCookie(cookieOrString: unknown, currentUrl: string, options: {
        [key: string]: unknown;
    }, cb: (err: Error | null, cookie: unknown) => void): void;
    setCookie(rawCookie: string, url: string, callback: (error: Error | null, result: unknown) => void): void;
}
export interface PromiseCookieJar {
    getCookieString(url: string): Promise<string>;
    setCookie(rawCookie: string, url: string): Promise<unknown>;
}
export declare type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'HEAD' | 'DELETE' | 'OPTIONS' | 'TRACE' | 'get' | 'post' | 'put' | 'patch' | 'head' | 'delete' | 'options' | 'trace';
declare type Promisable<T> = T | Promise<T>;
export declare type InitHook = (options: Options) => Promisable<void>;
export declare type BeforeRequestHook = (options: NormalizedOptions) => Promisable<void | Response | ResponseLike>;
export declare type BeforeRedirectHook = (options: NormalizedOptions, response: Response) => Promisable<void>;
export declare type BeforeErrorHook = (error: RequestError) => Promisable<RequestError>;
export interface Hooks {
    init?: InitHook[];
    beforeRequest?: BeforeRequestHook[];
    beforeRedirect?: BeforeRedirectHook[];
    beforeError?: BeforeErrorHook[];
}
export declare type HookEvent = 'init' | 'beforeRequest' | 'beforeRedirect' | 'beforeError';
export declare const knownHookEvents: HookEvent[];
declare type AcceptableResponse = IncomingMessageWithTimings | ResponseLike;
declare type AcceptableRequestResult = AcceptableResponse | ClientRequest | Promise<AcceptableResponse | ClientRequest> | undefined;
export declare type RequestFunction = (url: URL, options: RequestOptions, callback?: (response: AcceptableResponse) => void) => AcceptableRequestResult;
export declare type Headers = Record<string, string | string[] | undefined>;
export interface Options extends URLOptions, SecureContextOptions {
    request?: RequestFunction;
    agent?: Agents | false;
    decompress?: boolean;
    timeout?: Delays | number;
    prefixUrl?: string | URL;
    body?: string | Buffer | Readable;
    form?: {
        [key: string]: any;
    };
    json?: {
        [key: string]: any;
    };
    url?: string | URL;
    cookieJar?: PromiseCookieJar | ToughCookieJar;
    ignoreInvalidCookies?: boolean;
    searchParams?: string | {
        [key: string]: string | number | boolean | null;
    } | URLSearchParams;
    dnsCache?: CacheableLookup | boolean;
    context?: object;
    hooks?: Hooks;
    followRedirect?: boolean;
    maxRedirects?: number;
    cache?: string | CacheableRequest.StorageAdapter | false;
    throwHttpErrors?: boolean;
    username?: string;
    password?: string;
    http2?: boolean;
    allowGetBody?: boolean;
    lookup?: CacheableLookup['lookup'];
    rejectUnauthorized?: boolean;
    headers?: Headers;
    methodRewriting?: boolean;
    localAddress?: string;
    socketPath?: string;
    method?: Method;
    createConnection?: (options: http.RequestOptions, oncreate: (error: Error, socket: Socket) => void) => Socket;
}
export interface NormalizedOptions extends Options {
    method: Method;
    url: URL;
    timeout: Delays;
    prefixUrl: string;
    ignoreInvalidCookies: boolean;
    decompress: boolean;
    searchParams?: URLSearchParams;
    cookieJar?: PromiseCookieJar;
    headers: Headers;
    context: object;
    hooks: Required<Hooks>;
    followRedirect: boolean;
    maxRedirects: number;
    cache?: string | CacheableRequest.StorageAdapter;
    throwHttpErrors: boolean;
    dnsCache?: CacheableLookup;
    http2: boolean;
    allowGetBody: boolean;
    rejectUnauthorized: boolean;
    lookup?: CacheableLookup['lookup'];
    methodRewriting: boolean;
    username: string;
    password: string;
    [kRequest]: HttpRequestFunction;
    [kIsNormalizedAlready]?: boolean;
}
export interface Defaults {
    timeout: Delays;
    prefixUrl: string;
    method: Method;
    ignoreInvalidCookies: boolean;
    decompress: boolean;
    context: object;
    cookieJar?: PromiseCookieJar | ToughCookieJar;
    dnsCache?: CacheableLookup;
    headers: Headers;
    hooks: Required<Hooks>;
    followRedirect: boolean;
    maxRedirects: number;
    cache?: string | CacheableRequest.StorageAdapter;
    throwHttpErrors: boolean;
    http2: boolean;
    allowGetBody: boolean;
    rejectUnauthorized: boolean;
    methodRewriting: boolean;
    agent?: Agents | false;
    request?: RequestFunction;
    searchParams?: URLSearchParams;
    lookup?: CacheableLookup['lookup'];
    localAddress?: string;
    createConnection?: Options['createConnection'];
}
export interface Progress {
    percent: number;
    transferred: number;
    total?: number;
}
export interface PlainResponse extends IncomingMessageWithTimings {
    requestUrl: string;
    redirectUrls: string[];
    request: Request;
    ip?: string;
    isFromCache: boolean;
    statusCode: number;
    url: string;
    timings: Timings;
}
export interface Response<T = unknown> extends PlainResponse {
    body: T;
    rawBody: Buffer;
    retryCount: number;
}
export interface RequestEvents<T> {
    on(name: 'request', listener: (request: http.ClientRequest) => void): T;
    on<R extends Response>(name: 'response', listener: (response: R) => void): T;
    on<R extends Response, N extends NormalizedOptions>(name: 'redirect', listener: (response: R, nextOptions: N) => void): T;
    on(name: 'uploadProgress' | 'downloadProgress', listener: (progress: Progress) => void): T;
}
export declare class RequestError extends Error {
    code?: string;
    stack: string;
    readonly options: NormalizedOptions;
    readonly response?: Response;
    readonly request?: Request;
    readonly timings?: Timings;
    constructor(message: string, error: Partial<Error & {
        code?: string;
    }>, self: Request | NormalizedOptions);
}
export declare class MaxRedirectsError extends RequestError {
    readonly response: Response;
    readonly request: Request;
    readonly timings: Timings;
    constructor(request: Request);
}
export declare class HTTPError extends RequestError {
    readonly response: Response;
    readonly request: Request;
    readonly timings: Timings;
    constructor(response: Response);
}
export declare class CacheError extends RequestError {
    readonly request: Request;
    constructor(error: Error, request: Request);
}
export declare class UploadError extends RequestError {
    readonly request: Request;
    constructor(error: Error, request: Request);
}
export declare class TimeoutError extends RequestError {
    readonly request: Request;
    readonly timings: Timings;
    readonly event: string;
    constructor(error: TimedOutTimeoutError, timings: Timings, request: Request);
}
export declare class ReadError extends RequestError {
    readonly request: Request;
    readonly response: Response;
    readonly timings: Timings;
    constructor(error: Error, request: Request);
}
export declare class UnsupportedProtocolError extends RequestError {
    constructor(options: NormalizedOptions);
}
export default class Request extends Duplex implements RequestEvents<Request> {
    ['constructor']: typeof Request;
    [kUnproxyEvents]: () => void;
    _cannotHaveBody: boolean;
    [kDownloadedSize]: number;
    [kUploadedSize]: number;
    [kStopReading]: boolean;
    [kTriggerRead]: boolean;
    [kBody]: Options['body'];
    [kJobs]: Array<() => void>;
    [kBodySize]?: number;
    [kServerResponsesPiped]: Set<ServerResponse>;
    [kIsFromCache]?: boolean;
    [kStartedReading]?: boolean;
    [kCancelTimeouts]?: () => void;
    [kResponseSize]?: number;
    [kResponse]?: IncomingMessageWithTimings;
    [kOriginalResponse]?: IncomingMessageWithTimings;
    [kRequest]?: ClientRequest;
    _noPipe?: boolean;
    _progressCallbacks: Array<() => void>;
    options: NormalizedOptions;
    requestUrl: string;
    requestInitialized: boolean;
    redirects: string[];
    constructor(url: string | URL, options?: Options, defaults?: Defaults);
    static normalizeArguments(url?: string | URL, options?: Options, defaults?: Defaults): NormalizedOptions;
    _lockWrite(): void;
    _unlockWrite(): void;
    _finalizeBody(): Promise<void>;
    _onResponse(response: IncomingMessageWithTimings): Promise<void>;
    _onRequest(request: ClientRequest): void;
    _createCacheableRequest(url: URL, options: RequestOptions): Promise<ClientRequest | ResponseLike>;
    _makeRequest(): Promise<void>;
    _beforeError(error: Error): Promise<void>;
    _read(): void;
    _write(chunk: any, encoding: string, callback: (error?: Error | null) => void): void;
    _writeRequest(chunk: any, encoding: string, callback: (error?: Error | null) => void): void;
    _final(callback: (error?: Error | null) => void): void;
    _destroy(error: Error | null, callback: (error: Error | null) => void): void;
    readonly ip: string | undefined;
    readonly aborted: boolean;
    readonly socket: Socket | undefined;
    readonly downloadProgress: Progress;
    readonly uploadProgress: Progress;
    readonly timings: Timings | undefined;
    readonly isFromCache: boolean | undefined;
    readonly _response: Response | undefined;
    pipe<T extends NodeJS.WritableStream>(destination: T, options?: {
        end?: boolean;
    }): T;
    unpipe<T extends NodeJS.WritableStream>(destination: T): this;
}
export {};