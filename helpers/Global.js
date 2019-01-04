class Global {
    constructor(){
        this.globalroom=[];
    }
    EnterRoom(id,name,room,img)
    {
        var roomName={
            id:id,
            name:name,
            room:room,
            img:img
        }
        this.globalroom.push(roomName);
        return roomName;
    }

    Removeuser(id)
    {
        var user=this.Getuser(id);
        if(user)
        {
            this.users=this.globalroom.filter(function(user){
                return user.id!==id;
            });

        }
        return user;

    }

    Getuser(id)
    {
        var getuser=this.globalroom.filter(function(userid){
            return userid.id===id;
        })[0];
        return getuser;

    }

   

    Getroomlist(room){
        var roomName=this.globalroom.filter(function(user){
            return user.room===room;
        });
        var namesArray=roomName.map(function(user){
            return {
                name:user.name,
                img:user.img
            };
        });
        return namesArray;
    }
}
module.exports={Global};