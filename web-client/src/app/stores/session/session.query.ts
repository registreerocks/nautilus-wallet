import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import {
  AccountData,
  extractAlgorandAssetBalance,
} from 'src/app/services/algosdk.utils';
import { environment } from 'src/environments/environment';
import { SessionState, SessionStore } from './session.store';

@Injectable({
  providedIn: 'root',
})
export class SessionQuery extends Query<SessionState> {
  name = this.select('name');
  walletId = this.select('walletId');

  // XXX(Pi): Just use Algorand asset balance, for now.
  balance = this.select((state) =>
    state.algorandAccount
      ? assetBalanceForDisplay(state.algorandAccount)
      : undefined
  );

  constructor(protected store: SessionStore) {
    super(store);
  }
}

/**
 * Get the account's default asset balance, decimal-adjusted for display.
 */
const assetBalanceForDisplay = (
  algorandAccount: AccountData
): number | null => {
  const balance = extractAlgorandAssetBalance(
    algorandAccount,
    environment.defaultAlgorandAssetId
  );
  if (balance === null) {
    return null;
  }
  return balance / 10 ** environment.defaultAlgorandAssetDecimals;
};
