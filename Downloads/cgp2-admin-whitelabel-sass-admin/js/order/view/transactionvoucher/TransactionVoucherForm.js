/**
 * @author nan
 * @date 2025/12/3
 * @description TODO
 */

Ext.Loader.syncRequire([
    'CGP.order.view.transactionvoucher.model.CurrencyModel'
])
Ext.define('CGP.order.view.transactionvoucher.TransactionVoucherForm', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    alias: 'widget.transaction_voucher_form',
    itemId: 'form',
    defaults: {
        width: 450,
        margin: '5 0',
        allowBlank: true,
    },
    isValidForItems: true,
    currency: null,//货币信息
    totalPriceString: null,//需付款金额
    orderId: null,//订单号
    order: null,//订单记录
    paymentModuleCode: 'BankTransfer',//线下付款才有该配置
    isConfirmed: false,//是否默认通过审核，这个在生产详细那里用到
    platformId: null,
    billCurrencyCode:null,//账单货币
    getName: function () {
        return this.name;
    },
    diySetValue: function (data) {
        var me = this;
        if (data) {
            var diyData = {
                currencyCode: data.modifiedCurrency,
                amount: data.modifiedAmount,
                modifiedRemark: data.modifiedRemark,
                transactionIds: data.transactionIds,
                transactionVouchers: data.transactionVouchers,
                remark: data.remark
            };
            for (var key in diyData) {
                var comp = me.down(`[itemId=${key}]`);
                var value = diyData[key];
                if (comp.diySetValue) {
                    comp.diySetValue(value);
                } else {
                    comp.setValue(value);
                }
            }
        }
    },
    getErrors: function () {
        return '相关信息不完备';
    },
    getFieldLabel: function () {
        return '线下付款信息';
    },
    /**
     * 根据环境获取的对于的1平台，然后根据平台获取对于的货币
     * @returns {*}
     */
    getCurrencyInfo: function () {
        var me = this;
        var isProduction = JSWebsiteIsStage();
        var url = adminPath + 'api/platform/v2?page=1&start=0&limit=1000';
        var platformArr = [];
        var result = [];
        JSAjaxRequest(url, "GET", false, null, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    platformArr = responseText.data.content;
                }
            }
        }, true);
        var platformId = '';//平台id
        var scope = 'Backend';
        var code = 'QPMN';
        var mode = isProduction ? 'Production' : 'Stage';
        platformArr.map(function (item) {
            if (item.code == code && item.mode == mode) {
                platformId = item.id;
            }
        });
        me.platformId = platformId;
        var url2 = adminPath + `api/platformCurrencySettings/platform/${platformId}/scope/${scope}?page=1&start=0&limit=1000`;
        JSAjaxRequest(url2, "GET", false, null, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    result = responseText.data.currencies;
                }
            }
        }, true);
        return result;
    },
    /**
     * 切换币种，计算需付的金额
     */
    getSwitchCurrency: function (price, currencyCode, targetCurrencyCode, decimalPlaces = 2) {
        var me = this;
        var platformId = me.platformId;
        var url = adminPath + `api/platform/${platformId}/currency/exchange`;
        var result = '';
        var jsonData = {
            "price": price,
            "currencyCode": currencyCode,
            "targetCurrencyCode": targetCurrencyCode,
            "decimalPlaces": decimalPlaces
        };
        JSAjaxRequest(url, "POST", false, jsonData, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    result = responseText.data;
                }
            }
        }, true);
        return result;
    },
    isValid: function () {
        var me = this;
        this.msgPanel.hide();
        var isValid = true,
            errors = {};
        if (me.disabled == true) {
            return true;
        }
        this.items.items.forEach(function (f) {
            if (!f.isValid()) {
                var errorInfo = f.getErrors();
                if (Ext.isObject(errorInfo) && !Ext.Object.isEmpty(errorInfo)) {//处理uxfieldContainer的错误信息
                    errors = Ext.Object.merge(errors, errorInfo);
                } else {
                    errors[f.getFieldLabel()] = errorInfo;
                }
                isValid = false;
            }
        });
        var val1 = me.getComponent('transactionVouchers').diyGetValue();
        var val2 = me.getComponent('transactionIds').diyGetValue();
        if (Ext.isEmpty(val1) && Ext.isEmpty(val2)) {
            isValid = false;
            errors['提示'] = '付款交易号或者付款凭证必须至少填写一项';
        }
        isValid ? null : this.showErrors(errors);
        return isValid;
    },
    /**
     * 如果已经录入过付款凭证，把之前录入的凭证
     */
    setLastPayInfo: function () {
        //https://sz-nginx-test1.qppdev.com/cgp-rest/
        //if (record.get('transactionType') == 'BackEnd') BackEnd使用CGP后台上传，FrontEnd前端销售网站删除
        var me = this;
        var record = me.order;
        var offlinePaymentStatus = record.get('offlinePaymentStatus')
        if (offlinePaymentStatus && offlinePaymentStatus.code == 'WAITING_CONFIRM_STATUS') {//待审核状态
            var url = adminPath + `api/orders/${me.orderId}/paymentRecords`;
            JSAjaxRequest(url, "GET", true, null, null, function (require, success, response) {
                if (success) {
                    var responseText = Ext.JSON.decode(response.responseText);
                    if (responseText.success) {
                        var payInfoArr = responseText.data;
                        me.diySetValue(payInfoArr[0]);
                    }
                }
            }, true);
        }
    },
    initComponent: function () {
        var me = this;
        var needPayAmount = me.totalPriceString.replace(me.currency.symbol, '');//需付款金额
        var currencyData = me.getCurrencyInfo();

        me.items = [
            {
                xtype: 'displayfield',
                name: 'price',
                itemId: 'price',
                fieldStyle: 'color: red;font-weight: bold;',//设置文本框的样式
                value: me.totalPriceString,
                fieldLabel: '订单总额',
            },
            {
                xtype: 'hiddenfield',
                name: 'modifiedCurrency',
                itemId: 'modifiedCurrency',
                value: me.currency.code,
            },
            {
                xtype: 'uxfieldcontainer',
                fieldLabel: '实收金额',
                width: '100%',
                defaults: {},
                allowBlank: false,
                labelAlign: 'left',
                itemId: 'modifiedAmount',
                name: 'modifiedAmount',
                diyGetValue: function () {
                    return this.getComponent('amount').getValue();
                },
                layout: {
                    type: 'hbox'
                },
                items: [
                    {
                        xtype: 'combo',
                        itemId: 'currencyCode',
                        name: 'currencyCode',
                        valueField: 'code',
                        displayField: 'code',
                        titleField: 'title',
                        allowBlank: false,
                        editable: false,
                        width: 100,
                        emptyText: '货币',
                        value: me.currency.code,
                        store: {
                            xtype: 'store',
                            model: 'CGP.order.view.transactionvoucher.model.CurrencyModel',
                            data: currencyData,
                            proxy: {
                                type: 'memory'
                            }
                        },
                        diySetValue: function (data) {
                            var me = this;
                            me.setValue(data);
                        },
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                var fieldContainer = field.ownerCt;
                                var form = fieldContainer.ownerCt;
                                var amount = fieldContainer.getComponent('amount');
                                var modifiedAmount2 = form.getComponent('modifiedCurrency');
                                modifiedAmount2.setValue(newValue);

                                //更新应收金额为当前货币类型的金额
                                var info = fieldContainer.getComponent('info');
                                var newNeedPayAmount = form.getSwitchCurrency(needPayAmount, me.currency.code, newValue);
                                var record = field.store.findRecord('code', newValue);
                                info.setValue(`(应收：${record.get('symbolLeft')}${newNeedPayAmount})`);
                                info.needPayAmount = newNeedPayAmount;
                                //切换币种，计算实收金额
                                amount.setValue(newNeedPayAmount);

                            }
                        }
                    },
                    {
                        xtype: 'numberfield',
                        allowDecimals: true,
                        width: 150,
                        maskRe: /[\d,\.]/,//只能输入数值
                        decimalPrecision: 2,//这里设置保留2为小数
                        hideTrigger: true,
                        allowBlank: false,
                        step: 0,
                        minValue: 0,
                        emptyText: '实收金额',
                        name: 'amount',
                        itemId: 'amount',
                        margin: '0 5 0 5',
                        value: needPayAmount,
                        checkChangeOnBlur: true,
                        delayedTask: null,
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                var me = this;
                                var form = me.ownerCt.ownerCt;
                                var infoField = me.ownerCt.getComponent('info');
                                var modifiedRemark = form.getComponent('modifiedRemark');
                                var needPayAmount = infoField.needPayAmount;
                                //小于
                                modifiedRemark.setVisible(newValue < needPayAmount);
                                modifiedRemark.setDisabled(!(newValue < needPayAmount));

                            }
                        }
                    },
                    {
                        xtype: 'displayfield',
                        width: 200,
                        itemId: 'info',
                        needPayAmount: needPayAmount,
                        fieldStyle: 'color: red;font-weight: bold;',//设置文本框的样式
                        value: `(应收：${me.totalPriceString})`
                    }
                ],
                getErrors: function () {
                    return {
                        实收金额: '该输入项为必输项'
                    };
                }
            },
            {
                xtype: 'textarea',
                fieldLabel: '实收金额少于应收金额的原因',
                itemId: 'modifiedRemark',
                name: 'modifiedRemark',
                allowBlank: false,
                disabled: true,
                hidden: true,
                height: 80,
            },
            {
                xtype: 'datetimefield',
                itemId: 'modifiedTime',
                name: 'modifiedTime',
                editable: false,
                fieldLabel: '付款日期',
                format: 'Y-m-d H:i:s',
                allowBlank: false,
                value: new Date(),
                diyGetValue: function () {
                    //返回时间戳
                    return this.getValue().getTime();
                }
            },
            {
                xtype: 'hiddenfield',
                name: 'orderId',
                itemId: 'orderId',
                fieldLabel: 'orderId',
                value: me.orderId
            },
            {
                xtype: 'arraydatafield',
                fieldLabel: '付款交易号',
                itemId: 'transactionIds',
                name: 'transactionIds',
                resultType: 'Array',
                diyInputComponent: {
                    xtype: 'textfield',
                    margin: '5 25',
                    flex: 1,
                    width: '100%',
                    emptyText: '付款交易号',
                }
            },
            {
                xtype: 'componentgrid',
                itemId: 'transactionVouchers',
                name: 'transactionVouchers',
                flex: 1,
                isField: true,
                width: '100%',
                maxHeight: 350,
                margin: '5 0',
                header: {
                    style: 'background-color:white;',
                    color: 'black',
                    title: '<font color=black style="font-weight:normal">' + i18n.getKey('付款凭证:') + '</font>',
                    border: '0 0 0 0'
                },
                store: Ext.create('Ext.data.Store', {
                    xtype: 'store',
                    fields: [
                        'fileName',
                    ],
                    proxy: {
                        type: 'pagingmemory'
                    },
                    data: []
                }),
                autoScroll: true,
                componentViewCfg: {
                    multiSelect: false,
                    tableAlign: 'left',
                    actionBarCfg: {
                        hidden: true,
                    },//编辑和删除的区域配置
                    renderer: function (record, view) {
                        var index = record.index + 1;
                        var title = '<font style="font-weight: bold">凭证：'
                            + index + ' &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;</font>';
                        //"https://dev-sz-qpson-nginx.qppdev.com/file/file/payment/transactionVouchers/06e524587a8729d90552c3ea16c23a3b.svg"
                        var fileName = record.get('fileName');
                        var fileType = fileName.split('.').pop();
                        var imageUrl = imageServer + (record.get('fileName'));
                        if (fileType.toUpperCase() == 'PDF') {//处理pdf文件的情况
                            //转为png后缀
                            //https://dev-sz-qpson-nginx.qppdev.com/file/file/payment/transactionVouchers/2d40a02fbacc6c96e2f2982f89591fa1.png
                            imageUrl = imageUrl.replace(/.pdf|.PDF/g, '.png');
                        }
                        return {
                            xtype: 'uxfieldset',
                            layout: {
                                type: 'vbox',
                                align: 'center',
                                pack: 'center'
                            },
                            border: false,
                            title: title,
                            margin: '0 5',
                            legendItemConfig: {
                                deleteBtn: {
                                    hidden: false,
                                    disabled: false,
                                    handler: function () {
                                        Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (selector) {
                                            if (selector == 'yes') {
                                                var store = record.store;
                                                store.proxy.data.splice(index - 1, 1);
                                                store.remove(record);
                                            }
                                        });
                                    }
                                }
                            },

                            items: [
                                {
                                    xtype: 'imagedisplayfield',
                                    src: imageUrl,
                                    autoEl: 'div',
                                    style: 'cursor: pointer',
                                    title: i18n.getKey('check') + i18n.getKey('图片')
                                }
                            ]
                        };
                    }
                },
                tbarCfg: {
                    btnCreate: {
                        text: '添加',
                        handler: function (btn) {
                            var componentGrid = btn.ownerCt.ownerCt.ownerCt;
                            var win = Ext.create('Ext.window.Window', {
                                modal: true,
                                constrain: true,
                                title: '选择文件',
                                items: [
                                    {
                                        xtype: 'form',
                                        itemId: 'fileUpload',
                                        border: false,
                                        width: 500,
                                        height: 130,
                                        layout: 'fit',
                                        items: [
                                            {
                                                xtype: 'uxfilefield',
                                                labelAlign: 'right',
                                                name: 'file',
                                                onlyImage: true,
                                                allowBlank: false,
                                                margin: '5 25',
                                                buttonText: i18n.getKey('选择'),
                                                fieldLabel: i18n.getKey('文件'),
                                                buttonConfig: {
                                                    width: 70
                                                },
                                                itemId: 'file'
                                            }
                                        ]
                                    }
                                ],
                                bbar: {
                                    xtype: 'bottomtoolbar',
                                    saveBtnCfg: {
                                        handler: function (btn) {
                                            var win = btn.ownerCt.ownerCt;
                                            var form = win.getComponent('fileUpload');
                                            var fileField = form.getComponent('file');
                                            //将items转为htmlform
                                            win.mask();
                                            form.getForm().submit({
                                                url: imageServer + 'uploadv2?dirName=/payment/transactionVouchers',
                                                success: function (form, action) {
                                                    win.unmask();
                                                    var errorInfo = [];
                                                    var fileValidData = [];
                                                    action.response.map(function (item) {
                                                        //判断哪些上传成功了
                                                        if (item.Success) {
                                                            fileValidData.push(item.data);
                                                        } else {
                                                            //记录报错信息
                                                            if (item.ErrMsg) {
                                                                errorInfo.push(item.ErrMsg);
                                                            } else {
                                                                const {data} = item,
                                                                    {exceptionDetails} = data;
                                                                exceptionDetails?.forEach(messageItem => {
                                                                    errorInfo.push(messageItem['message']);
                                                                });
                                                            }
                                                        }
                                                    });

                                                    //报错处理
                                                    if (errorInfo.length > 0) {
                                                        fileField.reset();//重置组件的值
                                                        Ext.Msg.alert(i18n.getKey('prompt'), errorInfo.join('\n'));
                                                    }
                                                    if (fileValidData.length > 0) {
                                                        console.log(fileValidData);
                                                        fileValidData.map(function (item) {
                                                            componentGrid.store.proxy.data.push({
                                                                fileName: item.fileName
                                                            });
                                                        });
                                                        componentGrid.store.load();
                                                    }
                                                    //成功继续执行
                                                    win.close();
                                                },
                                                failure: function (form, action) {
                                                    win.unmask();
                                                    var msg = action?.response?.data?.message || '上传失败';
                                                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey(msg));
                                                }
                                            });
                                        },
                                    }
                                }
                            });
                            win.show();
                        }
                    },
                    btnDelete: {
                        hidden: true,
                    },
                    btnImport: {
                        hidden: true,
                    },
                    btnExport: {
                        hidden: true,
                    },
                },
                filterCfg: {
                    hidden: true,
                },
                diyGetValue: function () {
                    var me = this;
                    var data = [];
                    me.store.data.items.map(function (record) {
                        data.push(record.get('fileName'));
                    });
                    return data;
                },
                diySetValue: function (data = []) {
                    var me = this;
                    var arr = data.map(function (item) {
                        return {
                            fileName: item
                        }
                    });

                    me.store.proxy.data = arr;
                    me.store.load();
                },
                getName: function () {
                    return this.name;
                },
                isValid: function () {
                    return true;
                }
            },
            {
                xtype: 'checkbox',
                name: 'isConfirmed',
                itemId: 'isConfirmed',
                fieldLabel: '是否通过审核',
                checked: me.isConfirmed,
                tipInfo: '勾选该项后,默认录入的数据已经是正确,无需再审核;<br>订单状态将继续向下流转为：已付款(待审核)',
                hidden: me.isConfirmed == true,//如果默认通过审核，就隐藏
            },
            {
                xtype: 'textarea',
                name: 'remark',
                itemId: 'remark',
                fieldLabel: '备注',
                height: 80,
                validateBlank: true,
            },
        ];
        me.callParent();
        me.on('afterrender', function () {
            if (me.isConfirmed == true) {//生产详细那里
                me.setLastPayInfo();
            }
        });
    },
})