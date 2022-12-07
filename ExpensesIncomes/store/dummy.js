const db = {
    'user': [
        { id:"1", name: 'NombreUsuario', admin: false },
        { id:"2", name: 'Segundo', admin: false }
    ]
};

async function list(tabla) {
    return db[tabla] || [];
}

async function get(tabla, id) {
    let col = await list(tabla);
    return col.filter(item => item.id === id)[0] || null;
}

async function upsert(tabla, data) {
    if (!db[tabla]) {
        db[tabla]=[];
    }
    db[tabla].push(data);
}

async function remove(tabla, id) {
    return true;
    "";
}

async function query(tabla, q){
    let col = await list(tabla);
    let keys = Object.keys(q);
    let key = keys[0];

    ret = col.filter(item => item[key] === q[key])[0] || null;
    
    return ret
}

module.exports = {
    list,
    get,
    upsert,
    remove,
    query
};