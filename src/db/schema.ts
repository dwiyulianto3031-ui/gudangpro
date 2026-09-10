import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  varchar,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    username: varchar("username", { length: 50 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    fullName: varchar("full_name", { length: 150 }).notNull(),
    role: varchar("role", { length: 20 }).notNull().default("pic"), // admin | pic
    email: varchar("email", { length: 150 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    usernameUnique: uniqueIndex("users_username_unique").on(table.username),
  }),
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
    userName: varchar("user_name", { length: 150 }),
    action: varchar("action", { length: 50 }).notNull(), // CREATE, UPDATE, DELETE, LOGIN, EXPORT, IMPORT, ADJUST
    entityType: varchar("entity_type", { length: 50 }).notNull(), // user, product, movement
    entityId: integer("entity_id"),
    description: text("description"),
    metadata: text("metadata"), // JSON
    ipAddress: varchar("ip_address", { length: 50 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    userIdx: index("audit_logs_user_idx").on(table.userId),
    actionIdx: index("audit_logs_action_idx").on(table.action),
    entityIdx: index("audit_logs_entity_idx").on(table.entityType, table.entityId),
    createdIdx: index("audit_logs_created_idx").on(table.createdAt),
  }),
);

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    sku: varchar("sku", { length: 50 }).notNull(),
    name: varchar("name", { length: 200 }).notNull(),
    category: varchar("category", { length: 100 }).notNull().default("Umum"),
    unit: varchar("unit", { length: 20 }).notNull().default("pcs"),
    brand: varchar("brand", { length: 100 }), // merk
    model: varchar("model", { length: 150 }), // tipe/varian
    minStock: integer("min_stock").notNull().default(10),
    // Stok terbagi menjadi 2: Baru dan Retur
    newStock: integer("new_stock").notNull().default(0),
    returnStock: integer("return_stock").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    skuUnique: uniqueIndex("products_sku_unique").on(table.sku),
    categoryIdx: index("products_category_idx").on(table.category),
  }),
);

export const stockMovements = pgTable(
  "stock_movements",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    type: varchar("type", { length: 10 }).notNull(), // 'in' | 'out'
    source: varchar("source", { length: 10 }).notNull().default("new"), // 'new' | 'return' - sumber/kategori stok
    quantity: integer("quantity").notNull(),
    ticketNo: varchar("ticket_no", { length: 50 }),
    storeName: varchar("store_name", { length: 150 }),
    serialNumber: varchar("serial_number", { length: 150 }),
    barcode: varchar("barcode", { length: 150 }),
    assetStatus: varchar("asset_status", { length: 50 }),
    itemType: varchar("item_type", { length: 100 }), // tipe barang (opsional)
    resi: text("resi"), // JSON array nomor resi pengiriman
    driveLink: text("drive_link"), // link google drive bukti serah terima
    note: text("note"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    productIdx: index("stock_movements_product_idx").on(table.productId),
    userIdx: index("stock_movements_user_idx").on(table.userId),
    createdIdx: index("stock_movements_created_idx").on(table.createdAt),
    snIdx: index("stock_movements_sn_idx").on(table.serialNumber),
    barcodeIdx: index("stock_movements_barcode_idx").on(table.barcode),
  }),
);
