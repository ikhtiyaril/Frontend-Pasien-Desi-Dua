import { useState } from "react";

const productsData = [
  {
    id: 1,
    name: "Premium Theme Website",
    price: 150000
  },
  {
    id: 2,
    name: "Landing Page Template",
    price: 80000
  },
  {
    id: 3,
    name: "UI Kit Dashboard",
    price: 120000
  },
  {
    id: 4,
    name: "React Component Pack",
    price: 95000
  }
];

function TesXendit() {

  const [cart,setCart] = useState([]);
  const [loading,setLoading] = useState(false);

  const addToCart = (product) => {

    const existing = cart.find(item => item.id === product.id);

    if(existing){

      setCart(
        cart.map(item =>
          item.id === product.id
          ? {...item, quantity: item.quantity + 1}
          : item
        )
      );

    }else{

      setCart([...cart,{...product, quantity:1}]);

    }

  };

  const removeFromCart = (id) => {

    setCart(cart.filter(item => item.id !== id));

  };

  const totalPrice = cart.reduce((acc,item)=>{
    return acc + (item.price * item.quantity);
  },0);

  const checkout = async () => {

    if(cart.length === 0){
      alert("Keranjang kosong bro.");
      return;
    }

    setLoading(true);

    try{
    const token = localStorage.getItem('token')
console.log("TOKEN FROM LOCALSTORAGE:", token);
      const response = await fetch(
        "http://localhost:5000/api/paymentXendit/checkout",
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json",
             "Authorization": `Bearer ${token}`
          },
          body:JSON.stringify({

            reference:"ORDER-"+Date.now(),

            amount:totalPrice,

            shipping_cost:0,

            orderItems: cart.map(item => ({
              name:item.name,
              price:item.price,
              quantity:item.quantity
            }))

          })
        }
      );

      const data = await response.json();

      if(!data.success){
        throw new Error(data.message);
      }

      const invoiceUrl = data.data.invoice_url;

      window.location.href = invoiceUrl;

    }catch(err){

      console.error(err);
      alert("Payment gagal dibuat");

    }

    setLoading(false);

  };

  return (

    <div style={{padding:"40px",fontFamily:"Arial"}}>

      <h1>Mini Store Payment Test</h1>

      <h2>Products</h2>

      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"20px"}}>

        {productsData.map(product => (

          <div
            key={product.id}
            style={{
              border:"1px solid #ddd",
              padding:"20px",
              borderRadius:"8px"
            }}
          >

            <h3>{product.name}</h3>

            <p>Rp {product.price.toLocaleString()}</p>

            <button
              onClick={()=>addToCart(product)}
              style={{padding:"8px 16px"}}
            >
              Add to Cart
            </button>

          </div>

        ))}

      </div>


      <h2 style={{marginTop:"40px"}}>Cart</h2>

      {cart.length === 0 && <p>Keranjang kosong</p>}

      {cart.map(item => (

        <div
          key={item.id}
          style={{
            borderBottom:"1px solid #ddd",
            padding:"10px 0"
          }}
        >

          {item.name}  
          x {item.quantity}  

          = Rp {(item.price * item.quantity).toLocaleString()}

          <button
            onClick={()=>removeFromCart(item.id)}
            style={{marginLeft:"10px"}}
          >
            Remove
          </button>

        </div>

      ))}

      <h3 style={{marginTop:"20px"}}>

        Total : Rp {totalPrice.toLocaleString()}

      </h3>

      <button
        onClick={checkout}
        disabled={loading}
        style={{
          marginTop:"10px",
          padding:"12px 24px",
          fontSize:"16px"
        }}
      >

        {loading ? "Processing..." : "Checkout & Pay"}

      </button>

    </div>

  );

}

export default TesXendit;