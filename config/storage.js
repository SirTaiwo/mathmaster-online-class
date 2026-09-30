const fs = require("fs");
const path = require("path");

const storageRoot =
    process.env.STORAGE_PATH ||
    path.join(__dirname, "..");

const databasePath =
    path.join(
        storageRoot,
        "database",
        "mathclass.db"
    );

const recordingsDirectory =
    path.join(
        storageRoot,
        "private",
        "media",
        "recordings"
    );

const materialsDirectory =
    path.join(
        storageRoot,
        "private",
        "media",
        "materials"
    );

fs.mkdirSync(
    path.dirname(databasePath),
    { recursive: true }
);

fs.mkdirSync(
    recordingsDirectory,
    { recursive: true }
);

fs.mkdirSync(
    materialsDirectory,
    { recursive: true }
);

module.exports = {
    storageRoot,
    databasePath,
    recordingsDirectory,
    materialsDirectory
};
