import { readFile } from 'fs/promises';
import { join } from 'path';

type PartnerPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  createdAt: string;
};

export default defineEventHandler(async (event) => {
  const { slug } = event.context.params as { slug: string };

  const filePath = join(process.cwd(), 'content', 'partners.json');
  const data = await readFile(filePath, 'utf-8');
  const partners: PartnerPost[] = JSON.parse(data);

  const partner = partners.find((partner) => partner.slug === slug);
  if (!partner) {
    throw createError({ statusCode: 404, statusMessage: 'Partner not found' });
  }

  return partner;
});
// This code defines an event handler for a server API endpoint that retrieves a specific blog post by its slug from a JSON file. If the post is not found, it throws a 404 error.
