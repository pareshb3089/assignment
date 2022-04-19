import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Info from './components/Info';
import Paths from './components/Paths';

function App() {
  const [swaggerJson, setSwaggerJson] = useState({});
  const getJson = async () => {
    axios
      .get('https://petstore.swagger.io/v2/swagger.json')
      .then((res) => {
        setSwaggerJson(res.data)
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    getJson()
  }, [])

  return (
    <div>
      {swaggerJson.info &&
        <>
          <div>
            <Info swaggerJson={swaggerJson} />
          </div>
          <div>
            <Paths swaggerJson={swaggerJson} />
          </div>
        </>
      }
    </div>
  );
}

export default App;
