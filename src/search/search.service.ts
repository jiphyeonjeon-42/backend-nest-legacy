import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
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
                filter: ['lowercase', 'asciifolding', 'nori_part_of_speech'],
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
              fielddata: true,
              fields: {
                keyword: {
                  type: 'keyword',
                },
              },
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
            createdAt: {
              type: 'date',
            },
            updatedAt: {
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

  async getCategoryAggs(query: any) {
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
      size: 0,
    });
    const buckets: any[] =
      searchResult.body['aggregations']['group_by_category']['buckets'];
    const categories: any[] = buckets.flatMap((bucket) => ({
      name: bucket.key,
      count: bucket.doc_count,
    }));
    const totalItems: number = searchResult.body['hits']['total']['value'];
    categories.unshift({ name: '전체', count: totalItems });
    return categories;
  }

  async searchBook(
    query_word: string,
    from: number,
    size: number,
    sort?: any,
    category?: string,
  ) {
    const query: any = {
      bool: {
        must: [
          {
            match: {
              title: query_word,
            },
          },
        ],
      },
    };
    const categoryAggs = await this.getCategoryAggs(query);
    if (category) query.bool.must.push({ match: { category } });
    const searchResult = await this.elasticsearchService.search({
      index: 'book',
      body: {
        query,
        sort,
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
    return {
      items,
      categories: categoryAggs,
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
