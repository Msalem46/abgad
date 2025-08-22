import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import api from '../../services/api';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const AnalyticsDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('30');

    useEffect(() => {
        fetchAnalytics();
    }, [dateRange]);

    const fetchAnalytics = async () => {
        try {
            const response = await api.get(`/analytics?days=${dateRange}`);
            setAnalytics(response.data.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
            // Demo data
            setAnalytics({
                total_visits: 1247,
                unique_visitors: 892,
                avg_duration: '2m 34s',
                bounce_rate: 23.5,
                daily_visits: [
                    { date: '2024-08-01', visits: 45 },
                    { date: '2024-08-02', visits: 52 },
                    { date: '2024-08-03', visits: 38 },
                    { date: '2024-08-04', visits: 61 },
                    { date: '2024-08-05', visits: 49 },
                    { date: '2024-08-06', visits: 73 },
                    { date: '2024-08-07', visits: 67 }
                ],
                device_breakdown: {
                    desktop: 45,
                    mobile: 42,
                    tablet: 13
                },
                top_stores: [
                    { name: 'مطعم الأصالة الأردنية', views: 523 },
                    { name: 'Golden Cafe', views: 387 },
                    { name: 'Tech Shop', views: 245 }
                ]
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const visitsChartData = {
        labels: analytics?.daily_visits?.map(item => new Date(item.date).toLocaleDateString()) || [],
        datasets: [
            {
                label: 'Daily Visits',
                data: analytics?.daily_visits?.map(item => item.visits) || [],
                borderColor: 'rgb(99, 102, 241)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
            },
        ],
    };

    const deviceChartData = {
        labels: ['Desktop', 'Mobile', 'Tablet'],
        datasets: [
            {
                data: [
                    analytics?.device_breakdown?.desktop || 0,
                    analytics?.device_breakdown?.mobile || 0,
                    analytics?.device_breakdown?.tablet || 0,
                ],
                backgroundColor: [
                    'rgba(99, 102, 241, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                ],
            },
        ],
    };

    const topStoresData = {
        labels: analytics?.top_stores?.map(store => store.name) || [],
        datasets: [
            {
                label: 'Views',
                data: analytics?.top_stores?.map(store => store.views) || [],
                backgroundColor: 'rgba(99, 102, 241, 0.8)',
            },
        ],
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                    <p className="text-gray-600">Track your store performance</p>
                </div>
                <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 3 months</option>
                </select>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-2xl font-bold text-gray-900">
                        {analytics?.total_visits?.toLocaleString() || 0}
                    </div>
                    <div className="text-sm text-gray-500">Total Visits</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-2xl font-bold text-gray-900">
                        {analytics?.unique_visitors?.toLocaleString() || 0}
                    </div>
                    <div className="text-sm text-gray-500">Unique Visitors</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-2xl font-bold text-gray-900">
                        {analytics?.avg_duration || '0m 0s'}
                    </div>
                    <div className="text-sm text-gray-500">Avg. Duration</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-2xl font-bold text-gray-900">
                        {analytics?.bounce_rate || '0'}%
                    </div>
                    <div className="text-sm text-gray-500">Bounce Rate</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Visits Chart */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Daily Visits Trend
                    </h3>
                    <Line
                        data={visitsChartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                            },
                        }}
                    />
                </div>

                {/* Device Breakdown */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Device Breakdown
                    </h3>
                    <Doughnut
                        data={deviceChartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                },
                            },
                        }}
                    />
                </div>

                {/* Top Stores */}
                <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Top Performing Stores
                    </h3>
                    <Bar
                        data={topStoresData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
