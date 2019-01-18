'use strict';

const tempModel = require('../models/tempModel.model');
var CronJob = require('cron').CronJob;
var nodemailer = require('nodemailer');



exports.create = [(req, res) => {
    if (!req.body.temperature && !req.body.frequency) {
      res.status(400).send({ error: 'temperature && frequency required' });
    } else {
        tempModel.create(req.body).then((tempObj) => {
        if (!tempObj) {
          res.status(500).send({ error: 'tempObj not created' });
        } else {

            var response={
                status:200,
                message:"suceess",
                tempObj:tempObj
            }
          res.status(200).send(response);
        }
      })
        .catch((err) => {
          res.status(500);
          res.json({ error: err.message });
        });
    }
  }];






//0 9 * * * 

//* * * * *

// right now i continues checking temperature  and sending mail to particular id..
//if u want run script on 9 O'clock..  

const job = new CronJob('* * * * * ', function() {
    var date = new Date();
    tempModel.get(date).then((tempModelObjs)=>{
        if(tempModelObjs.length>0)
        {
            var threshold =40;
            tempModelObjs.forEach(function(tempObj) { 

                if(threshold<tempObj.temperature)
                {

                   var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: "donotreply.biizlo@gmail.com",
                      pass: "dT$71Bx%"
                     }
                    });
                    var mailOptions = {
                    from: "siddheshkadam111@gmail.com",
                    to: "siddheshkadam111@gmail.com",
                    subject: 'temperature overflow than threshold',
                    text:JSON.stringify(tempObj)
                    }
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                        console.log(error);
                        } else {
                        console.log('Email sent: ' + info.response);
                        }
                    });
                } 
                else
                {
                    console.log("every Thing is Ok till now"); 
                }
            });
        
            console.log("successfully run admin crons here");
        }
        else{
            console.log("no temprature object founds");
        }
      })
},null, true, 'Asia/Kolkata');
//,null, true, 'Asia/Kolkata'
job.start();


