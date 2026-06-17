import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';

export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(url, options);
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching data');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  const refetch = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(url, options);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};