import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { authService } from '@gateway/services/api/authService';

export class SearchController {
  public async gigById(req: Request, res: Response): Promise<void> {
    const { gigId } = req.params;
    const response: AxiosResponse = await authService.getGig(gigId);

    res.status(StatusCodes.OK).json({
      message: response.data.message,
      gig: response.data.gig
    });
  }

  public async gigs(req: Request, res: Response): Promise<void> {
    const { from, size, type } = req.params;

    let query = '';
    const objList = Object.entries(req.query);
    const lastItemIndex = objList.length - 1;
    objList.forEach(([key, value], index) => {
      query += `${key}=${value}${index !== lastItemIndex ? '&' : ''}`;
    });

    const response: AxiosResponse = await authService.getGigs(`${query}`, from, size, type);

    res.status(StatusCodes.OK).json({
      message: response.data.message,
      total: response.data.total,
      gigs: response.data.gigs
    });
  }
}
