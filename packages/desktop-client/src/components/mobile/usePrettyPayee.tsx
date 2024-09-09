import { isPreviewId } from 'loot-core/shared/transactions';
import { useAccount } from '../../hooks/useAccount';
import {
  AccountEntity,
  PayeeEntity,
  TransactionEntity,
} from 'loot-core/types/models';

type UsePrettyPayeeProps = {
  transaction: TransactionEntity & { _inverse?: boolean };
  payee?: PayeeEntity;
  transferAccount?: AccountEntity;
};

export function usePrettyPayee({
  transaction,
  payee,
  transferAccount,
}: UsePrettyPayeeProps) {
  const { id, amount: originalAmount, account, _inverse } = transaction;
  const transactionAccount = useAccount(account);

  const isPreview = isPreviewId(id);
  const amount = isPreview
    ? (_inverse ? -1 : 1) * originalAmount
    : originalAmount;

  if (transferAccount) {
    const transferAccountName = isPreview
      ? _inverse
        ? transactionAccount?.name
        : transferAccount.name
      : transferAccount.name;
    return `Transfer ${amount > 0 ? 'from' : 'to'} ${transferAccountName}`;
  } else if (transaction.is_parent) {
    return 'Split';
  } else if (payee) {
    return payee.name;
  }

  return '';
}
