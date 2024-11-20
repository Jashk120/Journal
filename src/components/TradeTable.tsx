// TradeTable.js
import React, { useState } from 'react';
import TradeRow from './TradeRow';
import TradeDetailSheet from './TradeDetailSheet';
import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";

function TradeTable({ trades }) {
  const [selectedTrade, setSelectedTrade] = useState(null);

  // Handler to open sheet with trade details
  const handleRowClick = (trade) => {
    setSelectedTrade(trade);
  };

  // Handler to close sheet
  const handleCloseSheet = () => {
    setSelectedTrade(null);
  };

  return (
    <div>
      <Table className="bg-gray-800 shadow-lg rounded-lg text-gray-100">
        <TableHeader>
          <TableRow className="sticky top-0 bg-gray-800 z-10 hover:bg-gray-800">
            {['Date', 'Hours Held', 'Stars', 'Pair', 'Type', 'Lot Size', 'Entry Price', 'Take Profit', 'Stop Loss', 'Actual Exit', 'Profit/Loss'].map((header) => (
              <TableHead key={header} className="text-center text-gray-400 p-4 font-semibold">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.map(trade => (
            <TradeRow key={trade.id} trade={trade} onRowClick={handleRowClick} />
          ))}
        </TableBody>
      </Table>

      
      {selectedTrade && (
        <TradeDetailSheet trade={selectedTrade} onClose={handleCloseSheet} />
      )}
    </div>
  );
}

export default TradeTable;
