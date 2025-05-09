import Card from '../../components/Card';
import PasswordProtection from '../../components/PasswordProtection';
import Image from 'next/image';
import Link from 'next/link';
import { pressItems, pressKitUrl } from '../../data/mockData';
import { createBaseMetadata } from '../../lib/seo';

// Export metadata for this page - noindex since it's password protected
export const metadata = {
  ...createBaseMetadata({
    title: 'Press & Media - BNG Music',
    description: 'Access press materials, media coverage, and more for BNG Music.',
    path: '/press',
  }),
  robots: {
    index: false,
    follow: false,
  },
};

function PressContent() {
  return (
    <div className="container">
      <h1 className="text-center mb-4">Press & Media</h1>
      
      <div className="text-center mb-4">
        <Link href={pressKitUrl} className="btn me-2" target="_blank" rel="noopener noreferrer">
          Download Press Kit (PDF)
        </Link>
        <Link href="/epk" className="btn ms-2">
          Electronic Press Kit (EPK)
        </Link>
      </div>
      
      <div className="mb-4">
        <h2 className="mb-3">Press Coverage</h2>
        <div className="grid grid-cols-1 grid-cols-3">
          {pressItems.map((item, index) => (
            <div key={index} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <Card
                title={item.title}
                description={
                  <>
                    <div className="mb-2">
                      <Image 
                        src={item.logo} 
                        alt={item.publication} 
                        width={100} 
                        height={50} 
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                    <p>{item.excerpt}</p>
                    <p className="text-primary">{item.date}</p>
                  </>
                }
                linkUrl={item.link}
                linkText="Read Article"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Press() {
  return (
      <PasswordProtection>
        <PressContent />
      </PasswordProtection>
  );
}
