import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, title, content, labels, blogId, autoPostTelegram, telegramPost, thumbnailUrl } = body;

    if (!token || !title || !content || !blogId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Publish to Blogger
    const payload: any = {
      kind: 'blogger#post',
      blog: { id: blogId },
      title: title,
      content: content,
    };

    if (labels && labels.length > 0) {
      payload.labels = labels;
    }

    const response = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || 'Failed to publish to Blogger' }, { status: response.status });
    }

    // 2. Post to Telegram if requested
    let telegramSuccess = false;
    let telegramError = null;

    if (autoPostTelegram && telegramPost) {
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;

      if (botToken && chatId) {
        try {
          let tgResponse;
          
          // If we have a thumbnail, send a photo with caption. Otherwise, just send text.
          if (thumbnailUrl && !thumbnailUrl.startsWith('data:')) {
            tgResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                photo: thumbnailUrl,
                caption: telegramPost
              })
            });
          } else {
            tgResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: telegramPost,
                disable_web_page_preview: false
              })
            });
          }

          if (tgResponse.ok) {
            telegramSuccess = true;
          } else {
            const tgData = await tgResponse.json();
            telegramError = tgData.description || 'Failed to post to Telegram';
            console.error('Telegram API Error:', tgData);
          }
        } catch (tgErr: any) {
          telegramError = tgErr.message;
          console.error('Telegram Request Error:', tgErr);
        }
      } else {
        telegramError = 'Telegram credentials not configured in environment variables.';
      }
    }

    return NextResponse.json({ 
      success: true, 
      url: data.url, 
      id: data.id,
      telegram: {
        attempted: autoPostTelegram,
        success: telegramSuccess,
        error: telegramError
      }
    });
  } catch (error: any) {
    console.error('Error publishing to Blogger:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
