import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';
import commentsRouter from './comments.tsx';
import { decode } from 'https://deno.land/std@0.224.0/encoding/base64.ts';

const app = new Hono();

// Define allowed origins
const allowedOrigins = [
  'https://aristoteportfolio.vercel.app',
  'https://aristoteportfolio-17fq61cxh-aristote-codes-projects.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
];

// Middleware - Allow multiple origins for development and production
app.use('*', cors({ 
  origin: (origin) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return '*';
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) return origin;
    
    // Allow any Vercel preview deployments
    if (origin.match(/https:\/\/.*\.vercel\.app$/)) return origin;
    
    // For all other origins, still allow (for admin panel flexibility)
    return origin;
  },
  credentials: true,
  allowMethods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Admin-Key'],
  exposeHeaders: ['Content-Length', 'X-Request-Id'],
  maxAge: 600, // 10 minutes
}));
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Helper function to verify admin authentication
async function verifyAdmin(authHeader: string | null, adminKeyHeader: string | null) {
  // Check for admin key in X-Admin-Key header first
  const adminKey = Deno.env.get('ADMIN_KEY') || 'admin_key_aristote_2025';
  if (adminKeyHeader === adminKey) {
    return true;
  }
  
  // Fallback: check Authorization header
  if (!authHeader) return false;
  
  const token = authHeader.split(' ')[1];
  if (token === adminKey) {
    return true;
  }
  
  // Also support Supabase auth tokens
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return false;
    return true;
  } catch {
    return false;
  }
}

// ==================== PROJECTS ROUTES ====================

// GET /server/projects - Public: Get all projects
app.get('/server/projects', async (c) => {
  try {
    const projects = await kv.getByPrefix('project_');
    
    // getByPrefix already returns values, just filter null and sort
    const sortedProjects = projects
      .filter(p => p !== null && p !== undefined) // Filter out null/undefined values
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    
    return c.json({ projects: sortedProjects });
  } catch (error) {
    console.log('Error fetching projects:', error);
    return c.json({ error: 'Failed to fetch projects' }, 500);
  }
});

// POST /server/admin/projects - Admin: Create a new project
app.post('/server/admin/projects', async (c) => {
  const isAdmin = await verifyAdmin(c.req.header('Authorization'), c.req.header('X-Admin-Key'));
  if (!isAdmin) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const body = await c.req.json();
    const { title, description, image, tags, link, color, blocks } = body;

    if (!title) {
      return c.json({ error: 'Title is required' }, 400);
    }

    const projectId = `project_${Date.now()}`;
    const project = {
      id: projectId,
      title,
      description: description || '',
      image: image || '',
      tags: tags || [],
      link: link || '',
      color: color || '#fef08a',
      blocks: blocks || [],
      order: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(projectId, project);

    return c.json({ project });
  } catch (error) {
    console.log('Error creating project:', error);
    return c.json({ error: 'Failed to create project' }, 500);
  }
});

// PUT /server/admin/projects/:id - Admin: Update a project
app.put('/server/admin/projects/:id', async (c) => {
  const isAdmin = await verifyAdmin(c.req.header('Authorization'), c.req.header('X-Admin-Key'));
  if (!isAdmin) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const projectId = c.req.param('id');
    const body = await c.req.json();

    const existingProject = await kv.get(projectId);
    if (!existingProject) {
      return c.json({ error: 'Project not found' }, 404);
    }

    const updatedProject = {
      ...existingProject,
      ...body,
      id: projectId,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(projectId, updatedProject);

    return c.json({ project: updatedProject });
  } catch (error) {
    console.log('Error updating project:', error);
    return c.json({ error: 'Failed to update project' }, 500);
  }
});

// DELETE /server/admin/projects/:id - Admin: Delete a project
app.delete('/server/admin/projects/:id', async (c) => {
  const isAdmin = await verifyAdmin(c.req.header('Authorization'), c.req.header('X-Admin-Key'));
  if (!isAdmin) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const projectId = c.req.param('id');
    
    const existingProject = await kv.get(projectId);
    if (!existingProject) {
      return c.json({ error: 'Project not found' }, 404);
    }

    await kv.del(projectId);

    return c.json({ success: true });
  } catch (error) {
    console.log('Error deleting project:', error);
    return c.json({ error: 'Failed to delete project' }, 500);
  }
});

