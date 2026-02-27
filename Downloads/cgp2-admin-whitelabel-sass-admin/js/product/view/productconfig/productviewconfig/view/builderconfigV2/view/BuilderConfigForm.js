/**
 * Created by nan on 2020/11/6
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productviewconfig.view.builderconfigV2.model.BuilderConfigModel'
])
Ext.define('CGP.product.view.productconfig.productviewconfig.view.builderconfigV2.view.BuilderConfigForm', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    alias: 'widget.builderconfigform',
    defaults: {
        margin: '5 25 5 25',
    },
    localData: {
        defaultUrl: null,
        productBuilderConfigs: null
    },
    setValue: function (data) {
        var me = this;
        me.localData = {
            defaultUrl: data.defaultUrl,
            productBuilderConfigs: data.productBuilderConfigs

        }
        if (me.rendered) {
            var defaultUrl = me.getComponent('defaultUrl');
            defaultUrl.diySetValue(data.defaultUrl);
            var productBuilderConfigs = me.getComponent('productBuilderConfigs');
            productBuilderConfigs.setSubmitValue(data.productBuilderConfigs);
        } else {
            me.on('afterrender', function () {
                var defaultUrl = me.getComponent('defaultUrl');
                defaultUrl.diySetValue(me.localData.defaultUrl);
                var productBuilderConfigs = me.getComponent('productBuilderConfigs');
                productBuilderConfigs.setSubmitValue(me.localData.productBuilderConfigs);
            })
        }
    },
    getValue: function () {
        var me = this;
        var result = {};
        if (me.rendered == true) {
            result = {
                defaultUrl: me.getComponent('defaultUrl').getArrayValue(),
                productBuilderConfigs: me.getComponent('productBuilderConfigs').getSubmitValue(),
            }
        } else {
            result = me.localData;
        }
        return result;
    },
    isValid: function () {
        var me = this;
        return true;
    }
    ,
    initComponent: function () {
        var me = this;
        var languageStore = Ext.create('CGP.language.store.LanguageStore', {
            autoLoad: false,
        })
        var builderViewVersion = me.builderViewVersion;
        Ext.define('builderGridField', {
            extend: 'Ext.form.field.GridComboBox',
            alias: 'widget.builderGridField',
            allowBlank: false,
            multiSelect: false,
            displayField: 'builderName',
            valueField: '_id',
            languageValue: null,
            editable: false,
            matchFieldWidth: false,
            diySetValue: function (data) {
                var me = this;
                if (data) {
                    me.setInitialValue([data._id]);
                }
            },
            filterCfg: {
                height: 80,
                layout: {
                    type: 'column',
                    columns: 3
                },
                fieldDefaults: {
                    width: 250,
                    labelAlign: 'right',
                    layout: 'anchor',
                    style: 'margin-right:20px; margin-top : 5px;',
                    labelWidth: 100,
                },
                items: [
                    {
                        name: '_id',
                        xtype: 'textfield',
                        isLike: false,
                        fieldLabel: i18n.getKey('id'),
                        itemId: 'id',
                    },
                    {
                        name: 'builderName',
                        xtype: 'textfield',
                        isLike: false,
                        fieldLabel: i18n.getKey('builderName'),
                        itemId: 'builderName'
                    },
                    {
                        name: 'builderVersion',
                        xtype: 'textfield',
                        isLike: false,
                        fieldLabel: i18n.getKey('builderVersion'),
                        itemId: 'builderVersion'
                    },

                ]
            },
            value: builderViewVersion == 'V3' ? {
                //默认配置
                builderName: "QP电商通用Builder-V3",
                clazz: "com.qpp.cgp.domain.product.config.v2.builder.SystemBuilderConfigV2",
                _id: "19060214"
            } : {
                //默认配置
                builderName: "QP电商通用Builder",
                clazz: "com.qpp.cgp.domain.product.config.v2.builder.SystemBuilderConfigV2",
                _id: "15051102"
            },
            initComponent: function () {
                var me = this;
                var systemBuilderStore = Ext.create('CGP.buildermanage.store.ConfigStore', {
                    listeners: {
                        load: function (store) {
                            store.filterBy(function (record, id) {
                                var supportBuilderViewSchemaVersion = record.get('schemaVersion').supportBuilderViewSchemaVersion;
                                return Ext.Array.contains(supportBuilderViewSchemaVersion, builderViewVersion)
                            })
                        }
                    },
                    model: 'CGP.product.view.productconfig.productviewconfig.view.builderconfigV2.model.BuilderConfigModel'
                });
                me.store = systemBuilderStore;
                me.listConfig = {};
                me.gridCfg = {
                    height: 350,
                    width: 650,
                    viewConfig: {
                        enableTextSelection: true
                    },
                    listeners: {
                        //GridCombo中id的跳转,遍历事件冒泡的元素列表，看是否包含指定类型的元素
                        beforeselect: function (rowMode, record, rowIndex) {
                           ;
                            var isAllow = true;
                            for (var i = 0; i < event.path.length; i++) {
                                var item = event.path[i];
                                var tagName = item.tagName;
                                //不再往后传递
                                if (tagName == 'HTML') {
                                    break;
                                }
                                var clazz = item.getAttribute('class');
                                if (clazz && clazz.indexOf('x-grid-cell-builderId') != -1) {
                                    isAllow = false;
                                    break;
                                }
                            }
                            return isAllow;
                        },
                    },
                    columns: [
                        {
                            text: i18n.getKey('id'),
                            dataIndex: '_id',
                            itemId: 'builderId',
                            xtype: 'componentcolumn',
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip=查看Builder';
                                return {
                                    xtype: 'displayfield',
                                    value: '<a href="#")>' + value + '</a>',
                                    listeners: {
                                        render: function (display) {
                                            var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                            var ela = Ext.fly(a); //获取到a元素的element封装对象
                                            ela.on("click", function () {
                                                JSOpen({
                                                    id: 'buildermanagerpage',
                                                    url: path + 'partials/buildermanage/main.html?_id=' + value,
                                                    title: i18n.getKey('builder') + i18n.getKey('manager'),
                                                    refresh: true
                                                });

                                            });
                                        }
                                    }
                                };
                            }
                        },
                        {
                            text: i18n.getKey('builderName'),
                            dataIndex: 'builderName',
                            itemId: 'builderName',
                            width: 400,

                        },
                        {
                            text: i18n.getKey('builderVersion'),
                            dataIndex: 'builderVersion',
                            itemId: 'builderVersion',
                            flex: 1,
                        }
                    ],
                    bbar: {
                        store: systemBuilderStore,
                        xtype: 'pagingtoolbar',
                        displayInfo: true,  //是否显示，分页信息
                        displayMsg: 'Displaying {0} - {1} of {2}', //显示的分页信息
                        emptyMsg: i18n.getKey('noData')
                    }
                };
                me.callParent();
            }
        });
        me.items = [
            {
                xtype: 'builderGridField',
                name: 'defaultUrl',
                itemId: 'defaultUrl',
                width: 500,
                haveReset: true,
                allowBlank: true,
                fieldLabel: i18n.getKey('default') + i18n.getKey('builder'),
            },
            {
                xtype: 'gridfieldwithcrud',
                colspan: 2,
                fieldLabel: i18n.getKey('多语言builder配置'),
                name: 'productBuilderConfigs',
                itemId: 'productBuilderConfigs',
                valueSource: 'storeData',
                width: 800,
                height: 400,
                msgTarget: 'side',
                allowBlank: true,
                saveHandler: function (btn) {
                    var form = btn.ownerCt.ownerCt;
                    var win = form.ownerCt;
                    if (form.isValid()) {
                        var data = {};
                        var language = form.getComponent('language');
                        var builder = form.getComponent('builder');
                        var font = form.getComponent('font');
                        var fontData = font.getValue();
                        data = {
                            language: language.getArrayValue(),
                            builder: builder.getArrayValue(),
                            defaultFont: fontData.defaultFont,
                            resourceConfigType: fontData.resourceConfigType,
                            supportFonts: fontData.supportFonts,
                        };
                        if (win.createOrEdit == 'create') {
                            win.outGrid.store.add(data);
                        } else {
                            //直接修改proxy.data
                            for (var i in data) {
                                win.record.set(i, data[i]);
                            }
                        }
                        win.close();
                    }
                },
                setValueHandler: function (data) {
                    var win = this;
                    data = Ext.clone(data);
                    var newData = {
                        language: data.language,
                        builder: data.builder,
                        font: {
                            defaultFont: data.defaultFont,
                            resourceConfigType: data.resourceConfigType,
                            supportFonts: data.supportFonts
                        }
                    }
                    var form = win.getComponent('form');
                    form.items.items.forEach(function (item) {
                        if (item.disabled == false) {
                            if (item.diySetValue) {
                                item.diySetValue(newData[item.getName()]);
                            } else {
                                item.setValue(newData[item.getName()]);
                            }
                        }
                    })
                },
                gridConfig: {
                    autoScroll: true,
                    height: 400,
                    renderTo: JSGetUUID(),
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            {
                                name: 'language',
                                type: 'object'
                            },
                            {
                                name: 'builder',
                                type: 'object'
                            }, {
                                name: 'defaultFont',
                                type: 'object'
                            },
                            {
                                name: 'resourceConfigType',
                                type: 'string',
                                convert: function (value, record) {
                                    if (Ext.isEmpty(value)) {
                                        return null;
                                    } else {
                                        return value;
                                    }
                                }
                            }, {
                                name: 'supportFonts',
                                type: 'array'
                            }
                        ],
                        proxy: {
                            type: 'memory',
                        }
                    }),
                    columns: [
                        {
                            text: i18n.getKey('language'),
                            dataIndex: 'language',
                            tdCls: 'vertical-middle',
                            itemId: 'language',
                            width: 150,
                            renderer: function (value, mateData, record) {
                                return value.name;
                            }
                        },
                        {
                            text: i18n.getKey('builder'),
                            dataIndex: 'builder',
                            tdCls: 'vertical-middle',
                            itemId: 'builder',
                            flex: 2,
                            renderer: function (value) {
                                if (value) {
                                    return JSAutoWordWrapStr(value.builderName);
                                }
                            }
                        }, {
                            text: i18n.getKey('default') + i18n.getKey('font'),
                            dataIndex: 'defaultFont',
                            tdCls: 'vertical-middle',
                            itemId: 'defaultFont',
                            flex: 1,
                            renderer: function (value) {
                                return value.displayName;
                            }
                        }]
                },
                formConfig: {
                    width: 760,
                    defaults: {
                        width: '90%',
                        margin: '0 25 10 25'
                    }
                },
                formItems: [
                    {
                        name: 'language',
                        xtype: 'gridcombo',
                        fieldLabel: i18n.getKey('language'),
                        allowBlank: false,
                        itemId: 'language',
                        displayField: 'name',
                        valueField: 'id',
                        width: 450,
                        msgTarget: 'side',
                        store: languageStore,
                        matchFieldWidth: false,
                        editable: false,
                        multiSelect: false,
                        gridCfg: {
                            store: languageStore,
                            height: 280,
                            width: 600,
                            columns: [
                                {
                                    text: i18n.getKey('id'),
                                    dataIndex: 'id',
                                    xtype: 'gridcolumn',
                                    itemId: 'id',
                                }, {
                                    text: i18n.getKey('name'),
                                    dataIndex: 'name',
                                    xtype: 'gridcolumn',
                                    itemId: 'name',
                                }, {
                                    text: i18n.getKey('locale'),
                                    dataIndex: 'locale',
                                    xtype: 'gridcolumn',
                                    itemId: 'locale',
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
                                    renderer: function (v) {
                                        return v.code;
                                    }
                                }, {
                                    text: i18n.getKey('image'),
                                    dataIndex: 'image',
                                    xtype: 'gridcolumn',
                                    minWidth: 120,
                                    flex: 1,
                                    itemId: 'image',
                                    renderer: function (v) {
                                        var url = imageServer + v + '/64/64/png';
                                        return '<img src="' + url + '" />';
                                    }
                                }
                            ],
                            bbar: {
                                xtype: 'pagingtoolbar',
                                store: languageStore,
                                displayInfo: true,
                                width: 275,
                                displayMsg: '',
                                emptyMsg: i18n.getKey('noData')
                            }
                        },
                        listeners: {
                            change: function (gridCombo, newValue, oldValue) {
                                var builder = gridCombo.ownerCt.getComponent('builder');
                                if (newValue) {
                                    builder.setDisabled(false);
                                    if (!Ext.isEmpty(oldValue)) {

                                    }
                                }
                            },
                            afterrender: function () {
                                var gridField = this;
                                var win = gridField.ownerCt.ownerCt;
                                var outGrid = win.outGrid;
                                var excludeIds = [];
                                if (Ext.isEmpty(win.record)) {
                                    for (var i = 0; i < outGrid.store.data.items.length; i++) {
                                        excludeIds.push(outGrid.store.data.items[0].raw.language.id);
                                    }
                                    gridField.store.proxy.extraParams = {
                                        filter: Ext.JSON.encode([{
                                            name: 'excludeIds',
                                            type: 'number',
                                            value: '[' + excludeIds.toString() + ']'
                                        }])
                                    }
                                    gridField.store.load();
                                } else {
                                    gridField.setReadOnly(true);
                                    gridField.setFieldStyle('background-color: silver');
                                }
                            }
                        }
                    },
                    {
                        xtype: 'builderGridField',
                        name: 'builder',
                        width: 450,
                        disabled: true,
                        allowBlank: false,
                        itemId: 'builder',
                        fieldLabel: i18n.getKey('builder') + i18n.getKey('address'),
                    },
                    {
                        xtype: 'commonfontfieldset',
                        title: i18n.getKey('font'),
                        itemId: 'font',
                        name: 'font',
                        allowBlank: true,
                        padding: '0 25 0 25',
                        legendItemConfig: {
                            disabledBtn: {
                                hidden: true,
                                disabled: false,
                                isUsable: true,//初始化时，是否是禁用
                            }
                        },
                    }
                ]
            }
        ]
        me.callParent();
    }
})
