import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { any, number } from 'joi';
import { BookInfo } from 'src/books/entities/bookInfo.entity';

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async createIndex() {
    await this.elasticsearchService.indices.create({
      index: 'book',
      body: {
        settings: {
          analysis: {
            tokenizer: {
              book_tokenizer: {
                type: 'nori_tokenizer',
              },
            },
            filter: {
              book_filter: {
                type: 'nori_part_of_speech',
              },
            },
            analyzer: {
              book_analyzer: {
                type: 'custom',
                tokenizer: 'book_tokenizer',
                filter: ['nori_part_of_speech'],
              },
            },
          },
        },
        mappings: {
          properties: {
            id: {
              type: 'integer',
            },
            title: {
              type: 'text',
              analyzer: 'book_analyzer',
            },
            author: {
              type: 'text',
            },
            publisher: {
              type: 'text',
            },
            isbn: {
              type: 'text',
            },
            category: {
              type: 'keyword',
            },
            image: {
              type: 'text',
            },
            publishedAt: {
              type: 'date',
            },
          },
        },
      },
    });
  }

  async deleteIndex() {
    await this.elasticsearchService.indices.delete({
      index: 'book',
    });
  }

  async searchBook(
    query_word: string,
    from: number,
    size: number,
    sort?: string,
    category?: string,
  ) {
    const query: any = {
      match: {
        title: query_word,
      },
    };

    const searchResult = await this.elasticsearchService.search({
      index: 'book',
      body: {
        query,
        aggs: {
          group_by_category: {
            terms: {
              field: 'category',
            },
          },
        },
      },
      from,
      size,
    });

    const items: any[] = searchResult.body['hits']['hits'].flatMap(
      (hit) => hit._source,
    );
    const totalItems: number = searchResult.body['hits']['total']['value'];
    const buckets: any[] =
      searchResult.body['aggregations']['group_by_category']['buckets'];
    const categories: any[] = buckets.flatMap((bucket) => ({
      name: bucket.key,
      count: bucket.doc_count,
    }));
    return {
      items,
      categories,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: size,
        totalPages: Math.ceil(totalItems / size),
        currentPage: from + 1,
      },
    };
  }

  async bulkBooks(books: BookInfo[]) {
    await this.elasticsearchService.bulk({
      body: books.flatMap((doc) => [{ index: { _index: 'book' } }, doc]),
    });
  }
}
