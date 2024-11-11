import cds from "@sap/cds";
import helmet from "helmet";

cds.on("bootstrap", (app) => {
  // add helmet middleware
  app.use(helmet());
});

export async function cds_server(o: unknown) {
  // eslint-disable-next-line no-console
  console.log("Starting server...");
  const defaultServer = (await cds.server(o)) as unknown;

  return defaultServer;
}
