import { Injectable, NotFoundException } from '@nestjs/common';
import { CopyStatus } from '@bookbot/db';
import { BooksRepository } from './books.repository';
import {
  BookDetailResponse,
  BookEditionResponse,
  BookItemResponse,
} from './responses/book-detail.response';

type BookWithEditions = NonNullable<
  Awaited<ReturnType<BooksRepository['findBySlug']>>
>;

@Injectable()
export class BooksService {
  constructor(private readonly booksRepository: BooksRepository) {}

  async getBookBySlug(slug: string): Promise<BookDetailResponse> {
    const book = await this.booksRepository.findBySlug(slug);

    if (!book) {
      throw new NotFoundException(`Book with slug "${slug}" not found`);
    }

    const editions = this.mapEditions(book.editions);
    const inStock = editions.some((e) => e.availableCount > 0);

    return {
      id: book.id,
      slug: book.slug,
      name: book.name,
      description: book.description,
      editions,
      inStock,
    };
  }

  private mapEditions(
    editions: BookWithEditions['editions'],
  ): BookEditionResponse[] {
    return editions.map((edition) => {
      const items: BookItemResponse[] = edition.items.map((item) => ({
        id: item.id,
        condition: item.condition,
        price: Number(item.price),
        status: item.status,
      }));

      const availableCount = edition.items.filter(
        (item) => item.status === CopyStatus.AVAILABLE,
      ).length;

      return {
        id: edition.id,
        language: edition.language,
        binding: edition.binding,
        yearPublished: edition.yearPublished,
        pageCount: edition.pageCount,
        readingTimeMinutes: edition.readingTimeMinutes,
        description: edition.description,
        isbn: edition.isbn,
        coverImageUrl: edition.coverImageUrl,
        publisher: edition.publisher
          ? { id: edition.publisher.id, name: edition.publisher.name }
          : null,
        authors: edition.authors.map((a) => ({
          id: a.author.id,
          name: a.author.name,
          slug: a.author.slug,
        })),
        items,
        availableCount,
      };
    });
  }
}
