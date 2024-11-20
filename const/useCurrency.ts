import { useEffect, useState } from "react";

function useCurrencyInfo(baseCurrency, quoteCurrency) {
  const [exchangeRate, setExchangeRate] = useState(null);

  useEffect(() => {
    if (!baseCurrency || !quoteCurrency) return;

    fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.rates && data.rates[quoteCurrency]) {
          setExchangeRate(data.rates[quoteCurrency]);
        } else {
          setExchangeRate(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching currency data:", error);
        setExchangeRate(null);
      });
  }, [baseCurrency, quoteCurrency]);

  return exchangeRate;
}

export default useCurrencyInfo;
