class FillSpaceCanvas{
    constructor(canvas){
        this.canvas = canvas;
        this.parent = canvas.parentNode;
        window.addEventListener('resize', this.onResize.bind(this));
        this.onResize();
    }
    onResize(){
        this.canvas.width = this.parent.clientWidth;
        this.canvas.height = this.parent.clientHeight;
    }
}

const SUN_OPTS = {
    slicePerc: .9
};

// 8 = .25

// 10 = .2

class Sun{
    constructor(parent, x, y, radius, opt = SUN_OPTS){
        this.ctx = parent.ctx;

        this.x = x;
        this.y = y;
        this.radius = radius;
        this.opt = extend(SUN_OPTS, opt);

        this.slices = [];
        // for(let i = 0; i < this.opt.sliceCount; i++){
        //     let perc = (i/this.opt.sliceCount);

        //     let start = this.radius * 2.5 * perc*perc;
        //     this.slices.push({
        //         startY: start,
        //         height: 4 * Math.pow(start, 1/2) // only works with values 8 or above
        //     });
        // }
    }

    update(delta){
        // Need a clever solution for reducing the size and raising the slices

        this.slices = this.slices.filter(s=>{
            if(s.startY <= -1) return false;
            return true;
        });

        this.slices = this.slices.map((s, ind)=>{
            if(s.startY <= -1) return null;
            let perc = this.opt.slicePerc;

            let start = s.startY <= -1 ? this.radius * 2.8 * perc*perc : s.startY - ((s.startY+(this.radius/6*.006))/(this.radius) * delta * (1000/6));
            return {
                startY: start,
                // height: 4 * Math.pow(start, 1/2)
                height: 1/2.8 * start
            };
        });

        let perc = this.opt.slicePerc;

        let start = this.radius * 2.8 * perc*perc;
        // let height = 4 * Math.pow(start, 1/2);
        let height = 1/2.8 * start;

        let cont = true;

        this.slices.forEach(s=>{
            if(s.startY+(4 * Math.pow(s.startY, 1/2))+(this.radius/4) >= start){
                cont = false;
            }
        })

        if(!cont) return;
        this.slices.push({
            startY: start,
            height: height
        });

        // this.slices = this.slices.map(s=>{
        //     return {
        //         startY: s.startY-1,
        //         height: s.height-.22
        //     };
        // });
    }

    draw(){
        this.ctx.save();
        let grd = this.ctx.createLinearGradient(this.x, this.y-this.radius, this.x, this.y+this.radius);
        grd.addColorStop(0, "yellow");
        grd.addColorStop(0.5, "red");
        grd.addColorStop(1, "purple");

        // Create clips
        this.ctx.beginPath();
        this.slices.forEach(s=>{
            this.ctx.rect(this.x-this.radius, this.y-this.radius+s.startY, this.radius*2, s.height);
        });
        // this.ctx.stroke();
        this.ctx.clip();
        
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
        this.ctx.fillStyle = grd;
        this.ctx.fill();
        this.ctx.closePath();
        
        this.ctx.restore();
    }
}

class CyberTrek extends FillSpaceCanvas{
    constructor(canvas){
        super(canvas);
        this.ctx = this.canvas.getContext('2d');
        this.delta = 0;
        this.lastUpdate = performance.now();



        // This clipping can be used to do exactly what I want
        // Clip a rectangular area
        // this.ctx.fillStyle = "pink";
        // this.ctx.fillRect(0, 0, 1000, 1000);

        // this.ctx.rect(0, 0, 100, 100);
        // this.ctx.rect(100, 100, 100, 100);

        // this.ctx.clip();
        // // Draw red rectangle after clip()
        // this.ctx.fillStyle = "red";
        // this.ctx.fillRect(0, 0, 1000, 1000);

        this.sun = new Sun(this, 250, 250, 200);

        this.render();
    }
    
    render(){
        this.delta = (performance.now() - this.lastUpdate)/1000;

        this.ctx.clearRect(0,0, 500, 500);
        
        this.sun.update(this.delta);

        this.sun.draw();

        this.lastUpdate = performance.now();
        requestAnimationFrame(this.render.bind(this));
    }

}


var extend = function ( defaults, options ) {
    var extended = {};
    var prop;
    for (prop in defaults) {
        if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
            extended[prop] = defaults[prop];
        }
    }
    for (prop in options) {
        if (Object.prototype.hasOwnProperty.call(options, prop)) {
            extended[prop] = options[prop];
        }
    }
    return extended;
};