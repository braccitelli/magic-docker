var fs = require('fs');
var express = require('express');
var util = require('util');
var simpleGit = require('simple-git');
var fork = require('child_process').spawn;
var app = express();

var repoPath  = 'https://Mandrakebgv:mandrakebgv@bitbucket.org/magicbgv/magic-backend.git';
var localPath = './magicbgv'; 
var started = false;

var log_file = fs.createWriteStream('debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

app.get('/', function(req, res){
    res.send('Magic The Gathering');
});

app.get('/log', function(req, res){
    res.sendfile('debug.log');
});

app.get('/updateMagicbgv', function (req, res) {
    if(startServer()){
        res.send("atualizado");
    } else {
        res.send("cloned");
    }
});

app.post('/updateMagicbgv', function (req, res) {
    if(startServer()){
        res.send("atualizado");
    } else {
        res.send("cloned");
    }
});

app.listen(3000, function () {
  console.log('App listening on port 3000!');
  if(startServer()){
        console.log("rep updated");
    } else {
        console.log("rep cloned");
    }
});

function startServer(){
    var foiAtualizado;
      if (!fs.existsSync(localPath)){
        // fs.mkdirSync(dir);
        simpleGit().clone(repoPath, localPath);
        foiAtualizado = false;
    } else {
        simpleGit(localPath).pull(repoPath, 'master');
        // res.send('Rep updated');
        foiAtualizado = true;
    }    
  if(!started){
        var param = localPath+'/index.js';
        // child = execFile('./node_modules/nodemon/bin/nodemon.js', [localPath+'/index.js'], (error, stdout, stderr) => {
        var cmd = fork('./node_modules/nodemon/bin/nodemon.js', [param], {detached:true, stdio: 'inherit'})
            .on('exit',function(code){
                //check exit code
            });
        started = true;
    }
    return foiAtualizado;
}