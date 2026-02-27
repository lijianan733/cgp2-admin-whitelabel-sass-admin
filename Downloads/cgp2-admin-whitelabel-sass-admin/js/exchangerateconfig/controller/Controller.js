/**
 * @author xiu
 * @date 2023/9/21
 */
Ext.define('CGP.exchangerateconfig.controller.Controller', {
    editQuery: function (url, jsonData, isEdit) {
        var data = [],
            method = isEdit ? 'PUT' : 'POST',
            successMsg = method === 'POST' ? 'addsuccessful' : 'saveSuccess';

        JSAjaxRequest(url, method, true, jsonData, successMsg, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText.data.content || responseText.data;
                }
            }
        }, true);
    },

    //异步修改存在加载动画
    asyncEditQuery: function (url, jsonData, isEdit, callFn, msg) {
        var method = isEdit ? 'PUT' : 'POST';

        JSAjaxRequest(url, method, true, jsonData, msg, callFn, true);
    },

    //查询
    getQuery: function (url) {
        var data = [];

        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText?.data?.content || responseText?.data;
                }
            }
        })
        return data;
    },

    //删除
    deleteQuery: function (url, callBack) {
        JSAjaxRequest(url, 'DELETE', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    callBack && callBack(responseText);
                    console.log(responseText.data.content || responseText.data);
                }
            }
        }, true)
    },

    createExchangeRateWin: function (record, grid, isEditPage, rowIndex) {
        var id = '',
            type = JSGetQueryString('type'),
            readOnly = JSGetQueryString('readOnly'),
            exchangeRateSetId = JSGetQueryString('_id'),
            controller = this,
            store = grid.store,
            isEdit = !!record,
            isCopy = type === 'copy',
            title = record ? '编辑' : '创建';

        isEdit && (id = record.get('_id'));

        return Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            title: i18n.getKey(title + '_汇率'),
            width: 400,
            diySetValue: function (data) {
                var me = this,
                    form = me.getComponent('form'),
                    items = form.items.items;

                items.forEach(item => {
                    var {name} = item;
                    item.diySetValue ? item.diySetValue(data[name]) : item.setValue(data[name]);
                })
            },
            diyGetValue: function () {
                var result = {},
                    me = this,
                    form = me.getComponent('form'),
                    items = form.items.items;
                items.forEach(item => {
                    var {name} = item;
                    result[name] = item.diyGetValue ? item.diyGetValue() : item.getValue();
                })
                return result;
            },
            items: [
                {
                    xtype: 'errorstrickform',
                    itemId: 'form',
                    layout: 'vbox',
                    useForEach: true,
                    isValidForItems: true,
                    defaults: {
                        margin: '10 25 5 25',
                        allowBlank: false,
                        labelWidth: 110,
                        width: '100%'
                    },
                    items: [
                        {
                            xtype: 'numberfield',
                            fieldLabel: i18n.getKey('id'),
                            name: 'id',
                            itemId: 'id',
                            hidden: true,
                            allowBlank: true,
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('clazz'),
                            name: 'clazz',
                            itemId: 'clazz',
                            hidden: true,
                            allowBlank: true,
                            value: 'com.qpp.cgp.domain.common.rate.ExchangeRate'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('exchangeRateSetId'),
                            name: 'exchangeRateSetId',
                            itemId: 'exchangeRateSetId',
                            hidden: true,
                            allowBlank: true,
                            value: exchangeRateSetId
                        },
                        {
                            xtype: 'combo',
                            name: 'inputCurrencyCode',
                            itemId: 'inputCurrencyCode',
                            fieldLabel: i18n.getKey('输入货币'),
                            editable: false,
                            allowBlank: false,
                            valueField: 'code',
                            displayField: 'displayNameV2',
                            labelWidth: 100,
                            store: Ext.create("CGP.currency.store.Currency", {
                                params: {
                                    filter: '[{"name":"website.id","value":11,"type":"number"}]'
                                },
                            })
                        },
                        {
                            xtype: 'combo',
                            name: 'outputCurrencyCode',
                            itemId: 'outputCurrencyCode',
                            fieldLabel: i18n.getKey('输出货币'),
                            editable: false,
                            allowBlank: false,
                            valueField: 'code',
                            labelWidth: 100,
                            displayField: 'displayNameV2',
                            store: Ext.create("CGP.currency.store.Currency", {
                                params: {
                                    filter: '[{"name":"website.id","value":11,"type":"number"}]'
                                },
                            })
                        },
                        {
                            xtype: 'minmaxfield',
                            name: 'exchangeRate',
                            itemId: 'exchangeRate',
                            fieldLabel: i18n.getKey('汇率'),
                            isEnable: false,
                            setInitConfig: function () {
                                var me = this,
                                    configGather = [
                                        {
                                            compName: 'min',
                                            emptyText: '输入货币'
                                        },
                                        {
                                            compName: 'mediateText',
                                            value: ' → '
                                        },
                                        {
                                            compName: 'max',
                                            emptyText: '输出货币'
                                        },
                                    ];
                                configGather.forEach(item => {
                                    var {compName, emptyText, value} = item,
                                        comp = me.getComponent(compName);

                                    emptyText && (comp.emptyText = emptyText);
                                    comp?.reset();
                                    value && comp?.setValue(value);
                                })
                            },
                            listeners: {
                                afterrender: function (comp) {
                                    comp.setInitConfig();
                                }
                            }
                        },
                    ]
                },
            ],
            listeners: {
                afterrender: function (win) {
                    if (record) {
                        win.diySetValue(record.data);
                    }
                }
            },
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    disabled: readOnly || isCopy,
                    getChangeData: function (data) {
                        var {
                                _id,
                                clazz,
                                outputCurrencyCode,
                                inputCurrencyCode,
                                exchangeRate,
                                exchangeRateSetId
                            } = data,
                            {min, max} = exchangeRate;

                        return {
                            _id,
                            clazz,
                            outputCurrencyCode,
                            inputCurrencyCode,
                            exchangeRateSetId,
                            inputRate: min,
                            outRate: max
                        }
                    },
                    getChangeDataV2: function (data) {
                        if (data) {
                            var {
                                _id,
                                clazz,
                                outputCurrencyCode,
                                inputCurrencyCode,
                                exchangeRateSetId,
                                inputRate,
                                outRate
                            } = data;

                            return {
                                _id,
                                clazz,
                                outputCurrencyCode,
                                inputCurrencyCode,
                                exchangeRateSetId,
                                exchangeRate: {
                                    min: inputRate,
                                    max: outRate,
                                }
                            }
                        }
                    },
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt,
                            url = adminPath + `api/exchangeRates/${id}`,
                            form = win.getComponent('form'),
                            formData = win.diyGetValue(),
                            result = btn.getChangeData(formData);

                        if (form.isValid()) {
                            if (isEditPage) {
                                controller.asyncEditQuery(url, result, isEdit, function (require, success, response) {
                                    if (success) {
                                        var responseText = Ext.JSON.decode(response.responseText);
                                        if (responseText.success) {
                                            const data = btn.getChangeDataV2(responseText.data);

                                            if (isEdit) {
                                                store.proxy.data.splice(rowIndex, 1, data);
                                            } else {
                                                store.proxy.data.push(data)
                                            }

                                            store.load();
                                            win.close();
                                        }
                                    }
                                })
                            } else {
                                if (isEdit) {
                                    store.proxy.data.splice(rowIndex, 1, formData);
                                } else {
                                    store.proxy.data.push(formData)
                                }
                                store.load();
                                win.close();
                            }
                        }
                    }
                }
            },
        }).show();
    },

    getCurrenciesDisplayName: function (currenciesData, filterCode) {
        var result = '';

        currenciesData.forEach(item => {
            var {code, title} = item;
            if (filterCode === code) {
                result = `${title} (${code})`;
            }
        })
        return result;
    },

    getRoundToFourDecimals: function (num) {
        // 检查是否为数字
        if (typeof num !== 'number') {
            throw new Error('输入必须是一个数字');
        }

        // 转换为字符串并分割小数部分
        const numStr = num.toString();
        const decimalIndex = numStr.indexOf('.');

        // 如果没有小数部分，直接返回
        if (decimalIndex === -1) {
            return num; // 不改变
        }

        // 获取小数部分
        const decimalPart = numStr.slice(decimalIndex + 1);

        // 判断小数位数
        if (decimalPart.length > 4) {
            // 四舍五入到四位小数
            return Math.round(num * 10000) / 10000;
        } else {
            // 不改变
            return num;
        }
    }
});