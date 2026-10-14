import { Client } from "contensis-delivery-api";

const client = Client.create({
  rootUrl: `https://cms-${process.env.ALIAS}.cloud.contensis.com`,
  accessToken: process.env.ACCESS_TOKEN,
  projectId: process.env.PROJECT,
});

export default client;
