/** TODO: put this on some server
function meta(conf) {
    this.src = conf.src;
    this.width = conf.width;
    this.height = conf.height;
}
function getImageMeta() {
    var metaData = [];
    $('.content img').each(function(i, el) {
        metaData.push(new meta({ src: el.src.replace(/^.+(?=images\/)/, ''), width: el.naturalWidth, height: el.naturalHeight }));
    });
    return metaData;
}
console.log(
    JSON.stringify(
        getImageMeta()
    )
);*/