Ext.Loader.syncRequire(['CGP.product.view.managerskuattribute.view.edit.CusFieldContainer', 'Ext.ux.form.field.MultiCombo']);
Ext.define('CGP.product.view.managerskuattribute.view.edit.EditRegexValue',{
    extend: 'Ext.window.Window',
    modal: true,
    width: 500,
    layout: 'fit',
    initComponent: function(){
        var me = this;
        var skuAttributeStore = Ext.create('CGP.product.view.managerskuattribute.store.SkuAttribute', {
            configurableId: me.configurableId
        });
        me.title = i18n.getKey(me.editOrNew)+i18n.getKey('regexConstraintValue');
        me.items = [{
            xtype: 'form',
            header: false,
            padding: 10,
            border: false,
            listeners: {
                render: function(comp){
                    var items = comp.items.items;
                    if(!Ext.isEmpty(me.record)){
                        Ext.Array.each(items,function(item){
                            item.on('render',function(){
                                item.setValue(me.record.get(item.name));
                            })
                        })
                    }
                }
            },
            items: [
                {
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('key'),
                    itemId: 'key',
                    width: 450,
                    //value: !Ext.isEmpty(me.record) ? me.record.get('_id') : null,
                    allowBlank: false,
                    name: 'key'

                },{
                    xtype: 'cusfieldcontainer',
                    labelAlign: 'top',
                    fieldLabel: i18n.getKey('value'),
                    name: 'value',
                    itemId: 'value',
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
                            store: skuAttributeStore,
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
                }
            ]
        }];
        me.bbar = [
            '->',{
                xtype: 'button',
                text: i18n.getKey('confirm'),
                handler: function(){
                    var items = me.form.items.items;
                    var data = {};
                    if(me.form.isValid()){
                        if(!Ext.isEmpty(me.record)){
                            Ext.Array.each(items,function(item){
                                me.record.set(item.name,item.getValue());
                            });
                        }else{
                            Ext.Array.each(items,function(item){
                                data[item.name] = item.getValue();
                            });
                            me.store.add(data);
                        }
                        me.close();

                    }
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                handler: function(){
                    me.close();
                }
            }
        ];
        me.callParent(arguments);
        me.form = me.down('form');
    }
});