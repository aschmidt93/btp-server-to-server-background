// embed the remote service definition
using from '../../consumer/srv/consumer-service';

@(requires: 'authenticated-user')
service ProducerService @(path: '/api/producer/') {

   action start();
   action stop();
   /**
    * Produces a messages and forwards it to the consumer
    */
   action produceMessage();
}
