Ext.define('CGP.materialviewtype.view.edit.PageContentConfig', {
    extend: 'Ext.form.Panel',
    layout: {
        type: 'table',
        columns: 1
    },
    bodyStyle: 'padding:10px',
    autoScroll: true,
    fieldDefaults: {
        labelAlign: 'right',
        width: 380,
        labelWidth: 120,
        msgTarget: 'side',
        validateOnChange: false,
        plugins: [
            {
                ptype: 'uxvalidation'
            }
        ]
    },

    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('pageContentConfig');
        var contentPageConfig = {
            xtype: 'cusfieldcontainer',
            labelAlign: 'top',
            colspan: 2,
            defaults: {
                labelAlign: 'right',
                margin: '3 0 3 20',
                width: 680
            },
            items: [
                {
                    fieldLabel: i18n.getKey('rangeType'),
                    xtype: 'combo',
                    valueField: 'value',
                    editable: false,
                    displayField: 'name',
                    queryMode: 'local',
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            'name', 'value'
                        ],
                        data: [
                            {name: 'Fix', value: 'FIX'},
                            {name: 'Range', value: 'RANGE'}
                        ]
                    }),
                    listeners: {
                        change: function (comp, newValue, oldValue) {
                            var fieldContainer = comp.ownerCt;
                            var maxExpression = fieldContainer.getComponent('maxExpression');
                            if (newValue == 'FIX' && maxExpression) {
                                fieldContainer.remove(maxExpression)
                            } else if (newValue == 'RANGE' && !maxExpression) {
                                fieldContainer.add(
                                    {
                                        fieldLabel: i18n.getKey('maxExpression'),
                                        xtype: 'textarea',
                                        itemId: 'maxExpression',
                                        name: 'maxExpression'
                                    }
                                )
                            }
                        }
                    },
                    value: 'RANGE',
                    name: 'rangeType'
                },
                {
                    fieldLabel: i18n.getKey('clazz'),
                    hidden: true,
                    value: 'com.qpp.cgp.domain.bom.QuantityRange',
                    xtype: 'textfield',
                    name: 'clazz'
                },
                {
                    fieldLabel: i18n.getKey('minExpression'),
                    xtype: 'textarea',
                    itemId: 'minExpression',
                    name: 'minExpression'
                },
                {
                    fieldLabel: i18n.getKey('maxExpression'),
                    xtype: 'textarea',
                    itemId: 'maxExpression',
                    name: 'maxExpression'
                }
            ],
            setValue: function (data) {
                var me = this;
                var items = me.items.items;
                if (!Ext.isEmpty(data)) {
                    Ext.Array.each(items, function (item) {
                        if (item) {
                            item.setValue(data[item.name]);
                        }
                    })
                }
            }
        };
        var pageContentRange = Ext.create('CGP.product.view.managerskuattribute.view.edit.CusFieldContainer', Ext.Object.merge(contentPageConfig, {
            itemId: 'pageContentRange',
            name: 'pageContentRange', fieldLabel: i18n.getKey('pageContentRange')
        }));
        me.items = [
            {
                name: 'pageContentStrategy',
                xtype: 'textfield',
                width: 350,
                itemId: 'pageContentStrategy',
                fieldLabel: i18n.getKey('pageContent Strategy')
            }, {
                name: 'pageContentFetchStrategy',
                xtype: 'combo',
                width: 350,
                editable: false,
                store: Ext.create('Ext.data.Store', {
                    fields: [{
                        name: 'name',
                        type: 'string'
                    }, {
                        name: 'value',
                        type: 'string'
                    }],
                    data: [{
                        name: 'fixed',
                        value: 'fixed'
                    }, {
                        name: 'mosaic',
                        value: 'mosaic'
                    }]
                }),
                value: 'fixed',
                displayField: 'name',
                valueField: 'value',
                itemId: 'pageContentFetchStrategy',
                fieldLabel: i18n.getKey('pageContent FetchStrategy')
            },
            pageContentRange
        ];
        me.callParent(arguments)
    },

    validateForm: function () {
        var me = this;
        if (!me.isValid()) {
            Ext.Msg.alert('WARN', 'Requeied infomation must not be blank!');
            // new Error('Requeied infomation must not be blank!');
        }
    },

    getValue: function () {
        var me = this;
        me.validateForm();
        var items = me.items.items;
        var data = {};
        Ext.Array.each(items, function (item) {
            data[item.name] = item.getValue();
        });
        return data;

    },

    refreshData: function (data) {
        var me = this;
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            item.setValue(data[item.name]);
        })
    },

    copy: function (data) {
        var me = this;
        me.getComponent('id').setValue("");
        data.id = null;
    }

});
