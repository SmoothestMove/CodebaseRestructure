import React from 'react';

// Custom hook for persistent state using localStorage
const usePersistentReducer = <S, A>(
  reducer: (state: S, action: A) => S,
  initialState: S,
  key: string
): [S, React.Dispatch<A>] => {
  const [state, dispatch] = React.useReducer(reducer, initialState, () => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialState;
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return initialState;
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  }, [state, key]);

  return [state, dispatch];
};

export default usePersistentReducer;
