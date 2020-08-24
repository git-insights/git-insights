import { useState, useEffect } from 'react';
import { apiClient } from 'helpers';

export default function(url) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUrl = async() => {
      try {
        const response = await apiClient(url);
        setData(response);
        setLoading(false);
      } catch (err) {
        setData(null);
        setLoading(false);
      }
    }

    fetchUrl();
  }, [url]);
  return [data, loading];
}
