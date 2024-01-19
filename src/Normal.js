import React, { useState } from 'react';
import axios from 'axios';

function Normal() {
    const [regNo, setRegNo] = useState('');
    const [fetchedData, setFetchedData] = useState(null);

    const fetchData = async () => {
        try {
            const data = {
                RRNo: regNo,
                SubDivisionID: "",
                DuplicateCheckRequired: "N",
                CityCode: "BN",
                ServiceCityId: "97",
                CityId: 2
            };

            const response = await axios.post('http://localhost:5000/fetchData', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            setFetchedData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchData();
    };

    return (
        <div className="App">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Registration Number"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)} // Update registration number state
                />
                <button type="submit">Fetch Data</button>
            </form>
            {fetchedData && (
                <div>
                    <pre>{JSON.stringify(fetchedData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default Normal;