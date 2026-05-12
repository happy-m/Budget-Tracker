ALTER TABLE accounts DROP CONSTRAINT accounts_ownership_check;
ALTER TABLE accounts DROP COLUMN ownership;
ALTER TABLE accounts DROP COLUMN currency;
ALTER TABLE accounts ADD COLUMN hidden BOOLEAN NOT NULL DEFAULT false;
