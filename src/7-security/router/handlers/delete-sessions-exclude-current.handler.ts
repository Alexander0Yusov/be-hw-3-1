import { Request, Response } from 'express';
import { usersQwRepository } from '../../../4-users/qw-repository/users-qw-repository';
import { HttpStatus } from '../../../core/types/HttpStatus';
import { createErrorMessages } from '../../../core/utils/error.utils';
import { sessionsService } from '../../application/sessions.service';

export async function deleteSessionsExcludeCurrentHandler(req: Request, res: Response) {
  try {
    const user = await usersQwRepository.findById(req.user!.id);

    if (!user) {
      res.status(HttpStatus.NotFound).send(createErrorMessages([{ field: 'id', message: 'User not found' }]));
      return;
    }

    const refreshToken = req.cookies.refreshToken;

    if (await sessionsService.deleteAllExceptCurrent(refreshToken)) {
      res.sendStatus(HttpStatus.NoContent);
      return;
    }

    res.sendStatus(HttpStatus.Forbidden);
  } catch (error: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
