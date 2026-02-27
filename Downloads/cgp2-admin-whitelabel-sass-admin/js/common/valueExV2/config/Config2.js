/**
 * Created by nan on 2019/3/29.
 */
Ext.define('CGP.common.valueExV2.config.Config2', {
    statics: {
        data: {
            "deliveryMobile": "18888888888",
            "orderTotals": [{
                "id": 876998,
                "title": "Subtotal:",
                "text": "￥10.00",
                "code": "ot_subtotal",
                "value": 10,
                "sortOrder": 10,
                "multilingualKey": "com.qpp.cgp.domain.dto.order.detail.DetailOrderTotalDTO"
            }, {
                "id": 876999,
                "title": "Shipping(中通):",
                "text": "￥0.00",
                "code": "ot_shipping",
                "value": 0,
                "sortOrder": 20,
                "multilingualKey": "com.qpp.cgp.domain.dto.order.detail.DetailOrderTotalDTO"
            }, {
                "id": 877000,
                "title": "Total :",
                "text": "<b>￥10.00</b>",
                "code": "ot_total",
                "value": 10,
                "sortOrder": 60,
                "multilingualKey": "com.qpp.cgp.domain.dto.order.detail.DetailOrderTotalDTO"
            }],
            "orderNumber": "TM1809170005",
            "totalQty": 1,
            "deliveryEmail": "smartLee@qpp.com",
            "deliveryStreetAddress1": "test",
            "subtotalIncTax": 10,
            "lineItems": [{
                "id": 876994,
                "seqNo": 1,
                "productInstanceId": "876992",
                "productModel": "DRD008705",
                "productName": "FancyBuilderWineBox",
                "productSku": "DRD008705-5",
                "price": 10,
                "amount": 10,
                "qty": 1,
                "product": {
                    "id": 836073,
                    "medias": [],
                    "multilingualKey": "com.qpp.cgp.domain.dto.order.ProductOrderDTO"
                },
                "qtyRefunded": 0,
                "amountRefunded": 0,
                "productAttributeValues": [{
                    "id": 876995,
                    "attribute": {
                        "id": 133726,
                        "name": "Finish",
                        "required": true,
                        "inputType": "DropList",
                        "validationExp": "",
                        "options": [{
                            "id": 133727,
                            "name": "Matt Finish",
                            "sortOrder": 0,
                            "imageUrl": "",
                            "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                        }, {
                            "id": 133728,
                            "name": "Gloss Finish",
                            "sortOrder": 1,
                            "imageUrl": "",
                            "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                        }],
                        "code": "Function_Pentagon_box_Finish",
                        "showInFrontend": true,
                        "sortOrder": 0,
                        "multilingualKey": "com.qpp.cgp.domain.attribute.Attribute"
                    },
                    "attributeInputType": "DropList",
                    "attributeName": "Finish",
                    "attributeValue": "Matt Finish",
                    "attributeOptionIds": "133727",
                    "multilingualKey": "com.qpp.cgp.domain.dto.order.detail.DetailOrderLineItemProductAttributeValueDTO"
                }, {
                    "id": 876996,
                    "attribute": {
                        "id": 830452,
                        "name": "PaperType",
                        "required": false,
                        "inputType": "DropList",
                        "validationExp": "",
                        "options": [{
                            "id": 830453,
                            "name": "157g Art paper + 2mm Paperboard",
                            "sortOrder": 0,
                            "imageUrl": "",
                            "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                        }],
                        "code": "PaperTypeFB2",
                        "showInFrontend": false,
                        "sortOrder": 0,
                        "multilingualKey": "com.qpp.cgp.domain.attribute.Attribute"
                    },
                    "attributeInputType": "DropList",
                    "attributeName": "PaperType",
                    "attributeValue": "157g Art paper + 2mm Paperboard",
                    "attributeOptionIds": "830453",
                    "multilingualKey": "com.qpp.cgp.domain.dto.order.detail.DetailOrderLineItemProductAttributeValueDTO"
                }, {
                    "id": 876997,
                    "attribute": {
                        "id": 133723,
                        "name": "Print",
                        "required": true,
                        "inputType": "DropList",
                        "validationExp": "",
                        "options": [{
                            "id": 133724,
                            "name": "Full Color Print",
                            "sortOrder": 0,
                            "imageUrl": "",
                            "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                        }, {
                            "id": 133725,
                            "name": "Plain-No Print",
                            "sortOrder": 1,
                            "imageUrl": "",
                            "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                        }],
                        "code": "Function_Pentagon_box_Print",
                        "showInFrontend": true,
                        "sortOrder": 0,
                        "multilingualKey": "com.qpp.cgp.domain.attribute.Attribute"
                    },
                    "attributeInputType": "DropList",
                    "attributeName": "Print",
                    "attributeValue": "Full Color Print",
                    "attributeOptionIds": "133724",
                    "multilingualKey": "com.qpp.cgp.domain.dto.order.detail.DetailOrderLineItemProductAttributeValueDTO"
                }],
                "comment": "test",
                "productInstance": {
                    "_id": "876992",
                    "clazz": "com.qpp.cgp.domain.bom.runtime.ProductInstance",
                    "productId": 836073,
                    "material": {
                        "_id": "835942",
                        "clazz": "com.qpp.cgp.domain.bom.MaterialSpu",
                        "isOutSourcing": false,
                        "multilingualKey": "com.qpp.cgp.domain.bom.Material"
                    },
                    "productMaterialViews": [{
                        "_id": "876818",
                        "clazz": "com.qpp.cgp.domain.bom.runtime.ProductMaterialView",
                        "materialViewType": {
                            "_id": "831109",
                            "idReference": "MaterialViewType",
                            "clazz": "com.qpp.cgp.domain.bom.MaterialViewType",
                            "name": "FancyBuilderWineBoxInner_V2",
                            "multilingualKey": "com.qpp.cgp.domain.bom.MaterialViewType"
                        },
                        "pageContents": [{
                            "_id": "876987",
                            "idReference": "PageContent",
                            "clazz": "com.qpp.cgp.domain.bom.runtime.PageContent",
                            "multilingualKey": "com.qpp.cgp.domain.bom.runtime.PageContent"
                        }],
                        "materialPath": "835942,835970,830356",
                        "productMaterialViewType": {
                            "_id": "870269",
                            "idReference": "ProductMaterialViewType",
                            "clazz": "com.qpp.cgp.domain.bom.ProductMaterialViewType",
                            "multilingualKey": "com.qpp.cgp.domain.bom.ProductMaterialViewType"
                        },
                        "multilingualKey": "com.qpp.cgp.domain.bom.runtime.ProductMaterialView"
                    }, {
                        "_id": "876819",
                        "clazz": "com.qpp.cgp.domain.bom.runtime.ProductMaterialView",
                        "materialViewType": {
                            "_id": "831108",
                            "idReference": "MaterialViewType",
                            "clazz": "com.qpp.cgp.domain.bom.MaterialViewType",
                            "name": "FancyBuilderWineBoxTop_V2",
                            "multilingualKey": "com.qpp.cgp.domain.bom.MaterialViewType"
                        },
                        "pageContents": [{
                            "_id": "876988",
                            "idReference": "PageContent",
                            "clazz": "com.qpp.cgp.domain.bom.runtime.PageContent",
                            "multilingualKey": "com.qpp.cgp.domain.bom.runtime.PageContent"
                        }],
                        "materialPath": "835942,835948,830346",
                        "productMaterialViewType": {
                            "_id": "870244",
                            "idReference": "ProductMaterialViewType",
                            "clazz": "com.qpp.cgp.domain.bom.ProductMaterialViewType",
                            "multilingualKey": "com.qpp.cgp.domain.bom.ProductMaterialViewType"
                        },
                        "multilingualKey": "com.qpp.cgp.domain.bom.runtime.ProductMaterialView"
                    }, {
                        "_id": "876820",
                        "clazz": "com.qpp.cgp.domain.bom.runtime.ProductMaterialView",
                        "materialViewType": {
                            "_id": "831107",
                            "idReference": "MaterialViewType",
                            "clazz": "com.qpp.cgp.domain.bom.MaterialViewType",
                            "name": "FancyBuilderWineBoxBottom_V2",
                            "multilingualKey": "com.qpp.cgp.domain.bom.MaterialViewType"
                        },
                        "pageContents": [{
                            "_id": "876989",
                            "idReference": "PageContent",
                            "clazz": "com.qpp.cgp.domain.bom.runtime.PageContent",
                            "multilingualKey": "com.qpp.cgp.domain.bom.runtime.PageContent"
                        }],
                        "materialPath": "835942,835954,830350",
                        "productMaterialViewType": {
                            "_id": "870252",
                            "idReference": "ProductMaterialViewType",
                            "clazz": "com.qpp.cgp.domain.bom.ProductMaterialViewType",
                            "multilingualKey": "com.qpp.cgp.domain.bom.ProductMaterialViewType"
                        },
                        "multilingualKey": "com.qpp.cgp.domain.bom.runtime.ProductMaterialView"
                    }, {
                        "_id": "876821",
                        "clazz": "com.qpp.cgp.domain.bom.runtime.ProductMaterialView",
                        "materialViewType": {
                            "_id": "831105",
                            "idReference": "MaterialViewType",
                            "clazz": "com.qpp.cgp.domain.bom.MaterialViewType",
                            "name": "FancyBuilderWineBoxOuter_V2",
                            "multilingualKey": "com.qpp.cgp.domain.bom.MaterialViewType"
                        },
                        "pageContents": [{
                            "_id": "876990",
                            "idReference": "PageContent",
                            "clazz": "com.qpp.cgp.domain.bom.runtime.PageContent",
                            "multilingualKey": "com.qpp.cgp.domain.bom.runtime.PageContent"
                        }],
                        "materialPath": "835942,835962,830351",
                        "productMaterialViewType": {
                            "_id": "870260",
                            "idReference": "ProductMaterialViewType",
                            "clazz": "com.qpp.cgp.domain.bom.ProductMaterialViewType",
                            "multilingualKey": "com.qpp.cgp.domain.bom.ProductMaterialViewType"
                        },
                        "multilingualKey": "com.qpp.cgp.domain.bom.runtime.ProductMaterialView"
                    }, {
                        "_id": "876822",
                        "clazz": "com.qpp.cgp.domain.bom.runtime.ProductMaterialView",
                        "materialViewType": {
                            "_id": "831111",
                            "idReference": "MaterialViewType",
                            "clazz": "com.qpp.cgp.domain.bom.MaterialViewType",
                            "name": "FancyBuilderWineBoxInnerDesign_V2",
                            "multilingualKey": "com.qpp.cgp.domain.bom.MaterialViewType"
                        },
                        "pageContents": [{
                            "_id": "876991",
                            "idReference": "PageContent",
                            "clazz": "com.qpp.cgp.domain.bom.runtime.PageContent",
                            "multilingualKey": "com.qpp.cgp.domain.bom.runtime.PageContent"
                        }],
                        "materialPath": "835942,835978,830360",
                        "productMaterialViewType": {
                            "_id": "870274",
                            "idReference": "ProductMaterialViewType",
                            "clazz": "com.qpp.cgp.domain.bom.ProductMaterialViewType",
                            "multilingualKey": "com.qpp.cgp.domain.bom.ProductMaterialViewType"
                        },
                        "multilingualKey": "com.qpp.cgp.domain.bom.runtime.ProductMaterialView"
                    }],
                    "productConfigBomId": 870276,
                    "productConfigViewId": 870284,
                    "productConfigImpositionId": 870280,
                    "productConfigDesignId": 870290,
                    "thumbnail": "4c87a536-3adb-43af-8936-977162179d20-0.jpg",
                    "photos": [],
                    "multilingualKey": "com.qpp.cgp.domain.bom.runtime.ProductInstance"
                },
                "status": {
                    "id": 300,
                    "name": "Third wating confirm",
                    "multilingualKey": "com.qpp.cgp.domain.orderitem.OrderItemStatus"
                },
                "statusHistories": [],
                "materialId": "835942",
                "isRedo": false,
                "multilingualKey": "com.qpp.cgp.domain.dto.order.detail.DetailOrderLineItemDTO"
            }],
            "paymentModuleCode": "ntt",
            "totalExTax": 10,
            "customerEmail": "smartLee@qpp.com",
            "customerId": 426792,
            "totalRefunded": 0,
            "shipmentBoxes": [],
            "id": 876993,
            "shippingRefunded": 0,
            "isRedo": false,
            "bindOrders": [{
                "id": 877002,
                "orderNumber": "111",
                "multilingualKey": "com.qpp.cgp.domain.dto.order.detail.DetailThirdOrderDTO"
            }],
            "deliveryCity": "sz",
            "website": {
                "id": 11,
                "code": "WHITELABEL",
                "name": "WhiteLabel",
                "url": "http://192.168.26.70",
                "showInAdmin": true,
                "multilingualKey": "com.qpp.cgp.domain.common.Website"
            },
            "statusHistories": [{
                "id": 877001,
                "status": {
                    "id": 300,
                    "name": "Third wating confirm",
                    "frontendName": "Proceeding",
                    "multilingualKey": "com.qpp.cgp.domain.order.OrderStatus"
                },
                "customerNotified": false,
                "createdBy": "426792",
                "modifiedUser": {
                    "id": 426792,
                    "emailAddress": "felixchan@qpp.com",
                    "multilingualKey": "com.qpp.cgp.domain.dto.user.BaseUserDTO"
                },
                "createdDate": 1537183946000,
                "multilingualKey": "com.qpp.cgp.domain.dto.order.OrderStatusHistoryDTO"
            }],
            "deliveryPostcode": "111111",
            "shippingMethod": "中通",
            "deliveryTelephone": "26072207",
            "tax": 0,
            "totalIncTax": 10,
            "customerName": "smart lee",
            "shippingModuleCode": "ZT",
            "shipmentInfoHistories": [],
            "multilingualKey": "com.qpp.cgp.domain.dto.order.detail.DetailOrderDTO",
            "subtotalExTax": 10,
            "partner": {
                "id": 426791,
                "code": "CPB",
                "name": "CPB",
                "multilingualKey": "com.qpp.cgp.domain.dto.order.PartOrderDTO"
            },
            "isTest": true,
            "currencyValue": 1,
            "datePurchased": 1537183946000,
            "deliveryCountry": "China",
            "deliveryState": "gd",
            "paymentMethod": "Ntt",
            "deliveryName": "smart lee",
            "currencyCode": "CNY",
            "deliverySuburb": "sn",
            "status": {
                "id": 300,
                "name": "Third wating confirm",
                "frontendName": "Proceeding",
                "multilingualKey": "com.qpp.cgp.domain.order.OrderStatus"
            }
        }
    }
})
