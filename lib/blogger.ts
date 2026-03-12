import { Job, Category } from './data';

export interface BloggerPost {
  id: string;
  slug: string;
  title: string;
  publishedAt: string;
  updatedAt: string;
  content: string;
  thumbnail: string;
  categories: string[];
  url: string;
}

const BLOG_ID = '581318446510932811';

export async function fetchBloggerPosts(): Promise<BloggerPost[]> {
  try {
    // Use Cloudflare Worker API Proxy
    // This connects to https://bdjob.mrdurjoy.workers.dev/posts
    const res = await fetch(`https://bdjob.mrdurjoy.workers.dev/posts?maxResults=50`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
      signal: AbortSignal.timeout(15000) // 15 second timeout
    });
    
    if (!res.ok) {
      throw new Error(`Cloudflare Worker failed with status: ${res.status}`);
    }
    
    const text = await res.text();
    if (text.trim() === "Hello World!") {
      throw new Error("Cloudflare Worker is still running the default 'Hello World' code. Please deploy the updated code.");
    }
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error(`Failed to parse Cloudflare Worker response as JSON. Response started with: ${text.substring(0, 50)}`);
    }
      
    const items = data.items || [];
      
      return items.map((item: any) => {
        // Extract slug from URL
        let slug = '';
        if (item.url) {
          const parts = item.url.split('/');
          const filename = parts[parts.length - 1];
          slug = filename.replace('.html', '');
        } else {
          slug = item.id;
        }
        
        // Extract thumbnail
        let thumbnail = '/placeholder-job.svg';
        if (item.images && item.images.length > 0) {
          thumbnail = item.images[0].url;
        } else {
          // Fallback to regex on content
          const imgMatch = item.content?.match(/<img[^>]+src="([^">]+)"/);
          if (imgMatch && imgMatch[1]) {
            thumbnail = imgMatch[1];
          }
        }
        
        // If the thumbnail is from postimg.cc, use the placeholder instead
        if (thumbnail.includes('postimg.cc') || thumbnail.includes('picsum.photos')) {
          thumbnail = '/placeholder-job.svg';
        }
        
        return {
          id: item.id,
          slug,
          title: item.title,
          publishedAt: item.published,
          updatedAt: item.updated,
          content: item.content || '',
          thumbnail,
          categories: item.labels || [],
          url: item.url
        };
      });
    } catch (error) {
      console.error('Error fetching from Cloudflare Worker, falling back to JSON feed:', error);
      return fetchFallbackJsonFeed();
    }
}

async function fetchFallbackJsonFeed(): Promise<BloggerPost[]> {
  try {
    const res = await fetch(`https://bdjobcircularupdateofficial.blogspot.com/feeds/posts/default?alt=json`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
      signal: AbortSignal.timeout(15000) // 15 second timeout
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch blogger posts');
    }
    
    const data = await res.json();
    const entries = data.feed.entry || [];
    
    return entries.map((entry: any) => {
      // Find the alternate link (actual post URL)
      const alternateLink = entry.link.find((l: any) => l.rel === 'alternate');
      const url = alternateLink ? alternateLink.href : '';
      
      // Extract slug from URL
      let slug = '';
      if (url) {
        const parts = url.split('/');
        const filename = parts[parts.length - 1];
        slug = filename.replace('.html', '');
      } else {
        // Fallback slug
        slug = entry.id.$t.split('post-')[1];
      }
      
      // Extract categories
      const categories = entry.category ? entry.category.map((c: any) => c.term) : [];
      
      // Extract thumbnail
      let thumbnail = '/placeholder-job.svg';
      if (entry.media$thumbnail && entry.media$thumbnail.url) {
        // Replace s72-c with s600 to get a larger image
        thumbnail = entry.media$thumbnail.url.replace(/\/s\d+-c\//, '/s600/');
      } else {
        // Try to extract first image from content
        const content = entry.content ? entry.content.$t : '';
        const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch && imgMatch[1]) {
          thumbnail = imgMatch[1];
        }
      }
      
      // If the thumbnail is from postimg.cc, use the placeholder instead
      if (thumbnail.includes('postimg.cc') || thumbnail.includes('picsum.photos')) {
        thumbnail = '/placeholder-job.svg';
      }
      
      return {
        id: entry.id.$t,
        slug,
        title: entry.title.$t,
        publishedAt: entry.published.$t,
        updatedAt: entry.updated.$t,
        content: entry.content ? entry.content.$t : '',
        thumbnail,
        categories,
        url
      };
    });
  } catch (error) {
    console.error('Error fetching Blogger posts from JSON feed:', error);
    throw new Error('Failed to fetch job circulars from Blogger. Please check your internet connection or try again later.');
  }
}

