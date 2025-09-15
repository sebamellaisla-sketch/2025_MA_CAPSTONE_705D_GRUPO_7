DB\_USER=postgres

DB\_PASSWORD=tu\_password\_aqui

DB\_HOST=localhost

DB\_PORT=5432

DB\_NAME=bordados\_testheb

PORT=3000

JWT\_SECRET=tu\_jwt\_secret\_aqui

EMAIL\_HOST=smtp.gmail.com

EMAIL\_PORT=587

EMAIL\_USER=tu\_email@gmail.com

EMAIL\_PASS=tu\_app\_password

EMAIL\_TO=email\_destino@gmail.com




agregar a la base de datos
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS attachment_url  TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS attachment_mime TEXT;

