declare module 'mongoose' {
  interface Model<T extends Document> {
    paginate(filter: any, options: QueryOptions): Promise<QueryResult>;
  }
}
