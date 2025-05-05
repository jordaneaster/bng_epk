'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import { isAuthenticated, signOut } from '../../../lib/auth';
import { fetchGaPageViews, fetchGaEvents, fetchGaReferrals } from '../../../lib/gaApi';
import styles from './analytics.module.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFF', '#FF6663'];

export default function AnalyticsDashboard() {
  const [pageViews, setPageViews] = useState([]);
  const [eventCounts, setEventCounts] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('7days');
  const [authStatus, setAuthStatus] = useState('checking');
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Handle mounting state - fix for hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Authentication check
  useEffect(() => {
    if (!mounted) return;
    
    const checkAuth = () => {
      if (isAuthenticated()) {
        setAuthStatus('authenticated');
      } else {
        setAuthStatus('unauthenticated');
        router.push('/admin/login');
      }
    };
    
    checkAuth();
    // Check auth status every 30 seconds
    const interval = setInterval(checkAuth, 30000);
    
    return () => clearInterval(interval);
  }, [router, mounted]);

  // Fetch data based on time range
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (!mounted || authStatus !== 'authenticated') return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Convert timeRange to actual date ranges
        const endDate = new Date();
        const startDate = new Date();
        
        if (timeRange === '7days') startDate.setDate(endDate.getDate() - 7);
        else if (timeRange === '30days') startDate.setDate(endDate.getDate() - 30);
        else if (timeRange === '90days') startDate.setDate(endDate.getDate() - 90);
        
        // Format dates for GA API (YYYY-MM-DD)
        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];
        
        // Fetch real analytics data
        const [pageViewsData, eventsData, referralsData] = await Promise.all([
          fetchGaPageViews(startDateStr, endDateStr),
          fetchGaEvents(startDateStr, endDateStr),
          fetchGaReferrals(startDateStr, endDateStr)
        ]);
        
        setPageViews(pageViewsData);
        setEventCounts(eventsData);
        setReferrals(referralsData);
      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setError("Failed to fetch analytics data. Please try again later. Error: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange, mounted, authStatus]);

  const handleLogout = () => {
    signOut();
    setAuthStatus('unauthenticated');
    router.push('/admin/login');
  };

  // Don't render during SSR or if checking auth
  if (!mounted || authStatus === 'checking') {
    return <div className={styles.loading}>Loading authentication status...</div>;
  }

  // If not authenticated, show a message
  if (authStatus === 'unauthenticated') {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          You need to log in to access this page.
          <button 
            onClick={() => router.push('/admin/login')}
            className={styles.button}
            style={{marginTop: '1rem', display: 'block'}}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Render authenticated content
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Analytics Dashboard</h1>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>

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

      {error && <div className={styles.error}>{error}</div>}

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
    </div>
  );
}
