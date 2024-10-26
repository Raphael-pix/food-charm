const express = require('express');
const cors = require('cors')
const router = require('./router/routes')

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api',router)

app.get('/',(req,res)=>{
    res.send('hello')
})


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
