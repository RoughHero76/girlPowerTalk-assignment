import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from './components/table';
import Cards from './components/cards';
import Chart from './components/chart';
import { ClipLoader } from 'react-spinners';

const App: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://api.coinlore.net/api/tickers/');
        setCryptoData(response.data.data);
        const sortedData = response.data.data.sort((a, b) => parseFloat(b.price_usd) - parseFloat(a.price_usd));
        setChartData(sortedData.slice(0, 10));
      } catch (error) {
        setError('Error fetching data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={50} color="#4B5563" loading={loading} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 justify-between">
      <h1 className="text-2xl font-bold mb-4">Cryptocurrency Data</h1>
      <Table data={cryptoData} />
      <Cards data={cryptoData} />
      <Chart data={chartData} />
    </div>
  );
};

export default App;
