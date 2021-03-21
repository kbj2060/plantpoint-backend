# plantpoint_backend
Backend for SmartFarm System 



### Demo

This is [Video](https://www.youtube.com/watch?v=Ues5e7m1w10&lc=UgyAODgET9TnCkozM9J4AaABAg). For short explanation, Infinite Icon on switch controller component is for **setting automations**. Plus, The environments history which is on the bottom of the page could show you the data for **today**. CCTV component is a photo in this demo. Please, revise src in this image tag from the CCTV/index.js file.



### Installation

To install related packages, write a command line below on the project home directory.

```bash
npm install
```



### Prerequisite

Default server port is 9000 and websocket port is 4000. If your system block those port, should open. And To set JWT authentication, you should make a secret.ts file.

```typescript
/* plantpoint-backend/src/authentication/secret.ts */

export const jwtConstants = {
  secret: 'SECRET_STRING',
};
```



### Database Schema

With NestJS entity, this mysql database schema could be created automatically. Therefore you don't need to oragnize your own database. NestJS could do this for you.

![plantpoint_schema](./documentation/plantpoint_schema.png)



### Project Sequence

##### 1. HTTP API FLOW

![api_flow-Http_API_Example](./documentation/api_flow-Http_API_Example.png)



##### 2. SENSOR MQTT FLOW

![sensor_mqtt-Sending_Data_Through_Mqtt](./documentation/sensor_mqtt-Sending_Data_Through_Mqtt.png)



##### 3. WEB SOCKET FLOW

![websocket-Sending_Websockets](./documentation/websocket-Sending_Websockets.png)