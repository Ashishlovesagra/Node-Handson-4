const express = require("express");
const app = express();
const route = require("./Route/Rout")
const cors = require("cors")
app.use(express.json());

app.use(cors({
    origin:"*"
}))

app.use(route)
app.listen(8085,()=>{
    console.log('server is running')
})