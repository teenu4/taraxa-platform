import { useEffect, useState } from 'react';
import { BlockData, TransactionStatus } from '../../models/TableData';
import { useExplorerNetwork } from '../../hooks/useExplorerNetwork';
import { TransactionData } from '../../models/TransactionData';

export const useTransactionDataContainerEffects = (txHash: string) => {
  const { currentNetwork } = useExplorerNetwork();
  const [events, setEvents] = useState<
    { name?: string; from?: string; to?: string; value?: string }[]
  >([{}]);
  const [dagData, setDagData] = useState<BlockData>({} as BlockData);
  const [transactionData, setTransactionData] = useState<TransactionData>(
    {} as TransactionData
  );
  useEffect(() => {
    setTimeout(() => {
      const txData: TransactionData = {
        status: TransactionStatus.SUCCESS,
        timestamp: '1661776098',
        pbftBlock: '0xc26f6b31a5f8452201af8db5cc25cf4340df8b09',
        dagBlock: '529133',
        value: '1000000',
        from: '0x00e193a15486909eba3fb36c815cb8a331180cc97a27ffb69b8122de02e5ea18',
        to: '0x00e193a15486909eba3fb36c815cb8a331180cc97a27ffb69b8122de02e5ea18',
        gasLimit: '210000',
        gas: '21000',
        gasPrice: '3100',
        nonce: 244411,
      };
      setTransactionData(txData);

      const event = [
        {
          name: 'Transfer',
          from: '0x00e193a15486909eba3fb36c815cb8a331180cc97a27ffb69b8122de02e5ea18',
          to: '0x00e193a15486909eba3fb36c815cb8a331180cc97a27ffb69b8122de02e5ea18',
          value: '100000',
        },
      ];
      setEvents(event);
    }, 1000);
  }, [txHash]);

  useEffect(() => {
    setTimeout(() => {
      const dag: BlockData = {
        timestamp: '1661776098',
        block: transactionData.dagBlock,
        level: '23213123213',
        txHash:
          '0x00e193a15486909eba3fb36c815cb8a331180cc97a27ffb69b8122de02e5ea18',
        transactionCount: 105,
      };
      setDagData(dag);
    }, 500);
  }, [transactionData.dagBlock]);

  return { transactionData, dagData, events, currentNetwork };
};
