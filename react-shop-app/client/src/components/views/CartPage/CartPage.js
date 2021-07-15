import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getCartItems, removeCartItem } from '../../../_actions/user_actions';
import UserCardBlock from './Sections/UserCardBlock';
import { Empty } from 'antd';

function CartPage(props) {
    const dispatch = useDispatch();
    const [total, setTotal] = useState(0);
    const [showTotal, setShowTotal] = useState(false);

    useEffect(() => {
        let cartItems = []

        // 리덕스 User state 안에 cart 안에 상품이 들어있는지 확인
        if (props.user.userData && props.user.userData.cart) {
            if (props.user.userData.cart.length > 0) {
                props.user.userData.cart.forEach(item => {
                    cartItems.push(item.id)
                })

                dispatch(getCartItems(cartItems, props.user.userData.cart))
                .then(response => { 
                    if (response.payload.length > 0) {
                        calculateTotal(response.payload) 
                    }
                })
            }
        }
    }, [props.user.userData])

    const calculateTotal = (cartDetail) => {
        let totalAmount = 0;

        cartDetail.map(item => {
            totalAmount += parseInt(item.price, 10) * item.quantity
        });

        setTotal(totalAmount);
        setShowTotal(true);
    }

    const removeFromCart = (productId) => {
        dispatch(removeCartItem(productId))
            .then(response => {
                console.log(response);
                if (response.payload.productInfo.length <= 0) {
                    setShowTotal(false);
                }
            })
    }

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <UserCardBlock products={props.user.cartDetail} removeItem={removeFromCart} />

                <div style={{ marginTop: '3rem' }}>
                    {showTotal ? 
                        <h2>Total Amount: ${total}</h2>
                    :
                    <Empty description={false} />     
                    }
                </div> 
        </div>
    )
}

export default CartPage
