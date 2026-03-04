import { Controller, Get, Param } from '@nestjs/common';
import { BooksService } from './books.service';
import { BookDetailResponse } from './responses/book-detail.response';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get(':slug')
  async getBook(@Param('slug') slug: string): Promise<BookDetailResponse> {
    return this.booksService.getBookBySlug(slug);
  }
}
