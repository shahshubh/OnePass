const cryp = require('./utils/cryptography');
const { loadJsonData } = require('./utils/handleData');

function convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','
            line += array[i][index];
        }
        str += line + '\r\n';
    }
    return str;
}

function exportCSVFile(headers, items, fileTitle) {
    if (headers) {
        items.unshift(headers);
    }
    var jsonObject = JSON.stringify(items);
    var csv = convertToCSV(jsonObject);
    var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) {
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

function download(){    
    let headers = {
        key: 'Name',
        value: "Password"
    };
    loadJsonData(function(jsonData){
        var fileTitle = 'OnePass';
        jsonData.data.forEach(e => {
            e.key = cryp.decrypt(e.key)
            e.value = cryp.decrypt(e.value)
        });
        exportCSVFile(headers, jsonData.data, fileTitle);
    });
}

document.querySelector('.export-csv-item').addEventListener('click', download);
