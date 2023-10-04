import React, { memo } from 'react'

const Product = memo(function(){

  console.log("Product 실행")

  return (
    <div>Product</div>
  )
})

export default Product