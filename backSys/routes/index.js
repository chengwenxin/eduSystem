var express = require('express');
var router = express.Router();
var mysql  = require('mysql');
var db = require('../public/db');
var returnData = require('../public/returnData');
var suData=returnData.suData;
var faData=returnData.faData;

var connection = mysql.createConnection(db.mysql);



/* GET home page. */
router.get('/', function(req, res, next) {
  var sql = "select * from manager"
  var result;
  connection.query(sql,function (err, rows) {
    if(err){
      console.log(err);
      return;
    }
    result=JSON.stringify(rows);//转换成JSON String格式
    console.log(result);
    res.end(result);

  })
  console.log(result);
});
router.post('/',function (req,res,next) {
  let body=req.body;
  let sql="select * from student where snum=? and spwd=?";
  connection.query(sql,[body.num,body.password],function (err,rows) {
    console.log('postlogin',err,rows);
    if(err){
      faData.message=err;
      res.send(faData)
      return
    }else if(rows.length==0){
      faData.message="帐号或密码错误";
      res.send(faData)
      return
    }else{
      suData.data=rows;
      res.send(suData)
      return
    }
  })
});
module.exports = router;
