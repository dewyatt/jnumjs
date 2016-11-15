
function hashKeys(obj) {
    var keys = [];
    for (var key in obj) {
        if (!obj.hasOwnProperty(key)) {
            continue;
        }
        keys.push(key);
    }
    return keys;
}

function hashKeysNumerical(obj) {
    var keys = hashKeys(obj);
    keys = keys.map(function(numeral) {
        return +numeral;
    });
    keys = keys.sort(function(a, b) {
        return a-b;
    });
    return keys;
}

function findClosestNumeral(numerals, number)
{
    var key;

    keys = hashKeysNumerical(numerals);
    for (var i = keys.length - 1; i >= 0; i--) {
        key = keys[i];
        if (key <= number) {
            break;
        }
    }
    return key;
}

function findException(exceptions, number)
{
    if (exceptions) {
        return exceptions[number];
    } else {
        return undefined;
    }
}

function Convert(numerals, minus, point, exceptions, number) {
    var result = '';
    var closest = findClosestNumeral(numerals, number);
    if (closest === number)
    {
        result += numerals[closest];
        return result;
    }
    var multiple = 1;
    while ((multiple + 1) * closest <= number)
        multiple++;
    
    var sub = closest * multiple;
    number -= sub;
    var exception = findException(exceptions, sub);
    if (exception) {
        result += exception;
    }
    else if (1 != multiple) {
        result += Convert(numerals, minus, point, exceptions, multiple, result);
    }

    if (!exception) {
        result += numerals[closest];
    }

    if (0 != number)
    {
        result += " ";
        result += Convert(numerals, minus, point, exceptions, number, result);
    }
    return result;
}

function convertNumber(system, number)
{
    if (!NumberSystems[system])
        return "Unsupported number system";

    var snumber = number;
    number = +number;
    if (isNaN(number))
        return "Input is not numeric";

    var result = "";

    var sys = NumberSystems[system];
    var numerals = sys["Numerals"];
    var minus = sys["Minus"];
    var point = sys["Point"];
    var exceptions = sys["Exceptions"];

    if (number < 0)
        result = minus + " ";

    number = Math.abs(number);
    var decimal = snumber.indexOf(".");
    if (decimal != -1)
    {
        var first = snumber.substring(0, decimal);
        var second = snumber.substring(decimal + 1);
        result += Convert(numerals, minus, point, exceptions, Math.abs(+first), 0);
        result += " " + point + " ";
        for (i = 0; i < second.length; i += 1)
        {
            var digit = +second.substring(i, i + 1);
            result += Convert(numerals, minus, point, exceptions, digit, 0);
            result += " ";
        }
        result = result.trim();
    }
    else {
        result += Convert(numerals, minus, point, exceptions, Math.abs(number), 0);
    }

    return result;
}
