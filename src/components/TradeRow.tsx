// TradeRow.js
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';

function TradeRow({ trade, onRowClick }) {
  const isProfit = trade.actualProfitLoss > 0;
  const profitLossColor = isProfit ? "text-green-500" : "text-red-500";
  const formattedDateTime = trade.dateTime ? format(new Date(trade.dateTime), 'dd/MM/yyyy HH:mm:ss') : "N/A";

  return (
    <TableRow
      className="hover:bg-gray-700 transition duration-300 text-center text-gray-200 cursor-pointer"
      onClick={() => onRowClick(trade)}
    >
      <TableCell className="p-4">{formattedDateTime}</TableCell>
      <TableCell className="p-4">{trade.hoursHeld}</TableCell>
      <TableCell className="p-4">{trade.stars}</TableCell>
      <TableCell className="p-4">{trade.pair}</TableCell>
      <TableCell className="p-4">{trade.tradeType}</TableCell>
      <TableCell className="p-4">{trade.lotSize}</TableCell>
      <TableCell className="p-4">{trade.entryPrice}</TableCell>
      <TableCell className="p-4">{trade.takeProfit}</TableCell>
      <TableCell className="p-4">{trade.stopLoss}</TableCell>
      <TableCell className="p-4">{trade.actualExit ?? "Open"}</TableCell>
      <TableCell className={`p-4 ${profitLossColor}`}>
        {trade.actualProfitLoss !== null ? `$${trade.actualProfitLoss}` : "N/A"}
      </TableCell>
    </TableRow>
  );
}

export default TradeRow;
