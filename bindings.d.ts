import { Env } from 'hono';

type Environment = Env & {
  Bindings: {
    DB: D1Database;
    BUCKET: R2Bucket;
    SECRET_KEY: string;
    ENV_TYPE: 'dev' | 'prod' | 'stage';
  };
};