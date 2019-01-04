class Users {
    constructor(){
        this.users=[];
    }
    Adduserdata(id,name,room)
    {
        var users={
            id:id,
            name:name,
            room:room
        }
        this.users.push(users);
        return users;
    }
    Removeuser(id)
    {
        var user=this.Getuser(id);
        if(user)
        {
            this.users=this.users.filter(function(user){
                return user.id!==id;
            });

        }
        return user;

    }

    Getuser(id)
    {
        var getuser=this.users.filter(function(userid){
            return userid.id===id;
        })[0];
        return getuser;

    }

    Getuserslist(room){
        var users=this.users.filter(function(user){
            return user.room===room;
        });
        var namesArray=users.map(function(user){
            return user.name;
        });
        return namesArray;
    }
}
module.exports={Users};