export async function getJobsFromBlogger(): Promise<Job[]> {
  const posts = await fetchBloggerPosts();
  
  return posts.map((post, index) => {
    // Try to extract some structured data from the content if possible,
    // otherwise use fallbacks.
    
    // Default values
    const categoryName = post.categories.length > 0 ? post.categories[0] : 'Govt Job';
    
    // We can try to parse deadline from content, but it's hard. Let's set a default deadline 15 days from published date
    const pubDate = new Date(post.publishedAt);
    const deadlineDate = new Date(pubDate);
    deadlineDate.setDate(deadlineDate.getDate() + 15);
    
    // Try to extract a PDF link from the content
    let pdfLink = undefined;
    
    // Look for common PDF link patterns in the HTML content
    // 1. Look for links ending in .pdf
    const pdfMatch = post.content.match(/href=["']([^"']+\.pdf)["']/i);
    if (pdfMatch && pdfMatch[1]) {
      pdfLink = pdfMatch[1];
    } 
    // 2. Look for Google Drive links which are often used for PDFs
    else if (!pdfLink) {
      const driveMatch = post.content.match(/href=["'](https:\/\/drive\.google\.com\/file\/d\/[^/]+\/view[^"']*)["']/i);
      if (driveMatch && driveMatch[1]) {
        pdfLink = driveMatch[1];
      }
    }
    
    // Try to extract an apply link
    let applyLink = undefined;
    
    // Look for teletalk links (standard BD govt job portal)
    const teletalkMatch = post.content.match(/href=["'](https?:\/\/[a-zA-Z0-9.-]+\.teletalk\.com\.bd[^"']*)["']/i);
    if (teletalkMatch && teletalkMatch[1]) {
      applyLink = teletalkMatch[1];
    } else {
      // Look for links with text containing "Apply", "আবেদন", "Click Here"
      const applyTextMatch = post.content.match(/<a[^>]+href=["']([^"']+)["'][^>]*>(?:[^<]*)(?:Apply|apply|আবেদন|Click Here)(?:[^<]*)<\/a>/i);
      if (applyTextMatch && applyTextMatch[1]) {
        applyLink = applyTextMatch[1];
      }
    }

    // Fallback: Find any external link that isn't a PDF, image, or the blogger site itself
    if (!applyLink) {
      const externalLinkMatch = post.content.match(/<a[^>]+href=["'](https?:\/\/(?!drive\.google\.com|[^"']+\.(?:pdf|jpg|jpeg|png|gif|svg))[^"']+)["'][^>]*>/i);
      if (externalLinkMatch && externalLinkMatch[1] && !externalLinkMatch[1].includes('bdjobcircularupdateofficial.blogspot.com')) {
        applyLink = externalLinkMatch[1];
      }
    }
    
    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      organization: 'Various Organizations', // Fallback
      category: categoryName as Category, // Cast to our Category type
      thumbnail: post.thumbnail,
      vacancy: 'Not Specified',
      salary: 'As per circular',
      jobLocation: 'Bangladesh',
      appStartDate: post.publishedAt,
      appDeadline: deadlineDate.toISOString(),
      publishedAt: post.publishedAt,
      viewCount: Math.floor(Math.random() * 10000) + 1000, // Fake view count
      featured: index < 3, // Make first 3 featured
      content: post.content,
      applyLink: applyLink, // Extracted apply link or original post
      pdfLink: pdfLink, // Extracted PDF link
    };
  });
}
