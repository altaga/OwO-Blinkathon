import React from "react";
import ScratchCard from "react-scratch-coupon";

export default function Coupon(props) {
  return (
    <div className="App">
      <h2>Coupon Example</h2>
      <ScratchCard width={300} height={300}>
        <form className="form">
          <h2>Hello There!</h2>
          <h2>
            <code>Coupon code : 1651613335</code>
          </h2>
          <div>
            <input type="text" name="code" placeholder="Coupon Code"></input>
          </div>
          <div>
            <input type="submit" value="Submit"></input>
          </div>
        </form>
      </ScratchCard>
    </div>
  );
}