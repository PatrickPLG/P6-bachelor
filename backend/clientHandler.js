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
    getAllClients() {
        return this.clients;
    }

}

module.export = {ClientHandler};
