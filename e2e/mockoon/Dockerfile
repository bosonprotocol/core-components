FROM node:18-alpine

RUN npm install -g @mockoon/cli@8.0.0
COPY ./e2e/mockoon/openseaMockApi.json ./openseaMockApi.json

# Install curl for healthcheck and tzdata for timezone support.
RUN apk --no-cache add curl tzdata

# Do not run as root.
RUN adduser --shell /bin/sh --disabled-password --gecos "" mockoon
RUN chown -R mockoon ./openseaMockApi.json
USER mockoon

EXPOSE 3334

ENTRYPOINT ["mockoon-cli","start","--disable-log-to-file","--data","./openseaMockApi.json","--port","3334"]

# Usage: docker run -p <host_port>:<container_port> mockoon-test