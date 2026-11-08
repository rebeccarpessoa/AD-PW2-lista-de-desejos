import { bigint, boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const items = pgTable('items', {
  id: bigint('id', { mode: 'number' })
    .primaryKey()
    .generatedByDefaultAsIdentity(),
  name: text('name').notNull(),
  description: text('description'),
  image: text('image'),
  isPublished: boolean('is_published').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});