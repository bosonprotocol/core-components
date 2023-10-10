/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from "react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { BigNumber, utils } from "ethers";
import {
  CaretDown,
  CaretLeft,
  CaretRight,
  CaretUp,
  WarningCircle
} from "phosphor-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePagination, useRowSelect, useSortBy, useTable } from "react-table";
import styled from "styled-components";

import { ProgressStatus } from "../../../lib/progress/progressStatus";
import { calcPrice } from "../../../lib/price/prices";
import { useModal } from "../../modal/useModal";
import { Tooltip } from "../../tooltip/Tooltip";
import Grid from "../../ui/Grid";
import Typography from "../../ui/Typography";
import { theme } from "../../../theme";
import { Button } from "../../buttons/Button";
import PaginationPages from "../../pagination/PaginationPages";
import Loading from "../../ui/loading/Loading";
import { subgraph } from "@bosonprotocol/core-sdk";
import {
  Currencies,
  CurrencyDisplay
} from "../../currencyDisplay/CurrencyDisplay";
import ThemedButton from "../../ui/ThemedButton";
import { ExchangeTokensProps } from "./exchange-tokens/useExchangeTokens";
dayjs.extend(isBetween);
const BosonButton = Button;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th {
    font-weight: 600;
    color: ${theme.colors.light.darkGrey};
    :not([data-sortable]) {
      cursor: default !important;
    }
    [data-sortable] {
      cursor: pointer !important;
    }
  }
  td {
    font-weight: 400;
    color: ${theme.colors.light.black};
  }
  th,
  td {
    font-family: "Plus Jakarta Sans";
    font-style: normal;
    font-size: 0.75rem;
    line-height: 1.5;
  }
  thead {
    tr {
      th {
        border-bottom: 2px solid ${theme.colors.light.border};
        text-align: left;
        padding: 0.5rem;
        &:first-child {
          padding-left: 0.5rem;
        }
        &:last-child {
          text-align: right;
        }
      }
    }
  }
  tbody {
    tr {
      :hover {
        td {
          background-color: ${theme.colors.light.darkGrey}08;
          cursor: pointer;
        }
      }
      &:not(:last-child) {
        td {
          border-bottom: 1px solid ${theme.colors.light.border};
        }
      }
      td {
        text-align: left;
        padding: 0.5rem;
        &:first-child {
        }
        &:last-child {
          text-align: right;
          > button {
            display: inline-block;
          }
        }
      }
    }
  }
  [data-testid="price"] {
    transform: scale(0.75);
  }
`;
const CurrencyName = styled(Typography)`
  > div > *:not(svg) {
    display: none;
  }
`;
const HeaderSorter = styled.span`
  margin-left: 0.5rem;
`;
const Pagination = styled.div`
  width: 100%;
  padding-top: 1rem;
  border-top: 2px solid ${theme.colors.light.border};

  select {
    padding: 0.5rem;
    border: 1px solid ${theme.colors.light.border};
    background: ${theme.colors.light.white};
    margin: 0 1rem;
  }
`;
const Span = styled.span`
  font-size: 0.75rem;
  color: ${theme.colors.light.darkGrey};
  &:not(:last-of-type) {
    margin-right: 1rem;
  }
`;

const WithdrawButton = styled(ThemedButton)`
  color: ${theme.colors.light.secondary};
  border-color: transparent;
`;
const WarningWrapper = styled(Grid)`
  svg {
    color: ${theme.colors.light.orange};
  }
