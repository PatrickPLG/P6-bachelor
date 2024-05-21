import axios from "axios";


interface ISensor {
  SensorData: string;
  SensorType: string;
  Timestamp: string;
}

interface ISensorData {
  key: string;
  value: string;

}

export interface ISensorTableData {
  sensorData: ISensorData[];
  sensorType: string;
  timestamp: string;
}

export const UseSensors = () => {

  const getSensorTableData = async ():Promise<ISensorTableData[]> => {
    const sensors = await getAllSensorData()
    const tableData = sensors.map(async (sensor) => {
      const parsedData =  JSON.parse(sensor.SensorData)

      //convert to array
      const sensorData = Object.keys(parsedData).map((key) => {
        return {
          key: key,
          value: parsedData[key]
        }
      })


      return {
        sensorData:sensorData,
        sensorType: sensor.SensorType,
        timestamp: parseTimestamp(sensor.Timestamp)


      }
    })

    return Promise.all(tableData)

  }

  const parseTimestamp = (epoch:string)  => {
    let date = new Date(parseInt(epoch));
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    let seconds = "0" + date.getSeconds();

    console.log(date)

    // Will display time in HH:MM:SS format
    return hours + ':' + minutes.slice(-2) + ':' + seconds.slice(-2);
  }



  const getAllSensorData = async ():Promise<ISensor[]> => {
    const response = await axios.get('http://localhost:3001/get-all-sensor-data')
    return response.data
  }

  return {
    getAllSensorData,
    getSensorTableData
  }
}
