module.exports = {
    publicPath:'./',
    devServer: {
        // 设置主机地址
        host: '10.0.10.80',
        // host: 'localhost',
        // 设置默认端口
        port: 8093,
        // 设置代理
        proxy: {
            '/api': {
                // 目标 API 地址
                target:'https://10.0.10.246:8091',
                // 如果要代理 websockets
                ws: false,
                // 将主机标头的原点更改为目标URL
                changeOrigin: true,
            }
        },
        historyApiFallback:true
    }
}     