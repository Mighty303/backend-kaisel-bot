import express from "express";
import router from "./routes/index";


const app = express();
const port = 8080 as number;

app.set('port', process.env.PORT || port); 
let server = app.listen(app.settings.port, () => console.log('Picha on ', app.settings.port));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/v1/', (req, res) =>{

});
