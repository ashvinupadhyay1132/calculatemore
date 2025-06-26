import { MetadataRoute } from 'next'
import { allCalculators } from '@/config/calculators';
 
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = 'https://calculatemore.org';
  
  const calculatorUrls = allCalculators.map((calculator) => ({
    url: `${siteUrl}${calculator.href}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const staticUrls = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
     {
      url: `${siteUrl}/calculators`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ];

  return [
    ...staticUrls,
    ...calculatorUrls,
  ];
}
