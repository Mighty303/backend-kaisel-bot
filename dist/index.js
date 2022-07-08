let express = require('express');
let app = express();
app.set('port', process.env.PORT || 8080);
let server = app.listen(app.settings.port, () => console.log('listening on ', app.settings.port));
const router = require("../routes/index.js");
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use('/api/v1/', (req, res) =>{
// });
//# sourceMappingURL=index.js.map