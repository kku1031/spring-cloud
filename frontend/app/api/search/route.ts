import { NextRequest, NextResponse } from 'next/server';

const API_GATEWAY_URL = process.env.API_GATEWAY_URL || 'http://discovery-server:8080';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('[Next.js API Route] Search request:', body);

    // API Gateway로 요청 전달 (Docker 네트워크 내부 통신)
    const backendResponse = await fetch(`${API_GATEWAY_URL}/api/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!backendResponse.ok) {
      console.error('[Next.js API Route] Backend error:', backendResponse.status);
      return NextResponse.json(
        { 
          message: '검색 요청에 실패했습니다.',
          code: backendResponse.status 
        },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    console.log('[Next.js API Route] Search response:', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('[Next.js API Route] Error:', error);
    return NextResponse.json(
      { 
        message: '서버 오류가 발생했습니다.',
        code: 500,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

