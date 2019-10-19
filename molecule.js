(function(){
    console.log("hey");

    class chemicalFormula{
        constructor(){
            this.elementMap = {};
            this.formulaCoef = 1;
            this.origFormula = "";
            this.latexFormula = "";
        }
    
        addElement(elementSym, elementNum){
            if (elementSym in this.elementMap){
                this.elementMap[elementSym] = this.elementMap[elementSym] + elementNum;
            }
            else{
                this.elementMap[elementSym] = elementNum;
            }
        }
        
        lookNextElement(formulaText, loc, formulaSubscript){
            if (isUpper(formulaText[loc[0]])){
                var elementSym = "";
                var elementNum = 0;
                if((loc[0]+1)<formulaText.length && isLower(formulaText[loc[0]+1])){
                    elementSym =formulaText[loc[0]]+formulaText[loc[0]+1];
                    loc[0] = loc[0] + 2;
                }
                else{
                    elementSym = formulaText[loc[0]];
                    loc[0] = loc[0] + 1;
                }
                elementNum = this.lookNextNumber(formulaText, loc);
                this.addElement(elementSym, elementNum*formulaSubscript);
                return;
            }
            loc[0] = loc[0] + 1;
            return;
        }
    
        lookNextNumber(formulaText, loc){
            var numberString = "";
            // if catches if there is a writen subscript or not
            // while actually captures the subscript no matter the length
            if(loc[0] < formulaText.length && isNum(formulaText[loc[0]])){
                while(loc[0] < formulaText.length && isNum(formulaText[loc[0]])){
                    numberString = numberString + formulaText[loc[0]];
                    loc[0] = loc[0] + 1;
                }
                return parseInt(numberString);
            }
            return 1;
        }
    
        readTextToFormula(formulaText, coef){
            if(this.origFormula.length == 0){
                this.origFormula = formulaText;
            }
            if(this.findDot(formulaText)){
                formulaText = this.breakDot(formulaText, coef);
            }
            if(this.findBrackOrPeren(formulaText)){
                formulaText = this.breakInnerOuter(formulaText,coef);
            }
            var loc = [0];
            while (loc[0] < formulaText.length){
                this.lookNextElement(formulaText, loc, coef);
            }
    
        }
    
        findDot(formulaText){
            let result = false;
            if(formulaText.includes(".")){
                result = true;
            }
            return result;
        }
    
        breakDot(formulaText, formulaSubscript){
            let dotLocation = formulaText.indexOf(".");
            let loc = [];
            loc[0] = dotLocation+1;
            let dotCoef = this.lookNextNumber(formulaText, loc);
            if(loc[0] < formulaText.length){
                this.readTextToFormula(formulaText.substring(loc[0]), formulaSubscript*dotCoef)
            }
            return formulaText.substring(0, dotLocation);
        }
    
        findBrackOrPeren(formulaText){
            let result = false;
            if(formulaText.includes("(") && formulaText.includes(")")){
                result = true;
            }
            if(formulaText.includes("[") && formulaText.includes("]")){
                result = true;
            }
            return result;
        }
    
        breakInnerOuter(formulaText, formulaSubscript){
            
            let start = 0;
            let end = 0;
            
            if((formulaText.indexOf("(") > 0) && (formulaText.indexOf("[") > 0)){
                if(formulaText.indexOf("(") < formulaText.indexOf("[")){
                    start = formulaText.indexOf("(");
                    end = formulaText.lastIndexOf(")");
                }
                else{
                    start = formulaText.indexOf("[");
                    end = formulaText.lastIndexOf("]");
                }
            }
            else if(formulaText.indexOf("(") > 0){
                start = formulaText.indexOf("(");
                end = formulaText.lastIndexOf(")");
            }
            else if(formulaText.indexOf("[") >0){
                start = formulaText.indexOf("[");
                end = formulaText.lastIndexOf("]");
            }
            
            let beforeText = formulaText.substring(0,start);
            let loc = [];
            loc[0] = end + 1;
            let elementNum = this.lookNextNumber(formulaText, loc); 
            let innerText = formulaText.substring(start+1,end);
            let afterText = formulaText.substring(loc[0]);
            this.readTextToFormula(innerText,formulaSubscript*elementNum);
            return beforeText + afterText;
        }
    }
    
    function parseMolecule(formula) {
        myFormula = new chemicalFormula();
        // replace

        myFormula.readTextToFormula(formula,1);

        return myFormula.elementMap;
    }
    
    //console.log(parseMolecule("K4[ON(SO3)2]2"));

    function isAlpha(myChar) {
        return null != myChar.match(/[a-z]/i);
    }
    
    function isNum(myChar){
        return null != myChar.match(/[0-9]/i);
    }
    
    function isUpper(myChar){
        return isAlpha(myChar) && (myChar == myChar.toUpperCase());
    }
    
    function isLower(myChar){
        return isAlpha(myChar) && (myChar == myChar.toLowerCase());
    }

})();