const kNumberType = 'number';
const kDefaultSize = 4;

function SaveCookie(cookie_name, cookie_value, days_to_expire = 0) {
    let expires = "";
    if (days_to_expire) {
        const date = new Date();
        date.setTime(date.getTime() + (days_to_expire * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = cookie_name + "=" + (cookie_value || "") + expires + "; path=/";
}

function ReadCookie(cookie_name) {
    const kCookies = document.cookie.split(';');
    for (let i = 0; i < kCookies.length; i++) {
        let c = kCookies[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(cookie_name) === 0){
             return c.substring(cookie_name.length + 1, c.length);
        }
    }
    return null;
}

function RemoveCookie(cookie_name) {
    document.cookie = cookie_name + "=; Max-Age=-99999999;"
}

/**
 * Generate a random number of a determined size
 * 
 * @param {number} number_size
 * @param {number} min
 * @param {number} max
 * @returns Random number in the interval
 */
function GenerateRandomNumber(min, max) {
    let random_number = 0;
    do {
        random_number = Math.floor(Math.random() * (max - min + 1)) + min;            
    } while (random_number == 0);
    return random_number;
}

/**
 * Start the game
 * 
 * 
 */
function StartGame() {
    let number_size = parseInt(document.getElementById("number-size").value) || kDefaultSize;
    if (typeof number_size == kNumberType && number_size > 0) {
        let min = Math.pow(10, number_size - 1); // 10^(x-1)
        let max = Math.pow(10, number_size) - 1; // (10^x) - 1
        //Save cookies start
        SaveCookie("correct_number", GenerateRandomNumber(min, max));
        SaveCookie("min_number", min);
        SaveCookie("max_number", max);
        SaveCookie("attempts",0)
        SaveCookie("attempts_history","")
        //Save cookies end
        document.getElementById("initial-menu").style.display = "none";
        document.getElementById("game-ui").style.display = "block";
    } else {
        alert("Invalid number!!");
    }
}

function TryNumber() {
    let number_attempt = parseInt(document.getElementById("number-attempt").value) || 0;
    let min = parseInt(ReadCookie("min_number")) | 0;
    let max = parseInt(ReadCookie("max_number")) | 0;
    let correct_number = parseInt(ReadCookie("correct_number")) | 0;
    if (min && max && number_attempt && number_attempt >= min && number_attempt <= max) {
        if (number_attempt == correct_number) {
            //Muestra el resultado y termina el juego (borra cookies)
            FinishGame();
        } else {
            console.log("Fallaste");
            //Guarda el intento, muestras los números y las posiciones correctas
            AnalizeFailedAttempt(number_attempt);
        }
    }
}

function AnalizeFailedAttempt(number_attempt) {
    SaveCookie("attempts", parseInt(ReadCookie("attempts")) + 1);
    let attempts_history = ReadCookie("attempts_history");
    if (attempts_history.length > 0) {
        SaveCookie("attempts_history", attempts_history + number_attempt + ",");
    } else {
        SaveCookie("attempts_history", number_attempt + ",");
    }
    DrawAttempt(number_attempt);
}

function DrawAttempt(number_attempt) {
    let good_numbers = 0;
    let good_positions = 0;
    let attempt_to_string = number_attempt.toString();
    let correct_number = ReadCookie("correct_number");
    let array_found_numbers = [];
    for (i = 0; i < attempt_to_string.length; i++) {
        for (j = 0; j < correct_number.length; j++) {
            if (attempt_to_string[i] == correct_number[j]) {
                console.log(attempt_to_string[i] + " " + correct_number[j])
                if (!(array_found_numbers.includes(attempt_to_string[i]))) {
                    good_numbers++;
                    array_found_numbers.push(attempt_to_string[i]);
                }
                if (i == j) {
                    good_positions++;
                }
            }
        }
    }
    let attempt_parraf = document.createElement("p");
    attempt_parraf.textContent = attempt_to_string + " / Numbers: " + good_numbers + " / Positions: " + good_positions;
    document.getElementById("history-attempts").appendChild(attempt_parraf);
}

function FinishGame() {
    alert("You win!!\nThe number was " + parseInt(ReadCookie("correct_number")));
    RemoveCookie("min_number");
    RemoveCookie("max_number");
    RemoveCookie("correct_number");
    RemoveCookie("attempts");
    RemoveCookie("attempts_history")
    document.getElementById("initial-menu").style.display = "block";
    document.getElementById("game-ui").style.display = "none";
}


document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("button-number-size").addEventListener("click",StartGame);
    document.getElementById("button-check-number").addEventListener("click",TryNumber);
    //Esto se borra maś adelante
    RemoveCookie("min_number");
    RemoveCookie("max_number");
    RemoveCookie("correct_number");
    RemoveCookie("attempts");
    RemoveCookie("attempts_history")
});