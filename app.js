import fetch from 'node-fetch';

const API_KEY = process.env.GANDI_API_KEY;
const DOMAIN = process.env.DOMAIN;
const RRSET_NAME = process.env.GANDI_RRSET_NAME;
const RRSET_TYPE = 'A';

// Get IP
const ip = await fetch('https://api.my-ip.io/ip').then((result) => result.text());

// Get current IP from Gandi
const currentDomainRecord = await fetch(`https://api.gandi.net/v5/livedns/domains/${DOMAIN}/records/${RRSET_NAME}/${RRSET_TYPE}`, {
  headers: {Authorization: `Apikey ${API_KEY}`},
}).then((result) => result.json());

if (ip === currentDomainRecord.rrset_values[0]) {
  console.log(`IP has not changed from ${ip}, no need to update`);
} else {
  try {
    const updatedConfig = {
      ...currentDomainRecord,
      rrset_values: [ip],
    };

    const updated = await fetch(`https://api.gandi.net/v5/livedns/domains/${DOMAIN}/records/${RRSET_NAME}/${RRSET_TYPE}`, {
      method: 'PUT',
      headers: {Authorization: `Apikey ${API_KEY}`, 'Content-type': 'application/json'},
      body: JSON.stringify(updatedConfig),
    }).then((res) => {
      if (res.status >= 400) {
        throw Error('An error occurred when trying to update IP');
      } else {
        return res.json();
      }
    });

    console.log(`Updated ${RRSET_TYPE} record for ${RRSET_NAME}.${DOMAIN} to IP ${ip}`);
  } catch (err) {
    console.error(err.message);
  }
}
