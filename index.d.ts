/// <reference types="node" />
import { IncomingMessage, ServerResponse, Server } from "http";
import { AxiosAdapter, AxiosInstance } from "axios";
declare type RequestListener = (request: IncomingMessage, response: ServerResponse) => void;
declare const createAdapter: (callback: RequestListener) => AxiosAdapter;
declare const axiosist: (callback: RequestListener | Server) => AxiosInstance;
export { createAdapter };
export default axiosist;
