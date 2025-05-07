export class APIRoute {
  public method: string;
  public url: string;
  public requestBody?: any;
  public queryParams?: any;

  constructor(
    method: string,
    url: string,
    requestBody?: any,
    queryParams?: any
  ) {
    this.method = method;
    this.url = url;
    this.requestBody = requestBody || {};
    this.queryParams = queryParams || {};
  }
}
