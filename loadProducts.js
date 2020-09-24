var products = [];

function getProduct() {

    $.ajax({
        dataType: 'json',
        async: false,
        url: 'products.json',
        success: function(data) {

            for(var i in data.product) {

                products.push(data.product[i]);

                var col = document.createElement('div');
                col.className = "col-lg-4 mt-3";
                col.setAttribute("id","product"+i);

                var col2 = document.createElement('div');
                col2.className = "col-lg-4";
                col2.setAttribute("id","product"+i);

                var card = document.createElement('div');
                card.className = "card";

                var cardImg = document.createElement('img');
                cardImg.className = "img-fluid";

                var cardBody = document.createElement('div');
                cardBody.className = "card-body text-center";

                var cardTitle = document.createElement('h4');
                cardTitle.className = "card-title text-left";

                var cardText = document.createElement('p');
                cardText.className = "card-text text-left";

                var addToCart = document.createElement('a');
                addToCart.className = "btn btn-primary";
                addToCart.setAttribute('pid', data.product[i]['pid']);
                addToCart.setAttribute('onclick', 'addProduct('+data.product[i]['pid']+')');
                addToCart.text = "Add to Cart";

                
                $('.product').append(col);
                
               
                col.appendChild(card);

                card.appendChild(cardImg);
                cardImg.src = data.product[i]['img'];
                card.appendChild(cardBody);
                
                cardBody.appendChild(cardTitle);
                cardTitle.innerHTML = data.product[i]['name'] + " $" + data.product[i]['price'];

                cardBody.appendChild(cardText);
                cardText.innerHTML = data.product[i]['desc'];

                cardBody.appendChild(addToCart);

            }
            
        }
    });

    cart.init();
    showCart();

}

const cart = {
    ID: 'testCart',
    items: [],
    init(){
        let eItems = localStorage.getItem(cart.ID);
        if (eItems) {
            cart.items = JSON.parse(eItems);
        } else {
            cart.items = [];
            cart.cUpdate();
        }
    },
    async cUpdate(){
        let eCart = JSON.stringify(cart.items);
        await localStorage.setItem(cart.ID, eCart);
    },
    check(pid){
        let found = cart.items.filter(item=>{
            if(item.pid == pid){
                return true;
            }
        });
        if(found && found[0]){
            return found;
        }
    },
    add(pid){
        if(cart.check(pid)){
            
            cart.addMore(pid, 1);
        } else {
            let nItem = products.filter(product=>{
                if(product.pid == pid){
                    return true;
                }
            });
            if(nItem && nItem[0]){
                let prod = {
                    pid: nItem[0].pid,
                    name: nItem[0].name,
                    price: nItem[0].price,
                    amount: 1
                };
                cart.items.push(prod);
                cart.cUpdate();
            } else {
                console.error('Product Not Found');
            }
        }
    },
    addMore(pid, amount){
        cart.items = cart.items.map(item=>{
            if(item.pid == pid) {
                item.amount = item.amount + amount;
            }
            return item;
        });
        cart.cUpdate();
    },
    removeItem(pid){
        cart.items = cart.items.filter(item=>{
            if(item.pid != pid){
                return true;
            }
        });
        cart.cUpdate();
    },
    empty(){
      cart.items = [];
      cart.cUpdate();  
    },
    log(prefix){
        console.log(prefix, cart.items);
    }
};

function addProduct(pid){
    cart.add(pid, 1);
    showCart();
}

function removeProduct(pid){
    cart.removeItem(pid);
    showCart();
}

function clearCart(){
    cart.empty();
    showCart();
}

function showCart(){
    var cartElement = document.getElementById('cart');
    var totalPrice = 0;
    cartElement.innerHTML = '';
    if (cart.items.length == 0) {
        var cartEmptyList = document.createElement('li');
        cartEmptyList.className = "list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0";
        cartEmptyList.innerHTML = "Add something to your cart!!";
        cartElement.appendChild(cartEmptyList);
        totalPrice = 0;
        
    } else {
        cart.items.forEach(item => {
            var cartList = document.createElement('li');
            cartList.className = "list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0";
            cartList.innerHTML = item.name + " x" + item.amount + "<span>$" + item.price*item.amount + " <a class='text-danger' onclick='removeProduct("+item.pid+")'><i class='far fa-times-circle'></i></a></span>";
            cartElement.appendChild(cartList);

            totalPrice = totalPrice + (item.price*item.amount);
        });
    }

    document.getElementById("price").innerHTML = "$" + totalPrice;
    document.getElementById("totalPrice").innerHTML = "<strong>$" + totalPrice + "</strong>";
    
}

function checkOut(){
    var totalPrice = 0;
    if (cart.items.length == 0) {
        totalPrice = 0;

        alert("There is no product to be check out");
        
    } else {
        cart.items.forEach(item => {
            totalPrice = totalPrice + (item.price*item.amount);
        });

        alert("Amount Due Today is $" + totalPrice);

    }
}

window.onload = getProduct;