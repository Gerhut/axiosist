import { Server, IncomingMessage, ServerResponse } from 'http'
import { AxiosAdapter, AxiosInstance } from 'axios';

declare type RequestListener = (req: IncomingMessage, res: ServerResponse) => void
declare type Handler = RequestListener | Server

declare const createAdapter: (handler: Handler) => AxiosAdapter
declare const axiosist: (handler: Handler) => AxiosInstance & {
  createAdapter: typeof createAdapter
}

export = axiosist
