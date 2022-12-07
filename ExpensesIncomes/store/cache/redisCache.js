const asyncRedis = require("async-redis");
const config = require('../../config.js');
const client = asyncRedis.createClient(config.redis.url);

async function subscriber(){   
    return await client.duplicate();
}

async function publisher(key,value){
    return await client.publish(key,value);
}

async function list(table) {
     data = await client.HGETALL(table);
     return data;
}

async function GET(key) {
    res = await client.GET(key);
    return res;
}

async function upsert(table, data) {

    let key = table;

    if (data && data.id) {
        key = key + '_' + data.id;
    }

    client.SET(key,JSON.stringify(data));
    return true;
}

async function SET(table, data) {

    client.SET(table,data+'');
    return true;
}

async function EXIST(key) {
    a = await client.EXISTS(key);    
    return a>0; 

}

async function HEXISTS(table, data) {

    a = await client.HEXISTS(table,data);
    return a; 

}

async function HSET(table, key, value) {
        
    return await client.HSET(table,key,value);
}

async function HGET(table, key) {
    
    return await client.HGET(table, key);
}

async function FLUSHALL() {
    
    return await client.FLUSHALL();
}


async function HGETALL(table) {
    
    return await client.HGETALL(table);
}

async function HLEN(table) {
   
    return await client.HLEN(table);
}


async function HINCRBY(table,key,amount){
    return await client.HINCRBY(table,key,amount);
}

async function HDEL(table, key) {    
    return await client.HDEL(table,key);
}

async function ZADD(table, myscore, myvalue) {
    
    await client.ZADD(table, { score: myscore, value: myvalue+'' })
    return true;
}

async function ZRANGEBYSCORE(table, min, max) {

    a = await client.ZRANGEBYSCORE(table, min, max);
    return a;
}

async function ZREMRANGEBYSCORE(table, min, max) {

    a = await client.ZREMRANGEBYSCORE(table, min, max);
    return a;
}


module.exports = {
    list,
    GET,
    EXIST,
    HLEN,
    upsert,
    HGET,
    HSET,
    HEXISTS,
    ZRANGEBYSCORE,
    ZREMRANGEBYSCORE,
    ZADD,
    SET,
    HDEL,
    HINCRBY,
    HGETALL,
    subscriber,
    publisher,
    FLUSHALL
};