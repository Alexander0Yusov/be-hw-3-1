import { Request, Response } from 'express';
import { usersQwRepository } from '../../../4-users/qw-repository/users-qw-repository';
import { HttpStatus } from '../../../core/types/HttpStatus';
import { createErrorMessages } from '../../../core/utils/error.utils';
import { sessionsService } from '../../application/sessions.service';
import { authService } from '../../../5-auth/domain/auth.service';

export async function deleteSessionByIdHandler(req: Request, res: Response) {
  try {
    const session = await sessionsService.findById(req.params.deviceId);

    if (!session) {
      res.status(HttpStatus.NotFound).send(createErrorMessages([{ field: 'deviceId', message: 'Device not found' }]));
      return;
    }

    const user = await usersQwRepository.findById(req.user!.id);

    if (!user) {
      res.status(HttpStatus.Unauthorized).send(createErrorMessages([{ field: 'user', message: 'Unauthorized' }]));
      return;
    }

    if (req.user!.id !== session.userId) {
      res.status(HttpStatus.Forbidden).send(createErrorMessages([{ field: 'user', message: 'Forbidden' }]));
      return;
    }

    await sessionsService.deleteOne(session.deviceId, session.userId);

    // отозвать токен
    await authService.logoutDeviceById(session.deviceId);

    res.sendStatus(HttpStatus.NoContent);
    return;
  } catch (error: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