`;

interface QueryProps {
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

interface FundsProps {
  funds: Array<subgraph.FundsEntityFieldsFragment>;
  reload: React.DispatchWithoutAction;
  fundStatus: ProgressStatus;
}

interface ExchangesTokensProps extends QueryProps {
  data: ExchangeTokensProps[] | undefined;
}
interface SellerExchangeProps {
  id: string;
  finalizedDate: string;
  offer: {
    sellerDeposit: string;
    price: string;
    exchangeToken: {
      id: string;
      address: string;
      decimals: string;
      symbol: string;
      name: string;
    };
  };
}
interface SellerProps {
  id: string;
  exchanges: SellerExchangeProps[];
}
interface SellerDepositProps extends QueryProps {
  data: SellerProps | undefined;
}
interface OffersBackedProps {
  offersBacked: { token: string; value: number | null }[];
  calcOffersBacked: {
    [x: string]: string;
  };
  sellerLockedFunds: {
    [x: string]: string;
  };
  threshold: number;
  displayWarning: boolean;
  offersBackedFn: (fund: subgraph.FundsEntityFieldsFragment) => number | null;
}
export type Props = {
  sellerId: string;
  funds: FundsProps;
  exchangesTokens: ExchangesTokensProps;
  sellerDeposit: SellerDepositProps;
  offersBacked: OffersBackedProps;
  sellerRoles: {
    isSeller: boolean;
    isActive: boolean;
    isAdmin: boolean;
    isClerk: boolean;
    isAssistant: boolean;
    isTreasury: boolean;
  };
};

export default function Finance({
  sellerId,
  funds: fundsData,
  exchangesTokens: exchangesTokensData,
  sellerDeposit: sellerDepositData,
  offersBacked,
  sellerRoles
}: Props) {
  const { showModal, modalTypes } = useModal();
  const { funds, reload, fundStatus } = fundsData;
  const {
    isLoading: isLoadingExchangesTokens,
    isError: isErrorExchangesTokens,
    refetch: exchangesTokensRefetch
  } = exchangesTokensData;
  const [isFundsInitialized, setIsFundsInitialized] = useState(false);

  const {
    refetch: sellerRefetch,
    isLoading: isLoadingSellerData,
    isError: sellerDataIsError
  } = sellerDepositData;

  useEffect(() => {
    if (fundStatus === ProgressStatus.SUCCESS && !isFundsInitialized) {
      setIsFundsInitialized(true);
    }
  }, [fundStatus, isFundsInitialized]);

  const columns = useMemo(
    () => [
      {
        Header: "Token",
        accessor: "token",
        disableSortBy: false
      } as const,
      {
        Header: "All funds",
        accessor: "allFund",
        disableSortBy: false
      } as const,
      {
        Header: "Locked funds",
        accessor: "lockedFunds",
        disableSortBy: false
      } as const,
      {
        Header: "Withdrawable",
        accessor: "withdrawable",
        disableSortBy: false
      } as const,
      {
        Header: "Offers backed",
        accessor: "offersBacked",
        disableSortBy: false
      } as const,
      {
        Header: "Action",
        accessor: "action",
        disableSortBy: true
      } as const
    ],
    []
  );

  const { offersBackedFn, sellerLockedFunds, threshold } = offersBacked;

  const reloadData = useCallback(() => {
    reload();
    sellerRefetch();
    exchangesTokensRefetch();
  }, [reload, sellerRefetch, exchangesTokensRefetch]);

  const offersBackedCell = useCallback(
    (value: number | null) => {
      if (value === null) {
        return "";
      }
      if (Number(value) < threshold) {
        return (
          <>
            <WarningCircle size={15} /> {value} %
          </>
        );
      }
      return `${value} %`;
    },
    [threshold]
  );

  const data = useMemo(
    () =>
      funds?.map((fund) => {
        const decimals = Number(fund?.token?.decimals || 18);
        const lockedFunds = sellerLockedFunds?.[fund.token.symbol] ?? "0";
        const lockedFundsFormatted = utils.formatUnits(lockedFunds, decimals);
        const withdrawable = calcPrice(
          fund.availableAmount,
          decimals.toString()
        );
        const allFunds = calcPrice(
          BigNumber.from(lockedFunds)
            .add(BigNumber.from(fund.availableAmount))
            .toString(),
          decimals.toString()
        );
        return {
          token: (
            <CurrencyName tag="p" gap="0.5rem">
              {fund.token.symbol}
              <Tooltip content={fund.token.symbol} wrap={false}>
                <CurrencyDisplay
                  currency={fund.token.symbol as Currencies}
                  height={18}
                />
              </Tooltip>
            </CurrencyName>
          ),
          allFund: <Typography tag="p">{allFunds}</Typography>,
          lockedFunds: <Typography tag="p">{lockedFundsFormatted}</Typography>,
          withdrawable: <Typography tag="p">{withdrawable}</Typography>,
          offersBacked: (
            <Typography tag="p">
              <WarningWrapper gap="0.2rem" justifyContent="flex-start">
                {offersBackedCell(offersBackedFn(fund))}
              </WarningWrapper>
            </Typography>
          ),
          action: (
            <Grid justifyContent="flex-end" gap="1rem">
              <WithdrawButton
                theme="blank"
                size="small"
                disabled={!sellerRoles.isClerk}
                tooltip="This action is restricted to only the clerk wallet" // check
                onClick={() => {
                  showModal(
                    modalTypes.FINANCE_WITHDRAW_MODAL,
                    {
                      title: `Withdraw ${fund.token.symbol}`,
                      protocolBalance: withdrawable,
                      symbol: fund.token.symbol,
                      accountId: sellerId,
                      tokenDecimals: fund.token.decimals,
                      exchangeToken: fund.token.address,
                      availableAmount: fund.availableAmount,
                      reload: reloadData
                    },
                    "auto",
                    "dark"
                  );
                }}
              >
                Withdraw
              </WithdrawButton>
              <BosonButton
                variant="accentInverted"
                size="small"
                onClick={() => {
                  showModal(
                    modalTypes.FINANCE_DEPOSIT_MODAL,
                    {
                      title: `Deposit ${fund.token.symbol}`,
                      protocolBalance: withdrawable,
                      symbol: fund.token.symbol,
                      accountId: sellerId,
                      tokenDecimals: fund.token.decimals,
                      exchangeToken: fund.token.address,
                      reload: reloadData
                    },
                    "auto",
                    "dark"
                  );
                }}
              >
                Deposit
              </BosonButton>
            </Grid>
          )
        };
      }),
    [
      funds,
      sellerLockedFunds,
      offersBackedCell,
      offersBackedFn,
      sellerRoles.isClerk,
      showModal,
      modalTypes.FINANCE_WITHDRAW_MODAL,
      modalTypes.FINANCE_DEPOSIT_MODAL,
      sellerId,
      reloadData
    ]
  );

  const tableProps = useTable(
    {
      columns,
      data,
      // @ts-ignore// TODO: check
      initialState: { pageIndex: 0 }
    },
    useSortBy,
    usePagination,
    useRowSelect
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    // @ts-ignore// TODO: check
    page,
    prepareRow,
    // @ts-ignore// TODO: check
    canPreviousPage,
    // @ts-ignore// TODO: check
    canNextPage,
    // @ts-ignore// TODO: check
    gotoPage,
    // @ts-ignore// TODO: check
    nextPage,
    // @ts-ignore// TODO: check
    previousPage,
    // @ts-ignore// TODO: check
    setPageSize,
    // @ts-ignore// TODO: check
    pageCount,
    // @ts-ignore// TODO: check
    state: { pageIndex, pageSize }
  } = tableProps;

  const paginate = useMemo(() => {
    return Array.from(Array(pageCount).keys()).slice(
      pageIndex < 1 ? 0 : pageIndex - 1,
      pageIndex < 1 ? 3 : pageIndex + 2
    );
  }, [pageCount, pageIndex]);

  if (!isFundsInitialized || isLoadingSellerData || isLoadingExchangesTokens) {
    return <Loading />;
  }

  if (
    sellerDataIsError ||
    fundStatus === ProgressStatus.ERROR ||
    isErrorExchangesTokens
  ) {
    // TODO: NO FIGMA REPRESENTATIONS
  }

  return (
    <>
      <Table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, key) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              key={`seller_table_thead_tr_${key}`}
            >
              {headerGroup.headers.map((column, i) => {
                return (
                  <th
                    // @ts-ignore// TODO: check
                    data-sortable={column.disableSortBy}
                    // @ts-ignore// TODO: check
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={`seller_table_thead_th_${i}`}
                  >
                    {column.render("Header")}
                    {/* @ts-ignore// TODO: check */}
                    {i >= 0 && !column.disableSortBy && (
                      <HeaderSorter>
                        {/* @ts-ignore// TODO: check */}
                        {column?.isSorted ? (
                          // @ts-ignore// TODO: check
                          column?.isSortedDesc ? (
                            <CaretDown size={14} />
                          ) : (
                            <CaretUp size={14} />
                          )
                        ) : (
                          ""
                        )}
                      </HeaderSorter>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {(page.length > 0 &&
            // @ts-ignore// TODO: check
            page.map((row, id) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  key={`seller_table_finances_tbody_tr_${id}`}
                >
                  {
                    // @ts-ignore// TODO: check
                    row.cells.map((cell, key) => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          key={`seller_table_finances_tbody_td_${id}-${key}`}
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })
                  }
                </tr>
              );
            })) || (
            <tr>
              <td colSpan={columns.length}>
                <Typography
                  tag="h6"
                  justifyContent="center"
                  padding="1rem 0"
                  margin="0"
                >
                  No data to display
                </Typography>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <Pagination>
        <Grid>
          <Grid justifyContent="flex-start" gap="1rem">
            <Span>
              Show
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                }}
              >
                {[5, 10, 25, 50, 100].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
              per page
            </Span>
            <PaginationPages
              pageIndex={pageIndex + 1}
              pageSize={pageSize}
              allItems={rows.length}
            />
          </Grid>
          {pageCount > 1 && (
            <Grid justifyContent="flex-end" gap="1rem">
              <Button
                size="small"
                // theme="blank"
                variant="secondaryFill" // check
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                <CaretLeft size={16} />
              </Button>
              {paginate.map((pageNumber: number) => (
                <Button
                  key={`page_btn_${pageNumber}`}
                  size="small"
                  // theme="blank"
                  variant="secondaryFill" // check
                  style={{
                    color:
                      pageNumber === pageIndex
                        ? theme.colors.light.secondary
                        : theme.colors.light.black,
                    background:
                      pageNumber === pageIndex
                        ? theme.colors.light.lightGrey
                        : "transparent"
                  }}
                  onClick={() => gotoPage(pageNumber)}
                >
                  {pageNumber + 1}
                </Button>
              ))}
              <Button
                size="small"
                // theme="blank"
                variant="secondaryFill" // check
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                <CaretRight size={16} />
              </Button>
            </Grid>
          )}
        </Grid>
      </Pagination>
    </>
  );
}
