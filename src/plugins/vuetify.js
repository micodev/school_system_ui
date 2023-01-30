import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
    rtl: true,

    // icons: {
    //     iconfont: 'fa' || 'md',
    // },
    theme: {
        themes: {
            light: {
                background: "#FCFEFF",
                primary: "#134c67",
                secondary: "#384c81",
                accent: "#82B1FF",
                error: "#FF5252",
                info: "#2196F3",
                success: "#4CAF50",
                warning: "#FFC107",
                lightblue: "#14c6FF",
                yellow: "#FFCF00",
                pink: "#FF1976",
                orange: "#FF8657",
                magenta: "#C33AFC",
                darkblue: "#1E2D56",
                gray: "#909090",
                neutralgray: "#9BA6C1",
                green: "#2ED47A",
                red: "#FF5c4E",
                darkblueshade: "#308DC2",
                lightgray: "#BDBDBD",
                lightpink: "#FFCFE3",
                white: "#FFFFFF",
                dark: "#000",
                darkgray: "#4B5D67",
                new: "#0038EE"
            },
        },
    },
});