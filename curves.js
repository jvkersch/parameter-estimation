let initialData = {
    x1: 100,
    y1: 100,
    A: 20
}

const points = getSampleData();

function updateDOM(id, value, style) {
    const el = document.getElementById(id);
    el.textContent = value;
    el.style.backgroundColor = style.bg;
    el.style.color = style.fg;
}

function cmap(A) {
    const d = Math.abs(A - 50);
    let fg = "black", bg = "white";
    if (d > 30) {
        bg = "red";
    } else if (d > 20) {
        bg = "orange";
    } else if (d > 15) {
        bg = "yellow";
    } else if (d > 5) {
        bg = "lightgreen";
    } else {
        bg = "green";
        fg = "white";
    }
    return {"bg": bg, "fg": fg}
}

function curve(A, x) {
    return 2 * A * Math.tanh(x / Math.abs(A));
}

function getSampleData() {
    let points = [];
    for (let x = -150; x <= 150; x += 15) {
        points.push({
            "x": x,
            "y": curve(50, x) + 40 * (Math.random() - 0.5)
        });
    }
    return points;
}

function computeRSS(A) {
    let rss = 0;
    for (const p of points) {
        rss += (p.y - curve(A, p.x))**2;
    }
    return rss;
}

function render(data, ctx){

    // Plot data (fixed)
    for (const p of points) {
        ctx.point(p.x, -p.y, {"fill": "gray"});
    }

    // Plot fitted curve
    for (let x0 = -150; x0 < 150; x0 += 5) {
        const x1 = x0 + 5;
        ctx.line(
            x0, -curve(data.A, x0), x1, -curve(data.A, x1), {
                "affects": ["A"],
                "stroke-width": 4,
                "stroke-linecap": "round"
            });
    }

    // Post updated value
    const color = cmap(data.A);
    updateDOM("parameter-A", data.A.toFixed(2), color);
    updateDOM("parameter-RSS", computeRSS(data.A).toFixed(0), color);
}         

g9(initialData, render)
    .align('center', 'center')
    .insertInto('#canvas')
