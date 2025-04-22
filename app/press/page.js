import Layout from '../../components/Layout';
import Card from '../../components/Card';
import PasswordProtection from '../../components/PasswordProtection';
import Image from 'next/image';
import Link from 'next/link';
import { pressItems, pressKitUrl } from '../../data/mockData';

function PressContent() {
  return (
    <div className="container">
      <h1 className="text-center mb-4">Press & Media</h1>
      
      <div className="text-center mb-4">
        <Link href={pressKitUrl} className="btn" target="_blank" rel="noopener noreferrer">
          Download Press Kit (PDF)
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
    <Layout>
      <PasswordProtection>
        <PressContent />
      </PasswordProtection>
    </Layout>
  );
}
