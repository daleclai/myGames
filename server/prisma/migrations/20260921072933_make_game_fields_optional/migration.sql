-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rawgId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "description" TEXT
);
INSERT INTO "new_Game" ("description", "id", "imageUrl", "name", "rawgId") SELECT "description", "id", "imageUrl", "name", "rawgId" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
CREATE UNIQUE INDEX "Game_rawgId_key" ON "Game"("rawgId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
