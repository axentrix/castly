class __LOADER {
    constructor() {
        this.max = 1;
        this.progress = 0;
    }
    setMax(max) {
        this.max = max;
        let nodeLabel = document.querySelector(".loader-progress-label");
        if (nodeLabel) {
            if (max == 0) nodeLabel.classList.add("displayNone");
            else nodeLabel.classList.remove("displayNone");
        }
    }
    setProgress(progress) {
        this.progress = progress;
        let loader = document.querySelector(".loader-progress-label");
        if (loader && this.max != 0) {
            let percent = this.progress / this.max * 100;
            percent = percent.toFixed(0);
            loader.innerText = `${percent} %`;
        }
    }
    setAlign(align) {
        let loader = document.querySelector(".loader .icon");
        let loaderp = document.querySelector(".loader-progress-label");
        if (!loader || !loaderp) return;
        if (align == "top") {
            loader.classList.add("top");
            loaderp.classList.add("top");
        } else {
            loader.classList.remove("top");
            loaderp.classList.remove("top");
        }
    }
    start(max = 0, align = "center") {
        this.setMax(max);
        this.setAlign(align);
        //show progress bar
        document.querySelector(".loader").classList.remove("displayNone");
        //set progress to 0
        this.setProgress(0);
    };

    stop() {
        document.querySelector(".loader").classList.add("displayNone");
    }
};
let Loader = new __LOADER();