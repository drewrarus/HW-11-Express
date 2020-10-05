
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3030;
const fs = require("fs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const db = (path.join(__dirname, "/db/db.json"));
let noteInfo = JSON.parse(fs.readFileSync(db, (err, data) => { return data }));

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/api/notes", function (req, res) {
    return res.json(noteInfo)
});

app.post('/api/notes', function (req, res) {
    const { body } = req;

    body.id = noteInfo.length + 1;

    noteInfo.push(req.body);
    res.json(true);

    console.log(noteInfo);
});

app.delete("/api/notes/:id", (req, res) => {
    const Id = noteInfo.find(note => note.id === parseInt(req.params.id));
    const index = noteInfo.indexOf(Id);
    if (!Id)
        return res.status(404).send("Note not found");

    noteInfo.splice(index, 1);
    fs.writeFileSync("./db/db.json", JSON.stringify(noteInfo), "utf-8");
    return res.json(true);
});


app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
