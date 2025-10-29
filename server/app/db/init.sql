/* Generates dummy data for the listing table. Replace INSERT_SELLER_ID_HERE 
with the seller you want the item to be associated with. */
INSERT INTO listing_table (
    seller_id,
    title,
    description,
    price_cents,
    status,
    created_at,
    updated_at
)
VALUES
    (
        'INSERT_SELLER_ID_HERE',
        'College Algebra Textbook',
        'A college algebra textbook for all your studying needs.',
        6567,
        'ACTIVE',
        NOW(),
        NOW()
    ),
    (
        'INSERT_SELLER_ID_HERE',
        'Kindle',
        'The newest model of the Amazon Kindle, in brand-new condition.',
        10999,
        'ACTIVE',
        NOW(),
        NOW()
    ),
    (
        'INSERT_SELLER_ID_HERE',
        'Beats Headphones',
        'Beats solo headphones in good condition, gently used.',
        12995,
        'ACTIVE',
        NOW(),
        NOW()
    ),
    (
        'INSERT_SELLER_ID_HERE',
        'Levoit Air Purifier',
        'Air purifier that does not come with filter, clean and in like new condition.',
        8999,
        'ACTIVE',
        NOW(),
        NOW()
    ),
    (
        'INSERT_SELLER_ID_HERE',
        'Office Chair',
        'Spinning, comfy, ergonomic office chair in like new condition.',
        9999,
        'ACTIVE',
        NOW(),
        NOW()
    );