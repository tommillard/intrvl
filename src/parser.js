let workouts = document.querySelectorAll(".option");

for (let workout of workouts) {
    let input = workout.querySelector("h3").textContent;
    workout.querySelector("p").innerHTML = parseWorkout(input);
}

function parseWorkout(input) {
    // let's assume 3 x 500m/2:00R for now
    // or 3
    // or 3 x
    // 3 x 5
    // 3 x 500m/
    // 3 x 500m/2

    let workout = {};
    input = input.trim().replace(/ /g, "");

    // if there's an "x" involved, it's an interval
    getType(workout, input);

    if (workout.type === "fixed") {
        let splitWorkout = input.split("/");

        // workout has just been entered as a single effort with no splits
        if (splitWorkout.length === 1) {
            workout.length = convertToTimeOrDistance(input);
        } else {
            splitIntoWorkAndSplit(workout, splitWorkout);
        }
    } else if (workout.type === "interval") {
        let splitWorkout = input.split("x");

        // which side is the interval count?
        if (splitWorkout.length === 1) {
            workout.intervalCount === parseInt(splitWorkout[0]);
        } else {
            if (isSimpleNumber(splitWorkout[0])) {
                workout.intervalCount = parseInt(splitWorkout[0]);
                splitIntoWorkAndRest(workout, splitWorkout[1]);
            } else if (isSimpleNumber(splitWorkout[1])) {
                workout.intervalCount = parseInt(splitWorkout[1]);
                splitIntoWorkAndRest(workout, splitWorkout[0]);
            }
        }
    }

    // Now find out what we have either side of the "x"

    if (workout.type === "interval") {
        return `${workout.type}: ${workout.intervalCount} x ${workout.interval?.amount}/${workout.rest}R`;
    } else {
        return `${workout.type}: ${workout.length?.amount}/${
            workout.split?.amount ?? ""
        }`;
    }
}

function isSimpleNumber(input) {
    return !isNaN(input);
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
}

function splitIntoWorkAndSplit(workout, splitWorkout) {
    workout.length = convertToTimeOrDistance(splitWorkout[0]);

    if (workout.length.type === "time") {
        workout.split = {
            type: "time",
            amount: convertTimeStringToMilliseconds(splitWorkout[1]),
        };
    } else {
        workout.split = {
            type: "distance",
            amount: parseInt(splitWorkout[1]),
        };
    }
}

function splitIntoWorkAndRest(workout, input) {
    let splitInput = input.split("/");

    if (splitInput.length === 1 && splitInput[0].indexOf("R") > 0) {
        splitInput = input.split("R");
        splitInput[1] = "R" + splitInput[1];
    }

    if (splitInput[0].indexOf("R") > 0) {
        workout.rest = convertTimeStringToMilliseconds(
            splitInput[0].replace("R", "")
        );
        if (splitInput[1]) {
            workout.interval = convertToTimeOrDistance(splitInput[1]);
        }
    } else if (splitInput[1]) {
        workout.interval = convertToTimeOrDistance(splitInput[0]);
        workout.rest = convertTimeStringToMilliseconds(
            splitInput[1].replace("R", "")
        );
    }
}

function convertToTimeOrDistance(input) {
    // easily derive distance from an "m"
    if (input.slice(-1).toLowerCase() === "m") {
        return {
            type: "distance",
            amount: parseInt(input.slice(0, -1)),
        };
    }

    // easily derive time from an ":"
    if (input.indexOf(":") > 0) {
        return {
            type: "time",
            amount: convertTimeStringToMilliseconds(input),
        };
    }

    let inputAsFloat = parseFloat(input);

    if (isNaN(inputAsFloat)) {
        return undefined;
    }

    if (inputAsFloat >= 100) {
        return {
            type: "distance",
            amount: parseInt(input),
        };
    } else {
        return {
            type: "time",
            amount: convertDecimalStringToMilliseconds(input),
        };
    }
}

function convertDecimalStringToMilliseconds(decimalString) {
    //34.5
    let number = parseFloat(decimalString);
    return number * 60 * 1000;
}

function convertTimeStringToMilliseconds(timeString) {
    // 13:12.9
    // 1:13:12.9
    // 5
    // :30
    // 8.5
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
        return parseFloat(splitString[0]) * 60 * 1000;
    }
    return;
}
