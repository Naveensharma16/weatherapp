let data = null;

let tempType = 'metric';

const getDayByName = (num) => {
    const days = ['sun','mon','tue','wed','thu','fri','sat']
    return days[num]
}
const getMonthByName = (num) => {
    const mon = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']
     return mon[num]
}
const getWheatherImage = (type) =>{
    switch (type) {
        case 'Rain':
         return    '<img src="./img/HeavyRain.png" alt=""></img>'; 
        case 'Thunderstorm':
         return '<img src="./img/Thunderstorm.png" alt=""></img>'; 
        case 'Drizzle':
         return '<img src="./img/LightRain.png" alt=""></img>'; 
         case 'Snow':
            return '<img src="./img/Snow.png" alt=""></img>'; 
         case 'Clear':
            return '<img src="./img/Clear.png" alt=""></img>'; 
         case 'Clouds':
            return '<img src="./img/HeavyCloud.png" alt=""></img>'; 
        default:
            break;
    }
}


const showWeekWeather = (data) =>{

    let wheatherImage = getWheatherImage(data[1].info.weather[0].main);
    let weekweather = ` 
    <div class="single-day">
    <p class="date">Tomorrow</p>
     ${wheatherImage}
    <div class="min-max">
        <p>${Number.parseInt(data[1].info.main.temp_min) }<sup>o</sup>${data[1].tempType}</p>
        <p>${Number.parseInt(data[1].info.main.temp_max) }<sup>o</sup>${data[1].tempType}</p>
    </div>
    </div> `;

    console.log(data[1]);

    for(let i = 2; i< data.length;i++){
        const day =  getDayByName((new Date(data[i].info.dt_txt)).getDay()) 
        const date = (new Date(data[i].info.dt_txt)).getDate();
        const month = getMonthByName((new Date(data[i].info.dt_txt)).getMonth())
        let wheatherImage = getWheatherImage(data[i].info.weather[0].main);
        weekweather += `<div class="single-day">
        <p class="date"><span>${day}, ${date} ${month}</span></p>
        ${wheatherImage}
        <div class="min-max">
            <p>${Number.parseInt(data[i].info.main.temp_min) }<sup>o</sup>${data[i].tempType}</p>
            <p>${Number.parseInt(data[i].info.main.temp_max) }<sup>o</sup>${data[i].tempType}</p>
        </div>
        </div> `
    }


    document.querySelector('.five-days-forcast').innerHTML =  weekweather;

}



const showTodayWeather = (data) =>{
    document.querySelector('.temperator').innerHTML = `<span>${data[0].info.main.temp}</span><sup>o</sup>${data[0].tempType}`;
    document.querySelector('.wheather-type').innerHTML = `<p>${data[0].info.weather[0].main}</p>`;
    // putting the wheather image
    const wheatherImage = getWheatherImage(data[0].info.weather[0].main);
    document.querySelector('.wheather-img').innerHTML= wheatherImage;
    
    const day =  getDayByName((new Date(data[0].info.dt_txt)).getDay())    //TODO: try to make function composition here or check can we do function composition here
    const date = (new Date(data[0].info.dt_txt)).getDate();
    const month = getMonthByName((new Date(data[0].info.dt_txt)).getMonth())
    document.querySelector('.date').innerHTML = `  <span>Today</span> - <span>${day}, ${date} ${month}</span>`
    // hilights
    document.querySelector('.hilight-info-container').innerHTML = `
    <div class="hilight-box">
    <p>Wind status</p>
    <p><strong>${data[0].info.wind.speed}</strong> mph</p>
    <p> <img src="./img/navigation.png" alt=""> WSW</p>
</div>
<div class="hilight-box">
    <p>Humidity</p>
    <p><strong>${data[0].info.main.humidity}</strong> %</p>
    <p class="progress-count"><span>0</span><span>50</span><span>100</span></p>
    <p class="progress" ><span style="width:${data[0].info.main.humidity}%;"></span></p>
    <p style="text-align:right;">%</p>
</div>
<div class="hilight-box">
    <p>Visibility</p>
    <p><strong>${data[0].info.visibility}</strong> meter</p>
</div>
<div class="hilight-box">
    <p>Air Pressure</p>
    <p><strong>${data[0].info.main.pressure}</strong> mb</p>
</div>
    `
}



