class Calculator {
    constructor() {
        this.activated = false;
        this.calculationStep = 1;
        this.firstOperand = "";
        this.operator = "";
        this.secondOperand = "";
        this.subsequentOperation = false;
        this.buttons = Array.from(document.getElementsByClassName("button"));
        this.screen = document.querySelector('.screen');
        this.prompt = Array.from(document.getElementsByClassName("prompt"))[0];
        this.toggleComponents = this.buttons.concat(this.screen);
    }

    /* 
    Arithmetic operations below (addValues, subtractValues, multiplyValues and divideValues) 
    currently being performed by means of "big.js" library. Original raw operations suffering 
    from decimal precision issue commented immediately below. 
    */

    addValues() {
        this.normaliseDecimals("calculating");
        let addition = new Big(this.firstOperand).plus(new Big(this.secondOperand));
        // let addition = Number(this.firstOperand) + Number(this.secondOperand);
        addition = this.normaliseDecimals("printing", addition);
        this.printToScreen(addition);
        return addition;
    }
    
    subtractValues() {
        this.normaliseDecimals("calculating");
        let subtraction = new Big(this.firstOperand).minus(new Big(this.secondOperand));
        // let subtraction = Number(this.firstOperand) - Number(this.secondOperand);
        subtraction = this.normaliseDecimals("printing", subtraction);
        this.printToScreen(subtraction);
        return subtraction;
    }

    multiplyValues() {
        this.normaliseDecimals("calculating");
        let multiplication = new Big(this.firstOperand).times(new Big(this.secondOperand));
        // let multiplication = Number(this.firstOperand) * Number(this.secondOperand);
        multiplication = this.normaliseDecimals("printing", multiplication);
        this.printToScreen(multiplication);
        return multiplication;
    }

    divideValues() {
        this.normaliseDecimals("calculating");
        let division = new Big(this.firstOperand).div(new Big(this.secondOperand));
        // let division = Number(this.firstOperand) / Number(this.secondOperand);
        division = this.normaliseDecimals("printing", division);
        this.printToScreen(division);
        return division;
    }

    toggleNumberSign(sign) {
        switch (true) {
            case this.calculationStep === 1 && sign === '-':
                if (!this.firstOperand.includes('-')) {
                    this.firstOperand = '-' + this.firstOperand;
                    this.printToScreen(this.firstOperand);
                }
                break;
            case this.calculationStep === 1 && sign == '+':
                if (this.firstOperand.includes('-')) {
                    this.firstOperand = this.firstOperand.substring(1);
                    this.printToScreen(this.firstOperand);
                }
                break;
            case this.calculationStep === 2 && sign === '-':
                if (!this.secondOperand.includes('-')) {
                    this.secondOperand = '-' + this.secondOperand;
                    this.printToScreen(this.secondOperand);
                }
                break;
            case this.calculationStep === 2 && sign == '+':
                if (this.secondOperand.includes('-')) {
                    this.secondOperand = this.secondOperand.substring(1);
                    this.printToScreen(this.secondOperand);
                }
                break;
        }
    }

    resetValues() {
        this.firstOperand = "";
        this.operator = "";
        this.secondOperand = "";
        this.calculationStep = 1;
        this.subsequentOperation = false;
    }

    normaliseDecimals(operation, value) {
        if (operation === "calculating") {
            this.firstOperand = this.firstOperand.replace(",", ".");
            this.secondOperand = this.secondOperand.replace(",", ".");
        } else {
            value = String(value).replace(".", ",");
            return value;
        }
    }

    printToScreen(value) {
        const screenText = document.querySelector('.screen p');
        screenText.innerHTML = value;
    }

    turnOn() {
        document.getElementById("on-sound").play();
        this.toggleComponents.forEach((item) => {
            item.classList.remove('is-inactive');
            item.classList.add('is-active');
        })
        this.printToScreen("0");
        this.activated = true;
        this.prompt.classList.toggle("is-pulsing");
        this.prompt.innerHTML = 'Long press "C" to log off <br> Long press "-" or "+" to change number sign';
    }

    turnOff() {
        document.getElementById("off-sound").play();
        this.toggleComponents.forEach((item) => {
            item.classList.remove('is-active');
            item.classList.add('is-inactive');
        })
        this.printToScreen("");
        this.resetValues();
        this.activated = false;
        this.prompt.classList.toggle("is-pulsing");
        this.prompt.innerHTML = 'Press "C" to crunch some numbers!';
    }
}