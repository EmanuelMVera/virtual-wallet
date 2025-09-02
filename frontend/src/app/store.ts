import { configureStore } from "@reduxjs/toolkit";
import auth from "../features/auth/authSlice";
import account from "../features/account/accountSlice";
import transaction from "../features/transaction/transactionSlice";
import bankAccount from "../features/bankAccount/bankAccountSlice";

export const store = configureStore({
  reducer: { auth, account, transaction, bankAccount },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
