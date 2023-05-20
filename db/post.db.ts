import PouchDB from 'pouchdb';
import { PostDto } from '../dtos';

export class PostDB {
  public readonly dbName = 'posts';

  private readonly _db;
  get db() {
    return this._db;
  }

  constructor() {
    this._db = new PouchDB<PostDto>(this.dbName);
  }

  async init() {
    Promise.all([
      this._db.createIndex({
        index: {
          fields: ['time'],
        },
      }),
    ]);
  }
}
