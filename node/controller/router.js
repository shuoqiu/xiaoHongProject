/**
 * Created by yangke on 18/1/23.
 */
var file = require("../models/file.js");
var formidable = require('formidable');
var path = require("path");
var fs = require("fs");
var sd = require("silly-datetime");


exports.showIndex=function(req,res,next){
    file.getAllAlbums(function(err,allAlbums){
        if(err){
            next();
            return;
        }
        res.render("index",{
            "albums":allAlbums
        });
    });
};

exports.showAlbum=function(req,res,next){
    var albumName=req.params.albumName;
    file.getAllImagesByAlbumName(albumName,function(err,imagesArray){
        if(err){
            next();
            return;
        }
        res.render("album",{
            "albumname":albumName,
            "images" : imagesArray
        });
    });

};


exports.showUp=function(req,res,next){
    file.getAllAlbums(function(err,allAlbums){
        if(err){
            next();
            return;
        }
        res.render("up",{
            "albums":allAlbums
        });
    });
};


exports.doPost = function(req,res){
    var form = new formidable.IncomingForm();
    form.uploadDir = path.normalize(__dirname + "/../tempup/");

    form.parse(req, function(err, fields, files,next) {
        console.log(fields);
        console.log(files);
        if(err){
            next();
            return;
        }
        var size = parseInt(files.tupian.size);
        if(size > 2000){
            res.send("图片尺寸应该小于1M");
            //删除图片
            fs.unlink(files.tupian.path);
            return;
        }


        var ttt = sd.format(new Date(), 'YYYYMMDDHHmmss');
        var ran = parseInt(Math.random() * 89999 + 10000);
        var extname = path.extname(files.tupian.name);

        var wenjianjia = fields.wenjianjia;
        var oldpath = files.tupian.path ;
        var newpath = path.normalize(__dirname + "/../uploads/" + wenjianjia + "/" + ttt + ran + extname);
        fs.rename(oldpath,newpath,function(err){
            if(err){
                res.send("改名失败");
                return;
            }
            res.send("成功");
        });
    });

 return;

};