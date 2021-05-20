let CONFIG = {
    NOTIFICATION: {
        INTERVAL: 3000,
    },
    CARDVIEW: {
        COLUMN: 4,
        ROW: 3,
    },
    FILTER: {
        REQUEST_RATE: 800,
    },
    STRIPE: {
        /**** TEST KEY ****/
        //PUBLIC_KEY: 'pk_test_51IXhVjIVrbKY9y3LTBMA2llzJVo5qI8OmKWVdyQFmYGjxZ1RFv2YDPLV9SouHC106OIPib2zgR4f4R8xI2Qr9CW700QIPcqmGF'
        /**** Live KEY ****/
        PUBLIC_KEY: 'pk_live_51IXhVjIVrbKY9y3LuUPt9qrJTxZyLjjXVSaMGZrczYEocdrbSrlJboMPt3pwDDBuWT3PnIWOWFxcKhdDEUWSLJ8y00xhS9slCN'
    },
    SERVER: {
        // URL: "/",
        URL: 'https://castly.app/',
        // URL: 'http://localhost/',
    },
    PRINT: {
        WITH_SIZES: {
            PHOTO_FRAME: {
                WIDTH: 170,
                HEIGHT: 180,
            },
            PHOTO_OFFSET: {
                X: 5,
                Y: 5,
            },
            PHOTO_FIT: [85, 145],
            CASTING_LOGO_FIT: [40, 40],
            FRAME_START_POSY: 110,
            FRAME_START_POSX: 50,
        },
        PHOTO_ONLY: {
            COLUMN: 3,
            WIDTH: 500,
            NAME_HEIGHT: 35,
            TEXT_OFFSET_Y: 4,
            CASTING_LOGO_FIT: [40, 40],
            FRAME_START_POSY: 140,
            FRAME_START_POSX: 50,
        },
        SKINS: {
            PHOTO_FRAME: {
                WIDTH: 170,
                HEIGHT: 120,
            },
            PHOTO_OFFSET: {
                X: 100,
                Y: 10,
            },
            PHOTO_FIT: [70, 100],
            CASTING_LOGO_FIT: [40, 40],
            FRAME_START_POSY: 130,
            FRAME_START_POSX: 50,
        },
    },
    STATUS_OPTIONS: [
        // "Not In Project",
        "In Project (Not Contacted)",
        "Availability Check Sent",
        "Available",
        "Unavailable",
        "Booking Email Sent",
        "Booking Confirmed",
        "Remove from Booking Selects",
        "Final Details Sent",
        "Final Details Confirmed",
        "Emergency",
        "Hold Requested",
        "Available to Hold",
        "Unavailable to Hold",
    ]
};