//Create Blank Products array to store a product data from json
var products = [];

//Get product data from products.json file
function getProduct() {

    //use ajax to pull information from json file
    $.ajax({
        dataType: 'json',
        async: false,
        url: 'products.json',
        success: function(data) {

            //for loop all the data
            for(var i in data.product) {

                //put information in products array
                products.push(data.product[i]);

                //create new column with id
                var col = document.createElement('div');
                col.className = "col-lg-4 mt-3";
                col.setAttribute("id","product"+i);

                //create card element
                var card = document.createElement('div');
                card.className = "card";

                //create card image element
                var cardImg = document.createElement('img');
                cardImg.className = "img-fluid";

                //create card body
                var cardBody = document.createElement('div');
                cardBody.className = "card-body text-center";

                //create card title
                var cardTitle = document.createElement('h4');
                cardTitle.className = "card-title text-left";

                //create card text
                var cardText = document.createElement('p');
                cardText.className = "card-text text-left";

                /* create add to cart button with pid of product
                and onclick that call function "addProduct(pid)" */
                var addToCart = document.createElement('a');
                addToCart.className = "btn btn-primary";
                addToCart.setAttribute('pid', data.product[i]['pid']);
                addToCart.setAttribute('onclick', 'addProduct('+data.product[i]['pid']+')');
                addToCart.text = "Add to Cart";

                //Append column into element class product
                $('.product').append(col);
                
                //Append card into column
                col.appendChild(card);

                /* Append cardIamge into card and set image source
                according to img data from json */
                card.appendChild(cardImg);
                cardImg.src = data.product[i]['img'];

                //Append card body into card
                card.appendChild(cardBody);

                /* Append card title into card body and
                change the text using product name and price */
                cardBody.appendChild(cardTitle);
                cardTitle.innerHTML = data.product[i]['name'] + " $" + data.product[i]['price'];

                /* Append card text into card body and
                change the text using product desc */
                cardBody.appendChild(cardText);
                cardText.innerHTML = data.product[i]['desc'];

                //Append add to cart button into card body
                cardBody.appendChild(addToCart);

            }
            
        }
    });

    //Initialize cart
    cart.init();

    //update cart on webpage
    showCart();

}

//cart object
const cart = {
    //cart ID show in localStorage
    ID: 'testCart',
    //Current Items in the cart
    items: [],
    //Initialize a cart
    init(){
        //Try to get cart from local storage
        let eItems = localStorage.getItem(cart.ID);
        if (eItems) {
            //if cart exist then parse exist item into cart
            cart.items = JSON.parse(eItems);
        } else {
            //else specify empty cart and upload onto localStorage
            cart.items = [];
            cart.cUpdate();
        }
    },
    //Upload cart onto localStorage
    async cUpdate(){
        let eCart = JSON.stringify(cart.items);
        await localStorage.setItem(cart.ID, eCart);
    },
    //check for exist product inside a cart with pid
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
    //add item into a cart
    add(pid){
        if(cart.check(pid)){
            //if the item exist in the cart then use addMore instead
            cart.addMore(pid, 1);
        } else {
            //else put new item in the cart
            //check if pid exist in products array
            let nItem = products.filter(product=>{
                if(product.pid == pid){
                    return true;
                }
            });
            //if pid exist in products array then add item into cart
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
                //if pid is not in product array then print error
                console.error('Product Not Found');
            }
        }
    },
    //add one amount of product that is already in the cart
    addMore(pid, amount){
        cart.items = cart.items.map(item=>{
            if(item.pid == pid) {
                item.amount = item.amount + amount;
            }
            return item;
        });
        cart.cUpdate();
    },
    //remove product from cart
    removeItem(pid){
        cart.items = cart.items.filter(item=>{
            if(item.pid != pid){
                return true;
            }
        });
        cart.cUpdate();
    },
    //empty the cart
    empty(){
      cart.items = [];
      cart.cUpdate();  
    },
    //log cart item
    log(prefix){
        console.log(prefix, cart.items);
    }
};

//function that call with add to cart button
function addProduct(pid){
    //add item into cart
    cart.add(pid, 1);
    //update cart
    showCart();
}

//function that remove product with x icon in cart
function removeProduct(pid){
    //remove item from cart
    cart.removeItem(pid);
    //update cart
    showCart();
}

//function that empty the cart with clear cart link
function clearCart(){
    //empty the cart
    cart.empty();
    //update cart
    showCart();
}

//render cart data on the webpage
function showCart(){
    //get cart element
    var cartElement = document.getElementById('cart');
    //initialize totalprice
    var totalPrice = 0;
    //clear all content in cart element
    cartElement.innerHTML = '';
    //if cart doesn't have any item
    if (cart.items.length == 0) {
        //create list element for empty cart
        var cartEmptyList = document.createElement('li');
        //define list classes
        cartEmptyList.className = "list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0";
        //add text into list element
        cartEmptyList.innerHTML = "Add something to your cart!!";
        //append list into cart element
        cartElement.appendChild(cartEmptyList);
        //set total price to 0
        totalPrice = 0;
        
    } else {
        //if a cart is not empty then for loop through each item in cart
        cart.items.forEach(item => {
            //create list element for current item
            var cartList = document.createElement('li');
            //define list classes
            cartList.className = "list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0";
            //add text into list element according to item information
            cartList.innerHTML = item.name + " x" + item.amount + "<span>$" + item.price*item.amount + " <a class='text-danger' onclick='removeProduct("+item.pid+")'><i class='far fa-times-circle'></i></a></span>";
            //append list into cart element
            cartElement.appendChild(cartList);
            //add current item price into totalprice
            totalPrice = totalPrice + (item.price*item.amount);
        });
    }

    //change text according to a price
    document.getElementById("price").innerHTML = "$" + totalPrice;
    document.getElementById("totalPrice").innerHTML = "<strong>$" + totalPrice + "</strong>";
    
}

//check out function
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

//when window is loaded then call getProduct function
window.onload = getProduct;