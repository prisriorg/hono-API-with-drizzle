import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {

  id: integer('id').primaryKey(),
  name: text(),
  email: text(),
  password: text(),
  created_at: text(),
  updated_at: text(),

});