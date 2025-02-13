
    -- Insert payment methods
    INSERT INTO `payment_methods` (`user_id`, `method_type`, `payment_details`) 
    VALUES 
        (1, 'Credit Card', '**** **** **** 1234'),
        (2, 'PayPal', 'paypal@user.com');
    