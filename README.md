# stocks-simple-api

Node.js API for get stocks data.
Limited to 5 requests per minute.
Working with the Alphavantage API free version.

# Very limited functionality for now, created this in 1 hour so far

Sample request:
```
const getStock = async ticker =>{
  console.log("Getting data");
  const request = await fetch('https://stocksapi.herokuapp.com/stock',{
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      'ticker': ticker,
      'type': 'daily'
    })
  })

  const data = await request.json()
  console.log(data);
  return data;
}

getStock('AAPL');
```

If you get CORS issues, just plug in https://cors-anywhere.herokuapp.com/ before the fetch url

const request = await fetch('https://cors-anywhere.herokuapp.com/https://stocksapi.herokuapp.com/stock' ...  //above code
