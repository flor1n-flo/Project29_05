# NC News Seeding
This is a backend project for the NC NEWS API


## How to run the project locally
Clone the repository
git clone https://github.com/flor1n-flo/Project29_05.git
cd in to the northcoders-news-be


### Instaling dependencies
In the terminal you have to do:
 
npm install


#### Environment variables
You need to create to .env files in the root of the project, these are required so that the app can know witch database to connect:

.env.development
PSGDATABASE=nc_news

.env.test
PGDATABASE=nc_news_test


##### Setup the databases
By runing the following comands in the terminal to create and seed your local databases:

npm run setup-dbs
npm run seed


###### Run the test :
In terminal you write the following comand:

npm test
