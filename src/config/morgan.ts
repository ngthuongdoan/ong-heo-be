import morgan from 'morgan';
import config from './config';
import logger from './logger';

import { ServerResponse } from 'http';

interface CustomServerResponse extends ServerResponse {
  locals?: Record<string, any>;
}
morgan.token('message', (_, res: CustomServerResponse) => res?.locals?.errorMessage || '');

const getIpFormat = () => (config.env === 'production' ? ':remote-addr - ' : '');
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

const successHandler = morgan(successResponseFormat, {
  skip: (req, res: CustomServerResponse) => res.statusCode >= 400,
  stream: { write: (message) => logger.info(message.trim()) },
});

const errorHandler = morgan(errorResponseFormat, {
  skip: (req, res: CustomServerResponse) => res.statusCode < 400,
  stream: { write: (message) => logger.error(message.trim()) },
});

export default { successHandler, errorHandler };
