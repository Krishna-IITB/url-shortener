export const up = (pgm) => {
  // Increase short_code length from varchar(10) to varchar(50)
  pgm.alterColumn('urls', 'short_code', {
    type: 'varchar(50)',
  });
};

export const down = (pgm) => {
  // Rollback: decrease back to varchar(10)
  pgm.alterColumn('urls', 'short_code', {
    type: 'varchar(10)',
  });
};
