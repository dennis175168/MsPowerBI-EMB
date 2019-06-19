var express = require('express');
var app = express();
var aa = require('./APIdemo');
const request = require('request');

app.get('/', function (req, res) {
//   res.send('Hello World!');
get(res.send)
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


function get(){
    const url = 'https://login.microsoftonline.com/common/oauth2/token';

    const username = 'dennislee@m365bs.onmicrosoft.com'; // Username of PowerBI "pro" account - stored in config
    const password = 'Tennis175166'; // Password of PowerBI "pro" account - stored in config
    const clientId = 'c357b7e1-7b17-43fc-8bfc-d10d4632ae3f'; // Applicaton ID of app registered via Azure Active Directory - stored in config

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    const formData = {
        grant_type: 'password',
        client_id: clientId,
        resource: 'https://analysis.windows.net/powerbi/api',
        scope: 'openid',
        client_secret: 'hwoluO+zRcdFoc0K6PDQ5BcO6IZ9QTSDwCoHLQ3S5E0=',
        username: username,
        password: password
    };

    request.post({
        url: url,
        form: formData,
        headers: headers
    }, function (err, result, body) {
        if (err) return reject(err);
        const bodyObj = JSON.parse(body);
        emb(bodyObj.access_token,'cc4be917-9ed4-4ec8-8eae-d6a1eaa164c1','27c29037-5a60-4893-be3e-ccbc2b540f21')
        //console.log(bodyObj)
    });   
}

function emb(accessToken, groupId, reportId){
    const url = 'https://api.powerbi.com/v1.0/myorg/groups/' + groupId + '/reports/' + reportId + '/GenerateToken';

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + accessToken
        };

        const formData = {
            'accessLevel': 'view'
        };

        request.post({
            url: url,
            form: formData,
            headers: headers

        }, function (err, result, body) {
            if (err) return reject(err); console.log(err);
            //console.log(body)
            const bodyObj = JSON.parse(body);
            //console.log(bodyObj)
           // resolve(bodyObj.token);
           
        });
}

