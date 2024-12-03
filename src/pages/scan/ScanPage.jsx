const ScanPage = () => {
    const location = useLocation();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    // Extract restaurantId and tableId from query parameters
    const queryParams = new URLSearchParams(location.search);
    const restaurantId = queryParams.get('restaurantId');
    const tableId = queryParams.get('tableId');
  
    useEffect(() => {
      if (restaurantId && tableId) {
        fetchData(restaurantId, tableId);
      } else {
        setError("Missing restaurantId or tableId");
        setLoading(false);
      }
    }, [restaurantId, tableId]);
  
    const fetchData = async (restaurantId, tableId) => {
      try {
        const response = await fetch(
          `https://backend-obet.onrender.com/api/scan?restaurantId=${restaurantId}&tableId=${tableId}`
        );
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
        setLoading(false);
      }
    };
  
    if (loading) {
      return <p>Loading...</p>;
    }
  
    if (error) {
      return <p>{error}</p>;
    }
  
    return (
      <div>
        <h2>Restaurant: {restaurantId}</h2>
        <h3>Table: {tableId}</h3>
        <div>
          <h4>Menu</h4>
          <ul>
            {data?.food?.map(item => (
              <li key={item.id}>{item.name} - {item.price}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Table Info</h4>
          <p>Status: {data?.table?.status}</p>
        </div>
        <div>
          <h4>Active Offers</h4>
          <ul>
            {data?.offers?.map(offer => (
              <li key={offer.id}>{offer.description}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };
  export default ScanPage;