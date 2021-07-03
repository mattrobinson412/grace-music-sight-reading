\echo 'Delete and recreate gracemusic db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE gracemusic;
CREATE DATABASE gracemusic;
\connect gracemusic

\i gm-schema.sql
\i gm-seed.sql

\echo 'Delete and recreate gracemusic_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE gracemusic_test;
CREATE DATABASE gracemusic_test;
\connect gracemusic_test

\i gm-schema.sql
