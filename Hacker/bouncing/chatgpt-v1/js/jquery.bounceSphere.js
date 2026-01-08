(function ($) {

    $.fn.bounceSphere = function (options) {

        const settings = $.extend({
            width: 640,
            height: 480,
            defaultGravity: 0.3,
            defaultRestitution: 0.9,
            speed: 16,
            spheres: []
        }, options);

        const spheres = [];
        const $border = this;

        $border.css({
            width: settings.width,
            height: settings.height,
            position: "relative",
            overflow: "hidden"
        });

        function rand(min, max) { return Math.random() * (max - min) + min; }

        // Add ball function
        function addBall(cfg) {
            const r = cfg.radius;
            const d = r * 2;
            const $el = $("<div class='bounce-sphere'></div>").css({
                width: d,
                height: d,
                borderRadius: "50%",
                position: "absolute",
                backgroundColor: cfg.color || "brown"
            });

            const s = {
                el: $el,
                r: r,
                m: cfg.mass,
                x: rand(0, settings.width - d),
                y: rand(0, settings.height - d),
                vx: cfg.vx !== undefined ? cfg.vx : rand(-4,4),
                vy: cfg.vy !== undefined ? cfg.vy : rand(-2,2),
                gravity: cfg.gravity !== undefined ? cfg.gravity : settings.defaultGravity,
                restitution: cfg.restitution !== undefined ? cfg.restitution : settings.defaultRestitution,
                grabbed: false,
                lastMouse: null
            };

            $el.css({ left: s.x, top: s.y });
            $border.append($el);
            spheres.push(s);
        }

        // Initialize
        settings.spheres.forEach(addBall);

        // Collision based on momentum
        function resolveCollision(a, b) {
            const dx = (b.x + b.r) - (a.x + a.r);
            const dy = (b.y + b.r) - (a.y + a.r);
            const dist = Math.sqrt(dx*dx + dy*dy);
            const minDist = a.r + b.r;

            if (dist === 0 || dist >= minDist) return;

            const nx = dx / dist;
            const ny = dy / dist;

            const rvx = b.vx - a.vx;
            const rvy = b.vy - a.vy;
            const velAlongNormal = rvx*nx + rvy*ny;

            if (velAlongNormal > 0) return;

            const e = Math.min(a.restitution, b.restitution);

            const j = -(1 + e) * velAlongNormal / (1/a.m + 1/b.m);

            const ix = j * nx;
            const iy = j * ny;

            a.vx -= ix / a.m; a.vy -= iy / a.m;
            b.vx += ix / b.m; b.vy += iy / b.m;

            const overlap = minDist - dist;
            const correction = overlap / (1/a.m + 1/b.m);
            a.x -= correction * nx / a.m; a.y -= correction * ny / a.m;
            b.x += correction * nx / b.m; b.y += correction * ny / b.m;
        }

        // Animation loop
        function animate() {
            spheres.forEach(s => {
                if (!s.grabbed) {
                    s.vy += s.gravity;
                    s.x += s.vx;
                    s.y += s.vy;

                    if (s.x <= 0) { s.x = 0; s.vx *= -s.restitution; }
                    if (s.x >= settings.width - s.r*2) { s.x = settings.width - s.r*2; s.vx *= -s.restitution; }
                    if (s.y <= 0) { s.y = 0; s.vy *= -s.restitution; }
                    if (s.y >= settings.height - s.r*2) { s.y = settings.height - s.r*2; s.vy *= -s.restitution; }
                }
            });

            for (let i=0;i<spheres.length;i++){
                for (let j=i+1;j<spheres.length;j++){
                    resolveCollision(spheres[i], spheres[j]);
                }
            }

            spheres.forEach(s => { s.el.css({ left: s.x, top: s.y }); });
        }

        setInterval(animate, settings.speed);

        // Mouse grab & throw
        let grabbedSphere = null;
        let prevMouse = {x:0, y:0};

        $border.on("mousedown", function(e) {
            const mx = e.offsetX, my = e.offsetY;
            for (let i = spheres.length-1; i>=0; i--){
                const s = spheres[i];
                const dx = mx - (s.x + s.r);
                const dy = my - (s.y + s.r);
                if (Math.sqrt(dx*dx + dy*dy) <= s.r){
                    grabbedSphere = s;
                    s.grabbed = true;
                    s.vx = 0; s.vy = 0;
                    s.lastMouse = {x: mx, y: my};
                    prevMouse = {x: mx, y: my};
                    break;
                }
            }
        });

        $border.on("mousemove", function(e){
            if(!grabbedSphere) return;
            const mx = e.offsetX, my = e.offsetY;
            grabbedSphere.x += mx - prevMouse.x;
            grabbedSphere.y += my - prevMouse.y;
            prevMouse = {x: mx, y: my};
        });

        $(document).on("mouseup", function(e){
            if(grabbedSphere){
                const mx = e.offsetX || prevMouse.x;
                const my = e.offsetY || prevMouse.y;
                grabbedSphere.vx = (mx - grabbedSphere.lastMouse.x)/2;
                grabbedSphere.vy = (my - grabbedSphere.lastMouse.y)/2;
                grabbedSphere.grabbed = false;
                grabbedSphere = null;
            }
        });

        this.addBall = addBall;
        return this;
    };

})(jQuery);
