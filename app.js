const express = require('express');
const axios = require('axios');
const { DateTime } = require('luxon');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/last-modified', async (req, res) => {
  const { url } = req.body;

  try {
    const response = await axios.head(url);
    const dateValue = getDateFromHeaders(response.headers);

    if (dateValue) {
      res.json({ url, lastModified: dateValue.toISO() });
    } else {
      res.json({ url, lastModified: 'Could not retrieve date information' });
    }
  } catch (error) {
    res.status(500).json({ url, lastModified: `Error fetching data: ${error.message}` });
  }
});

function getDateFromHeaders(headers) {
  const dateHeaders = ['last-modified', 'date'];

  for (const header of dateHeaders) {
    if (headers[header]) {
      const dateStr = headers[header];
      try {
        const dateValue = DateTime.fromHTTP(dateStr);
        return dateValue;
      } catch (error) {
        console.log(`Error parsing date from header ${header}: ${dateStr}`);
      }
    }
  }
  return null;
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
