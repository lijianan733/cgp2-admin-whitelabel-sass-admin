/**
 * @author xiu
 * @date 2025/2/24
 */
Ext.Loader.syncRequire([
    'CGP.profitmanagement.view.CreateSquareInfoComp',
])
Ext.define('CGP.profitmanagement.controller.Controller', {
    id: JSGetQueryString('id'),

    //修改
    editQuery: function (url, jsonData, isEdit, attributeVersionId) {
        var data = [],
            method = isEdit ? 'PUT' : 'POST',
            successMsg = method === 'POST' ? 'addsuccessful' : 'saveSuccess';

        JSAjaxRequest(url, method, false, jsonData, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText?.data?.content || responseText?.data;
                }
            }
        }, true, attributeVersionId);
        return data
    },

    //查询
    getQuery: function (url, attributeVersionId) {
        var data = [];

        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText?.data?.content || responseText?.data;
                }
            }
        }, false, attributeVersionId);
        return data;
    },

    //删除
    deleteQuery: function (url, store) {
        JSAjaxRequest(url, 'DELETE', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    store && store.load();
                }
            }
        }, true)
    },

    //获取url
    getUrl: function (author, params) {
        const id = params?.id;
        var urlGather = {
            mainUrl: 'api/colors',
            addPart: 'addPart',
            deletePart: 'deletePart',
            selectPart: 'selectPart' + id,
            deletePartGrid: 'deletePartGrid' + id
        }
        return adminPath + urlGather[author];
    },

    //异步修改存在加载动画
    asyncEditQuery: function (url, jsonData, isEdit, callFn, hideMsg, attributeVersionId, msg) {
        var method = isEdit ? 'PUT' : 'POST',
            successMsg = msg;

        if (!msg) {
            successMsg = method === 'POST' ? 'addsuccessful' : 'saveSuccess';
        }

        JSAjaxRequest(url, method, true, jsonData, !hideMsg && successMsg, callFn, true, attributeVersionId);
    },

    // 过滤属性版本的get请求
    getAttributeVersionQuery: function (url, attributeVersionId) {
        var data = [];

        JSAjaxRequestForAttributeVersion(url, 'GET', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText?.data?.content || responseText?.data;
                }
            }
        }, false, attributeVersionId);
        return data;
    },

    // 过滤属性版本的edit请求
    editAttributeVersionQuery: function (url, jsonData, isEdit, attributeVersionId) {
        var data = [],
            method = isEdit ? 'PUT' : 'POST',
            successMsg = method === 'POST' ? 'addsuccessful' : 'saveSuccess';

        JSAjaxRequestForAttributeVersion(url, method, false, jsonData, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText?.data?.content || responseText?.data;
                }
            }
        }, true, attributeVersionId);
        return data
    },

    // 过滤属性版本的edit请求
    asyncEditAttributeVersionQuery: function (url, jsonData, isEdit, callFn, hideMsg, attributeVersionId) {
        var method = isEdit ? 'PUT' : 'POST',
            successMsg = method === 'POST' ? 'addsuccessful' : 'saveSuccess';


        JSAjaxRequestForAttributeVersion(url, method, true, jsonData, !hideMsg && successMsg, callFn, true, attributeVersionId);
    },

    // 获取过滤栏样式
    getFiltersType: function (jsonData, isColumnsText) {
        var controller = this,
            result = [],
            newComboArray = [];

        jsonData.forEach(item => {
            var {text, type, name, comboArray, isLike, value, hidden} = item,
                filterTypeGather = {
                    // string
                    string: {
                        xtype: 'textfield',
                        isLike: !!isLike,
                        labelWidth: 120,
                    },
                    // number
                    number: {
                        xtype: 'numberfield',
                        isLike: !!isLike,
                        hideTrigger: true,
                        decimalPrecision: 12,
                    },
                    // 文本
                    text: {
                        xtype: 'textfield',
                        isLike: !!isLike,
                    },
                    // 时间
                    date: {
                        xtype: 'daterange',
                        style: 'margin-right:50px; margin-top : 0px',
                        width: 360,
                        isLike: true,
                        scope: true,
                        editable: false,
                        haveReset: true,
                        format: 'Y/m/d',
                        submitFormat: 'Y/m/d',
                        valueType: 'formatDateTime'
                    },
                    // 月份
                    month: {
                        xtype: 'datefield',
                        style: 'margin-right:50px; margin-top : 0px;',
                        scope: true,
                        width: 360,
                        editable: false,
                        format: 'Y/m'
                    },
                    // 货币
                    currency: {
                        xtype: 'combo',
                        haveReset: true,
                        store: Ext.create('CGP.currency.store.Currency', {
                            params: {
                                filter: Ext.JSON.encode([
                                    {
                                        name: 'website.id',
                                        type: 'number',
                                        value: 11
                                    },
                                ])
                            },
                            pageSize: 1000,
                            autoLoad: false
                        }),
                        displayField: 'code',
                        valueField: 'code',
                    },
                    // 地区
                    state: {
                        xtype: 'combo',
                        haveReset: true,
                        store: Ext.create('CGP.zone.store.Zone', {
                            pageSize: 1000,
                            autoLoad: false
                        }),
                        displayField: 'name',
                        valueField: 'name',
                    },
                    /*// 国家
                    country: {
                        xtype: 'combo',
                        haveReset: true,
                        fieldLabel: i18n.getKey(text),
                        name: name || text,
                        itemId: name || text,
                        store: CountryStore,
                        displayField: 'name',
                        valueField: 'name',
                    },*/
                    // 类型选项
                    combo: {
                        xtype: 'combo',
                        haveReset: true,
                        isLike: !!isLike,
                        store: Ext.create('Ext.data.Store', {
                            fields: ['value', 'display'],
                            data: newComboArray,
                            autoLoad: false
                        }),
                        valueField: 'value',
                        displayField: 'display',
                    },
                    // 出货方式
                    shippingMethod: {
                        xtype: 'combo',
                        haveReset: true,
                        store: Ext.create('CGP.deliveryorder.store.ShippingMethodStore', {
                            pageSize: 1000,
                            autoLoad: false
                        }),
                        displayField: 'name',
                        valueField: 'name',
                    },
                };

            result.push(Ext.Object.merge(filterTypeGather[type || 'text'], {
                name: name || text,
                itemId: name || text,
                value: value,
                hidden: hidden,
                fieldLabel: i18n.getKey(text),
            }));
        })

        return result;
    },

    getTimestampFromDateString: function (params, resultType) {
        var {date, type} = params,
            controller = this,
            // 根据传入的时间类型选择不同的方法转换为最易处理的时间戳
            typeGather = {
                beijingTime: new Date(date).getTime(),
                timestamp: date,
                formatDateTime: new Date(date).getTime()
            },
            timestampValue = typeGather[type],
            // 根据想要的结果类型返回结果时间
            dateGather = {
                // 转换为东八区时间
                beijingTime: function () {
                    const startDate = new Date(timestampValue);
                    startDate.setHours(startDate.getHours() + 8);
                    return startDate.toISOString().split('.')[0] + '+08:00';
                },
                // 转为时间戳
                timestamp: function () {
                    return timestampValue;
                },
                // 转为显示时间
                formatDateTime: function () {
                    return Ext.Date.format(new Date(timestampValue), 'Y-m-d G:i:s');
                },
            }

        return date ? dateGather[resultType]() : '';
    },

    getColumnsType: function (jsonData) {
        var controller = this,
            result = [];

        jsonData.forEach(item => {
            var {text, type, name, isSortable, renderer, clickHandler, width} = item,
                commonConfig = {
                    text: i18n.getKey(text),
                    dataIndex: name,
                    sortParam: name,
                    name: name,
                    flex: width ? 0 : 1,
                    width: width,
                    height: 40,
                    align: 'center',
                    sortable: !!isSortable,
                },
                typeGather = {
                    string: {
                        renderer: function (value, metaData, record) {
                            var newText = value;

                            /*  if (value === 'null' || !value || value === '0') {
                                  newText = '';
                              }*/

                            metaData.tdAttr = 'data-qtip="' + value + '"';

                            renderer && (newText = renderer(value, metaData, record))

                            return JSAutoWordWrapStr(i18n.getKey(newText));
                        }
                    },
                    date: {
                        renderer: function (value, metaData, record) {
                            var result = controller.getTimestampFromDateString({
                                date: value,
                                type: 'beijingTime'
                            }, 'formatDateTime');

                            renderer && (result = renderer(value, metaData, record));

                            return i18n.getKey(result);
                        }
                    },
                    link: {
                        xtype: 'atagcolumn',
                        getDisplayName: function (value, metaData, record) {
                            metaData.tdAttr = 'data-qtip="' + `跳转至${name}页` + '"';
                            var result = JSCreateHyperLink(value);

                            renderer && (result = renderer(value, metaData, record))
                            return result;
                        },
                        clickHandler: function (value, metadata, record) {
                            clickHandler(value, metadata, record)
                        }
                    },
                    container: {
                        xtype: 'componentcolumn',
                        renderer: function (v, m, r, row, col, store, view) {
                            return renderer(v, m, r, row, col, store, view)
                        }
                    }
                },
                column = Ext.Object.merge(commonConfig, typeGather[type]);

            result.push(column);
        })

        return result;
    },

    // 获取计算年月
    getLastNowYearMonth: function (year, month, addMonthNum) {
        var newMonth = month + addMonthNum;
        if (newMonth > 12) {
            year = year + 1;
            newMonth = newMonth - 12;
        }
        if (newMonth < 0) {
            year = year - 1;
            newMonth = newMonth + 12;
        }

        if (newMonth === 0) {
            year = year - 1;
            newMonth = newMonth + 12;
        }

        if (newMonth < 10) {
            newMonth = `0${newMonth}`;
        }

        return {
            year: year,
            month: newMonth,
        }
    },

    // 获取结算Partner信息
    getPartnerSquaredInfo: function (params) {
        var controller = this,
            {year, month, partnerId} = params,
            url = adminPath + `api/${year}/${month}/${partnerId}/settle-info`,
            getData = controller.getQuery(url),
            /*getData = {
                partnerId: '133829',
                partnerEmail: '182244688',
                settleDate: '2025-2',
                amount: 10000,
                waitTransferBalance: 1000,
                currency: {
                    code: 'USD',
                    symbolLeft: '$'
                },
                payeeAccount: '5514151',
                payeeName: '15166666',
                currencyCode: 'USD',
                paymentMethod: 'AirWallex',
                transaction: '12222222222'
            },*/
            defaultsValue = {
                currencyCode: 'USD',
                paymentMethod: 'AirWallex',
                transaction: ''
            },
            result = Ext.Object.merge(defaultsValue, getData)

        return result;
    },

    // 转换货币金额
    changeCurrencyAmount: function (params) {
        var controller = this,
            {inCurrency, outCurrency, amount} = params,
            url = adminPath + `api/currencies/exchange`,
            postData = {
                sourceCurrency: inCurrency,
                targetCurrency: outCurrency,
                amount: amount
            },
            result = 0;


        JSAjaxRequest(url, 'POST', false, postData, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    result = responseText.data;
                }
            }
        }, true);


        return result;
    },

    // 获取当前年月
    getCurrentYearAndMonth: function () {
        const date = new Date(),
            year = date.getFullYear(), // 获取当前年份
            month = date.getMonth() + 1; // 获取当前月份，范围是 1-12
        return {
            nowYear: year,
            nowMonth: month
        };
    },

    // 获取平台支持货币
    getSupportCurrencyCode: function () {
        var controller = this,
            websiteType = !JSWebsiteIsStage() ? 'Stage' : 'Product',
            url = adminPath + 'api/platform/v2?page=1&limit=25',
            platforms = controller.getQuery(url),
            defaultsPlatformId = platforms.filter(item => {
                var {name, mode} = item;
                if (websiteType === 'Product') {
                    websiteType = 'Production'
                }
                if (mode === websiteType && name === 'QPMN') {
                    return item;
                }
            })[0]['id'],
            platformUrl = adminPath + `api/platformCurrencySettings/platform/${defaultsPlatformId}`,
            defaultsPlatform = controller.getQuery(platformUrl),
            {currencyUsageScopes} = defaultsPlatform,
            defaultsCurrency = [];

        currencyUsageScopes.forEach(item => {
            var {scope, currencies} = item;

            if (scope === 'Frontend') { //Frontend平台货币 EShop货币
                defaultsCurrency = currencies;
            }
        })

        return defaultsCurrency;
    },

    // partner结算窗口
    createPartnerSquaredWindow: function (params, callBack) {
        var controller = this,
            {year, month, partnerId} = params,
            supportCurrency = controller.getSupportCurrencyCode(),
            partnerInfo = controller.getPartnerSquaredInfo(params),
            serviceChargePercent = 0.03; //手续费百分比

        Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            title: i18n.getKey('Partner结算'),
            width: 500,
            height: 700,
            items: [
                {
                    xtype: 'errorstrickform',
                    itemId: 'form',
                    defaults: {
                        margin: '10 25 5 25',
                        labelAlign: 'top',
                        width: 240
                    },
                    layout: 'vbox',
                    allowBlank: true,
                    items: [
                        {
                            xtype: 'create_square_info_comp',
                            itemId: 'squareInfo',
                            name: 'squareInfo',
                            width: '100%',
                        },
                        {
                            xtype: 'combo',
                            fieldLabel: i18n.getKey('转账货币'),
                            itemId: 'currencyCode',
                            name: 'currencyCode',
                            editable: false,
                            allowBlank: false,
                            store: Ext.create('Ext.data.Store', {
                                fields: ['title', "code"],
                                data: supportCurrency
                            }),
                            displayField: 'title',
                            valueField: 'code',
                            queryMode: 'local',
                            listeners: {
                                change: function (field, newValue, oldValue) {
                                    var form = field.ownerCt,
                                        amountComp = form.getComponent('amount'),
                                        amount = amountComp.getValue(),
                                        params = {
                                            inCurrency: oldValue,
                                            outCurrency: newValue,
                                            amount: amount
                                        };

                                    // 转换金额
                                    if (amount) {
                                        if (amountComp.isValid()) {
                                            var result = controller.changeCurrencyAmount(params);

                                            amountComp.setMaxValue(+result);
                                            amountComp.validate();
                                            amountComp.setValue(result);
                                        }
                                }
                            }
                        }
                },
                {
                    xtype: 'numberfield',
                    itemId: 'amount',
                    name: 'amount',
                    allowBlank: false,
                    hideTrigger: true,
                    // minValue: 0,
                    maxValue: partnerInfo['waitTransferBalance'],
                    fieldLabel: i18n.getKey('结算金额'),
                    tipInfo: '扣除手续费前的金额!',
                    listeners: {
                        change: function (field, newValue, oldValue) {
                            var form = field.ownerCt,
                                serviceChargeComp = form.getComponent('serviceCharge'),
                                transferAmountComp = form.getComponent('transferAmount');

                            if (newValue) {
                                //保留两位小数
                                var serviceCharge = newValue * serviceChargePercent,
                                    newServiceCharge = parseFloat(serviceCharge.toFixed(2));

                                serviceChargeComp.setValue(newServiceCharge);
                                transferAmountComp.setValue(newValue - newServiceCharge);
                            }
                        }
                    }
                },
                {
                    xtype: 'numberfield',
                    itemId: 'serviceCharge',
                    name: 'serviceCharge',
                    fieldLabel: i18n.getKey('手续费'),
                    readOnly: true,
                    isFilterComp: true,
                    fieldStyle: 'background-color:silver',
                    tipInfo: `结算金额的${serviceChargePercent * 100}%,保留两位小数!`,
                },
                {
                    xtype: 'numberfield',
                    itemId: 'transferAmount',
                    name: 'transferAmount',
                    fieldLabel: i18n.getKey('转账金额'),
                    readOnly: true,
                    isFilterComp: true,
                    fieldStyle: 'background-color:silver',
                    tipInfo: '扣除手续费后,实际收到金额!',
                },
                {
                    xtype: 'fieldcontainer',
                    itemId: 'paymentMethod',
                    name: 'paymentMethod',
                    layout: 'hbox',
                    margin: 0,
                    width: '100%',
                    defaults: {
                        margin: '10 5 5 25',
                        labelAlign: 'top',
                        width: 240
                    },
                    diySetValue: function (data) {
                        var me = this,
                            paymentMethod = me.getComponent('paymentMethod');

                        paymentMethod.setValue(data['paymentMethod']);
                    },
                    diyGetValue: function () {
                        var me = this,
                            paymentMethod = me.getComponent('paymentMethod');

                        return paymentMethod.getValue();
                    },
                    items: [
                        {
                            xtype: 'combo',
                            fieldLabel: i18n.getKey('转账方式'),
                            itemId: 'paymentMethod',
                            name: 'paymentMethod',
                            editable: false,
                            allowBlank: false,
                            store: Ext.create('Ext.data.Store', {
                                fields: ['key', "value"],
                                data: [
                                    {
                                        key: 'AirWallex账号转账',
                                        value: 'AirWallex'
                                    },
                                    {
                                        key: '银行账号转账',
                                        value: 'BankTransfer'
                                    },
                                ]
                            }),
                            displayField: 'key',
                            valueField: 'value',
                            queryMode: 'local',
                            listeners: {
                                change: function (field, newValue, oldValue) {
                                    var filedContainer = field.ownerCt,
                                        openWebsiteBtn = filedContainer.getComponent('openWebsiteBtn'),
                                        valueGather = {
                                            AirWallex: function () {
                                                openWebsiteBtn.setVisible(true);
                                            },
                                            BankTransfer: function () {
                                                openWebsiteBtn.setVisible(false);
                                            }
                                        }

                                    valueGather[newValue]();
                                }
                            }
                        },
                        {
                            xtype: 'button',
                            text: i18n.getKey('打开付款网站'),
                            width: 100,
                            margin: '30 0 5 5',
                            itemId: 'openWebsiteBtn',
                            isFormField: false,
                            handler: function (btn) {
                                window.open('https://www.airwallex.com/spend-management/bill-pay');
                            }
                        }
                    ]
                },
                {
                    xtype: 'textfield',
                    itemId: 'payeeAccount', //要改 payeeAccount
                    name: 'payeeAccount',
                    fieldLabel: i18n.getKey('收款人帐号'),
                    readOnly: true,
                    fieldStyle: 'background-color:silver',
                },
                {
                    xtype: 'textfield',
                    itemId: 'payeeName', //要改 payeeName
                    name: 'payeeName',
                    fieldLabel: i18n.getKey('收款人名称'),
                    readOnly: true,
                    fieldStyle: 'background-color:silver',
                },
                {
                    xtype: 'textfield',
                    itemId: 'transaction',
                    name: 'transaction',
                    allowBlank: false,
                    fieldLabel: i18n.getKey('交易号(付款网关的交易号/银行帐号)'),
                },
            ],
        },
    ],
        diySetValue: function (data) {
            if (data) {
                var me = this,
                    form = me.getComponent('form'),
                    items = form.items.items;

                items.forEach(item => {
                    var {name, isFilterComp} = item,
                        result = data[name];

                    if (!isFilterComp) {
                        if (['amount'].includes(name)) {
                            item.setValue(data['waitTransferBalance']);
                        } else {
                            item.diySetValue ? item.diySetValue(data) : item.setValue(result);
                        }
                    }
                })
            }
        }
    ,
        listeners: {
            afterrender: function (comp) {
                partnerInfo && comp.diySetValue(partnerInfo);
            }
        }
    ,
        bbar: {
            xtype: 'bottomtoolbar',
                saveBtnCfg
        :
            {
                handler: function (btn) {
                    var win = btn.ownerCt.ownerCt,
                        url = adminPath + `api/${year}/${month}/${partnerId}/settle`,
                        form = win.getComponent('form'),
                        formData = form.getValues(),
                        result = formData;

                    result['currency'] = formData['currencyCode'];

                    if (form.isValid()) {
                        console.log(formData);
                        controller.asyncEditQuery(url, formData, false, function (require, success, response) {
                            if (success) {
                                var responseText = Ext.JSON.decode(response.responseText);
                                if (responseText.success) {
                                    Ext.Msg.alert('提示', '结算完成!', function () {
                                        callBack && callBack();
                                        win.close();
                                    })
                                }
                            }
                        })
                    }
                }
            }
        }
    ,
    }).show();
},

