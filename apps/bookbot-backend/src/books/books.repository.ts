import { Injectable } from '@nestjs/common';
import { PrismaService } from '@bookbot/db';

@Injectable()
export class BooksRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findBySlug(slug: string) {
    return this.prisma.book.findUnique({
      where: { slug },
      include: {
        editions: {
          include: {
            publisher: true,
            authors: {
              include: { author: true },
            },
            items: {
              orderBy: { price: 'asc' },
            },
          },
        },
      },
    });
  }
}

