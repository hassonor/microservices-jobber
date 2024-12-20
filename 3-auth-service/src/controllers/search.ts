import { Request, Response } from 'express';
import { IPaginateProps, ISearchResult, ISellerGig } from '@ohjobber/shared';
import { gigById, gigsSearch } from '@auth/services/search';
import { sortBy } from 'lodash';
import { StatusCodes } from 'http-status-codes';

export async function gigs(req: Request, res: Response) {
  try {
    const { from, size, type } = req.params;
    let resultHits: ISellerGig[] = [];
    const paginate: IPaginateProps = { from, size: parseInt(`${size}`), type };
    const gigs: ISearchResult = await gigsSearch(
      `${req.query.query}`,
      paginate,
      `${req.query.delivery_time}`,
      parseInt(`${req.query.minPrice}`),
      parseInt(`${req.query.maxPrice}`)
    );

    for (const item of gigs.hits) {
      resultHits.push(item._source as ISellerGig);
    }

    if (type === 'backward') {
      resultHits = sortBy(resultHits, ['sortId']);
    }

    res.status(StatusCodes.OK).json({ message: 'Search gigs results', total: gigs.total, gigs: resultHits });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while processing your request.' });
  }
}

export async function singleGigById(req: Request, res: Response): Promise<void> {
  try {
    const gig = await gigById('gigs', req.params.gigId);

    res.status(StatusCodes.OK).json({ message: 'Single gig result', gig: gig });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while processing your request.' });
  }
}
