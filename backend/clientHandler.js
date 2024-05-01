 class ClientHandler {
  constructor() {
      this.clients = [];
  }

    addClient(socket,clientID) {
        this.clients.push({socket,clientID});
    }
    removeClient(socketID) {
        this.clients = this.clients.filter(client => client.socket.id !== socketID);
    }
    getClient(clientID) {
        return this.clients.find(client => client.clientID === clientID);
    }
    getSocketIdByClientId(clientID){
         const client = this.clients.find(client => client.clientID === clientID);
         return client ? client.socket.id : null;
  }

}

 module.exports = {
        ClientHandler
 };
