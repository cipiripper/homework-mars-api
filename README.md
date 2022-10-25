# Mars Images API (homework)
This project has been made as a coding test.

Requirements to test the code:
- Git
- Node.js *(tested on the latest LTS)*
- Docker and docker-compose *(to test the docker part of the project)*


## 1. Get the code
Create a new directory, clone the repo and install the required npm modules:
```bash
mkdir /tmp/mars_api
cd /tmp/mars_api
git clone https://github.com/cipiripper/homework-mars-api.git .
npm install
```
## 2. Test The code
To run tests:
```sh
npm test
```

## 3. Get the NASA API key
You need to get your own API key from NASA here: https://api.nasa.gov/

After you have received the API key you can pass it to `npm` scripts as an environment variable to start the app.


## 4. Run the App
There are many ways to do this, here are the most important ones:

### 4.1 Start script (dev)
You can use npm start script to start the app. This will by default connect to NASA_API using the `DEMO_KEY` which has low API rate limit set:
```bash
npm start
```

Or you can use your own NASA API key by passing it in the `NASA_API_KEY` environment variable:
```bash
NASA_API_KEY=your_api_key_from_nasa npm start
```

Because there is no Redis avaialable, App will fallback to the in-memory LRU cache.

App should now be started in a dev version, on `ts-node` engine, and the API is available on `http://localhost:3000/api`. You can try to hit the test url: http://localhost:3000/api/images/curiosity/CHEMCAM/121

### 4.2 Start script (production)
To start the production version of the app, using `node` instead of `ts-node`, it has to be transpiled into JS code, and then started:
```bash
npm run build
npm run startProd
```

In the start step you can pass your own NASA API key.

### 4.3 Start Docker environment (dev)
You can build this project as a docker container with dev an production mode. In dev mode, all source files are mapped into a docker container volume, so when ever a file is changed, process in the docker container will restart.

To run the dev variant of the docker environment you have to have Docker and docker-compose installed:
```sh
npm run dockerDev
```

This will start redis and App container, with port 3000 forwarded, and you can open the test url: http://localhost:3000/api/images/curiosity/CHEMCAM/121

### 4.4 Start Docker environment (production)
To build the app for production, you have to create the Production Environment File. Create a file `/environment/prod.env` with your NASA Api key in it:
```conf
NASA_API_KEY= #<<<--- YOUR API KEY GOES HERE
NODE_ENV=production
NASA_API_LIMIT=100
PORT=3000
MOUNT_POINT=/api
REDIS_HOST=redis
REDIS_PORT=6379
```

```sh
npm run dockerProd
```

This will start redis and two App containers, with port 80 now forwarded using NGINX, and you can open the test url: http://localhost/api/images/curiosity/CHEMCAM/121


*Difference between the two docker builds is that the production build doesn't have any TypeScript sources, it has NGINX as a load balancer, it forwards the port 80, instead of the API port 3000 and it runs two App containers.*

## 5. Calling the API
There is only one endpoint supported:
```
/images/:rover/:camera/:sol
```

- **rover** - the name of rover, availale rovers: `CURIOSITY, OPPORTUNITY, SPIRIT`
- **camera** - the name of the camera, available cameras: `FHAZ, RHAZ, MAST, CHEMCAM, MAHLI, MARDI, NAVCAM, PANCAM, MINITES`
- **sol** - day from the rover's touchdown for which you want to see the images for, has to be a positive integer

## 6. Environment Variables
- **NODE_ENV** - `production` or `development`, standard node.js env variable
- **CACHE** - to disable caching, set to `"off"`
- **NASA_API_KEY** - your NASA API key
- **NASA_API_LIMIT** - Minimum number of requests left before returning the `ServiceUnavailable`. This prevents your key to be blocked for an hour
- **PORT** - port to use for the API server, its best to leave it at the default value of `3000`
- **MOUNT_POINT** - set the mount point of the API, `/api` by default
- **REDIS_HOST** - redis host/IP, by default its `redis`, but you can specify any Redis instance address if you want
- **REDIS_PORT** - redis port, `6379` by default


## 7. Contributing
1. Create a fix or a feature locally
2. Create tests for your new code
3. Be sure that `npm test` doesn't fail
4. Create a PR