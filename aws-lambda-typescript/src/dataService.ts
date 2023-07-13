import mysql from 'mysql2';

export type queryResultType = {
  results: any;
  fields: any;
};

export class DataService {
  private readonly pool: mysql.Pool;

  constructor(
    private readonly host = process.env.TIDB_HOST || 'localhost',
    private readonly port = process.env.TIDB_PORT
      ? parseInt(process.env.TIDB_PORT)
      : 4000,
    private readonly user = process.env.TIDB_USER || 'root',
    private readonly password = process.env.TIDB_PASSWORD || '',
    private readonly database = 'test'
  ) {
    const pool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true,
      },
      waitForConnections: true,
      connectionLimit: 1,
      maxIdle: 1, // max idle connections, the default value is the same as `connectionLimit`
      idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
    this.pool = pool;
  }

  singleQuery(sql: string): Promise<queryResultType | mysql.QueryError> {
    return new Promise((resolve, reject) => {
      this.pool.query(sql, (err, results, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve({ results, fields });
        }
      });
    });
  }
}
