/**
 * @Description:付款信息 分为线下转账和线上网站PayPal付款
 * @author nan
 * @date 2024/3/25
 * 状态有
 * （1）付款状态：成功     （SUCCESS）
 * （2）付款状态：失败     （FAILURE）
 * （3）付款状态：取消     （CANCELED）
 * （4）付款状态：处理中   (PROCESSING)
 *
 *
 */
Ext.Loader.syncRequire([
    'CGP.orderitemsmultipleaddress.model.PayInfoModel',
    'CGP.common.stepv2.StepBarV2',
    'CGP.orderstatusmodify.view.SplitBarTitle',
    'CGP.orderitemsmultipleaddress.model.OtherPayInfoModel'
])
Ext.define('CGP.orderitemsmultipleaddress.view.PayInfo', {
    extend: 'Ext.form.Panel',
    alias: 'widget.pay_info',
    bodyStyle: 'border-top:0;border-color:white;',
    margin: '5 0 25 0',
    orderData: null,
    payInfoArr: null,
    width: '100%',
    payType: 'PayPal',//PayPal,BankTransfer
    diySetValue: function (orderData) {
        const me = this;

        if(orderData){
            me.orderData = orderData;
            //完成付款
            var orderId = orderData._id;
            var url = adminPath + `api/orders/${orderId}/paymentRecords`;
            JSAjaxRequest(url, 'GET', true, false, false, function (require, success, response) {
                if (success) {
                    var responseText = Ext.JSON.decode(response.responseText);
                    if (responseText.success) {
                        var payInfoArr = responseText.data;
                        me.payInfoArr = payInfoArr;
                        if (payInfoArr.length > 0) {
                            me.show();
                            if (payInfoArr[0].method == "BankTransfer") {
                                me.payType = 'BankTransfer';
                            } else {
                                me.payType = 'PayPal';
                            }
                            if (me.payType == 'BankTransfer') {
                                var payInfoItem = me.buildPayInfoItem();
                                var comp = me.add(payInfoItem);
                                var model = Ext.create('CGP.orderitemsmultipleaddress.model.OtherPayInfoModel', payInfoArr[0]);
                                comp.diySetValue(model.getData());
                            } else {
                                var payInfoItem = me.buildPayInfoItem();
                                var comp = me.add(payInfoItem);
                                //通过接口获取数据，取优先的状态status为SUCCESS，没有就拿第一条
                                var latestData = {};
                                payInfoArr.every(function (item) {
                                    if (item.status == 'SUCCESS') {
                                        latestData = item;
                                        return false;
                                    } else {
                                        return true;
                                    }
                                });
                                if (Ext.Object.isEmpty(latestData)) {
                                    latestData = payInfoArr[0];

                                }
                                var model = new CGP.orderitemsmultipleaddress.model.PayInfoModel(Ext.Object.merge({
                                    isShowMore: payInfoArr.length > 1
                                }, latestData));
                                comp.diySetValue(model.getData());
                            }
                        } else {
                            me.hide();
                        }
                    }
                }
            });
        }
    },
    buildPayInfoItem: function () {
        var me = this,
            controller = Ext.create('CGP.order.controller.Order'),
            {shippingCurrencyExchangeRates, currencyCode, modifiedCurrency} = me.orderData,
            defaultCurrency = modifiedCurrency || currencyCode,
            exchangeRateText = controller.getExchangeRateText(defaultCurrency, shippingCurrencyExchangeRates);

        if (me.payType === 'PayPal') {
            return {
                xtype: 'uxfieldcontainer',
                width: '100%',
                margin: '5 0 5 20',
                itemId: 'container',
                layout: {
                    type: 'table',
                    columns: 4,
                    tdAttrs: {
                        style: {
                            'padding-right': '100px',
                        }
                    }
                },
                defaults: {
                    margin: '5 0 5 20',
                    xtype: 'displayfield'
                },
                items: [
                    {
                        fieldLabel: '付款方式',
                        name: 'method',
                        itemId: 'method'
                    },
                    {
                        fieldLabel: '付款金额',
                        name: 'amountDisplay',
                        itemId: 'amountDisplay'
                    },
                    {
                        fieldLabel: '交易流水号',
                        name: 'transactionId',
                        itemId: 'transactionId'
                    },
                    {
                        fieldLabel: '付款类型',
                        name: 'type',
                        itemId: 'type',
                        tipInfo:'支付信息,有结账和退款,这两种类型'
                    },
                    {
                        fieldLabel: '付款状态',
                        name: 'status',
                        itemId: 'status'
                    },
                    {
                        fieldLabel: '支付货币',
                        name: 'currencyCode',
                        itemId: 'currencyCode',
                        colspan: 4,
                        diySetValue: function (data) {
                            var me = this;
                            me.setValue(currencyCode);
                        },
                    },
                    {
                        fieldLabel: '支付信息',
                        name: 'shippingCurrencyExchangeRates',
                        itemId: 'shippingCurrencyExchangeRates',
                        width: 700,
                        colspan: 4,
                        diySetValue: function (data) {
                            var me = this;
                            me.setVisible(exchangeRateText);
                            me.setValue(exchangeRateText);
                            me.setVisible(exchangeRateText);
                        },
                    },
                    {
                        xtype: 'uxfieldcontainer',
                        fieldLabel: '失败原因',
                        name: 'errors',
                        itemId: 'errors',
                        defaults: {},
                        labelAlign: 'left',
                        colspan: 4,
                        layout: 'hbox',
                        width: '100%',
                        items: [
                            {
                                xtype: "displayfield",
                                itemId: 'errorInfo',
                                fieldStyle: {
                                    color: 'red'
                                },
                                flex: 1,
                                value: '<font></font><a href="#" data-qtip="详情" class="x-form-display-field atag_display" style="color: blue;cursor: pointer;">  more...</a>',
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                                        if (ela) {
                                            ela.on("click", function (event) {
                                                var arr = display.rawData.map(function (item) {
                                                    return item.message;
                                                });
                                                var str = JSCreateListDom(arr);
                                                var win = Ext.create('Ext.window.Window', {
                                                    maxWidth: 600,
                                                    minWidth: 400,
                                                    maxHeight: 600,
                                                    modal: true,
                                                    constrain: true,
                                                    title: '报错信息',
                                                    html: str
                                                });
                                                win.show();
                                            });
                                        }
                                    }
                                },
                            }
                        ],
                        diySetValue: function (data) {
                            var me = this;
                            var errorInfo = me.getComponent('errorInfo');
                            errorInfo.rawData = data;
                            if (data && data.length > 0) {
                                var font = errorInfo.el.dom.getElementsByTagName('font')[0]; //获取到该html元素下的a元素
                                var a = errorInfo.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                font.innerText = (data[0].message);
                                if (data.length > 1) {
                                    a.style.visibility = 'visible';
                                } else {
                                    a.style.visibility = 'hidden';
                                }
                                me.setVisible(true);
                            } else {
                                me.setVisible(false);
                            }
                        }
                    },
                    {
                        xtype: 'atag_displayfield',
                        tooltip: '查看详情',
                        itemId: 'isShowMore',
                        name: 'isShowMore',
                        colspan: 4,
                        clickHandler: function () {
                            var me = this;
                            var form = me.ownerCt.ownerCt;
                            form.showMore();
                        },
                        diySetValue: function (data) {
                            var me = this;
                            me.setVisible(data);
                            me.setValue('查看更多付款信息');
                        }
                    }
                ],
                diySetValue: function (data) {
                    this.setValue(data);
                }
            };
        } else if (me.payType === 'BankTransfer') {
            me.addPayTimeLine();
            return {
                xtype: 'uxfieldcontainer',
                width: '100%',
                margin: '5 0 5 20',
                itemId: 'container',
                layout: {
                    type: 'table',
                    columns: 4,
                    tdAttrs: {
                        style: {
                            'padding-right': '100px',
                        }
                    }
                },
                defaults: {
                    margin: '5 0 5 20',
                    xtype: 'displayfield',
                },
                items: [
                    {
                        fieldLabel: '付款方式',
                        name: 'method',
                        itemId: 'method'
                    },

                    {
                        fieldLabel: '订单总额',
                        name: 'amountDisplay',
                        itemId: 'amountDisplay'
                    },
                    {
                        fieldLabel: '备注',
                        name: 'remark',
                        itemId: 'remark',
                    },
                    {
                        fieldLabel: '付款时间',
                        name: 'modifiedTime',
                        itemId: 'modifiedTime',
                    },
                    /*    {
                            fieldLabel: '支付货币',
                            name: 'currencyCode',
                            itemId: 'currencyCode',
                            colspan: 4,
                            diySetValue: function (data) {
                                var me = this;
                                me.setValue(currencyCode);
                            },
                        },*/
                    {
                        fieldLabel: '汇率信息',
                        name: 'shippingCurrencyExchangeRates',
                        itemId: 'shippingCurrencyExchangeRates',
                        width: 500,
                        colspan: 4,
                        diySetValue: function (data) {
                            var me = this;
                            me.setVisible(exchangeRateText);
                            me.setValue(exchangeRateText);
                            me.setVisible(exchangeRateText);
                        },
                    },
                    {
                        xtype: 'displayfield',
                        name: 'modifiedCurrency',
                        itemId: 'modifiedCurrency',
                        fieldLabel: '货币类型',
                    },
                    {
                        xtype: 'displayfield',
                        name: 'modifiedAmountStr',
                        itemId: 'modifiedAmountStr',
                        fieldLabel: '实付金额',
                        diySetValue: function (data) {
                            this.setValue(`<font color="red">${data}</font>`);
                        }
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: '实收金额少于应收金额的原因',
                        itemId: 'modifiedRemark',
                        name: 'modifiedRemark',
                        diySetValue: function (data) {
                            if (data) {
                                this.setValue(`<font color="red">${data}</font>`);
                            } else {
                                this.hide();
                            }
                        }
                    },
                    {
                        fieldLabel: '付款信息录入用户',
                        name: 'user',
                        itemId: 'user',
                        colspan: 4,
                        diySetValue: function (value, record) {
                            this.setValue(value.email + (value.type == '' ? '(后台用户)' : '(客户)'));
                        }
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: '付款交易号',
                        name: 'transactionIds',
                        colspan: 4,
                        width: 800,
                        itemId: 'transactionIds'
                    },
                    {
                        xtype: 'uxfieldcontainer',
                        fieldLabel: '付款凭证',
                        colspan: 4,
                        name: 'transactionVouchers',
                        itemId: 'transactionVouchers',
                        layout: 'hbox',
                        labelAlign: 'left',
                        width: 1000,
                        defaults: {},
                        autoScroll: true,
                        diySetValue: function (data) {
                            var me = this;
                            //https://dev-sz-qpson-nginx.qppdev.com/file/static/payment/transactionVouchers/PL004EC_page.svg
                            if (data && data.length > 0) {
                                var arr = [];
                                data.map(function (item) {
                                    var fileName = item;
                                    var fileType = fileName.split('.').pop();
                                    var imageUrl = imageServer + fileName;
                                    if (fileType.toUpperCase() == 'PDF') {//处理pdf文件的情况
                                        //转为png后缀
                                        //https://dev-sz-qpson-nginx.qppdev.com/file/file/payment/transactionVouchers/2d40a02fbacc6c96e2f2982f89591fa1.png
                                        imageUrl = imageUrl.replace(/.pdf|.PDF/g, '.png');
                                    }
                                    arr.push({
                                        xtype: 'imagedisplayfield',
                                        src: imageUrl,
                                        margin: '0 5',
                                    });
                                });
                                me.add(arr);
                            }
                        }
                    },
                ],
                diySetValue: function (data) {
                    this.setValue(data);
                }
            };
        }
    },
    showMore: function () {
        var me = this;
        var compArr = [];
        for (var i = 0; i < me.payInfoArr.length; i++) {
            var item = me.buildPayInfoItem();
            compArr.push(Ext.Object.merge(item, {
                itemId: JSGetUUID(),
                width: '100%',
                margin: '5 25 15 25',
                defaults: {
                    xtype: 'displayfield',
                    margin: '5 0 5 25',
                },
                style: {
                    'border-color': 'red',
                    'border': 'groove'
                }
            }));
        }
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            constrain: true,
            autoScroll: true,
            title: '付款信息详情',
            maxHeight: 650,
            width: 1250,
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center'
            },
            items: compArr
        });
        win.show(null, function () {
            var win = this;
            win.items.items.map(function (item, index) {
                var model = new CGP.orderitemsmultipleaddress.model.PayInfoModel(Ext.Object.merge({
                    isShowMore: false
                }, me.payInfoArr[index]));
                item.setValue(model.getData());
            });
        });
    },
    initComponent: function () {
        const me = this;
        me.items = [
            {
                xtype: 'splitBarTitle',
                margin: '10 0 5 3',
                itemId: 'splitBarTitle',
                title: '付款信息',
            },
        ];
        me.callParent();
    },
    /**
     * 添加查看付款时间线功能
     */
    addPayTimeLine: function () {
        var me = this;
        var toolbar = me.getComponent('splitBarTitle');
        var orderId = me.orderData._id;
        var addButton = {
            xtype: 'button',
            text: '付款时间线',
            iconCls: 'icon_check',
            handler: function (btn) {
                var timeLine = [];
                /*get /api/orders/{orderId}/payment/info/timeline*/
                var url = adminPath + `api/orders/${orderId}/payment/info/timeline`;
                JSAjaxRequest(url, 'GET', false, null, false, function (require, success, response) {
                    if (success) {
                        var responseText = Ext.JSON.decode(response.responseText);
                        if (responseText.success) {
                            responseText.data.map(function (item) {
                                var map = {
                                    /**
                                     * 生成订单
                                     */
                                    CREATE_ORDER: '生成订单',

                                    /**
                                     * 上传付款信息
                                     */
                                    UPLOAD_PAYMENT_INFO: '上传付款信息',

                                    /**
                                     * 修改付款信息
                                     */
                                    UPDATE_PAYMENT_INFO: '修改付款信息',

                                    /**
                                     * 确认付款成功
                                     */
                                    CONFIRMED_PAYMENT_INFO: '确认付款成功',

                                    /**
                                     * 修改订单
                                     */
                                    UPDATE_ORDER_STATUS: '修改订单'
                                };
                                timeLine[item.sortOrder] = {
                                    action: map[item.action],
                                    status: item.status.name,
                                    updateData: item.updateData,//上传的凭证信息
                                    time: Ext.Date.format(new Date(item.time), 'Y/m/d H:i'),
                                    sortOrder: item.sortOrder,
                                    //BackEnd  FrontEnd
                                    user: item.user ? (item.user.email + (item.user.type == 'BackEnd' ? '(后台用户)' : '(客户)')) : null
                                };
                            });
                        }
                    }
                }, true);
                var steps = [];
                timeLine.map(function (item) {
                    var updateData = item.updateData;
                    var extraInfo = [];
                    if (updateData) {
                        //处理use字段
                        //翻译
                        var map = {
                            remark: '备注',
                            transactionVouchers: '付款凭证',
                            transactionIds: '付款交易号',
                            user: '信息录入用户',
                            modifiedCurrency: '货币',
                            modifiedAmount: '实收金额',
                            modifiedAmountStr: '实收金额',
                            modifiedRemark: '实收金额少于订单总额的原因',
                            modifiedTime: '付款日期',
                        };
                        delete updateData.modifiedAmount;//不显示无货币符号的金额
                        //转换modifiedTime为日期格式
                        if (updateData.modifiedTime) {
                            updateData.modifiedTime = Ext.Date.format(new Date(updateData.modifiedTime), 'Y/m/d H:i');
                        }
                        for (var i in updateData) {
                            if (i == 'transactionVouchers') {
                                if (updateData[i].length > 0) {
                                    var images = [];
                                    updateData[i].map(function (image) {
                                        var fileName = image;
                                        var fileType = fileName.split('.').pop();
                                        var imageUrl = imageServer + fileName;
                                        if (fileType.toUpperCase() == 'PDF') {//处理pdf文件的情况
                                            //转为png后缀
                                            //https://dev-sz-qpson-nginx.qppdev.com/file/file/payment/transactionVouchers/2d40a02fbacc6c96e2f2982f89591fa1.png
                                            imageUrl = imageUrl.replace(/.pdf|.PDF/g, '.png');
                                        }
                                        images.push({
                                            xtype: 'imagedisplayfield',
                                            src: imageUrl
                                        });
                                    });

                                    extraInfo.push({
                                        xtype: 'fieldcontainer',
                                        fieldLabel: map[i],
                                        defaults: {
                                            margin: '0 5',
                                        },
                                        autoScroll: true,
                                        width: 450,
                                        layout: 'hbox',
                                        items: images
                                    });
                                }
                            } else {
                                extraInfo.push({
                                    xtype: 'displayfield',
                                    value: updateData[i],
                                    fieldLabel: map[i],
                                    width: 450,
                                });
                            }
                        }
                    }
                    var stepItem = {
                        xtype: 'step_item_container',
                        stepTitleConfig: {
                            xtype: 'container',
                            border: '2',
                            width: 500,
                            style: {
                                color: 'silver',
                                border: 'solid'
                            },
                            margin: 5,
                            layout: {
                                type: 'vbox',
                                align: 'top'
                            },
                            defaults: {
                                flex: 1,
                            },
                            items: [
                                {
                                    xtype: 'displayfield',
                                    width: 500,
                                    value: `<font style="white-space:normal;font-weight: bold">${item.time}</font>` + '<br>' +
                                        `<font style="white-space:normal;font-weight: bold">${item.action}</font>`,
                                },
                                {
                                    xtype: 'container',
                                    name: 'extraInfo',
                                    itemId: 'extraInfo',
                                    margin: '0 5',
                                    layout: {
                                        type: 'vbox',
                                        align: "center",
                                        pack: 'center'
                                    },
                                    width: 450,
                                    defaults: {
                                        margin: '0 0',
                                        fieldStyle: {
                                            textAlign: 'left'
                                        }
                                    },
                                    items: extraInfo,
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: '操作人',
                                    margin: '0 0',
                                    hidden: Ext.isEmpty(item.user),
                                    value: item.user
                                }
                            ]
                        },
                        stepItemV2Config: {},
                    };
                    steps.push(stepItem);
                });
                var win = Ext.create('Ext.window.Window', {
                    modal: true,
                    title: '付款时间线',
                    constrain: true,
                    autoScroll: true,
                    width: 650,
                    maxHeight: 600,
                    layout: 'auto',
                    items: [
                        {
                            xtype: 'step_bar_v2',
                            layout: 'vbox',
                            direct: 'vbox',
                            allowItemClick: true,
                            margin: '5 25',
                            width: '90%',
                            allowClickChangeProcess: false,
                            defaults: {},
                            stepItemContainerArr: steps,
                        },
                    ]
                });
                win.show();
            }
        };
        toolbar.add(addButton);
    }
})