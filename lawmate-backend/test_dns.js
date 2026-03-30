const dns = require('dns');

const uri = '_mongodb._tcp.cluster0.xojhupw.mongodb.net';

console.log('Resolving SRV for:', uri);

dns.resolveSrv(uri, (err, addresses) => {
  if (err) {
    console.error('DNS SRV Error:', err.message);
    return;
  }
  console.log('SRV Addresses:', addresses);
  
  if (addresses && addresses.length > 0) {
    const host = addresses[0].name;
    console.log('\nResolving TXT for cluster0.xojhupw.mongodb.net');
    dns.resolveTxt('cluster0.xojhupw.mongodb.net', (errTxt, txts) => {
      if (errTxt) {
        console.error('DNS TXT Error:', errTxt.message);
      } else {
        console.log('TXT Records:', txts);
      }
    });
  }
});
