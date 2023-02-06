import React from 'react';
import { Box, Divider, Paper, Typography } from '@mui/material';
import { CopyTo, Icons } from '@taraxa_project/taraxa-ui';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import {
  DataRow,
  HashLink,
  PageTitle,
  TableTabs,
  TransactionIcon,
} from '../../components';
import { usePBFTDataContainerEffects } from './PBFTDataContainer.effects';
import { HashLinkType, unwrapIdentifier, zeroX } from '../../utils';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import { TableTabsProps } from '../../models';
import useStyles from './PBFTDataContainer.styles';
import { TransactionsTable } from '../../components/Tables';
import PbftLoadingSkeleton from './PbftLoadingSkeleton';

const PBFTDataContainer = (): JSX.Element => {
  const { identifier } = useParams();
  const classes = useStyles();
  const { txHash, blockNumber } = unwrapIdentifier(identifier);
  const {
    blockData,
    transactions,
    currentNetwork,
    showLoadingSkeleton,
    genesisTransactions,
  } = usePBFTDataContainerEffects(blockNumber, txHash);
  const onCopy = useCopyToClipboard();

  const tableTabs: TableTabsProps = {
    tabs: [],
    initialValue: 0,
  };

  if (transactions?.length > 0 || genesisTransactions?.length > 0) {
    const tableTransactions =
      transactions?.length > 0
        ? transactions
        : genesisTransactions?.length > 0
        ? genesisTransactions
        : [];

    tableTabs.tabs.push({
      label: 'Transactions',
      index: 0,
      icon: (
        <Box className={classes.tabIconContainer}>
          <TransactionIcon />
        </Box>
      ),
      iconPosition: 'start',
      children: <TransactionsTable transactionsData={tableTransactions} />,
    });
  }

  return (
    <>
      <PageTitle
        title='PBFT Block Info'
        subtitle={`Detailed TARAXA PBFT block information on the ${currentNetwork}.`}
      />
      {showLoadingSkeleton ? (
        <PbftLoadingSkeleton />
      ) : (
        <Paper elevation={1}>
          <Box
            display='flex'
            flexDirection='column'
            alignItems='left'
            margin='2rem 2rem 2rem'
            gap='1.5rem'
          >
            <Box
              display='flex'
              flexDirection='row'
              alignItems='center'
              justifyContent='flex-start'
              gap='2rem'
              mt={3}
            >
              <Icons.Block />
              <Typography
                variant='h6'
                component='h6'
                style={{ fontWeight: 'bold', wordBreak: 'break-all' }}
              >
                {zeroX(blockData?.hash)}
              </Typography>
              <CopyTo text={blockData?.hash} onCopy={onCopy} />
            </Box>
            <DataRow title='Number' data={`${blockData?.number}`} />
            {blockData?.nonce && (
              <DataRow title='Nonce' data={blockData?.nonce} />
            )}
            {blockData?.timestamp && (
              <DataRow
                title='Timestamp'
                data={`${moment
                  .unix(+(blockData?.timestamp || 0))
                  .format('ddd, D MMM gggg (HH:mm:ss)')} GMT`}
              />
            )}
            {(blockData?.number || blockData?.nonce || blockData.timestamp) && (
              <Divider light />
            )}
            <DataRow
              title='Parent'
              data={
                <HashLink
                  linkType={HashLinkType.PBFT}
                  width='auto'
                  hash={blockData?.parent?.hash}
                />
              }
            />
            <DataRow
              title='Author'
              data={
                <HashLink
                  linkType={HashLinkType.ADDRESSES}
                  width='auto'
                  hash={blockData?.miner?.address}
                />
              }
            />
            <DataRow
              title='Difficulty'
              data={
                <Typography style={{ wordBreak: 'break-all' }}>
                  {blockData?.difficulty}
                </Typography>
              }
            />
            <DataRow
              title='Transaction Count'
              data={`${
                blockData?.transactionCount ||
                transactions?.length ||
                genesisTransactions?.length
              }`}
            />
            {transactions?.length > 0 || genesisTransactions?.length > 0 ? (
              <>
                <Divider light />
                <Box
                  display='flex'
                  flexDirection='column'
                  alignItems='flex-start'
                  alignContent='center'
                  style={{ overflowWrap: 'anywhere' }}
                >
                  <TableTabs {...tableTabs} />
                </Box>
              </>
            ) : (
              <Box pt={1}></Box>
            )}
          </Box>
        </Paper>
      )}
    </>
  );
};

export default PBFTDataContainer;
