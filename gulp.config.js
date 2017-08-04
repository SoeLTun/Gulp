module.exports = function() {
    var temp = './temp/';
    var client = './src/client/';
    var server = './src/server/';
    var config = {

        // all js to vet
        alljs: [
            './src/**/*.js',
            './*.js'
        ],
        less: './src/client/styles/styles.less',
        server: server,
        client: client,
        temp: temp,
        defaultPort: 7203,
        nodeServer: './src/server/app.js'
    }
    return config;
}