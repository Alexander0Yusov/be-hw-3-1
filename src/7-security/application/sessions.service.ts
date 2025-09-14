import { jwtService } from '../../5-auth/adapters/jwt.service';
import { DeviceSession } from '../types/device-session';
import { sessionsRepository } from '../repository/sessions.repository';

export const sessionsService = {
  async createSession(refreshToken: string, ip: string, deviceName: string): Promise<string> {
    const decoded = (await jwtService.decodeToken(refreshToken)) as unknown as {
      userId: string;
      deviceId: string;
      iat: number;
      exp: number;
    };

    console.log(4545, decoded);

    const newSession: DeviceSession = {
      userId: decoded.userId,
      deviceId: decoded.deviceId,
      ip,
      deviceName,
      lastActiveDate: new Date(decoded.iat * 1000),
      expiresAt: new Date(decoded.exp * 1000),
    };

    console.log(44, newSession);

    return await sessionsRepository.create(newSession);
  },

  async update(incomeRefreshToken: string, newRefreshToken: string) {
    const incomeDecodedToken = (await jwtService.decodeToken(incomeRefreshToken)) as unknown as {
      deviceId: string;
      iat: number;
    };

    const newDecodedToken = (await jwtService.decodeToken(newRefreshToken)) as unknown as {
      iat: number;
      exp: number;
    };

    await sessionsRepository.update(
      incomeDecodedToken.deviceId,
      new Date(incomeDecodedToken.iat * 1000),
      new Date(newDecodedToken.iat * 1000),
      new Date(newDecodedToken.exp * 1000),
    );
  },

  async deleteAllExceptCurrent(refreshToken: string): Promise<boolean> {
    const decoded = (await jwtService.decodeToken(refreshToken)) as unknown as {
      userId: string;
      deviceId: string;
      iat: number;
    };

    return await sessionsRepository.deleteManyExceptCurrent(decoded.userId, decoded.deviceId);
  },

  async deleteOne(deviceId: string, userId: string) {
    return await sessionsRepository.deleteByDeviceIdAndUserId(deviceId, userId);
  },

  async findById(deviceId: string) {
    return await sessionsRepository.findById(deviceId);
  },
};

// export async function listUserDevices(userId: string) {
//   const devices = await devicesSessions
//     .find({ userId })
//     .project({
//       _id: 0,
//       deviceId: 1,
//       ip: 1,
//       title: 1,
//       lastActiveDate: 1,
//     })
//     .toArray();
//   return devices;
// }

// export async function deleteOtherDevices(userId: string, keepDeviceId: string) {
//   const res = await devicesSessions.deleteMany({
//     userId,
//     deviceId: { $ne: keepDeviceId },
//   });
//   return res.deletedCount ?? 0;
// }

// export async function deleteDeviceById(userId: string, deviceIdToDelete: string, currentDeviceId: string) {
//   const target = await devicesSessions.findOne({ deviceId: deviceIdToDelete });
//   if (!target) return { code: 404 as const };

//   if (target.userId !== userId) return { code: 403 as const };

//   if (target.deviceId === currentDeviceId) {
//     // удаление текущего устройства через этот эндпоинт можно запретить или разрешить — на твой выбор
//     // вернём 204 (разрешено) или 400/403 (запрещено). Используем 204.
//   }

//   await devicesSessions.deleteOne({ userId, deviceId: deviceIdToDelete });
//   return { code: 204 as const };
// }
