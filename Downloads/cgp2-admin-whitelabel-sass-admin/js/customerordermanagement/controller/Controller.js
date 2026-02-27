/**
 * @author xiu
 * @date 2025/3/25
 */
Ext.Loader.syncRequire([
    'CGP.customerordermanagement.model.CustomerordermanagementModel'
])
Ext.define('CGP.customerordermanagement.controller.Controller', {
    compGather: {
        '标题项': 'Ext.ux.form.field.CreateTitleItem',
        'window下一步功能': 'Ext.ux.form.field.CreateNextStepWindow',
        'combo切换模板功能': 'Ext.ux.form.field.CreateChangeCombo',
        '范围输入框': 'Ext.ux.form.field.MinMaxField',
        '拉取中组件': 'Ext.ux.form.field.CreateLoadingComp',
    },

    //修改
    editQuery: function (url, jsonData, isEdit, otherConfig) {
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
        }, true, otherConfig);
        return data
    },

    //查询
    getQuery: function (url, otherConfig) {
        var data = [];

        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText?.data?.content || responseText?.data;
                }
            }
        }, false, otherConfig);
        return data;
    },

    //删除
    deleteQuery: function (url, callBack, otherConfig) {
        JSAjaxRequest(url, 'DELETE', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    callBack && callBack();
                }
            }
        }, true, otherConfig)
    },

    //异步修改存在加载动画
    asyncEditQuery: function (url, jsonData, isEdit, callFn, hideMsg, otherConfig) {
        var method = isEdit ? 'PUT' : 'POST',
            successMsg = method === 'POST' ? 'addsuccessful' : 'saveSuccess';

        JSAjaxRequest(url, method, true, jsonData, !hideMsg && successMsg, callFn, true, otherConfig);
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
    asyncEditAttributeVersionQuery: function (url, jsonData, isEdit, callFn, hideMsg, attributeVersionId) {
        var method = isEdit ? 'PUT' : 'POST',
            successMsg = method === 'POST' ? 'addsuccessful' : 'saveSuccess';

        JSAjaxRequestForAttributeVersion(url, method, true, jsonData, !hideMsg && successMsg, callFn, true, attributeVersionId);
    },

    // 创建form窗口
    createFormWindow: function (data, callBack) {
        var controller = this,
            id = data.id,
            isEdit = !!data;

        return Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            title: i18n.getKey('xxxx'),
            width: 800,
            height: 400,
            items: [
                {
                    xtype: 'errorstrickform',
                    itemId: 'form',
                    defaults: {
                        margin: '10 25 5 25',
                        allowBlank: true
                    },
                    layout: 'vbox',
                    diyGetValue: function () {
                        var me = this,
                            result = {},
                            items = me.items.items;
                        items.forEach(item => {
                            var name = item['name'];
                            result[name] = item.diyGetValue ? item.diyGetValue() : item.getValue()
                        })
                        return result;
                    },
                    diySetValue: function (data) {
                        var me = this,
                            items = me.items.items;
                        items.forEach(item => {
                            var {name} = item;
                            item.diySetValue ? item.diySetValue(data[name]) : item.setValue(data[name])
                        })
                    },
                    items: [],
                    listeners: {
                        afterrender: function (comp) {
                            data && comp.diySetValue(data);
                        }
                    }
                },
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt,
                            suffixUrl = isEdit ? '' : 'api/smtManufactureCenterSelectConfigs',
                            url = adminPath + suffixUrl,
                            form = win.getComponent('form'),
                            formData = form.diyGetValue(),
                            result = {};


                        if (form.isValid()) {
                            console.log(formData);
                            controller.asyncEditQuery(url, result, isEdit, function (require, success, response) {
                                if (success) {
                                    var responseText = Ext.JSON.decode(response.responseText);
                                    if (responseText.success) {
                                        callBack && callBack(responseText.data);
                                        win.close();
                                    }
                                }
                            })
                        }
                    }
                }
            },
        }).show();
    },

    // 创建grid窗口
    createGridWindow: function (store, callBack) {
        var controller = this
        return Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            title: i18n.getKey('xxxx'),
            width: 800,
            height: 400,
            items: [
                {
                    xtype: 'searchcontainer',
                    name: 'searchcontainer',
                    itemId: 'searchcontainer',
                    filterCfg: {
                        height: 60,
                        layout: {
                            type: 'table',
                            columns: 2
                        },
                        defaults: {
                            isLike: false
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                name: '_id',
                                itemId: 'id',
                                fieldLabel: i18n.getKey('id'),
                            },
                            {
                                xtype: 'textfield',
                                name: 'name',
                                itemId: 'name',
                                fieldLabel: i18n.getKey('name'),
                            },
                            {
                                xtype: 'textfield',
                                name: 'displayName',
                                fieldLabel: i18n.getKey('displayName'),
                                itemId: 'displayName'
                            },
                        ]
                    },
                    gridCfg: {
                        editAction: true,
                        deleteAction: true,
                        store: store,
                        columnDefaults: {
                            tdCls: 'vertical-middle',
                            align: 'center',
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip ="' + value + '"';
                                return value
                            }
                        },
                        editActionHandler: function (grid, rowIndex, colIndex) {

                        },
                        deleteActionHandler: function (view, colInde, rowInde, el, event, record, dom) {

                        },
                        tbar: [
                            {
                                text: i18n.getKey('add'),
                                iconCls: 'icon_add',
                                handler: function (btn) {

                                }
                            },
                            {
                                text: i18n.getKey('delete'),
                                iconCls: 'icon_delete',
                                handler: function (btn) {

                                }
                            }
                        ],
                        columns: [
                            {
                                text: i18n.getKey('id'),
                                dataIndex: '_id',
                                width: 180,
                                tdCls: 'vertical-middle',
                                itemId: 'id',
                                sortable: true
                            },
                            {
                                text: i18n.getKey('name'),
                                dataIndex: 'name',
                                width: 180,
                                itemId: 'name',
                            },
                            {
                                text: i18n.getKey('displayName'),
                                dataIndex: 'displayName',
                                flex: 1,
                                itemId: 'displayName',
                            },
                        ]
                    }
                }
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt,
                            suffixUrl = 'api/smtManufactureCenterSelectConfigs',
                            url = adminPath + suffixUrl,
                            searchcontainer = win.getComponent('searchcontainer'),
                            selected = searchcontainer.grid.getSelectionModel().getSelection(),
                            result = {};

                        if (selected?.length) {
                            controller.asyncEditQuery(url, result, false, function (require, success, response) {
                                if (success) {
                                    var responseText = Ext.JSON.decode(response.responseText);
                                    if (responseText.success) {
                                        callBack && callBack(responseText.data);
                                        win.close();
                                    }
                                }
                            })
                        } else {
                            Ext.Msg.alert('提示', '请至少选择一条数据!')
                        }
                    }
                }
            },
        }).show();
    },

    // 接收iframe信息 用于tab点击时会传递点击回调{type: 'selected',args: true}
    getIframeInfoFn: function (message, callBack, overTime) {
        // 设置加载超时处理
        var loadTime = setTimeout(() => {
            JSSetLoading(false);
            Ext.Msg.alert('提示', message, function () {
                location.reload();
            });
        }, overTime)

        window.addEventListener('message', function (e) {
            try {
                // 清理超时定时器
                callBack && callBack(e, loadTime);
            } catch (error) {
                console.log(error);
            }
        });
    },

    //获取过滤key value后的对象
    getFilteredValues: function (filters, data) {
        var result = new Set(); // 使用 Set 来存储唯一值

        data.forEach(item => {
            filters.forEach(filterItem => {
                var {name, value, type, operator} = filterItem,
                    isExactMatch = operator === 'exactMatch',
                    isValue = item[name] === value,
                    isType = (typeof item[name]) === type;

                // 根据是否开启精确匹配或模糊匹配来判断
                if (isExactMatch) {
                    isValue = item[name] === value; // 精确匹配
                } else {
                    if (typeof item[name] === 'string') {
                        isValue = item[name].includes(value); // 模糊匹配
                    } else {
                        isValue = item[name] === value; // 精确匹配
                    }
                }

                if (isValue && isType) {
                    result.add(JSON.stringify(item)); // 使用 JSON.stringify 保证对象唯一性
                }
            })
        })

        // 将 Set 转换回数组并解析 JSON 字符串
        return Array.from(result).map(item => JSON.parse(item));
    },

    getTime: function (time) {
        const date = new Date(time);
        const dateString = date.toISOString();
        return dateString.replace('Z', '+08:00');
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

    // 获取过滤栏样式
    getFiltersType: function (jsonData, isColumnsText) {
        var controller = this,
            result = [];

        jsonData.forEach(item => {
            var {text, type, name, comboArray, isLike, value, hidden} = item,
                newComboArray = comboArray?.map(item => {
                    return {
                        value: item,
                        display: i18n.getKey(item)
                    };
                }),
                filterTypeGather = {
                    // string
                    string: {
                        xtype: 'textfield',
                        isLike: !!isLike,
                        // labelWidth: 120,
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

    // 获取对应状态的对应图片
    getStatusImage: function (imageUrl, status) {
        var controller = this,
            statusGather = {
                SUCCESS: {
                    image: imageUrl,
                    data_qtip: '查看图片',
                },
                FAILURE: {
                    image: path + 'js/order/view/orderlineitem/image/FAILURE.jpg',
                    data_qtip: '图片生成失败',
                },
                INIT: {
                    image: imageUrl,
                    data_qtip: '查看图片',
                },
                RUNNING: {
                    image: path + 'js/order/view/orderlineitem/image/WAITING.gif',
                    data_qtip: '图片正在生成中',
                },
                NULL: {
                    image: path + 'js/order/view/orderlineitem/image/NULL.jpg',
                    data_qtip: '图片为空',
                }
            }

        return statusGather[status || 'SUCCESS']
    },

    // 获取单元格样式
    getColumnsType: function (jsonData) {
        var controller = this,
            result = []

        jsonData.forEach(item => {
            var {
                    text,
                    type,
                    name,
                    align,
                    width,
                    renderer,
                    severPath, //image类型时 图片用到的服务器
                    isSortable,
                    clickHandler,
                } = item,
                commonConfig = {
                    text: i18n.getKey(text),
                    dataIndex: name,
                    sortParam: name,
                    name: name,
                    flex: width ? 0 : 1,
                    width: width,
                    height: 40,
                    align: align || 'center',
                    minWidth: 130,
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

                            return i18n.getKey(newText);
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
                    image: { //model准备两个字段 [productInstanceThumbnail,thumbnailStatus]
                        xtype: 'imagecolumn',
                        align: 'center',
                        tdCls: 'vertical-middle',
                        buildUrl: function (value, metadata, record) {
                            return severPath + value;
                        },
                        buildPreUrl: function (value, metadata, record) {
                            var result = severPath + value,
                                thumbnailStatus = record.get('thumbnailStatus'),
                                {image, data_qtip} = controller.getStatusImage(result, thumbnailStatus);

                            metadata.style = 'text-align: left;'
                            metadata.tdAttr = "data-qtip='<div>" + data_qtip + "</div>'";
                            if (data_qtip !== '查看图片') {
                                metadata.css = 'no-click-event'; // 添加自定义 CSS 类
                            }

                            return image;
                        },
                        buildTitle: function (value, metadata, record) {
                            return `${i18n.getKey('check')} < ${value} > 预览图`;
                        },
                    },
                    container: {
                        xtype: 'componentcolumn',
                        renderer: function (v, m, r, row, col, store, view) {
                            return renderer(v, m, r, row, col, store, view)
                        }
                    },
                },
                column = Ext.Object.merge(commonConfig, typeGather[type]);

            result.push(column);
        })

        return result;
    },

    getText: function (color, text, fontSize) {
        var value = i18n.getKey(text)

        return JSCreateFont(color, true, value, fontSize)
    },

    cancelCustomerOrderFn: function (orderId, callBack) {
        var controller = this,
            url = adminPath + `api/store/orders/${orderId}/popup/cancel`;

        controller.asyncEditQuery(url, null, true, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    const data = responseText.data,
                        msg = data ? '取消成功' : '取消失败';

                    Ext.Msg.alert('提示', msg);
                    callBack && callBack(data);
                }
            }
        }, true)
    },

    deleteCustomerOrderFn: function (orderId, callBack) {
        var controller = this,
            url = adminPath + `api/background/store/orders/${orderId}`;

        controller.deleteQuery(url, callBack);
    },

    getCustomerOrderData: function (orderId, callBack) {
        var controller = this,
            url = adminPath + `api/background/store/orders/${orderId}`,
            data = controller.getQuery(url),
            /*data = {
                "_id": 252172872,
                "partner": {
                    "_id": 40881768,
                    "name": "googletest",
                    "email": "levilee@qpp.com"
                },
                "storeInfo": {
                    "storeId": "229044379",
                    "storeName": "levitest8",
                    "platformId": "21858392",
                    "platformName": "PopUp",
                    "platformCode": "PopUp",
                    "storeUrl": "https://test-stage-qpmarkets.qppdev.com/levitest8"
                },
                "bindOrderNumber": "121",
                "storeOrderAmount": "HK$62.90",
                "currency": {
                    "id": 969634,
                    "clazz": "com.qpp.cgp.domain.common.Currency",
                    "modifiedDate": 1736235756482,
                    "modifiedBy": "2231538",
                    "code": "HKD",
                    "title": "Hong Kong Dollar",
                    "symbolLeft": "HK$",
                    "symbolRight": "",
                    "decimalPoint": ".",
                    "thousandsPoint": ",",
                    "decimalPlaces": "2",
                    "value": 0.12739,
                    "website": {
                        "id": 11,
                        "clazz": "com.qpp.cgp.domain.common.Website",
                        "modifiedDate": 1736235756482
                    },
                    "symbol": "HK$"
                },
                "storeRetailOrderStatus": {
                    "_id": 21394971,
                    "clazz": "com.qpp.cgp.domain.partner.store.order.StoreRetailOrderStatus",
                    "createdDate": 1680746255824,
                    "createdBy": "23846207",
                    "modifiedDate": 1680746255828,
                    "platformId": "21858392",
                    "platformName": "WooCommerce",
                    "name": "cancelled",
                    "isDefault": false
                },
                "datePurchased": 1744115814739,
                "qpsonOrderInfos": [
                    {
                        "_id": "252172924",
                        "orderNumber": "TM2504080062",
                        "status": {
                            "id": 107,
                            "clazz": "com.qpp.cgp.domain.order.OrderStatus",
                            "modifiedDate": 1675329896082,
                            "modifiedBy": "140800",
                            "name": "Deliveryed",
                            "frontendName": "Deliveryed",
                            "fontSort": 17
                        }
                    }
                ],
                "emailAddress": "levilee@qpp.com",
                "deliveryAddress": {
                    "modifiedDate": 1744116629192,
                    "countryCode2": "US",
                    "stateCode": "NJ",
                    "state": "New Jersey",
                    "city": "Atlantic City",
                    "streetAddress1": "1301 Bacharach Boulevard Atlantic City NJ 08401 United States",
                    "streetAddress2": "",
                    "postcode": "08401",
                    "firstName": "xixi",
                    "lastName": "leetestwoo",
                    "telephone": "16666666666",
                    "emailAddress": "levilee@qpp.com",
                    "company": "test01",
                    "sortOrder": 1
                },
                "totalWeight": '135g'
            },*/
            result = new CGP.customerordermanagement.model.CustomerordermanagementModel(data)

        if (data) {
            callBack && callBack(result);
        } else {
            Ext.Msg.alert('提示', '未查询到店铺订单数据!');
        }

        return result
    },

    getBuilderUrl: function (productInstanceId) {
        var newUrl = '';
        var data = null,
            platform = 'PC',
            token_type = 'bearer',
            type = 'userPreview',
            access_token = Ext.util.Cookies.get('token'),
            url = adminPath + `api/builder/resource/${type}/url/latest?productInstanceId=${productInstanceId}&platform=${platform}`;

        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
            var responseText = Ext.JSON.decode(response.responseText);
            if (responseText.success) {
                data = responseText.data;
                var newAdminPath = adminPath.slice(0, adminPath.length - 10);
                newUrl = newAdminPath + data + `?productInstanceId=${productInstanceId}&access_token=${access_token}&token_type=${token_type}`;
            }
        });
        return newUrl;
    },


    // 货币汇率转换
    getCurrencyConversion: function (inCurrency, outCurrency, amount) {
        var controller = Ext.create('CGP.profitmanagement.controller.Controller'),
            params = {
                inCurrency: inCurrency,
                outCurrency: outCurrency,
                amount: amount
            },
            result = controller.changeCurrencyAmount(params)

        return result;
    },


    // 店铺订单总价列表数据
    getCustomerOrderTotalStoreData: function (data, symbolLeft, totalWeight) {
        var controller = this,
            result = [
                {
                    id: 0,
                    retailPrice: '零售价',
                    billPrice: '拼单价',
                    noCurrency: true,
                },
                {
                    id: 1,
                    title: 'Total weight',
                    retailPrice: totalWeight,
                    noCurrency: true,
                    billPrice: '',
                },
                {
                    id: 2,
                    title: 'subTotal',
                    retailPrice: '',
                    billPrice: '',
                },
                {
                    id: 3,
                    title: 'tax',
                    retailPrice: '',
                    billPrice: '',
                },
                {
                    id: 4,
                    title: 'shipping fee',
                    retailPrice: '',
                    billPrice: '',
                },
                {
                    id: 5,
                    title: 'total',
                    retailPrice: '',
                    billPrice: '',
                },
                {
                    id: 6,
                    noCurrency: true,
                    retailPrice: '订单盈余 :',
                    billPrice: '',
                },
            ];

        if (data) {
            var {customerOrderTotal, whitelabelOrderTotal} = data,
                inCurrency = whitelabelOrderTotal['currencyCode'], //whitelabelOrderTotal['currencyCode']
                outCurrency = customerOrderTotal['currencyCode'],  //customerOrderTotal['currencyCode']
                whitelabelOrderTotalValue = whitelabelOrderTotal['orderTotalValue'],
                customerOrderTotalValue = customerOrderTotal['orderTotalValue'],
                whitelabelOrderTotalSymbolLeftText = whitelabelOrderTotal['orderTotal'],
                customerOrderTotalConversion = controller.getCurrencyConversion(inCurrency, outCurrency, whitelabelOrderTotalValue),
                orderProfit = +customerOrderTotalValue - +customerOrderTotalConversion,
                newWhitelabelOrderTotalText = whitelabelOrderTotalSymbolLeftText + JSCreateFont('red', true, ` (${symbolLeft} ${customerOrderTotalConversion})`),
                whitelabelOrderTotalText = inCurrency === outCurrency ? whitelabelOrderTotalSymbolLeftText : newWhitelabelOrderTotalText;

            result = [
                {
                    id: 0,
                    retailPrice: '零售价',
                    billPrice: '拼单价',
                    noCurrency: true,
                },
                {
                    id: 1,
                    title: 'Total weight',
                    noCurrency: true,
                    retailPrice: totalWeight,
                    billPrice: '',
                },
                {
                    id: 2,
                    title: 'subTotal',
                    retailPrice: customerOrderTotal['subTotal'],
                    billPrice: whitelabelOrderTotal['subTotal'],
                },
                {
                    id: 3,
                    title: 'tax',
                    retailPrice: customerOrderTotal['tax'],
                    billPrice: whitelabelOrderTotal['tax'],
                },
                {
                    id: 4,
                    title: 'shipping fee',
                    retailPrice: customerOrderTotal['shipping'],
                    billPrice: whitelabelOrderTotal['shipping'],
                },
                {
                    id: 7,
                    title: 'import service',
                    retailPrice: customerOrderTotal['importService'],
                    billPrice: whitelabelOrderTotal['importService'],
                },
                {
                    id: 5,
                    title: 'total',
                    retailPrice: customerOrderTotal['orderTotal'],
                    billPrice: whitelabelOrderTotalText,
                },
                {
                    id: 6,
                    noCurrency: true,
                    retailPrice: '订单盈余 :',
                    billPrice: `${symbolLeft} ${orderProfit.toFixed(2)}`,
                },
            ]
        }

        return result;
    },

    getCustomerOrderTotalInfo: function (orderId, totalWeight, symbolLeft, callBack) {
        var controller = this,
            url = adminPath + `api/background/store/orders/${orderId}/orderTotals`,
            data = controller.getQuery(url),
            /*data = {
                "customerOrderTotal": {
                    "subTotal": "US$55.15",
                    "tax": "US$0.00",
                    "shipping": "US$2.11",
                    "orderTotal": "US$57.26",
                    "orderTotalValue": 57.26,
                },
                "whitelabelOrderTotal": {
                    "subTotal": "US$37.99",
                    "tax": "US$7.60",
                    "shipping": "US$13.78",
                    "orderTotal": "US$59.37",
                    "orderTotalValue": 59.37,
                }
            },*/
            result = controller.getCustomerOrderTotalStoreData(data, symbolLeft, totalWeight);

        if (result) {
            callBack && callBack(result);
        } else {
            Ext.Msg.alert('提示', '未查询到订单价格汇总数据!');
        }

        return result
    },

    // 获取QPSON订单信息V2
    getQPSONCustomerOrderInfoV2: function (orderId, callBack) {
        var controller = this,
            url = adminPath + `api/orders/${orderId}/shipmentRequirements`,
            data = JSGetQueryAllData(url),
            /*data = [
                {
                    "billingAddress": {
                        "modifiedDate": 1744107012349,
                        "countryCode2": "US",
                        "countryName": "United States",
                        "stateCode": "NJ",
                        "state": "New Jersey",
                        "city": "Atlantic City",
                        "streetAddress1": "1301 Bacharach Boulevard",
                        "postcode": "08401",
                        "firstName": "s",
                        "lastName": "s",
                        "emailAddress": "levilee@qpp.com",
                        "sortOrder": 1
                    },
                    "deliveryAddress": {
                        "modifiedDate": 1744107012349,
                        "countryCode2": "US",
                        "countryName": "United States",
                        "stateCode": "NJ",
                        "state": "New Jersey",
                        "city": "Atlantic City",
                        "streetAddress1": "1301 Bacharach Boulevard",
                        "postcode": "08401",
                        "firstName": "s",
                        "lastName": "s",
                        "emailAddress": "levilee@qpp.com",
                        "sortOrder": 1
                    },
                    "shippingMethod": "Standard1",
                    "shipmentRequirementId": 327963124
                },
                {
                    "billingAddress": {
                        "modifiedDate": 1744107012349,
                        "countryCode2": "US",
                        "countryName": "United States",
                        "stateCode": "NJ",
                        "state": "New Jersey",
                        "city": "Atlantic City",
                        "streetAddress1": "1301 Bacharach Boulevard",
                        "postcode": "08401",
                        "firstName": "s",
                        "lastName": "s",
                        "emailAddress": "levilee@qpp.com",
                        "sortOrder": 1
                    },
                    "deliveryAddress": {
                        "modifiedDate": 1744107012349,
                        "countryCode2": "US",
                        "countryName": "United States",
                        "stateCode": "NJ",
                        "state": "New Jersey",
                        "city": "Atlantic City",
                        "streetAddress1": "1301 Bacharach Boulevard",
                        "postcode": "08401",
                        "firstName": "s",
                        "lastName": "s",
                        "emailAddress": "levilee@qpp.com",
                        "sortOrder": 1
                    },
                    "shippingMethod": "Standard",
                    "shipmentRequirementId": 327963124
                }
            ],*/
            result = data.map(item => {
                return new CGP.customerordermanagement.model.CustomerordermanagementModel(item).data;
            });


        if (data) {
            callBack && callBack(result);
        } else {
            Ext.Msg.alert('提示', '未查询到店铺订单项数据!');
        }

        return data
    },

    // 获取QPSON订单信息
    getQPSONCustomerOrderInfo: function (orderId, callBack) {
        var controller = this,
            url = adminPath + `api/orders/${orderId}/itemDetail`,
            data = controller.getQuery(url),
            /*data = [
                {
                    "billingAddress": {
                        "modifiedDate": 1744107012349,
                        "countryCode2": "US",
                        "countryName": "United States",
                        "stateCode": "NJ",
                        "state": "New Jersey",
                        "city": "Atlantic City",
                        "streetAddress1": "1301 Bacharach Boulevard",
                        "postcode": "08401",
                        "firstName": "s",
                        "lastName": "s",
                        "emailAddress": "levilee@qpp.com",
                        "sortOrder": 1
                    },
                    "deliveryAddress": {
                        "modifiedDate": 1744107012349,
                        "countryCode2": "US",
                        "countryName": "United States",
                        "stateCode": "NJ",
                        "state": "New Jersey",
                        "city": "Atlantic City",
                        "streetAddress1": "1301 Bacharach Boulevard",
                        "postcode": "08401",
                        "firstName": "s",
                        "lastName": "s",
                        "emailAddress": "levilee@qpp.com",
                        "sortOrder": 1
                    },
                    "shippingMethod": "Standard",
                    "items": [
                        {
                            "id": "252158518",
                            "productId": 62704266,
                            "productName": "Custom Jigsaw Puzzle 1000 Pieces (19.25\" x 28\")",
                            "productSku": "QPSON-19.25x28Puzzle-245",
                            "productType": "SKU",
                            "productInstanceId": "228651140",
                            "productDescription": "Print Type:Classic</br>Board Quality:Deluxe (Regular back)</br>Number of Pieces:1000</br>Print Sides:Single Side</br>Finish:Regular Gloss</br>Packaging:Standard box with Image</br>Printed Insert:No</br>Frame add on:None</br>Assembled:No</br>Puzzle design direction:Horizontal",
                            "thumbnail": {
                                "configThumbnail": "fd2b2cabbd2193da3fe8ebfbeb19bc26.jpg",
                                "customThumbnail": "7dedfe01-b9f4-4310-ae8a-c37b0179f3a9-0.jpg"
                            },
                            "mockupImages": [],
                            "qty": 1,
                            "unitPrice": "US$35.01",
                            "totalPrice": "US$35.01",
                            "productWeight": "522.0g",
                            "totalWeight": "522.0g",
                            "storeOrderInfo": {
                                "orderId": 245068650,
                                "orderNumber": "1050",
                                "storeId": "60382482",
                                "storeName": "testStore-levi-1",
                                "itemSeqNo": 1
                            },
                            "isSimpleCustomized": false,
                            "suspectedSanction": true,
                            "isFinishedProduct": false,
                            "designMethod": "FIX"
                        },
                        {
                            "id": "252158520",
                            "productId": 62704266,
                            "productName": "Custom Jigsaw Puzzle 1000 Pieces (19.25\" x 28\")",
                            "productSku": "QPSON-19.25x28Puzzle-245",
                            "productType": "SKU",
                            "productInstanceId": "228651140",
                            "productDescription": "Print Type:Classic</br>Board Quality:Deluxe (Regular back)</br>Number of Pieces:1000</br>Print Sides:Single Side</br>Finish:Regular Gloss</br>Packaging:Standard box with Image</br>Printed Insert:No</br>Frame add on:None</br>Assembled:No</br>Puzzle design direction:Horizontal",
                            "thumbnail": {
                                "configThumbnail": "fd2b2cabbd2193da3fe8ebfbeb19bc26.jpg",
                                "customThumbnail": "7dedfe01-b9f4-4310-ae8a-c37b0179f3a9-0.jpg"
                            },
                            "mockupImages": [],
                            "qty": 1,
                            "unitPrice": "US$35.01",
                            "totalPrice": "US$35.01",
                            "productWeight": "522.0g",
                            "totalWeight": "522.0g",
                            "storeOrderInfo": {
                                "orderId": 251762650,
                                "orderNumber": "levi1049",
                                "storeId": "60382482",
                                "storeName": "testStore-levi-1",
                                "itemSeqNo": 1
                            },
                            "isSimpleCustomized": false,
                            "suspectedSanction": true,
                            "isFinishedProduct": false,
                            "designMethod": "FIX"
                        }
                    ]
                },
                {
                    "billingAddress": {
                        "modifiedDate": 1744107012349,
                        "countryCode2": "US",
                        "countryName": "United States",
                        "stateCode": "NJ",
                        "state": "New Jersey",
                        "city": "Atlantic City",
                        "streetAddress1": "1301 Bacharach Boulevard",
                        "postcode": "08401",
                        "firstName": "s",
                        "lastName": "s",
                        "emailAddress": "levilee@qpp.com",
                        "sortOrder": 1
                    },
                    "deliveryAddress": {
                        "modifiedDate": 1744107012349,
                        "countryCode2": "US",
                        "countryName": "United States",
                        "stateCode": "NJ",
                        "state": "New Jersey",
                        "city": "Atlantic City",
                        "streetAddress1": "1301 Bacharach Boulevard",
                        "postcode": "08401",
                        "firstName": "s",
                        "lastName": "s",
                        "emailAddress": "levilee@qpp.com",
                        "sortOrder": 1
                    },
                    "shippingMethod": "Standard",
                    "items": [
                        {
                            "id": "252158518",
                            "productId": 62704266,
                            "productName": "Custom Jigsaw Puzzle 1000 Pieces (19.25\" x 28\")",
                            "productSku": "QPSON-19.25x28Puzzle-245",
                            "productType": "SKU",
                            "productInstanceId": "228651140",
                            "productDescription": "Print Type:Classic</br>Board Quality:Deluxe (Regular back)</br>Number of Pieces:1000</br>Print Sides:Single Side</br>Finish:Regular Gloss</br>Packaging:Standard box with Image</br>Printed Insert:No</br>Frame add on:None</br>Assembled:No</br>Puzzle design direction:Horizontal",
                            "thumbnail": {
                                "configThumbnail": "fd2b2cabbd2193da3fe8ebfbeb19bc26.jpg",
                                "customThumbnail": "7dedfe01-b9f4-4310-ae8a-c37b0179f3a9-0.jpg"
                            },
                            "mockupImages": [],
                            "qty": 1,
                            "unitPrice": "US$35.01",
                            "totalPrice": "US$35.01",
                            "productWeight": "522.0g",
                            "totalWeight": "522.0g",
                            "storeOrderInfo": {
                                "orderId": 245068650,
                                "orderNumber": "1050",
                                "storeId": "60382482",
                                "storeName": "testStore-levi-1",
                                "itemSeqNo": 1
                            },
                            "isSimpleCustomized": false,
                            "suspectedSanction": true,
                            "isFinishedProduct": false,
                            "designMethod": "FIX"
                        },
                        {
                            "id": "252158520",
                            "productId": 62704266,
                            "productName": "Custom Jigsaw Puzzle 1000 Pieces (19.25\" x 28\")",
                            "productSku": "QPSON-19.25x28Puzzle-245",
                            "productType": "SKU",
                            "productInstanceId": "228651140",
                            "productDescription": "Print Type:Classic</br>Board Quality:Deluxe (Regular back)</br>Number of Pieces:1000</br>Print Sides:Single Side</br>Finish:Regular Gloss</br>Packaging:Standard box with Image</br>Printed Insert:No</br>Frame add on:None</br>Assembled:No</br>Puzzle design direction:Horizontal",
                            "thumbnail": {
                                "configThumbnail": "fd2b2cabbd2193da3fe8ebfbeb19bc26.jpg",
                                "customThumbnail": "7dedfe01-b9f4-4310-ae8a-c37b0179f3a9-0.jpg"
                            },
                            "mockupImages": [],
                            "qty": 1,
                            "unitPrice": "US$35.01",
                            "totalPrice": "US$35.01",
                            "productWeight": "522.0g",
                            "totalWeight": "522.0g",
                            "storeOrderInfo": {
                                "orderId": 251762650,
                                "orderNumber": "levi1049",
                                "storeId": "60382482",
                                "storeName": "testStore-levi-1",
                                "itemSeqNo": 1
                            },
                            "isSimpleCustomized": false,
                            "suspectedSanction": true,
                            "isFinishedProduct": false,
                            "designMethod": "FIX"
                        }
                    ]
                }
            ],*/
            result = data.map(item => {
                return new CGP.customerordermanagement.model.CustomerordermanagementModel(item).data;
            });

        if (data) {
            callBack && callBack(result);
        } else {
            Ext.Msg.alert('提示', '未查询到店铺订单项数据!');
        }

        return data
    },
    
})