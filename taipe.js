const VM = {
    data(){
        return {
            productList: [],
            orderList: []
        }
    },
    computed: {
        pricetSum(){
            return this.orderList.reduce((previousValue, currentItem) => {
                return previousValue + (currentItem.price * currentItem.count)
            }, 0)
        }
    },
    watch:{
        orderList: {
            handler (newVal , oldVal) {
                this.setStorage(newVal)
            },
            deep: true//監聽陣列內容
        }
    },
    methods: {
        mountView(){
            fetch('https://fakestoreapi.com/products')
            .catch((error)=>{
                console.log(error)
            })
            .then((response) =>{
                return response.json()
            })
            .then((myJson) =>{
                this.productList = myJson
            })
        },
        parseStar(rate){
            const res = rate.toFixed()
            let star = ""
            for (let i = 0; i < 5; i++) {
                star += ((i >= res)?"☆": "★")
            }
            return star+rate
        },
        addOrder(item){

            // 2. findIndex
            const checkIndex = this.orderList.findIndex(order => {
                return order.id === item.id
            })
            if(checkIndex >= 0){
                // 項目已存在訂單中，增加數量
                // console.log(this.orderList[checkIndex]["count"]);
                this.orderList[checkIndex]["count"] += 1
            }else{
                //項目沒存在訂單中，加入訂單
                // 1. 三個點：透過"展開運算符"將item原封不動地丟進去 https://eyesofkids.gitbooks.io/javascript-start-from-es6/content/part4/rest_spread.html
                // 2. 增加一個key：count=0
                this.orderList.push({
                    ...item,
                    count: 1
                })
            }
        },
        reduceOrder(item){
            //減少數量||移除訂單項目 - 和addOrder幾乎一模壹樣，故省略註解並把寫法簡化
            const checkIndex = this.orderList.findIndex(order => order.id === item.id)

            // 如果訂單項目不存在就return跳出，不要繼續往下做事
            if(checkIndex < 0) return

            // console.log(this.orderList[checkIndex]["count"]);
            if(this.orderList[checkIndex]["count"] > 1){
                // 項目已存在訂單中，減少數量
                this.orderList[checkIndex]["count"] -= 1

            }else{
                // 數量剩一個，直接把項目移出訂單
                this.orderList.splice(checkIndex, 1)
            }
        },
        parseOrder(item){
            //去訂單列表中確認這個商品的數量
            const checkIndex = this.orderList.findIndex(order => order.id === item.id)
            // 需要先判斷
            if(this.orderList[checkIndex]){
                return this.orderList[checkIndex]["count"]
            }else{
                //沒有東西回0
                return 0
            }
        },
        setStorage(data){
            //將orderList透過參數的方式傳過來
            const orderStorage = JSON.stringify(data)
            localStorage.setItem('gogobuy', orderStorage)
        },
        getStorage(){
            const orderLists = localStorage.getItem('gogobuy')
            if(!orderLists || orderLists === 'undefined' )return
            this.orderList = JSON.parse(orderLists)
        }
    },
    created() {
        this.getStorage()
    },
    mounted() {
        //畫面載入後，DOM物件(div#view)已被建立
        this.mountView()
        //Get localStorage
        //可以參考/qa/1.cart_feedback.html
    }
}
Vue.createApp(VM).mount('#view')