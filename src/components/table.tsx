import React, { useMemo, useState, useEffect } from 'react';
import { useTable, useSortBy, useFilters, usePagination, useGlobalFilter, useRowSelect } from 'react-table';
import { FaDownload, FaRedo, FaBars, FaTrash } from 'react-icons/fa';

interface TableData {
    id: string;
    symbol: string;
    name: string;
    rank: number;
    price_usd: number;
    percent_change_24h: number;
    percent_change_1h: number;
    percent_change_7d: number;
    price_btc: number;
    market_cap_usd: number;
    volume24: number;
    csupply: number;
    tsupply: number;
    msupply: number;
}

const Table: React.FC<{ data: TableData[] }> = ({ data }) => {
    const [searchValue, setSearchValue] = useState('');

    const [selectedRows, setSelectedRows] = useState<TableData[]>([]);

    const columns = useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'id',
            },
            {
                Header: 'Rank',
                accessor: 'rank',
            },
            {
                Header: 'Name',
                accessor: 'name',
            },
            {
                Header: 'Price USD',
                accessor: 'price_usd',
            },
            {
                Header: '% Change (24h)',
                accessor: 'percent_change_24h',
            },
            {
                Header: 'Price BTC',
                accessor: 'price_btc',
            },
            {
                Header: 'Market Cap USD',
                accessor: 'market_cap_usd',
            },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        pageOptions,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
        preGlobalFilteredRows,
        setGlobalFilter,
        selectedFlatRows,
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 10 },
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        usePagination,
        useRowSelect,
        (hooks) => {
            hooks.visibleColumns.push((columns) => [
                {
                    id: 'selection',
                    Header: ({ getToggleAllRowsSelectedProps }) => (
                        <div>
                            <input type="checkbox" {...getToggleAllRowsSelectedProps()} />
                        </div>
                    ),
                    Cell: ({ row }) => (
                        <div>
                            <input type="checkbox" {...row.getToggleRowSelectedProps()} />
                        </div>
                    ),
                },
                ...columns,
            ]);
        }
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
        setGlobalFilter(e.target.value || undefined);
    };

    const exportSelectedRows = () => {
        const csvData = selectedFlatRows.map((row) => row.original).map((row) =>
            Object.values(row).join(',')
        );
        if (selectedRows.length === 0) {
            alert('Selection is empty, please select some data first');
            return;
        }
        const csvContent = csvData.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Data Stocks.csv';
        link.click();
    };

    useEffect(() => {
        const selectedRows = selectedFlatRows.map((row) => row.original);
        setSelectedRows(selectedRows);
    }, [selectedFlatRows]);


    function RefreshPage() {
        window.location.reload();
    }

    return (
        <div className="w-full">
            <div className="mb-4 flex flex-col items-center sm:flex-row sm:justify-between">
                {/* Right Side of Search - With Search Bar */}
                <div className="flex items-center mb-4 sm:mb-0">
                    <h1 className="font-bold mr-4">Your Heading</h1>
                    <div className="flex items-center bg-white rounded-r-md px-2 py-1">
                        <div className="bg-blue-50 py-0.5 px-2 border border-blue-100 rounded">
                            <h1 className="text-base mr-2 text-blue-600">Data label</h1>
                        </div>
                        <div className="flex items-center ml-2">
                            <input
                                type="text"
                                value={searchValue}
                                onChange={handleSearchChange}
                                placeholder="Search..."
                                className="shadow-md px-4 py-3 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2 w-72 sm:w-64 md:w-72"
                                style={{
                                    background: '#F7FAFF',
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Left Side of Search */}
                <div className="flex flex-wrap justify-center sm:justify-start">
                    <button
                        className="bg-white-200 px-4 py-2 rounded-md mr-2 mb-2 sm:mb-0 flex items-center"
                    >
                        <FaTrash className="mr-1" /> Filters
                    </button>
                    <button
                        className="bg-white-200 px-4 py-2 rounded-md mr-2 mb-2 sm:mb-0 flex items-center"
                    >
                        <FaBars className="mr-1" /> Filters
                    </button>
                    <button
                        className="bg-white-200 px-4 py-2 rounded-md mr-2 mb-2 sm:mb-0 flex items-center"
                        style={{ border: '1px solid gray' }}
                        onClick={exportSelectedRows}
                    >
                        <FaDownload className="mr-2" />
                        Export
                    </button>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center mb-2 sm:mb-0"
                        onClick={RefreshPage}
                    >
                        <FaRedo className="mr-2" />
                        Refresh
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table {...getTableProps()} className="table-auto w-full border-collapse border border-gray-800">
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        className="px-4 py-2 text-left bg-custom-color border border-gray-400"
                                    >
                                        <div className="flex items-center">
                                            {column.render('Header')}
                                            <span className="ml-2">
                                                {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                                            </span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.map((row) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()} className="hover:bg-gray-100">
                                    {row.cells.map((cell) => (
                                        <td {...cell.getCellProps()} className="px-4 py-2 border border-gray-400">
                                            {cell.render('Cell')}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="flex flex-col items-center justify-center mt-4">
                <div className="flex items-center mb-2">
                    <button
                        onClick={() => gotoPage(0)}
                        disabled={!canPreviousPage}
                        className="px-4 py-2 mr-2 text-sm font-medium text-white bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50"
                    >
                        First
                    </button>
                    <button
                        onClick={() => previousPage()}
                        disabled={!canPreviousPage}
                        className="px-4 py-2 mr-2 text-sm font-medium text-white bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="mr-2 text-sm font-medium">
                        Page{' '}
                        <strong>
                            {pageIndex + 1} of {pageOptions.length}
                        </strong>{' '}
                    </span>
                    <button
                        onClick={() => nextPage()}
                        disabled={!canNextPage}
                        className="px-4 py-2 mr-2 text-sm font-medium text-white bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50"
                    >
                        Next
                    </button>
                    <button
                        onClick={() => gotoPage(pageOptions.length - 1)}
                        disabled={!canNextPage}
                        className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50"
                    >
                        Last
                    </button>
                </div>
                <div className="mt-2">
                    <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className="px-4 py-2 text-sm font-medium bg-gray-800 text-white rounded"
                    >
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Table;