const ROUTE_KEY = "cityOfCode_route";

let routes = {};

const app = document.getElementById("app");


export const router = {

    setRoutes(newRoutes) {
        routes = newRoutes;
    },


    show(name) {

        if (!routes[name]) {
            console.error(`Route "${name}" not found.`);
            return;
        }

        localStorage.setItem(ROUTE_KEY, name);

        app.innerHTML = "";

        routes[name](app);
    },


    getSavedRoute() {
        return localStorage.getItem(ROUTE_KEY);
    }

};