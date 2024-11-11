import cds, { ApplicationService } from "@sap/cds";

export default class ConsumerServiceHandler extends ApplicationService {
  public async init(): Promise<void> {
    await super.init();

    const ConsumerService = await import("../@cds-models/ConsumerService");
    this.on(ConsumerService.consume, (req) => {
      cds.log("Consumer").log("Consuming message of user ", req.user?.id, " : ", req.data.msg);
    });
  }
}
