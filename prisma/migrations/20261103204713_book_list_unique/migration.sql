/*
  Warnings:

  - A unique constraint covering the columns `[book_name,publisher,class_id]` on the table `book_list` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "book_list_book_name_publisher_class_id_key" ON "book_list"("book_name", "publisher", "class_id");