const callApi = (crd,unit,tempType) =>{

    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${crd.latitude}&lon=${crd.longitude}&units=${unit}&appid=c905bc6d750eaa4c6c72709a73fdaa21`)
    .then((response) => response.json() )  
    .then((body) =>{
        const date = new Date(body.list[0].dt_txt).getDate();
      
        let data =  [
            {
                date:date,
                tempType,
                info:body.list[0]
        }
       ]    
        body.list.forEach(element => {   
           const found = data.some(el => el.date === (new Date(element.dt_txt).getDate()))
           if(!found){
            data.push({date:new Date(element.dt_txt).getDate(), tempType,info:element})
           }
        });
        showTodayWeather(data);
        showWeekWeather(data);
        currentLocationName(crd.latitude,crd.longitude)
    })
}




const fetchWeather = (unit ="metric",lat,lon) =>{

   let tempType = unit == "metric" ? "c" : "f"

   if(lat == undefined && lon == undefined){
     
    navigator.geolocation.getCurrentPosition(success,error);
    function success(pos){
     const crd = pos.coords;
     callApi(crd,unit,tempType)
     }
    function error(){

    }  
   }
   else{
    callApi({latitude:lat,longitude:lon},unit,tempType)
   }
   
  






}


fetchWeather();




// code to change in celcius to fehrenite and vice versa

const item = document.querySelectorAll('.celcius-feherenite button');

for (let index = 0; index < item.length; index++) {
    item[index].addEventListener('click', (e) =>{

        console.log(e);
        
    //    e.path[0].classList[0] == 'change-celcius' ? (e.path[0].classList.add('active') ) : (fetchWeather('imperial') ,e.path[0].classList.add('active') ) 

        if( e.path[0].classList[0] == 'change-celcius'){
            tempType = "metric";
            fetchWeather('metric');
            document.querySelector('.change-celcius').classList.add('active')
            document.querySelector('.change-feherenite').classList.remove('active')
        }
        else{
            fetchWeather('imperial');
            tempType = "imperial";
            document.querySelector('.change-feherenite').classList.add('active')
            document.querySelector('.change-celcius').classList.remove('active')
        }

    }
)
    
}



// code to fetch wheather by current location

document.querySelector('.current-location').addEventListener('click',() =>{

    console.log(tempType);
    fetchWeather(tempType)  
    

});




// search form code

document.querySelector('.search-city').addEventListener('click',() =>{
    document.querySelector('.search-by-location').classList.add('active');
    document.querySelector('.search-by-location').classList.remove('dissmiss');
})

document.querySelector('.box-close img').addEventListener('click',() =>{
    document.querySelector('.search-by-location').classList.remove('active');
    document.querySelector('.search-by-location').classList.add('dissmiss');
})


// current location name function

const currentLocationName = (lat,lon) =>{
    fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=c905bc6d750eaa4c6c72709a73fdaa21`)
    .then((response) =>{
       return response.json()
    })
    .then((body) =>{
        console.log(body);
       document.querySelector('.location-name').innerHTML=`<p><img src="./img/map.png" /> ${body[0].name}</p>`;
    })
    .catch((err) =>{
        console.log(err);
    }) 
}


// search wheather by location
document.querySelector('.search-form input[type=button]').addEventListener('click',() =>{
    
   const place =  document.querySelector('.search-form input[type=text]').value;

   

    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${place}&limit=1&appid=c905bc6d750eaa4c6c72709a73fdaa21`)
    .then((response) =>{
       return response.json()
    })
    .then((body) =>{
        fetchWeather(tempType,body[0].lat,body[0].lon)  
        currentLocationName(body[0].lat,body[0].lon)
    })
    .catch((err) =>{
        console.log(err);
    })
})