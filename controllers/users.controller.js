const { selectUsers } = require("../models/users.model")
exports.getAllUsers = (request, response, next) => {
    selectUsers()
    .then((users) =>{
        response.status(200).send({ users });
    })
    .catch((err) => {
        console.log("Error to get users: ", err)
        next(err);
    });
}