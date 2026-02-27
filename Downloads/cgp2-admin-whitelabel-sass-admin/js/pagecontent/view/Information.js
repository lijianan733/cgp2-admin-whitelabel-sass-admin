/**
 * Created by nan on 2020/8/24.
 */
Ext.Loader.syncRequire([]);
Ext.define('CGP.pagecontent.view.Information', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    alias: 'widget.information',
    padding: '10 30 10 30',
    title: i18n.getKey('information'),
    defaults: {
        width: 400,
        labelAlign: 'left',
        labelWidth: 100
    },
    isValidForItems: true,//是否校验时用item.forEach来处理
    itemId: 'information',
    initComponent: function () {
        var me = this;
        var pageContentSchemaStore = Ext.create('CGP.materialviewtype.store.PageContentSchema');
        me.items = [
            {
                name: 'generateMode',
                xtype: 'combo',
                valueField: 'value',
                displayField: 'display',
                editable: false,
                store: Ext.create('Ext.data.Store', {
                    fields: ['value', 'display'],
                    data: [{
                        value: 'auto',
                        display: '自动创建'
                    }, {
                        value: 'manual',
                        display: '人工创建'
                    }]
                }),
                hidden: true,
                allowBlank: true,
                value: 'manual',
                fieldLabel: i18n.getKey('generateMode'),
                itemId: 'generateMode'
            },
            {
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name'
            },
            {
                name: 'description',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('description'),
                itemId: 'description'
            }, {
                name: 'code',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('code'),
                itemId: 'code'
            },
            {
                name: 'index',
                fieldLabel: i18n.getKey('index'),
                xtype: 'numberfield',
            },
            {
                name: 'templateId',
                fieldLabel: i18n.getKey('templateId'),
                xtype: 'numberfield',
                hideTrigger: true,
                itemId: 'templateId'
            },
            {
                name: "pageContentSchemaId",
                id: 'pageContentSchemaId',
                fieldLabel: i18n.getKey('pageContent Schema'),
                itemId: 'pageContentSchemaId',
                allowBlank: true,
                xtype: 'singlegridcombo',
                displayField: 'name',
                valueField: '_id',
                editable: false,
                matchFieldWidth: false,
                multiSelect: false,
                autoScroll: true,
                store: pageContentSchemaStore,
                filterCfg: {
                    height: 80,
                    layout: {
                        type: 'column',
                        columns: 2
                    },
                    fieldDefaults: {
                        labelAlign: 'right',
                        layout: 'anchor',
                        width: 200,
                        style: 'margin-right:20px; margin-top : 5px;',
                        labelWidth: 50
                    },
                    items: [
                        {
                            name: '_id',
                            xtype: 'textfield',
                            isLike: false,
                            fieldLabel: i18n.getKey('id'),
                            itemId: 'id'
                        },
                        {
                            name: 'name',
                            xtype: 'textfield',
                            isLike: false,
                            fieldLabel: i18n.getKey('name'),
                            itemId: 'name'
                        }
                    ]
                },
                gridCfg: {
                    store: pageContentSchemaStore,
                    height: 300,
                    width: 450,
                    viewConfig: {
                        enableTextSelection: true
                    },
                    autoScroll: true,
                    columns: [
                        {
                            xtype: 'rownumberer',
                            width: 50
                        },
                        {
                            text: i18n.getKey('id'),
                            width: 80,
                            dataIndex: '_id',
                            renderer: function (value, metaData) {
                                metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                return value;
                            }
                        },
                        {
                            text: i18n.getKey('name'),
                            flex: 1,
                            dataIndex: 'name',
                            renderer: function (value, metaData, record, rowIndex) {
                                metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                return value
                            }
                        }
                    ],
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: pageContentSchemaStore,
                        displayInfo: true, // 是否 ? 示， 分 ? 信息
                        displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                        emptyMsg: i18n.getKey('noData')
                    })
                }
            },
            {
                name: 'width',
                fieldLabel: i18n.getKey('width'),
                xtype: 'numberfield',
                hideTrigger: true,
                itemId: 'width',
                allowBlank: false
            },
            {
                name: 'height',
                fieldLabel: i18n.getKey('height'),
                xtype: 'numberfield',
                hideTrigger: true,
                itemId: 'height',
                allowBlank: false
            },
            {
                name: 'clipPath',
                xtype: 'shapeconfigfieldset',
                title: i18n.getKey('clipPath'),
                itemId: 'clipPath',
                labelAlign: 'top',
                minHeight: 0,
                onlySubProperty: true,
            },
            {
                xtype: 'textfield',
                itemId: 'clazz',
                name: 'clazz',
                hidden: true,
                value: 'com.qpp.cgp.domain.bom.runtime.PageContent'
            }
        ];
        me.callParent(arguments);

    },
    refreshData: function (data) {
        var me = this;
        Ext.Array.each(me.items.items, function (item) {
            if (item.xtype == 'gridfield') {
                data[item.name] = item.setSubmitValue();
            } else {
                item.setValue(data[item.name]);
            }
        });

    }
});
