import { readFile } from 'fs/promises';
import { join } from 'path';

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  createdAt: string;
};

export default defineEventHandler(async (event) => {
  const { slug } = event.context.params as { slug: string };

  const filePath = join(process.cwd(), 'content', 'blogs.json');
  const data = await readFile(filePath, 'utf-8');
  const posts: BlogPost[] = JSON.parse(data);

  const post = posts.find((post) => post.slug === slug);
  if (!post) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found' });
  }

  return post;
});
// This code defines an event handler for a server API endpoint that retrieves a specific blog post by its slug from a JSON file. If the post is not found, it throws a 404 error.