// 转结余窗口
createMoveProfitWindow: function (record, callBack) {
    var controller = this,
        partnerId = record.get('partnerId'),
        year = record.get('year'),
        month = record.get('month');

    Ext.create('Ext.window.Window', {
        layout: 'fit',
        modal: true,
        constrain: true,
        title: i18n.getKey('盈余转结确认'),
        width: 600,
        height: 220,
        items: [
            {
                xtype: 'errorstrickform',
                itemId: 'form',
                defaults: {
                    margin: '10 25 5 25',
                    labelAlign: 'top',
                },
                layout: 'vbox',
                items: [
                    {
                        xtype: 'create_square_info_comp',
                        name: 'square_info',
                        itemId: 'square_info',
                        width: '100%'
                    },
                    {
                        xtype: 'displayfield',
                        name: 'text',
                        itemId: 'text',
                        width: '100%',
                        diySetValue: function (data) {
                            if (data) {
                                var me = this,
                                    {waitTransferBalanceText} = data,
                                    {nowYear, nowMonth} = controller.getCurrentYearAndMonth(),
                                    {year, month} = controller.getLastNowYearMonth(nowYear, nowMonth, 0);

                                me.setValue(`是否确认将未结清的 ${JSCreateFont('green', true, `${waitTransferBalanceText}`)} 盈余，转到以下月份(${year} - ${month})?`)
                            }
                        },
                    },
                ],
            },
        ],
        diySetValue: function (data) {
            if (data) {
                var me = this,
                    form = me.getComponent('form'),
                    items = form.items.items;

                items.forEach(item => {
                    var {name} = item,
                        result = data[name];

                    item.diySetValue ? item.diySetValue(data) : item.setValue(result);
                })
            }
        },
        listeners: {
            afterrender: function (comp) {
                record && comp.diySetValue(record.data);
            }
        },
        bbar: {
            xtype: 'bottomtoolbar',
            saveBtnCfg: {
                handler: function (btn) {
                    var win = btn.ownerCt.ownerCt,
                        url = adminPath + `api/${year}/${month}/${partnerId}/rebalance`,
                        form = win.getComponent('form'),
                        result = {
                            year: year,
                            month: month,
                            partnerId: partnerId,
                        }

                    if (form.isValid()) {
                        controller.asyncEditQuery(url, result, false, function (require, success, response) {
                            if (success) {
                                var responseText = Ext.JSON.decode(response.responseText);
                                if (responseText.success) {
                                    Ext.Msg.alert('提示', '盈余转结成功!', function () {
                                        callBack && callBack();
                                        win.close();
                                    })
                                }
                            }
                        })
                    }
                }
            }
        },
    }).show();
}
,

