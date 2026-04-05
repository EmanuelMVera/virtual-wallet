import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { processTransaction, fetchHistory } from '../features/transactionSlice';
import { getMe } from '../features/userSlice';

export const useTransfer = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.transaction);

  const executeTransfer = useCallback(async (data: { to: string; amount: number }) => {
    const result = await dispatch(processTransaction({ 
      type: 'transfer', 
      payload: { 
        targetAlias: data.to, 
        amount: data.amount 
      } 
    }));
    
    if (processTransaction.fulfilled.match(result)) {
      dispatch(getMe()); 
    }
    return result;
  }, [dispatch]);

  return { executeTransfer, loading, error };
};

export const useTransactions = () => {
  const dispatch = useAppDispatch();
  const { history, loading, error } = useAppSelector(state => state.transaction);

  const fetchTransactions = useCallback(() => {
    dispatch(fetchHistory());
  }, [dispatch]);

  return { 
    transactions: history, 
    fetchTransactions, 
    loading, 
    error 
  };
};