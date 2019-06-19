const request = require('request');

//test
const getAccessToken = function () {

    return new Promise(function (resolve, reject) {

        const url = 'https://login.microsoftonline.com/common/oauth2/token';

        const username = 'dennislee@m365bs.onmicrosoft.com'; // Username of PowerBI "pro" account - stored in config
        const password = ''; // Password of PowerBI "pro" account - stored in config
        const clientId = ''; // Applicaton ID of app registered via Azure Active Directory - stored in config
        // const clientSecret ='1fIYbOeZR3ggOJiEAWWHrRtYcMn8oBUAdXZVXpPIQ4Y=' ;
        const clientSecret ='' ;
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };

        const formData = {
            grant_type: 'password',
            client_id: clientId,
            resource: 'https://analysis.windows.net/powerbi/api',
            scope: 'openid',
            client_secret: clientSecret,
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
            //console.log(bodyObj.access_token)
            resolve(bodyObj.access_token);
            
        });
    });
};

const getReportEmbedToken = function (accessToken, groupId, reportId) {
    console.log("asaddennis:"+accessToken)
    return new Promise(function (resolve, reject) {

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
            console.log(body)
            const bodyObj = JSON.parse(body);
            resolve(bodyObj.token);
        });
    });
};


module.exports = {
    embedReport: function (req, res) {
        getAccessToken().then(function (accessToken) {
            getReportEmbedToken(accessToken, req.params.groupId, req.params.reportId).then(function (embedToken) {
                res.render('index', {
                    reportId: req.params.dashboardId,
                    embedToken,
                    embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=' + req.params.reportId + '&groupId=' + req.params.groupId
                });
            }).catch(function (err) {
                res.send(500, err);
            });
        }).catch(function (err) {
            res.send(500, err);
        });
    },

    embedReportApi: function (req, res) {
        getAccessToken().then(function (accessToken) {
            getReportEmbedToken(accessToken, req.params.groupId, req.params.reportId).then(function (embedToken) {
                res.send(JSON.stringify({
                    reportId: req.params.dashboardId,
                    embedToken,
                    embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=' + req.params.reportId + '&groupId=' + req.params.groupId
                }));
            }).catch(function (err) {
                res.send(500, err);
            });
        }).catch(function (err) {
            res.send(500, err);
        });
    }

};
