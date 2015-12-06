/**
 * Created by stan renia on 06/12/15.
 */
var generate_uuid = require("../utils/utils.js");
var userMap = {}; // {id_1: {USER_1}, id_2: {USER_2}}

function createUser(user){
    var id = generate_uuid();
    if(user.prenom == undefined) user.prenom = "";
    if(user.nom == undefined) user.nom = "";

    var newUser = {id: id, login: user.login, pwd: user.pwd, role: user.role, prenom: user.prenom, nom: user.nom};
    userMap[id] = newUser;
    console.log("UserMap after creation: " + JSON.stringify(userMap));
    return newUser;
}

function getUserFromID(id){
    console.log("UsrMAp: " + JSON.stringify(userMap));
    if(userMap[id] === undefined)
        return null;
    return userMap[id];
}

exports.createUser = createUser;
exports.getUserFromID = getUserFromID;