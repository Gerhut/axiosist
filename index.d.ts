/// <reference types="node" />
import { IncomingMessage, ServerResponse, Server } from "http";
import { AxiosAdapter, AxiosInstance } from "axios";

declare type RequestListener = (request: IncomingMessage, response: ServerResponse) => void;
declare type Handler = RequestListener | Server;

declare const createAdapter: (handler: Handler) => AxiosAdapter;
declare const axiosist: (handler: Handler) => AxiosInstance;

export { createAdapter };
export default axiosist;