// 切换partner窗口
createChangePartnerWindow: function (partner, callBack) {
    var controller = this,
        {config, test} = Ext.create('CGP.profitmanagement.defaults.OnlineshopmanagementDefaults'),
        {query_partner_window} = config,
        store = Ext.create('CGP.profitmanagement.store.CreateQueryPartnerWindowStore'),
        {columnsText, filtersText} = query_partner_window,
        columns = controller.getColumnsType(columnsText),
        filters = controller.getFiltersType(filtersText);

    Ext.create('Ext.window.Window', {
        layout: 'fit',
        modal: true,
        constrain: true,
        title: i18n.getKey('更换Partner'),
        width: 1000,
        height: 500,
        items: [
            {
                xtype: 'searchcontainer',
                itemId: 'grid',
                width: '100%',
                gridCfg: {
                    store: store,
                    selModel: {
                        selType: 'rowmodel',
                    },
                    deleteAction: false,
                    editAction: false,
                    customPaging: [
                        {value: 25},
                        {value: 50},
                        {value: 75},
                        {value: 150},
                    ],
                    columns: columns,
                },
                filterCfg: {
                    header: false,
                    items: filters
                }
            }
        ],
        bbar: {
            xtype: 'bottomtoolbar',
            saveBtnCfg: {
                handler: function (btn) {
                    var win = btn.ownerCt.ownerCt,
                        searchContainer = win.getComponent('grid'),
                        selectedData = searchContainer.grid.getSelectionModel().getSelection();

                    if (selectedData.length) {
                        callBack && callBack(selectedData);
                        win.close();
                    } else {
                        Ext.Msg.alert('提示', '请选择一条数据!');
                    }
                }
            }
        },
    }).show();
}
,

// 获取partner限制信息
getPartnerLimitationData: function (partnerId) {
    var result = {},
        controller = this,
        url = adminPath + `api/partner/popup/store/limitation/partners/${partnerId}`;

    try {
        result = controller.getQuery(url);

        if (!result) {
            Ext.Msg.alert('提示', '为获取到partner限制信息!');
        }
    } catch (e) {
        Ext.Msg.alert('提示', '为获取到partner限制信息!');
    }

    return result;
}
,

})