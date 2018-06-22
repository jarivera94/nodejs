const ldapOptions = {
  ldapConfiguration:{
    url: 'ldap://18.208.228.54:389/cn=admin,dc=alejandria,dc=com',
    timeout: "3000",
    connectTimeout: "3000",
    reconnect: true,
    port:"389"
  },
  dn :"cn=admin,dc=alejandria,dc=com",
  password:"taconvii"
};

module.exports= ldapOptions;