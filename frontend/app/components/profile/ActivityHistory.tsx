'use client';

import { useEffect, useState } from 'react';

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

export default function ActivityHistory() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/profile/activity');
        if (!response.ok) {
          throw new Error('Failed to fetch activity history');
        }
        const data = await response.json();
        setActivities(data);
      } catch (err) {
        setError('Failed to load activity history');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-200 rounded"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-sm">
        {error}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-gray-500 text-sm">
        No activity history found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {activity.description}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(activity.timestamp).toLocaleString()}
              </p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {activity.type}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
} 