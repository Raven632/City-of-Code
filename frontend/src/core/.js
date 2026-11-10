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

        app.innerHTML = "";

        routes[name](app);
    }

};