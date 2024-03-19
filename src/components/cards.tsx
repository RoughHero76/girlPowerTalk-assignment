import React from 'react';

const CryptoCard = ({ data }) => {
    return (
        <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Cards Arranged by Ranks</h1>
            <h3>--- Scrolls ---</h3>
            <div className="overflow-y-scroll no-scrollbar mt-8 ">


                <div className="flex space-x-4 w-max">
                    {data.map((item) => (
                        <div key={item.id} className="w-full md:w-[calc(25%-16px)] mb-4 ml-4 mr-4 mt-4 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-white-950 relative max-w-md overflow-hidden rounded-xl border border-white-900 bg-[length:250%_250%,100%_100%] bg-[position:-100%_0,0_0] bg-no-repeat px-8 py-16 shadow-2xl transition-[background-position_0s_ease] hover:bg-[position:200%_0,0_0] hover:duration-[3500ms]">
                            <h2 className="text-xl font-semibold">{item.name} ({item.symbol})</h2>
                            <p>Rank: {item.rank}</p>
                            <p>Price (USD): {item.price_usd}</p>
                            <p>Percent Change (24h): {item.percent_change_24h}%</p>
                            <p>Price (BTC): {item.price_btc}</p>
                            <p>Market Cap (USD): {item.market_cap_usd}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CryptoCard;
