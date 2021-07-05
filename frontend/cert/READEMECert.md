Put your certificate files in this directory.

Eventually you have to adopt the following code snippet from __./backend/src/backend/restserver/restserver.js__:

<pre><code>
        const options = {
            key: fs.readFileSync(path.resolve(__dirname, "../../../../frontend/cert/certificate.key")),
            cert: fs.readFileSync(path.resolve(__dirname, "../../../../frontend/cert/certificate.crt")),
            //ca: read file of your certificateAuthority
            requestCert: false,
            rejectUnauthorized: false
        };
</code></pre>