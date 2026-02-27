/**
 * @author xiu
 * @date 2025/3/25
 */
Ext.define('CGP.customerordermanagement.model.CustomerordermanagementModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'int',
            useNull: true
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.common.color.RgbColor'
        },
        {
            name: 'partner',
            type: 'object',
        },
        {
            name: 'storeInfo',
            type: 'object',
        },
        {
            name: 'qpsonOrderInfos',
            type: 'array',
        },


        {
            name: 'partnerId', // partnerId
            type: 'string',
            convert: function (value, record) {
                var partner = record.get('partner')

                return partner ? partner['_id'] : '';
            }
        },
        {
            name: 'partnerEmail',// partnerEmail
            type: 'string',
            convert: function (value, record) {
                var partner = record.get('partner')

                return partner ? partner['email'] : '';
            }
        },


        {
            name: 'customerName',// 店铺名
            type: 'string',
            convert: function (value, record) {
                var storeInfo = record.get('storeInfo')

                return storeInfo ? storeInfo['storeName'] : '';
            }
        },
        {
            name: 'customerCode',// 店铺类型 [Popup,Shopify,Esty,API,Manual]
            type: 'string',
            convert: function (value, record) {
                var storeInfo = record.get('storeInfo')

                return storeInfo ? storeInfo['platformCode'] : '';
            }
        },
        {
            name: 'customerUrl',// 店铺类型 [Popup,Shopify,Esty,API,Manual]
            type: 'string',
            convert: function (value, record) {
                var storeInfo = record.get('storeInfo')

                return storeInfo ? storeInfo['storeUrl'] : '';
            }
        },
        {
            name: 'customerNameText',// 店铺名
            type: 'string',
            convert: function (value, record) {
                var customerName = record.get('customerName'),
                    customerCode = record.get('customerCode') ? `(${record.get('customerCode')})` : '';

                return `${customerName} ${customerCode} `;
            }
        },
        {
            name: 'bindOrderNumber',// 店铺订单号
            type: 'string',
        },
        {
            name: 'currency',//货币
            type: 'object',
        },
        {
            name: 'codeSymbol',//code符号
            type: 'string',
            convert: function (value, record) {
                var currency = record.get('currency');
                if (currency) {
                    var {code, symbolLeft} = currency;
                    return `${code}${symbolLeft}`;
                }
            }
        },
        {
            name: 'symbolLeft',//符号
            type: 'string',
            convert: function (value, record) {
                var currency = record.get('currency');

                return currency ? currency['symbolLeft'] : '';
            }
        },
        {
            name: 'storeOrderAmount',// 店铺金额
            type: 'string',
        },
        {
            name: 'storeOrderAmountText',//店铺金额文本
            type: 'string',
            convert: function (value, record) {
                var symbolLeft = record.get('symbolLeft'),
                    amount = +record.get('storeOrderAmount');
                /* if (amount){
                     amount = amount.toFixed(2);
                 }*/
                return `${symbolLeft} ${amount}`;
            }
        },
        {
            name: 'storeRetailOrderStatus',// 店铺状态
            type: 'object',
        },
        {
            name: 'customerStatus',// 店铺状态
            type: 'string',
            convert: function (value, record) {
                var storeRetailOrderStatus = record.get('storeRetailOrderStatus');

                return i18n.getKey(storeRetailOrderStatus ? storeRetailOrderStatus['name'] : '');
            }
        },
        {
            name: 'datePurchased',// 店铺订单下单时间
            type: 'number',
        },

        {
            name: 'emailAddress',// 收件人邮箱
            type: 'string',
        },


        // 下方还可用于api/orders/{orderId}/itemDetail的数据组合
        {
            name: 'deliveryAddress',// 收件人地址
            type: 'object',
        },
        {
            name: 'deliveryAddressText',
            type: 'string',
            convert: function (value, record) {
                var deliveryAddress = record.get('deliveryAddress'),
                    result = ''

                if (deliveryAddress) {
                    var {
                            countryCode2 = '',
                            countryName = '',
                            state = '',
                            city = '',
                            streetAddress1 = '',
                            streetAddress2 = '',
                            company = '',
                            firstName = '',
                            lastName = '',
                            telephone = '',
                            emailAddress = ''
                        } = deliveryAddress,
                        text = countryCode2 + countryName + state + city + streetAddress1 + streetAddress2 + company + firstName + lastName + telephone + emailAddress;


                    result = text ? `${countryName || countryCode2} ${state} ${city} <br>` +
                        `${streetAddress1} <br>` +
                        `${streetAddress2} ${company}<br>` +
                        `${firstName} ${lastName} ${telephone} ${emailAddress}` : '';
                }
                return result;
            }
        },
        {
            name: 'shippingMethod',
            type: 'string',
        },
        {
            name: 'billingAddress',
            type: 'object',
        },
        {
            name: 'billingAddressText',
            type: 'string',
            convert: function (value, record) {
                var billingAddress = record.get('billingAddress'),
                    result = ''
                if (billingAddress) {
                    var {
                            countryCode2 = '',
                            countryName = '',
                            state = '',
                            city = '',
                            streetAddress1 = '',
                            streetAddress2 = '',
                            company = '',
                            firstName = '',
                            lastName = '',
                            telephone = '',
                            emailAddress = ''
                        } = billingAddress,
                        text = countryCode2 + countryName + state + city + streetAddress1 + streetAddress2 + company + firstName + lastName + telephone + emailAddress;

                    result = text ? `${countryName || countryCode2} ${state} ${city} <br>` +
                        `${streetAddress1} <br>` +
                        `${streetAddress2} ${company}<br>` +
                        `${firstName} ${lastName} ${telephone} ${emailAddress}` : '';
                }
                return result;
            }
        },
        {
            name: 'billingAddressValue',
            type: 'string',
            convert: function (value, record) {
                var billingAddress = record.get('billingAddress'),
                    result = ''
                if (billingAddress) {
                    var {
                            countryCode2 = '',
                            countryName = '',
                            state = '',
                            city = '',
                            streetAddress1 = '',
                            streetAddress2 = '',
                            company = '',
                            firstName = '',
                            lastName = '',
                            telephone = '',
                            emailAddress = ''
                        } = billingAddress,
                        text = countryCode2 + countryName + state + city + streetAddress1 + streetAddress2 + company + firstName + lastName + telephone + emailAddress;

                    result = text ? `${countryName || countryCode2} ${state} ${city}` +
                        `${streetAddress1}` +
                        `${streetAddress2} ${company}<br>` +
                        `${firstName} ${lastName} ${telephone} ${emailAddress}` : '';
                }
                return result;
            }
        },
        {
            name: 'deliveryAddressValue',
            type: 'string',
            convert: function (value, record) {
                var deliveryAddress = record.get('deliveryAddress'),
                    result = ''

                if (deliveryAddress) {
                    var {
                            countryCode2 = '',
                            countryName = '',
                            state = '',
                            city = '',
                            streetAddress1 = '',
                            streetAddress2 = '',
                            company = '',
                            firstName = '',
                            lastName = '',
                            telephone = '',
                            emailAddress = ''
                        } = deliveryAddress,
                        text = countryCode2 + countryName + state + city + streetAddress1 + streetAddress2 + company + firstName + lastName + telephone + emailAddress;


                    result = text ? `${countryName || countryCode2} ${state} ${city}` +
                        `${streetAddress1}` +
                        `${streetAddress2} ${company}<br>` +
                        `${firstName} ${lastName} ${telephone} ${emailAddress}` : '';
                }
                return result;
            }
        },
        {
            name: 'totalWeight',
            type: 'string',
        },
        {
            name: 'items',
            type: 'array',
        },
        {
            name: 'shipmentRequirementId',
            type: 'number',
        }
    ],
})