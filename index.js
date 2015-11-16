exports.handler = function(event, context) {

  /** Verifica se é um objeto SNS válido */
  if (!event.hasOwnProperty('Records')) {
    context.fail("invalid sns event");
  } else if (event.Records.length>1) {
    context.fail("only one record is supported, we received "+event.Records.length);
  }

  /** Transforma a mensagem json vinda do SNS em um objeto */
  event = JSON.parse(event.Records[0].Sns.Message);

  /** Faz a validação dos campos obrigatórios user, from, to e msg */
  if (!event.hasOwnProperty('accessKeyId')) {
    context.fail("accessKeyId not informed");
  } else if (!event.hasOwnProperty('secretAccessKey')) {
    context.fail("secretAccessKey not informed");
  } else if (!event.hasOwnProperty('message')) {
    context.fail("msg not informed");
  }

  /** Se não foi definida região no evento, considerar us-east-1 */
  if (!event.hasOwnProperty('region')) {
    event.region = 'us-east-1';
  }

  /** Carrega a biblioteca da AWS */
  var AWS = require('aws-sdk');

  /** Instancia o objeto  SES */
  var ses = new AWS.SES({
    'accessKeyId': event.accessKeyId, 
    'secretAccessKey': event.secretAccessKey, 
    'region': event.region
  });

  /** Faz o envio do e-mail */
  ses.sendEmail(event.message, function(err, data) {
    if (err) {
      /** Retorno falha */
      console.log(err, err.stack);
    } else {
      /** Retorno sucesso */
      context.succeed();
    }
  });

};