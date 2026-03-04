import { Controller, Get, Param, Query } from '@nestjs/common';
import type { BookDetailResponse, BookFiltersResponse, BookListResponse } from '@bookbot/book-utils';
import { BooksService } from './books.service';
import { ListBooksQueryDto } from './dto/list-books-query.dto';


@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  async listBooks(
    @Query() query: ListBooksQueryDto,
  ): Promise<BookListResponse> {
    return this.booksService.listBooks(query);
  }

  @Get('filters')
  async getFilters(): Promise<BookFiltersResponse> {
    return this.booksService.getFilters();
  }

  @Get(':slug')
  async getBook(@Param('slug') slug: string): Promise<BookDetailResponse> {
    return this.booksService.getBookBySlug(slug);
  }
}
