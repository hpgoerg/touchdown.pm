/*
set REST_SERVER to the internet address from where you started the backend
 */
const REST_SERVER = "localhost";

/*
set REST_SERVER_PORT to the value of the following ./backend/config
    parameters, depending on how you started the backend server:

    backend started with 'npm run server-http':
        REST_SERVER_PORT_FOR_PROD_HTTP (default: 3001)
    backend started with 'npm run server-https'
        REST_SERVER_PORT_FOR_PROD_HTTPS (default: 3443)
*/
const REST_SERVER_PORT = 3001;

/*
set protocol to the protocol used on backend:
    backend started with 'npm run server-http':
        protocol = 'http'
    backend started with 'npm run server-https'
        protocol = 'https'å
 */
const REST_SERVER_PROTOCOL = 'http';

export {REST_SERVER, REST_SERVER_PORT, REST_SERVER_PROTOCOL};