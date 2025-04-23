'use client';
import Layout from '../../../components/Layout';
import { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import styles from './analytics.module.css';

// Mock data - would be replaced with actual GA API calls
const mockPageViews = [
  { name: '/home', views: 1250 },
  { name: '/videos', views: 880 },
  { name: '/music', views: 750 },
  { name: '/about', views: 620 },
  { name: '/contact', views: 410 },
];

const mockEventCounts = [
  { name: 'video_play', count: 325 },
  { name: 'social_follow', count: 210 },
  { name: 'download_epk', count: 130 },
  { name: 'music_listen', count: 280 },
];

const mockReferrals = [
  { name: 'Direct', value: 40 },
  { name: 'Google', value: 25 },
  { name: 'Facebook', value: 15 },
  { name: 'Instagram', value: 10 },
  { name: 'Twitter', value: 5 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFF', '#FF6663'];

export default function AnalyticsDashboard() {
  const [pageViews, setPageViews] = useState(mockPageViews);
  const [eventCounts, setEventCounts] = useState(mockEventCounts);
  const [referrals, setReferrals] = useState(mockReferrals);
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('7days');

  useEffect(() => {
    // This would be replaced with actual API calls to the GA Reporting API
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      try {
        // Mock API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // In a real implementation, fetch data from GA based on timeRange
        // const data = await fetchFromGoogleAnalytics(timeRange);
        // setPageViews(data.pageViews);
        // setEventCounts(data.eventCounts);
        // setReferrals(data.referrals);

        // For now, we'll just update with our static mock data
        // but with slight variations based on time range
        const multiplier =
          timeRange === '30days' ? 4 :
            timeRange === '90days' ? 12 : 1;

        setPageViews(mockPageViews.map(item => ({
          ...item,
          views: item.views * multiplier
        })));

        setEventCounts(mockEventCounts.map(item => ({
          ...item,
          count: item.count * multiplier
        })));
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange]);

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>Analytics Dashboard</h1>

        <div className={styles.timeRangeSelector}>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className={styles.select}
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
        </div>

        {isLoading ? (
          <div className={styles.loading}>Loading data...</div>
        ) : (
          <div className={styles.chartsContainer}>
            <div className={styles.chartWrapper}>
              <h2>Page Views</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pageViews}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="views" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className={styles.chartWrapper}>
              <h2>Event Counts</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={eventCounts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className={styles.chartWrapper}>
              <h2>Top Referral Sources</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={referrals}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {referrals.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className={styles.note}>
          <p><strong>Note:</strong> This dashboard currently shows mock data. In production, it would fetch real-time data from the Google Analytics Reporting API.</p>
        </div>
      </div>

    </Layout>

  );
}
