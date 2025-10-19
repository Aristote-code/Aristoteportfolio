import { Hono } from 'npm:hono';
import * as kv from './kv_store.tsx';

const ADMIN_EMAIL = 'gahimaaristote1@gmail.com';

// Get site origin from environment or construct from Supabase URL
function getSiteOrigin(): string {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  // Extract project reference from Supabase URL to construct the app URL
  const match = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
  if (match) {
    const projectRef = match[1];
    return `https://${projectRef}.supabase.co`;
  }
  return 'https://yoursite.com'; // fallback
}

interface Comment {
  id: string;
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
  text: string;
  author: string;
  userId: string;
  timestamp: string;
  pagePath: string;
  status: 'open' | 'resolved' | 'hidden';
  replies: Reply[];
}

interface Reply {
  id: string;
  text: string;
  author: string;
  userId: string;
  timestamp: string;
}

const commentsRouter = new Hono();

// Rate limiting map (IP -> array of timestamps)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 comments per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const requests = rateLimitMap.get(ip) || [];
  
  // Remove old requests outside the window
  const recentRequests = requests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= RATE_LIMIT_MAX) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return true;
}

function sanitizeText(text: string, maxLength: number = 500): string {
  // Basic XSS prevention - strip HTML tags and limit length
  return text
    .replace(/<[^>]*>/g, '')
    .substring(0, maxLength)
    .trim();
}

