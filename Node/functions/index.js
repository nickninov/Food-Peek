const functions = require('firebase-functions');
const express = require('express');

const admin = require("firebase-admin");
const serviceAccount = require("./key/food-peek-firebase-adminsdk-knb8w-675c0cc302.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://food-peek.firebaseio.com"
});

const db = admin.firestore();

const app = express();

// A function that returns if an input is a number or not
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

// A function that will sort the restaurants by distance
function compareDistance(a, b) {
    return a.distance - b.distance;
}

app.get('/:outcode/:long/:lat', async (req, res) => {

    // Check if long and lat are numbers and their length
    if(isNumeric(req.params.long) && isNumeric(req.params.lat)) {

        // Store all of the restaurrants within a given area
        var restaurantsData = await db.collection(req.params.outcode).get().then((doc) => {

            // An array that stores all of the restaurants from the database
            var dataHolder = [];

            // Check if database is empty
            if(doc.empty === true){
               res.sendStatus(404);
            }

            // Go through each restaurant's data 
            doc.forEach(restaurants => {

                // An object template to store data for a single restaurant
                var tempObj = {
                    distance: null,
                    name: '',
                    postcode: '',
                    food: []
                };

                // Store current values in the temporary object
                tempObj.name = restaurants.data().name;
                tempObj.postcode = restaurants.data().postcode;

                // Get the lattitude difference
                var latDifference = Math.abs(restaurants.data().latitude - req.params.lat);

                // Get the longitude
                var longDifference = Math.abs(restaurants.data().longitude - req.params.long);

                // lat diff + long diff
                var diffSum = latDifference + longDifference;
                
                // Store distance difference in the temporary object
                tempObj.distance = diffSum;

                // Push the object inside an array
                dataHolder.push(tempObj);
            })
            
            // Sort array by distance
            dataHolder.sort(compareDistance);

            // Return the promised data
            return dataHolder
        })
        .catch(e => {
            res.sendStatus(500).send(e);
        })

        // Get food image and name for every restaurant
        await getFood(restaurantsData, 0, req.params.outcode);
        console.log(JSON.stringify(restaurantsData));
        // Send all the data
        res.send(restaurantsData);
    }
    else {
        res.send("No");
    }
})

// A recursive function that stores the images within the food array
async function getFood(array, index, outcode) {

    // Check if the recursion should repeat again
    if(index < array.length) {
        
        // Get the products for the current restaurant
        await db.collection(outcode+'/'+array[index].name+'/Display').get().then((doc) => {
            doc.forEach((product) => {
                // Store the data within the array
                array[index].food.push(product.data());
            });

            return null;
        }).catch((e) => {
            console.log(e);
        });
        // Repeat the function again, increasing the index of the array by 1
        await getFood(array, index + 1, outcode).catch((e) => {
            console.log(e);
        });
    }
}

exports.app = functions.https.onRequest(app);