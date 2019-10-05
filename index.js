let http = require('http');
let url = require('url');
let fs = require('fs');
let req = require('request');
http.createServer((require,response)=>{
    let path = url.parse(require.url).pathname;
    let params = url.parse(require.url, true).query;

    //判断请求资源
    let isStatic = isStaticRequest(path);
    let data = fs.readFileSync('./page' + path);
    if(isStatic){
        try{

            response.writeHead(200);
            response.write(data)
            response.end()
        }catch (e) {
            response.writeHead(404);
            response.write('<html><body><h1>404Not Found</h1></body></html>');
            response.end()
        }
    }else {
        console.log(params);
        let data = {
            "reqType":0,
            "perception": {
                "inputText": {
                    "text": params.text
                }
            },
            "userInfo": {
                "apiKey": "e0dc078b05ed4034bc26709c6ca04196",
                "userId": "123456"
            }
        }
        req({
            url:'http://openapi.tuling123.com/openapi/api/v2',
            method:"POST",
            henders: {
                "content-type":"application/json"
            },
            body:JSON.stringify(data)
        }, function(err,resp,body){
            let head = {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Method": "GET",
                "Access-Control-Allow-Headers":"x-requset-with, content-type"

            }
            if(!err && resp.statusCode==200){

                let obj = JSON.parse(body);
                if(obj && obj.result && obj.result.length > 0 && obj.result[0].values){//严谨性判断
                    response.writeHead(200, head);
                    response.write(JSON.stringify(obj.result[0].values));
                    response.end();
                } else {
                    response.writeHead(200,head);
                    response.write({'text':'布吉岛你在说什么~！' });
                    response.end()
                }
            }else {
                response.writeHead(400,head);
                response.write('数据异常');
                response.end();
            }

        })
    }





}).listen(12306)

function isStaticRequest(path){
    let staticFile = ['.html','js','css','jpg','jpeg','png'];
    for(let i = 0; i < staticFile.length; i ++){
        if(path.indexOf(staticFile[i]) == path.length - staticFile[i].length){
            return true
        }
    }
    return false

}