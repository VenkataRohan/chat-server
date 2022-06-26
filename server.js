const express = require('express');
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server,{
  cors: {
    origin: "http://localhost:19006",
    methods: ["GET", "POST"]
  }})

var bodyParser = require('body-parser');
var multer = require('multer');
var forms = multer();

// apply them

app.use(bodyParser.json());
app.use(forms.array()); 
app.use(bodyParser.urlencoded({ extended: true }));
// Loads env variables
require('dotenv').config()

// // Initalizes express server




// // specifies what port to run the server on
const PORT = process.env.PORT || 3001;

  


const usersOnline=new Map()
 let i=0,n
io.on("connection", (socket) => {
  

    console.log("a user connected : "+socket.id);
    socket.on("chat", (ms,to,from,img,loc,doc) => {
       console.log(to+" "+from+" "+img);
       console.log("asdasdasdasdsasa");
       console.log(loc);
   
    console.log(usersOnline.get(to));
        console.log(usersOnline.get(from));
        console.log(usersOnline);
         io.to(usersOnline.get(to)).to(usersOnline.get(from)).emit("aa",ms,from,img,loc,doc);
    });


    socket.on("chatpost", (ms,to,from,img) => {
      console.log(to+" "+from+" "+img+" "+socket.id);
 console.log("bbbb");
  
        io.emit("aapost",ms,from,img);
   });

   socket.on("chatgroup", (ms,members,from,img) => {
    console.log(" "+from+" "+img+" "+socket.id);
    console.log("aaaaa");
    const t=[]
    console.log(members);
    
for(let i=0;i<members.length;i++)
{
  t[i]=usersOnline.get(members[i])
}

     console.log(usersOnline);
    console.log(t);
      io.to(t).emit("aagroup",ms,from,img);
 });

    socket.on('addUser',(name,socketId)=>{
     // console.log(usersOnline);
      n=name
      usersOnline.set(name,socketId)
     console.log(usersOnline);
    })
    socket.on('addGrp',(members,id,name)=>{
      const t=[]
      for(let i=0;i<members.length;i++)
      {
        t[i]=usersOnline.get(members[i])
      }
      socket.to(t).emit('addG',id,name)
    })



    socket.on('join-room', (roomId, userId) => {
      socket.join(roomId)
      socket.to(roomId).broadcast.emit('call-user-connected', userId)
    })
    socket.on('disconnect', function(response) {
      console.log('Got disconnect!  '+n+" "+response);
      if(response!='ping timeout')
      usersOnline.delete(n)
      console.log(usersOnline);

     
   });


  });




//app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
server.listen(PORT, () => console.log("server running on port:" + PORT));

