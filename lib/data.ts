export type Category = 'Govt Job' | 'Bank Job' | 'Private Job' | 'Defense Job' | 'NGO Job';

export interface Job {
  id: string;
  slug: string;
  title: string;
  organization: string;
  category: Category;
  thumbnail: string;
  vacancy: string;
  salary: string;
  jobLocation: string;
  appStartDate: string;
  appDeadline: string;
  publishedAt: string;
  viewCount: number;
  featured: boolean;
  content: string;
  pdfLink?: string;
  applyLink?: string;
}

export const jobs: Job[] = [];

export const categories = [
  { name: 'Govt Job', icon: 'Building2', count: 124 },
  { name: 'Bank Job', icon: 'Landmark', count: 85 },
  { name: 'Private Job', icon: 'Briefcase', count: 210 },
  { name: 'Defense Job', icon: 'ShieldCheck', count: 15 },
  { name: 'NGO Job', icon: 'Globe', count: 42 },
].sort((a, b) => b.count - a.count);
