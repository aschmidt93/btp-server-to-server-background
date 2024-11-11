service ConsumerService @(path: '/api/consumer/') {

   function ping() returns Boolean;

   @(requires: ['Admin'])
   action   consume(msg : String);

}
