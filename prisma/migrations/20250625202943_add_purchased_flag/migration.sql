-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reward" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "purchased" BOOLEAN NOT NULL DEFAULT false,
    "imageUrl" TEXT
);
INSERT INTO "new_Reward" ("cost", "description", "id", "imageUrl", "title") SELECT "cost", "description", "id", "imageUrl", "title" FROM "Reward";
DROP TABLE "Reward";
ALTER TABLE "new_Reward" RENAME TO "Reward";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
