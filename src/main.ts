import * as express from 'express';
import {getCitiesInfo} from "./city.service";

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    const cities = req.query['cities'];

    getCitiesInfo(cities).subscribe(
        data => res.json(data),
        err => res.status(500).json({message: 'Something went wrong', error: err}))

});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
