import { Router } from 'express';
import { accessTokenGuard } from '../../5-auth/router/guards/access.token.guard';
import { getActiveSessionsHandler } from './handlers/get-active-sessions.handler';
import { deleteSessionsExcludeCurrentHandler } from './handlers/delete-sessions-exclude-current.handler';
import { deleteSessionByIdHandler } from './handlers/delete-session-by-id.handler';

export const securityRouter = Router({});

securityRouter.get('/devices', accessTokenGuard, getActiveSessionsHandler);

securityRouter.delete('/devices', accessTokenGuard, deleteSessionsExcludeCurrentHandler);

securityRouter.delete('/devices/:deviceId', accessTokenGuard, deleteSessionByIdHandler);

// мидлвара обработки всех маршрутов, считая переходы -- IP:string, URL:string, date:Date --  req.baseUrl или req.originalUrl;

// Title для текущего устройства можно определить из заголовка "user-agent" при логине!!! - открытие сессии
// Заголовка "user-agent" может не быть, в таком случае, присваеваем значение по-умолчанию

// Для получения корректного ip-адреса из req.ip необходимо вызвать app.set('trust proxy', true) в index.ts.
