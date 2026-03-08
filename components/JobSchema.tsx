import { Job } from '@/lib/data';

export default function JobSchema({ job }: { job: Job }) {
  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.title,
    description: job.content,
    datePosted: new Date(job.publishedAt).toISOString(),
    validThrough: new Date(job.appDeadline).toISOString(),
    employmentType: 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: job.organization,
      sameAs: 'https://bdjobcircularupdate.com',
      logo: job.thumbnail,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.jobLocation,
        addressCountry: 'BD',
      },
    },
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: 'BDT',
      value: {
        '@type': 'QuantitativeValue',
        value: job.salary,
        unitText: 'MONTH',
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
