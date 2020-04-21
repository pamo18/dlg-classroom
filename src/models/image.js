// Image helper
const image = {
    get: function(url) {
        let defaultClassroom = require(`../assets/classroom/default.jpg`);

        try {


            if (url) {
                return require(`../assets/classroom/${url}`);
            } else {
                return defaultClassroom;
            }
        } catch {
            return defaultClassroom;
        }
    }
};

export default image;
