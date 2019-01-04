const dependable=require('dependable');
const path=require('path');

const container=dependable.container();

const simpledependencies=[
    ['_' , 'lodash'],
    ['passport','passport'],
    ['formidable','formidable'],
    ['async','async'],
    ['Club','./models/clubs'],
    ['Message','./models/message'],
    ['Group','./models/groupmodel'],
    ['Users','./models/user'],
    ['aws','./helpers/awsupload']
];

simpledependencies.forEach(function(val){
    container.register(val[0],function(){
        return require(val[1])
    })
});

container.load(path.join(__dirname,'/controllers'));
container.load(path.join(__dirname,'/helpers'));

container.register('container',function(){
    return container;
});

module.exports=container;