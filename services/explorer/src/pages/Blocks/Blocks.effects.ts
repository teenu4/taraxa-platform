import { useEffect, useState } from 'react';
import { useExplorerLoader } from '../../hooks/useLoader';
import { BlockData, ColumnData } from '../../models/TableData';
import { useExplorerNetwork } from '../../hooks/useExplorerNetwork';

const cols = [
  { path: 'timestamp', name: 'Age' },
  { path: 'block', name: 'Block' },
  { path: 'hash', name: 'Tx Hash' },
  { path: 'transactionCount', name: 'Transactions' },
];

const rows = [
  {
    timestamp: `${Date.now()}`,
    block: '529133',
    hash: '0x00e193a15486909eba3fb36c815cb8a331180cc97a27ffb69b8122de02e5ea18',
    transactionCount: 72,
  },
  {
    timestamp: '1661416929',
    block: '529131',
    hash: '0x00e193a15486909eba3fb36c815cb8a331180cc97a27ffb69b8122de02e5ea18',
    transactionCount: 70,
  },
  {
    timestamp: '1661429710',
    block: '529134',
    hash: '0x00e193a15486909eba3fb36c815cb8a331180cc97a27ffb69b8122de02e5ea18',
    transactionCount: 79,
  },
  {
    timestamp: '1661429710',
    block: '529134',
    hash: '0x00e193a15486909eba3fb36c815cb8a331180cc97a27ffb69b8122de02e5ea18',
    transactionCount: 101,
  },
  {
    timestamp: '1661429710',
    block: '529134',
    hash: '0x00e193a15486909eba3fb36c815cb8a331180cc97a27ffb69b8122de02e5ea18',
    transactionCount: 109,
  },
  {
    timestamp: '1661429710',
    block: '529134',
    hash: '0x00e193a15486909eba3fb36c815cb8a331180cc97a27ffb69b8122de02e5ea18',
    transactionCount: 55,
  },
  {
    timestamp: '1661429710',
    block: '529134',
    hash: '0x00e193a15486909eba3fb36c815cb8a331180cc97a27ffb69b8122de02e5ea18',
    transactionCount: 72,
  },
  {
    timestamp: '1661429710',
    block: '529134',
    hash: '0x00e193a15486909eba3fb36c815cb8a331180cc97a27ffb69b8122de02e5ea18',
    transactionCount: 72,
  },
  {
    timestamp: '1661429710',
    block: '529134',
    hash: '0x00e193a15486909eba3fb36c815cb8a331180cc97a27ffb69b8122de02e5ea18',
    transactionCount: 72,
  },
  {
    timestamp: '1661429710',
    block: '529134',
    hash: '0x00e193a15486909eba3fb36c815cb8a331180cc97a27ffb69b8122de02e5ea18',
    transactionCount: 72,
  },
  {
    timestamp: '1661429710',
    block: '529134',
    hash: '0x00e193a15486909eba3fb36c815cb8a331180cc97a27ffb69b8122de02e5ea18',
    transactionCount: 72,
  },
  {
    timestamp: '1661429710',
    block: '529134',
    hash: '0x00e193a15486909eba3fb36c815cb8a331180cc97a27ffb69b8122de02e5ea18',
    transactionCount: 72,
  },
  {
    timestamp: '1661429710',
    block: '529134',
    hash: '0x00e193a15486909eba3fb36c815cb8a331180cc97a27ffb69b8122de02e5ea18',
    transactionCount: 72,
  },
  {
    timestamp: '1661429710',
    block: '529134',
    hash: '0x00e193a15486909eba3fb36c815cb8a331180cc97a27ffb69b8122de02e5ea18',
    transactionCount: 72,
  },
];

export const useBlockEffects = () => {
  const [data, setData] = useState<BlockData[]>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [columns, setColumns] = useState<ColumnData[]>(cols);
  const { currentNetwork } = useExplorerNetwork();
  const { initLoading, finishLoading } = useExplorerLoader();

  useEffect(() => {
    initLoading();
    setTimeout(() => {
      setData(rows);
      finishLoading();
    }, 3000);
  }, []);

  return { data, columns, currentNetwork };
};
