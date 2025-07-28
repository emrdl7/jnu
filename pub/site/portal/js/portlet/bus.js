class BusTimeTable {
    constructor() {
    }


    setCatLng(time,coords) {
        var defer = new Promise(resolve => {

            let busIndex = 0;
            let nextCoords , nowCoords;
            let moveTime =0;
            let realDi , moveBbearing , moveLatLng;
            let fromLat , fromLng ;
            let toLat , toLng ;
            let setLatLng= [];
            let setStopDist;
            let setStopTime ;
            let busStopNext = true;
            let busStopIndex = 0;
            let summaryTime = 0; //버스정류장간 시간 합산
            let setTime = "60"; //버스간 이동 고정시간 최종 60초임
            let setStopNm = "";
            let busTimeTable = this;

            var intvl = setInterval(() => {
                if (moveTime > time) {
                    resolve(setLatLng);
                    clearInterval(intvl);
                } else {
                    if(coords.length > busIndex){
                        if(busStopNext == true) {

                            nowCoords = coords[busIndex];
                            if(nowCoords) {
                                nextCoords = coords[busIndex+1];

                                fromLat = nowCoords.lat;
                                fromLng = nowCoords.lng;

                                toLat = nextCoords.lat;
                                toLng =  nextCoords.lng;

                                let dist = busTimeTable.distanceTo(fromLat,fromLng,toLat,toLng);

                                if(nowCoords.stop =='y') {
                                    setStopDist = busTimeTable.toBusStop(busIndex,"0",coords);
                                    setStopNm = nowCoords.name;
                                }


                                setStopTime = Math.round((setTime/100)*((dist/setStopDist)*100));

                                if(nextCoords.stop =='y') {
                                    if(nowCoords.stop !='y' && nextCoords.stop =='y')  setStopTime = setTime- summaryTime;
                                    summaryTime  = 0;
                                } else {
                                    summaryTime += setStopTime;
                                }

                                moveBbearing = busTimeTable.finalBearingTo(fromLat,fromLng,toLat,toLng);
                                realDi = ((dist/1000).toPrecision(4)/setStopTime);

                                busIndex++;
                            }

                        }

                        if(busStopIndex ==1) {
                            moveLatLng = busTimeTable.destinationPoint(fromLat,fromLng,(realDi)*1000, moveBbearing);
                        } else {
                            moveLatLng = busTimeTable.destinationPoint(fromLat,fromLng,(realDi*(busStopIndex%setStopTime))*1000, moveBbearing);
                        }

                        setLatLng.push({moveLatLng,moveBbearing,setStopNm});

                        busStopIndex++;
                        busStopNext = false;

                        if(busStopIndex == setStopTime) {
                            busStopNext = true;
                            busStopIndex = 0;
                        }

                        moveTime++;
                    }
                }
            });
        })
        return defer;
    }

    toBusStop(index,distance,coords) {

        let nextCoords;
        let nowCoords = coords[index];
        let nextIndex = parseInt(index)+1;

        if(coords.length > nextIndex) {

            nextCoords = coords[nextIndex];

            let fromLat = nowCoords.lat;
            let fromLng = nowCoords.lng;
            let toLat = nextCoords.lat;
            let toLng =  nextCoords.lng;

            let nowDistance = this.distanceTo(fromLat,fromLng,toLat,toLng);
            distance = parseFloat(nowDistance) + parseFloat(distance);

            if(nextCoords.stop =='y') return distance;

        } else {
            return distance;
        }

        return this.toBusStop(nextIndex,parseFloat(distance),coords);

    }

    distanceTo(startLat,startLng,endLat,endLng) {

        const radius=6371e3

        const R = radius;
        const fromLat = this.toRadians(startLat),  fromLng = this.toRadians(startLng);
        const toLat = this.toRadians(endLat), toLng =this.toRadians(endLng);
        const calcLat = toLat - fromLat;
        const calcLon = toLng - fromLng;

        const a = Math.sin(calcLat/2)*Math.sin(calcLat/2) + Math.cos(fromLat)*Math.cos(toLat) * Math.sin(calcLon/2)*Math.sin(calcLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const d = R * c;

        return d;
    }

    finalBearingTo(endLat,endLng,startLat,startLng) {

        const fromLat = this.toRadians(startLat);
        const toLat = this.toRadians(endLat);
        const calcLon = this.toRadians(endLng - startLng);

        const x = Math.cos(fromLat) * Math.sin(toLat) - Math.sin(fromLat) * Math.cos(toLat) * Math.cos(calcLon);
        const y = Math.sin(calcLon) * Math.cos(toLat);
        const theta = Math.atan2(y, x);

        const bearing = this.wrap360(this.toDegrees(theta))+180;

        return this.wrap360(bearing);
    }


    destinationPoint(lat,lon,distance, bearing, radius=6371e3) {

        const delta = distance / radius;
        const theta = this.toRadians(Number(bearing));

        const fromLat = this.toRadians(lat), fromLng = this.toRadians(lon);

        const sintoLat = Math.sin(fromLat) * Math.cos(delta) + Math.cos(fromLat) * Math.sin(delta) * Math.cos(theta);
        const toLat = Math.asin(sintoLat);
        const y = Math.sin(theta) * Math.sin(delta) * Math.cos(fromLat);
        const x = Math.cos(delta) - Math.sin(fromLat) * sintoLat;
        const toLng = fromLng + Math.atan2(y, x);

        return [this.toDegrees(toLat), this.toDegrees(toLng)];
    }
    wrap360(degrees) {
        if (0<=degrees && degrees<360) return degrees;

        const x = degrees, a = 180, p = 360;
        return (((2*a*x/p)%p)+p)%p;
    }

    toRadians(value) {
        return value * Math.PI / 180;
    }

    toDegrees(value) {
        return value * 180 / Math.PI;
    }

}
