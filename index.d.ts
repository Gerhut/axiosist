/// <reference types="node" />
export = axiosist;
/**
 * @param {Handler} handler A handler, may be a request listener or a http server.
 * @returns {AxiosInstance} The axios instance would use for test.
 */
declare function axiosist(handler: Handler): AxiosInstance;
declare namespace axiosist {
    export { axiosist as default, createAdapter, AddressInfo, IncomingMessage, ServerResponse, AxiosAdapter, AxiosInstance, RequestListener, Handler };
}
type Handler = RequestListener | Server;
type AxiosInstance = import('axios').AxiosInstance;
/**
 * @param {Handler} handler A handler for axiosist, may be a request listener or a http server.
 * @returns {AxiosAdapter} The axios adapter would used in adapter options of axios.
 */
declare function createAdapter(handler: Handler): AxiosAdapter;
type AddressInfo = import('net').AddressInfo;
type IncomingMessage = import('http').IncomingMessage;
type ServerResponse = import('http').ServerResponse;
type AxiosAdapter = import('axios').AxiosAdapter;
type RequestListener = (request: IncomingMessage, response: ServerResponse) => void;
import { Server } from "http";
