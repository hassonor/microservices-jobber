import { AxiosService } from '@gateway/services/axiosService';
import { gatewayConfig } from '@gateway/config';
import axios, { AxiosResponse } from 'axios';

export let axiosBuyerInstance: ReturnType<typeof axios.create>;

class BuyerService {
  constructor() {
    const axiosService: AxiosService = new AxiosService(`${gatewayConfig.USERS_BASE_URL}/api/v1/buyer`, 'buyer');
    axiosBuyerInstance = axiosService.axios;
  }

  async getCurrentBuyerByUsername(): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosBuyerInstance.get('/username');
    return response;
  }

  async getBuyerByUsername(username: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosBuyerInstance.get(`/${username}`);
    return response;
  }

  async getBuyerByEmail(): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosBuyerInstance.get('/email');
    return response;
  }
}

export const buyerService: BuyerService = new BuyerService();
