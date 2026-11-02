CREATE TABLE "Brand" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");
CREATE INDEX "Brand_name_idx" ON "Brand"("name");

INSERT INTO "Brand" ("id", "name") VALUES
  ('brand_toyota', 'Toyota'),
  ('brand_mercedes', 'Mercedes'),
  ('brand_bmw', 'BMW'),
  ('brand_audi', 'Audi'),
  ('brand_lexus', 'Lexus'),
  ('brand_hyundai', 'Hyundai'),
  ('brand_kia', 'Kia'),
  ('brand_nissan', 'Nissan'),
  ('brand_peugeot', 'Peugeot'),
  ('brand_ford', 'Ford')
ON CONFLICT ("name") DO NOTHING;
