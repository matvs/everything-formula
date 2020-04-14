window.addEventListener('load', (event) => {
    window.Formula = {
        defaultOptions: {
            canvasId: 'canvas',
            inputId: 'number'
        },
    
        ctx: null,
        canvas: null,
        input: null,
        cols: 106,
        rows: 17,
        size: 10,
        k: null,
        yAxisReverted: true,
        xAxisReverted: true,
        binarySource: [],
    
        init: function (options = {}) {
            options = Object.assign(this.defaultOptions, options);
            this.onMouseDown = this.onMouseDown.bind(this);
            this.draw = this.draw.bind(this);
    
            this.canvas = document.getElementById(options.canvasId);
            this.ctx = this.canvas.getContext('2d');
            this.canvas.removeEventListener('mousedown', this.onMouseDown)
            this.canvas.addEventListener("mousedown", this.onMouseDown);
    
            this.input = document.getElementById(options.inputId);
            this.input.value = this.TUPPER_FORMULA;
            this.readInputValue();
         

            return this;
        },
    
        start: function () {
    
            // const sourceNumber =  Number.parseInt(this.input.value);
            // if (sourceNumber && !Number.isNaN(sourceNumber)) {
            //     //this.k = sourceNumber * 17; 
            //     this.k = sourceNumber;
            // }
            this.readInputValue();
           
        },
    
        readInputValue() {
            this.k = (BigInt(this.input.value));
            console.log('k: ', this.k);
    
            const source =  BigInt(this.k) / BigInt(17);
            this.binarySource =source.toString(2).split('').map(bit => Boolean(parseInt(bit)));
            const n = this.cols * this.rows; 
            if (this.binarySource.length < n)  {
                this.binarySource.unshift(new Array(n - this.binarySource.length).fill(false));
                this.binarySource = this.binarySource.flat();
            }
            
            // requestAnimationFrame(this.draw);
            this.draw()
        },
    
        changeK: function() {
            // if(Number.is(this.input.value)) {
            //     this.k = Number.parseInt(this.input.value);
            // }
            // this.k = Number.parseInt(this.input.value);
            // console.log('k: ', this.k);
        },
    
        printK: function() {
            alert(BigInt('0b' + this.binarySource.map(bit => bit ? '1' : '0').join('')) * BigInt(17));
            console.log(BigInt('0b' + this.binarySource.map(bit => bit ? '1' : '0').join('')) * BigInt(17))
        },
    
        onSelectPic: function() {
            k = document.getElementById("selectPic").value;
            this.input.value = k;
            this.readInputValue();
            
        },
    
        goUp() {
            // this.k =  ((BigInt(this.k) / BigInt(17)) + BigInt(100000)) * BigInt(17);
            const step = BigInt(1);
            this.k = this.k + BigInt(17)*step;
            this.input.value = this.k;
            this.readInputValue();
        },
    
        goDown() {
            // this.k =  ((BigInt(this.k) / BigInt(17)) - BigInt(100000)) * BigInt(17);
            const step = BigInt(1);
            this.k = this.k - BigInt(17)*step;
            this.input.value = this.k;
            this.readInputValue();
        },
    
        draw: function() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.save()
            // this.ctx.scale(-1 , 1);
            const drawBorders = (row, col) => {
                const x = col * this.size;
                const y = row * this.size;
                this.ctx.strokeRect(x,y, this.size, this.size);
            }
    
            this.iterate(drawBorders);
    
           
    
            if (this.k && !Number.isNaN(this.k)) {
                // const source =  BigInt(this.k) / BigInt(17);
                // const binarySource =source.toString(2).split('').map(bit => Boolean(parseInt(bit)));
                const binarySource = this.binarySource;
                for ( let pos = binarySource.length - 1; pos >= 0; --pos) {
                    const bit = binarySource[pos];
                    if (bit) { 
                        const binaryPos = (binarySource.length - 1) - pos
                        // const binaryPos = pos;
                        const row = this.yAxisReverted ? (binaryPos % 17) : (this.rows - 1) - (binaryPos % 17);
                        // const row = (binaryPos % 17);
                        const col = this.xAxisReverted ? (this.cols - 1) - Math.floor(binaryPos / 17) : Math.floor(binaryPos / 17);
                        // const col = (this.cols - 1) - Math.floor(binaryPos / 17);
                        this.ctx.fillRect(col * this.size, row * this.size, this.size, this.size);
                    }
                } 
    
                // const drawImage = (row, col) => {
                //     let revertedCol = (this.cols - 1) - col;
                //     let y = this.k + BigInt(row);
                //     if (this.TupperFormula(BigInt(col), y)) {
                //         this.ctx.fillRect(revertedCol * this.size, row * this.size, this.size, this.size);
                //     }
                // }
    
                // this.iterate(drawImage);
            }
         
            this.ctx.restore();
            // requestAnimationFrame(this.draw);
        },
        
        TupperFormula: function(x, y) {
            const b17 = BigInt(17);
            const b2 = BigInt(2)
            // return Math.floor((Math.floor(y/17)*Math.pow(2,-17*Math.floor(x)-((Math.floor(y))%(17))))%(2)) > 0.5
            return ((this.k/(b17))/(b2**(b17*x+(y%b17))))%b2 > 0.5
        },
        isInBounds(x) {
            return x >= 0 && x < this.boardSize;
        },
    
        iterate: function(callback) {
            for (let row = 0; row < this.rows; ++row) {
                for (let col = 0; col < this.cols; ++col) {
                    callback(row, col);
                }
            }
        },
    
        onMouseDown: function (event) {
            event.preventDefault();
            var x = event.x;
            var y = event.y;
            x -= this.canvas.offsetLeft;
            y -= this.canvas.offsetTop;
    
            // const row = (this.rows - 1) - Math.floor(y/(this.size));
            const row = this.yAxisReverted ?  Math.floor(y/(this.size)) : (this.rows - 1) - Math.floor(y/(this.size));
            // const col = Math.floor(x/(this.size));
            const col = this.xAxisReverted? (this.cols -1) - Math.floor(x/(this.size)) :  Math.floor(x/(this.size));
            console.log(row, col)
            
    
    
            const binaryPos = (this.binarySource.length - 1) - (col*17 + row); 
            this.binarySource[binaryPos] = !this.binarySource[binaryPos];
            this.draw();
        
        },
    
        onMouseUp: function (event) {
            event.preventDefault();
    
        },

        TUPPER_FORMULA: '960939379918958884971672962127852754715004339660129306651505519271702802395266424689642842174350718121267153782770623355993237280874144307891325963941337723487857735749823926629715517173716995165232890538221612403238855866184013235585136048828693337902491454229288667081096184496091705183454067827731551705405381627380967602565625016981482083418783163849115590225610003652351370343874461848378737238198224849863465033159410054974700593138339226497249461751545728366702369745461014655997933798537483143786841806593422227898388722980000748404719',
    }.init();
});



