import dayjs from "dayjs";
import duration from "dayjs/plugin/duration"

export const convertSeconds = (seconds)=>{
    dayjs.extend(duration)
    const time = dayjs.duration(seconds, 'seconds');
    const hours = time.hours();
    const minutes = time.minutes();
    const secondsLeft = time.seconds();

    if(hours === 0) return `${minutes}:${secondsLeft}`
    return `${hours}:${minutes}:${secondsLeft}`
}

export const convertSpoonacularRating = (rating)=>{
    if(rating < 0 || rating > 100){
        throw new Error("Error occured, value out of bounds")
    }
     
    return (rating / 20).toFixed(1);
}

export function convertVideosRating(value) {
    if (value < 0 || value > 1) {
        throw new Error("Input must be between 0 and 1.");
    }
    
    return (value * 5).toFixed(1);
}