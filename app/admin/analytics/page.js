'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import { isAuthenticated, signOut } from '../../../lib/auth';
import { 
  fetchGaPageViews, fetchGaEvents, fetchGaReferrals,
  mockPageViews, mockEventCounts, mockReferrals,
  signOutFromGoogle
} from '../../../lib/gaApi';
import styles from './analytics.module.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFF', '#FF6663'];

export default function AnalyticsDashboard() {
  const [pageViews, setPageViews] = useState([]);
  const [eventCounts, setEventCounts] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gaAuthRequired, setGaAuthRequired] = useState(false);
  const [timeRange, setTimeRange] = useState('7days');
  const [authStatus, setAuthStatus] = useState('checking');
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isDev, setIsDev] = useState(false);

  // Handle mounting state - fix for hydration issues
  useEffect(() => {
    setMounted(true);
    setIsDev(process.env.NODE_ENV === 'development');
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
      setGaAuthRequired(false);
      
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
        
        try {
          // Fetch real analytics data
          const [pageViewsData, eventsData, referralsData] = await Promise.all([
            fetchGaPageViews(startDateStr, endDateStr),
            fetchGaEvents(startDateStr, endDateStr),
            fetchGaReferrals(startDateStr, endDateStr)
          ]);
          
          // Check if we got actual data back
          if (pageViewsData.length === 0) {
            console.warn('No page view data returned, using mock data');
            setPageViews(mockPageViews);
          } else {
            setPageViews(pageViewsData);
          }
          
          if (eventsData.length === 0) {
            console.warn('No event data returned, using mock data');
            setEventCounts(mockEventCounts);
          } else {
            setEventCounts(eventsData);
          }
          
          if (referralsData.length === 0) {
            console.warn('No referral data returned, using mock data');
            setReferrals(mockReferrals);
          } else {
            setReferrals(referralsData);
          }
          
        } catch (apiError) {
          console.error('API Error:', apiError);
          
          // Check if it's an authentication error
          if (apiError.message && (
              apiError.message.includes('User declined to authorize') ||
              apiError.message.includes('authentication credentials')
          )) {
            setGaAuthRequired(true);
            setError("Google Analytics authorization required. Please authenticate to view real data.");
          } else {
            setError(`API Error: ${apiError.message}. Showing mock data.`);
          }
          
          // Fall back to mock data
          setPageViews(mockPageViews);
          setEventCounts(mockEventCounts);
          setReferrals(mockReferrals);
        }
      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setError("Failed to fetch analytics data: " + err.message);
        
        // Fall back to mock data as a last resort
        setPageViews(mockPageViews);
        setEventCounts(mockEventCounts);
        setReferrals(mockReferrals);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange, mounted, authStatus]);

  // Handle retry for Google Analytics authorization
  const handleRetryGaAuth = async () => {
    setIsLoading(true);
    setError(null);
    setGaAuthRequired(false);
    
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
      
      // Try fetching one metric to trigger auth flow
      await fetchGaPageViews(startDateStr, endDateStr);
      
      // If successful, refetch all data
      const [pageViewsData, eventsData, referralsData] = await Promise.all([
        fetchGaPageViews(startDateStr, endDateStr),
        fetchGaEvents(startDateStr, endDateStr),
        fetchGaReferrals(startDateStr, endDateStr)
      ]);
      
      setPageViews(pageViewsData);
      setEventCounts(eventsData);
      setReferrals(referralsData);
      
    } catch (error) {
      console.error("Auth retry failed:", error);
      setError("Google Analytics authorization failed. Using mock data.");
      
      // Keep using mock data
      setPageViews(mockPageViews);
      setEventCounts(mockEventCounts);
      setReferrals(mockReferrals);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Sign out from Google Analytics as well
    signOutFromGoogle();
    // Sign out from our app
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

      {isDev && (
        <div className={styles.devBanner}>
          <strong>Development Environment</strong> - Using mock analytics data. 
          Real data will be displayed in production.
        </div>
      )}

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

      {gaAuthRequired && (
        <div className={styles.authRequired}>
          <h3>Google Analytics Authorization Required</h3>
          <p>To view real analytics data from your website, you need to authorize access to your Google Analytics account.</p>
          <button 
            onClick={handleRetryGaAuth}
            className={styles.gaAuthButton}
          >
            Authorize Google Analytics
          </button>
          <p className={styles.smallText}>Currently showing mock data.</p>
        </div>
      )}

      {error && !gaAuthRequired && (
        <div className={styles.error}>
          {error}
          <p className={styles.smallText}>Showing fallback data. Check console for more details.</p>
        </div>
      )}

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
