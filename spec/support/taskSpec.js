const axios = require('axios').default;
axios.defaults.headers.common['Authorization'] = `Bearer 6QRh-hTfR-oAAAAAAAAAAUyzReJH34rz23DlOdf8Nwy5-SzCdaD7pwip0-yJAfUF`;

let reporters = require('jasmine-reporters');
let TeamCityReporter = new reporters.TeamCityReporter({
    savePath: "..",
    consolidateAll: false
});

jasmine.getEnv().addReporter(TeamCityReporter);

const {Builder, By, until, WebElement} = require('selenium-webdriver');

describe("DropBox Testing", () => {
    let id;

    it('should upload file to DropBox', async () => {
        let upload_resp;
        
        await axios({
            method: 'post',
            url: 'https://content.dropboxapi.com/2/files/upload',
            headers: {
                "Content-Type": "application/octet-stream",
                "Dropbox-API-Arg": '{"path":"/pic.png","mode":"add","autorename":true,"mute":false,"strict_conflict":false}' },
            data: {
                "binary": "/Users/yakalmar/Documents/pic.png"
            }
        })
            .then((response) => (upload_resp = response))
            .catch(err => console.log(err));
        
        id = upload_resp.data['id'];
        expect(upload_resp.status).toBe(200);
    });

    it('should get metadata of previous file', async () => {
        let metadata_resp;

        await axios({
            method: 'post',
            url: 'https://api.dropboxapi.com/2/files/get_metadata',
            header: {
                "Content-Type": "application/octet-stream"
            },
            data: {
                "path": "/pic.png"
            }
        })
            .then((response) => (metadata_resp = response))
            .catch(err => console.log(err));

        let bool = ((metadata_resp.status == 200) && (metadata_resp.data['id'] == id));
        //console.log('Bool:', bool. )
        expect(bool).toBe(true);
    });


    it('should delete file from DropBox', async () => {
        let delete_resp;

        await axios({
            method: 'post',
            url: 'https://api.dropboxapi.com/2/files/delete_v2',
            header: {
                "Content-Type": "application/json",
            },
            data: {
                "path": "/pic.png"
            }
        })
            .then((response) => (delete_resp = response))
            .catch(err => console.log(err));
        
        let bool = ((delete_resp.status == 200) && (delete_resp.data['metadata']['id'] == id));
        expect(bool).toBe(true)
    });

});