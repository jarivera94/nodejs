module.exports=(sequelize, Sequelize)=>{
    const Documento = sequelize.define('al_documento',{
        uid:{
            type: Sequelize.STRING,
            primaryKey:true
        },
        autor:{
            type: Sequelize.STRING
        },
        titulo_documento:{
            type: Sequelize.STRING
        },
        version_documento:{
            type: Sequelize.STRING
        },
        palabras_clave:{
            type: Sequelize.STRING
        },
        metadatos:{
            type: Sequelize.STRING
        },
        descripcion:{
            type: Sequelize.STRING
        },
        tipo_buzon:{
            type: Sequelize.STRING
        },
        codigo_tramite:{
            type: Sequelize.STRING
        },
        usuario:{
            type: Sequelize.STRING
        }
    },{
        freezeTableName: true
    },{
    timestamps: false
    }
)
    return Documento;
}
