/**
 * 공통 API 클라이언트
 * 
 * 12개 서비스 (AI 에이전트 5개 + MS 7개)를 위한 재사용 가능한 API 클라이언트
 */

const REQUEST_TIMEOUT = 30000;
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

export interface FetchOptions extends RequestInit {
  retries?: number;
  timeout?: number;
}

/**
 * 재시도 로직이 포함된 fetch 함수
 * 
 * @param url - 요청 URL
 * @param options - fetch 옵션
 * @param retries - 재시도 횟수 (기본값: MAX_RETRIES)
 * @returns Promise<Response>
 */
export async function fetchWithRetry(
  url: string,
  options: FetchOptions = {},
  retries: number = options.retries ?? MAX_RETRIES
): Promise<Response> {
  const timeout = options.timeout ?? REQUEST_TIMEOUT;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // 5xx 에러인 경우 재시도
    if (!response.ok && response.status >= 500 && retries > 0) {
      console.log(
        `[API Client] 서버 에러 발생 (${response.status}), ${retries}회 재시도 남음`
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, options, retries - 1);
    }

    return response;
  } catch (error) {
    // 네트워크 에러인 경우 재시도
    if (retries > 0 && error instanceof Error) {
      if (
        error.name === 'AbortError' ||
        error.message.includes('fetch') ||
        error.message.includes('network')
      ) {
        console.log(`[API Client] 네트워크 에러 발생, ${retries}회 재시도 남음`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        return fetchWithRetry(url, options, retries - 1);
      }
    }
    throw error;
  }
}

/**
 * Gateway를 통한 백엔드 API 호출
 * 
 * @param endpoint - API 엔드포인트 (예: "/api/agent1")
 * @param params - 쿼리 파라미터
 * @param options - 추가 fetch 옵션
 * @returns Promise<Response>
 */
export async function fetchFromGateway(
  endpoint: string,
  params: Record<string, string> = {},
  options: FetchOptions = {}
): Promise<Response> {
  const gatewayHost = process.env.GATEWAY_HOST || 'gateway-server';
  const gatewayPort = process.env.GATEWAY_PORT || '8080';

  const queryString = new URLSearchParams(params).toString();
  const url = `http://${gatewayHost}:${gatewayPort}${endpoint}${queryString ? `?${queryString}` : ''}`;

  console.log(`[API Client] Gateway 요청: ${url}`);

  return fetchWithRetry(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    cache: 'no-store', // Next.js에서 fetch 캐싱 비활성화
    ...options,
  });
}

