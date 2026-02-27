/**
 * Created by nan on 2018/4/24.
 */
Ext.define('CGP.partnerapplyresultemailconfig.config.Config', {
    statics: {
        data: {
            "partnerName": null,
            "year": 0,
            "month": 0,
            "totalCount": 0,
            "totalPrice": 0.0,
            "context": {
                "yearMonth": null,
                "productSummaries": [
                    {
                        "productId": [
                            {
                            }
                        ],
                        "displayName": null,
                        "price": null,
                        "qty": 0,
                        "totalPrice": null
                    }
                ],
                "reportDetail": {
                    "dayDetails": [
                        {
                            "oneDayDetail": {
                                "dateFormatString": null,
                                "productOneDayDetails": [
                                    {
                                        "productId": [
                                            {

                                            }
                                        ],
                                        "qty": null
                                    }
                                ],
                                "totalQty": null
                            }
                        }
                    ],
                    "reportDetailHeaders": [
                        {

                        }
                    ]
                }
            }
        }
    }
})
