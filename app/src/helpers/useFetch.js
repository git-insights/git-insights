import { useState, useEffect } from 'react';
import { apiClient } from 'helpers';

export default function(url) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  async function fetchUrl() {
    try {
      const response = await apiClient(url);
      setData(response);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setData(null);
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchUrl();
  }, []);
  return [data, loading];
}
