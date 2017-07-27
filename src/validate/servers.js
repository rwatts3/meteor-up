import { VALIDATE_OPTIONS, addLocation, combineErrorDetails } from './utils';

import joi from 'joi';

// The regexp used matches everything
const schema = joi.object().keys().pattern(/.*/, {
  host: joi
    .alternatives(
    joi.string().trim()
    )
    .required(),
  username: joi.string().required(),
  pem: joi.string().trim(),
  password: joi.string(),
  opts: joi.object().keys({
    port: joi.number()
  })
}).min(1);

export default function validateServers(servers) {
  let details = [];
  let result = joi.validate(servers, schema, VALIDATE_OPTIONS);
  details = combineErrorDetails(details, result);

  Object.keys(servers).forEach((key) => {
    const server = servers[key];
    if (server.pem && server.pem.indexOf('.pub') === server.pem.length - 4) {
      details.push({
        message: 'Needs to be a path to a private key. The file extension ".pub" is used for public keys.',
        path: `${key}.pem`
      });
    }
  });

  return addLocation(details, 'servers');
}
