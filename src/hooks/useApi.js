import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

export const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunction(...args);
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || '오류가 발생했습니다.';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  return {
    data,
    loading,
    error,
    execute,
  };
};

export const useMutation = (apiFunction) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunction(data);
      toast.success('작업이 완료되었습니다.');
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || '오류가 발생했습니다.';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  return {
    mutate,
    loading,
    error,
  };
};

export const useQuery = (key, apiFunction, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetchCount, setRefetchCount] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunction();
      setData(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || '데이터 로딩 실패';
      setError(errorMessage);
      if (options.showError !== false) {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [apiFunction, options.showError]);

  const refetch = useCallback(() => {
    setRefetchCount(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (options.enabled !== false) {
      fetchData();
    }
  }, [fetchData, options.enabled, refetchCount]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};