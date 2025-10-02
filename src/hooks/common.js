import { useState, useEffect, useMemo } from 'react';

// Hook để quản lý localStorage
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

// Hook để quản lý modal state
export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const toggleModal = () => setIsOpen(!isOpen);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal
  };
}

// Hook để quản lý form state
export function useForm(initialValues = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const setValue = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const setError = (name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const setFieldTouched = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValue(name, type === 'checkbox' ? checked : value);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setFieldTouched(name);
  };

  return {
    values,
    errors,
    touched,
    setValue,
    setError,
    setFieldTouched,
    reset,
    handleChange,
    handleBlur
  };
}

// Hook để quản lý API calls
export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (apiCall) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, execute };
}

// Hook để quản lý table state
export function useTable(initialData = []) {
  const [data, setData] = useState(initialData);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filterConfig, setFilterConfig] = useState({});

  const sortData = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filterData = (filters) => {
    setFilterConfig(filters);
  };

  const sortedAndFilteredData = useMemo(() => {
    let result = [...data];

    // Apply filters
    Object.entries(filterConfig).forEach(([key, value]) => {
      if (value) {
        result = result.filter(item => 
          item[key]?.toString().toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, sortConfig, filterConfig]);

  return {
    data: sortedAndFilteredData,
    setData,
    sortConfig,
    sortData,
    filterConfig,
    filterData
  };
}
