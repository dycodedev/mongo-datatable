module.exports = {
  mongodb: {
    host: 'localhost',
    port: 27017,
    dbname: 'samples',
    username: '',
    password: '',
    get connectionUri() {
        return `mongodb://${this.username}:${this.password}@${this.host}:${this.port}`;
    }
  }
}