async function sendEmailNotification(comment: Comment, isReply: boolean = false) {
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  
  if (!resendApiKey) {
    console.error('RESEND_API_KEY not configured');
    return;
  }

  const siteOrigin = getSiteOrigin();
  const deepLink = `${siteOrigin}${comment.pagePath}?comment=${comment.id}`;
  
  const subject = isReply 
    ? `💬 New reply on your portfolio`
    : `📌 New comment on your portfolio`;

  const authorInfo = `<p style="margin: 5px 0; font-weight: 600;">From: ${comment.author}</p>`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #8774ff; color: white; padding: 25px; border-radius: 12px 12px 0 0; text-align: center; }
    .content { background: white; padding: 30px; border: 2px solid #e5e7f0; border-radius: 0 0 12px 12px; }
    .message { background: #f8f9fc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8774ff; font-size: 18px; line-height: 1.6; font-style: italic; }
    .button { display: inline-block; background: #8774ff; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: 600; }
    .meta { color: #8c8fa6; font-size: 13px; text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 28px;">${isReply ? '💬 New Reply' : '📌 New Comment'}</h1>
    </div>
    
    <div class="content">
      ${authorInfo}
      
      <div class="message">
        "${sanitizeText(comment.text)}"
      </div>
      
      <div style="text-align: center;">
        <a href="${deepLink}" class="button">View on Portfolio</a>
      </div>
      
      <div class="meta">
        <p style="margin: 5px 0;">
          Posted on ${comment.pagePath === '/' ? 'Home' : comment.pagePath}
          <br>
          ${new Date(comment.timestamp).toLocaleString('en-US', { 
            dateStyle: 'medium', 
            timeStyle: 'short' 
          })}
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();

  const textBody = `
${isReply ? '💬 New Reply' : '📌 New Comment'} on your portfolio

From: ${comment.author}

Message:
"${sanitizeText(comment.text)}"

View it here: ${deepLink}

Posted: ${new Date(comment.timestamp).toLocaleString()}
Page: ${comment.pagePath}
  `.trim();

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Portfolio Comments <onboarding@resend.dev>',
        to: [ADMIN_EMAIL],
        subject: subject,
        html: htmlBody,
        text: textBody,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Failed to send email:', data);
      // Log failure for retry
      await kv.set(`notification_log:${comment.id}:${Date.now()}`, {
        commentId: comment.id,
        status: 'failed',
        error: data,
        timestamp: new Date().toISOString(),
      });
    } else {
      console.log('Email sent successfully:', data.id);
      // Log success
      await kv.set(`notification_log:${comment.id}:sent`, {
        commentId: comment.id,
        status: 'sent',
        messageId: data.id,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error sending email:', error);
    await kv.set(`notification_log:${comment.id}:${Date.now()}`, {
      commentId: comment.id,
      status: 'error',
      error: String(error),
      timestamp: new Date().toISOString(),
    });
  }
}

// Get all comments
commentsRouter.get('/', async (c) => {
  try {
    const comments = await kv.getByPrefix('comment:');
    return c.json({ comments: comments || [] });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return c.json({ error: 'Failed to fetch comments' }, 500);
  }
});

// Create a new comment
commentsRouter.post('/', async (c) => {
  try {
    const clientIp = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
    
    // Rate limiting
    if (!checkRateLimit(clientIp)) {
      return c.json({ error: 'Rate limit exceeded. Please wait before posting again.' }, 429);
    }

    const body = await c.req.json();
    const { x, y, normalizedX, normalizedY, text, userId, authorName, pagePath } = body;

    // Validation
    if (!text || !pagePath || !userId) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    if (typeof normalizedX !== 'number' || typeof normalizedY !== 'number') {
      return c.json({ error: 'Invalid normalized coordinates' }, 400);
    }

    // Sanitize inputs
    const sanitizedText = sanitizeText(text, 500);
    const sanitizedUserId = sanitizeText(userId, 100);
    const sanitizedAuthorName = authorName ? sanitizeText(authorName, 100) : 'Visitor';
    
    if (!sanitizedText || !sanitizedUserId) {
      return c.json({ error: 'Invalid input' }, 400);
    }

    const comment: Comment = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x: Number(x),
      y: Number(y),
      normalizedX: Number(normalizedX),
      normalizedY: Number(normalizedY),
      text: sanitizedText,
      author: sanitizedAuthorName,
      userId: sanitizedUserId,
      timestamp: new Date().toISOString(),
      pagePath: sanitizeText(pagePath, 200),
      status: 'open',
      replies: [],
    };

    // Store in database
    await kv.set(`comment:${comment.id}`, comment);

    // Send email notification (async, don't wait)
    sendEmailNotification(comment, false).catch(err => 
      console.error('Background email send failed:', err)
    );

    return c.json({ comment, success: true });
  } catch (error) {
    console.error('Error creating comment:', error);
    return c.json({ error: 'Failed to create comment' }, 500);
  }
});

// Add a reply to a comment
commentsRouter.post('/:id/reply', async (c) => {
  try {
    const commentId = c.req.param('id');
    const clientIp = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
    
    // Rate limiting
    if (!checkRateLimit(clientIp)) {
      return c.json({ error: 'Rate limit exceeded. Please wait before posting again.' }, 429);
    }

    const body = await c.req.json();
    const { text, userId, authorName } = body;

    if (!text || !userId) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const comment = await kv.get(`comment:${commentId}`);
    if (!comment) {
      return c.json({ error: 'Comment not found' }, 404);
    }

    const sanitizedText = sanitizeText(text, 500);
    const sanitizedUserId = sanitizeText(userId, 100);
    const sanitizedAuthorName = authorName ? sanitizeText(authorName, 100) : 'Visitor';

    const reply: Reply = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: sanitizedText,
      author: sanitizedAuthorName,
      userId: sanitizedUserId,
      timestamp: new Date().toISOString(),
    };

    comment.replies = [...(comment.replies || []), reply];
    await kv.set(`comment:${commentId}`, comment);

    // Send email notification for reply
    sendEmailNotification(comment, true).catch(err => 
      console.error('Background email send failed:', err)
    );

    return c.json({ comment, success: true });
  } catch (error) {
    console.error('Error adding reply:', error);
    return c.json({ error: 'Failed to add reply' }, 500);
  }
});

// Update comment position
commentsRouter.patch('/:id/position', async (c) => {
  try {
    const commentId = c.req.param('id');
    const body = await c.req.json();
    const { x, y, normalizedX, normalizedY } = body;

    // Validation
    if (typeof x !== 'number' || typeof y !== 'number' || 
        typeof normalizedX !== 'number' || typeof normalizedY !== 'number') {
      return c.json({ error: 'Invalid coordinates' }, 400);
    }

    const comment = await kv.get(`comment:${commentId}`);
    if (!comment) {
      return c.json({ error: 'Comment not found' }, 404);
    }

    // Update position
    comment.x = x;
    comment.y = y;
    comment.normalizedX = normalizedX;
    comment.normalizedY = normalizedY;

    await kv.set(`comment:${commentId}`, comment);

    return c.json({ comment, success: true });
  } catch (error) {
    console.error('Error updating comment position:', error);
    return c.json({ error: 'Failed to update comment position' }, 500);
  }
});

// Resolve/unresolve a comment
commentsRouter.patch('/:id/resolve', async (c) => {
  try {
    const commentId = c.req.param('id');
    const body = await c.req.json();
    const { status } = body;

    // Validation
    if (!status || !['open', 'resolved', 'hidden'].includes(status)) {
      return c.json({ error: 'Invalid status' }, 400);
    }

    const comment = await kv.get(`comment:${commentId}`);
    if (!comment) {
      return c.json({ error: 'Comment not found' }, 404);
    }

    // Update status
    comment.status = status;

    await kv.set(`comment:${commentId}`, comment);

    return c.json({ comment, success: true });
  } catch (error) {
    console.error('Error resolving comment:', error);
    return c.json({ error: 'Failed to resolve comment' }, 500);
  }
});

// Delete a comment (admin only - basic security, improve with proper auth)
commentsRouter.delete('/:id', async (c) => {
  try {
    const commentId = c.req.param('id');
    await kv.del(`comment:${commentId}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return c.json({ error: 'Failed to delete comment' }, 500);
  }
});

export default commentsRouter;
