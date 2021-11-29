let workouts = document.querySelectorAll(".option");

for (let workout of workouts) {
    let input = workout.querySelector("h3").textContent;
    workout.querySelector("p").innerHTML = parseWorkout(input);
}

function parseWorkout(input) {
    let workout = {};
    getType(workout, input);
    let intervalCount = 10;
    let intervalLength = "3:00";
    let restAmount = "1:00";
    let splitAmount = getSplit(workout, input);
    let workoutLength = "5000m";

    if (type === "intervals") {
        return `${type}: ${intervalCount} x ${intervalLength}/${restAmount}R`;
    } else {
        return `${type}: ${workoutLength}/${splitAmount}`;
    }
}

function getType(workout, input) {
    let index = input.indexOf("x");

    if (index >= 0) {
        workout.type = "interval";
    } else {
        workout.type = "fixed";
    }
}

function getSplit(workout, input) {
    if (workout.type === "interval") {
        return;
    }

    let splitWorkout = input.split("/").map((component) => {
        return convertToTimeOrDistance(component);
    });
}

function convertToTimeOrDistance(input) {
    // easily derive distance from an "m"
    if (input.trim().slice(-1).toLowerCase() === "m") {
        return {
            type: "distance",
            amount: parseInt(input.trim().slice(0, -1)),
        };
    }

    // easily derive time from an ":"
    if (input.indexOf(":") > 0) {
        return {
            type: "time",
            amount: convertTimeStringToMilliseconds(input.trim()),
        };
    }

    let inputAsFloat = parseFloat(input.trim());
    if (isNaN(inputAsFloat)) {
        return undefined;
    }

    if (inputAsFloat >= 100) {
        return {
            type: "distance",
            amount: parseInt(input.trim()),
        };
    } else {
        return {
            type: "time",
            amount: convertDecimalStringToMilliseconds(input.trim()),
        };
    }
}

function convertDecimalStringToMillisecond(decimalString) {
    //34.5
    let number = parseFloat(decimalString);
    return number * 60 * 1000;
}

function convertTimeStringToMilliseconds(timeString) {
    // 13:12.9
    // 1:13:12.9
    let splitString = timeString.split(":");

    if (splitString.length === 3) {
        return (
            parseInt(splitString[0]) * 60 * 60 * 1000 +
            parseInt(splitString[1]) * 60 * 1000 +
            parseFloat(splitString[2]) * 1000
        );
    } else if (splitString.length === 2) {
        return (
            parseInt(splitString[0]) * 60 * 1000 +
            parseFloat(splitString[1]) * 1000
        );
    } else if (splitString.length === 1) {
        return parseFloat(splitString[1]) * 1000;
    }
    return;
}
