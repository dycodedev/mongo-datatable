module.exports = {
  mongodb: {
    host: '192.168.1.157',
    port: 27018,
    dbname: 'cloud',
    username: '',
    password: '',
    get connectionUri() {
      return 'mongodb://' + this.host + ':' + this.port + '/' + this.dbname;
    }
  }
}
