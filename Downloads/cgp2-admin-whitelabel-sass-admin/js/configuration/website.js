/**
 *
 */
Ext.Loader.syncRequire([
    'CGP.language.model.LanguageModel',
    'CGP.cmsconfig.view.CatalogGridCombo'
]);
Ext.onReady(function () {


    var store = Ext.data.StoreManager.lookup('configStore');
    // 提交和重置按钮
    var tbar = Ext.create('Ext.toolbar.Toolbar', {
        items: [
            {
                itemId: 'btnSave', text: i18n.getKey('Save'),
                iconCls: 'icon_save', handler: modify,
                style: {
                    marginLeft: '15px'
                }
            },
            {
                itemId: 'btnReset', text: i18n.getKey('reset'),
                iconCls: 'icon_reset', handler: reset
            }
        ]
    });

    // 下面两个方法是按钮触发的保存和重置方法

    function modify() {
        //var values = Ext.Object.getValues(page.getValues());
        var fields = page.getForm().getFields().items;
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            if (field.fieldLabel == "默认语言" || field.fieldLabel == "默认货币") {
                var record = store.getById(field.id);
                //alert(values[i]);
                record.set('value', field.getSubmitValue()[0]);
                record.save();
                record.commit();
            } else {
                var record = store.getAt(field.itemId);
                if (field.getValue() != record.get('value').toString()) {
                    record.set('value', field.getValue().toString());
                    record.save();
                    record.commit();
                }
            }
            /* var record=  store.getById(field.id);
             //alert(values[i]);
             record.set('value',field.getSubmitValue()[0]);
             record.save();
             record.commit();*/
        }
        store.sync();
        Ext.MessageBox.alert(i18n.getKey('prompt'), i18n.getKey('savesuccess') + "!");
    }

    function reset() {
        var values = [];
        for (var i = 0; i < (store.getCount()); i++) {
            var conf = store.getAt(i);
            id = conf.get('id');
            value = conf.get('value');
            values.push({
                id: id,
                value: value
            });
        }
        page.getForm().setValues(values);
    }

    var mask;
    var page = Ext.create('Ext.form.Panel', {
        title: i18n.getKey("Website setting"),
        height: 400,
        width: 500,
        autoScroll: true,
        region: 'center',
        frame: false,
        defaults: {
            allowBlank: false,
            blankText: 'this value is required',
            style: {
                marginLeft: '20px',
                marginTop: '5px'
            },
            msgTarget: 'side'
        },
        tbar: tbar,
        layout: {
            type: 'table',
            columns: 1
        },
        items: [
//			{
//			colspan : 1,
//			xtype : 'label',
//			html : '<div style="height:50px;line-height:50px;margin-left:20px;' +
//					'font-size:18px;">'+ getQueryString("website") +': website default currency</div>'
//		}
        ],
        listeners: {
            render: function (panel) {
                mask = panel.setLoading(true);
            }
        }
    });

    new Ext.container.Viewport({
        layout: 'border',
        renderTo: 'jie',
        items: [page]
    });


    // 货币选项的combo，和绑定的store
    //var currencyStore = Ext.data.StoreManager.lookup('currencyStore');
    var currencyStore = Ext.create('Ext.data.Store', {
        //storeId : 'currencyStore',
        model: 'CGP.currency.model.Currency',
        remoteSort: false,
        pageSize: 25,
        proxy: {
            type: 'uxrest',
            url: adminPath + 'api/currencies',
            reader: {
                type: 'json',
                root: 'data.content'
            },
            extraParams: {
                filter: Ext.JSON.encode([
                    {name: 'website.id', value: Number(getQueryString("websiteId")), type: 'number'}
                ])
            }
        },
        autoLoad: true
    });
    // 语言的store 绑定到combo
    var languageStore = Ext.create('Ext.data.Store', {
        model: 'CGP.language.model.LanguageModel',
        remoteSort: false,
        pageSize: 25,
        proxy: {
            type: 'uxrest',
            url: adminPath + 'api/languages',
            reader: {
                type: 'json',
                root: 'data.content'
            }
        },
        autoLoad: true
    });
    //定义一个值为true or  false 的store
    var yesOrNo = Ext.create('Ext.data.Store', {
        fields: ['type', 'value'],
        data: [
            {type: '是', value: 'true'},
            {type: '否', value: 'false'}
        ]
    });
    var defaultCurrency = new Ext.form.field.GridComboBox({
        fieldLabel: i18n.getKey('default') + i18n.getKey('currency'),
        store: currencyStore,
        valueField: 'id',
        displayField: 'title',
        multiSelect: false,
        width: 380,
        allowBlank: false,
        forceSelection: true,
        autoScroll: true,
        labelWidth: 100,
        queryMode: 'remote',
        gridCfg: {
            store: currencyStore,
            height: 200,
            width: '100%',
            columns: [
                {
                    text: i18n.getKey('title'),
                    width: '50%',
                    dataIndex: 'title'
                },
                {
                    text: i18n.getKey('code'),
                    width: '49%',
                    dataIndex: 'code'
                }
            ],
            bbar: Ext.create('Ext.PagingToolbar', {
                store: currencyStore,
                displayInfo: true,
                displayMsg: 'Displaying {0} - {1} of {2}',
                emptyMsg: i18n.getKey('noData')
            })
        }
    });

    var defaultLanguage = new Ext.form.field.GridComboBox({
        fieldLabel: i18n.getKey('default') + i18n.getKey('language'),
        store: languageStore,
        valueField: 'id',
        displayField: 'name',
        multiSelect: false,
        width: 380,
        allowBlank: false,
        forceSelection: true,
        labelWidth: 100,
        autoScroll: true,
        matchFieldWidth: false,
        queryMode: 'remote',
        gridCfg: {
            store: languageStore,
            width: 500,
            height: 200,
            autoScroll: true,
            columns: [{
                text: i18n.getKey('id'),
                dataIndex: 'id',
                xtype: 'gridcolumn',
                itemId: 'id',
                sortable: true
            }, {
                text: i18n.getKey('name'),
                dataIndex: 'name',
                xtype: 'gridcolumn',
                itemId: 'name',
                sortable: true
            }, {
                text: i18n.getKey('locale'),
                dataIndex: 'locale',
                xtype: 'gridcolumn',
                itemId: 'locale',
                sortable: true,
                renderer: function (v) {
                    if (v) {
                        return v.name + '(' + v.code + ')';
                    }
                }
            }, {
                text: i18n.getKey('code'),
                dataIndex: 'code',
                xtype: 'gridcolumn',
                itemId: 'code',
                sortable: true,
                renderer: function (v) {
                    return v.code;
                }
            }],
            bbar: Ext.create('Ext.PagingToolbar', {
                store: languageStore,
                displayInfo: true,
                displayMsg: '',
                emptyMsg: i18n.getKey('noData')
            })
        }
    });
    var verificationEnabled = Ext.create('Ext.form.field.ComboBox', {
        fieldLabel: i18n.getKey('language'),
        store: yesOrNo,
        valueField: 'value',
        displayField: 'type',
        multiSelect: false,
        width: 380,
        allowBlank: false,
        forceSelection: true,
        labelWidth: 100,
        queryMode: 'local'
    })

    function fillComboField(field, config, store, fieldName) {
        field.name = config.get('key');
        var submitValue = config.get('value');
        var title = null;
        store.load({
            callback: function () {
                store.each(function (record) {
                    if (record.get('id') == Number(submitValue)) {
                        title = record.get(fieldName);
                    }
                });
                // combo,的值是stirng的int的数字设置不进去，所以用了model数组。
                var o = {};
                if (fieldName == 'title') {
                    o[1] = {id: Number(submitValue), title: title};
                } else if (fieldName == 'name') {
                    o[1] = {id: Number(submitValue), name: title};
                }
                field.setValue(o);
                field.id = config.get('id');
                if (i18n.getKey(field.fieldLabel) != null && i18n.getKey(field.fieldLabel) != '')
                    field.fieldLabel = i18n.getKey(field.fieldLabel);
                page.insert(/*0,*/field);
            }
        })

    }

    function addFieldText(records) {
        for (var i = 0; i < records.length; i++) {
            var fieldtext = new Ext.form.field.Text({
                fieldLabel: records[i].get('title'),
                allowBlank: false,
                width: 350,
                blankText: 'this value is required',
                value: records[i].get('value'),
                name: records[i].get('id'),
                itemId: i
            });
            page.add(fieldtext);
        }
    }


    // JS的去url的参数的方法，用来页面间传参
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    };

    store.load({
        params: {groupId: 4, website: '' + getQueryString("website") + ''},
        callback: function (records, options, success) {
            mask.hide();
            for (var i = 0; i < records.length; i++) {
                if (records[i].get('title') == '默认货币') {
                    fillComboField(defaultCurrency, records[i], currencyStore, 'title');
                } else if (records[i].get('title') == '默认语言') {
                    fillComboField(defaultLanguage, records[i], languageStore, 'name');
                } else if (records[i].get('title') == 'log配置') {
                    var fieldtext = new Ext.form.field.TextArea({
                        fieldLabel: records[i].get('title'),
                        allowBlank: false,
                        width: 500,
                        height: 300,
                        blankText: 'this value is required',
                        value: records[i].get('value'),
                        autoScroll: true,
                        name: records[i].get('id'),
                        itemId: i
                    });
                    page.add(fieldtext);
                } else if (records[i].get('title') == 'website base currency') {
                    var baseCurrencyCombo = Ext.widget('combo', {
                        store: currencyStore,
                        valueField: 'id',
                        displayField: 'title',
                        fieldLabel: 'website base currency',
                        allowBlank: false,
                        width: 850,
                        itemId: i,
                        tipInfo: '产品售价所使用的价格单位',
                        editable: false,
                        value: parseInt(records[i].get('value'))
                    });
                    page.add(baseCurrencyCombo);
                } else if (records[i].get('title') == '基础分类' || records[i].get('title') == '基础分类（stage）') {
                    var catalog = Ext.widget('catalog_gridcombo', {
                        gotoConfigHandler: undefined,
                        productType: null,
                        itemId: i,
                        name: records[i].get('id'),
                        fieldLabel: records[i].get('title'),
                        listeners: {
                            afterrender: function () {
                                var me = this;
                                if (records[i].get('value')) {
                                    me.setInitialValue([records[i].get('value')])
                                }
                            }
                        }
                    });
                    page.add(catalog);
                } else {
                    var fieldtext = new Ext.form.field.TextArea({
                        fieldLabel: records[i].get('title'),
                        allowBlank: false,
                        width: 850,
                        grow: true,
                        growMax: 350,
                        blankText: 'this value is required',
                        value: records[i].get('value'),
                        name: records[i].get('id'),
                        itemId: i
                    });
                    page.insert(/*2,*/fieldtext);
                }
            }
        }
    });

});

