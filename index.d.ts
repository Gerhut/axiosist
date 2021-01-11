import { Server, IncomingMessage, ServerResponse } from 'http'
import { AxiosAdapter, AxiosInstance } from 'axios';

declare type RequestListener = (req: IncomingMessage, res: ServerResponse) => void
declare type Handler = RequestListener | Server

declare const axiosist: (handler: Handler) => AxiosInstance

export default axiosist
export const createAdapter: (handler: Handler) => AxiosAdapter
export { AxiosAdapter, AxiosInstance }
