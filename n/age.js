

const axios = require('axios')

const countAge= async () => {
const data = await axios.get('https://coderbyte.com/api/challenges/json/age-counting')
let jsonData = await data.data
const arr = jsonData.data.split(', ')
let obj = []
for (let i = 0; i < arr.length; i = i + 2) {

let key = arr[i].split('=')[1]
let age = arr[i + 1].split('=')[1]
let d = {
key: key,
age: age
}
obj.push(d)
}
let count = 0
let count1 = 0
let temp = 1
for (let i = 0; i < obj.length; i++) {
if (obj[i].age >= 50) {
// console.log(temp)
temp++
count++
}
}
console.log(count)
}

countAge()
