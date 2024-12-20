import axios from 'axios';
import { sign } from 'jsonwebtoken';
import { gatewayConfig } from '@gateway/config';

export class AxiosService {
  public axios: ReturnType<typeof axios.create>;

  constructor(baseUrl: string, serviceName: string) {
    this.axios = this.axiosCreateInstance(baseUrl, serviceName);
  }

  public axiosCreateInstance(baseUrl: string, serviceName?: string): ReturnType<typeof axios.create> {
    let requestJWTGatewayToken = '';
    if (serviceName) {
      requestJWTGatewayToken = sign({ id: serviceName }, `${gatewayConfig.GATEWAY_JWT_TOKEN}`);
    }

    const instance: ReturnType<typeof axios.create> = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        gatewaytoken: requestJWTGatewayToken
      },
      withCredentials: true
    });

    return instance;
  }
}
