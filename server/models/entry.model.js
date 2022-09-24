const sql = require("./db.js");

// constructor
const Entry = function(entry) {
  this.name = entry.name;
  this.amount = entry.amount;
  this.distance = entry.distance;
  this.date=entry.date;
};

Entry.create = (newEntry, result) => {
  sql.query("INSERT INTO entry SET ?", newEntry, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created entry: ", { id: res.insertId, ...newEntry });
    result(null, { id: res.insertId, ...newEntry });
  });
};


Entry.getAll = (result) => {
  let query = "SELECT * FROM entry";

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    
    result(null, res.map((item)=>{
        item.date=new Date(item.date).toLocaleDateString();
        return item;
    }));
  });
};


Entry.remove = (id, result) => {
  sql.query("DELETE FROM entry WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Entry with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted entry with id: ", id);
    result(null, res);
  });
};


module.exports = Entry;