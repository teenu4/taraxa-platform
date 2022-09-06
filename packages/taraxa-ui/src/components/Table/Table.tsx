import React from 'react';
import {
  CssBaseline,
  ThemeProvider,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Paper,
  Table as MTable,
  TableHead,
} from '@mui/material';

import moment from 'moment';
import { useMediaQuery } from 'react-responsive';
import useStyles from './Table.styles';
import theme from '../theme';

export interface TableProps {
  columns: { path: string; name: string }[];
  rows: {
    Icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    data: any[];
  }[];
  fixedLayout?: boolean;
}

export default function Table({
  columns,
  rows,
  fixedLayout = true,
}: TableProps) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={classes.root}>
        <Paper
          className={isMobile ? classes.mobilePaper : classes.paper}
          elevation={0}
        >
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component='div'
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            SelectProps={{
              MenuProps: { classes: { paper: classes.tablePaginationList } },
            }}
            classes={{
              root: classes.tablePagination,
              selectLabel: classes.tablePaginationCaption,
              selectIcon: classes.tablePaginationSelectIcon,
              select: classes.tablePaginationSelect,
              actions: classes.tablePaginationActions,
              menuItem: classes.tablePaginationSelect,
            }}
          />
          <TableContainer>
            <MTable
              className={classes.table}
              aria-labelledby='tableTitle'
              size='medium'
              aria-label='enhanced table'
              style={
                fixedLayout ? { tableLayout: 'fixed' } : { tableLayout: 'auto' }
              }
            >
              <TableHead>
                <TableRow tabIndex={-1} key='index'>
                  {columns.map((column, index) => (
                    <TableCell key={`${index}-${index}-head`}>
                      {column.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) =>
                    row.data.map((rowData: any) =>
                      isMobile ? (
                        <TableRow tabIndex={-1} key={index}>
                          {row.Icon && (
                            <TableCell
                              className={classes.mobileTableCell}
                              align='left'
                              key={`${index}-${index}`}
                            >
                              <row.Icon />
                            </TableCell>
                          )}
                          {columns.map(({ path }, j) =>
                            rowData[path] instanceof Date ? (
                              <TableCell
                                className={classes.mobileDateTableCell}
                                key={`${index}-${j}`}
                              >
                                {moment(rowData[path]).fromNow()}
                              </TableCell>
                            ) : (
                              <TableCell
                                className={classes.mobileTableCell}
                                align={!row.Icon ? 'center' : 'right'}
                                key={`${index}-${j}`}
                              >
                                {rowData[path]}
                              </TableCell>
                            )
                          )}
                        </TableRow>
                      ) : (
                        <TableRow tabIndex={-1} key={index}>
                          {row.Icon && (
                            <TableCell
                              className={classes.tableCell}
                              align='left'
                              key={`${index}-${index}-icon`}
                            >
                              <row.Icon />
                            </TableCell>
                          )}
                          {columns.map(({ path }, i) =>
                            rowData[path] instanceof Date ? (
                              <TableCell
                                className={classes.dateTableCell}
                                align={!row.Icon ? 'center' : 'right'}
                                key={`${index}-${index}-date`}
                              >
                                {moment(rowData[path]).fromNow()}
                              </TableCell>
                            ) : (
                              <TableCell
                                className={classes.tableCell}
                                align={!row.Icon ? 'center' : 'right'}
                                key={`${index}-${i}`}
                              >
                                {rowData[path]}
                              </TableCell>
                            )
                          )}
                        </TableRow>
                      )
                    )
                  )}
              </TableBody>
            </MTable>
          </TableContainer>
        </Paper>
      </div>
    </ThemeProvider>
  );
}