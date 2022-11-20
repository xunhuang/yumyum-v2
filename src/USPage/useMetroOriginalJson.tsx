import { useEffect, useState } from 'react';

export const useMetroOriginalJson = (metro: string) => {
  const [data, setData] = useState([]);
  const filepath = `/data/${metro}.json`;
  useEffect(() => {
    fetch(filepath, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        setData(myJson);
      });
  }, [filepath]);
  return data;
};
