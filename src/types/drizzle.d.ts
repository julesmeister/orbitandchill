declare module 'drizzle-orm' {
  export const eq: any;
  export const and: any;
  export const or: any;
  export const not: any;
  export const isNull: any;
  export const isNotNull: any;
  export const inArray: any;
  export const like: any;
  export const count: any;
  export const countDistinct: any;
  export const sum: any;
  export const avg: any;
  export const min: any;
  export const max: any;
  export const desc: any;
  export const asc: any;
  export const sql: any;
  export * from 'drizzle-orm/index';
}

declare module 'drizzle-orm/libsql' {
  export * from 'drizzle-orm/libsql/index';
}