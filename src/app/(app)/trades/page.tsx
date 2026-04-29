```typescript
'use client'
import React, { useEffect, useState } from 'react';
import NewEntryDrawer from '@/components/NewEntryDrawer';
import { ScrollArea } from "@/components/ui/scroll-area";
import TradeTable from '@/components/TradeTable';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

/**
 * The main dashboard page component for displaying and managing trades.
 * Provides search, sort, pagination, and a drawer to add new entries.
 *
 * @returns The rendered dashboard page.
 */
function DashboardPage() {
  const [trades, setTrades] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("dateTime");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Fetch trades from the API with pagination
  useEffect(() => {
    /**
     * Fetches trades from the API based on the current page, limit, and sort order.
     * Updates the trades state and calculates total pages.
     */
    const fetchTrades = async () => {
      try {
        const response = await fetch(`/api/trades/user-trades?page=${currentPage}&limit=${itemsPerPage}&sortBy=${sortBy}`);
        const data = await response.json();
        setTrades(data.trades || []);
        setTotalPages(Math.ceil((data.total || 0) / itemsPerPage)); // Calculate total pages from total items
      } catch (error) {
        console.error("Error fetching trades:", error);
      }
    };
    fetchTrades();
  }, [currentPage, sortBy]);

  // Filter trades by search term
  const filteredTrades = trades.filter(trade =>
    trade.pair.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Handles pagination navigation by updating the current page.
   * Ensures the page number stays within the valid range [1, totalPages].
   *
   * @param pageNumber - The target page number.
   */
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="bg-transparent h-screen flex flex-col">
      <input className="bg-gray-800 h-16 mt-2 rounded-3xl w-3/4 self-center flex items-center justify-between px-6"
        type="text"
        placeholder="Search by pair"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}/>
       
       
      

      <div className="bg-transparent flex-grow rounded-3xl flex flex-col items-center w-auto mt-4">
        <div className="flex justify-between w-3/4 ">
        <NewEntryDrawer />
          <select
            className="bg-gray-500 rounded-3xl p-2"
            onChange={e => setSortBy(e.target.value)}
            value={sortBy}
          >
            <option value="dateTime">Sort by Date</option>
            <option value="hoursHeld">Sort by Hours Held</option>
            <option value="stars">Sort by Stars</option>
          </select>
        </div >

        <ScrollArea className="flex-grow mt-2 max-h-[28rem] w-[60rem] bg-transparent rounded-md border-none p-4 overflow-y-auto">
          <TradeTable trades={filteredTrades} />
        </ScrollArea>


        <Pagination className="mb-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  isActive={currentPage === index + 1}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {totalPages > 5 && <PaginationEllipsis />}
            <PaginationItem>
              <PaginationNext
                className='read-only'
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export default DashboardPage;
```