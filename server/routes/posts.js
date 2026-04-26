import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { requireAuth } from './auth.js';
import { createTransporter } from '../lib/mailer.js';

const router = Router();

// GET /api/posts/featured
router.get('/featured', async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { featured: true, published: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(posts.map(({ content, ...rest }) => rest));
});

// GET /api/posts/tags
router.get('/tags', async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { tags: true },
  });
  const tagMap = {};
  posts.forEach(p => p.tags.forEach(t => { tagMap[t] = (tagMap[t] || 0) + 1; }));
  const tags = Object.entries(tagMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  res.json(tags);
});

// GET /api/posts
router.get('/', async (req, res) => {
  const { tag, search, sort, category } = req.query;
  const where = { published: true };

  if (tag) where.tags = { has: tag };
  if (category) where.category = { equals: category, mode: 'insensitive' };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
      { tags: { has: search.toLowerCase() } },
    ];
  }

  let orderBy = { createdAt: 'desc' };
  if (sort === 'oldest') orderBy = { createdAt: 'asc' };
  if (sort === 'title') orderBy = { title: 'asc' };

  const posts = await prisma.post.findMany({ where, orderBy });
  res.json(posts.map(({ content, ...rest }) => rest));
});

// GET /api/posts/:slug
router.get('/:slug', async (req, res) => {
  const post = await prisma.post.findUnique({ where: { slug: req.params.slug } });
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const related = await prisma.post.findMany({
    where: {
      published: true,
      slug: { not: post.slug },
      tags: { hasSome: post.tags },
    },
    take: 3,
  });

  res.json({
    ...post,
    author: { name: post.authorName, role: post.authorRole },
    date: post.createdAt,
    related: related.map(({ content, ...rest }) => ({
      ...rest,
      author: { name: rest.authorName, role: rest.authorRole },
      date: rest.createdAt,
    })),
  });
});

// POST /api/posts (admin - create new post) — PROTECTED
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, slug, excerpt, content, category, tags, coverColor, readingTime, featured } = req.body;
    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'Title, slug, and content are required.' });
    }
    const post = await prisma.post.create({
      data: { title, slug, excerpt: excerpt || '', content, category: category || 'General', tags: tags || [], coverColor: coverColor || '#7c3aed', readingTime: readingTime || 5, featured: featured || false },
    });

    // Send email to subscribers
    if (post.published) {
      const subscribers = await prisma.subscriber.findMany();
      if (subscribers.length > 0) {
        const transporter = createTransporter();
        if (transporter) {
          const bcc = subscribers.map(s => s.email).join(', ');
          const postUrl = `http://localhost:5173/blog/${post.slug}`; // Adjust base URL for prod
          
          try {
            await transporter.sendMail({
              from: `"Rupesh's Blog" <${process.env.EMAIL_USER}>`,
              bcc,
              subject: `✨ New Article: ${post.title}`,
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <h2 style="color: #7c3aed;">${post.title}</h2>
                  <p style="color: #475569; font-size: 1.1rem; line-height: 1.6;">${post.excerpt}</p>
                  <a href="${postUrl}" style="display: inline-block; padding: 10px 20px; background-color: #7c3aed; color: #fff; text-decoration: none; border-radius: 6px; margin-top: 20px;">Read Article</a>
                  <hr style="margin-top: 40px; border: none; border-top: 1px solid #e2e8f0;" />
                  <p style="color: #94a3b8; font-size: 0.8rem;">You are receiving this because you subscribed to Rupesh's Blog.</p>
                </div>
              `,
            });
            console.log(`✅ Newsletter sent to ${subscribers.length} subscribers`);
          } catch (emailErr) {
            console.error('❌ Failed to send newsletter:', emailErr.message);
          }
        }
      }
    }

    res.status(201).json(post);
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'Slug already exists.' });
    console.error(err);
    res.status(500).json({ error: 'Failed to create post.' });
  }
});

// PUT /api/posts/:slug (admin - update post) — PROTECTED
router.put('/:slug', requireAuth, async (req, res) => {
  try {
    const post = await prisma.post.update({
      where: { slug: req.params.slug },
      data: req.body,
    });
    res.json(post);
  } catch (err) {
    res.status(404).json({ error: 'Post not found.' });
  }
});

// DELETE /api/posts/:slug (admin - delete post) — PROTECTED
router.delete('/:slug', requireAuth, async (req, res) => {
  try {
    await prisma.post.delete({ where: { slug: req.params.slug } });
    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ error: 'Post not found.' });
  }
});

export default router;
