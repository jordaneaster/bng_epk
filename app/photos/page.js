import Layout from '../../components/Layout';
import ImageGrid from '../../components/ImageGrid';
import { photos } from '../../data/mockData';

export default function Photos() {
  return (
    <Layout>
      <div className="container">
        <h1 className="text-center mb-4">Photos</h1>
        
        <div className="mb-4">
          <ImageGrid images={photos} />
        </div>
      </div>
    </Layout>
  );
}
