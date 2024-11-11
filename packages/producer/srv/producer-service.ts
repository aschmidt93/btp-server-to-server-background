import cds, { ApplicationService } from "@sap/cds";

import type * as ConsumerServiceTypes from "../@cds-models/ConsumerService";
import type * as ProducerServiceTypes from "../@cds-models/ProducerService";

let msgCount = 0;
let timer: { timer: NodeJS.Timeout | undefined } = undefined;

const INTERVAL = 5000;

export default class ProducerServiceHandler extends ApplicationService<
  typeof ProducerServiceTypes
> {
  public async init(): Promise<void> {
    await super.init();

    const ProducerService = await import("../@cds-models/ProducerService");

    cds.once("served", () => {
      void this.send("start");
    });

    this.on(ProducerService.start, (req) => {
      clearInterval(timer?.timer);
      cds.log("Producer").log(`Start producing every ${INTERVAL}ms...`);

      // start background job
      timer = cds.spawn({ every: INTERVAL }, () => {
        return this.send("produceMessage").catch((err) => {
          cds.log("Producer").error(`Error calling produceMessage: `, err);
        });
      });
    });

    this.on(ProducerService.stop, (req) => {
      cds.log("Producer").log(`Stop producing...`);
      clearInterval(timer.timer);
    });

    this.on(ProducerService.produceMessage, async (req) => {
      const msg = `Message #${++msgCount}`;

      cds.log("Producer").log("Producing: ", msg);

      const consumerSrv = (await cds.connect.to("ConsumerService")) as ApplicationService<
        typeof ConsumerServiceTypes
      >;
      await consumerSrv.send("consume", {
        msg: msg,
      });
    });
  }
}
