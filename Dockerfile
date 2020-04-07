FROM node:12-alpine

ENV PATH /opt/gitinsights/node_modules/.bin:/opt/gitinsights/app/node_modules/.bin:/opt/gitinsights/server/node_modules/.bin:/opt/node_modules/.bin:$PATH
ENV NODE_PATH /opt/gitinsights/node_modules:/opt/gitinsights/app/node_modules:/opt/gitinsights/server/node_modules:/opt/node_modules
ENV APP_PATH /opt/gitinsights
RUN mkdir -p $APP_PATH

WORKDIR $APP_PATH
COPY . $APP_PATH

RUN yarn install --pure-lockfile
RUN cp -r /opt/gitinsights/node_modules /opt/node_modules

CMD yarn start

EXPOSE 3000