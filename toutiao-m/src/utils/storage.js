//封装本地存储模块

// 1.存储数据
 //将数组，对象类型的数据转为JSON格式的字符串进行存储
export const setItem = (key, value) => {
    if (typeof value === 'object') {
        value=JSON.stringify(value)
    }
    window.localStorage.setItem(key,value)
}

//2.获取数据
export const getItem = key => {
    const data = window.localStorage.getItem(key) //将获取到的数组，对象类型的数据转为对象格式
    try {
        return JSON.parse(data)
    } catch (error) {
        return data
    }
}

//3.删除数据
export const removeItem = key => {
    window.localStorage.removeItem(key)
}