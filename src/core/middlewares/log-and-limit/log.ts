import { Request, Response, NextFunction } from 'express';
import { collection } from './db'; // подключение к MongoDB

export const logAndRateLimit = async (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip;
  const url = req.originalUrl;
  const now = new Date();
  const tenSecondsAgo = new Date(now.getTime() - 10_000);

  // Логируем обращение
  await collection.insertOne({ IP: ip, URL: url, date: now });

  // Считаем количество обращений за последние 10 секунд
  const recentCount = await collection.countDocuments({
    IP: ip,
    URL: url,
    date: { $gte: tenSecondsAgo },
  });

  console.log(`[${ip}] -> ${url} | Count in last 10s: ${recentCount}`);

  // Можно добавить ограничение, если нужно
  if (recentCount > 10) {
    return res.status(429).send('Too many requests');
  }

  next();
};