// ==================== AUTH ROUTES ====================

// POST /server/auth/signup - Create admin account
app.post('/server/auth/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });

    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.log('Error during signup:', error);
    return c.json({ error: 'Failed to create account' }, 500);
  }
});

// ==================== COMMENTS ROUTES ====================
app.route('/server/comments', commentsRouter);

// ==================== USER JOINED NOTIFICATION ====================

// POST /server/user-joined - Send notification when user enters their name
app.post('/server/user-joined', async (c) => {
  try {
    const { userName, timestamp } = await c.req.json();

    if (!userName) {
      return c.json({ error: 'User name is required' }, 400);
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      return c.json({ success: false, message: 'Email service not configured' }, 200); // Still return success
    }

    // Prepare email
    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #8774ff 0%, #a991ff 100%); color: white; padding: 25px; border-radius: 12px 12px 0 0; text-align: center; }
    .content { background: white; padding: 30px; border: 2px solid #e5e7f0; border-radius: 0 0 12px 12px; }
    .visitor-card { background: #f8f9fc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8774ff; }
    .meta { color: #8c8fa6; font-size: 13px; text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 28px;">👋 New Visitor!</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">Someone just joined your portfolio</p>
    </div>
    
    <div class="content">
      <div class="visitor-card">
        <h2 style="margin: 0 0 10px 0; color: #474747; font-size: 20px;">Visitor Information</h2>
        <p style="margin: 5px 0;"><strong>Name:</strong> ${userName}</p>
      </div>
      
      <div class="meta">
        <p style="margin: 5px 0;">
          ${new Date(timestamp).toLocaleString('en-US', { 
            dateStyle: 'full', 
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
👋 New Visitor!

Someone just joined your portfolio:

Name: ${userName}

Time: ${new Date(timestamp).toLocaleString()}
    `.trim();

    // Send email via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Portfolio Notifications <onboarding@resend.dev>',
        to: ['gahimaaristote1@gmail.com'],
        subject: `👋 ${userName} just joined your portfolio`,
        html: htmlBody,
        text: textBody,
      }),
    });

    const emailData = await response.json();

    if (!response.ok) {
      console.error('Failed to send user joined email:', emailData);
      return c.json({ success: false, message: 'Email failed but continuing' }, 200);
    }

    console.log('User joined email sent successfully:', emailData.id);

    // Log the visitor
    await kv.set(`visitor:${Date.now()}`, {
      userName,
      timestamp,
      emailId: emailData.id,
    });

    return c.json({ success: true, message: 'Notification sent' });
  } catch (error) {
    console.error('Error sending user joined notification:', error);
    return c.json({ success: false, message: 'Error occurred' }, 200); // Don't fail the user experience
  }
});

// ==================== CONTACT FORM ROUTE ====================

// POST /server/contact - Send contact form email
app.post('/server/contact', async (c) => {
  try {
    const { name, email, message } = await c.req.json();

    // Validation
    if (!name || !email || !message) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Sanitize inputs
    const sanitizeName = (text: string) => text.replace(/<[^>]*>/g, '').substring(0, 100).trim();
    const sanitizeEmail = (text: string) => text.replace(/<[^>]*>/g, '').substring(0, 100).trim();
    const sanitizeMessage = (text: string) => text.replace(/<[^>]*>/g, '').substring(0, 2000).trim();

    const sanitizedName = sanitizeName(name);
    const sanitizedEmail = sanitizeEmail(email);
    const sanitizedMessage = sanitizeMessage(message);

    if (!sanitizedName || !sanitizedEmail || !sanitizedMessage) {
      return c.json({ error: 'Invalid input' }, 400);
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return c.json({ error: 'Invalid email address' }, 400);
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      return c.json({ error: 'Email service not configured' }, 500);
    }

    // Prepare email
    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #8774ff; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f8f9fc; padding: 20px; border: 1px solid #e5e7f0; }
    .message-box { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #8774ff; }
    .meta { color: #8c8fa6; font-size: 14px; margin-bottom: 10px; }
    .text { font-size: 16px; line-height: 1.6; white-space: pre-wrap; }
    .footer { text-align: center; color: #8c8fa6; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">📬 New Contact Form Submission</h1>
      <p style="margin: 5px 0 0 0; opacity: 0.9;">Someone wants to get in touch!</p>
    </div>
    
    <div class="content">
      <div class="message-box">
        <div class="meta">
          <strong>From:</strong> ${sanitizedName}<br>
          <strong>Email:</strong> <a href="mailto:${sanitizedEmail}" style="color: #8774ff;">${sanitizedEmail}</a><br>
          <strong>Time:</strong> ${new Date().toLocaleString('en-US', { 
            dateStyle: 'full', 
            timeStyle: 'short' 
          })}
        </div>
        <div class="text">${sanitizedMessage}</div>
      </div>
      
      <p style="margin-top: 20px; font-size: 14px; color: #8c8fa6;">
        <a href="mailto:${sanitizedEmail}?subject=Re: Your message" style="display: inline-block; background: #8774ff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; margin-top: 10px;">Reply to ${sanitizedName}</a>
      </p>
    </div>
    
    <div class="footer">
      <p>Sent from your FigJam Portfolio Contact Form</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    const textBody = `
New Contact Form Submission

From: ${sanitizedName}
Email: ${sanitizedEmail}
Time: ${new Date().toLocaleString()}

Message:
${sanitizedMessage}

---
Reply to: ${sanitizedEmail}
    `.trim();

    // Send email via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: ['gahimaaristote1@gmail.com'],
        reply_to: sanitizedEmail,
        subject: `New message from ${sanitizedName}`,
        html: htmlBody,
        text: textBody,
      }),
    });

    const emailData = await response.json();

    if (!response.ok) {
      console.error('Failed to send email via Resend:', emailData);
      return c.json({ error: 'Failed to send email' }, 500);
    }

    console.log('Contact form email sent successfully:', emailData.id);

    // Log the submission
    await kv.set(`contact:${Date.now()}`, {
      name: sanitizedName,
      email: sanitizedEmail,
      message: sanitizedMessage,
      timestamp: new Date().toISOString(),
      emailId: emailData.id,
    });

    return c.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return c.json({ error: 'Failed to process contact form' }, 500);
  }
});

// ==================== IMAGE UPLOAD ROUTE ====================

// POST /server/upload-image - Upload image to Supabase Storage
app.post('/server/upload-image', async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const filename = formData.get('filename') as string;

    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: 'Invalid file type. Only images are allowed.' }, 400);
    }

    // Validate file size (5MB max)
    if (file.size > 5242880) {
      return c.json({ error: 'File too large. Maximum size is 5MB.' }, 400);
    }

    // Convert file to ArrayBuffer then to Uint8Array
    const arrayBuffer = await file.arrayBuffer();
    const fileData = new Uint8Array(arrayBuffer);

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const fileExt = file.type.split('/')[1] || 'jpg';
    const uniqueFilename = filename || `${timestamp}_${randomStr}.${fileExt}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('project-images')
      .upload(uniqueFilename, fileData, {
        contentType: file.type,
        upsert: true, // Allow overwriting
        cacheControl: '3600', // Cache for 1 hour
      });

    if (error) {
      console.error('Storage upload error:', error);
      return c.json({ error: error.message || 'Failed to upload to storage' }, 500);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('project-images')
      .getPublicUrl(data.path);

    return c.json({ 
      url: urlData.publicUrl,
      path: data.path,
      success: true
    });
  } catch (error) {
    console.error('Upload error:', error);
    return c.json({ error: 'Failed to upload image: ' + (error instanceof Error ? error.message : 'Unknown error') }, 500);
  }
});

// Health check
app.get('/server/health', (c) => {
  return c.json({ status: 'ok' });
});

Deno.serve(app.fetch);
