import { Request, Response } from 'express';
import { usersQwRepository } from '../../../4-users/qw-repository/users-qw-repository';
import { HttpStatus } from '../../../core/types/HttpStatus';
import { createErrorMessages } from '../../../core/utils/error.utils';
import { sessionsService } from '../../application/sessions.service';

export async function deleteSessionByIdHandler(req: Request, res: Response) {
  try {
    const session = await sessionsService.findById(req.params.id);

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

    const refreshToken = req.cookies.refreshToken;

    await sessionsService.deleteOne(refreshToken);

    res.status(HttpStatus.NoContent);
  } catch (error: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
