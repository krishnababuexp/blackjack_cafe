import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useAuth } from "./UseAuth";

const useGET = (url, headers = {}, useToken = false) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchData = async () => {
    setIsLoading(true);
    setIsError(false);

    if (!useToken && user && user.token && user.token.access) {
      useToken = true;

      headers = {
        ...headers,
        Authorization: `Bearer ${user.token.access}`,
      };
    }

    try {
      const response = await axios.get(url, {
        headers: headers,
      });
      setData(response.data);
    } catch (error) {
      setIsError(true);
      setError(error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  //-----------------without refresh call fetchdata while performing add course-------------------------------------------//
  const refetch = () => {
    fetchData();
  };

  return { data, isLoading, isError, setData, error, refetch };
};

export { useGET };
