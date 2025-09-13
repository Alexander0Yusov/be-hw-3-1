import { Request, Response } from 'express';
import { usersQwRepository } from '../../../4-users/qw-repository/users-qw-repository';
import { HttpStatus } from '../../../core/types/HttpStatus';
import { createErrorMessages } from '../../../core/utils/error.utils';
import { sessionsQwRepository } from '../../qw-repository/sessions-qw-repository';

export async function getActiveSessionsHandler(req: Request, res: Response) {
  try {
    const user = await usersQwRepository.findById(req.user!.id);

    if (!user) {
      res.status(HttpStatus.NotFound).send(createErrorMessages([{ field: 'id', message: 'User not found' }]));
      return;
    }

    const activeSessions = await sessionsQwRepository.findMany(user.id);

    res.status(HttpStatus.Ok).send(activeSessions);
  } catch (error: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
