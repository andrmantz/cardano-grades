import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";

import walk from "./helpers/file.js";
import fillTables from "./helpers/seedDatabase.js";
import CardanoRepository from "./database/cardanoRepository.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

(async () => {
    const cardanoRepository = new CardanoRepository();
    await cardanoRepository.init();

    app.set("cardanoRepository", cardanoRepository);
    app.set("view engine", "pug");
    app.set("views", path.join(__dirname, "views"));

    app.use("/static", express.static(path.join(__dirname, "static")));
    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    const routes = await walk(path.join(__dirname, "routes"));
    for (const route of routes) {
        const handlerModule = await import(route.path);
        const handler = handlerModule.default;
        app.use(handler);
    }

    app.listen(port, "0.0.0.0", async () => {
        console.log(`Server started at http://127.0.0.1:${port}`);
        await fillTables(cardanoRepository);
    });
})();
