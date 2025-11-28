export const up = (pgm) => {
  // Create urls table
  pgm.createTable('urls', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    original_url: {
      type: 'text',
      notNull: true,
    },
    short_code: {
      type: 'varchar(10)',
      notNull: true,
      unique: true,
    },
    clicks: {
      type: 'integer',
      notNull: true,
      default: 0,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    expires_at: {
      type: 'timestamp',
      notNull: false,
    },
  });

  // Create index on short_code for faster lookups
  pgm.createIndex('urls', 'short_code', { unique: true });
  
  // Create index on original_url for duplicate detection
  pgm.createIndex('urls', 'original_url');
};

export const down = (pgm) => {
  pgm.dropTable('urls');
};
