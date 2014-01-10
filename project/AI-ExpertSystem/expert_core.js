
/**
 * @date 2014.1.11
 * @author  Leo Lou
 * @email qibinlou@gmail.com
 */
__VERSION__ = '1.0';
__AUTHOR__ = 'Leo Lou';
DEBUG = true;

/**
 * [print make console.log more comfortable]
 * @return {[null]}
 */
function print() {
    var str = '';
    for( var i in arguments) {
        str += arguments[i] + ' ' ;
    }
    console.log(str);
}
var expertSystem = function() {
    /**
     * 内部变量
     */

    /**
     * database of rules
     */
    this.rulesDB = {
        pointClass: [],
        segmentClass: [
            {
                name: 'midline',
                premise: ['(midpoint D AB)', '(midpoint E AC)'],
                conclusion: ['(parallel DE BC)'],
                requirement: ['(notcollinear A B C)'],
                totalpoints: [5],
                description: '三角形中位线定理'

            }
        ],
        lineClass: [],
        angleClass: [],
        triangleClass: [],
        rectangleClass: [],
        circleClass: []
    };

    /**
     * database of facts
     */
    this.inputFacts = ['(midpoint D AB)', '(midpoint E AC)'];
    this.demoFacts = [
        '(mdpoint A BC)', '(mdpoint D EF)', '(points A B C D)',
        '(line A B)', '(segment A B)', 
        '(angle A B D)', '(angle_90 A B D)',
        '(triangle A B C)', '(triangle_90 A B C)', '(iso_triangle_90 A B C)', '(equil_triangle A B C)',

    ]                 

    this.factsDB = {
        pointClass:         [
            
        ],
        segmentClass:       {

        },
        lineClass:          {

        },
        angleClass:         {

        },
        triangleClass:      {

        },
        rectangleClass:     {

        }
    };

    this.conclusion = {};

    /**
     * [parseInputFacts parse the string predicate inputed from user]
     * @param  {[Array]} factslist
     * @return {[Dict]}
     */
    function parseInputFacts(factslist) {
        // console.log(factslist);
        factsDB = {
            pointClass: [],
            segmentClass: [],
            lineClass: [],
            angleClass: [],
            triangleClass: [],
            rectangleClass: [],
            circleClass: []
        };     

        for(var i = 0; i < factslist.length; i++) {
            if(predicateValidator(factslist[i])){
                var pred = predicateParser(factslist[i]);
                switch(pred.name){
                    case 'mdpoint': case 'points': factsDB.pointClass.push(pred); break;
                    case 'segment' : factsDB.segmentClass.push(pred); break;
                    case 'line' : factsDB.lineClass.push(pred); break;
                    case 'angle': case 'angle_90': factsDB.angleClass.push(pred); break;
                    case 'triangle': case 'triangle_90': case 'iso_triangle': case 'equil_triangle': case 'iso_triangle_90': factsDB.triangleClass.push(pred); break;
                    case 'rectangle' : factsDB.rectangleClass.push(pred); break;
                    
                    default: break;
                }
            }
        };
        
        // console.log(factsDB);
        // for(var obj in factsDB){
        //     console.log(obj);
        //     console.log(factsDB[obj]);
        // }
        return factsDB;



    };

    /**
     * [predicateValidator to validate predicates]
     * @param  {[string]} pred
     * @return {[bool]}
     */
    function predicateValidator(pred) {
        return true;
     };

     /**
      * [readFacts read facts from user]
      * @return {[null]}
      */
    this.readFacts = function() {
        this.factsDB = parseInputFacts(this.demoFacts);
        // console.log(this.factsDB);
    
    };
    
    /**
     * [forwardReasoning the forward reasoning algorithm]
     * @param  {[string]} target, the form same as predicate
     * @return {[bool]}
     */
    this.forwardReasoning = function(target) {
        // console.log('#target  ' + target);
        for(var c in this.rulesDB) {
            if(this.rulesDB[c] != false){
                // console.log(c);
                // console.log(this.rulesDB[c]);
                for (var i = 0; i < this.rulesDB[c].length; i++) {
                    var rule = this.rulesDB[c][i];
                    // console.log(rule.premise);
                    var flag = true;
                    for(var j = 0; j < rule.premise.length; j++) {
                        if((rule.premise[j] in this.inputFacts)) {
                            console.log(rule.premise[j]);
                            flag = false;
                            break;
                        }
                    };
                    // find the matched facts,update the facts
                    if(flag) {
                        this.inputFacts.push(rule.conclusion);
                    }
                };
                if(target in this.inputFacts) {
                    return true;
                }
                else {
                    // this.forwardReasoning(target);
                    console.log('404 not found!');
                }
            }

        };

    };

     /**
     * [backwardReasoning the backward reasoning algorithm]
     * @param  {[string]} target, the form same as predicate
     * @return {[bool]}
     */
    this.backwardReasoning = function(target) {
         for(var c in this.rulesDB) {
            if(this.rulesDB[c] != false){
                // console.log(c);
                // console.log(this.rulesDB[c]);
                for (var i = 0; i < this.rulesDB[c].length; i++) {
                    var rule = this.rulesDB[c][i];
                    // console.log(rule.premise);
                    var flag = true;
                    for(var j = 0; j < rule.premise.length; j++) {
                        if((rule.premise[j] in this.inputFacts)) {
                            console.log(rule.premise[j]);
                            flag = false;
                            break;
                        }
                    };
                    // find the matched facts,update the facts
                    if(flag) {
                        this.inputFacts.push(rule.conclusion);
                    }
                };
                if(target in this.inputFacts) {
                    return true;
                }
                else {
                     for(var c in this.rulesDB) {
            if(this.rulesDB[c] != false){
                // console.log(c);
                // console.log(this.rulesDB[c]);
                for (var i = 0; i < this.rulesDB[c].length; i++) {
                    var rule = this.rulesDB[c][i];
                    // console.log(rule.premise);
                    var flag = true;
                    for(var j = 0; j < rule.premise.length; j++) {
                        if((rule.premise[j] in this.inputFacts)) {
                            console.log(rule.premise[j]);
                            flag = false;
                            break;
                        }
                    };  // find the matched facts,update the facts
                   
                };
                if(target in this.inputFacts) {
                    return true;
                }
               
            }
                   
                }
            }
        
    };
};

/**
 * [predicateParser description]
 * @param  {[string]} pred
 * @return {[dict]}   {name: 'mdpoint', points: ['A', 'B', 'C']}
 */
function predicateParser(pred) {
        var pred = pred.substr(1, pred.length -2 );
        var temp = pred.split(' ');
        var varlist = [];
        for(var i = 0; i < temp.length; i++) {
            if(temp[i] != ''){
                varlist.push(temp[i]);
            }
        };
         // console.log(varlist);
        pred = {};
        pred.name = varlist[0];
        pred.points = [];
        for(var i = 1; i < varlist.length; i++) {
            if(varlist[i].length === 1){
                pred.points.push(varlist[i]);
            }
            else{
                for(var j = 0; j < varlist[i].length; j++) {
                    pred.points.push(varlist[i][j]);
                }
            }
        }
        // console.log(pred);
        return pred;
};



/**
 * [expertSystemTester test the expertSystem Class]
 * @return {[null]}
 */
var expertSystemTester = function() {
    var registedTester = [];
    var es = new expertSystem();
    this.predicateParserTester = function() {
        console.log(predicateParser('(mdpoint A B C)'));
        console.log(predicateParser('( mdpoint ABC DE F )'));
    };
};

/*
to judge whether to start testing the expertsystem
 */
if(DEBUG) {
    var est = new expertSystemTester();
    est.predicateParserTester();
}

var es = new expertSystem();
es.readFacts();
es.forwardReasoning('(parallel DE BC)');