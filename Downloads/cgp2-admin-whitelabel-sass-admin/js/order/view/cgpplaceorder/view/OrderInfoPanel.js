/**
 * Created by nan on 2019/8/22.
 */
Ext.define('CGP.order.view.cgpplaceorder.view.OrderInfoPanel', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    defaults: {
        sortable: false
    },
    title: i18n.getKey('订单内容总览'),
    autoScroll: true,
    controller: Ext.create('CGP.order.view.cgpplaceorder.controller.Controller'),
    alias: 'widget.orderinfopanel',
    initComponent: function () {
        var me = this;
        var orderItem = Ext.JSON.decode(Ext.util.Cookies.get('cgpOrderItemArr')) || [];
        var totalPrice = 0;
        var userStore = Ext.create('CGP.customer.store.CustomerStore', {
            fields: [{
                name: 'id',
                type: 'int',
                useNull: true
            }, 'roles', {
                name: 'type',
                type: 'string'
            }, {
                name: 'gender',
                type: 'string'
            }, {
                name: 'firstName',
                type: 'string'
            }, {
                name: 'lastName',
                type: 'string'
            }, {
                name: 'email',
                type: 'string'
            }, {
                name: 'enable',
                type: 'boolean'
            }],
            model: null,
            params: {
                filter: Ext.JSON.encode([{
                    name: 'website',
                    type: 'number',
                    value: 5
                }])
            }
        });
        for (var i = 0; i < orderItem.length; i++) {
            totalPrice += parseFloat(orderItem[i].allPrice);
        }
        me.items = [
            {
                xtype: 'fieldset',
                itemId: 'addressFieldset',
                autoScroll: true,
                border: '1 0 0 0 ',
                title: "<div style='margin-top: 10px;margin-bottom: 10px'><font style= 'font-size:15px;color:green;font-weight: bold'>" + i18n.getKey('deliveryAddress') + '</font></div>',
                defaultType: 'displayfield',
                items: [
                    {
                        xtype: 'form',
                        itemId: 'addressForm',
                        border: false,
                        layout: {
                            type: 'table',
                            columns: 2

                        },
                        defaults: {
                            padding: '2 5 0 5',
                            labelWidth: 150,
                            width: 350,
                            labelAlign: 'right',
                            listeners: {
                                blur: function (field, isDirty) {
                                    var form = field.ownerCt;
                                    var data = form.getValues();
                                    console.log(data);
                                    var exp = new Date(new Date().getTime() + 5 * 60 * 1000);//5分钟后过期
                                    Ext.util.Cookies.set('addressInfo', Ext.JSON.encode(data), exp);
                                }
                            }
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                name: "firstName",
                                itemId: 'firstName',
                                allowBlank: false,
                                fieldLabel: i18n.getKey('firstName')
                            },
                            {
                                xtype: 'textfield',
                                name: "lastName",
                                itemId: 'laseName',
                                fieldLabel: i18n.getKey('lastName')
                            },
                            {
                                xtype: 'combo',
                                typeAhead: true,  // 自动匹配相似输入
                                name: "countryCode2",
                                itemId: 'countryCode2',
                                allowBlank: false,
                                minChars: 1,
                                editable: false,
                                autoSelect: false,
                                triggerAction: 'all',
                                fieldLabel: i18n.getKey('country'),
                                store: new Ext.data.Store({
                                    fields: [
                                        {
                                            name: 'id',
                                            type: 'int'
                                        },
                                        'isoCode2',
                                        'name'
                                    ],
                                    storeId: 'countryStore',
                                    remoteSort: true,
                                    pageSize: 200,
                                    proxy: {
                                        type: 'uxrest',
                                        url: adminPath + 'api/countries',
                                        reader: {
                                            type: 'json',
                                            root: 'data.content'
                                        }
                                    },
                                    autoLoad: true,
                                    listeners: {
                                        load: function (store, records, successful, eOpts) {
                                            for (var i = 0; i < records.length; i++) {
                                                var record = records[i];
                                                if (record.get("name") == "广东") {
                                                    store.remove(store.getById(record.get("id")));
                                                }
                                            }
                                        }
                                    }
                                }),
                                queryMode: 'remote',
                                displayField: 'name',
                                valueField: 'isoCode2'
                            },
                            {
                                xtype: 'combo',
                                name: "gender",
                                editable: false,
                                fieldLabel: i18n.getKey('gender'),
                                store: Ext.create('Ext.data.Store', {
                                    fields: ['gender', 'desc'],
                                    data: [
                                        {
                                            gender: 'M',
                                            desc: i18n.getKey('male')
                                        },
                                        {
                                            gender: 'F',
                                            desc: i18n.getKey('female')
                                        },
                                        {
                                            gender: 'U',
                                            desc: ""
                                        }
                                    ]
                                }),
                                itemId: 'gender',
                                displayField: 'desc',
                                valueField: 'gender',
                                queryMode: 'local'
                            },
                            {
                                xtype: 'textfield',
                                name: "postcode",
                                itemId: 'postcode',
                                fieldLabel: i18n.getKey('postCode')
                            },
                            {
                                xtype: 'textfield',
                                allowBlank: false,
                                name: "state",
                                itemId: 'state',
                                fieldLabel: i18n.getKey('state')
                            },
                            {
                                xtype: 'textfield',
                                allowBlank: false,
                                name: "city",
                                itemId: 'city',
                                fieldLabel: i18n.getKey('city')
                            },
                            {
                                xtype: 'textfield',
                                allowBlank: false,
                                name: "suburb",
                                itemId: 'suburb',
                                fieldLabel: i18n.getKey('suburb')
                            },
                            {
                                xtype: 'textfield',
                                allowBlank: false,
                                itemId: 'streetAddress1',
                                name: "streetAddress1",
                                fieldLabel: i18n.getKey('streetAddress') + '1'
                            },
                            {
                                xtype: 'textfield',
                                name: "streetAddress2",
                                itemId: 'streetAddress2',
                                fieldLabel: i18n.getKey('streetAddress') + '2'
                            },
                            {
                                xtype: 'textfield',
                                name: "mobile",
                                itemId: 'mobile',
                                allowBlank: false,
                                fieldLabel: i18n.getKey('mobile')
                            },
                            {
                                xtype: 'textfield',
                                name: "telephone",
                                allowBlank: false,
                                itemId: 'telephone',
                                fieldLabel: i18n.getKey('telephone')
                            },
                            {
                                xtype: 'textfield',
                                name: "emailAddress",
                                itemId: 'emailAddress',
                                allowBlank: false,
                                fieldLabel: i18n.getKey('emailAddress'),
                                regex: /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
                                regexText: i18n.getKey('Please enter the correct email!')
                            },
                            {
                                xtype: 'textfield',
                                name: "company",
                                itemId: 'company',
                                fieldLabel: i18n.getKey('company')
                            },
                            {
                                xtype: 'combo',
                                name: "locationType",
                                editable: false,
                                itemId: 'locationType',
                                value: 'HOUSE',
                                fieldLabel: i18n.getKey('addressType'),
                                store: new Ext.data.Store({
                                    fields: ['value'],
                                    data: [
                                        {value: 'HOUSE'},
                                        {value: 'POBOX'},
                                        {value: 'BUSINESS'},
                                        {value: 'OTHER'}
                                    ]
                                }),
                                displayField: 'value',
                                valueField: 'value',
                                queryMode: 'local'
                            }],
                        listeners: {
                            afterrender: function (form) {
                                var addressInfo = Ext.JSON.decode(Ext.util.Cookies.get('addressInfo') || '{}');
                                for (var i = 0; i < form.items.items.length; i++) {
                                    var item = form.items.items[i];
                                    if (addressInfo[item.getName()]) {
                                        item.setValue(addressInfo[item.getName()]);
                                    }
                                }
                            }
                        }
                    }
                ]
            },
            {
                //分为两种来源
                xtype: 'fieldset',
                itemId: 'orderSourceFieldset',
                autoScroll: true,
                border: '1 0 0 0 ',
                title: "<div style='margin-top: 10px;margin-bottom: 10px'><font style= 'font-size:15px;color:green;font-weight: bold'>" + i18n.getKey('orderSource') + '</font></div>',
                defaultType: 'displayfield',
                items: [
                    {
                        xtype: 'form',
                        itemId: 'orderSourceForm',
                        border: false,
                        layout: {
                            type: 'table',
                            columns: 2
                        },
                        defaults: {
                            padding: '2 5 0 5',
                            labelWidth: 150,
                            width: 350,
                            labelAlign: 'right',
                            listeners: {
                                blur: function (field, isDirty) {
                                    var form = field.ownerCt;
                                    var data = {};
                                    for (var i = 0; i < form.items.items.length; i++) {
                                        var item = form.items.items[i];
                                        if (item.disabled == false) {
                                            if (item.xtype == 'gridcombo') {
                                                var key = form.items.items[1].getSubmitValue();
                                                data[item.getName()] = item.getValue()[key];
                                            } else {
                                                data[item.getName()] = item.getValue();
                                            }
                                        }
                                    }
                                    console.log(data);
                                    var exp = new Date(new Date().getTime() + 5 * 60 * 1000);//5分钟后过期
                                    Ext.util.Cookies.set('orderSource', Ext.JSON.encode(data), exp);
                                }
                            }
                        },
                        items: [
                            {
                                xtype: 'combo',
                                editable: false,
                                itemId: 'clazz',
                                name: 'clazz',
                                allowBlank: false,
                                store: Ext.create('Ext.data.Store', {
                                    fields: [
                                        'value',
                                        'display'
                                    ],
                                    data: [
                                        {
                                            value: 'com.qpp.cgp.domain.sales.Salesman',
                                            display: '自营'
                                        },
                                        {
                                            value: 'com.qpp.cgp.domain.sales.PartnerDealer',
                                            display: '第三方'
                                        }
                                    ]
                                }),
                                value: 'com.qpp.cgp.domain.sales.Salesman',
                                valueField: 'value',
                                displayField: 'display',
                                fieldLabel: i18n.getKey('order') + i18n.getKey('type'),
                                listeners: {
                                    change: function (field, newValue, oldValue) {
                                        var partnerId = field.ownerCt.getComponent('partnerId');
                                        var user = field.ownerCt.getComponent('user');
                                        var salesWebsite = field.ownerCt.getComponent('salesWebsite');
                                        if (newValue == 'com.qpp.cgp.domain.sales.Salesman') {
                                            user.show();
                                            salesWebsite.show();
                                            user.setDisabled(false);
                                            salesWebsite.setDisabled(false);
                                            partnerId.hide();
                                            partnerId.setDisabled(true);
                                        } else {
                                            user.hide();
                                            salesWebsite.hide();
                                            user.setDisabled(true);
                                            salesWebsite.setDisabled(true);
                                            partnerId.show();
                                            partnerId.setDisabled(false);
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'gridcombo',
                                editable: false,
                                displayField: 'email',
                                name: 'userId',
                                itemId: 'user',
                                allowBlank: false,
                                valueField: 'id',
                                fieldLabel: i18n.getKey('user'),
                                matchFieldWidth: false,
                                multiSelect: false,
                                store: userStore,
                                gridCfg: {
                                    store: userStore,
                                    height: 300,
                                    width: 800,
                                    selType: 'rowmodel',
                                    viewConfig: {
                                        enableTextSelection: true,
                                        stripeRows: true
                                    },
                                    columns: [
                                        {
                                            text: i18n.getKey('id'),
                                            dataIndex: 'id',
                                            width: 100,
                                            xtype: 'gridcolumn',
                                            itemId: 'id',
                                            sortable: true
                                        },
                                        {
                                            text: i18n.getKey('firstName'),
                                            dataIndex: 'firstName',
                                            xtype: 'gridcolumn',
                                            itemId: 'firstName',
                                            sortable: false,
                                            minWidth: 100
                                        },
                                        {
                                            text: i18n.getKey('lastName'),
                                            dataIndex: 'lastName',
                                            xtype: 'gridcolumn',
                                            itemId: 'lastName',
                                            sortable: false,
                                            minWidth: 100
                                        },
                                        {
                                            text: i18n.getKey('email'),
                                            dataIndex: 'email',
                                            xtype: 'gridcolumn',
                                            itemId: 'email',
                                            sortable: false,
                                            minWidth: 170,
                                            renderer: function (value, metadata) {
                                                metadata.style = "font-weight:bold";
                                                return value;
                                            }
                                        },
                                        {
                                            text: i18n.getKey('type'),
                                            dataIndex: 'type',
                                            xtype: 'gridcolumn',
                                            itemId: 'type',
                                            sortable: false,
                                            width: 80,
                                            renderer: function (value, metadata) {
                                                if (value == "MEMBER") {
                                                    return i18n.getKey('member');
                                                } else if (value == "ADMIN") {
                                                    return i18n.getKey('admin');
                                                }
                                                return value;
                                            }
                                        },
                                        {
                                            text: i18n.getKey('role'),
                                            dataIndex: 'roles',
                                            xtype: 'arraycolumn',
                                            itemId: 'role',
                                            sortable: false,
                                            minWidth: 150,
                                            lineNumber: 2,
                                            valueField: 'name',
                                            renderer: function (value, metadata) {
                                                metadata.style = 'font-weight:bold';
                                                return value;
                                            }
                                        },
                                        {
                                            text: i18n.getKey('isActivation'),
                                            dataIndex: 'enable',
                                            xtype: 'gridcolumn',
                                            itemId: 'enable',
                                            sortable: false,
                                            flex: 1,
                                            renderer: function (value, metadata) {
                                                if (value) {
                                                    return i18n.getKey('yes');
                                                } else {
                                                    return i18n.getKey('no');
                                                }
                                            }
                                        }
                                    ],
                                    tbar: {
                                        layout: {
                                            type: 'column'
                                        },
                                        defaults: {
                                            width: 170,
                                            isLike: false,
                                            padding: 2
                                        },
                                        items: [
                                            {
                                                xtype: 'numberfield',
                                                fieldLabel: i18n.getKey('id'),
                                                name: 'id',
                                                hideTrigger: true,
                                                isLike: false,
                                                labelWidth: 40
                                            },
                                            {
                                                xtype: 'textfield',
                                                fieldLabel: i18n.getKey('email'),
                                                name: 'emailAddress',
                                                isLike: true,
                                                labelWidth: 40
                                            },
                                            '->',
                                            {
                                                xtype: 'button',
                                                text: i18n.getKey('search'),
                                                width: 80,
                                                handler: function () {
                                                    var queries = [];
                                                    var items = this.ownerCt.items.items;
                                                    var store = this.ownerCt.ownerCt.getStore();
                                                    for (var i = 0; i < items.length; i++) {
                                                        var query = {};
                                                        if (items[i].xtype == 'button')
                                                            continue;
                                                        if (Ext.isEmpty(items[i].value))
                                                            continue;
                                                        query.name = items[i].name;
                                                        if (!Ext.isEmpty(items[i].isLike) && !items[i].isLike) {
                                                            query.value = items[i].getValue();
                                                        } else if (Ext.isEmpty(items[i].isLike) || items[i].isLike) {
                                                            query.value = '%' + items[i].getValue() + '%'
                                                        }
                                                        if (Ext.isNumber(query.value)) {
                                                            query.type = 'number';
                                                        } else {
                                                            query.type = 'string';
                                                        }
                                                        queries.push(query);
                                                    }
                                                    if (queries.length > 0) {
                                                        store.proxy.extraParams = {
                                                            filter: Ext.JSON.encode(queries)
                                                        }
                                                    } else {
                                                        store.proxy.extraParams = null;
                                                    }
                                                    store.loadPage(1);
                                                }

                                            },
                                            {
                                                xtype: 'button',
                                                text: i18n.getKey('clear'),
                                                width: 80,
                                                handler: function () {
                                                    var items = this.ownerCt.items.items;
                                                    var store = this.ownerCt.ownerCt.getStore();
                                                    for (var i = 0; i < items.length; i++) {
                                                        if (items[i].xtype == 'button')
                                                            continue;
                                                        if (Ext.isEmpty(items[i].value))
                                                            continue;
                                                        items[i].setValue('');
                                                    }
                                                    store.proxy.extraParams = null;
                                                }
                                            }
                                        ]
                                    },
                                    bbar: Ext.create('Ext.PagingToolbar', {
                                        store: userStore,
                                        displayInfo: true,
                                        emptyMsg: i18n.getKey('noData')
                                    })

                                }
                            },
                            {
                                xtype: 'combo',
                                name: 'salesWebsite',
                                editable: false,
                                allowBlank: false,
                                itemId: 'salesWebsite',
                                store: Ext.create('Ext.data.Store', {
                                    fields: [
                                        'value',
                                        'display'
                                    ],
                                    data: [
                                        {
                                            value: '淘宝',
                                            display: '淘宝'
                                        },
                                        {
                                            value: '京东',
                                            display: '京东'
                                        }, {
                                            value: 'MPC',
                                            display: 'MPC'
                                        }, {
                                            value: 'BGM',
                                            display: 'BGM'
                                        },
                                        {
                                            value: 'PS',
                                            display: 'PS'
                                        },
                                        {
                                            value: '虾皮',
                                            display: '虾皮'
                                        }
                                    ]
                                }),
                                displayField: 'display',
                                valueField: 'value',
                                fieldLabel: i18n.getKey('source') + i18n.getKey('website')
                            },
                            {
                                name: 'partnerId',
                                itemId: 'partnerId',
                                xtype: 'combo',
                                pageSize: 25,
                                hidden: true,
                                disabled: true,
                                editable: false,
                                allowBlank: false,
                                autoRender: true,
                                store: Ext.create('CGP.order.store.PartnerStore'),
                                displayField: 'name',
                                valueField: 'id',
                                fieldLabel: i18n.getKey('partner')
                            }
                        ],
                        listeners: {
                            afterrender: function (form) {
                                var orderSource = Ext.JSON.decode(Ext.util.Cookies.get('orderSource') || '{}');
                                for (var i = 0; i < form.items.items.length; i++) {
                                    var item = form.items.items[i];
                                    if (orderSource[item.getName()]) {
                                        if (item.xtype != 'gridcombo') {
                                            item.setValue(orderSource[item.getName()]);
                                        } else {
                                            item.setValue([orderSource[item.getName()]]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                ]
            },
            {
                xtype: 'fieldset',
                itemId: 'orderDetailsFieldset',
                autoScroll: true,
                border: '1 0 0 0 ',
                title: "<div style='margin-top: 10px;margin-bottom: 10px'><font style= 'font-size:15px;color:green;font-weight: bold'>" + i18n.getKey('orderDetails') + '</font></div>',
                items: [
                    {
                        xtype: 'grid',
                        itemId: 'orderDetailsGrid',
                        viewConfig: {
                            enableTextSelection: true
                        },
                        store: Ext.create('Ext.data.Store', {
                            autoSync: true,
                            fields: [
                                'thumbnail',
                                'qty',
                                {
                                    name: 'price',
                                    type: 'int'
                                },
                                {
                                    name: 'allPrice',
                                    type: 'int'
                                },
                                'comment',
                                {
                                    name: 'productInfo',
                                    type: 'object'
                                },
                                'productInstanceId'
                            ],
                            data: orderItem,
                            proxy: 'memory'
                        }),
                        columns: [
                            {
                                xtype: 'imagecolumn',
                                width: 150,
                                dataIndex: 'thumbnail',
                                text: i18n.getKey('languageImgText'),
                                buildUrl: function (value, metadata, record) {
                                    var imageUrl = imageServer + value;
                                    return imageUrl;
                                },
                                buildPreUrl: function (value, metadata, record) {
                                    var imageUrl = imageServer + value;
                                    return imageUrl;
                                },
                                buildTitle: function (value, metadata, record) {
                                    return `${i18n.getKey('check')} < ${value} > 预览图`;
                                },
                            },
                            {
                                xtype: 'componentcolumn',
                                dataIndex: 'productInfo',
                                width: 250,
                                text: i18n.getKey('product') + i18n.getKey('info'),
                                tdCls: 'vertical-middle',
                                renderer: function (value, mate, record) {
                                    var objArr = [];
                                    for (var i in value) {
                                        objArr.push({
                                            title: i,
                                            value: value[i]
                                        })
                                    }
                                    return JSCreateHTMLTable(objArr);
                                }
                            },
                            {
                                dataIndex: 'qty',
                                tdCls: 'vertical-middle',
                                text: i18n.getKey('qty'),
                                renderer: function (value, mete, record) {
                                    return value;
                                }

                            },
                            {
                                dataIndex: 'productInfo',
                                tdCls: 'vertical-middle',
                                text: i18n.getKey('price'),
                                renderer: function (value, mete, record) {
                                    return value.price;
                                }
                            },
                            {
                                dataIndex: 'qty',
                                tdCls: 'vertical-middle',
                                text: i18n.getKey('totalPrice'),
                                flex: 1,
                                renderer: function (value, mete, record) {
                                    return (value * record.raw.productInfo.price).toFixed(2);
                                }
                            },
                            {
                                dataIndex: 'comment',
                                tdCls: 'vertical-middle',
                                text: i18n.getKey('comment'),
                                flex: 1,
                                xtype: 'componentcolumn',
                                renderer: function (value, mete, record) {
                                    return {
                                        xtype: 'displayfield',
                                        value: '<div ><pre style="font: normal 13px/15px helvetica,arial,verdana,sans-serif">' + value + '</pre></div>',
                                        readOnly: true,
                                        width: '100%',
                                        height: 100
                                    }
                                }
                            }
                        ],
                        bbar: [
                            '->',
                            {
                                xtype: 'displayfield',
                                fieldLabel: i18n.getKey('totalPrice'),
                                value: totalPrice.toFixed(2)
                            }
                        ]
                    }
                ]
            }
        ];
        me.bbar = [
            {
                xtype: 'button',
                iconCls: 'icon_previous_step',
                text: i18n.getKey('lastStep'),
                handler: function (btn) {
                    var form = btn.ownerCt.ownerCt;
                    var outTab = form.ownerCt;
                    var orderItemGrid = outTab.getComponent('orderItemGrid');
                    outTab.setActiveTab(orderItemGrid);
                    orderItemGrid.refreshData();
                }
            },
            '->',
            {
                xtype: 'button',
                iconCls: 'icon_agree',
                text: i18n.getKey('生成订单'),
                handler: function (btn) {
                    var panel = btn.ownerCt.ownerCt;
                    var addressForm = panel.getComponent('addressFieldset').getComponent('addressForm');
                    var grid = panel.getComponent('orderDetailsFieldset').getComponent('orderDetailsGrid');
                    var orderSourceForm = panel.getComponent('orderSourceFieldset').getComponent('orderSourceForm');
                    if (addressForm.isValid() && orderSourceForm.isValid()) {
                        var address = addressForm.getValues();
                        var orderSource = orderSourceForm.getValues();
                        var salesSourceInfo = {};
                        if (orderSource.clazz == 'com.qpp.cgp.domain.sales.Salesman') {
                            salesSourceInfo = {
                                "seller": {
                                    "clazz": "com.qpp.cgp.domain.sales.Salesman",
                                    "userId": orderSource.userId[0]
                                }
                            }
                            salesSourceInfo.salesWebsite = orderSource.salesWebsite;
                        } else {
                            salesSourceInfo = {
                                "seller": {
                                    "clazz": "com.qpp.cgp.domain.sales.PartnerDealer",
                                    "partnerId": orderSource.partnerId
                                }
                            }
                        }
                        Ext.util.Cookies.clear('addressInfo');
                        Ext.util.Cookies.clear('cgpOrderItemArr');
                        Ext.util.Cookies.clear('orderSource');
                        var lineItems = [];
                        for (var i = 0; i < grid.store.data.items.length; i++) {
                            var item = grid.store.data.items[i];
                            lineItems.push({
                                "productInstanceId": item.get('productInstanceId'),
                                "qty": item.get('qty'),
                                "comment": item.get('comment')
                            })
                        }
                        panel.controller.createNewOrder('2333333', lineItems, address, salesSourceInfo, panel);
                    }
                }
            }
        ];
        me.callParent();
    }
})
