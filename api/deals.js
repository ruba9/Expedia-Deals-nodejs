var express = require('express');
var router = express.Router();
var url = require('url');
var axios = require('axios');
var deals = require('./api-deals');

var cleanDeals =function (req, res, next) {
    var url_parts = url.parse(req.url, true)
    var destination = url_parts.query.destination
    var lengthOfStay = url_parts.query.lengthOfStay
    var minTripStartDate = url_parts.query.minTripStartDate
    var maxTripStartDate = url_parts.query.maxTripStartDate
    var maxStarRating = url_parts.query.maxStarRating
    var minStarRating = url_parts.query.minStarRating
    var minTotalRate = url_parts.query.minTotalRate
    var maxTotalRate = url_parts.query.maxTotalRate
    expediaUrl = `https://offersvc.expedia.com/offers/v2/getOffers?scenario=deal-finder&page=foo&uid=foo&productType=Hotel`
    if (destination) expediaUrl = expediaUrl + `&destinationName=${destination}`
    if (lengthOfStay) expediaUrl = expediaUrl + `&lengthOfStay=${lengthOfStay}`
    if (minTripStartDate) expediaUrl = expediaUrl + `&minTripStartDate=${minTripStartDate}`
    if (maxTripStartDate) expediaUrl = expediaUrl + `&maxTripStartDate=${maxTripStartDate}`
    if (maxStarRating) expediaUrl = expediaUrl + `&maxStarRating=${maxStarRating}`
    if (minStarRating) expediaUrl = expediaUrl + `&minStarRating=${minStarRating}`
    if (minTotalRate) expediaUrl = expediaUrl + `&minTotalRate=${minTotalRate}`
    if (maxTotalRate) expediaUrl = expediaUrl + `&maxTotalRate=${maxTotalRate}`


    axios.get(expediaUrl)
        .then(function (response) {
            //Check if parameters contain empty data 
            if (Object.keys(response.data.offers).length === 0) {

                res.send('No Data Found')
            }
            //this will retrieve data from applied parameters
            res.send(

                response.data.offers.Hotel.map(deal => {
                    return {
                        "hotelId": deal.hotelInfo.hotelId,
                        "hotelName": deal.hotelInfo.hotelName,
                        "hotelCity": deal.hotelInfo.hotelCity,
                        "hotelLat": deal.hotelInfo.hotelLatitude,
                        "hotelLng": deal.hotelInfo.hotelLongitude,
                        "hotelStarRating": deal.hotelInfo.hotelStarRating,
                        "totalReviews": deal.hotelInfo.hotelReviewTotal,
                        "hotelImageUrl": deal.hotelInfo.hotelImageUrl,
                        "vipAccess": deal.hotelInfo.vipAccess,
                        "totalPrice": deal.hotelPricingInfo.totalPriceValue,
                        "originalPricePerNight": deal.hotelPricingInfo.originalPricePerNight,
                        "priceCurrency": deal.hotelPricingInfo.currency,
                        "percentageSaving": deal.hotelPricingInfo.percentSavings
                    }
                })
            )


        })

        .catch(function (error) {
            console.log(error);
        });

    //  res.render('index', { title: 'Express' });
}
module.exports=cleanDeals