module.exports = {
    plugins: {
        'autoprefixer': {
            overrideBrowserslist: [
                'Android 4.1',
                'iOS 7.1',
                'Chrome > 31',
                'ff > 31',
                'ie >= 8'
            ]
        },
        'postcss-pxtorem': {
            rootValue: 37.5, //假设设计图如果宽度为750，就写750/10=75
            propList: ['*']
        }
    }
}