import { ObjectId, WithId } from 'mongodb';
import { db } from '../../db/mongo.db';
import { DeviceSession } from '../types/device-session';

export const sessionsRepository = {
  async create(session: DeviceSession): Promise<string> {
    const createdSession = await db.getCollections().sessionCollection.insertOne(session);

    return createdSession.insertedId.toString();
  },

  async update(deviceId: string, previousLastActiveDate: Date, lastActiveDate: Date, expiresAt: Date): Promise<void> {
    const updateResult = await db.getCollections().sessionCollection.updateOne(
      { deviceId, lastActiveDate: previousLastActiveDate },
      {
        $set: {
          lastActiveDate,
          expiresAt,
        },
      },
    );

    if (updateResult.matchedCount < 1) {
      throw new Error('Session not exist');
    }

    return;
  },

  async deleteManyExceptCurrent(userId: string, deviceId: string, lastActiveDate: Date): Promise<void> {
    const deleteResult = await db.getCollections().sessionCollection.deleteMany({
      userId,
      $nor: [{ deviceId, lastActiveDate }],
    });

    if (deleteResult.deletedCount < 1) {
      throw new Error('Session not exist');
    }

    return;
  },

  async deleteByDeviceIdAndUserId(deviceId: string, userId: string): Promise<boolean> {
    const deleteResult = await db.getCollections().sessionCollection.deleteOne({
      deviceId,
      userId,
    });

    return deleteResult.acknowledged;
  },

  async findById(id: string): Promise<WithId<DeviceSession> | null> {
    return await db.getCollections().sessionCollection.findOne({ _id: new ObjectId(id) });
  },
};