// 960939379918958884971672962127852754715004339660129306651505519271702802395266424689642842174350718121267153782770623355993237280874144307891325963941337723487857735749823926629715517173716995165232890538221612403238855866184013235585136048828693337902491454229288667081096184496091705183454067827731551705405381627380967602565625016981482083418783163849115590225610003652351370343874461848378737238198224849863465033159410054974700593138339226497249461751545728366702369745461014655997933798537483143786841806593422227898388722980000748404719
// Pacman : 2132131869350533565807697259341716903977083226073731407034320045316289907645668016722470632524340256224309173120220250807716815564227546986873231595320019392570551220050697790385264096539246314244168170174547850968531964756328170871947249492075445630545467031024040250945087891248023967673723191293664997097179778515273295429850517764098889400534958080
// Serca zamiast mod : 960939379918958884971672962127852754715004339660129259096814052850634917702561698853676835363679561360074038188844365969849892498081514510487661288180316854409366329992654181183315885033924982385856452886772189433261009677961979297528808110004396829280087008679421275764921112426311642440015462856678761952009673216606630702157258655983580061010120014106872308499323686797341409170496853644855706479313787282646634285453693448439749537370909812252034433603331595145625458087761144601115818249157310315131584593634079585583827225146486004252655
// Serca2 zamiast mod 2: 960939379918958884971672962127852754715004339660129259096814052850561001652697404226939578734364821683313484923630641715402218061631689019965613889582434900062710033796881001400909827218527710708226270662290511727732329236951405393403224259316275771397495602971157087755109705114991297377812222438330581480401951457740695563497131789177508947320893507896101215229585494844247209837885981305594097320208537915329298408125853240099850825028401380400666043149568523201998145829651779805232377899876787388345460872470098501632287143136611302244335
// Formula Tupper eatean by Pacman: 960939379918958884971672962127852754715004339660129306651505519271702802395266424689642842174350718121267153782770623355993237280874144307891325963941337723487857735749823926629715517173716995165232890538221612403238855866184013235585136048828693337902491454229288667081096184496091705183454067827731551705405381627380967602565625016981482083418783163849115590225610003652351370343874461848378737238198224849863465032979590827952854768825420687945111229393831383979357922422315909742207922663193380283381644732427450744462039113433098183770112