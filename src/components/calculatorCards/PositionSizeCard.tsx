import React, { useEffect, useState } from 'react';
import { CardContent, CardFooter, CardHeader } from '../ui/card';
import { Input } from '../ui/Input';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';
import { FaInfoCircle } from 'react-icons/fa';
import { Separator } from '../ui/separator';


const PositionSizeCard = ({ accountBalance,selectedCurrency, setAccountBalance, riskPercentage, setRiskPercentage, stopLossPips, setStopLossPips, exchangeRate }) => {
  const [positionSize, setPositionSize] = useState(0);

  useEffect(() => {
    // Define pip size based on currency pair (JYP pairs usually have a pip size of 0.01)
    const pipSize = selectedCurrency.includes('JPY') ? 0.01 : 0.0001;
  
    // Calculate position size in terms of units (adjusting for pip size and exchange rate)
    const calcPositionSize = (riskPercentage / 100 * accountBalance) / (stopLossPips * (pipSize / exchangeRate));
  
    // Convert the position size (in units) to lot size (1 lot = 100,000 units for a standard lot)
    const lotSize = calcPositionSize / 100000;
  
    // Round the lot size to a suitable precision (1 lot, 0.1 lot, etc.)
    const roundedLotSize = Math.round(lotSize * 100) / 100;
  
    // Set the lot size
    setPositionSize(roundedLotSize);
  }, [accountBalance, riskPercentage, stopLossPips, exchangeRate, selectedCurrency]);
  
  
  
  return (
    <div className="mt-2 ml-4 relative flex flex-col w-2/5 h-72 bg-gradient-to-b from-gray-700 to-gray-900 text-gray-100 shadow-lg rounded-md p-4 mb-2">
    <HoverCard>
      <HoverCardTrigger>
        <FaInfoCircle className="absolute top-2 right-2 cursor-pointer text-lg text-gray-400" />
      </HoverCardTrigger>
      <HoverCardContent className="w-full p-2 bg-gray-800 text-white rounded shadow-md">
        <p className="mb-2"><strong>Position Size Calculator</strong></p>
        <Separator />
        
        <p className="mb-2"><strong>Account Balance:</strong> Your total balance to use for trading.</p>
        
        <p className="mb-2"><strong>Risk Percentage:</strong> The portion of your account balance you're willing to risk (e.g., 2%).</p>
        
        <p className="mb-2"><strong>Stop Loss (Pips):</strong> The pip distance for your stop-loss.</p>
        
        <p className="mb-2"><strong>Exchange Rate:</strong> The current exchange rate for the currency pair.</p>
        
        <Separator />
        
        <p className="mb-2">This calculator helps determine the optimal position size based on your risk parameters.</p>
      </HoverCardContent>
    </HoverCard>


  
  <CardHeader className="self-center text-center items-center rounded-3xl w-full">Position Size</CardHeader>
  <CardContent>
    <Input type="integer" className="w-full border-gray-600  p-2 rounded-md text-gray-200 mb-2" placeholder="Account Balance" value={accountBalance} onChange={(e) => setAccountBalance(e.target.value)} />
    <Input type="integer" className="w-full border-gray-600  p-2 rounded-md text-gray-200 mb-2" placeholder="Risk Percentage" value={riskPercentage} onChange={(e) => setRiskPercentage(e.target.value)} />
    <Input type="integer" className="w-full border-gray-600  p-2 rounded-md text-gray-200 " placeholder="Stop Loss (Pips)" value={stopLossPips} onChange={(e) => setStopLossPips(e.target.value)} />
  </CardContent>
  
  {positionSize !== undefined && !isNaN(positionSize) && (
  <CardFooter className="flex items-center justify-between space-x-2">
    <div className="flex flex-col items-center text-sm">
      <span className="font-medium">Lot Size</span>
      <span className="font-semibold text-blue-600">
        {positionSize.toFixed(4)}
      </span>
    </div>
    <Separator className="rotate-90 w-4" />
    <div className="flex flex-col items-center text-sm">
      <span className="font-medium">Exchange Rate</span>
      <span className="font-semibold text-green-600">
        {exchangeRate}
      </span>
    </div>
  </CardFooter>
)}

</div>

  );
};

export default PositionSizeCard;
