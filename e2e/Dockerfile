FROM node:10.15.3

# set working directory
RUN mkdir /e2e
WORKDIR /e2e

RUN echo ================ INSTALLING BROSWERS ====================
RUN apt-get update
RUN apt-get install -y gconf-service libasound2 libappindicator3-1 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget iceweasel
RUN rm -rf /var/lib/apt/lists/*
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN dpkg -i google-chrome*.deb
RUN hash -r 

# add `/usr/src/node_modules/.bin` to $PATH
COPY . .

# install and cache app dependencies
RUN npm install

# start app
CMD ["npm", "test"]