const calculator = new Calculator;

function pressButton(event) {
    let clickedButton;
    if (event.type === "keydown" && event.key.length === 1) {
        clickedButton = document.getElementById(event.key);
    } else {
        clickedButton = event.target;
    }
    clickedButton.classList.toggle('is-clicked');
    setTimeout(function() {
        clickedButton.classList.toggle('is-clicked');
    }, 500);
}

let btnClickedRepeatedly = false;
let resetBtnHold = 0;
let countId = null;

function increaseHoldCount() {
    countId = setInterval(function() {
        resetBtnHold += 1;
        console.log(resetBtnHold)
    }, 1000)
}

function stopHoldCount() {
    clearInterval(countId);
}

function manageBtnPress(mouseOrigin, keyboardOrigin) {
    const operators = ["+", "-", "x", "/"];
    const eventOrigin = mouseOrigin || keyboardOrigin;

    document.getElementById("btn-sound").play();
    switch(true) {
        case operators.includes(eventOrigin.id) || operators.includes(eventOrigin.key):
            calculator.subsequentOperation = true;
            calculator.calculationStep = 2;
            if (eventOrigin === mouseOrigin) {
                calculator.operator = eventOrigin.value;
                calculator.printToScreen(eventOrigin.value);
            } else {
                calculator.operator = document.getElementById(eventOrigin.key).value;
                calculator.printToScreen(document.getElementById(eventOrigin.key).value);
            }
            break;
        case eventOrigin.id === '=' || eventOrigin.key === "=":
            if (calculator.operator === "+") {
                calculator.firstOperand = calculator.addValues();
            }
            else if (calculator.operator === "-") {
                calculator.firstOperand = calculator.subtractValues();
            }
            else if (calculator.operator === "x") {
                calculator.firstOperand = calculator.multiplyValues();
            }
            else {
                calculator.firstOperand = calculator.divideValues();
            }
            document.getElementById("operation-sound").play();
            calculator.secondOperand = "";
            calculator.calculationStep = 1;
            break;
        default:
            let activeOperand;
            if (eventOrigin === mouseOrigin) {
                activeOperand = composeString(eventOrigin.value)
            } else {
                activeOperand = composeString(document.getElementById(eventOrigin.key).value)
            }
            calculator.printToScreen(activeOperand);
    }
}

function composeString(value) {
    if (calculator.calculationStep === 1) {
        const commas = countCommas(calculator.firstOperand);
        if (value === ',' && commas > 0 || calculator.subsequentOperation) {
            return calculator.firstOperand;
        } else {
            calculator.firstOperand = calculator.firstOperand + value;
            return calculator.firstOperand;
        }
    } else {
        const commas = countCommas(calculator.secondOperand);
        if (value === ',' && commas > 0) {
            return calculator.secondOperand;
        } else {
            calculator.secondOperand = calculator.secondOperand + value;
            return calculator.secondOperand;
        }
    }
}

function removeCharacter(step) {
    if (step === 1 && calculator.firstOperand.length > 0) {
        calculator.firstOperand = calculator.firstOperand.substring(1);
        calculator.printToScreen(calculator.firstOperand);
    }
    if (step === 2 && calculator.secondOperand.length > 0) {
        calculator.secondOperand = calculator.secondOperand.substring(1);
        calculator.printToScreen(calculator.secondOperand);
    }
}

function countCommas(operand) {
    let commas = 0;
    for (let i=0; i < operand.length; i++) {
        if (operand[i] === ',') {
            commas++;
        }
    }
    return commas;
}

document.addEventListener('DOMContentLoaded', function() {
    calculator.buttons.forEach((item) => {
        switch(true) {
            case item.id === 'c':
                item.addEventListener('mousedown', function(event) {
                    if (calculator.activated === false) {
                        setTimeout(() => {
                            pressButton(event)
                            calculator.turnOn();
                            calculator.printToScreen("0");
                        }, 500);
                    } else {
                        if (resetBtnHold === 0) {
                            increaseHoldCount();
                            item.classList.toggle('is-clicked');
                        }
                    }
                })
                item.addEventListener('mouseup', function(event) {
                    if (calculator.activated === true) {
                        stopHoldCount();
                        if (resetBtnHold >= 1) {
                            calculator.turnOff();
                        } else {
                            calculator.resetValues();
                            calculator.printToScreen("0");
                            document.getElementById("btn-sound").play();
                        }
                        item.classList.remove('is-clicked');
                        resetBtnHold = 0;
                    }
                })
                break;
            case item.id === '-' || item.id === '+':
                item.addEventListener('mousedown', function() {
                    if (calculator.activated === true) {
                        if (resetBtnHold === 0) {
                            increaseHoldCount();
                            item.classList.toggle('is-clicked');
                        }
                    }
                })
                item.addEventListener('mouseup', function() {
                    if (calculator.activated === true) {
                        stopHoldCount();
                        if (resetBtnHold >= 1) {
                            const pressedBtn = item.id === '-' ? '-' : '+';
                            calculator.toggleNumberSign(pressedBtn);
                        } else {
                            manageBtnPress(item, null);
                            document.getElementById("btn-sound").play();
                        }
                        item.classList.remove('is-clicked');
                        resetBtnHold = 0;
                    }
                })
                break;
            default:
                item.addEventListener('click', function(event) {
                    if (calculator.activated === true) {
                        pressButton(event);
                        manageBtnPress(item, null);
                    }    
                });
        }
    });

    document.addEventListener('keydown', function(event) {
        switch(true) {
            case event.key === 'c':
                if (calculator.activated === false) {
                    setTimeout(() => {
                        pressButton(event)
                        calculator.turnOn();
                        calculator.printToScreen("0");
                    }, 500);
                } else {
                    if (resetBtnHold === 0 && btnClickedRepeatedly === false) {
                        increaseHoldCount();
                        document.getElementById(event.key).classList.toggle('is-clicked');
                        btnClickedRepeatedly = true;
                    }
                }
                break;
            case event.key === '-' || event.key === '+':
                if (calculator.activated === true) {
                    if (resetBtnHold === 0 && btnClickedRepeatedly === false) {
                        increaseHoldCount();
                        document.getElementById(event.key).classList.toggle('is-clicked');
                        btnClickedRepeatedly = true;
                    }
                }
                break;
            case event.key === 'Backspace':
                document.getElementById("btn-sound").play();
                removeCharacter(calculator.calculationStep);
                break;
            default:
                if (calculator.activated === true) {
                    if (event.key.length === 1) {
                        pressButton(event);
                        manageBtnPress(null, event);
                    }
                }
        }
    });

    document.addEventListener('keyup', function(event) {
        if (event.key === 'c') {
            if (calculator.activated === true) {
                stopHoldCount();
                if (resetBtnHold >= 1) {
                    calculator.turnOff();
                } else {
                    calculator.resetValues();
                    calculator.printToScreen("0");
                    document.getElementById("btn-sound").play();
                }
                document.getElementById(event.key).classList.remove('is-clicked');
                resetBtnHold = 0;
                btnClickedRepeatedly = false;
            }
        }
        if (event.key === '-' || event.key === '+') {
            if (calculator.activated === true) {
                stopHoldCount();
                if (resetBtnHold >= 1) {
                    const pressedBtn = event.key === '-' ? '-' : '+';
                    calculator.toggleNumberSign(pressedBtn);
                } else {
                    manageBtnPress(null, event);
                    document.getElementById("btn-sound").play();
                }
                document.getElementById(event.key).classList.remove('is-clicked');
                resetBtnHold = 0;
                btnClickedRepeatedly = false;
            }
        }
    });
})
