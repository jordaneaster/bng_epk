import Layout from '../components/Layout';
import Hero from '../components/Hero';
import Link from 'next/link';
import { artistInfo } from '../data/mockData';

export default function Home() {
  return (
    <Layout>
      <Hero 
        title={artistInfo.name}
        subtitle={artistInfo.tagline}
        bgImage="/images/hero-bg.jpg" // Make sure this file exists in public/images/
      />
      
      <section className="container">
        <div className="fade-in">
          <h2 className="text-center mb-4">About</h2>
          <div style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.1rem' }}>
            <p 
              className="bio-paragraph" 
              dangerouslySetInnerHTML={{ __html: artistInfo.longBio }} 
            />
            
            <div className="text-center mt-4">
              <Link href="/music" className="btn">
                Listen to Music
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
