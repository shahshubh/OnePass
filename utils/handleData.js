const fs = require("fs");
var cryp = require("./cryptography");

// load data from data store
exports.loadJsonData = (callback) => {
    let jsonData = null;
    fs.readFile("./data/data.json", "utf8", function(err, data) {
        if(err) return callback(null);
        jsonData = JSON.parse(data);
        callback(jsonData);
    });
}

// update an item in the data store
exports.updateJsonData = (key, newKey, value, callback) => {

    this.loadJsonData(function(jsonData) {
        let i = 0;
        let isFound = false;
        let elements = jsonData.data;
        while(!isFound && i < elements.length) {
            var element = elements[i];
            if(cryp.decrypt(element.key) == key) {
                element.key = cryp.encrypt(newKey);
                element.value = cryp.encrypt(value);
                isFound = true;
            }
            i++;
        }
        if (!isFound) {
            callback("Item not found.");
            return;
        }

        fs.writeFile("./data/data.json", JSON.stringify(jsonData, null, 2), function (err) {
            if (err) 
                message = "Error occured";
            else
                message = "Updated successfully !!";
            callback(message);
        });
    });
}

// add new item to the data store
exports.addJsonData = (key, value, callback) => {
    this.loadJsonData(function(jsonData) {
        let i = 0;
        let isFound = false;
        let elements = jsonData.data;
        while(!isFound && i < elements.length) {
            let elmnt = elements[i];
            if(cryp.decrypt(elmnt.key) == key)
                isFound = true;
            i++;
        }
        if(isFound) {
            callback(null);
            return;
        }

        let element = { "key": cryp.encrypt(key), "value": cryp.encrypt(value) };
        elements.push(element);

        fs.writeFile("./data/data.json", JSON.stringify(jsonData, null, 2), function (err) {
            if (err) {
                callback(null);
                return;
            }
            callback(element);
        });
    });
}

// delete an item from the data store
exports.deleteJsonData = (key, callback) => {
    this.loadJsonData(function(jsonData) {
        let index = -1;
        let i = 0;
        let isFound = false;
        let elements = jsonData.data;
        while(!isFound && i < elements.length) {
            var element = elements[i];
            if(cryp.decrypt(element.key) == key) {
                index = i;
                isFound = true;
            }
            i++;
        }
        if (!isFound) {
            callback("Item not found.");
            return;
        }
        elements.splice(index, 1);

        fs.writeFile("./data/data.json", JSON.stringify(jsonData, null, 2), function (err) {
            if (err) 
                message = "Error occured";
            else
                message = "Deleted successfully !!";
            callback(message);
        });
    });
}
