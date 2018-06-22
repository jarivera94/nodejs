const config ={
    database: 'alejandria',
    username: 'alejandria',
    password: '123456',
    host: '52.205.188.223',
    dialect: 'postgres',
    port: 5432,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        timestamps: false
    }
};
module.exports=config;