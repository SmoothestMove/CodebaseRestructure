import React from 'react';

/**
 * A custom hook that combines useReducer with localStorage for persistent state.
 * @template S - The type of the state.
 * @template A - The type of the action.
 * @param {function(S, A): S} reducer - The reducer function.
 * @param {S} initialState - The initial state.
 * @param {string} key - The key to use for storing the state in localStorage.
 * @returns {[S, React.Dispatch<A>]} A tuple containing the current state and a dispatch function.
 */
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
