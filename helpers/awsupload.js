const AWS=require('aws-sdk');
const multer=require('multer');
const multerS3=require('multer-s3');
var express = require('express');



AWS.config.update({
    accessKeyId:'process.env.AWS_ACESSKEY',
    secretAccessKey:'process.env.SECRET_ACCESSKEY',
    region:'process.env.AWS_REGION'
});

var app = express();
    s3 = new AWS.S3();

    var upload = multer({
        storage: multerS3({
            s3: s3,
            bucket: 'minefootballkik',
            acl:'public-read',
            key: function (req, file, cb) {
                console.log(file);
                cb(null, file.originalname); //use Date.now() for unique file keys
            }
        })
    });

exports.Upload=upload;