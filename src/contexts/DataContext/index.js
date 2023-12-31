import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("./events.json");
    return json.json();
  },
};
export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const getData = useCallback(async () => {
    try {
      setData(await api.loadData());
    } catch (err) {
      setError(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);//added ^ for disable empty array from effect
  useEffect(() => {
    if (data) return;
    getData();
  });
  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        error,
      }}
    >

      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useData = () => {
  const {data, error} = useContext(DataContext)
  let last = useContext(DataContext)
  if (data) {
    const sortedEvents = data.events?.sort((eventA, eventB) =>
    new Date(eventB.date) - new Date(eventA.date)
    );
    if (sortedEvents?.length > 0) {
    last = sortedEvents[0];
  
    }
    }
    

  return {data, error, last}
}

export default DataContext;
