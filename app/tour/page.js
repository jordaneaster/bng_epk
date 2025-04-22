import Layout from '../../components/Layout';
import Card from '../../components/Card';
import { tourDates } from '../../data/mockData';

export default function Tour() {
  return (
    <Layout>
      <div className="container">
        <h1 className="text-center mb-4">Tour Dates</h1>
        
        <div className="grid grid-cols-1 grid-cols-3">
          {tourDates.map((show, index) => (
            <div key={index} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <Card
                title={show.venue}
                date={show.date}
                location={show.city}
                linkUrl={show.soldOut ? null : show.ticketLink}
                linkText={show.soldOut ? 'Sold Out' : 'Get Tickets'}
              />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
