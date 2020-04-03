const { INCLUDES, NOT_INCLUDES, IS, IS_NOT, GT, LT }= require('./constants');
const conditionCheckers                             = require('./condition-checkers');
const getValueOnPropertyPath                        = require('./get-value-on-property-path');


function findOperator(condition) {
    const possibleOperatorInOrder = [ NOT_INCLUDES, IS_NOT, INCLUDES, IS, GT, LT ];

    return possibleOperatorInOrder.find(operator => condition.includes(` ${operator} `));
}

const checkerMap = {
    [INCLUDES]:         conditionCheckers.checkInclusion,
    [NOT_INCLUDES]:     conditionCheckers.checkExclusion,
    [IS]:               conditionCheckers.checkEquality,
    [IS_NOT]:           conditionCheckers.checkInequality,
    [GT]:               conditionCheckers.checkIfGreaterThan,
    [LT]:               conditionCheckers.checkIfLessThan
}

function evaluateCondition(objectToCheck, condition) {
    const operator = findOperator(condition);

    const [ propertyPath, testedValue ] = condition.split(` ${operator} `).map(sides => sides.trim());

    const valueOfProperty = getValueOnPropertyPath(objectToCheck, propertyPath);

    return operator && valueOfProperty && checkerMap[operator](valueOfProperty, testedValue);
}

module.exports = function (objectToCheck, condition) {
    // if it is not already evaluated portion of a condition, so it is not a boolean yet
    if (typeof condition === 'string') {
        return evaluateCondition(objectToCheck, condition);
    } else if (typeof condition === 'boolean') {
        return condition;
    } else {
        return false;
    }
}