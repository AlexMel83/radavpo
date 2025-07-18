import { readFile } from 'fs/promises';
import { join } from 'path';

export default defineEventHandler(async () => {
  const filePath = join(process.cwd(), 'content', 'blogs.json');
  const data = await readFile(filePath, 'utf-8');
  return JSON.parse(data);
});
// This code defines an event handler for a server API endpoint that reads a JSON file containing blog data.
