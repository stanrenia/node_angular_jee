/**
 * Created by stan_ on 04/11/2015.
 */


module.exports = function (dpath, ext, callback) {
    if(!callback)
        return;
    var fs = require('fs');
    var path = require('path');
    var myerr = null;
    var files_selected = [];

    if(!dpath)
        myerr = "Error_dpath_undefined";
    else if(!ext)
        myerr = "Error_ext_undefined";
    if(myerr === null){
        ext = "."+ext;
        fs.readdir(dpath, function(err, files){
            if(err){
                myerr = "Error_Reading " + dpath;
            }
            else{
                for(var i in files){
                    var fname = files[i];
                    if(path.extname(fname) === ext){
                        files_selected.push(fname);
                    }
                }
            }
            callback(myerr, files_selected);
        });
    }
    else callback(myerr, files_selected);
};

