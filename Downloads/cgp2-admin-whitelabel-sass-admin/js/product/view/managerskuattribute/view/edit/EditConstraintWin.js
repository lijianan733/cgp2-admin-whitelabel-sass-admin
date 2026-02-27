Ext.Loader.syncRequire(['CGP.product.view.managerskuattribute.view.edit.CusFieldContainer',   'Ext.ux.form.field.MultiCombo'
,'CGP.product.view.managerskuattribute.model.SkuAttributeConstraint']);
Ext.define('CGP.product.view.managerskuattribute.view.edit.EditConstraintWin', {
    extend: 'Ext.form.Panel',
    closable: true,
    defaults: {
        width: 450,
        allowBlank: false
    },
    autoScroll: true,
    bodyStyle: 'padding:10px',
    id: 'editConstraint',

    initComponent: function () {
        var me = this;
        me.title = i18n.getKey(me.editOrNew) + i18n.getKey('constraint');
        if(!Ext.isEmpty(me.record)){
            me.title+= '('+me.record.getId()+')';
        }
        /*var skuAttributeStore = Ext.create('CGP.product.view.managerskuattribute.store.SkuAttribute', {
            configurableId: me.configurableId
        });
        skuAttributeStore.on('load', function () {
            skuAttributeStore.filter([
                {filterFn: function (item) {
                    return item.get("id") != me.skuAttributeId;
                }}
            ]);
        });*/
        var commonFiledContainer = {
            xtype: 'cusfieldcontainer',
            labelAlign: 'top',
            defaults: {
                labelAlign: 'right',
                margin: '3 0 3 20',
                width: 430
            },
            items: [
                {
                    fieldLabel: i18n.getKey('constraintValueType'),
                    xtype: 'combo',
                    valueField: 'value',
                    editable: false,
                    //value: !Ext.isEmpty(me.record.get('min')) ? me.record.get('min').clazz : null,
                    allowBlank: false,
                    displayField: 'name',
                    queryMode: 'local',
                    listeners: {
                        'change': function(comp,newValue,oldValue){
                            if(newValue == 'com.qpp.cgp.domain.product.attribute.constraint.LiteralAttributeConstraintValue'){
                                comp.ownerCt.getComponent('skuAttribute').setVisible(false);
                            }else{
                                comp.ownerCt.getComponent('skuAttribute').setVisible(true);
                            }
                        }
                    },
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            'name', 'value'
                        ],
                        data: [
                            {name: 'LiteralAttributeConstraintValue', value: 'com.qpp.cgp.domain.product.attribute.constraint.LiteralAttributeConstraintValue'},
                            {name: 'ExpressionAttributeConstraintValue', value: 'com.qpp.cgp.domain.product.attribute.constraint.ExpressionAttributeConstraintValue'},
                            {name: 'TableAttributeConstraintValue', value: 'com.qpp.cgp.domain.product.attribute.constraint.TableAttributeConstraintValue'}
                        ]
                    }),
                    name: 'clazz'
                },
                {
                    fieldLabel: i18n.getKey('constraintRelatedAttributes'),
                    xtype: 'multicombobox',
                    editable: false,
                    isHidden: true,
                    //value: [155740, 155741],
                    name: 'relatedAttributeIds',
                    valueField: 'id',
                    bottomToolbarHeight: 32,
                    store: Ext.create('CGP.product.view.managerskuattribute.store.SkuAttribute', {
                        listeners: {
                            load: function(store){
                                store.filter([
                                    {filterFn: function (item) {
                                        return item.get("id") != me.skuAttributeId;
                                    }}
                                ]);
                            }
                        },
                        configurableId: me.configurableId
                    }),
                    displayField: 'displayName',
                    itemId: 'skuAttribute'
                },
                {
                    fieldLabel: i18n.getKey('value'),
                    xtype: 'textarea',
                    height: 200,
                    //value: !Ext.isEmpty(me.record.get('min')) ? me.record.get('min').value : null,
                    allowBlank: false,
                    name: 'value'
                }
            ]
        };
        var min = Object.create(commonFiledContainer);
        min.fieldLabel = i18n.getKey('minConstraintValue');
        min.name = 'min';
        min.itemId = 'min';

        var max = Object.create(commonFiledContainer);
        max.fieldLabel = i18n.getKey('maxConstraintValue');
        max.name = 'max';
        max.itemId = 'max';

        var options = Object.create(commonFiledContainer);
        options.fieldLabel = i18n.getKey('optionConstraintValue');
        options.name = 'options';
        options.itemId = 'options';

        var regexTemplate = {
            xtype: 'textfield',
            fieldLabel: i18n.getKey('regexTemplate'),
            itemId: 'regexTemplate',
            allowBlank: true,
            name: 'regexTemplate'
        };

        var value = Object.create(commonFiledContainer);
        value.fieldLabel = i18n.getKey('value');
        value.name = 'value';
        value.itemId = 'value';

        var values = Ext.create("Ext.ux.form.GridField", {
            name: 'values',
            gridConfig: {
                selModel: new Ext.selection.RowModel({
                    mode: 'MULTI'
                }),
                store: Ext.create("Ext.data.Store", {
                    fields: [
                        {name: 'key', type: 'string'},
                        {name: 'value', type: 'object'}
                    ],
                    data: []
                }),
                minHeight: 200,
                width: 400,
                columns: [
                    {
                        xtype: 'actioncolumn',
                        itemId: 'actioncolumn',
                        width: 60,
                        sortable: false,
                        resizable: false,
                        menuDisabled: true,
                        items: [
                            {
                                iconCls: 'icon_edit icon_margin',
                                itemId: 'actionedit',
                                tooltip: 'Edit',
                                handler: function (view, rowIndex, colIndex) {
                                    var store = view.getStore();
                                    var record = store.getAt(rowIndex);
                                    me.controller.editRegexValue('edit',store, record,me.configurableId);
                                }
                            },
                            {
                                iconCls: 'icon_remove icon_margin',
                                itemId: 'actionremove',
                                tooltip: 'Remove',
                                handler: function (view, rowIndex, colIndex) {
                                    var store = view.getStore();
                                    store.removeAt(rowIndex);
                                }
                            }
                        ]
                    },
                    {
                        text: i18n.getKey('key'),
                        sortable: false,
                        dataIndex: 'key'
                    },
                    {
                        text: i18n.getKey('value'),
                        dataIndex: 'value',
                        sortable: false,
                        width: 230,
                        renderer:function(value,metadata){
                            var type = i18n.getKey('type') + '：'+value.clazz.split('.').pop();
                            var v = i18n.getKey('value')+'：'+value.value;
                            var result = type + '<br>' + v;
                            if(!Ext.isEmpty(value.relatedAttributeIds)){
                                var constraintRelatedAttributes = i18n.getKey('constraintRelatedAttributes')+'：'+value.relatedAttributeIds;
                                result += '<br>' + constraintRelatedAttributes;
                            }
                            metadata.tdAttr = 'data-qtip="' + result + '"';
                            return result;
                        }
                    }
                ],
                tbar: [
                    {
                        text: i18n.getKey('addValue'),
                        handler: function (comp) {
                            var store = comp.ownerCt.ownerCt.getStore();
                            me.controller.editRegexValue('new',store, null,me.configurableId);
                        }
                    }
                ]
            },
            fieldLabel: i18n.getKey('regexConstraintValueArr'),
            itemId: 'values'
        });
        me.listeners = {
            render: function (comp) {
                var constraintType = !Ext.isEmpty(me.record) ? me.record.get('clazz') : me.constraintType;
                if (constraintType == 'com.qpp.cgp.domain.product.attribute.constraint.RangeConstraint') {
                    comp.add(min, max);
                } else if (constraintType == 'com.qpp.cgp.domain.product.attribute.constraint.OptionConstraint') {
                    comp.add(options);
                } else if (constraintType == 'com.qpp.cgp.domain.product.attribute.constraint.RegexConstraint') {
                    comp.add(regexTemplate, values);
                }
                var items = comp.items.items;
                if (!Ext.isEmpty(me.record)) {
                    Ext.Array.each(items, function (item) {
                        if(item.name == 'values'){
                            if(!item.rendered){
                                item.on('render',function(){
                                    item.setSubmitValue(me.record.get(item.name));
                                });
                            }
                        }else{
                            item.setValue(me.record.get(item.name));
                        }
                    });
                }
                //comp.getComponent('selectConstraintType').setValue(constraintType);
            }
        };
        me.items = [
            {
                xtype: 'textfield',
                fieldLabel: i18n.getKey('id'),
                hidden: true,
                itemId: 'id',
                value: !Ext.isEmpty(me.record) ? me.record.get('_id') : null,
                allowBlank: true,
                name: '_id'
            },
            {
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('skuAttributeId'),
                hidden: true,
                value: me.skuAttributeId,
                itemId: 'skuAttributeId',
                allowBlank: true,
                name: 'skuAttributeId'
            },
            {
                xtype: 'combo',
                allowBlank: false,
                readOnly: true,
                fieldStyle: 'background-color:silver',
                name: 'clazz',
                value: !Ext.isEmpty(me.record) ? me.record.get('clazz') : me.constraintType,
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        {name: 'name', type: 'string'},
                        {name: 'value', type: 'string'}
                    ],
                    data: [
                        {
                            name: 'RangeConstraint',
                            value: 'com.qpp.cgp.domain.product.attribute.constraint.RangeConstraint'
                        },
                        {
                            name: 'OptionConstraint',
                            value: 'com.qpp.cgp.domain.product.attribute.constraint.OptionConstraint'
                        },
                        {
                            name: 'RegexConstraint',
                            value: 'com.qpp.cgp.domain.product.attribute.constraint.RegexConstraint'
                        }
                    ]
                }),
                valueField: 'value',
                displayField: 'name',
                fieldLabel: i18n.getKey('type'),
                queryMode: 'local',
                itemId: 'selectConstraintType'
            },
            {
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name',
                value: !Ext.isEmpty(me.record) ? me.record.get('name') : null,
                name: 'name'
            },
            {
                xtype: 'textarea',
                fieldLabel: i18n.getKey('messageTemplate'),
                value: !Ext.isEmpty(me.record) ? me.record.get('messageTemplate') : null,
                itemId: 'messageTemplate',
                name: 'messageTemplate'
            }
        ];
        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('save'),
                iconCls : 'icon_save',
                handler: function () {
                    if (me.form.isValid()) {
                        var formItems = me.items.items;
                        var data = {};

                        Ext.Array.each(formItems, function (item) {
                            if(item.name == 'values'){
                                data.values = item.getSubmitValue()
                            }else{
                                data[item.name] = item.getValue();
                            }
                        });
                        if (!Ext.isEmpty(data._id)) {
                            me.controller.updateContraint(me, me.selectTypeWin, me.store, data);
                        } else {
                            delete data._id;
                            me.controller.createContraint(me, me.selectTypeWin, me.store, data);
                        }
                    }
                }
            },{
                xtype: 'button',
                itemId: 'btnReset',
                text: i18n.getKey('reset'),
                iconCls: 'icon_reset',
                handler: function(){
                    var items = me.items.items;
                    if (!Ext.isEmpty(me.record)) {
                        var model = Ext.ModelManager.getModel("CGP.product.view.managerskuattribute.model.SkuAttributeConstraint");
                        model.load(me.record.getId(),{
                            success : function(record, operation){
                                model = record;
                                Ext.Array.each(items, function (item) {
                                    if(item.name == 'values'){
                                        item.setSubmitValue(model.get(item.name));
                                    }else{
                                        item.setValue(model.get(item.name));
                                    }
                                });
                            }
                        });
                    }
                }
            }
        ];
        me.callParent(arguments);
        //me.form = me.down('form');
    }
});