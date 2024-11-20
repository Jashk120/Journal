import React, { useState, useEffect } from 'react';
import { CardContent, CardFooter, CardHeader } from '../ui/card';
import { Input } from '../ui/input';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';
import { FaInfoCircle } from 'react-icons/fa';
import { Separator } from '../ui/separator';

const MarketDistanceCalculator = () => {
  const [distance, setDistance] = useState(0);
  const [percentageDifference, setPercentageDifference] = useState(0);

  // State variables for current market price and moving average of 100
  const [currentMarketPrice, setCurrentMarketPrice] = useState("");
  const [movingAvg100, setMovingAvg100] = useState("");

  useEffect(() => {
    
      
    if (currentMarketPrice && movingAvg100) {
      let calculatedDistance = 0;
      let calculatedPercentage = 0;

      // Calculate distance and percentage difference
      if (currentMarketPrice > movingAvg100) {
        calculatedDistance = currentMarketPrice - movingAvg100; // Bullish market
      } else {
        calculatedDistance = movingAvg100 - currentMarketPrice; // Bearish market
      }

      calculatedPercentage = (calculatedDistance / movingAvg100) * 100;

      setDistance(calculatedDistance);
      setPercentageDifference(calculatedPercentage);
    }
   
  }, [currentMarketPrice, movingAvg100]);
 
  return (
    <div className="mt-2 ml-4 relative flex flex-col w-2/5 h-72 bg-gradient-to-b from-gray-700 to-gray-900 text-gray-100 shadow-lg rounded-md p-4 mb-2">
      
      {/* Hover Card for Information */}
      <HoverCard>
        <HoverCardTrigger>
          <FaInfoCircle className="absolute top-2 right-2 cursor-pointer text-lg text-gray-400" />
        </HoverCardTrigger>
        <HoverCardContent className="w-full p-2 bg-gray-800 text-white rounded shadow-md">
          <p className="mb-2"><strong>Market Distance And Moving Average Calculator</strong></p>
          <Separator />
          <p className="mb-2"><strong>Current Market Price:</strong> The latest price of the market.</p>
          <p className="mb-2"><strong>100-Period Moving Average:</strong> The 100-period average of the market price.</p>
          <Separator />
          <p className="mb-2">This calculator helps you determine the distance and percentage difference between the current price and the 100-period moving average.</p>
        </HoverCardContent>
      </HoverCard>

      {/* Card Header */}
      <CardHeader className="self-center text-center items-center rounded-3xl w-full">Market And Moving Average Distance Calculator</CardHeader>
      
      <CardContent>
        {/* Input Fields for Market Price and Moving Average */}
       
        <Input 
        type="number"
        step={0.0001}
        className="w-full p-2  border-gray-600 rounded-md text-gray-200 mb-2" 
        placeholder="Enter Current Market Price" 
        value={currentMarketPrice} 
        onChange={(e) => setCurrentMarketPrice((e.target.value))} />
        <Input
        type="number"
        step={0.0001}
        className="w-full p-2 border-gray-600  rounded-md text-gray-200 mb-4"
        placeholder="Enter 100-Period Moving Average"
        value={movingAvg100}
        onChange={(e) => setMovingAvg100((e.target.value))}
        />



      </CardContent>

      {/* Card Footer for Displaying Results */}
      {(currentMarketPrice > 500 || movingAvg100 > 500) ? (
          <p className="text-red-500">Value is too large</p>
        ) : (distance !== 0 && percentageDifference !== 0 && (
        <CardFooter className="flex items-center justify-between space-x-2">
            <div className="flex flex-col items-center text-sm">
            <span className="font-medium">Distance</span>
            <span className="font-semibold text-yellow-600">{distance.toFixed(4)}</span>
            </div>
            <Separator className="rotate-90 w-4" />
            <div className="flex flex-col items-center text-sm">
            <span className="font-medium">Percentage Difference</span>
            <span className="font-semibold text-red-600">{percentageDifference.toFixed(2)}%</span>
            </div>
        </CardFooter>
        ))}

    </div>
  );
};

export default MarketDistanceCalculator;
