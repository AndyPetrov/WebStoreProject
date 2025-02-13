
    -- Insert discounts
    INSERT INTO `discounts` (`product_id`, `discount_type`, `discount_value`, `start_date`, `end_date`) 
    VALUES 
        (1, 'percentage', 10.00, '2025-02-01', '2025-02-28'),
        (2, 'fixed', 5.00, '2025-02-01', '2025-02-28');
    