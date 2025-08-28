export default defineSitemapEventHandler(async () => {
  const siteUrl = process.env.SITE_URL || 'https://radavpo.starkon.pp.ua';
  const apiBase = process.env.API_BASE_URL || 'https://api-vpo.starkon.pp.ua';
  const defaultLocale = 'uk';
  const locales = ['uk', 'en'];

  const staticRoutes = [] as string[];

  interface ApiItem {
    slug: string;
    status: string;
    updated_at?: string;
  }

  // Function to generate routes for both locales
  const generateRoutes = (items: ApiItem[], basePath: string) =>
    items
      .filter((item) => item.status === 'published') // Only include published items
      .flatMap((item) =>
        locales.map((locale) => {
          const prefix = locale === defaultLocale ? '' : `/${locale}`;
          return {
            path: `${prefix}/${basePath}/${item.slug}`,
            lastmod: item.updated_at || new Date().toISOString(),
          };
        }),
      );

  try {
    // Fetch partners
    const partnersRes = await fetch(`${apiBase}/partners`);
    if (!partnersRes.ok) {
      console.error(`Failed to fetch partners: ${partnersRes.status} ${partnersRes.statusText}`);
      throw new Error(`Partners fetch failed: ${partnersRes.status}`);
    }
    const partnersData = await partnersRes.json();
    const partners: ApiItem[] = Array.isArray(partnersData) ? partnersData : partnersData.data || [];

    // Fetch posts
    const postsRes = await fetch(`${apiBase}/posts`);
    if (!postsRes.ok) {
      console.error(`Failed to fetch posts: ${postsRes.status} ${postsRes.statusText}`);
      throw new Error(`Posts fetch failed: ${postsRes.status}`);
    }
    const postsData = await postsRes.json();
    const posts: ApiItem[] = Array.isArray(postsData) ? postsData : postsData.data || [];

    // Generate dynamic routes
    const dynamicRoutes = [...generateRoutes(partners, 'partners'), ...generateRoutes(posts, 'blogs')];

    // Generate static routes for both locales
    const localizedStaticRoutes = staticRoutes.flatMap((route) =>
      locales.map((locale) => ({
        path: locale === defaultLocale ? route : `/${locale}${route === '' ? '' : '/' + route}`,
        lastmod: new Date().toISOString(),
      })),
    );

    // Combine all routes
    const allRoutes = [...localizedStaticRoutes, ...dynamicRoutes];

    return allRoutes.map((route) => ({
      loc: `${siteUrl}${route.path}`,
      lastmod: route.lastmod,
      changefreq: 'weekly',
      priority: route.path === '' || route.path === '/en' ? 1.0 : 0.8,
    }));
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return only static routes for both locales in case of error
    const localizedStaticRoutes = staticRoutes.flatMap((route) =>
      locales.map((locale) => ({
        path: locale === defaultLocale ? route : `/${locale}${route === '' ? '' : '/' + route}`,
        lastmod: new Date().toISOString(),
      })),
    );
    return localizedStaticRoutes.map((route) => ({
      loc: `${siteUrl}${route.path}`,
      lastmod: route.lastmod,
      changefreq: 'weekly',
      priority: route.path === '' || route.path === '/en' ? 1.0 : 0.8,
    }));
  }
});
