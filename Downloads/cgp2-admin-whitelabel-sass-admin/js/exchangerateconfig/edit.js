Ext.Loader.syncRequire([
    'CGP.exchangerateconfig.model.ExchangeRateConfig',
    'Ext.ux.form.field.MinMaxField'
]);

Ext.onReady(function () {
    var id = JSGetQueryString('_id') || '',
        type = JSGetQueryString('type'),
        readOnly = JSGetQueryString('readOnly'),
        controller = Ext.create('CGP.exchangerateconfig.controller.Controller'),
        url = adminPath + 'api/currencies?page=1&limit=1000&filter=[{"name":"website.id","type":"number","value":11}]',
        currenciesData = controller.getQuery(url),
        isEdit = type === 'edit',
        noCreate = type !== 'create',
        isCopy = type === 'copy',
        saveText = isCopy ? i18n.getKey('拷贝') : i18n.getKey('保存');

    Ext.widget({
        block: 'exchangerateconfig',
        xtype: 'uxeditpage',
        gridPage: 'main.html',
        tbarCfg: {
            hiddenButtons: ['config', 'create', 'copy'],
            btnSave: {
                width: 80,
                text: JSCreateFont('red', true, saveText),
                disabled: readOnly,
                handler: function (btn) {
                    var tools = btn.ownerCt,
                        form = tools.ownerCt,
                        page = form.ownerCt,
                        getValue = form.diyGetValue(),
                        result = page.copyExchangeRates(getValue),
                        url = adminPath + (isEdit ? `api/exchangeRateSets/${id}` : 'api/exchangeRateSets');

                    console.log(result);
                    if (form.isValid()) {
                        controller.asyncEditQuery(url, result, isEdit, function (require, success, response) {
                            if (success) {
                                var responseText = Ext.JSON.decode(response.responseText);
                                if (responseText.success) {
                                    var data = responseText.data,
                                        dataId = data['_id'];
                                    console.log(responseText.data);
                                    Ext.Msg.alert('提示', '保存成功!', function () {
                                        if (!isEdit) {
                                            JSOpen({
                                                id: 'edit_exchangerateconfig',
                                                url: path + `partials/exchangerateconfig/edit.html?_id=${dataId}&type=edit`,
                                                refresh: true,
                                                title: i18n.getKey(`编辑_汇率配置<` + dataId + '>')
                                            });
                                        }
                                    })
                                }
                            }
                        }, false)
                    }
                }
            },
            btnReset: {
                disabled: readOnly,
                handler: function (btn) {
                    var me = this,
                        tools = me.ownerCt,
                        form = tools.ownerCt;

                    form.getForm().reset();
                }
            },
            btnGrid: {
                handler: function (btn) {
                    JSOpen({
                        id: 'exchangerateconfigpage',
                        url: path + `partials/exchangerateconfig/main.html`,
                        refresh: true,
                        title: i18n.getKey('汇率配置')
                    });
                }
            },
            btnHelp: {
                text: JSCreateFont('green', true, '( 拷贝预览中,拷贝后可进行编辑 )'),
                iconCls: '',
                hidden: !isCopy,
                componentCls: 'btnOnlyIcon',
                handler: function (btn) {

                }
            }
        },
        copyExchangeRates: function (data) {
            var {exchangeRates} = data;
            isCopy && exchangeRates.forEach(item => {
                delete item._id;
            })
            return data;
        },
        setReadOnly: function (readOnly) {
            var me = this,
                form = me.getComponent('form'),
                items = form.items.items;
            items.forEach(item => {
                item.setReadOnly && item.setReadOnly(readOnly)
            })
        },
        setEditStyle: function () {
            var me = this,
                form = me.getComponent('form'),
                compStatusGather = [
                    {
                        compName: 'version',
                        visible: isEdit,
                        disabled: !isEdit,
                        readOnly: true,
                        fieldStyle: 'background-color: silver',
                    },
                    {
                        compName: 'status',
                        readOnly: !isEdit,
                        visible: !isCopy,
                        disabled: false,
                        fieldStyle: isEdit ? '' : 'background-color: silver',
                    },
                ]

            compStatusGather.forEach(item => {
                var {
                        compName,
                        visible,
                        disabled,
                        readOnly,
                        fieldStyle
                    } = item,
                    comp = form.getComponent(compName);

                comp.setVisible(visible);
                comp.setDisabled(disabled);
                comp.setReadOnly(readOnly);
                comp.setFieldStyle(fieldStyle);
            })
        },
        setEditData: function () {
            var me = this,
                form = me.getComponent('form'),
                url = adminPath + `api/exchangeRateSets/${id}`,
                queryData = controller.getQuery(url);

            queryData && form.diySetValue(queryData);
        },
        formCfg: {
            model: 'CGP.exchangerateconfig.model.ExchangeRateConfig',
            remoteCfg: false,
            layout: 'vbox',
            getIsEditValue: function (getValue) {
                var result = {},
                    {version, status, id, exchangeRates, description} = getValue;

                if (isEdit) {
                    result = {
                        id: id,
                        clazz: 'com.qpp.cgp.domain.common.rate.ExchangeRate',
                        status: status,
                        description: description,
                        exchangeRates: exchangeRates,
                    };
                } else {
                    result = {
                        status: status,
                        clazz: 'com.qpp.cgp.domain.common.rate.ExchangeRate',
                        description: description,
                        exchangeRates: exchangeRates
                    };
                }
                return result;
            },
            diyGetValue: function () {
                var me = this,
                    getValue = {},
                    items = me.items.items;

                items.forEach(item => {
                    var {name, itemId} = item;
                    getValue[itemId] = item.diyGetValue ? item.diyGetValue() : item.getValue();
                })

                return me.getIsEditValue(getValue);
            },
            diySetValue: function (data) {
                var me = this,
                    items = me.items.items;

                items.forEach(item => {
                    var {name, itemId} = item;
                    item.diySetValue ? item.diySetValue(data[itemId]) : item.setValue(data[itemId]);
                })
            },
            items: [
                {
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('id'),
                    name: 'id',
                    itemId: 'id',
                    hidden: true,
                },
                {
                    xtype: 'numberfield',
                    name: 'version',
                    itemId: 'version',
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('汇率套'),
                },
                {
                    xtype: 'combo',
                    name: 'status',
                    itemId: 'status',
                    fieldLabel: i18n.getKey('状态'),
                    editable: false,
                    allowBlank: false,
                    valueField: 'value',
                    displayField: 'display',
                    value: 'TEST',
                    store: {
                        fields: ['value', 'display'],
                        data: [
                            {
                                value: 'TEST',
                                display: i18n.getKey('测试')
                            },
                            {
                                value: 'RELEASE',
                                display: i18n.getKey('上线')
                            }
                        ]
                    }
                },
                {
                    xtype: 'textarea',
                    fieldLabel: i18n.getKey('描述'),
                    height: 60,
                    name: 'description',
                    itemId: 'description',
                },
                {
                    xtype: 'gridfieldwithcrudv2',
                    name: 'exchangeRates',
                    itemId: 'exchangeRates',
                    allowBlank: false,
                    fieldLabel: i18n.getKey('汇率'),
                    width: 800,
                    maxHeight: 400,
                    autoScroll: true,
                    readOnly: isCopy || readOnly,
                    diyGetValue: function () {
                        var me = this,
                            getValue = me.getSubmitValue(),
                            result = getValue.map(item => {
                                var {
                                        _id,
                                        clazz,
                                        outputCurrencyCode,
                                        inputCurrencyCode,
                                        exchangeRateSetId,
                                        exchangeRate,
                                    } = item,
                                    {min, max} = exchangeRate,
                                    result = {
                                        _id,
                                        clazz,
                                        outputCurrencyCode,
                                        inputCurrencyCode,
                                        inputRate: min,
                                        outRate: max
                                    }

                                exchangeRateSetId && (result['exchangeRateSetId'] = exchangeRateSetId);

                                return result;
                            })

                        return result;
                    },
                    diySetValue: function (data) {
                        if (data) {
                            var me = this,
                                store = me._grid.store,
                                result = data.map(item => {
                                    var {
                                        _id,
                                        clazz,
                                        outputCurrencyCode,
                                        inputCurrencyCode,
                                        exchangeRateSetId,
                                        inputRate,
                                        outRate
                                    } = item;

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
                                });
                            console.log(data);

                            store.proxy.data = result;
                            store.load();
                        }
                    },
                    gridConfig: {
                        addHandler: function (btn) {
                            var view = btn.ownerCt.ownerCt
                            controller.createExchangeRateWin(null, view, isEdit);
                        },
                        editHandler: function (view, rowIndex, colIndex, event, el, record) {
                            controller.createExchangeRateWin(record, view, isEdit, rowIndex);
                        },
                        deleteHandler: function (view, rowIndex, colIndex, event, el, record) {
                            var store = view.getStore(),
                                id = record.get('_id'),
                                url = adminPath + `api/exchangeRates/${id}`;

                            Ext.Msg.confirm('提示', '确定删除？', function callback(id) {
                                if (id === 'yes') {
                                    if (noCreate) {
                                        controller.deleteQuery(url, function () {
                                            store.proxy.data.splice(rowIndex, 1);
                                            store.load();
                                        })
                                    } else {
                                        store.proxy.data.splice(rowIndex, 1);
                                        store.load();
                                    }
                                }
                            });
                        },
                        store: {
                            fields: [
                                {
                                    name: '_id',
                                    type: 'number',
                                    useNull: true
                                },
                                {
                                    name: 'exchangeRateSetId',
                                    type: 'string',
                                    defaultValue: id
                                },
                                {
                                    name: 'clazz',
                                    type: 'string',
                                    defaultValue: 'com.qpp.cgp.domain.common.rate.ExchangeRate'
                                },
                                {
                                    name: 'inputCurrencyCode',
                                    type: 'string',
                                },
                                {
                                    name: 'inputCurrencyDisplayName',
                                    type: 'string',
                                    convert: function (value, record) {
                                        var code = record.get('inputCurrencyCode');
                                        return controller.getCurrenciesDisplayName(currenciesData, code);
                                    }
                                },
                                {
                                    name: 'outputCurrencyCode',
                                    type: 'string',
                                },
                                {
                                    name: 'outputCurrencyDisplayName',
                                    type: 'string',
                                    convert: function (value, record) {
                                        var code = record.get('outputCurrencyCode');
                                        return controller.getCurrenciesDisplayName(currenciesData, code);
                                    }
                                },
                                {
                                    name: 'exchangeRate',
                                    type: 'object',
                                }
                            ],
                            data: []
                        },
                        autoScroll: true,
                        columns: [
                            {
                                xtype: 'rownumberer',
                                autoSizeColumn: false,
                                width: 30,
                                resizable: true,
                                menuDisabled: true,
                                tdCls: 'vertical-middle',
                            },
                            {
                                text: i18n.getKey('id'),
                                dataIndex: '_id',
                                width: 100,
                                align: 'center',
                                sortable: false
                            },
                            {
                                text: i18n.getKey('输入货币'),
                                dataIndex: 'inputCurrencyDisplayName',
                                width: 180,
                                align: 'center',
                                sortable: false
                            },
                            {
                                text: i18n.getKey('输出货币'),
                                dataIndex: 'outputCurrencyDisplayName',
                                width: 180,
                                align: 'center',
                                sortable: false
                            },
                            {
                                text: i18n.getKey('汇率'),
                                dataIndex: 'exchangeRate',
                                flex: 1,
                                align: 'center',
                                sortable: false,
                                renderer: function (value) {
                                    var {min, max} = value,
                                        exchangeRate = controller.getRoundToFourDecimals(max / min);

                                    return `${min} → ${max}`;
                                }
                            },
                        ]
                    },
                    winConfig: {
                        layout: 'fit',
                        formConfig: {
                            xtype: 'errorstrickform',
                            layout: 'vbox',
                            width: 400,
                            useForEach: true,
                            isValidForItems: true,
                            defaults: {
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
                                    xtype: 'combo',
                                    name: 'inputCurrencyCode',
                                    itemId: 'inputCurrencyCode',
                                    fieldLabel: i18n.getKey('输入货币'),
                                    editable: false,
                                    allowBlank: false,
                                    labelWidth: 100,
                                    valueField: 'code',
                                    displayField: 'displayNameV2',
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
                                    labelWidth: 100,
                                    valueField: 'code',
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
                        }
                    },
                }
            ],
            listeners: {
                afterrender: function (comp) {
                    var page = comp.ownerCt
                    page.setEditStyle();
                    noCreate && page.setEditData();
                    readOnly && page.setReadOnly(readOnly);
                }
            }
        },
    });
});
