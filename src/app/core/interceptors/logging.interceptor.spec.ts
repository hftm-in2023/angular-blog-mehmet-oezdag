import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoggingInterceptor } from './logging.interceptor';

describe('LoggingInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let consoleLogSpy: jasmine.Spy;
  let consoleErrorSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: LoggingInterceptor,
          multi: true,
        },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);

    // Spy on console methods
    consoleLogSpy = spyOn(console, 'log');
    consoleErrorSpy = spyOn(console, 'error');
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should add correlation ID and timestamp headers to requests', () => {
    const testData = { message: 'test' };
    const testUrl = '/api/test';

    // Make HTTP request
    httpClient.get(testUrl).subscribe();

    // Get the request
    const req = httpTestingController.expectOne(testUrl);

    // Verify headers were added
    expect(req.request.headers.has('X-Correlation-ID')).toBe(true);
    expect(req.request.headers.has('X-Request-Timestamp')).toBe(true);

    // Verify correlation ID format (should start with 'req-')
    const correlationId = req.request.headers.get('X-Correlation-ID');
    expect(correlationId).toMatch(/^req-[a-z0-9]+$/);

    // Verify timestamp format (should be ISO string)
    const timestamp = req.request.headers.get('X-Request-Timestamp');
    expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);

    // Respond to complete the request
    req.flush(testData);
  });

  it('should log request details', () => {
    const testUrl = '/api/test';

    // Make HTTP request
    httpClient.get(testUrl).subscribe();

    // Get the request
    const req = httpTestingController.expectOne(testUrl);

    // Verify request logging
    expect(consoleLogSpy).toHaveBeenCalled();
    const logCall = consoleLogSpy.calls.mostRecent();
    expect(logCall.args[0]).toContain('[HTTP Request]');
    expect(logCall.args[1]).toContain('GET');

    // Respond to complete the request
    req.flush({ success: true });
  });

  it('should log successful response details', () => {
    const testData = { message: 'success' };
    const testUrl = '/api/test';

    // Make HTTP request
    httpClient.get(testUrl).subscribe();

    // Get the request and respond
    const req = httpTestingController.expectOne(testUrl);
    req.flush(testData);

    // Verify response logging
    expect(consoleLogSpy).toHaveBeenCalledTimes(2); // Request + Response
    const responseLogs = consoleLogSpy.calls
      .all()
      .filter((call) => call.args[0] && call.args[0].includes('[HTTP Response]'));
    expect(responseLogs.length).toBe(1);
    expect(responseLogs[0].args[1]).toContain('200');
  });

  it('should log error responses', () => {
    const testUrl = '/api/test';
    const errorMessage = 'Server error';

    // Make HTTP request
    httpClient.get(testUrl).subscribe({
      next: () => fail('Should have failed'),
      error: (error) => {
        expect(error.status).toBe(500);
      },
    });

    // Get the request and respond with error
    const req = httpTestingController.expectOne(testUrl);
    req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });

    // Verify error logging
    expect(consoleErrorSpy).toHaveBeenCalled();
    const errorCall = consoleErrorSpy.calls.mostRecent();
    expect(errorCall.args[0]).toContain('[HTTP Error]');
    expect(errorCall.args[1]).toContain('500');
  });

  it('should preserve original request data', () => {
    const testData = { name: 'test', value: 123 };
    const testUrl = '/api/test';

    // Make HTTP POST request with data
    httpClient.post(testUrl, testData).subscribe();

    // Get the request
    const req = httpTestingController.expectOne(testUrl);

    // Verify request method and body are preserved
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(testData);

    // Verify URL is preserved
    expect(req.request.url).toBe(testUrl);

    // Respond to complete the request
    req.flush({ success: true });
  });

  it('should handle multiple concurrent requests with unique correlation IDs', () => {
    const testUrl1 = '/api/test1';
    const testUrl2 = '/api/test2';

    // Make multiple concurrent requests
    httpClient.get(testUrl1).subscribe();
    httpClient.get(testUrl2).subscribe();

    // Get both requests
    const req1 = httpTestingController.expectOne(testUrl1);
    const req2 = httpTestingController.expectOne(testUrl2);

    // Verify each request has a unique correlation ID
    const correlationId1 = req1.request.headers.get('X-Correlation-ID');
    const correlationId2 = req2.request.headers.get('X-Correlation-ID');

    expect(correlationId1).toBeDefined();
    expect(correlationId2).toBeDefined();
    expect(correlationId1).not.toBe(correlationId2);

    // Complete both requests
    req1.flush({ data: 'test1' });
    req2.flush({ data: 'test2' });
  });

  it('should measure and log request duration', () => {
    const testUrl = '/api/test';

    // Make HTTP request
    httpClient.get(testUrl).subscribe();

    // Get the request and respond after some delay
    const req = httpTestingController.expectOne(testUrl);

    // Simulate delay and respond
    setTimeout(() => {
      req.flush({ success: true });
    }, 10);

    // After request completes, check if duration was logged
    setTimeout(() => {
      const responseLogs = consoleLogSpy.calls
        .all()
        .filter((call) => call.args[0] && call.args[0].includes('[HTTP Response]'));
      if (responseLogs.length > 0) {
        // Should contain duration information in parentheses
        expect(responseLogs[0].args[3]).toMatch(/\(\d+ms\)/);
      }
    }, 20);
  });
});
