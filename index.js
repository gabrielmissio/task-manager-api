const { PORT } = require('./src/main/confing/env');

const app = require('./src/main/confing/app');

app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
