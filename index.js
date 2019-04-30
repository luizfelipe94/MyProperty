const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = express.Router();
const cors = require('cors');
const version = "V1";

async function main(){
    try{
        require('dotenv').config();
        const app = express();
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
        app.use(morgan('tiny'));
        app.use(cors());
        app.use(`/api/${version}`, routes);
        require('./lib/mongo');

        await require('./crawlers/novaepoca/index')();

        //routes
        require('./routes/main')(routes);
        require('./routes/novaepoca')(routes);

        const PORT = process.env.API_PORT || 3000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    }catch(e){
        console.log(`Error starting API: ${e}`);
    }
}

main();