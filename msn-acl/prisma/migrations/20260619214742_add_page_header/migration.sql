-- CreateTable
CREATE TABLE "PageHeader" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pageKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "backgroundImage" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "PageHeader_pageKey_key" ON "PageHeader"("pageKey");
