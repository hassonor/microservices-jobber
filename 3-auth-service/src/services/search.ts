import { elasticSearchClient, getDocumentById } from '@auth/elasticsearch';
import { IHitsTotal, IPaginateProps, IQueryList, ISearchResult, ISellerGig } from '@ohjobber/shared';
import { SearchResponse } from '@elastic/elasticsearch/lib/api/types';

export async function gigById(index: string, gigId: string): Promise<ISellerGig> {
  const gig: ISellerGig = await getDocumentById(index, gigId);
  return gig;
}

export async function gigsSearch(
  searchQuery: string,
  paginate: IPaginateProps,
  deliveryTime?: string,
  min?: number,
  max?: number
): Promise<ISearchResult> {
  try {
    const { from, size, type } = paginate;
    const queryList: IQueryList[] = [
      {
        query_string: {
          fields: ['username', 'title', 'description', 'basicDescription', 'basicTitle', 'categories', 'subCategories', 'tags'],
          query: `*${searchQuery}*`
        }
      },
      {
        term: {
          active: true
        }
      }
    ];
    if (deliveryTime !== 'undefined') {
      queryList.push({
        query_string: {
          fields: ['expectedDelivery'],
          query: `*${deliveryTime}*`
        }
      });
    }

    if (!isNaN(parseInt(`${min}`)) && !isNaN(parseInt(`${max}`))) {
      queryList.push({
        range: {
          price: {
            gte: min,
            lte: max
          }
        }
      });
    }

    const result: SearchResponse = await elasticSearchClient.search({
      index: 'gigs',
      size,
      query: {
        bool: {
          must: [...queryList]
        }
      },
      sort: [
        {
          sortId: type === 'forward' ? 'asc' : 'desc'
        }
      ],
      ...(from !== '0' && { search_after: [from] })
    });
    const total: IHitsTotal = result.hits.total as IHitsTotal;
    return {
      total: total.value,
      hits: result.hits.hits
    };
  } catch (error) {
    console.error('Error during gigs search:', error);
    throw new Error('Failed to perform search. Please try again later.');
  }
}
