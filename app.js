const express=require("express");
const bodyParser=require("body-parser"); //we need body-parser to read the content we get as post request
const request=require("request");
const https=require("https");

const app=express();
app.use(express.static("public")); //since the index file has css & an image so we keep css & img in public dir
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");//we can send only 1 file hence we took css & img in a dir & use it
});
app.post("/",function(req,res){
    var firstname=req.body.fname;
    var lastname=req.body.lname;
    var emailid=req.body.email;
    console.log(firstname, lastname, emailid);
    var data={
        members:[
            {
                email_address: emailid,
                status:"subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ]
    };
    const JSONData=JSON.stringify(data); //this formats the data in a string in JSON format
    //this is the data we will be sending to mailchimp
    //const url='https://<dc>.api.mailchimp.com/3.0/';  -format of url of mailchimp api, replace dc with us11
    const url="https://us11.api.mailchimp.com/3.0/lists/2b28adcc4a";
    const options={
        method:"POST",
        auth:"ankush1:76489bcb477d602bcbea1abf6778df5c-us11"
    }
    const request1=https.request(url,options,function(response){
        if(response.statusCode==200){  //if signup is succesfull(i.e. 200) we send the succcess html file
            res.sendFile(__dirname+"/success.html"); 
        }
        else{
            res.sendFile(__dirname+"/failure.html"); //if signup is not succesfull we send failure html file
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })
    request1.write(JSONData);  
//we will be sending the json data along with our https request, hence we write this data along into our request
    request1.end(); //after writing the data into our request, we end the request

});
app.post("/failure",function(req,res) {
    res.redirect("/");
})

app.listen(8080,function(){ 
    console.log("Server is running on port 8080");
});

//Api key
//76489bcb477d602bcbea1abf6778df5c-us11

//List ID
//2b28adcc4a