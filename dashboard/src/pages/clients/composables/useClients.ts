import axios from "axios";
import {useToast} from "vuestic-ui";


interface IClient {
  ID: number;
  CLIENT_ID: string;
  isActive: boolean;
}

export interface IClientTableData extends IClient {
  events: string[]
}

interface IEvent {
  EventName: string;
}


export const UseClients = () => {


  const getClientTableData = async () => {
    const clients = await getClients()
    if (!clients) return []
    const tableData = clients.map(async (client) => {
      const subscribedEvents = (await getSubscribedEvents(client.CLIENT_ID)).map((event) => {
        return event.EventName
      })

      return {
        ...client,
        events: subscribedEvents,
      }
    })

    return Promise.all(tableData)
  }


  const getClients = async (): Promise<IClient[]> => {
    const response = await axios.get('http://localhost:3001/get-all-users')
    return response.data
  }


  const getAllEvents = async (): Promise<string[]> => {
    const response = await axios.get('http://localhost:3001/get-all-available-eventTypes')
    return response.data
  }

  const getSubscribedEvents = async (clientId: string): Promise<IEvent[]> => {
    const response = await axios.get('http://localhost:3001/get-client-subscribed-events', {
      params: {
        clientId
      }
    })
    return response.data
  }


  const updateSubscribedEvents = async (clientId: string, events: String[]) => {
    await axios.post(`http://localhost:3001/update-client-subscribed-events`, {
      clientId,
      events
    })
  }


  const deleteClient = async (clientId: string) => {
    return await axios.get('http://localhost:3001/delete-specific-user', {
      params: {
        appId: clientId
      }
    })
  }


  const generateCredentials = async () => {
    const response = await axios.get('http://localhost:3001/credentials')
    return response.data
  }

  const registerClient = async () => {
    const id = await generateCredentials()
    if (id)
      await axios.post('http://localhost:3001/register-client', {CLIENT_ID: id})
  }

  return {
    getClientTableData,
    getClients,
    getAllEvents,
    getSubscribedEvents,
    updateSubscribedEvents,
    deleteClient,
    generateCredentials,
    registerClient,
  }


}



