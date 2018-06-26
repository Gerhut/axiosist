/// <reference types="node" />
import { IncomingMessage, ServerResponse } from "http";
import { AxiosAdapter, AxiosInstance } from "axios";
declare type RequestListener = (request: IncomingMessage, response: ServerResponse) => void;
declare const createAdapter: (callback: RequestListener) => AxiosAdapter;
declare const axiosist: (callback: RequestListener) => AxiosInstance;
export { createAdapter };
export default axiosist;
