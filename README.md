# Table app with Vue2, Node.js and MySQL

## Database setup
```
Configure MySql like this:
USER: "root",
PASSWORD: "root123",
DB: "tabledb"
```
Then add Entry table with this query:
```
CREATE TABLE IF NOT EXISTS `entry` (
  id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  amount int,
  distance int,
  date DATE
)
``` 
## Project setup
**Start Frontend**
```
npm install
npm run serve
```
**Start Backend**
```
cd server
npm install
node server.js
```
